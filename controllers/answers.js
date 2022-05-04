const Answer = require("../models/answer.js");
const mongoose = require("mongoose");

module.exports.getAnswers = async (req, res) => {
    try {
        const answers =  await Answer.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: '_id',
                    foreignField: 'answerid',
                    as: "comments",
                },
            },
            {
                $project: {
                    __v: 0,
                },
            },
        ]);
        res.status(200).json({ data: answers });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.createAnswer = async (req, res) => {
    const answer = req.body;
    const newAnswer = new Answer({ ...answer, createdAt: new Date().toISOString() });
    try {
        await newAnswer.save();
        res.status(201).json(newAnswer);
        
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

module.exports.plusVote = async (req, res) => {
    
    const { id } = req.params;
    const { value } = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No answer with that id!!');
    const answer = await Answer.findById(id);
    const index = answer.votesPlus.findIndex((id) => id === String(value));
    if(index === -1){
        answer.votesPlus.push(value);
    } else {
        answer.votesPlus = answer.votesPlus.filter((id) => id !== String(value));
    }
    const updatedAnswer = await Answer.findByIdAndUpdate(id, answer, { new: true });

    res.json(updatedAnswer);
};

module.exports.moinVote = async (req, res) => {
    
    const { id } = req.params;
    const { value } = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No answer with that id!!');
    const answer = await Answer.findById(id);
    const index = answer.votesMoin.findIndex((id) => id === String(value));
    if(index === -1){
        answer.votesMoin.push(value);
    } else {
        answer.votesMoin = answer.votesMoin.filter((id) => id !== String(value));
    }
    const updatedAnswer = await Answer.findByIdAndUpdate(id, answer, { new: true });

    res.json(updatedAnswer);
};

module.exports.deleteAnswer = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No answer with that id!!');
    const deletedAnswer = await Answer.findByIdAndRemove(id);
    res.json(deletedAnswer);
};