import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Video from './Video.js';

const VideoMetric = sequelize.define('VideoMetric', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'Videos',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    unique: 'compositeIndex', // Ensures unique entry per video per day
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  clicks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  purchases: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  indexes: [
    { // Composite unique index for videoId and date
      unique: true,
      fields: ['videoId', 'date']
    }
  ]
});

VideoMetric.belongsTo(Video, { foreignKey: 'videoId' });
Video.hasMany(VideoMetric, { foreignKey: 'videoId' });

export default VideoMetric; 