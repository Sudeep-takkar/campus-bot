import React from 'react';
import Link from '@material-ui/core/Link';

const QuickReply = (props) => {
    if (props.reply.structValue.fields.payload) {
        return (
            <Link
                style={{
                    margin: 3, fontSize: '12px', backgroundColor: '#ff9ea1',
                    borderRadius: '24px', padding: '7.5px'
                }}
                href="/"
                onClick={(event) =>
                    props.click(event, props.reply.structValue.fields.payload.stringValue,
                        props.reply.structValue.fields.user_says.stringValue)}
                variant="body2">
                {props.reply.structValue.fields.text.stringValue}
            </Link>
        );
    }
};

export default QuickReply;