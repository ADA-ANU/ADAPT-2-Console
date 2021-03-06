import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { toJS } from 'mobx'
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import './App.css';
import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography, Button, Tooltip, Alert, Row, Col, Badge, Dropdown } from 'antd';
import { UserOutlined, SettingOutlined, CopyOutlined, CloudUploadOutlined, PictureOutlined, KeyOutlined } from '@ant-design/icons';
import ADAlogo from '../src/static/img/ADA-logo.png';
import ANUlogo from '../src/static/img/ANUlogo.png';
import Vertical_line from './static/img/vertical-line.js'
import DVlogo from '../src/static/img/DVlogo.png'
import Login from "./components/Login";
import history from "./stores/routingStore"
import Overview from "./components/overview"
import Adapt2 from "./components/adapt-2/adapt2";
import DataverseFiles from "./components/adapt-2/dataverseFiles";
import CopyTool from "./components/adapt-2/copyTool";
import newAdapt2 from "./components/adapt-2/newAdapt2";
import bulkPublish from "./components/bulk-publish/bulkPublish"
import test from './components/adapt-2/test'
import APIManager from './components/adapt-2/apiManager'
//const logo = require('./static/img/ADAlogo.jpg')
import NotFound from "./404page";
import hccdaImages from './components/hccda-images/hccdaImages';
const { SubMenu } = Menu;
const { Header, Content, Footer } = Layout;
const { Title } = Typography;



