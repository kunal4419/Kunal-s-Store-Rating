require('dotenv').config({ path: '../.env' });

const { sequelize, User, Store } = require('../models');
const bcrypt = require('bcryptjs');

async function seed() {
  await sequelize.sync({ force: true });
  
  const passwordHashAdmin = await bcrypt.hash('adminpassword', 10);
  const passwordHashOwner = await bcrypt.hash('ownerpassword', 10);
  const passwordHashUser = await bcrypt.hash('userpassword', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: passwordHashAdmin,
    role: 'ADMIN',
  });

  const owner = await User.create({
    name: 'Store Owner',
    email: 'owner@example.com',
    passwordHash: passwordHashOwner,
    role: 'OWNER',
  });

  const user = await User.create({
    name: 'Normal User',
    email: 'user@example.com',
    passwordHash: passwordHashUser,
    role: 'USER',
  });

  const store = await Store.create({
    name: 'Store One',
    email: 'storeone@example.com',
    address: '123 Store St',
    ownerId: owner.id,
  });

  console.log('DB synced and initial users & store seeded.');
}

seed()
  .then(() => process.exit())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
