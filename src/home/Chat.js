import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import CircularProgress from '@material-ui/core/CircularProgress';
import ChatTopBar from './ChatNavbar';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import {isEmpty} from "lodash";
//const ENDPOINT = "http://15aa11984e70.ngrok.io";
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
    const[newMessage, setNewMessage] = useState(false);
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
        saveMessage(messageObj);
    }

    function saveMessage(message) {
        //setMessageList([...messageList, message]);
        message_list.push(message);
        //setUpdateMessage(1 - updateMessage);
        setLoadMessage(Date.now());
        setNewMessage(true);
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
            console.log('list length: ', messageList.length);
            console.log(data);
            saveMessage(data);
            
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
        }
    }, [props.user])

    /*if (isEmpty(props.user) && isEmpty(messageList)) {
        return <p>...</p>
    }*/

    const showChatBox = (
        <div>
            {
                
                (isLoading === true)
                    ? <div style={{textAlign: 'center'}}><CircularProgress/></div>
                    : <ChatBox 
                        messageList = { message_list }
                        owner = { props.owner }
                        user = { props.user }
                        handleScroll = { fetchMessage }
                        newMessage = { newMessage }
                    />  
            }
        </div>
    );

    return (
        <div className={classes.root}>
            <Grid 
                container 
                direction="col" 
                spacing={1}
            >
                <Grid item xs={12}>
                    <ChatTopBar user={props.user}/>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    style={{paddingLeft: "16px"}}
                >
                   {showChatBox}
                </Grid>
                <Grid 
                    container 
                    item xs={12}
                    style={{ position: 'fixed', bottom: '0', paddingLeft: '16px', width: '68%'}}
                >
                    <Grid item xs={11}>
                        <TextField 
                            id="message" 
                            placeholder='Type a message' 
                            variant="standard" 
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

            if (localStorage.getItem('fetchForScroll') === 'false' || props.newMessage === true) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            } else {
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
    });

    function handleScroll(e) {
        let element = e.target
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
        for(const message of props.messageList) {
            if ((message.from === props.owner.email && message.to === props.user.email) 
            || (message.from === props.user.email && message.to === props.owner.email) ) {
                messageList.push(message);
            }
        }
        return messageList;
    }

    if(isEmpty(props.user) || props.messageList.length === 0) {
        return(
            <p></p>
        );
    }

    return (
        <div>
            { console.log(props.messageList.length)}
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
                                    message.from !== props.owner.email
                                        ? (
                                            <Box 
                                                display="flex"
                                                justifyContent="flex-start"
                                            >   
                                                <Box>{message.text}</Box>
                                            </Box>
                                        )  : (
                                            <Box 
                                                display="flex"
                                                justifyContent="flex-end"
                                                style={{marginRight: '32px'}}
                                            >   
                                                <Box>{message.text}</Box>
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