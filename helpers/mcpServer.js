const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { SSEServerTransport } = require('@modelcontextprotocol/sdk/server/sse.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { Project, Certificate, Journey, Skill, Testimonial, Profile, sequelize } = require('../models');

// Helper to save base64 image locally
function saveImageLocally(folderName, base64String, extension, prefixSlug) {
  if (!base64String) return '';
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads', folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const ext = (extension || 'png').replace('.', '');
  const filename = `${prefixSlug}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  const filepath = path.join(uploadDir, filename);
  fs.writeFileSync(filepath, Buffer.from(base64String, 'base64'));
  return `/uploads/${folderName}/${filename}`;
}

function createMcpServer() {
  const server = new Server({
    name: "Alvi-Portfolio-MCP",
    version: "1.3.0"
  }, {
    capabilities: { tools: {} }
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        // --- Projects ---
        { name: "list_projects", description: "List all projects.", inputSchema: { type: "object", properties: {} } },
        {
          name: "add_project", description: "Add a new project.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string" }, description: { type: "string" }, problem: { type: "string" },
              role: { type: "string" }, impact: { type: "string" }, technologies: { type: "array", items: { type: "string" } },
              project_url: { type: "string" }, github_url: { type: "string" }, status: { type: "string" },
              image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["title"]
          }
        },
        {
          name: "update_project", description: "Update a project by ID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number" }, title: { type: "string" }, description: { type: "string" },
              problem: { type: "string" }, role: { type: "string" }, impact: { type: "string" },
              technologies: { type: "array", items: { type: "string" } }, project_url: { type: "string" },
              github_url: { type: "string" }, status: { type: "string" },
              image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["id"]
          }
        },
        { name: "delete_project", description: "Delete a project by ID.", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },

        // --- Certificates ---
        { name: "list_certificates", description: "List all certificates.", inputSchema: { type: "object", properties: {} } },
        {
          name: "add_certificate", description: "Add a new certificate.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string" }, issuer: { type: "string" }, date: { type: "string" },
              category: { type: "string" }, credential_url: { type: "string" }, is_highlight: { type: "boolean" },
              image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["title", "issuer", "date"]
          }
        },
        {
          name: "update_certificate", description: "Update a certificate by ID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number" }, title: { type: "string" }, issuer: { type: "string" },
              date: { type: "string" }, category: { type: "string" }, credential_url: { type: "string" },
              is_highlight: { type: "boolean" }, image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["id"]
          }
        },
        { name: "delete_certificate", description: "Delete a certificate by ID.", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },

        // --- Journey ---
        { name: "list_journey", description: "List all journey events.", inputSchema: { type: "object", properties: {} } },
        {
          name: "add_journey", description: "Add a new journey milestone.",
          inputSchema: {
            type: "object",
            properties: {
              title: { type: "string" }, description: { type: "string" }, date: { type: "string" },
              end_date: { type: "string" }, is_current: { type: "boolean" }, category: { type: "string" },
              image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["title", "date"]
          }
        },
        {
          name: "update_journey", description: "Update a journey event by ID.",
          inputSchema: {
            type: "object",
            properties: {
              id: { type: "number" }, title: { type: "string" }, description: { type: "string" },
              date: { type: "string" }, end_date: { type: "string" }, is_current: { type: "boolean" },
              category: { type: "string" }, image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["id"]
          }
        },
        { name: "delete_journey", description: "Delete a journey event by ID.", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },

        // --- Skills ---
        { name: "list_skills", description: "List all skills.", inputSchema: { type: "object", properties: {} } },
        {
          name: "add_skill", description: "Add a new skill.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string" }, category: { type: "string" }, proficiency: { type: "number" },
              icon: { type: "string" }, image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["name"]
          }
        },
        {
          name: "update_skill", description: "Update a skill by ID.",
          inputSchema: {
            type: "object",
            properties: { id: { type: "number" }, name: { type: "string" }, category: { type: "string" }, proficiency: { type: "number" }, icon: { type: "string" } },
            required: ["id"]
          }
        },
        { name: "delete_skill", description: "Delete a skill by ID.", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },

        // --- Testimonials ---
        { name: "list_testimonials", description: "List all testimonials.", inputSchema: { type: "object", properties: {} } },
        {
          name: "add_testimonial", description: "Add a new testimonial.",
          inputSchema: {
            type: "object",
            properties: {
              name: { type: "string" }, position: { type: "string" }, company: { type: "string" },
              quote: { type: "string" }, is_visible: { type: "boolean" },
              image_base64: { type: "string" }, image_extension: { type: "string" }
            },
            required: ["name", "quote"]
          }
        },
        {
          name: "update_testimonial", description: "Update a testimonial by ID.",
          inputSchema: {
            type: "object",
            properties: { id: { type: "number" }, name: { type: "string" }, position: { type: "string" }, company: { type: "string" }, quote: { type: "string" }, is_visible: { type: "boolean" } },
            required: ["id"]
          }
        },
        { name: "delete_testimonial", description: "Delete a testimonial by ID.", inputSchema: { type: "object", properties: { id: { type: "number" } }, required: ["id"] } },

        // --- Profile ---
        { name: "get_profile", description: "Get user profile data.", inputSchema: { type: "object", properties: {} } },
        {
          name: "update_profile", description: "Update user profile data.",
          inputSchema: {
            type: "object",
            properties: {
              full_name: { type: "string" }, display_name: { type: "string" }, headline: { type: "string" },
              tagline: { type: "string" }, bio: { type: "string" }, email: { type: "string" },
              phone: { type: "string" }, location: { type: "string" }
            }
          }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    await sequelize.authenticate();
    try {
      const { name, arguments: args } = request.params;

      if (name === "list_projects") {
        const items = await Project.findAll({ order: [['sort_order', 'ASC']] });
        return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
      }
      if (name === "add_project") {
        let baseSlug = args.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        let slug = baseSlug, counter = 1;
        while (await Project.findOne({ where: { slug } })) { slug = `${baseSlug}-${counter++}`; }
        const imagePath = saveImageLocally('projects', args.image_base64, args.image_extension, slug);
        const item = await Project.create({
          title: args.title, slug, description: args.description || '',
          problem: args.problem || '', role: args.role || '', impact: args.impact || '',
          technologies: args.technologies || [], project_url: args.project_url || '',
          github_url: args.github_url || '', image: imagePath, status: args.status || 'published'
        });
        return { content: [{ type: "text", text: `Project added! ID: ${item.id}` }] };
      }
      if (name === "update_project") {
        const item = await Project.findByPk(args.id);
        if (!item) throw new Error("Project not found");
        let updateData = { ...args };
        delete updateData.id; delete updateData.image_base64; delete updateData.image_extension;
        if (args.image_base64) {
          updateData.image = saveImageLocally('projects', args.image_base64, args.image_extension, item.slug);
        }
        await item.update(updateData);
        return { content: [{ type: "text", text: `Project ID ${item.id} updated successfully!` }] };
      }
      if (name === "delete_project") {
        await Project.destroy({ where: { id: args.id } });
        return { content: [{ type: "text", text: `Project ID ${args.id} deleted!` }] };
      }

      if (name === "list_certificates") {
        const items = await Certificate.findAll({ order: [['date', 'DESC']] });
        return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
      }
      if (name === "add_certificate") {
        const slug = args.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
        const imagePath = saveImageLocally('certificates', args.image_base64, args.image_extension, slug);
        const item = await Certificate.create({
          title: args.title, issuer: args.issuer, date: args.date,
          category: args.category || 'Other', credential_url: args.credential_url || '',
          is_highlight: args.is_highlight || false, image: imagePath
        });
        return { content: [{ type: "text", text: `Certificate added! ID: ${item.id}` }] };
      }
      if (name === "update_certificate") {
        const item = await Certificate.findByPk(args.id);
        if (!item) throw new Error("Certificate not found");
        let updateData = { ...args };
        delete updateData.id; delete updateData.image_base64; delete updateData.image_extension;
        if (args.image_base64) {
          const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
          updateData.image = saveImageLocally('certificates', args.image_base64, args.image_extension, slug);
        }
        await item.update(updateData);
        return { content: [{ type: "text", text: `Certificate ID ${item.id} updated successfully!` }] };
      }
      if (name === "delete_certificate") {
        await Certificate.destroy({ where: { id: args.id } });
        return { content: [{ type: "text", text: `Certificate ID ${args.id} deleted!` }] };
      }

      if (name === "list_journey") {
        const items = await Journey.findAll({ order: [['date', 'DESC']] });
        return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
      }
      if (name === "add_journey") {
        const slug = args.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
        const imagePath = saveImageLocally('journey', args.image_base64, args.image_extension, slug);
        const item = await Journey.create({
          title: args.title, description: args.description || '', date: args.date,
          end_date: args.end_date || null, is_current: args.is_current || false,
          category: args.category || 'experience', image: imagePath
        });
        return { content: [{ type: "text", text: `Journey added! ID: ${item.id}` }] };
      }
      if (name === "update_journey") {
        const item = await Journey.findByPk(args.id);
        if (!item) throw new Error("Journey not found");
        let updateData = { ...args };
        delete updateData.id; delete updateData.image_base64; delete updateData.image_extension;
        if (args.image_base64) {
          const slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
          updateData.image = saveImageLocally('journey', args.image_base64, args.image_extension, slug);
        }
        await item.update(updateData);
        return { content: [{ type: "text", text: `Journey ID ${item.id} updated successfully!` }] };
      }
      if (name === "delete_journey") {
        await Journey.destroy({ where: { id: args.id } });
        return { content: [{ type: "text", text: `Journey ID ${args.id} deleted!` }] };
      }

      if (name === "list_skills") {
        const items = await Skill.findAll({ order: [['category', 'ASC'], ['sort_order', 'ASC']] });
        return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
      }
      if (name === "add_skill") {
        const slug = args.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20);
        const imagePath = saveImageLocally('skills', args.image_base64, args.image_extension, slug);
        const item = await Skill.create({
          name: args.name, category: args.category || 'General',
          proficiency: args.proficiency || 50, icon: args.icon || '', image: imagePath
        });
        return { content: [{ type: "text", text: `Skill added! ID: ${item.id}` }] };
      }
      if (name === "update_skill") {
        const item = await Skill.findByPk(args.id);
        if (!item) throw new Error("Skill not found");
        let updateData = { ...args };
        delete updateData.id;
        await item.update(updateData);
        return { content: [{ type: "text", text: `Skill ID ${item.id} updated successfully!` }] };
      }
      if (name === "delete_skill") {
        await Skill.destroy({ where: { id: args.id } });
        return { content: [{ type: "text", text: `Skill ID ${args.id} deleted!` }] };
      }

      if (name === "list_testimonials") {
        const items = await Testimonial.findAll({ order: [['sort_order', 'ASC']] });
        return { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] };
      }
      if (name === "add_testimonial") {
        const slug = args.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 20);
        const imagePath = saveImageLocally('testimonials', args.image_base64, args.image_extension, slug);
        const item = await Testimonial.create({
          name: args.name, position: args.position || '', company: args.company || '',
          quote: args.quote, photo: imagePath
        });
        return { content: [{ type: "text", text: `Testimonial added! ID: ${item.id}` }] };
      }
      if (name === "update_testimonial") {
        const item = await Testimonial.findByPk(args.id);
        if (!item) throw new Error("Testimonial not found");
        let updateData = { ...args };
        delete updateData.id;
        await item.update(updateData);
        return { content: [{ type: "text", text: `Testimonial ID ${item.id} updated successfully!` }] };
      }
      if (name === "delete_testimonial") {
        await Testimonial.destroy({ where: { id: args.id } });
        return { content: [{ type: "text", text: `Testimonial ID ${args.id} deleted!` }] };
      }

      if (name === "get_profile") {
        const profile = await Profile.findOne();
        return { content: [{ type: "text", text: JSON.stringify(profile, null, 2) }] };
      }
      if (name === "update_profile") {
        let profile = await Profile.findOne();
        if (!profile) profile = await Profile.create({ full_name: 'Your Name' });
        await profile.update(args);
        return { content: [{ type: "text", text: `Profile updated successfully!` }] };
      }

      throw new Error("Unknown tool");
    } catch (error) {
      return { isError: true, content: [{ type: "text", text: `Failed: ${error.message}` }] };
    }
  });

  return server;
}

// Attach Remote Hosted MCP Server to Express App (SSE Transport)
function attachMcpToExpress(app) {
  const transports = new Map();

  // Auth middleware for remote MCP (Optional API Key via process.env.MCP_API_KEY)
  const checkMcpAuth = (req, res, next) => {
    const requiredKey = process.env.MCP_API_KEY;
    if (!requiredKey) return next();
    const providedKey = req.headers['x-api-key'] || req.query.api_key;
    if (providedKey && providedKey === requiredKey) return next();
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing MCP API key' });
  };

  // GET /sse or /api/mcp/sse - Stream for remote AI Clients
  app.get('/sse', checkMcpAuth, async (req, res) => {
    const server = createMcpServer();
    const transport = new SSEServerTransport('/api/mcp/message', res);
    transports.set(transport.sessionId, transport);
    req.on('close', () => transports.delete(transport.sessionId));
    await server.connect(transport);
  });

  // POST /api/mcp/message - Post message for remote AI Clients
  app.post('/api/mcp/message', checkMcpAuth, async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports.get(sessionId);
    if (transport) {
      await transport.handlePostMessage(req, res, req.body);
    } else {
      res.status(400).json({ error: 'Active MCP session not found for this sessionId' });
    }
  });


  console.log('✓ Remote Hosted MCP Server attached at /sse & /api/mcp/message');
}

module.exports = { createMcpServer, attachMcpToExpress };
