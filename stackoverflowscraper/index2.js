const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const page_url = 'https://stackoverflow.com/questions/71980721/comparing-two-objects-with-operator';

async function getAnswerFromQuestion() {
    const { data } = await axios.get(page_url);
    const $ = cheerio.load(data);
    const acceptedAnswer = $('.accepted-answer');
    const answers = [];
    acceptedAnswer.find('.answercell.post-layout--right').each((i, element) => {
        const $element = $(element);
        const answer = {};
        answer.answerer = $element.find('.user-details > a').text();
        answer.content = $element.find('.s-prose.js-post-body').text();
        console.log(answer);
        answers.push(answer);
    });
    fs.writeFile("answers.json", JSON.stringify(answers), function(err) {
        if (err) throw err;
        console.log("The answers have been saved!");
      });
};
getAnswerFromQuestion();