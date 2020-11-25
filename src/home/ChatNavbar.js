import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Avatar } from '@material-ui/core';

import axios from 'axios';
import {isEmpty} from "lodash";

import { lastActive } from '../util';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    paper: {
        paddingLeft: theme.spacing(2),
    },
    avatar: {
        margin: theme.spacing(2),
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        textAlign: 'left',
        fontWeight: 'bold'
    },
}));

export default function ChatTopBar(props) {
    const classes = useStyles();

    const [lastSeen, setLastSeen] = useState('');

    const fetchStatus = async (user = props.user) => {
        const baseUrl = `${process.env.REACT_APP_CHAT_BASEURL}/api/v1`;
        const option = {
            method: 'GET',
            url: `${baseUrl}/status/`,
        };
        try {
            const response = await axios(option);
            if (response.data) {
                console.log('updated status received ', user);
                const activeStatus = lastActive(response.data, user);
                setLastSeen(activeStatus);      
            }
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchStatus(props.user);
        const interval = setInterval(fetchStatus, 5000);

        return () =>  {
            setLastSeen('');
            clearInterval(interval);
        }

    }, [props.user]);

    if (isEmpty(props.user)) {
        return <p></p>
    }

    return (
        <div className={classes.root}>
            <Paper 
                className={classes.paper} 
                elevation={1}
            >
                <Grid container direction="row">
                    <Grid item xs={3} sm={2} md={1}>
                        <Avatar 
                            alt={props.user.name} 
                            src={props.user.profilePicUrl 
                                ? `${process.env.REACT_APP_AUTH_BASEURL}/${props.user.profilePicUrl}`
                                : props.user.name
                            }
                        />
                    </Grid>
                    <Grid container item xs={9} sm={10} md={11} direction='col'> 
                        <Grid item xs={12}>
                            <Typography className={classes.title}>
                                {props.user.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography style={{fontSize: '12px'}}>
                                { lastSeen }
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
