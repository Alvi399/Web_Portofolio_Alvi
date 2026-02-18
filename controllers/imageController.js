const axios = require('axios');

/**
 * Image Proxy Controller
 * Handles fetching images from external URLs that may have CORS restrictions
 */
exports.proxyImage = async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    // Fetch the image from the external URL
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      maxRedirects: 5
    });

    // Get content type from response or default to jpeg
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    // Set appropriate headers
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    // Send the image buffer
    res.send(response.data);
    
  } catch (error) {
    console.error('Image proxy error:', error.message);
    
    // Send a 1x1 transparent pixel as fallback
    const transparentPixel = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    res.set('Content-Type', 'image/png');
    res.status(200).send(transparentPixel);
  }
};

/**
 * Convert various image URL formats to usable formats
 */
exports.convertImageUrl = (url) => {
  if (!url || url.trim() === '') return '';
  
  url = url.trim();
  
  // Google Drive URLs
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }
    if (url.includes('drive.google.com/uc')) {
      return url;
    }
  }
  
  // Dropbox URLs
  if (url.includes('dropbox.com')) {
    if (url.includes('dl=0')) {
      return url.replace('dl=0', 'dl=1');
    }
    if (url.includes('www.dropbox.com')) {
      return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }
  }
  
  // GitHub URLs
  if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
    url = url.replace('github.com', 'raw.githubusercontent.com');
    url = url.replace('/blob/', '/');
  }
  
  return url;
};

module.exports = exports;
