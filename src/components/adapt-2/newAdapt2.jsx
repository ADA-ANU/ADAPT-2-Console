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
    Table
} from 'antd';
import { UploadOutlined, InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import DataverseForm from "./dataverseForm";
import systemStore from "../../stores/systemStore";
import FinalResult from "./finalResult";
import {adapt2Store} from "../../stores/adapt2Store";
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer
export default class newAdapt2 extends Component{


    finalResult_CopyTool=React.createRef()
    adapt2Ref = React.createRef();

    // onFinish = values => {
    //
    //     console.log('Received values of form: ', values);
    //     //this.createDatasetOnChange(false)
    //     //this.submit(values)
    // };

    handleRadioChange = e =>{
        console.log(e.target.value)
        const value = e.target.value
        this.props.adapt2Store.SelectionOnChange(value)
    }
    handleAnchorClick = (e, link) => {
        e.preventDefault();
    };

    render() {
        const { systemStore, authStore, adapt2Store } = this.props
        const radioStyle = {
            display: 'block',
            height: '40px',
            lineHeight: '30px',
        };

        return(
            <div style={{background: 'white', paddingTop:'2%', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>
                    {/*<Form*/}
                    {/*    id="adapt2"*/}
                    {/*    ref={this.adapt2Ref}*/}
                    {/*    onFinish={this.onFinish}*/}
                    {/*    scrollToFirstError={true}*/}
                    {/*    labelCol={{ span: 6 }}*/}
                    {/*    wrapperCol={{ span: 16, offset:1 }}*/}
                    {/*    layout="horizontal"*/}
                    {/*    //initialValues={{ server: undefined, dataverse: undefined, doi: undefined, subject: undefined, copyRange: 1}}*/}
                    {/*    size={"middle"}*/}
                    {/*>*/}

                    <Row>
                        <Col xs={{ span: 1, offset: 0 }} sm={{ span: 1, offset: 1 }} md={{ span: 1, offset: 1 }} lg={{ span: 2, offset: 1 }} xl={{ span: 3, offset: 1 }} xxl={{ span: 3, offset: 1 }}>
                            <Anchor
                                onClick={this.handleAnchorClick}
                                offsetTop={150}
                            >
                                <Link href="#sourceDS" title="Source Dataset"/>
                                <Link href="#copyRange" title="Copy Range"/>
                                <Link href="#fileList" title="File List"/>
                                {
                                    systemStore.showfinalResultDVFiles?
                                        <Link href="#finalResult" title="Final Result"/>: null
                                }
                                {/*<Link href="#components-anchor-demo-basic" title="Basic demo" />*/}
                            </Anchor>
                        </Col>
                        <Col xs={{ span: 22, offset: 0 }} sm={{ span: 20, offset: 0 }} md={{ span: 18, offset: 1 }} lg={{ span: 16, offset: 1 }} xl={{ span: 14, offset: 1 }} xxl={{ span: 14, offset: 1 }}>

                            <div style={{marginTop: '3%', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    //form="createDataset"
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    onClick={adapt2Store.HandleSubmit}
                                    loading={adapt2Store.isLoading}
                                >
                                    {adapt2Store.isLoading ? 'Uploading' : 'Get ADAID'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{paddingTop: '3vh', paddingBottom: '2vh', paddingLeft: '2vw'}}>
                                <Radio.Group
                                    onChange={this.handleRadioChange}
                                    value={adapt2Store.Selection}
                                >
                                    <div style={radioStyle}>
                                        <Radio value={1}>
                                            New only - create new ADAID and directory
                                        </Radio>

                                    </div>
                                    <div style={radioStyle}>
                                        <Radio value={2}>
                                            New + More - create new ADAID, directory and add files
                                        </Radio>

                                    </div>
                                    <div style={radioStyle}>
                                        <Radio value={3}>
                                            Existing ADAID - select on existing ADAID and add files
                                        </Radio>

                                    </div>
                                </Radio.Group>
                            </div>
                            {/*dataset={formdata} adaid={adaID} doi={doi} files={returnedFiles}*/}
                            <div id="finalResult" ref={ref => {this.finalResult_New = ref}}>
                                {
                                    systemStore.showfinalResult?<FinalResult clearResult={this.clearResult}/>: null
                                }
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{marginTop: '3%', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    //form="createDataset"
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    onClick={adapt2Store.HandleSubmit}
                                    loading={adapt2Store.isLoading}
                                >
                                    {adapt2Store.isLoading ? 'Uploading' : 'Get ADAID'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {/*</Form>*/}
                </div>

            </div>
        )
    }
}