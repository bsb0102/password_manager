import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  // You can use state to manage user login status
  // const isAuthenticated = false; // Replace with your logic for checking user authentication
  isAuthenticated = true;

  console.log(isAuthenticated)

  return (
    <Router>
      <Switch>
        <Route path="/login" render={() => (isAuthenticated ? <Redirect to="/dashboard" /> : <Login />)} />
        <Route path="/dashboard" render={() => (isAuthenticated ? <Dashboard /> : <Redirect to="/login" />)} />
        <Route exact path="/" render={() => <Redirect to="/login" />} />
      </Switch>
    </Router>
  );
}

export default App;
