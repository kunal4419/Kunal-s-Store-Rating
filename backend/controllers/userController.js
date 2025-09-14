const bcrypt = require('bcryptjs');
const { User, Store, Rating, sequelize } = require('../models');
const { fn, col, literal } = require('sequelize');

// List stores with average rating and current user rating
exports.listStores = async (req, res) => {
  try {
    const userId = req.user.id;

    const stores = await Store.findAll({
      attributes: [
        'id', 'name', 'address',
        [fn('COALESCE', fn('AVG', col('Ratings.ratingValue')), 0), 'avgRating'],
        [literal(`(
          SELECT COALESCE("ratingValue", 0)
          FROM "Ratings" AS "UserRating"
          WHERE "UserRating"."storeId" = "Store"."id" AND "UserRating"."userId" = '${userId}'
        )`), 'userRating']
      ],
      include: [{
        model: Rating,
        attributes: [],
      }],
      group: ['Store.id'],
      order: [['name', 'ASC']],
    });

    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single store details with average rating and user's rating
exports.getStoreById = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.id;

    const store = await Store.findOne({
      where: { id: storeId },
      attributes: [
        'id',
        'name',
        'address',
        [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('Ratings.ratingValue')), 0), 'avgRating'],
        [sequelize.literal(`(
          SELECT COALESCE("ratingValue", 0)
          FROM "Ratings" AS "UserRating"
          WHERE "UserRating"."storeId" = "Store"."id" AND "UserRating"."userId" = '${userId}'
        )`), 'userRating']
      ],
      include: [{
        model: Rating,
        attributes: [],
      }],
      group: ['Store.id'],
    });

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(store);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Submit or update rating for store (create if not exist, else update)
exports.rateStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.id;
    const { ratingValue } = req.body;

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'ratingValue must be between 1 and 5' });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const [rating, created] = await Rating.findOrCreate({
      where: { storeId, userId },
      defaults: { ratingValue }
    });

    if (!created) {
      rating.ratingValue = ratingValue;
      await rating.save();
    }

    res.json({ message: created ? 'Rating created' : 'Rating updated', ratingValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update existing rating for store (must exist)
exports.updateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const storeId = req.params.id;
    const { ratingValue } = req.body;

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ message: 'ratingValue must be between 1 and 5' });
    }

    const rating = await Rating.findOne({ where: { storeId, userId } });
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found; consider creating a new rating instead' });
    }

    rating.ratingValue = ratingValue;
    await rating.save();

    res.json({ message: 'Rating updated', ratingValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user's password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword required' });
    }

    const user = await User.findByPk(userId);
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
