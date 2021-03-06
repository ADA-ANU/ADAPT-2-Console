import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import {  Route, withRouter } from 'react-router-dom';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import {
    Upload,
    Button,
    message,
    notification,
    Collapse,
    Popover,
    Col,
    Row,
    Anchor,
    Radio,
    Form,
    Divider,
    Table,
    Switch
} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import DataverseForm from "./dataverseForm";
import systemStore from "../../stores/systemStore";
import FinalResult from "./finalResult";
import {adapt2Store} from "../../stores/adapt2Store";
import NewDVForm from "./newDVForm";
import NewDSnFiles from "./newDSnFiles";
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;


const inputSource = [
    { label: 'URL', value: 1 },
    { label: 'Upload', value: 2 },
];

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer
export default class Option2DSnFilesWrapper extends Component{
    state={
        //createDataset: false,
        fileUploadSwitch: true,
        modalOpen: false,
        selectedServer: null,
        selectedDataverse: null
    }

    finalResult_CopyTool=React.createRef()
    adapt2Ref = React.createRef();
    formRef = React.createRef();

    inputSourceOnChange = e => {
        console.log('input source changed to', e.target.value);
        this.props.adapt2Store.handleInputSourceChange(e.target.value)
    };
    render() {
        const { systemStore, authStore, adapt2Store, handleForm } = this.props
        const { createDataset } = adapt2Store



        return(
            <div style={{background: 'white', paddingTop:'4vh', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>
                    <Row style={{paddingBottom:'1vh', paddingTop: '1vh'}}>
                        <Col style={{}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                            <Row>
                                <Col>
                                    <span style={{fontSize:'medium',fontWeight:'bold'}}>2. Select Source of Files to be Uploaded:</span>
                                </Col>
                                <Col>
                                    <div style={{paddingLeft: '1vw'}}>
                                        <Radio.Group
                                            options={inputSource}
                                            onChange={this.inputSourceOnChange}
                                            value={adapt2Store.inputSource}
                                            optionType="button"
                                            buttonStyle="solid"
                                            size="small"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{paddingTop: '3vh', paddingBottom: '2vh'}}>
                                {/*files={fileList} formReset={formReset}*/}
                                {/*<NewDVForm handleFormData={handleForm} createDataset={createDataset} files={[]} formRef={this.formRef}/>*/}
                                <NewDSnFiles />
                            </div>

                        </Col>
                    </Row>
                </div>

            </div>
        )
    }
}