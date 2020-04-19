const chatbot = require('../chatbot/chatbot')
const _ = require('lodash')
const googleIt = require('google-it')

module.exports = app => {

    app.post('/api/df_text_query', async (req, res) => {
        let responses = null
        try {
            responses = await chatbot.textQuery(req.body.text, req.body.userID, req.body.parameters)
            if (_.get(responses, '[0].queryResult.intent.displayName') === 'Default Fallback Intent') {
                googleIt({ 'query': responses[0].queryResult.queryText })
                    .then(results => {
                        res.send(results)
                    }).catch(e => {
                        // any possible errors that might have occurred (like no Internet connection)
                    })
            }
            else {
                res.send(responses[0].queryResult)
            }
        } catch (e) {
            throw e
        }
    })

    app.post('/api/df_event_query', async (req, res) => {
        let responses = null
        try {
            responses = await chatbot.eventQuery(req.body.event, req.body.userID, req.body.parameters)
        } catch (e) {
            throw e
        }
        res.send(responses[0].queryResult)
    })
}