import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Click = sequelize.define('Click', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  page_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Pages',
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true, // Allow null for unauthenticated users
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  element_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  element_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Click; 