const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '..', 'database.sqlite'),
  logging: false,
});

const User = require('./User')(sequelize);
const Video = require('./Video')(sequelize);
const Comment = require('./Comment')(sequelize);

// Associations
User.hasMany(Video, { foreignKey: 'userId', as: 'videos' });
Video.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Video.hasMany(Comment, { foreignKey: 'videoId', as: 'comments' });
Comment.belongsTo(Video, { foreignKey: 'videoId', as: 'video' });

module.exports = {
  sequelize,
  User,
  Video,
  Comment
};
