import axios from "axios/index";
import _ from 'lodash'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export const MessageHelper = async (messages) => {
    let conversation = _.map(messages, msg => {
        return {
            text: _.isArray(_.get(msg, 'msg.text.text')) ? _.get(msg, 'msg.text.text.0') : (_.get(msg, 'msg.text.text') || _.get(msg, 'msg.payload.fields.text.stringValue') || _.get(msg, 'msg.payload.fields.text')),
            link: _.get(msg, 'msg.payload.fields.link.stringValue'),
            tutorials: _.map(_.get(msg, 'msg.payload.fields.tutorials.listValue.values'), 'stringValue'),
            speaks: msg.speaks,
            quick_replies: _.map(_.get(msg, 'msg.payload.fields.quick_replies.listValue.values'), (reply) => {
                return {
                    payload: _.get(reply, 'structValue.fields.payload.stringValue'),
                    text: _.get(reply, 'structValue.fields.text.stringValue'),
                    user_says: _.get(reply, 'structValue.fields.user_says.stringValue')
                }
            }),
            google_search: _.get(msg, 'msg.payload.fields.cards')
        }
    })
    await axios.get(`/api/getConversation?conversation_id=${cookies.get('conversation_id')}`)
        .then(res => {
            if (_.isEmpty(res.data)) {
                axios.post('/api/add/conversation', { conversation, conversation_id: cookies.get('conversation_id'), user_id: cookies.get('user_id') })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        throw err
                    })
            }
            else {
                axios.post('/api/updateConversation', { conversation, conversation_id: cookies.get('conversation_id') })
                    .then(res => {
                        return res
                    })
                    .catch(err => {
                        throw err
                    })
            }
        })
        .catch(err => {
            throw err
        })
}