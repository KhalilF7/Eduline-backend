const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    forumid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Forum",
    },
    answer: String,
    name: String,
    creator: String,
    votesPlus: {
        type: [String],
        default: []
    },
    votesMoin: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    commentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
});

module.exports = mongoose.model('Answer', answerSchema);