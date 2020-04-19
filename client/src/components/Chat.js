import React from 'react';
import Box from '@material-ui/core/Box';
import axios from "axios/index";
import TextField from '@material-ui/core/TextField';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import _ from 'lodash';

import Message from './Message';
import Cards from './Cards.js';
import QuickReplies from './QuickReplies';

import './Chat.css'
const cookies = new Cookies();

class Chat extends React.Component {
    messagesEnd;
    talkInput;

    constructor(props) {
        super(props);
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

        this.state = {
            messages: [],
            isTyping: false
        };
        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
    }

    async df_text_query(queryText) {
        let says = {
            speaks: 'user',
            msg: {
                text: {
                    text: queryText
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says] });
        try {
            const res = await axios.post('/api/df_text_query', { text: queryText, userID: cookies.get('userID') });
            if (!_.isEmpty(_.get(res, 'data.fulfillmentMessages'))) {
                for (let msg of res.data.fulfillmentMessages) {
                    says = {
                        speaks: 'bot',
                        msg: msg
                    }
                }
            }
            else if (_.get(res, 'status') === 200 && !_.isEmpty(_.get(res, 'data'))) {
                says = {
                    speaks: 'bot',
                    msg: {
                        payload: {
                            fields: {
                                text: 'Please find below the response from Google.',
                                cards: _.get(res, 'data')
                            }
                        }
                    }
                }
            }
            this.setState({ isTyping: true })
            await this.resolveAfterXSeconds(1);
            this.setState({ messages: [...this.state.messages, says], isTyping: false });
        } catch (e) {
            says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having troubles. I need to terminate. will be back later"
                    }
                }
            }
            this.setState({ messages: [...this.state.messages, says] });
        }
    };

    async df_event_query(eventName) {

        try {
            const res = await axios.post('/api/df_event_query', { event: eventName, userID: cookies.get('userID') });

            for (let msg of res.data.fulfillmentMessages) {
                let says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says] });
            }
        } catch (e) {
            let says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having troubles. I need to terminate. will be back later"
                    }
                }
            }

            this.setState({ messages: [...this.state.messages, says] });
        }
    };

    resolveAfterXSeconds = (x) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(x);
            }, x * 1000);
        })
    }

    async componentDidMount() {
        this.setState({ isTyping: true })
        await this.resolveAfterXSeconds(1);
        this.df_event_query('Welcome');
        this.setState({ showBot: true, isTyping: false });
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        if (this.talkInput) {
            this.talkInput.focus();
        }
    }

    _handleQuickReplyPayload(event, payload, text) {
        event.preventDefault();
        event.stopPropagation();

        switch (payload) {
            default:
                this.df_text_query(text);
                break;
        }
    }

    renderOneMessage(message, i) {
        if (message.msg && message.msg.text && message.msg.text.text && !_.isEmpty(_.get(message, 'msg.text.text'))) {
            return <Message key={i} speaks={_.get(message, 'speaks')} text={_.get(message, 'msg.text.text')} />;
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.link) {
            return <Message key={i} speaks={_.get(message, 'speaks')} text={_.get(message, 'msg.payload.fields.text.stringValue')} link={_.get(message, 'msg.payload.fields.link.stringValue')} />
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.tutorials
        ) {
            return <Message
                text={_.get(message, 'msg.payload.fields.text.stringValue')}
                key={i}
                speaks={message.speaks}
                tutorials={_.map(_.get(message, 'msg.payload.fields.tutorials.listValue.values'), 'stringValue')} />;
        }
        else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.quick_replies
        ) {
            return <QuickReplies
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values} />;
        }
        else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.cards
        ) {
            return <Cards
                text={_.get(message, 'msg.payload.fields.text')}
                key={i}
                speaks={message.speaks}
                cards={_.get(message, 'msg.payload.fields.cards')} />;
        }
    }

    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return this.renderOneMessage(message, i);
            }
            )
        } else {
            return null;
        }
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    render() {
        const { isTyping, messages } = this.state

        return (
            <Box color="primary.main"
                bgcolor="background.paper"
                p={{ xs: 2, sm: 2, md: 2 }}
                mx={{ xs: 2, sm: 2, md: 45 }}
                my={{ xs: 2, sm: 2, md: 5 }}
                style={{
                    border: '1px solid',
                    borderRadius: '6px',
                    fontFamily: '"Segoe UI","Helvetica Neue","Helvetica","Lucida Grande",Arial,"Ubuntu","Cantarell","Fira Sans",sans-serif'
                    , fontSize: '15px'
                }}
            >
                <div style={{
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '550px',
                    maxHeight: '550px'
                }}>
                    <div style={{ flexGrow: '1' }}>
                        {this.renderMessages(messages)}
                        <div ref={(el) => { this.messagesEnd = el; }}
                            style={{ float: "left", clear: "both" }}>
                        </div>
                    </div>
                    <div
                        style={{
                            justifyContent: 'center', display: isTyping ? 'flex' : 'none', padding: '10px'
                        }}>
                        <span className='typing-dot'></span>
                        <span className='typing-dot'></span>
                        <span className='typing-dot'></span>
                    </div>
                </div>
                <TextField
                    id="user_says"
                    style={{ margin: 8 }}
                    placeholder="Type your message"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="dense"
                    variant="outlined"
                    inputRef={(input) => { this.talkInput = input; }}
                    onKeyPress={this._handleInputKeyPress}
                    autoFocus={true}
                    style={{ flex: 'none' }}
                />
            </Box>
        )
    }
}

export default Chat;