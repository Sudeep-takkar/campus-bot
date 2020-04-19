'use strict'
const dialogflow = require('dialogflow')
const structjson = require('./structjson')
const config = require('../config/keys')

const projectID = config.googleProjectID
const sessionID = config.dialogFlowSessionID

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
}
const sessionClient = new dialogflow.SessionsClient({ projectID, credentials })

module.exports = {
    textQuery: async function (text, userID, parameters = {}) {
        let self = module.exports
        const sessionPath = sessionClient.sessionPath(projectID, sessionID + userID)
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
        let responses = null
        try {
            responses = await sessionClient.detectIntent(request)
            responses = await self.handleAction(responses)
        } catch (e) {
            throw e
        }
        return responses
    },
    handleAction: function (responses) {
        return responses;
    },
    eventQuery: async function (event, userID, parameters = {}) {
        let self = module.exports
        const sessionPath = sessionClient.sessionPath(projectID, sessionID + userID)
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters),
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            }
        };
        let responses = null
        try {
            responses = await sessionClient.detectIntent(request)
            responses = await self.handleAction(responses)
        } catch (e) {
            throw e
        }
        return responses
    }
}