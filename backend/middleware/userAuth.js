const authMiddleware = require('./auth');

const userAuth = authMiddleware('USER');

module.exports = userAuth;
