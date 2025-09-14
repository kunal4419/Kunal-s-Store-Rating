const express = require('express');
const router = express.Router();
const ownerAuth = require('../middleware/ownerAuth');
const {
  getOwnerDashboard,
  listStoreRatings,
  getAverageRating,
  updatePassword,
  listOwnedStores,
  addStore,
  deleteStore
} = require('../controllers/ownerController');

// Protect all owner routes
router.use(ownerAuth);

router.get('/dashboard', getOwnerDashboard);
router.get('/stores', listOwnedStores);
router.post('/stores', addStore);
router.delete('/stores/:id', deleteStore);
router.get('/stores/:id/ratings', listStoreRatings);
router.get('/stores/:id/average', getAverageRating);
router.put('/password', updatePassword);

module.exports = router;
