import React from 'react';
import Link from '@material-ui/core/Link';

const QuickReply = (props) => {
    if (props.reply.structValue.fields.payload) {
        return (
            <Link
                style={{
                    margin: 3, fontSize: '12px', backgroundColor: 'rgb(107 149 190)',
                    borderRadius: '24px', padding: '7.5px', color: 'white', textDecoration: 'none',
                    fontWeight: '500'
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