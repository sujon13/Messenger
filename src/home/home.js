import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import LeftTopBar from './LeftNavbar';
import Chat from './Chat';
import UserList from './UserList';
import ChatList from './ChatList';
import { Divider } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(0),
        maxHeight: '100%'
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    list: {
        marginTop: theme.spacing(0),
        maxHeight: '80vh',
        overflow: 'auto',
    },
    option: {
        marginTop: theme.spacing(2),
    },
}));


export default function Home() {
    const classes = useStyles();

    const [isChatShown, setIsChatShown] = useState(true);
    const [user, setUser] = useState({name: 'xx', profilePic: 'yy'});

    function handleUser(user) {
        alert(user.name);
        setUser(user);
    }
    return (
        <div className={classes.root}>
            <Grid 
                container 
                direction="row" 
                spacing={0}
            >
                <Grid container item direction="col" sm={4}>
                    <Grid item xs={12}>
                        <LeftTopBar/>
                    </Grid>
                    <Grid container item xs={12} style={{marginTop: "0px"}}>
                        <Grid item xs={6}>
                            <Button
                                variant="text"
                                onClick={() => setIsChatShown(true)}
                            >
                                Chats
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button 
                                variant="text"
                                onClick={() => setIsChatShown(false)}
                            >
                                All users
                            </Button>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} className={classes.list}>
                        {
                            isChatShown === true 
                                ? <ChatList handleUser = { handleUser }/> 
                                : <UserList handleUser= { handleUser }/>
                        }
                    </Grid>
                </Grid>
                <Grid item sm={8}>
                    <Chat user = {user}/>
                </Grid>
            </Grid>
        </div>
    );
}