module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM('ADMIN', 'USER', 'OWNER'),
      defaultValue: 'USER',
      allowNull: false,
    },
  }, {
    timestamps: true,
  });
  return User;
};
