import React, {useState} from 'react';
import Signin from './authentication/Signin';
import SignUp from './authentication/Signup';
import Home from './home/home';
import Profile from './profile/Account';
import EmailVerify from './authentication/EmailVerify';

import {
    HashRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

function App() {
    const [user, setUser] = useState({});
    const [accessToken, setAccessToken] = useState('');

    function handleUser(data) {
        const localUser = data.profile;
        localUser.profilePic = data.profile.name;
        setUser(localUser);
        setAccessToken(data.accessToken);
    }

    return(
        <Router>
            <div>
                <Switch>
                    <Route path="/signin">
                        <Signin handleUser = {handleUser}/>
                    </Route>
                    <Route path="/signup" exact>
                        <SignUp />
                    </Route>
                    <Route path="/signup/email-verify">
                        <EmailVerify/>
                    </Route>
                    {/* <Route path="/" exact>
                        <SignUp />
                    </Route> */}
                    <Route path="/home" exact>
                        <Home/>
                    </Route>
                    <Route path="/profile">
                        <Profile/>
                    </Route>
                </Switch>
            </div>
            
        </Router>
    );
}

export default App;
