import User from './User.js';
import Video from './Video.js';
import Page from './Page.js';
import PageView from './PageView.js';
import VideoView from './VideoView.js';
import Click from './Click.js';
import Purchase from './Purchase.js';
import ActivityLog from './ActivityLog.js';

// Define associations

// User associations
User.hasMany(Page, { foreignKey: 'userId', as: 'pages' });
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });
User.hasMany(PageView, { foreignKey: 'user_id', as: 'page_views' });
User.hasMany(VideoView, { foreignKey: 'user_id', as: 'video_views' });
User.hasMany(Click, { foreignKey: 'user_id', as: 'clicks' });
User.hasMany(Purchase, { foreignKey: 'user_id', as: 'purchases' });
User.hasMany(ActivityLog, { foreignKey: 'user_id', as: 'activity_logs' });

// Page associations
Page.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Page.belongsToMany(Video, { through: 'VideoPage', foreignKey: 'pageId', otherKey: 'videoId' });
Page.hasMany(PageView, { foreignKey: 'page_id', as: 'views' });
Page.hasMany(Click, { foreignKey: 'page_id', as: 'clicks' });
Page.hasMany(Purchase, { foreignKey: 'page_id', as: 'purchases' });

// Video associations
Video.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
Video.belongsToMany(Page, { through: 'VideoPage', foreignKey: 'videoId', otherKey: 'pageId' });
Video.hasMany(VideoView, { foreignKey: 'video_id', as: 'views' });

// Metrics associations
PageView.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
PageView.belongsTo(Page, { foreignKey: 'page_id', as: 'page' });

VideoView.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
VideoView.belongsTo(Video, { foreignKey: 'video_id', as: 'video' });

Click.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Click.belongsTo(Page, { foreignKey: 'page_id', as: 'page' });

Purchase.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Purchase.belongsTo(Page, { foreignKey: 'page_id', as: 'page' });

// ActivityLog association
ActivityLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { User, Video, Page, PageView, VideoView, Click, Purchase, ActivityLog }; 