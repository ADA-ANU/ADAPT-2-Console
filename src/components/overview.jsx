import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';

import 'antd/es/spin/style/css';
import { Layout, Menu, Spin, Typography, Button, Tooltip, Alert, Row, Col } from 'antd';

export default class Overview1 extends Component{
    render() {
        return (
            <div style={{background: 'white'}}>
                overview
            </div>
        );
    }
}