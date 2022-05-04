const Forum = require("../models/forum.js");
const mongoose = require("mongoose");

const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require('axios');
const cheerio = require('cheerio');

module.exports.getForums = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await Forum.countDocuments({});
        const forums =  await Forum.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        //console.log(Forum);
        res.status(200).json({ data: forums, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
/*
export const getForum = async (req, res) => {
    const { id } = req.params;
    try {
        const forum =  await Forum.findById(id);
        res.status(200).json(forum);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


module.exports.getForums = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 6;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await Forum.countDocuments({});
        const forums =  await Forum.aggregate([
            {
                $lookup: {
                    from: "comments",
                    localField: '_id',
                    foreignField: 'forumid',
                    as: "comments",
                },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: '_id',
                    foreignField: 'forumid',
                    as: "answersDetails",
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $limit: LIMIT,
            },
            {
                $skip: startIndex,
            },
            {
                $project: {
                    __v: 0,
                },
            },
        ]).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        res.status(200).json({ data: forums, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
*/

module.exports.getStackoverflowAnswers = async (req, res) => {
    const { query } = req.params;
    console.log(query);
    const answers = [];
    
const getAnswerFromQuestion = async (website, query, page) => {
    console.log("Website", website);
    await page.goto(website, ["load", "domcontentloaded", "networkidle0"]);
  
    const acceptedAnswer = await page.$(".accepted-answer");
    const { data } = await axios.get(website);
      const $ = cheerio.load(data);
      const acceptedAnswer2 = $('.accepted-answer');
      acceptedAnswer2.find('.answercell.post-layout--right').each((i, element) => {
          const $element = $(element);
          const answer = {};
          answer.avatar = $element.find('.gravatar-wrapper-32 > img').attr('src');
          if($element.find('.user-details > a').length == 2){
              answer.answerer = $($element.find('.user-details > a')[1]).text();
              answer.date = $($element.find('.relativetime')[1]).text();
          } else {
            answer.answerer = $($element.find('.user-details > a')[0]).text();
            answer.date = $($element.find('.relativetime')[0]).text();
          }
          answer.content = $element.find('.s-prose.js-post-body').text();
          answers.push({answer});
      });
    if (!acceptedAnswer) return;
  
  };
  (async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

    const page = await browser.newPage();

    page.on("console", (msg) => {
      for (let i = 0; i < msg._args.length; ++i)
        console.log(`${i}: ${msg._args[i]}`);
    });

    const queryWordArray = query.split(" ");
    const queryFolderId = query.replace(/ /g, "");
    const queryUrl = `${query.replace(/ /g, "%20")}`;
    const googleUrl = `https://www.google.com/search?q=${queryUrl}+site%3Astackoverflow.com`;

    await page.goto(googleUrl, ["load", "domcontentloaded", "networkidle0"]);

    const validUrls = await page.evaluate((queryUrl) => {
      const hrefElementsList = Array.from(
        document.querySelectorAll(
          `div[data-async-context='query:${queryUrl}%20site%3Astackoverflow.com'] a[href]` //from google
        )
      );

      const filterElementsList = hrefElementsList.filter((elem) =>
        elem
          .getAttribute("href")
          .startsWith("https://stackoverflow.com/questions")
      );

      const stackOverflowLinks = filterElementsList.map((elem) =>
        elem.getAttribute("href")
      );

      return stackOverflowLinks;
    }, queryUrl);

    const keywordLikeability = [];

    validUrls.forEach((url) => {
      let wordCounter = 0;

      queryWordArray.forEach((word) => {
        if (url.indexOf(word) > -1) {
          wordCounter = wordCounter + 1;
        }
      });

      if (queryWordArray.length / 2 < wordCounter) {
        keywordLikeability.push({
          keywordMatch: wordCounter,
          url: url,
        });
      }
    });
    //console.log(keywordLikeability);

    /*

    Order by number of matched words

      keywordLikeability.sort((a, b) =>
        b.keywordMatch > a.keywordMatch ? 1 : -1
      );

    */
  
    await (async function () {
      for (var i = 0; i < keywordLikeability.length; i++) {
        if (i < 4) {
          await getAnswerFromQuestion(
            keywordLikeability[i].url,
            queryFolderId,
            page
          );
        }
      }

      await browser.close();
      res.json({ data: answers });
      //console.log(answers);
    })();
  } catch (error) {
    console.log("Error " + error.toString());
  }
})();
};

module.exports.getForumsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const forums =  await Forum.aggregate([
            {
                $match: { creator: userId },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: '_id',
                    foreignField: 'forumid',
                    as: "comments",
                },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: '_id',
                    foreignField: 'forumid',
                    as: "answersDetails",
                },
            },
            {
                $project: {
                    __v: 0,
                },
            },
        ]);
        res.status(200).json({ data: forums });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.getForum = async (req, res) => {
    const { id } = req.params;
    try {
        const forum =  await Forum.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(id) },
            },
            {
                $lookup: {
                    from: "answers",
                    localField: '_id',
                    foreignField: 'forumid',
                    as: "answersDetails",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: '_id',
                    foreignField: 'forumid',
                    as: "comments",
                },
            },
            {
                $project: {
                    __v: 0,
                },
            },
        ]);
        res.status(200).json(forum);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
/**/

module.exports.getForumsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i'); // Test test TEST -> test
        const forums = await Forum.find({ $or: [ { title }, { tags: { $in: tags.split(',') } } ]});
        res.json({ data: forums });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

module.exports.createForum = async (req, res) => {
    const forum = req.body;
    const newForum = new Forum({ ...forum, createdAt: new Date().toISOString() });
    try {
        await newForum.save();
        res.status(201).json(newForum);
        
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

module.exports.updateForum = async (req, res) => {
    const { id: _id } = req.params;
    const forum = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No forum with that id!!');

    const updatedForum = await Forum.findByIdAndUpdate(_id, { ...forum, _id }, { new: true });
    res.json(updatedForum);
};

module.exports.deleteForum = async (req, res) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No forum with that id!!');
    await Forum.findByIdAndRemove(id);
    res.json({ message: 'Forum deleted successfully' });
};

module.exports.likeForum = async (req, res) => {
    /*const { id } = req.params;
    if(!req.userId) return res.json({ message: 'Unauthenticated' });
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No forum with that id!!');
    const forum = await Forum.findById(id);
    const index = forum.likes.findIndex((id) => id === String(req.userId));
    if(index === -1){
        forum.likes.push(req.userId);
    } else {
        forum.likes = forum.likes.filter((id) => id !== String(req.userId));
    }
    const updatedForum = await Forum.findByIdAndUpdate(id, forum, { new: true });*/
    //console.log(req.body)
    //res.json(updatedForum);
    const { id } = req.params;
    const { value } = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No forum with that id!!');
    const forum = await Forum.findById(id);
    const index = forum.likes.findIndex((id) => id === String(value));
    if(index === -1){
        forum.likes.push(value);
    } else {
        forum.likes = forum.likes.filter((id) => id !== String(value));
    }
    const updatedForum = await Forum.findByIdAndUpdate(id, forum, { new: true });

    res.json(updatedForum);
};

module.exports.commentForum = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    const forum = await Forum.findById(id);
    forum.comments.push(value);
    const updatedForum = await Forum.findByIdAndUpdate(id, forum, { new: true });

    res.json(updatedForum);
};
