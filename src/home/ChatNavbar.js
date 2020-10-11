import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Avatar } from '@material-ui/core';

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
        textAlign: 'left'
    },
}));

export default function ChatTopBar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={1}>
                <Grid container direction="row">
                    <Grid item xs={2}>
                        <Avatar alt={props.user.name} src={props.user.profilePic}/>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography className={classes.title}>
                            {props.user.name}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
