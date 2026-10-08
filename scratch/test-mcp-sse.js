const express = require('express');
const http = require('http');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');

const app = express();
const server = new Server({ name: "Test-MCP-SSE", version: "1.0.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{ name: "ping", description: "Ping test", inputSchema: { type: "object", properties: {} } }]
}));

const transports = new Map();

app.get('/sse', async (req, res) => {
  console.log('New SSE connection request');
  const transport = new SSEServerTransport('/api/mcp/message', res);
  transports.set(transport.sessionId, transport);
  res.on('close', () => {
    console.log('SSE connection closed for session:', transport.sessionId);
    transports.delete(transport.sessionId);
  });
  await server.connect(transport);
});

app.post('/api/mcp/message', async (req, res) => {
  const sessionId = req.query.sessionId;
  console.log('Received POST message for session:', sessionId);
  const transport = transports.get(sessionId);
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).json({ error: 'Session not found' });
  }
});

const listener = app.listen(3009, async () => {
  console.log('Test SSE MCP server running on port 3009');

  // Test client GET /sse
  http.get('http://localhost:3009/sse', (res) => {
    console.log('Client connected to /sse with status:', res.statusCode);
    let sseData = '';
    res.on('data', chunk => {
      sseData += chunk;
      console.log('Received SSE Chunk:\n', chunk.toString());
      if (sseData.includes('event: endpoint')) {
        console.log('✓ SSE Endpoint Event received successfully!');
        listener.close();
      }
    });
  });
});
