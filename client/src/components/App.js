import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Chat from './Chat';

const useStyles = makeStyles((theme) => ({
    title: {
        textAlign: 'center',
        marginRight: '10px'
    },
    appBar: {
        backgroundColor: '#408bd6'
    }
}));

const App = () => {
    const classes = useStyles();
    return (
        <div>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar style={{ justifyContent: 'center' }}>
                    <Typography variant="h6" className={classes.title}>
                        CampusBot
                    </Typography>
                    <Typography variant="body1" className={classes.title}>|   effective international student engagement</Typography>
                </Toolbar>
            </AppBar>
            <Chat />
        </div>
    )
}

export default App;