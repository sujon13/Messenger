import React from 'react';
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
    return(
        <Router>
            <div>
                <Switch>
                    <Route path="/signin">
                        <Signin />
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
