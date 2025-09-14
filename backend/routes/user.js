const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  listStores,
  getStoreById,       // <-- Added import for single store details
  rateStore,
  updatePassword,
  updateRating       // <-- Added import for rating update
} = require('../controllers/userController');

// Protect all user routes
router.use(authMiddleware());

router.get('/stores', listStores);
router.get('/stores/:id', getStoreById);      // <-- Route for single store info
router.post('/stores/:id/rating', rateStore);
router.put('/stores/:id/rating', updateRating);
router.put('/password', updatePassword);

module.exports = router;
