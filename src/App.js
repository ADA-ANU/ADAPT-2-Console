import React, { Component }from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from "./Dashboard";
import Login from "./components/Login";
import UnauthorisedLogin from "./components/LoginFail";
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import {inject, observer} from "mobx-react";
import PageNotFound from '../src/static/img/404.png'
import history from "./stores/routingStore"

@inject('routingStore', 'systemStore', 'authStore')
@observer
class App extends Component {
  render() {
      const {authStore} = this.props
    console.log(authStore.isUserLoggedIn)
      const NotFound = () => (
          <div>
              <img src={PageNotFound} style={{ display: 'block', margin: 'auto', position: 'relative' }} />
              <center><span style={{fontSize:'40px'}}><Link to="/">Return to Home Page</Link></span></center>
          </div>
      );
    return(
        <>
        { authStore.isUserLoggedIn === false?
            <Switch>
                <Route path='/' component={Login} />
            </Switch>
            :
            <Switch>
                <Route exact path='/' component={Login} />:
                <Route path='/dashboard' component={Dashboard} />
                <Route exact path='/unauthorised' component={UnauthorisedLogin} />
                <Route component={NotFound} />
            </Switch>

        }
        </>

    )
  }
}

export default App;
