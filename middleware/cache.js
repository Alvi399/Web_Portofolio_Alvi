const NodeCache = require('node-cache');

// Cache instance, TTL 1 hour (3600 seconds) by default
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

/**
 * Express middleware to cache GET requests
 */
exports.cacheRoute = (durationSeconds = 3600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Use the URL + Lang cookie as the cache key
    const lang = req.cookies && req.cookies.lang ? req.cookies.lang : 'en';
    const key = `__express__${lang}__${req.originalUrl || req.url}`;
    const cachedBody = cache.get(key);

    if (cachedBody) {
      // Send cached HTML
      return res.send(cachedBody);
    } else {
      // Intercept the res.send method to cache the response before sending
      const originalSend = res.send;
      res.send = function (body) {
        // Only cache 200 OK responses
        if (res.statusCode === 200) {
          cache.set(key, body, durationSeconds);
        }
        originalSend.call(this, body);
      };
      next();
    }
  };
};

/**
 * Clear the entire cache
 */
exports.clearCache = () => {
  cache.flushAll();
  console.log('[Cache] Flushed all entries.');
};
