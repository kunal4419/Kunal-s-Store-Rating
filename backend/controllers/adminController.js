const bcrypt = require('bcryptjs');
const { User, Store, Rating, sequelize } = require('../models');
const { Op, fn, col } = require('sequelize');

// Add User
exports.addUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    // Only allow USER or OWNER roles to be added by admin
    if (role !== 'USER' && role !== 'OWNER') {
      return res.status(403).json({ message: 'Admins can only add users with USER or OWNER role.' });
    }
    const existingUser = await User.findOne({ where: { email }});
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      address,
      passwordHash,
      role,
    });
    res.status(201).json({ message: 'User added', userId: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add Store
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;
    if (!name || !email || !ownerId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'OWNER') {
      return res.status(400).json({ message: 'Invalid ownerId or user is not a store owner' });
    }

    // Check if owner already has a store
    const existingStoreByOwner = await Store.findOne({ where: { ownerId } });
    if (existingStoreByOwner) {
      return res.status(409).json({ message: 'This owner already has a store. One user can only own one store.' });
    }

    const existingStore = await Store.findOne({ where: { email }});
    if (existingStore) {
      return res.status(409).json({ message: 'Store email already registered' });
    }

    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.status(201).json({ message: 'Store added', storeId: newStore.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Dashboard totals
exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List Users with optional filters (by role or email)
exports.listUsers = async (req, res) => {
  try {
    const { role, email, name, address } = req.query;
    const where = {};
    if (role) where.role = role;
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role', 'createdAt']
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// List Stores with average rating
exports.listStores = async (req, res) => {
  try {
    // Aggregate average rating using Sequelize fn
    const stores = await Store.findAll({
      attributes: [
        'id', 'name', 'email', 'address', 'ownerId',
        [sequelize.fn('AVG', sequelize.col('Ratings.ratingValue')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('Ratings.id')), 'ratingCount']
      ],
      include: [{
        model: Rating,
        attributes: [],
      }],
      group: ['Store.id'],
    });

    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit User
exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Prevent editing another admin
    if (user.role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot edit another admin user' });
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.address = address ?? user.address;
    user.role = role ?? user.role;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Prevent deleting another admin
    if (user.role === 'ADMIN') {
      return res.status(403).json({ message: 'Cannot delete another admin user' });
    }
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit Store
exports.editStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, ownerId } = req.body;
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    // If ownerId is being changed, check if the new owner already has a store
    if (ownerId && ownerId !== store.ownerId) {
      const newOwner = await User.findByPk(ownerId);
      if (!newOwner || newOwner.role !== 'OWNER') {
        return res.status(400).json({ message: 'Invalid ownerId or user is not a store owner' });
      }

      const existingStoreByNewOwner = await Store.findOne({ 
        where: { ownerId },
        // Exclude the current store being edited
        id: { [Op.ne]: id }
      });
      if (existingStoreByNewOwner) {
        return res.status(409).json({ message: 'This owner already has a store. One user can only own one store.' });
      }
    }

    store.name = name ?? store.name;
    store.email = email ?? store.email;
    store.address = address ?? store.address;
    store.ownerId = ownerId ?? store.ownerId;
    await store.save();
    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Store
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;
    const store = await Store.findByPk(id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    await store.destroy();
    res.json({ message: 'Store deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
