require('dotenv').config();

console.log('POSTGRES_URL:', process.env.POSTGRES_URL); // Debug print to verify env loading

const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  logging: false,
});

const User = require('./user')(sequelize, DataTypes);
const Store = require('./store')(sequelize, DataTypes);
const Rating = require('./rating')(sequelize, DataTypes);

// Relationships
User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

Store.hasMany(Rating, { foreignKey: 'storeId' });
Rating.belongsTo(Store, { foreignKey: 'storeId' });

User.hasMany(Store, { foreignKey: 'ownerId' }); 
Store.belongsTo(User, { foreignKey: 'ownerId' });

module.exports = { sequelize, User, Store, Rating };
