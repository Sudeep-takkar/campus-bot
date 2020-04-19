import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        width: '50%'
    }
});

const CardItem = (props) => {
    const classes = useStyles();

    if (props.data) {
        return (
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {props.data.title ? props.data.title : ''}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.data.snippet ? props.data.snippet : ''}
                        <br />
                    </Typography>
                </CardContent>
                <CardActions style={{ justifyContent: 'center' }}>
                    <Link
                        href={props.data.link ? props.data.link : '#'}
                        variant="body2">
                        Learn More
                    </Link>
                </CardActions>
            </Card>
        );
    }
};

export default CardItem;