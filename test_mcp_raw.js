const { spawn } = require('child_process');

const mcpProcess = spawn('node', ['mcp.js'], {
  stdio: ['pipe', 'pipe', 'inherit'] // pipe stdin, stdout, inherit stderr
});

// Helper to send a JSON-RPC request
let messageId = 1;
function sendRequest(method, params) {
  const req = {
    jsonrpc: "2.0",
    id: messageId++,
    method,
    params
  };
  mcpProcess.stdin.write(JSON.stringify(req) + '\n');
}

let responseBuffer = '';

mcpProcess.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  const lines = responseBuffer.split('\n');
  responseBuffer = lines.pop(); // keep incomplete line

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      console.log('Received response:', JSON.stringify(msg, null, 2));

      // After receiving initialize response, send notifications/initialized and then call a tool
      if (msg.id === 1) {
        // Send initialized notification
        const initNotif = {
          jsonrpc: "2.0",
          method: "notifications/initialized"
        };
        mcpProcess.stdin.write(JSON.stringify(initNotif) + '\n');
        
        console.log('\n--- Sending add_project tool call ---');
        sendRequest("tools/call", {
          name: "add_project",
          arguments: {
            title: "Project from MCP Agent",
            description: "This project was added dynamically by an AI Agent testing the MCP integration.",
            technologies: ["Node.js", "MCP", "AI"],
            role: "MCP Tester",
            impact: "Proves that the AI can act as an MCP client and insert data securely."
          }
        });
      } else if (msg.id === 2) {
        // We received the tool response!
        console.log('\n✅ MCP Test completed successfully!');
        mcpProcess.kill();
        process.exit(0);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  }
});

mcpProcess.on('error', err => {
  console.error("Failed to start mcp.js:", err);
});

mcpProcess.on('exit', code => {
  console.log(`mcp.js exited with code ${code}`);
});

// 1. Initialize MCP Session
console.log('--- Sending initialize request ---');
sendRequest("initialize", {
  protocolVersion: "2024-11-05", // Example MCP version
  capabilities: {},
  clientInfo: {
    name: "AI-Agent-Tester",
    version: "1.0.0"
  }
});
