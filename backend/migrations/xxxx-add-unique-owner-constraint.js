'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add unique constraint on ownerId to prevent one user from having multiple stores
    await queryInterface.addConstraint('Stores', {
      fields: ['ownerId'],
      type: 'unique',
      name: 'unique_owner_per_store'
    });
  },

  async down(queryInterface) {
    // Remove the unique constraint
    await queryInterface.removeConstraint('Stores', 'unique_owner_per_store');
  }
};

