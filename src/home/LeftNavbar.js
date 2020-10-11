import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Avatar } from '@material-ui/core';
import image1 from './../static/images/image1.jpg';

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

export default function LeftTopBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={1}>
                <Grid container direction="row">
                    <Grid item xs={4}>
                        <Avatar alt="Remy Sharp" src={image1}/>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h6" className={classes.title}>
                            Chats
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Button color="inherit">
                            kali
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
