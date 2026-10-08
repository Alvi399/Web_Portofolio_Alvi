const axios = require('axios');
const dns = require('dns').promises;
const { URL } = require('url');
const { getImageUrl } = require('../helpers/imageHelper');

const ALLOWED_HOST_PATTERNS = [
  /^drive\.google\.com$/i,
  /^lh[0-9]*\.googleusercontent\.com$/i,
  /^.*\.googleusercontent\.com$/i,
  /^dl\.dropboxusercontent\.com$/i,
  /^www\.dropbox\.com$/i,
  /^onedrive\.live\.com$/i,
  /^1drv\.ms$/i,
  /^.*\.sharepoint\.com$/i,
  /^raw\.githubusercontent\.com$/i,
  /^avatars\.githubusercontent\.com$/i,
  /^github\.com$/i
];

function isHostAllowed(hostname) {
  return ALLOWED_HOST_PATTERNS.some(pattern => pattern.test(hostname));
}

function isPrivateIp(ip) {
  if (!ip) return true;
  if (ip === '127.0.0.1' || ip === '::1' || ip === '0.0.0.0') return true;

  // IPv4 checks
  const parts = ip.split('.').map(Number);
  if (parts.length === 4) {
    if (parts[0] === 10) return true; // 10.0.0.0/8
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true; // 172.16.0.0/12
    if (parts[0] === 192 && parts[1] === 168) return true; // 192.168.0.0/16
    if (parts[0] === 127) return true; // 127.0.0.0/8
    if (parts[0] === 169 && parts[1] === 254) return true; // 169.254.0.0/16
  }

  // IPv6 checks
  const lower = ip.toLowerCase();
  if (lower.startsWith('fe80:') || lower.startsWith('fc00:') || lower.startsWith('fd00:')) return true;

  return false;
}

const TRANSPARENT_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

/**
 * Image Proxy Controller (T-20 SSRF Protected)
 */
exports.proxyImage = async (req, res) => {
  try {
    const rawUrl = req.query.url;
    if (!rawUrl) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(rawUrl);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.status(400).json({ error: 'Only http and https protocols are allowed' });
    }

    if (!isHostAllowed(parsedUrl.hostname)) {
      return res.status(400).json({ error: 'Hostname not in whitelist' });
    }

    // DNS Resolution check to block private IP addresses (SSRF prevention)
    try {
      const addresses = await dns.lookup(parsedUrl.hostname, { all: true });
      for (const addr of addresses) {
        if (isPrivateIp(addr.address)) {
          return res.status(400).json({ error: 'Access to private IP addresses is prohibited' });
        }
      }
    } catch (dnsErr) {
      return res.status(400).json({ error: 'DNS resolution failed' });
    }

    const response = await axios.get(rawUrl, {
      responseType: 'arraybuffer',
      timeout: 10000,
      maxContentLength: 8 * 1024 * 1024, // 8 MB max
      maxRedirects: 3,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Portfolio-Image-Proxy'
      }
    });

    const contentType = (response.headers['content-type'] || '').toLowerCase();
    if (!contentType.startsWith('image/') || contentType.includes('image/svg+xml')) {
      return res.status(400).json({ error: 'Invalid or unsupported image type' });
    }

    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(response.data);

  } catch (error) {
    console.error('Image proxy error:', error.message);
    res.set('Content-Type', 'image/png');
    res.status(200).send(TRANSPARENT_PIXEL);
  }
};

/** Delegated convertImageUrl helper for backwards compatibility */
exports.convertImageUrl = getImageUrl;