@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class Dashboard extends Component {
    componentDidMount() {
        //history.push('/login')
        //fetch('http://localhost:3000/api/authenticate', {credentials: 'include'}).then(res=>res.json()).then(json=>console.log(json))
        //console.log("yes")
        //this.redirectURL()

    }
    redirectURL = ()=>{
        console.log("AAAAAAAAAAAAAAAAA")
        this.props.history.push('/dashboard/adapt2-new')
    }

    render() {
        const {routingStore, systemStore, authStore} = this.props
        const user = toJS(authStore.currentUser)
        console.log(authStore.serverList)
        const menu = (
            <Menu>
                <Menu.Item key="0" icon={<KeyOutlined />}>
                    {/* <span style={{cursor:'pointer'}} onClick={()=>{authStore.logout()}}>Manage API Keys</span> */}
                    <APIManager />
                </Menu.Item>
                {/* <Menu.Item key="1">
                    <span style={{cursor:'pointer'}} onClick={()=>{authStore.logout()}}>Log out</span>
                </Menu.Item> */}
            </Menu>
        )
        return(
                <Spin style={{ marginTop:'12%' }} spinning={authStore?authStore.siteLoading : true} tip="Loading..." >

                    <Layout style={{background: '#f0f2f5'}}>
                        <Header style={{ background: "white", width: '100%', height: '64px', lineHeight:'64px', padding: '0px',fontSize: '100', boxShadow: '0 1px 4px rgba(0,21,41,0.08'}}>
                            <Row>
                                {/*marginLeft: '68px', marginRight:'32px' style={{marginTop:'auto', marginBottom:'auto'}}*/}
                                <Col xs={{ span: 4, offset: 1 }} sm={{ span: 4, offset: 2 }} md={{ span: 4, offset: 1 }} lg={{ span: 4, offset: 1 }} xl={{ span: 4, offset: 1 }} xxl={{ span: 4, offset: 1 }} >
                                    <img alt='LOGO' className="logo" style={{ width:'80%', }} src={ADAlogo}  />
                                    {/*cursor:'pointer' onClick={()=>{history.push('/dashboard/adapt2-new')}}*/}
                                </Col>
                                <Col xs={{ span: 16, offset: 0 }} sm={{ span: 12, offset: 0 }} md={{ span: 13, offset: 0 }} lg={{ span: 13, offset: 0 }} xl={{ span: 13, offset: 0 }} xxl={{ span: 13, offset: 0 }}>
                                    <Menu
                                        theme='light'
                                        mode='horizontal'
                                        defaultOpenKeys={['/overview']}
                                        selectedKeys={[routingStore? routingStore.history.location.pathname : '/']}
                                        style={{ lineHeight:'64px',height: '64px', borderBottom: '0px'}}
                                    >
                                        {/*<SubMenu icon={<SettingOutlined />} title="ADAPT-2">*/}
                                        {/*    <Menu.Item key='/dashboard'><Link to='/dashboard'>ADAPT-2 New</Link></Menu.Item>*/}
                                        {/*    <Menu.Item key='/dashboard/adapt2-existing'><Link to='/dashboard/adapt2-existing'>ADAPT-2 Existing</Link></Menu.Item>*/}
                                        {/*    /!*<Menu.Item key='/dashboard/forcode'><Link to='/dashboard/forcode'>FOR Code</Link></Menu.Item>*!/*/}
                                        {/*    /!*<Menu.Item key='/dashboard/users'><Link to='/dashboard/users'>User Management</Link></Menu.Item>*!/*/}
                                        {/*</SubMenu>*/}
                                        <Menu.Item icon={<SettingOutlined />} key="/dashboard"><Link to='/dashboard'>ADAPT2</Link></Menu.Item>
                                        <Menu.Item icon={<CopyOutlined />} key="/dashboard/copy-tool"><Link to='/dashboard/copy-tool'>Copy Tool</Link></Menu.Item>
                                        <Menu.Item icon={<CloudUploadOutlined />} key="/dashboard/bulk-publish"><Link to='/dashboard/bulk-publish'>Bulk Publish</Link></Menu.Item>
                                        <Menu.Item icon={<PictureOutlined />} key="/dashboard/hccda-images"><Link to='/dashboard/hccda-images'>HCCDA Images</Link></Menu.Item>

                                    </Menu>
                                </Col>
                                <Col xs={{ span: 1, offset: 0 }} sm={{ span: 1, offset: 0 }} md={{ span: 1, offset: 1 }} lg={{ span: 1, offset: 1 }} xl={{ span: 1, offset: 1 }} xxl={{ span: 1, offset: 1 }}>
                                    <div style={{textAlign:'center'}}>
                                        <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                                            <Badge count={0}>
                                                <Button type='primary' shape="circle" icon={<UserOutlined />} />
                                            </Badge>
                                        </Dropdown>
                                    </div>
                                </Col>
                                <Col xs={{ span: 0, offset: 1 }} sm={{ span: 4, offset: 1 }} md={{ span: 3, offset: 0 }} lg={{ span: 3, offset: 0 }} xl={{ span: 2, offset: 0 }} xxl={{ span: 2, offset: 0 }}>
                                    <span>{user? user.userName: ""}</span>
                                </Col>
                            </Row>
                        </Header>
                        <Content style={{ padding: '1%'}}>
                                   {
                                        authStore? authStore.networkError === true?
                                            <Alert style={{textAlign: 'center'}} message={ authStore.networkErrorMessage.toString() } type="error" />
                                            : '' : ''
                                    }
                                    {/*<Route exact path='/dashboard' component={Adapt2} />*/}
                                    {/*<Route exact path='/dashboard' component={Adapt2} />*/}
                                    {/*<Route exact path='/dashboard/adapt2-existing' component={DataverseFiles} />*/}
                                    <Route exact path='/dashboard' component={newAdapt2} />
                                    <Route exact path='/dashboard/copy-tool' component={CopyTool} />
                                    <Route exact path='/dashboard/bulk-publish' component={bulkPublish} />
                                    <Route exact path='/dashboard/hccda-images' component={hccdaImages} />
                                    {/*{*/}
                                    {/*    user.userEmail === "Mingjing.Peng@anu.edu.au" || user.userEmail === "Marina.McGale@anu.edu.au"?*/}
                                    {/*        <Route exact path='/dashboard/test' component={test} />: null*/}
                                    {/*}*/}
                                    {/*<Route exact path='/dashboard/test' component={test} />*/}
                        </Content>
                        <Footer>
                            <hr />
                            <Row justify="center" style={{paddingTop:'2vh'}}>
                                <img className="logo" style={{ height: '64px', lineHeight: '76px',marginTop: '10px'}} src={ADAlogo}/>
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



