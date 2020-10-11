import React from 'react';
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
import image1 from './../static/images/image1.jpg';
import profile2 from './../static/images/profile2.jpg';
import profile3 from './../static/images/profile3.jpg';
import profile4 from './../static/images/profile4.jpg';
import profile5 from './../static/images/profile5.png';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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
    }
}));

const userList = [
    {
        name: 'Arifur Rahman Sujon',
        profilePic: image1
    },
    {
        name: 'Badhon Rahman',
        profilePic: profile2
    },
    {
        name: 'Choyon Biswas',
        profilePic: profile3
    },
    {
        name: 'Dravid',
        profilePic: profile4
    },
    {
        name: 'Emran Hossen',
        profilePic: profile5
    },
    {
        name: 'Arifur Rahman Sujon',
        profilePic: image1
    },
    {
        name: 'Badhon Rahman',
        profilePic: profile2
    },
    {
        name: 'Choyon Biswas',
        profilePic: profile3
    },
    {
        name: 'Dravid',
        profilePic: profile4
    },
    {
        name: 'Emran Hossen',
        profilePic: profile5
    },
    {
        name: 'Arifur Rahman Sujon',
        profilePic: image1
    },
    {
        name: 'Badhon Rahman',
        profilePic: profile2
    },
    {
        name: 'Choyon Biswas',
        profilePic: profile3
    },
    {
        name: 'Dravid',
        profilePic: profile4
    },
    {
        name: 'Emran Hossen',
        profilePic: profile5
    },
]

export default function UserList(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={1}>
                <Grid container direction="col">
                    <React.Fragment>
                        {
                            userList.map((user, index) => 
                                <Grid
                                    key={index.toString()}
                                    container
                                    item 
                                    direction="row" 
                                    className={classes.list}
                                    onClick={() => { props.handleUser(user)}}
                                >
                                    <Grid item>
                                        <Avatar 
                                            alt={user.name} 
                                            src={user.profilePic}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="inherit" className={classes.title}>
                                            {user.name}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        }
                    </React.Fragment>
                </Grid>
                <Divider />
            </Paper>
        </div>
    );
}
