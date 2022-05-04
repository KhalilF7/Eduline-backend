const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require('axios');
const cheerio = require('cheerio');

const args = process.argv;
const query = args[2];
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
        answer.answerer = $element.find('.user-details > a').text();
        answer.content = $element.find('.s-prose.js-post-body').text();
        answers.push({answer});
    });
    fs.writeFile("answers.json", JSON.stringify(answers), function(err) {
        if (err) throw err;
        console.log("The answers have been saved!");
      });
  if (!acceptedAnswer) return;

};

(async () => {
    try {
      const browser = await puppeteer.launch({
        headless: true,
      });
  
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
      })();
    } catch (error) {
      console.log("Error " + error.toString());
    }
  })();