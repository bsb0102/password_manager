// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';

function MainApp() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/dashboard" render={() => <div>Dashboard Page</div>} />
        {/* Remove the Route for App as it seems to be a mistake */}
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default MainApp;
