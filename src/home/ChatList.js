import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Avatar } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import image1 from './../static/images/image1.jpg';
import profile2 from './../static/images/profile2.jpg';
import profile3 from './../static/images/profile3.jpg';
import profile4 from './../static/images/profile4.jpg';
import profile5 from './../static/images/profile5.png';
import axios from 'axios';
import {isEmpty} from "lodash"
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    paper: {

    },
    avatar: {
        margin: theme.spacing(2),
        flexGrow: 1,
    },
    title: {
        //flexGrow: 1,
    },
    list: {
        marginTop: theme.spacing(1),
        backgroundColor: '#f5f2ed',
    }
}));

function Message(props) {
    const classes = useStyles();

    function formatTime(chatTime) {
        const chatDate = new Date(chatTime);   
        //const chatDate = new Date(2019, 9, 1);     
        const today = new Date();
        const time = moment(chatDate);
    
        if (chatDate.getDay() === today.getDay()) {
            return time.format('hh:mm a');
        } 

        const timeDifference = (Date.now() - chatDate.getTime()) / ( 24 * 60 * 60 * 1000);
        console.log('time difference: ', timeDifference);

        if (timeDifference < 7) {
            return time.format('dddd');
        }

        if (chatDate.getFullYear() === today.getFullYear()) {
            return time.format('MMM D');
        }
        return time.format('MMM D YYYY');
    }
    return (
        <Grid container>
            <Grid item xs={7}>
                <Typography 
                    variant="subtitle2"  
                >
                    { props.message.text }
                </Typography>
            </Grid>
            <Grid item xs={5}>
                <Typography 
                    variant="subtitle2"  
                >
                    { formatTime(props.message.time) }
                </Typography>
            </Grid>
        </Grid>
    );
}

export default function ChatList(props) {
    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatList, setChatList] = useState([]);

    function getUser(email) {
        const userList = props.userList.filter((user) => {
            return user.email === email
        });
        return userList[0];
    }

    function addUserToChatList (chatList) {
        return chatList.map((chat) => {
            if (chat.to === props.owner.email) {
                const user = getUser(chat.from);
                return {
                    ...chat,
                    to: user
                }
            } else {
                const user = getUser(chat.to);
                return {
                    ...chat,
                    text: 'You: ' + chat.text,
                    to: user
                }
            }
        });
    }

    const fetchMessages = async (from, to) => {
        const option = {
            method: 'GET',
            url: 'http://localhost:4001/api/v1/lastMessages',
            params: {
                owner: JSON.stringify(props.owner),
                userList: JSON.stringify(props.userList),
                skip: 0
            }
        };
        console.log(option);
        setIsLoading(true);
        setError('');
        try {
            const response = await axios(option);
            if (response.data) {
                console.log(response.data);
                console.log(getUser(response.data[0].to));
                const modifiedChatList = addUserToChatList(response.data);
                console.log(modifiedChatList);
                setChatList([...modifiedChatList]);
                //message_list = [...response.data, ...message_list];
                //setLoadMessage(Date.now());
                if (response.data.length === 0) {
                    localStorage.setItem('noMoreData', 'true');
                }
                //setPageForUserList(pageForUserList + 1);
                setIsLoading(false);
            }
        } catch(error) {
            console.log(error);
            if(error.response) {
                setError('something went wrong!');
            }
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if ( 
            props.owner === undefined ||
            props.userList === undefined ||
            isEmpty(props.owner) ||
            props.userList.length === 0
        ) {
            console.log('no fetch');
            return;
        }
        console.log('fetch last messages start');
        fetchMessages();
    }, [props.userList, props.owner]);

    if (isLoading) {
        return (
            <div style={{textAlign: 'center'}}><CircularProgress/></div>
        );
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={1}>
                <Grid container direction="col">
                    <React.Fragment>
                        {
                            chatList.map((chat, index) => 
                                <Grid
                                    key={index.toString()}
                                    container
                                    item 
                                    direction="row" 
                                    className={classes.list}
                                    //onClick={() => { props.handleUser(user)}}
                                >
                                    <Grid item xs={2}> 
                                        <Avatar 
                                            alt={''} 
                                            src={''}
                                        />
                                    </Grid>
                                    <Grid item container direction="col" xs={10}>
                                        <Grid item xs={12}>
                                            <Typography 
                                                variant="body1"  
                                                className={classes.title}
                                            >
                                                {chat.to.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Message message = {chat}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </React.Fragment>
                </Grid>
                <Divider/>
            </Paper>
        </div>
    );
}