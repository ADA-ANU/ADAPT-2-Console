import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import './App.css';
import { Layout, Menu, Breadcrumb, Typography } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

const logo = require('./static/img/ADAlogo.jpg')

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title } = Typography;

let layout = {
    minHeight: '100vh'
}
let shadow = {
    webkitBoxShadow:"1px 3px 1px #9E9E9E",
    boxShadow: "10px 10px 10px 10px #9E9E9E",
}
let header={
    backgroundColor: '#00bcd3',
    flexDirection: 'horizontal'
}
let title = {
    lineHeight: '64px',
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: "Bellota"
}



const Dashboard =()=> {
    const [collapsed, setCollapsed ] = useState(false)


    const onCollapse = () => {
        setCollapsed(!collapsed)
    };
        return(
            <Layout style={layout}>
                <div style={shadow}>
                    <Header style={header}>
                        <div style={title}>
                            <img src={logo} />
                            <div style={{paddingLeft: '2%', display: 'inline-block'}}>
                                ADAPT 2
                            </div>
                        </div>
                    </Header>
                </div>
                    <Layout>
                        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} style={{backgroundColor: '#ffffff'}}>
                            <div className="logo" />
                            <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" >
                                <Menu.Item key="1">
                                    <PieChartOutlined />
                                    <span>Option 1</span>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <DesktopOutlined />
                                    <span>Option 2</span>
                                </Menu.Item>
                                <SubMenu
                                    key="sub1"
                                    title={
                                        <span>
                                          <UserOutlined />
                                          <span>User</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="3">Tom</Menu.Item>
                                    <Menu.Item key="4">Bill</Menu.Item>
                                    <Menu.Item key="5">Alex</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="sub2"
                                    title={
                                        <span>
                                          <TeamOutlined />
                                          <span>Team</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="6">Team 1</Menu.Item>
                                    <Menu.Item key="8">Team 2</Menu.Item>
                                </SubMenu>
                                <Menu.Item key="9">
                                    <FileOutlined />
                                    <span>File</span>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{ padding: '0 24px 24px' }}>
                                    <Breadcrumb style={{ margin: '16px 0' }}>
                                            {/*<Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                                            {/*<Breadcrumb.Item>List</Breadcrumb.Item>*/}
                                            {/*<Breadcrumb.Item>App</Breadcrumb.Item>*/}
                                    </Breadcrumb>
                                    <Content
                                        style={{
                                                background: '#fff',
                                                padding: 24,
                                                margin: 0,
                                                minHeight: 280,
                                                boxShadow: '2px 2px 6px 2px #9E9E9E'
                                        }}
                                    >
                                            Content
                                    </Content>
                            </Layout>
                    </Layout>
            </Layout>
        )

}

export default Dashboard