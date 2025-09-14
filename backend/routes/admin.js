const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  addUser,
  addStore,
  dashboard,
  listUsers,
  listStores
} = require('../controllers/adminController');

const {
  editUser,
  deleteUser,
  editStore,
  deleteStore
} = require('../controllers/adminController');

// Protect all routes with admin authorization
router.use(adminAuth);

router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/dashboard', dashboard);
router.get('/users', listUsers);
router.get('/stores', listStores);

// Edit/Delete User
router.put('/users/:id', editUser);
router.delete('/users/:id', deleteUser);

// Edit/Delete Store
router.put('/stores/:id', editStore);
router.delete('/stores/:id', deleteStore);

module.exports = router;
