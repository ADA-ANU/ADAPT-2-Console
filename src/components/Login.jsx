import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import '../App.css';
import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography, Button, Tooltip, Alert, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ADAlogo from '../static/img/ADAlogo.jpg';
import aaf_login from '../static/img/aaf_login.png'

@inject('routingStore', 'systemStore')
@observer
export default class Login extends Component{

    render() {
        return(
            <div style={{background: '#fff', textAlign: 'center'}}>
                <div style={{paddingTop: '10%'}}>
                    <img className="logo" style={{ lineHeight: 'inherit'}} src={ADAlogo}/>
                </div>
                <div style={{paddingTop: '1%'}}>
                    <span >Welcome to the ADA Console, please log in through AAF below.</span>
                </div>
                <div style={{paddingTop: '4%'}}>
                    <a href='https://ds.test.aaf.edu.au/discovery/aaf/XSa42sZ7UwhuALSYojGCEw?entityID=https%3A%2F%2Frapid.test.aaf.edu.au%2Fshibboleth&return=https%3A%2F%2Frapid.test.aaf.edu.au%2FShibboleth.sso%2FLogin%3FSAMLDS%3D1%26target%3D%252Flogin%252Fshibboleth%252Fdg6S7Mqyo338TOiY-3jBCPp77KqxBWL1'>
                        <img className="logo" style={{ lineHeight: 'inherit', cursor: 'pointer'}} src={aaf_login} />
                    </a>
                </div>
                <div style={{ paddingTop: '15vh'}}>
                </div>
            </div>
        )
    }
}