const {WebhookClient} = require('dialogflow-fulfillment');

const mongoose = require('mongoose');
const dem = require("../models/Demand");
const cou = require("../models/Coupons");

const Demand = mongoose.model('demand');
const Coupon = mongoose.model('coupon');


module.exports = app => {
    app.post('/', async (req, res) => {
        const agent = new WebhookClient({ request: req, response: res });

        function react(agent) {
            agent.add(`Welcome to my react fulfillment!`);
        }

        async function learn(agent) {

            Demand.findOne({'course': agent.parameters.courses}, function(err, course) {
                if (course !== null ) {
                    course.counter++;
                    course.save();
                } else {
                    const demand = new Demand({course: agent.parameters.courses});
                    demand.save();
                }
            });
            let responseText = `You want to learn about ${agent.parameters.courses}. 
                    Here is a link to all of my courses: https://www.udemy.com/user/jana-bergant`;

            let coupon = await Coupon.findOne({'course': agent.parameters.courses});
            if (coupon !== null ) {
                responseText = `You want to learn about ${agent.parameters.courses}. 
                Here is a link to the course: ${coupon.link}`;
            }

            agent.add(responseText);
        }

        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }
        
        let intentMap = new Map();
        intentMap.set('react', react);
        intentMap.set('learn courses', learn);
        intentMap.set('Default Fallback Intent', fallback);

        agent.handleRequest(intentMap);
    });

}