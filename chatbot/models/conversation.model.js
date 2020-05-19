const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    conversation: [{
        text: String,
        link: String,
        quick_replies: [{
            payload: String,
            text: String,
            user_says: String
        }],
        tutorials: [],
        speaks: String,
        google_search: [{
            title: String,
            link: String,
            snippet: String
        }]
    }],
    user_id: String,
    conversation_id: String
},
    {
        timestamps: true
    }
)

module.exports = mongoose.model('conversation', conversationSchema);