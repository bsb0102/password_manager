import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './components/Login/Login';
import App from './components\Login\App.js'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/dashboard" render={() => <div>Dashboard Page</div>} />
        <Route path="/App" render={() => <div> App Page</div>} />
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default App;
