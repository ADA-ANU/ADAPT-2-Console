import React, { Component }from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from "./Dashboard";
import Login from "./components/Login";
import { Switch, Route, withRouter, Link } from 'react-router-dom';


class App extends Component {
  render() {
    return(
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route exact path='/login' component={Login} />
        </Switch>
    )
  }
}

export default App;
