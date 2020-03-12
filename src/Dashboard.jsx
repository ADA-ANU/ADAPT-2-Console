import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import './App.css';
import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography, Button, Tooltip, Alert, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ADAlogo from '../src/static/img/ADAlogo.jpg';
import ANUlogo from '../src/static/img/ANUlogo.png';
import Vertical_line from './static/img/vertical-line.js'
import DVlogo from '../src/static/img/DVlogo.png'
import Login from "./components/Login";
import history from "./stores/routingStore"
const logo = require('./static/img/ADAlogo.jpg')

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;
const { Title } = Typography;



@inject('routingStore', 'systemStore')
@observer
export default class Dashboard extends Component {
    componentDidMount() {
        //history.push('/login')
    }

    render() {
        const {routingStore, systemStore} = this.props
        return(
                <Spin spinning={false} tip="Loading...">

                    <Layout style={{background: '#f0f2f5'}}>
                        <Header style={{ background: "white", width: '100%', height: '64px', lineHeight:'64px', padding: '0px',fontSize: '100', boxShadow: '0 1px 4px rgba(0,21,41,0.08'}}>
                            <Row>
                                <Col span={4} style={{marginLeft: '68px',marginTop:'auto', marginBottom:'auto', marginRight:'32px'}}>
                                    <img alt='LOGO' className="logo" style={{ height: 'auto'}} src={ADAlogo}/>
                                </Col>
                                <Col span={14}>
                                    <Menu
                                        theme='light'
                                        mode='horizontal'
                                        defaultOpenKeys={['/']}
                                        selectedKeys={[routingStore? routingStore.location.pathname : '/']}
                                        style={{ lineHeight:'64px'}}
                                    >
                                        <Menu.Item key='/'><Link to='/'>Over View</Link></Menu.Item>
                                        <Menu.Item key='/adapt2'><Link to='/adapt2'>ADAPT 2</Link></Menu.Item>
                                        <Menu.Item key='/forcode'><Link to='/forcode'>FOR Code</Link></Menu.Item>
                                        <Menu.Item key='/users'><Link to='/users'>User Management</Link></Menu.Item>
                                    </Menu>
                                </Col>
                                <Col span={4}>
                                    <Tooltip title="username">
                                        <Button type='primary' shape="circle" icon={<UserOutlined />} />
                                    </Tooltip>
                                </Col>
                            </Row>
                        </Header>
                        <Content style={{ paddingTop: '2%', paddingBottom: '2%'}}>
                            {
                                systemStore? systemStore.networkError?
                                    <Alert message={systemStore.networkErrorInfo.map(ele=>ele)} type="error" />
                                    : '' : ''
                            }

                            <Route path='/' component={Login} />
                            <Route path='/adapt2' component={Login} />

                        </Content>
                        <Footer>
                            <hr />
                            <Row justify="center" style={{paddingTop:'2vh'}}>
                                <img onClick={()=>{this.props.history.push('/adapt2')}} className="logo" style={{ height: '64px', lineHeight: '76px',marginTop: '10px'}} src={ADAlogo}/>
                                <img className="logo" style={{ height: '84px', lineHeight: '96px', }} src={Vertical_line}/>
                                <img className="logo" style={{ height: '64px', lineHeight: '76px',marginTop: '10px'}} src={ANUlogo}/>
                                <img className="logo" style={{ height: '84px', lineHeight: '76px',}} src={Vertical_line}/>
                                <img className="logo" style={{ height: '64px', lineHeight: '76px',marginTop: '10px'}} src={DVlogo}/>
                            </Row>
                            <br/>
                            <Row justify="center">
                                © {new Date().getFullYear()} Australian Data Archive (Australian National University) | All Rights Reserved.
                            </Row>
                        </Footer>
                    </Layout>
                </Spin>
        )
    }
}



