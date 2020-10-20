const chatbot = require('../chatbot/chatbot')
const _ = require('lodash')
const googleIt = require('google-it')
let Conversation = require('../chatbot/models/conversation.model')

module.exports = app => {

    app.post('/api/df_text_query', async (req, res) => {
        let responses = null
        try {
            responses = await chatbot.textQuery(req.body.text, req.body.userID, req.body.parameters)
            if (_.get(responses, '[0].queryResult.intent.displayName') == 'Default Fallback Intent') {
                googleIt({ 'query': responses[0].queryResult.queryText })
                    .then(results => {
                        res.send(results)
                    }).catch(e => {
                        // any possible errors that might have occurred (like no Internet connection)
                        console.log(e)
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

    app.post('/api/add/conversation', (req, res) => {
        try {
            const conversation = req.body.conversation
            const newConversation = new Conversation({ conversation, conversation_id: req.body.conversation_id, user_id: req.body.user_id })
            newConversation.save()
                .then((result) => res.json(result))
                .catch(err => res.status(400).json('Error:' + err))
        }
        catch (e) {
            throw e
        }
    })

    app.get('/api/getConversation', async (req, res) => {
        try {
            await Conversation.findOne({ conversation_id: req.query.conversation_id },
                (err, result) => {
                    if (err) throw err
                    res.send(result)
                })
        }
        catch (e) {
            throw e
        }
    })

    app.post('/api/updateConversation', async (req, res) => {
        try {
            await Conversation.findOneAndUpdate({ conversation_id: req.body.conversation_id }, { $set: { conversation: req.body.conversation } }, { new: true },
                (err, result) => {
                    if (err) throw err
                    res.send(result)
                })
        }
        catch (e) {
            throw e
        }
    })
}