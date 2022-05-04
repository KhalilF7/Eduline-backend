const mongoose = require("mongoose");

const forumSchema = new mongoose.Schema({
    title: String,
    description: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },
    commentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});
module.exports = mongoose.model('Forum', forumSchema);