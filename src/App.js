import React, {useState} from 'react';
import Signin from './authentication/Signin';
import SignUp from './authentication/Signup';
import Home from './home/home';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
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
                    <Route path="/signup">
                        <SignUp />
                    </Route>
                    <Route path="/" exact>
                        <SignUp />
                    </Route>
                    <Route path="/home">
                        <Home/>
                    </Route>
                </Switch>
            </div>
            
        </Router>
    );
}

export default App;
