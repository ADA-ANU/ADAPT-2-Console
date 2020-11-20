import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import '../App.css';
import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography, Button, Tooltip, Alert, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ADAlogo from '../static/img/ADA-logo.png';
import aaf_login from '../static/img/aaf_login.png'

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class UnauthorisedLogin extends Component{

    render() {
        const { authStore } = this.props
        return(
            <Row style={{height:'100vh'}} align='middle'>
                <Col span={24}>
                    <div style={{background: '#fff', textAlign: 'center'}}>
                        <Row>
                            <Col  xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 2 }} md={{ span: 16, offset: 4 }} lg={{ span: 16, offset: 4 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 4, offset: 10 }}>
                                <div >
                                    <img className="logo" style={{ lineHeight: 'inherit'}} src={ADAlogo}/>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: '2vh'}}>
                            <Col  xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 2 }} md={{ span: 16, offset: 4 }} lg={{ span: 16, offset: 4 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 6, offset: 9 }}>
                                <div style={{textAlign: 'center'}}>
                                    <span >Welcome to the ADA Console, please log in through AAF below.</span>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: '2vh'}}>
                            <Col  xs={{ span: 20, offset: 2 }} sm={{ span: 20, offset: 2 }} md={{ span: 14, offset: 5 }} lg={{ span: 10, offset: 7 }} xl={{ span: 12, offset: 6 }} xxl={{ span: 6, offset: 9 }}>
                                <div style={{textAlign:'center'}}>
                                        <Alert
                                            description='Sorry, you are unauthorised, please contact ada@anu.edu.au for assistance.'
                                            type="error"
                                            showIcon
                                        />
                                </div>
                            </Col>
                        </Row>
                        <Row style={{paddingTop: '4vh'}}>
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
            // <div style={{background: '#fff'}}>
            // <>
            //     <Row>
            //         <div style={{paddingTop: '10%'}}>
            //             <Col xs={24} sm={24} md={{ span: 16, offset: 4 }} lg={{ span: 16, offset: 4 }} xl={{ span: 4, offset: 1 }} xxl={{ span: 4, offset: 1 }}>
            //
            //                     <img className="logo" style={{ lineHeight: 'inherit'}} src={ADAlogo}/>
            //
            //             </Col>
            //         </div>
            //     </Row>
            //     <div style={{paddingTop: '1%'}}>
            //         <span >Welcome to the ADA Console, please log in through AAF below.</span>
            //     </div>
            //     <div style={{paddingTop: '1%', width:'20%', margin: 'auto', textAlign:'left'}}>
            //         <Alert
            //             description='Sorry, you are unauthorised, please contact ada@anu.edu.au for assistance.'
            //             type="error"
            //             showIcon
            //         />
            //     </div>
            //     <div style={{paddingTop: '4%'}}>
            //         <a href={authStore.aafLoginUrl}>
            //             <img className="logo" style={{ lineHeight: 'inherit', cursor: 'pointer'}} src={aaf_login} />
            //         </a>
            //     </div>
            //     <div style={{ paddingTop: '15vh'}}>
            //     </div>
            // </>
            // </div>
        )
    }
}