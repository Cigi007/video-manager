import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Page = sequelize.define('Page', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  abTesting: {
    type: DataTypes.ENUM('Inactive', 'Active', 'Paused'),
    defaultValue: 'Inactive',
    allowNull: true,
  },
}, {
  timestamps: true,
});

Page.belongsTo(User, { foreignKey: 'userId' });

export default Page; 