const authMiddleware = require('./auth');

const ownerAuth = authMiddleware('OWNER');

module.exports = ownerAuth;
