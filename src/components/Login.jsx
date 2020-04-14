import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import '../App.css';
// import 'antd/es/spin/style/css';
import 'antd/dist/antd.css';
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
                <Row style={{height:'100vh'}} align='middle'>
                    <Col span={24}>
                    <div style={{background: '#fff', textAlign: 'center'}}>
                        <Row style={{}}>
                        {/*<div style={{paddingTop: '10%'}}>*/}
                            <Col  xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 2 }} md={{ span: 16, offset: 4 }} lg={{ span: 16, offset: 4 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 4, offset: 10 }}>
                                <div >
                                    <img className="logo" style={{ lineHeight: 'inherit'}} src={ADAlogo}/>
                                </div>
                            </Col>
                        {/*</div>*/}
                        </Row>
                        <Row style={{paddingTop: '1%'}}>
                            <Col  xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 2 }} md={{ span: 16, offset: 4 }} lg={{ span: 16, offset: 4 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 6, offset: 9 }}>
                                <div style={{textAlign: 'center'}}>
                                    <span >Welcome to the ADA Console, please log in through AAF below.</span>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: '1%'}}>
                            <Col  xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 2 }} md={{ span: 14, offset: 5 }} lg={{ span: 10, offset: 7 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 6, offset: 9 }}>
                                <div style={{margin: 'auto', textAlign:'center'}}>
                                    {authStore.loginErrorMessage && authStore.loginErrorMessage.length>0?
                                        <Alert
                                            description={authStore.loginErrorMessage}
                                            type="error"
                                            showIcon
                                        />: ''}
                                </div>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: '4%'}}>
                            <Col  xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 2 }} md={{ span: 14, offset: 5 }} lg={{ span: 10, offset: 7 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 6, offset: 9 }}>
                                <div style={{textAlign:'center'}}>
                                    <a href={authStore.aafLoginUrl}>
                                        <img className="logo" style={{ width:'80%', cursor: 'pointer'}} src={aaf_login} />
                                    </a>
                                </div>
                            </Col>
                            {/*<div style={{ paddingTop: '15vh'}}>*/}
                            {/*</div>*/}
                        </Row>
                    </div>
                    </Col>
                </Row>
        )
    }
}