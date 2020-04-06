import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx'
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import './App.css';
import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography, Button, Tooltip, Alert, Row, Col, Badge, Dropdown } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import ADAlogo from '../src/static/img/ADAlogo.jpg';
import ANUlogo from '../src/static/img/ANUlogo.png';
import Vertical_line from './static/img/vertical-line.js'
import DVlogo from '../src/static/img/DVlogo.png'
import Login from "./components/Login";
import history from "./stores/routingStore"
import Overview from "./components/overview"
import Adapt2 from "./components/adapt-2/adapt2";
const logo = require('./static/img/ADAlogo.jpg')

const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;
const { Title } = Typography;



@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class Dashboard extends Component {
    componentDidMount() {
        //history.push('/login')
        //fetch('http://localhost:3000/api/authenticate', {credentials: 'include'}).then(res=>res.json()).then(json=>console.log(json))

    }

    render() {
        const {routingStore, systemStore, authStore} = this.props
        const user = toJS(authStore.currentUser)
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <span style={{cursor:'pointer'}} onClick={()=>{authStore.logout()}}>Log out</span>

                </Menu.Item>
            </Menu>
        )
        return(
                <Spin style={{ marginTop:'12%' }} spinning={authStore?authStore.siteLoading : true} tip="Loading..." >

                    <Layout style={{background: '#f0f2f5'}}>
                        <Header style={{ background: "white", width: '100%', height: '64px', lineHeight:'64px', padding: '0px',fontSize: '100', boxShadow: '0 1px 4px rgba(0,21,41,0.08'}}>
                            <Row>
                                <Col span={4} style={{marginLeft: '68px',marginTop:'auto', marginBottom:'auto', marginRight:'32px'}}>
                                    <img alt='LOGO' className="logo" style={{ height: 'auto', cursor:'pointer'}} src={ADAlogo} onClick={()=>{history.push('/overview')}} />
                                </Col>
                                <Col span={14}>
                                    <Menu
                                        theme='light'
                                        mode='horizontal'
                                        defaultOpenKeys={['/overview']}
                                        selectedKeys={[routingStore? routingStore.history.location.pathname : '/']}
                                        style={{ lineHeight:'64px',height: '64px', borderBottom: '0px'}}
                                    >
                                        <Menu.Item key='/dashboard'><Link to='/dashboard'>ADAPT 2</Link></Menu.Item>
                                        {/*<Menu.Item key='/dashboard/adapt2'><Link to='/dashboard/adapt2'>ADAPT 2</Link></Menu.Item>*/}
                                        {/*<Menu.Item key='/dashboard/forcode'><Link to='/dashboard/forcode'>FOR Code</Link></Menu.Item>*/}
                                        {/*<Menu.Item key='/dashboard/users'><Link to='/dashboard/users'>User Management</Link></Menu.Item>*/}
                                    </Menu>
                                </Col>
                                <Col span={4} >
                                    <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                                        <Badge count={0}>
                                            <Button type='primary' shape="circle" icon={<UserOutlined />} />
                                        </Badge>
                                    </Dropdown>
                                    <span style={{paddingLeft: '4%'}}>{user? user.userName: ""}</span>
                                </Col>
                            </Row>
                        </Header>
                        <Content style={{ padding: '1%'}}>
                            {
                                authStore? authStore.networkError === true?
                                    <Alert style={{textAlign: 'center'}} message={ authStore.networkErrorMessage.toString() } type="error" />
                                    : '' : ''
                            }
                                <Route exact path='/dashboard' component={Adapt2} />
                                <Route exact path='/dashboard/adapt2' component={Adapt2} />
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



