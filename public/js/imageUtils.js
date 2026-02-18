/**
 * Utility functions for handling various image URL formats
 * Supports: Google Drive, Dropbox, OneDrive, and direct links
 */

/**
 * Convert various image URL formats to direct accessible URLs
 * @param {string} url - The original URL
 * @returns {string} - Converted URL that can be used in img src
 */
function convertImageUrl(url) {
  if (!url || url.trim() === '') return '';
  
  url = url.trim();
  
  // Google Drive URLs
  // Format: https://drive.google.com/file/d/FILE_ID/view
  // Convert to: https://drive.google.com/thumbnail?id=FILE_ID&sz=s3000
  if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
    // Try to find ID in path /file/d/ID
    let fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    
    // If not found, try to find ID in query param ?id=ID or &id=ID
    if (!fileIdMatch) {
      fileIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    }
    
    if (fileIdMatch && fileIdMatch[1]) {
      // Use thumbnail API which is more reliable and supports CORS
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=s3000`;
    }
    
    // If already in thumbnail format, return as is
    if (url.includes('drive.google.com/thumbnail')) {
      return url;
    }

    // If already in uc format, try to convert to thumbnail if ID is present
    if (url.includes('drive.google.com/uc')) {
       const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
       if (idMatch && idMatch[1]) {
         return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=s3000`;
       }
       return url;
    }
  }
  
  // Dropbox URLs
  // Change dl=0 to dl=1 for direct download or use raw parameter
  if (url.includes('dropbox.com')) {
    if (url.includes('dl=0')) {
      return url.replace('dl=0', 'dl=1');
    }
    if (url.includes('www.dropbox.com')) {
      return url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    }
  }
  
  // OneDrive URLs
  // Convert to embed format
  if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
    // Use proxy for OneDrive as it requires special handling
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  }
  
  // GitHub raw URLs
  if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
    url = url.replace('github.com', 'raw.githubusercontent.com');
    url = url.replace('/blob/', '/');
  }
  
  // For other URLs, check if it's already a direct image link
  // If not, use proxy
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));
  
  if (hasImageExtension) {
    return url;
  }
  
  // If URL doesn't have clear image extension and not from known services,
  // try using it directly first (optimistic approach)
  return url;
}

/**
 * Handle image loading errors with fallback
 * @param {HTMLImageElement} img - The image element
 * @param {string} fallbackUrl - Optional fallback URL
 */
function handleImageError(img, fallbackUrl) {
  if (!img.dataset.retried && fallbackUrl) {
    img.dataset.retried = 'true';
    img.src = fallbackUrl;
  } else if (!img.dataset.proxyRetried) {
    // Try using proxy as last resort
    img.dataset.proxyRetried = 'true';
    const originalSrc = img.dataset.originalSrc || img.src;
    img.src = `/api/image-proxy?url=${encodeURIComponent(originalSrc)}`;
  } else {
    // If it's a local path like /uploads/..., maybe we are developing locally against remote DB
    // Try to see if we can use a placeholder or keep it visible with a "broken" look
    // but better to just show placeholder
    img.style.display = 'none';
    const placeholder = img.nextElementSibling;
    if (placeholder && (placeholder.classList.contains('image-placeholder') || placeholder.classList.contains('profile-placeholder'))) {
      placeholder.style.display = 'flex';
    } 
    // If no placeholder sibling, we can try to set a default image
    else if (img.classList.contains('profile-img')) {
      img.style.display = 'none';
      // If there's a parent wrapper that can show a fallback, let's try to find it
      // Or create a fallback text
      const parent = img.parentElement;
      if (parent) {
         const fallback = document.createElement('div');
         fallback.className = 'profile-placeholder';
         fallback.innerHTML = '<span>?</span>';
         parent.appendChild(fallback);
      }
    }
  }
}

/**
 * Setup image with automatic URL conversion and error handling
 * @param {HTMLImageElement} img - The image element
 * @param {string} url - The image URL
 * @param {string} fallbackUrl - Optional fallback URL
 */
function setupImage(img, url, fallbackUrl = null) {
  if (!url) return;
  
  const convertedUrl = convertImageUrl(url);
  img.dataset.originalSrc = url;
  img.src = convertedUrl;
  
  img.onerror = function() {
    handleImageError(img, fallbackUrl);
  };
}

// Make functions available globally
if (typeof window !== 'undefined') {
  window.convertImageUrl = convertImageUrl;
  window.handleImageError = handleImageError;
  window.setupImage = setupImage;
}

// For Node.js/server-side usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    convertImageUrl,
    handleImageError,
    setupImage
  };
}
