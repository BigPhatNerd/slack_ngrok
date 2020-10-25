import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AuthFailed from './components/AuthFailed';
import { UserContext } from './context/userContext';

import './App.css';

function App() {
    const [user, setUser] = useState({
        stravaId: '',
        email: '',
        password: '',
        isAuthenticated: false,
        stravaAuthenticated: false
    });

    const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

    return (
        <Router>
         <Switch>
         <UserContext.Provider value={providerValue}>
         <Route exact path="/" component={Home} /> 
         <Route exact path="/login" component={Login} />
       <Route exact path="/signup" component={Signup} />
       <Route exact path="/failed" component={AuthFailed} /> 
     </UserContext.Provider>
         </Switch>
       </Router>
    );
}

export default App;