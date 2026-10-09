module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session && req.session.userId) {
      return next();
    }
    if (req.session) {
      req.session.returnTo = req.originalUrl;
    }
    return res.redirect('/admin/login');
  }
};
