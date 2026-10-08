const http = require('http');

async function testRemoteSse() {
  console.log('Testing Remote Hosted MCP Server at http://localhost:3005/sse');
  
  http.get('http://localhost:3005/sse', (res) => {
    console.log('HTTP Status:', res.statusCode, '(Expected 200)');
    let sseData = '';
    res.on('data', chunk => {
      sseData += chunk;
      console.log('Received SSE Chunk:\n', chunk.toString());
      if (sseData.includes('event: endpoint')) {
        console.log('✓ Remote Hosted MCP Server SSE Endpoint verified successfully!');
        process.exit(0);
      }
    });
  }).on('error', (err) => {
    console.error('Remote SSE Connection error:', err.message);
  });
}

testRemoteSse();
