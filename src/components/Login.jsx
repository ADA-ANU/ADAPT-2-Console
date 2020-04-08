import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import '../App.css';
import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography, Button, Tooltip, Alert, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ADAlogo from '../static/img/ADAlogo.jpg';
import aaf_login from '../static/img/aaf_login.png'

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class Login extends Component{
    componentDidMount() {
        console.log("authenticating")
        this.props.authStore.authenticate()
            .then(res=>{
                if(res === true){
                    console.log("authenticating YES")
                    this.props.history.push('/dashboard')
                }
            })
    }

    render() {
        const { authStore } = this.props
        return(
            <div style={{background: '#fff', textAlign: 'center'}}>
                <div style={{paddingTop: '10%'}}>
                    <img className="logo" style={{ lineHeight: 'inherit'}} src={ADAlogo}/>
                </div>
                <div style={{paddingTop: '1%'}}>
                    <span >Welcome to the ADA Console, please log in through AAF below.</span>
                </div>
                <div style={{paddingTop: '1%', width:'20%', margin: 'auto', textAlign:'left'}}>
                    {authStore.loginErrorMessage && authStore.loginErrorMessage.length>0?
                        <Alert
                            description={authStore.loginErrorMessage}
                            type="error"
                            showIcon
                        />: ''}
                </div>
                <div style={{paddingTop: '4%'}}>
                    <a href={authStore.aafLoginUrl}>
                        <img className="logo" style={{ lineHeight: 'inherit', cursor: 'pointer'}} src={aaf_login} />
                    </a>
                </div>
                <div style={{ paddingTop: '15vh'}}>
                </div>
            </div>
        )
    }
}