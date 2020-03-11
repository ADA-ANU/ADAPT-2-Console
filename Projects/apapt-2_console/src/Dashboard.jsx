import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import './App.css';
import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography } from 'antd';

const logo = require('./static/img/ADAlogo.jpg')

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Title } = Typography;


@inject('routingStore')
@observer
export default class Dashboard extends Component {
    render() {
        return(
                <Spin spinning={false} tip="Loading...">
                    <Layout style={{background: '#f0f2f5'}}>
                        <Header style={{ background: "white", width: '100%', height: '64px', lineHeight: '64px', padding: '0px' }}>
                            <div style={{float: 'left', marginLeft: '48px', marginRight: '36px'}}>
                                <img className="logo" style={{ height: '48px', lineHeight: '64px' }} src={'https://ada.edu.au/wp-content/uploads/2018/03/ADA-PRIMARY-INLINE-300x49.jpg'}/>
                            </div>
                            <Menu
                                theme='light'
                                mode='horizontal'
                                defaultOpenKeys={['/']}
                                selectedKeys={[this.props.routingStore? this.props.routingStore.location.pathname : '/']}
                                style={{ lineHeight: '64px', height: '64px',boxShadow: '0 1px 4px rgba(0,21,41,0.08' }}
                            >

                            </Menu>
                        </Header>
                    </Layout>
                </Spin>
        )
    }
}



