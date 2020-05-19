import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Chat from './Chat';

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        textAlign: 'center'
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
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Campus Bot
                    </Typography>
                </Toolbar>
            </AppBar>
            <Chat />
        </div>
    )
}

export default App;