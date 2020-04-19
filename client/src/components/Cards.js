import React, { Component } from 'react';
import CardItem from './Card';
import Carousel from 'react-material-ui-carousel'
import _ from 'lodash'
import './Cards.css'

class Cards extends Component {

    renderCards(cards) {
        if (cards) {
            return <Carousel className="carousel-cards" autoPlay={false} animation="slide">
                {_.map(cards, (data, i) => <CardItem key={i} data={data} />
                )}
            </Carousel>
        } else {
            return null;
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', margin: '10px', flexDirection: 'column' }}>
                <div style={{ display: 'flex' }}>
                    <img src="https://img.icons8.com/wired/2x/bot.png" alt="Smiley face" height="42" width="42"></img>
                    <div style={{
                        borderRadius: '10px',
                        backgroundColor: '#408bd6',
                        padding: '10px',
                        position: 'relative',
                        color: 'aliceblue',
                        maxWidth: '525px'
                    }}>
                        {this.props.text && <div style={{ marginBottom: '10px', lineHeight: '19px' }}>
                            {this.props.text}
                        </div>}
                    </div>
                </div>
                <div style={{ margin: '10px' }}>{this.props.cards && this.renderCards(this.props.cards)}</div>
            </div >
        );
    }
}

export default Cards;
