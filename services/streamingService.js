const StreamingContent = require("../models/streamingModel");
const { Op } = require("sequelize");

exports.getStreamingContent = async (genre) => {
    const where = {};

    if (genre) {
        where.title = { [Op.iLike]: `%${genre}%` };
    }

    return await StreamingContent.findAll({
        where,
        limit: 10,
        offset: 0
    });
};