import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
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
    Table, Select
} from 'antd';
import { UploadOutlined, InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import BulkOption1 from "./bulkOption1"
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;

@inject('routingStore', 'systemStore', 'authStore', 'bulkPublishStore')
@observer
export default class bulkPublish extends Component{
    constructor(props){
        super(props)
        this.state = {

        };
    }


    // onFinish = values => {
    //
    //     console.log('Received values of form: ', values);
    //     //this.createDatasetOnChange(false)
    //     //this.submit(values)
    // };

    handleRadioChange = e =>{
        console.log(e.target.value)
        const value = e.target.value
        this.props.bulkPublishStore.SelectionOnChange(value)
    }
    handleAnchorClick = (e, link) => {
        e.preventDefault();
    };
    handleSubmit=(form)=>{
        console.log(form)
    }

    render() {
        const { systemStore, authStore, bulkPublishStore } = this.props
        const radioStyle = {
            display: 'block',
            height: '40px',
            lineHeight: '30px',
        };
        console.log(bulkPublishStore.selection)
        return(
            <div style={{background: 'white', paddingTop:'2%', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>

                    <Row style={{paddingTop: '2vh'}}>
                        <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div id="select" style={{paddingTop: '4vh', paddingBottom: '2vh', paddingLeft: '5vw'}}>
                                <Radio.Group
                                    onChange={this.handleRadioChange}
                                    value={bulkPublishStore.selection}
                                >
                                    <div style={radioStyle}>
                                        <Radio value={1}>
                                            Select Datasets from Dataverse
                                        </Radio>

                                    </div>
                                    <div style={radioStyle}>
                                        <Radio value={2}>
                                            Paste list of DOIs to single Dataverse
                                        </Radio>

                                    </div>
                                    <div style={radioStyle}>
                                        <Radio value={3}>
                                            Paste list of complete Dataset URLs
                                        </Radio>
                                    </div>
                                </Radio.Group>
                            </div>

                        </Col>
                    </Row>
                    {
                        bulkPublishStore.selection ===1?
                            <BulkOption1 />: null
                    }
                    {/* {
                        bulkPublishStore.selection ===2?
                            <BulkOption2 />: null
                    }
                    {
                        bulkPublishStore.selection ===3?
                            <BulkOption3 />: null
                    } */}
                    <Row>
                        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{paddingTop: '5vh', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    form="datasetCreation"
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    //onClick={adapt2Store.selection ===1?()=>adapt2Store.handleSubmit(): null}
                                    //loading={adapt2Store.isLoading}
                                    //disabled={}
                                >
                                    {bulkPublish.isLoading ? 'Uploading' : 'Publish'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {/*ref => {adapt2Store.adapt2Ref = ref}*/}
                    <div id="finalResult" >
                        {
                            systemStore.showfinalResult?(

                                <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                                    <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                                        <FinalResult clearResult={this.clearResult} />
                                    </Col>
                                </Row>

                            ):null
                        }
                    </div>
                </div>

            </div>
        )
    }
}