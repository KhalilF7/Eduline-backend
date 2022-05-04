const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('https://stackoverflow.com/questions/71980721/comparing-two-objects-with-operator');
    //await page.goto('https://www.quora.com/Is-data-scraping-easy');
    await page.setViewport({
        width: 1200,
        height: 800
    });

    await autoScroll(page);// keep scrolling till resolution

    var answers = await page.evaluate(() => {
      var Answerrers = document.querySelectorAll('.accepted-answer .answercell.post-layout--right .user-details > a');
      var Answers = document.querySelectorAll('.accepted-answer .answercell.post-layout--right .s-prose.js-post-body');
      
      var titleLinkArray = [];
      for (var i = 0; i < Answerrers.length; i++) {
        titleLinkArray[i] = {
          
          Answerrer: Answerrers[i].innerText.trim(),
          Answer: Answers[i].innerText.trim(),

        };

      }
      return titleLinkArray;
    });
    console.log(answers);

    fs.writeFile("quora_answers.json", JSON.stringify(answers), function(err) {
      if (err) throw err;
      console.log("The answers have been saved!");
    });
    const acceptedAnswer = await page.$(".accepted-answer");

    await acceptedAnswer.screenshot({
        path: 'quora.png',
    });
      console.log("The screenshot has been saved!");

    await browser.close();
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){//a few of the last scrolling attempts have brought no new data so the distance we tried to scroll is now greater than the actual page height itself
                    clearInterval(timer);//reset 
                    resolve();
                }
            }, 100);
        });
    });
}