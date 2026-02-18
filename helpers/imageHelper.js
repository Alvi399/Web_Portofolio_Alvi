/**
 * EJS Helper Functions for Image URLs
 * Use these in EJS templates for consistent image handling
 */

/**
 * Convert image URL to usable format
 * @param {string} url - The original URL
 * @returns {string} - Converted URL
 */
function getImageUrl(url) {
  if (!url || url.trim() === '') return '';
  
  url = url.trim();
  
  // Google Drive URLs
  if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
    // Try to find ID in path /file/d/ID
    let fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    
    // If not found, try to find ID in query param ?id=ID or &id=ID
    if (!fileIdMatch) {
      fileIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    }

    // Handle drive.usercontent.google.com/download?id=... format
    if (!fileIdMatch && url.includes('drive.usercontent.google.com')) {
       // specific check for download?id=...
       const idParam = new URLSearchParams(url.split('?')[1]).get('id');
       if (idParam) fileIdMatch = [null, idParam];
    }

    if (fileIdMatch && fileIdMatch[1]) {
      // Use thumbnail API which is more reliable and supports CORS
      // sz=s3000 gets up to 3000px size (high res)
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=s3000`;
    }
    
    // If already in thumbnail format, return as is
    if (url.includes('drive.google.com/thumbnail')) {
      return url;
    }
    
    if (url.includes('drive.google.com/uc')) {
      // Try to extract ID from uc link if possible to convert to thumbnail
      const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idMatch && idMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=s3000`;
      }
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
  
  // OneDrive URLs - use proxy
  if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  // GitHub URLs
  if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
    url = url.replace('github.com', 'raw.githubusercontent.com');
    url = url.replace('/blob/', '/');
  }
  
  return url;
}

module.exports = { getImageUrl };
