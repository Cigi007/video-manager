import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Purchase = sequelize.define('Purchase', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  page_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Page where the purchase occurred (can be null if not tied to a specific page)
    references: {
      model: 'Pages',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default Purchase; 