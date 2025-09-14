'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      address: { type: Sequelize.TEXT, allowNull: true },
      passwordHash: { type: Sequelize.STRING, allowNull: false },
      role: {
        type: Sequelize.ENUM('ADMIN', 'USER', 'OWNER'),
        allowNull: false,
        defaultValue: 'USER',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};
