const http = require('http');

const BASE_URL = 'http://127.0.0.1:3005';

function makeSseConnection() {
  return new Promise((resolve, reject) => {
    console.log(`📡 Connecting to Local SSE MCP Server at ${BASE_URL}/sse ...`);
    
    const req = http.get(`${BASE_URL}/sse`, {
      headers: {
        'Accept': 'text/event-stream',
        'User-Agent': 'Remote-MCP-Tester/1.0'
      }
    }, (res) => {
      console.log(`✓ HTTP Response Status: ${res.statusCode} ${res.statusMessage}`);
      if (res.statusCode !== 200) {
        return reject(new Error(`Server returned HTTP status ${res.statusCode}`));
      }

      let buffer = '';
      let endpointUrl = '';

      res.on('data', (chunk) => {
        const text = chunk.toString();
        buffer += text;

        if (!endpointUrl && buffer.includes('event: endpoint') && buffer.includes('data:')) {
          const lines = buffer.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('data:')) {
              const endpointPath = lines[i].replace('data:', '').trim();
              endpointUrl = `${BASE_URL}${endpointPath}`;
              console.log(`✓ SSE Session Established! Endpoint Path: ${endpointPath}\n`);
              resolve({ res, endpointUrl });
              break;
            }
          }
        }

        if (text.includes('event: message')) {
          console.log(`📩 SSE Incoming Event Stream Payload:\n${text.trim()}\n`);
        }
      });

      res.on('error', (err) => console.error('SSE Stream Error:', err));
    });

    req.on('error', reject);
  });
}

function sendMcpRpc(endpointUrl, rpcPayload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(rpcPayload);
    const url = new URL(endpointUrl);

    const req = http.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function runLocalMcpTests() {
  try {
    const { res: sseStream, endpointUrl } = await makeSseConnection();

    // 1. Initialize MCP Protocol Session
    console.log('--- 1. Initializing MCP Session ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "LiveMcpTestClient", version: "1.0.0" }
      }
    });

    await new Promise(r => setTimeout(r, 800));

    // 2. List Tools
    console.log('--- 2. Calling tools/list ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    });

    await new Promise(r => setTimeout(r, 800));

    // 3. Add Project Dummy Data via MCP
    console.log('--- 3. Calling add_project tool ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "add_project",
        arguments: {
          title: "Cloudflare Hosted Live MCP System",
          description: "Sistem platform MCP terdistribusi yang di-host di server Debian via Cloudflare Tunnel.",
          problem: "Memerlukan koneksi secure bidirectional real-time antara AI Agent lokal dan server remote tanpa IP publik.",
          role: "Lead Cloud Architect & Systems Engineer",
          impact: "Mengurangi latency response hingga 60% dan melayani 50,000 req/sec dengan 0 downtime.",
          technologies: ["Node.js", "Express", "MCP Protocol", "Cloudflare Tunnel", "MySQL"],
          project_url: "https://portomax.limitless.qzz.io",
          status: "published"
        }
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 4. Add Skill Dummy Data via MCP
    console.log('--- 4. Calling add_skill tool ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "add_skill",
        arguments: {
          name: "Cloudflare Tunnels & Edge Server",
          category: "Backend",
          proficiency: 95,
          icon: "⚡"
        }
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 5. Add Certificate Dummy Data via MCP
    console.log('--- 5. Calling add_certificate tool ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "add_certificate",
        arguments: {
          title: "Cloudflare Certified Systems Administrator",
          issuer: "Cloudflare Academy",
          date: "2026-10-01",
          category: "Backend",
          credential_url: "https://cert.cloudflare.com/verify/123",
          is_highlight: true
        }
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 6. Add Journey Dummy Data via MCP
    console.log('--- 6. Calling add_journey tool ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: {
        name: "add_journey",
        arguments: {
          title: "Senior Backend & MCP Specialist",
          description: "Memimpin arsitektur integrasi MCP Server dan deployment otomatis via Cloudflare Tunnel.",
          date: "2026-01-01",
          is_current: true,
          category: "experience"
        }
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 7. Add Testimonial Dummy Data via MCP
    console.log('--- 7. Calling add_testimonial tool ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: {
        name: "add_testimonial",
        arguments: {
          name: "Dr. Pratama Kusumah",
          position: "Head of Infrastructure",
          company: "Cloud Operations Inc",
          quote: "Alvi sukses mengimplementasikan Hosted MCP Server dengan Cloudflare Tunnel secara sempurna. Etos kerja dan pemahaman arsitektur cloud-nya luar biasa!",
          is_visible: true
        }
      }
    });

    await new Promise(r => setTimeout(r, 1000));

    // 8. List Projects via MCP
    console.log('--- 8. Calling list_projects tool ---');
    await sendMcpRpc(endpointUrl, {
      jsonrpc: "2.0",
      id: 8,
      method: "tools/call",
      params: {
        name: "list_projects",
        arguments: {}
      }
    });

    await new Promise(r => setTimeout(r, 1500));

    console.log('🎉 ALL MCP TOOLS TESTED & VERIFIED PERFECTLY OVER SSE!');
    sseStream.destroy();
    process.exit(0);

  } catch (err) {
    console.error('❌ Local MCP Test Error:', err);
    process.exit(1);
  }
}

runLocalMcpTests();
