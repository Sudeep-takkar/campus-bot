import React from 'react';
import _ from 'lodash';
import YouTube from 'react-youtube';
import Carousel from 'react-material-ui-carousel'
import './Message.css'
class Message extends React.Component {

    _onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    render() {
        if (_.isArray(this.props.text) && _.isEmpty(_.get(this.props, 'text[0]'))) {
            return null
        }

        const opts = {
            playerVars: {
                autoplay: 0
            }
        };

        return (
            <div>
                {this.props.speaks === 'bot' &&
                    <div style={{ display: 'flex' }}>
                        <div>
                            <img src="https://img.icons8.com/wired/2x/bot.png" alt="Smiley face" height="42" width="42"></img>
                        </div>

                        <div style={{
                            borderRadius: '10px',
                            backgroundColor: '#408bd6',
                            padding: '10px',
                            position: 'relative',
                            color: 'aliceblue',
                            maxWidth: '525px'
                        }}>
                            <div style={{ marginBottom: '10px', lineHeight: '19px' }}>
                                {this.props.text}
                            </div>
                            {this.props.link && <div><a target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-word' }} href={this.props.link} >{this.props.link}</a></div>}
                        </div>
                    </div>
                }
                {this.props.speaks === 'user' &&
                    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                        <div style={{
                            borderRadius: '10px',
                            backgroundColor: '#ee6e73',
                            padding: '10px',
                            position: 'relative',
                            marginRight: '5px',
                            color: 'aliceblue',
                            maxWidth: '525px'
                        }}>
                            <div style={{ lineHeight: '19px', wordBreak: 'break-word' }}>
                                {this.props.text}
                            </div>
                        </div>
                        <div>
                            <img src="//cdn.onlinewebfonts.com/svg/img_411978.png" alt="Smiley face" height="42" width="42"></img>
                        </div>
                    </div>
                }
                {this.props.tutorials && <Carousel autoPlay={false} animation="slide" indicators={true}>
                    {_.map(this.props.tutorials, (tut, i) => <YouTube
                        className="youtube-video"
                        containerClassName="youtube-video-container"
                        videoId={tut}
                        opts={opts}
                        key={i}
                        onReady={this._onReady}
                    />
                    )}
                </Carousel>}
            </div>
        );
    }
}

export default Message;