import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import { Avatar } from '@material-ui/core';
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

    useEffect(() => {
        const interval = setInterval(async () => {
            const baseUrl = 'http://localhost:4001/api/v1';
            const option = {
                method: 'GET',
                url: `${baseUrl}/status/`,
            };
            try {
                const response = await axios(option);
                if (response.data) {
                    //console.log('updated status received ', props.user);
                    const activeStatus = lastActive(response.data, props.user);
                    setLastSeen(activeStatus);
                    
                }
            } catch(error) {
                console.log(error);
            }
        }, 1000);

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
                    <Grid item xs={1}>
                        <Avatar 
                            alt={props.user.name} 
                            src={props.user.profilePicUrl 
                                ? `http://localhost:3001/${props.user.profilePicUrl}`
                                : props.user.name
                            }
                        />
                    </Grid>
                    <Grid container item xs={10} direction='col'> 
                        <Grid item xs={11}>
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
