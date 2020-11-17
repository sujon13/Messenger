import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import EmailSharpIcon from '@material-ui/icons/EmailSharp';
import PhoneEnabledSharpIcon from '@material-ui/icons/PhoneEnabledSharp';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useTheme } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom";
import axios from 'axios';
import {isEmpty} from "lodash"
import { Helmet } from 'react-helmet';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(0),
        maxHeight: '100%'
    },
    paper: {
        marginTop: '10%',
        marginBottom: '10%',
        marginLeft: '30%',
        marginRight: '30%',
        paddingBottom: '8px',
        paddingTop: '5px',
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
    large: {
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    input: {
        display: 'none',
    },
}));


export default function Profile(props) {
    const classes = useStyles();

    const history = useHistory();
    const [locationKeys, setLocationKeys] = useState([])

    const [user, setUser] = useState({});
    const [owner, setOwner] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const profileData = history.location.state;
        console.log(profileData);
        setProfile(profileData);
    },[]);

    useEffect(() => {
        return history.listen(location => {
            history.location.state = {};
            console.log('action!!');
            alert('action!');
            if (history.action === 'PUSH') {
                setLocationKeys([ location.key ])
            }
        
            if (history.action === 'POP') {
                console.log('back button is pressed');
                if (locationKeys[1] === location.key) {
                    setLocationKeys(([ _, ...keys ]) => keys)
            
                    // Handle forward event
                } else {
                    setLocationKeys((keys) => [ location.key, ...keys ])
            
                    // Handle back event
                }
            }
        });
    }, [ locationKeys, ]);

    const handleClose = (profile) => {
        console.log('profile', profile);
        setOpen(false);
        setProfile(profile);
    };
    
    if(isEmpty(profile) || profile === undefined) {
        return(
            <div>
                <Helmet>
                    <title> My Profile</title>
                </Helmet>
            </div>
        );
    }

    return (
        <div>
            <Helmet>
                <title> My Profile</title>
            </Helmet>
            <Paper className={classes.paper} elevation={3}> 
                <Grid 
                    container
                    direction="col"
                >
                    <Grid   
                        item
                        xs={12}
                    >
                        <Avatar 
                            alt="Remy Sharp" 
                            src={`http://localhost:3001/${profile.profilePicUrl}`} 
                            className={classes.large}
                            style={{
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        style={{textAlign: 'center'}}
                    >
                        <Typography 
                            variant="h4"
                            style={{
                                fontWeight: 'bold',
                                fontSize: '32px'
                            }}
                        >
                            {profile.name}
                        </Typography>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        direction='row'
                        style={{
                            textAlign: 'center',
                            marginTop: '48px',
                            height: '30px',
                        }}
                    >
                        <Grid 
                            item 
                            xs={3}
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            <Box 
                                style={{
                                    //backgroundColor: 'gray'
                                }}
                            >
                                <EmailSharpIcon color='primary'/>
                            </Box>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography 
                                style={{
                                    textAlign: 'left',
                                }}
                            >
                                { profile.email }
                            </Typography>
                        </Grid>

                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        direction='row'
                        style={{
                            textAlign: 'center',
                        }}
                    >
                        <Grid item xs={3} style={{textAlign: 'center'}}>
                            <PhoneEnabledSharpIcon color='primary'/>
                        </Grid>
                        <Grid item xs={9}>
                            <Typography 
                                style={{
                                    textAlign: 'left'
                                }}
                            >
                                { profile.phoneNumber }
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} style={{textAlign: 'center'}}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            style={{
                                width: '50%',
                                marginTop: '10px'
                            }}
                            onClick = {() => setOpen(true)}
                        >
                            Edit
                        </Button>
                        <EditProfile profile={profile} open={open} onClose={handleClose} />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}


function EditProfile(props) {
    const classes = useStyles();

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [profile, setProfile] = useState({});
    const [updatedProfile, setUpdatedProfile] = useState({});
    const [selectedImage, setSelectedImage] = useState(`http://localhost:3001/${props.profile.profilePicUrl}`);
    const [isSaving, setIsSaving] = useState(false);
    const [saveData, setSaveData] = useState(false);
    const[image, setImage] = useState(null);

    useEffect(() => {
        if (props.profile) {
            setProfile(props.profile);
            setUpdatedProfile(props.profile);
        }

    }, [props.profile]);

    useEffect(() => {
        return () => {
            setProfile({});
            setUpdatedProfile({});
        }
    }, []);

    const handleSelectedImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            const img = event.target.files[0];
            setUpdatedProfile({
                ...profile,
                profilePicUrl: img
            });
            setImage(img);
            setSelectedImage(URL.createObjectURL(img));
        }
    }

    const handleSave = async () => {
        const baseUrl = 'http://localhost:3001/api/v1';
        const token = localStorage.getItem(`token-${profile.email}`);
        const id = localStorage.getItem(`userId-${profile.email}`);
        console.log(id);
        console.log(updatedProfile);
        
        const formData = new FormData();
        formData.append("image", updatedProfile.profilePicUrl);
        formData.append('name', updatedProfile.name);
        formData.append('email', updatedProfile.email);
        formData.append('phoneNumber', updatedProfile.phoneNumber);

        const option = {
            method: 'PUT',
            url: `${baseUrl}/users/${id}/`,
            headers: {
                Authorization: `Bearer ${token}`,
                'content-type': 'multipart/form-data'
                
            },
            data: formData
        };

        try {
            setIsSaving(true);
            const response = await axios(option);
            if (response.data) {
                setIsSaving(false);
                setSaveData(false);
                const updatedUser = response.data;
                console.log('profile updated sucessfully by data', updatedUser);
                props.onClose({
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phoneNumber: updatedUser.phoneNumber,
                    profilePicUrl: updatedUser.profilePicUrl
                });
            }
        } catch(error) {
            setIsSaving(false);
            setSaveData(false);
            console.log(error);
            props.onClose(profile);
        }
    }

    useEffect(() => {
        if (saveData === true) {
            handleSave();
        }
    }, [saveData]);
    
    return (
        <Dialog 
            onClose = {() => props.onClose(profile)} 
            open = {props.open} 
            fullScreen={fullScreen}
        >
        
            <Grid 
                container
                direction="col"
                style={{
                    marginTop: '10px',
                    marginBottom: '5px',
                }}
            >
                <Grid   
                    item
                    xs={12}
                >
                    <Avatar 
                        alt={profile.name} 
                        src={selectedImage} 
                        className={classes.large}
                        style={{
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                    />
                </Grid>
                <Grid   
                    item
                    xs={12}
                >
                    <input
                        accept="image/*"
                        className={classes.input}
                        id="img-upload"
                        multiple
                        type="file"
                        onChange = { handleSelectedImage }
                    />
                    <label htmlFor="img-upload">
                        <Button 
                            variant="outlined" 
                            color="primary" 
                            component="span"
                            style={{
                                marginTop: '10px',
                                display: 'block',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '20%',
                                textAlign: 'center',
                            }}
                        >
                            Upload
                        </Button>
                    </label>
                </Grid>
                <Grid
                    container
                    item
                    xs={12}
                    direction='col'
                    spacing={2}
                    style={{
                        paddingTop: '20px',
                        marginLeft: '10%',
                        marginRight: '10%',
                    }}
                >   
                    <Grid
                        item
                        xs={12}
                    >
                        <EditField 
                            name='Name' 
                            value={updatedProfile.name}
                            onEdit = {(name) => setUpdatedProfile({
                                ...updatedProfile, 
                                name: name
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <EditField 
                            name='Email' 
                            value={updatedProfile.email}
                            onEdit = {(email) => setUpdatedProfile({
                                ...updatedProfile, 
                                email: email
                            })}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                    >
                        <EditField 
                            name='Phone' 
                            value={updatedProfile.phoneNumber}
                            onEdit = {(phoneNumber) => setUpdatedProfile({
                                ...updatedProfile, 
                                phoneNumber: phoneNumber
                            })}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                {
                    isSaving === true 
                        ?   <div style={{textAlign: 'center'}}>
                                <CircularProgress/>
                            </div>
                        :   <Grid
                                container
                                spacing = {3}
                                style={{
                                    marginTop: '10px'
                                }}
                                direction='row'
                            >
                                <Grid item xs={6} style={{textAlign: 'center'}}>
                                    <Button 
                                        variant="outlined" 
            
                                        color="primary"
                                        style={{
                                            // width: '20%',
                                        }}
                                        onClick = { () =>  setSaveData(true)}
                                    >
                                        SAVE
                                    </Button>
                                </Grid>
                                <Grid item xs={6} style={{textAlign: 'center'}}>
                                    <Button 
                                        variant="outlined" 
                                        style={{
                                            // width: '20%',
                                        }}
                                        onClick = {() =>  props.onClose(profile) }
                                    >
                                        CANCEL
                                    </Button>
                                </Grid>
                            </Grid>
                }
                </Grid>
            </Grid>
        </Dialog>
    );
}

const EditField = (props) => {
    const [value, setValue] = useState(props.value);

    if (props.value === undefined) {
        return(
            <p></p>
        );
    }
    return(
        <Grid
            container
            item 
            xs={12}
            style={{
                
            }}
        >
            <Grid item xs={2} style={{textAlign: 'left', marginTop: '5px'}}>
                <Typography 
                    variant='body1'
                >
                    {props.name}
                </Typography>
            </Grid>
            <Grid item xs={10} style={{textAlign: 'left'}}>
                <TextField 
                    id="outlined-basic"  
                    variant="outlined"
                    fullWidth 
                    disabled
                    value={props.value + '  (disabled)'}
                    size='small'
                    onChange={(e) => props.onEdit(e.target.value)}
                />
            </Grid>
        </Grid>
    );
}