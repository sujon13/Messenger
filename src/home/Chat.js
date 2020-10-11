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
import ChatTopBar from './ChatNavbar';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(0),
    },
    bottomNavBar: {
        width: '100%',
    }
}));

export default function Chat(props) {
    const classes = useStyles();

    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    function handleSendMessage(e) {
        e.preventDefault();
        const element = document.getElementById('message');
        const message = element.value.trim();
        element.value = '';
        if(message === '')return;

        setMessage(message + Date.now());
        const localMessageList = messageList;
        localMessageList.push(message);
        setMessageList(localMessageList);    
    }

    function handleMessageChange(e) {
        const message = e.target.value;
        if(e.key === 'Enter') {
            handleSendMessage(e);
        }
    }

    useEffect(() => {
        setMessageList([]);
    }, [props.user]);

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
                    <ChatBox myList = { messageList }/>
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
    useEffect(() => {
        const chatContainer = document.getElementById("chatBox");
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });

    return (
        <div>
            <Grid 
                id='chatBox'
                container 
                direction="col"
                style={{maxHeight: '80vh', overflow: 'auto'}}
                spacing={2}    
            >
                {/* <React.Fragment> */}
                    {
                        props.myList.map((val, index) => 
                            <Grid key={index.toString()} item xs={12}>
                                {
                                    index % 2 === 0
                                        ? (
                                            <Box 
                                                display="flex"
                                                justifyContent="flex-start"
                                            >   
                                                <Box>{val}</Box>
                                            </Box>
                                        )  : (
                                            <Box 
                                                display="flex"
                                                justifyContent="flex-end"
                                                style={{marginRight: '32px'}}
                                            >   
                                                <Box>{val}</Box>
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