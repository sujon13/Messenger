import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Avatar } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SettingsIcon from '@material-ui/icons/Settings';

import {
    Redirect,
    useHistory,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    paper: {
        position: "sticky",
    },
    avatar: {
        margin: theme.spacing(2),
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
}));

export default function LeftTopBar(props) {
    const classes = useStyles();

    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [redirectToSignInPage, setRedirectToSignInPage] = useState(false);

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        console.log('go to profile');
        history.push('/profile', props.owner);
    }

    const handleLogout = () => {
        console.log('user will logged out');
        localStorage.setItem(`token-${props.owner.email}`, '');
        localStorage.setItem(`chatList-${props.owner.email}`, null);
        //localStorage.clear();
        setRedirectToSignInPage(true);
    }

    if(redirectToSignInPage) {
        return (
            <Redirect
                to={{
                    pathname: '/signin',
                    state: props.owner
                }}
            />    
        )
    }

    return (
        <div className={classes.root}>
            <Paper 
                className={classes.paper} 
                elevation={1}
            >
                <Grid container direction="row">
                    <Grid item xs={4}>
                        <Tooltip title={props.owner.name} placement="right">
                            <Avatar 
                                alt={props.owner.name} 
                                src={ `${process.env.REACT_APP_AUTH_BASEURL}/${props.owner.profilePicUrl}`}
                            />
                        </Tooltip>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h6" className={classes.title}>
                            Chats
                        </Typography>
                    </Grid>
                    <Grid item xs={4} style={{margin: 'auto'}}>
                        <Button>
                            <SettingsIcon
                                color='primary'
                                onClick = { (e) => setAnchorEl(e.currentTarget) }
                            />
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={ handleProfileClick }>Profile</MenuItem>
                            <MenuItem onClick={ handleLogout }>Logout</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
