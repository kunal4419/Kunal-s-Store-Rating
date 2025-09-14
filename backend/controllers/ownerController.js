// Owner dashboard summary
exports.getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    
    // Get stores owned by owner
    const storesRaw = await Store.findAll({
      where: { ownerId },
      attributes: ['id', 'name', 'email', 'address'],
      order: [['name', 'ASC']]
    });
    
    // For each store, get ratings and users
    const stores = await Promise.all(storesRaw.map(async (store) => {
      const ratings = await Rating.findAll({
        where: { storeId: store.id },
        include: [{ model: User, attributes: ['id', 'name', 'email'] }],
        attributes: ['id', 'ratingValue', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']]
      });
      
      const avgRating = ratings.length > 0 ? 
        (ratings.reduce((acc, r) => acc + r.ratingValue, 0) / ratings.length) : 0;
      
      const users = ratings.map(r => r.User);
      
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgRating: parseFloat(avgRating.toFixed(1)),
        users,
        ratings: ratings.map(r => ({
          id: r.id,
          ratingValue: r.ratingValue,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          user: r.User
        }))
      };
    }));
    
    // Calculate overall stats
    const totalStores = stores.length;
    const totalRatings = stores.reduce((acc, s) => acc + s.ratings.length, 0);
    const overallAvgRating = stores.length > 0 ? 
      (stores.reduce((acc, s) => acc + s.avgRating, 0) / stores.length) : 0;
    
    res.json({ 
      stores, 
      stats: { 
        totalStores, 
        totalRatings, 
        avgRating: parseFloat(overallAvgRating.toFixed(1))
      } 
    });
  } catch (error) {
    console.error('Error in getOwnerDashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const bcrypt = require('bcryptjs');
const { Rating, Store, User, sequelize } = require('../models');
const { fn, col } = require('sequelize');

// List stores owned by current owner with average rating
exports.listOwnedStores = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const stores = await Store.findAll({
      where: { ownerId },
      attributes: [
        'id', 'name', 'address',
        [
          sequelize.fn(
            'COALESCE',
            sequelize.fn('AVG', sequelize.col('Ratings.ratingValue')),
            0
          ),
          'avgRating'
        ],
      ],
      include: [{ model: Rating, attributes: [] }],
      group: ['Store.id'],
      order: [['name', 'ASC']],
    });
    return res.json(stores);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// List all ratings for a store owned by current owner
exports.listStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = req.params.id;

    const store = await Store.findOne({ where: { id: storeId, ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found or unauthorized' });
    }

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{
        model: User,
        attributes: ['id', 'name', 'email']
      }],
      attributes: ['id', 'ratingValue', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
    });

    res.json({ store: store.name, ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get average rating of a store owned by current owner
exports.getAverageRating = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = req.params.id;

    const store = await Store.findOne({ where: { id: storeId, ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found or unauthorized' });
    }

    const avgRating = await Rating.findOne({
      where: { storeId },
      attributes: [[sequelize.fn('AVG', sequelize.col('ratingValue')), 'averageRating']],
      raw: true,
    });

    res.json({ store: store.name, averageRating: parseFloat(avgRating.averageRating) || 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add Store (for owners)
exports.addStore = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, email, address } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Name, email, and address are required' });
    }

    // Check if owner already has a store (enforce one store per owner constraint)
    const existingStore = await Store.findOne({ where: { ownerId } });
    if (existingStore) {
      return res.status(409).json({ message: 'You already have a store. One user can only own one store.' });
    }

    // Check if store email already exists
    const existingStoreEmail = await Store.findOne({ where: { email } });
    if (existingStoreEmail) {
      return res.status(409).json({ message: 'Store email already registered' });
    }

    const newStore = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.status(201).json({ 
      message: 'Store added successfully', 
      store: {
        id: newStore.id,
        name: newStore.name,
        email: newStore.email,
        address: newStore.address
      }
    });
  } catch (error) {
    console.error('Error adding store:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Store (for owners)
exports.deleteStore = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const storeId = req.params.id;

    const store = await Store.findOne({ where: { id: storeId, ownerId } });
    if (!store) {
      return res.status(404).json({ message: 'Store not found or unauthorized' });
    }

    await store.destroy();
    res.json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update owner password
exports.updatePassword = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword required' });
    }

    const user = await User.findByPk(ownerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
