require('dotenv').config();
const { sequelize, User, Store, Rating } = require('./models/index.js');

async function runMigrations() {
  try {
    console.log('Starting database migrations...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // Sync all models (this will create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('Database tables synchronized successfully');

    console.log('✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during database setup:', error);
  } finally {
    await sequelize.close();
  }
}

runMigrations();
