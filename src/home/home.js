import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import { useHistory } from "react-router-dom";
import axios from 'axios';
import {isEmpty} from "lodash";
import { Helmet } from 'react-helmet';

import LeftTopBar from './LeftNavbar';
import Chat from './Chat';
import UserList from './UserList';
import ChatList from './ChatList';
import { hasInternetConnection } from './../util';

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
        maxHeight: '85vh',
        overflow: 'auto',
    },
    option: {
        marginTop: theme.spacing(2),
    },
}));


export default function Home(props) {
    const classes = useStyles();

    const history = useHistory();

    const [isChatShown, setIsChatShown] = useState(true);
    const [user, setUser] = useState({});
    const [owner, setOwner] = useState({});
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userListScrollIsLoading, setUserListScrollIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [pageForUserList, setPageForUserList] = useState(1);
    const [open, setOpen] = useState(false);// for snack bar

    function handleUser(user) {
        setUser(user);
    }

    function handleScroll(e) {
        if (isChatShown === false) {
            handleScrollForUserList(e);
        }
    }

    function handleScrollForUserList(e) {
        let element = e.target
        const top = element.scrollTop;
        if(top === 0)return;
        if (element.scrollHeight - element.scrollTop === element.clientHeight) {
            console.log('scrolled down');
            const token = localStorage.getItem(`token-${owner.email}`);
            fetchUsers(token, owner);
            element.scrollTop = top;
        }
    }

    function filterUserList(owner, userList) {
        const newUserList = userList.filter((user) => {
            if(user.email !== owner.email) {
                console.log(user.email, owner.email);
                return user;
            }
        });
        return newUserList;
    }

    const handleOwner = (owner, userList) => {
        userList.map((user) => {
            if (user.email === owner.email) {
                setOwner(user);
            }
        })
    }

    const fetchUsers = async (accessToken, owner) => {
        const baseUrl = `${process.env.REACT_APP_AUTH_BASEURL}/api/v1`;
        const option = {  
            method: 'get',
            url: `${baseUrl}/users`,
            params: {
                page: pageForUserList,
                limit: 15
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        };
        setUserListScrollIsLoading(true);
        setError('');
        try {
            const response = await axios(option);
            if (response.data) {
                console.log(response.data);
                handleOwner(owner, response.data);
                
                const currentUserList = filterUserList(owner, response.data);
                const newUserList = userList.concat(currentUserList);
                console.log(newUserList.length);
                setUserList([...newUserList]);
                setPageForUserList(pageForUserList + 1);
                setUserListScrollIsLoading(false);
            }
        } catch(error) {
            console.log(error);
            if(error.response) {
                setError('something went wrong!');
            }
            setUserListScrollIsLoading(false);
        }
    }

    useEffect(() => {
        const data = history.location.state;
        console.log(data);
        const profile = data.profile;
        localStorage.setItem(`token-${profile.email}`, data.accessToken);
        localStorage.setItem(`userId-${profile.email}`, data.profile._id);
        setOwner(profile);
        if(!hasInternetConnection()) {
            setOpen(true);
            return;
        }
        fetchUsers(data.accessToken, profile);    
    },[]);

    if(isEmpty(owner) || owner === undefined) {
        return(
            <div>
                <Helmet>
                    <title> Easy Chat</title>
                </Helmet>
            </div>
        );
    }

    return (
        <div>
            <Helmet>
                <title> Easy Chat</title>
            </Helmet>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={open}
                onClose={() => setOpen(false)}
                message="There is no internet connection! Please check your internet connection and try again"
                autoHideDuration={2000}
            />
            <div className={classes.root}>
                <Grid 
                    container 
                    direction="row" 
                    spacing={1}
                >
                    <Grid container item direction="col" xs={4} sm={4} spacing={1}>
                        <Grid 
                            item xs={12}
                            style={{
                                height: '40px', 
                                width: '33%', 
                                position: 'fixed', 
                                marginTop: '0px'
                            }}
                        >
                            <LeftTopBar owner={owner}/>
                        </Grid>
                        <Grid 
                            container 
                            item xs={12} 
                            style={{
                                height: '40px', 
                                width: '33%', 
                                position: 'fixed', 
                                marginTop: '42px',
                                textAlign: 'center'
                            }}
                        >
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    style={{textTransform: 'none'}}
                                    color={isChatShown === true ? 'primary' : 'default'}
                                    onClick={() => setIsChatShown(true)}
                                >
                                    Chats
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button 
                                    variant="contained"
                                    fullWidth
                                    style={{textTransform: 'none'}}
                                    color={isChatShown === true ? 'default' : 'primary'}
                                    onClick={() => setIsChatShown(false)}
                                >
                                    Users
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid 
                            item 
                            xs={12} 
                            className={classes.list} 
                            onScroll={handleScroll}
                            style={{
                                position: 'fixed', 
                                marginTop: '80px', 
                                width: '33%'
                            }}
                        >
                            {
                                isLoading 
                                    ? <p>Loading...</p> 
                                    : error !== ''
                                        ? <p>Error!!</p>
                                        : isChatShown === true 
                                            ? <ChatList 
                                                handleUser = { handleUser }
                                                userList = { userList }
                                                owner = {owner}
                                                needToShowChatBox = { isEmpty(user) }
                                            /> 
                                            : ( 
                                                <Grid container direction='col'>
                                                    <Grid 
                                                        item 
                                                        xs={12}
                                                    >
                                                        <UserList 
                                                            handleUser={ handleUser }
                                                            userList={ userList }
                                                        />
                                                    </Grid>
                                                    <Grid 
                                                        item 
                                                        xs={12}
                                                    >
                                                        {
                                                            userListScrollIsLoading 
                                                            ? <p>loading..</p>
                                                            : <p></p>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            )
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={8} sm={8}>
                        {
                            // (isEmpty(user) === false)
                            //     ? <Chat user = {user} owner = {owner}/>
                            //     : <div style={{textAlign: 'center'}}>Start Chatting</div>
                        }   <Chat 
                                user = {user} 
                                owner = {owner}
                            />  
                    </Grid>
                </Grid>
            </div>
        </div>
        
    );
}