import React, { Component } from 'react';
import QuickReply from './QuickReply';


class QuickReplies extends Component {
    constructor(props) {
        super(props);
        this._handleClick = this._handleClick.bind(this);
    }

    _handleClick(event, payload, text) {
        this.props.replyClick(event, payload, text);
    }

    renderQuickReply(reply, i) {
        return <QuickReply key={i} click={this._handleClick} reply={reply} />;
    }

    renderQuickReplies(quickReplies) {
        if (quickReplies) {
            return quickReplies.map((reply, i) => {
                return this.renderQuickReply(reply, i);
            }
            )
        } else {
            return null;
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', margin: '10px' }}>
                <div>
                    <img src="https://img.icons8.com/wired/2x/bot.png" alt="Smiley face" height="42" width="42"></img>
                </div>
                <div>
                    <div style={{
                        borderRadius: '10px',
                        backgroundColor: '#408bd6',
                        padding: '10px',
                        position: 'relative',
                        color: 'aliceblue',
                        marginBottom: '5px',
                        maxWidth: '525px'
                    }}>
                        {
                            this.props.text && <div style={{ marginBottom: '10px', lineHeight: '19px' }}>
                                {this.props.text.stringValue}
                            </div>
                        }
                    </div>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap'
                    }}>{this.props.payload && this.renderQuickReplies(this.props.payload)}</div>
                </div>
            </div >
        );
    }
}

export default QuickReplies;
