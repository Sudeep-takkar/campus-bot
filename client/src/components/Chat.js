import React from 'react';
import Box from '@material-ui/core/Box';
import axios from "axios/index";
import TextField from '@material-ui/core/TextField';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';
import { Button } from '@material-ui/core';
import _ from 'lodash';
import Rating from '@material-ui/lab/Rating';
import { TextareaAutosize } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ClearRounded from '@material-ui/icons/ClearRounded';
import SendRounded from '@material-ui/icons/SendRounded'

import Message from './Message';
import Cards from './Cards.js';
import QuickReplies from './QuickReplies';

import campusBotLogo from '../campusbot_transparent_logo.png';

import { MessageHelper } from '../utils'

import './Chat.css'
const cookies = new Cookies();

class Chat extends React.Component {
    messagesEnd;
    talkInput;

    constructor(props) {
        super(props);
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);
        this._sendMessage = this._sendMessage.bind(this);

        this.state = {
            messages: [],
            isTyping: false,
            showRating: false,
            showGoodbye: false,
            rating: 1
        };

        //this.talkInput = React.createRef();
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
            const res = await axios.post('/api/df_text_query', { text: queryText, userID: cookies.get('user_id') });
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
            this.setState({ messages: [...this.state.messages, says], isTyping: false }, () => {
                let { messages } = this.state
                MessageHelper(messages)
            });
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
            const res = await axios.post('/api/df_event_query', { event: eventName, userID: cookies.get('user_id') });
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

        if (cookies.get('user_id') === undefined) {
            cookies.set('user_id', uuid(), { path: '/' });
        }
        cookies.set('conversation_id', uuid(), { path: '/' });

        this.setState({ isTyping: false });
    }

    componentDidUpdate() {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }
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

    _sendMessage(event) {
        if (_.get(event, 'target.value')) {
            this.df_text_query(event.target.value);
            event.target.value = '';
        }
        else if (_.get(this.talkInput, 'value')) {
            this.df_text_query(this.talkInput.value);
            this.talkInput.value = '';
        }
    }

    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this._sendMessage(e)
        }
    }

    _handleEndChat = () => {
        this.setState({
            showRating: true
        })
    }

    _handleRatingChange = (event, newValue) => {
        this.setState({
            rating: newValue
        })
    }

    _handleSubmitFeedback = () => {
        this.setState({
            showGoodbye: true,
            showRating: false
        })
    }

    render() {
        const { isTyping, messages } = this.state

        return (
            <Box color="primary.main"
                bgcolor="background.paper"
                p={{ xs: 2, sm: 2, md: 2 }}
                mx={{ xs: 2, sm: 2, md: 45 }}
                my={{ xs: 2, sm: 2, md: 5 }}
                minHeight={300}
                className={this.state.showRating ? 'box-container-rating' : 'box-container'}
            >
                {!this.state.showRating && !this.state.showGoodbye && <>
                    <AppBar position="static" color="transparent" style={{ boxShadow: 'none', borderBottom: '1px solid ' }}>
                        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', padding: '0' }}>
                            <img src={campusBotLogo} style={{ width: '255px', height: '65px' }} alt="CampusBot" />
                            <IconButton edge="start" color="inherit" aria-label="menu" onClick={this._handleEndChat}>
                                <ClearRounded style={{ color: '#224b75' }} />
                            </IconButton>
                        </Toolbar>
                    </AppBar><div style={{
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: '525px',
                        maxHeight: '525px',
                        padding: '0 16px 16px 16px'
                    }}>
                        <div>
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
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', borderTop: '1px solid' }}>
                        <TextField
                            id="user_says"
                            placeholder="Type your message"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            margin="dense"
                            variant="outlined"
                            inputRef={(input) => { this.talkInput = input; }}
                            onKeyPress={this._handleInputKeyPress}
                            autoFocus={true}
                            style={{ flex: '3', margin: 8 }}
                        />

                        <IconButton edge="start" color="inherit" aria-label="menu" onClick={this._sendMessage}>
                            <SendRounded style={{ color: '#224b75' }} />
                        </IconButton>
                        {/* <Button variant="contained" onClick={this._sendMessage} size="small">Send</Button> */}
                    </div>
                </>}
                {this.state.showRating && !this.state.showGoodbye &&
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        minHeight: '300px',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        <h3>Tell us how was your experience?</h3>
                        <Rating
                            name="simple-controlled"
                            value={this.state.rating}
                            onChange={this._handleRatingChange}
                            size="large"
                        />
                        <TextareaAutosize
                            rowsMin={12}
                            aria-label="maximum height"
                            placeholder="Type your valuable feedback here."
                        />
                        <Button variant="contained" onClick={this._handleSubmitFeedback}>Submit</Button>
                    </div>
                }
                {
                    !this.state.showRating && this.state.showGoodbye && <div style={{ textAlign: 'center' }}>
                        <h3>Thanks for your valuable feedback!</h3>
                    </div>
                }
            </Box>
        )
    }
}

export default Chat;