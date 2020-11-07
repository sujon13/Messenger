import React, { useState, useEffect } from 'react';
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
import axios from 'axios';
import {isEmpty} from "lodash"


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

    const [isChatShown, setIsChatShown] = useState(true);
    const [user, setUser] = useState({});
    const [owner, setOwner] = useState({});
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userListScrollIsLoading, setUserListScrollIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [pageForUserList, setPageForUserList] = useState(1);

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

    const fetchUsers = async (accessToken, owner) => {
        console.log(accessToken);
        const baseUrl = 'http://localhost:3001/api/v1';
        //const baseUrl = 'http://f117216464b9.ngrok.io/api/v1';
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
                const currentUserList = filterUserList(owner, response.data);
                console.log(userList.length);
                
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
        const data = window.history.state.state;
        const profile = data.profile;
        profile.profilePic = profile.name;
        localStorage.setItem(`token-${profile.email}`, data.accessToken);
        setOwner(profile);
       
        fetchUsers(data.accessToken, profile);
    },[]);

    if(isEmpty(owner) || owner === undefined) {
        return(
            <p></p>
        );
    }

    return (
        <div className={classes.root}>
            <Grid 
                container 
                direction="row" 
                spacing={0}
            >
                <Grid container item direction="col" sm={4} spacing={1}>
                    <Grid item xs={12} style={{height: '40px', position: 'sticky'}}>
                         <LeftTopBar user={owner}/>
                    </Grid>
                    <Grid 
                        container 
                        item xs={12} 
                        style={{height: '20px', position: 'sticky', marginTop: '0px', paddingTop: '0px'}}
                    >
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

                    <Grid 
                        item 
                        xs={12} 
                        className={classes.list} 
                        onScroll={handleScroll}
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
                                          /> 
                                        : ( 
                                            <Grid container direction='col'>
                                                <Grid item xs={12}>
                                                    <UserList 
                                                        handleUser={ handleUser }
                                                        userList={ userList }
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
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
                <Grid item sm={8}>
                    {
                        // (isEmpty(user) === false)
                        //     ? <Chat user = {user} owner = {owner}/>
                        //     : <div style={{textAlign: 'center'}}>Start Chatting</div>
                    }   <Chat user = {user} owner = {owner}/>  
                </Grid>
            </Grid>
        </div>
    );
}