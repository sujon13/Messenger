import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import socketIOClient from "socket.io-client";
import axios from 'axios';
import {isEmpty} from "lodash";
import moment from 'moment';

import { isSameDate, formatTime } from '../util';
import ChatTopBar from './ChatNavbar';

const ENDPOINT = 'http://localhost:4001';
const socket = socketIOClient(ENDPOINT);

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(0),
    },
    bottomNavBar: {
        width: '100%',
    }
}));

let message_list = [];

export default function Chat(props) {
    const classes = useStyles();

    const [messageList, setMessageList] = useState([]);
    const [updateMessage, setUpdateMessage] = useState(false);
    const [loadMessage, setLoadMessage] = useState(Date.now());
    const[messageSent, setMessageSent] = useState(false);
    const [messageGot, setMessageGot] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    function handleSendMessage(e) {
        e.preventDefault();
        const element = document.getElementById('message');
        const message = element.value.trim();
        element.value = '';
        if(isEmpty(message))return;

        const messageObj = {
            from: props.owner.email,
            to: props.user.email,
            text: message,
            time: Date.now()
        };
    
        sendMessageToCloud(messageObj);
        setMessageSent(true);
        saveMessage(messageObj);
    }

    function saveMessage(message) {
        //setMessageList([...messageList, message]);
        message_list.push(message);
        setLoadMessage(Date.now());
        console.log('message saved');
    }

    async function sendMessageToCloud(message) {
        //const socket = socketIOClient(ENDPOINT);
        //socket.send(message);
        socket.emit('chat', message);
    }

    function handleMessageChange(e) {
        const message = e.target.value;
        if(e.key === 'Enter') {
            handleSendMessage(e);
            e.target.value = '';
        }
    }

    useEffect(() => {
        //const socket = socketIOClient(ENDPOINT);
        socket.on('connect', () => {
            const token = localStorage.getItem(`token-${props.owner.email}`);
            console.log(`token key: token-${props.owner.email}, value: ${token}`);
            socket.emit('token', token);
        });

        socket.on('chat', (data) => {
            console.log('message received');
            console.log(data);
            if (data.to === props.owner.email) {
                setMessageGot(true);
                saveMessage(data);
            }    
        });

        socket.on('heart-bit', (data) => {
            console.log(data);
            if (data.to === props.owner.email) {
                saveMessage(data);
            }    
        });

        setInterval(() => {
            socket.emit('heart-bit', props.owner.email);
        }, 20000);

        return () => {
            console.log('connect will be closed');
            socket.disconnect();
        }
        
    }, []);

    const fetchMessage = async (from, to) => {
        const option = {
            method: 'get',
            url: 'http://localhost:4001/api/v1/messages',
            //url: 'http://15aa11984e70.ngrok.io/api/v1/messages',
            params: {
                from: from,
                to: to,
                skip: message_list.length
            }
        };
        setIsLoading(true);
        setError('');
        try {
            const response = await axios(option);
            if (response.data) {
                console.log(response.data);
                //setMessageList([...response.data]);
                message_list = [...response.data, ...message_list];
                setLoadMessage(Date.now());
                if (response.data.length === 0) {
                    localStorage.setItem('noMoreData', 'true');
                }
                console.log(message_list.length);
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
        if (isEmpty(props.user)) {
            console.log('user is empty');
        } else {
            console.log('fetchCalled');
            message_list = [];
            localStorage.setItem('maxScrollHeight', 0);
            localStorage.setItem('fetchForScroll', 'false');
            localStorage.setItem('noMoreData', 'false');
            fetchMessage(props.owner.email, props.user.email);
            console.log('fetch sesh');

            return () => {
                localStorage.setItem('fetchForScroll', 'false');
                localStorage.setItem('noMoreData', 'false');
            }
        }
    }, [props.user]);

    /*if (isEmpty(props.user) && isEmpty(messageList)) {
        return <p>...</p>
    }*/

    const showChatBox = (
        <div>
            {
                
                (isLoading === true)
                     ? <div style={{textAlign: 'center', paddingTop: '30%'}}><CircularProgress/></div>
                    : <ChatBox 
                        messageList = { message_list }
                        owner = { props.owner }
                        user = { props.user }
                        handleScroll = { fetchMessage }
                        messageSent = { messageSent }
                        resetMessageSent = {() => setMessageSent(false)}
                        messageGot = {messageGot}
                        resetMessageGot = {() => setMessageGot(false)}
                    />
            }
        </div>
    );

    if (isEmpty(props.user)) {
        return <p></p>
    };

    return (
        <div className={classes.root}>
            <Grid 
                container 
                direction="col" 
                spacing={1}
            >
                <Grid item xs={12}>
                    {
                        isEmpty(props.user) ? '' : <ChatTopBar user={props.user}/>  
                    }
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    style={{paddingLeft: '16px'}}
                >
                   {showChatBox}
                </Grid>
                <Grid 
                    container 
                    item xs={12}
                    style={{ 
                        position: 'fixed', 
                        bottom: '0', 
                        paddingLeft: '16px',
                        marginBottom: '5px', 
                        width: '67%'
                    }}
                >
                    <Grid item xs={11}>
                        <TextField 
                            id="message" 
                            placeholder='Type a message' 
                            variant="outlined" 
                            fullWidth
                            autoComplete='off'
                            onKeyUp={handleMessageChange}
                        />
                    </Grid>
                    <Grid item xs={1} style={{textAlign: 'left'}}>
                        <IconButton 
                            aria-label="send"
                            style={{color: 'blue'}}
                            onClick = {handleSendMessage}
                        >
                            <SendIcon 
                            />
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

function ChatBox(props) {
    let maxScrollHeight = 0;

    useEffect(() => {
        const chatContainer = document.getElementById("chatBox");
        if (chatContainer) {
            const fetchForScroll = localStorage.getItem('fetchForScroll');
            //console.log(fetchForScroll);
            console.log(props.messageGot);

            if (props.messageSent === true || props.messageGot === true) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
                props.resetMessageSent();
                props.resetMessageGot();
            } else if (fetchForScroll === 'false') {
                chatContainer.scrollTop = chatContainer.scrollHeight;    
            } else if (fetchForScroll === 'true') {
                const previousMaxHeight = localStorage.getItem('maxScrollHeight');
                chatContainer.scrollTop = chatContainer.scrollHeight;// It will give max scroll position
                maxScrollHeight = chatContainer.scrollTop;
                localStorage.setItem('maxScrollHeight', maxScrollHeight);
                chatContainer.scrollTop = chatContainer.scrollTop - previousMaxHeight;

                // handling no more data
                if (localStorage.getItem('noMoreData') === 'true') {
                    chatContainer.scrollTop = 0;
                } 
            }
        }

        return () => {
            props.resetMessageSent();
            props.resetMessageGot();
        }
    });

    function handleScroll(e) {
        let element = e.target;
        if (element.scrollTop > maxScrollHeight) {
            maxScrollHeight = element.scrollTop;
            localStorage.setItem('maxScrollHeight', maxScrollHeight);
        }
        // It has no more value to fetch
        if (localStorage.getItem('noMoreData') === 'true') {
            console.log('no more data');
            return;
        }

        if (element.scrollTop === 0) {
            console.log('scrolled to top');
            localStorage.setItem('fetchForScroll', 'true');
            props.handleScroll(props.owner.email, props.user.email);
        }
    }

    function filterMessageList() {
        const messageList = [];
        let previousDate = null;
        for(const message of props.messageList) {
            if ((message.from === props.owner.email && message.to === props.user.email) 
            || (message.from === props.user.email && message.to === props.owner.email) ) {
                if (previousDate === null) {
                    messageList.push({...message, printDate: true});
                } else if(isSameDate(new Date(previousDate), new Date(message.time)) === false) {
                    messageList.push({...message, printDate: true});
                }
                messageList.push(message);
                previousDate = message.time;
            }
        }
        return messageList;
    }

    if(isEmpty(props.user) || props.messageList.length === 0) {
        return(
            <p></p>
        );
    }
    const showDate = (date) => {
        return (
            <div style={{textAlign: 'center'}}>
                {formatTime(date, true)}
            </div>
        )
    }

    return (
        <div>
            <Grid 
                id='chatBox'
                container 
                direction="col"
                style={{maxHeight: '80vh', overflow: 'auto'}}
                spacing={2} 
                onScroll={handleScroll}   
            >
                {/* <React.Fragment> */}
                    {
                        filterMessageList().map((message, index) => 
                            <Grid key={index.toString()} item xs={12}>
                                {
                                    message.printDate === true? showDate(message.time):
                                    message.from !== props.owner.email
                                        ? (
                                            <Box 
                                                display="flex"
                                                justifyContent="flex-start"
                                                style={{width: '50%'}}
                                            >   
                                                <Tooltip title={formatTime(message.time)} placement="left">
                                                    <Box 
                                                        style={{
                                                            backgroundColor: '#E8E8E8', 
                                                            borderStyle: 'hidden', 
                                                            padding: '8px',
                                                            borderRadius: '5px'
                                                        }}
                                                    >
                                                        {message.text}    
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        )  : (
                                            <Box 
                                                display="flex"
                                                justifyContent="flex-end"
                                                style={{marginRight: '32px'}}
                                            >   
                                                <Tooltip title={formatTime(message.time)} placement="left">
                                                    <Box
                                                        style={{
                                                            color: 'white',
                                                            backgroundColor: '#0052cc', 
                                                            borderStyle: 'hidden', 
                                                            padding: '8px',
                                                            borderRadius: '5px',
                                                            maxWidth: '50%',
                                                        }}
                                                    >
                                                        {message.text}
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        )                  
                                }
                            </Grid>
                        )
                    }
                {/* </React.Fragment> */}
            </Grid>
        </div>
    );
}