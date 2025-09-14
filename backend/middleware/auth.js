const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(roles = []) {
  // roles param can be a single role string (e.g. 'ADMIN') or an array of roles
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token is invalid or expired' });
    }
  };
}

module.exports = authMiddleware;
