import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { Avatar } from '@material-ui/core';
import Box from '@material-ui/core/Box';

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

export default function UserList(props) {
    const classes = useStyles();

    if(props.userList.length === 0) {
        return <p>loading...</p>
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.paper} elevation={1}>
                <Grid container direction="col">
                    <React.Fragment>
                        {
                            props.userList.map((user, index) => 
                                <Grid
                                    key={index.toString()}
                                    container
                                    item 
                                    direction="row" 
                                    className={classes.list}
                                    style={{backgroundColor: '#f2f2f2'}}
                                    onClick={() => { props.handleUser(user) }}
                                >
                                    <Grid item xs={3}>
                                        <Avatar 
                                            alt={user.name} 
                                            src={user.profilePicUrl 
                                                ? `http://localhost:3001/${user.profilePicUrl}`
                                                : user.name
                                            }
                                        />
                                    </Grid>
                                    <Grid 
                                        item 
                                        xs={9} 
                                        style={{
                                            margin: 'auto',
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="inherit">
                                                {user.name}
                                            </Typography>
                                        </Box>
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
