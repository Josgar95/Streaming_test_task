const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const StreamingContent = sequelize.define("StreamingContent", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    thumbnail_url: { type: DataTypes.TEXT },
    video_url: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE },
    updated_at: { type: DataTypes.DATE }
}, {
    tableName: "streaming_content",
    timestamps: false
});

module.exports = StreamingContent;