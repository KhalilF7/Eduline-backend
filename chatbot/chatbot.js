'use strict'
const dialogflow = require('dialogflow');
const structjson = require('./structJson');
const config = require('../config/keys');
const mongoose = require('mongoose');
const reg = require("../models/Registration");

const projectID = config.googleProjectID;

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectID, credentials});

const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

const Registration = mongoose.model('registration');

module.exports = {
    textQuery: async function(text, parameters = {}) {
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: text,
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
        };
        let responses = await sessionClient .detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },

    eventQuery: async function(event, parameters = {}) {
        let self = module.exports;

        //the event query request
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    //the query to send to the dialogflow agent
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters),
                    //the language used by the client
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            },
        };
        //send request and log result
        let responses = await sessionClient.detectIntent(request);
        responses = await self.handleAction(responses);
        return responses;
    },


    //add a case, that switches between action name
    handleAction: function(responses){
        let self = module.exports;     //define self and set it to module.exports to call saveRegistration
        let queryResult = responses[0].queryResult;
        switch (queryResult.action) {
            case 'Extracourses-yes':
                //queryResult is set when all the parameters requires
                if (queryResult.allRequiredParamsPresent) {  //read parameters
                    self.saveRegistration(queryResult.parameters.fields);
                }
                break;
        }

        console.log(queryResult.action);
        //console.log(queryResult.allRequiredParamsPresent);
        //console.log(queryResult.fulfillmentMessages);
        //console.log(queryResult.parameters.fields);

        return responses;
    },

    saveRegistration: async function(fields){
        const registration = new Registration({
            name: fields.name.stringValue,
            address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            email: fields.email.stringValue,
            dateSent: Date.now()
        });
        try{
            let reg = await registration.save();
            console.log(reg);
        } catch (err){
            console.log(err);
        }
    }
}