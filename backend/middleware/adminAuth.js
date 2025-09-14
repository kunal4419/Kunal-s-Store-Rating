const authMiddleware = require('./auth');

const adminAuth = authMiddleware('ADMIN');

module.exports = adminAuth;
