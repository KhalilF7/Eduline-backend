const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    forumid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum"
    },
    answerid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Answer"
    },
    content: String,
    name: String,
    creator: String,
    votes: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model('Comment', commentSchema);