import PageNotFound from "./static/img/404.png";
import {Button} from "antd";
import React from "react";
import { RollbackOutlined } from '@ant-design/icons';

const NotFound = () => (
    <div>
        <img src={PageNotFound} style={{ display: 'block', margin: 'auto', position: 'relative' }} />
        <center><Button type="primary" shape="round" icon={<RollbackOutlined />} size='large' onClick={()=>window.location='/#/dashboard'}>
            Return to Home Page
        </Button></center>
    </div>
);

export default NotFound