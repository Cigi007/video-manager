import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Page from './Page.js';

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
});

Video.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Video, { foreignKey: 'userId' });

// Define the Many-to-Many relationship
Video.belongsToMany(Page, { through: 'VideoPage', foreignKey: 'videoId' });
Page.belongsToMany(Video, { through: 'VideoPage', foreignKey: 'pageId' });

export default Video; 