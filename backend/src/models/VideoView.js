import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const VideoView = sequelize.define('VideoView', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  video_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Videos',
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
  referrer: {
    type: DataTypes.STRING(1024),
    allowNull: true,
  },
  watch_duration: {
    type: DataTypes.FLOAT,
    allowNull: true, // In seconds
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export default VideoView; 