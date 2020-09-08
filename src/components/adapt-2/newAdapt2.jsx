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
import DataverseForm from "./dataverseForm";
import systemStore from "../../stores/systemStore";
import FinalResult from "./finalResult";
import Option2DatasetWrapper from "./option2DatasetWrapper";
import {adapt2Store} from "../../stores/adapt2Store";
import Option2FileTableWrapper from "./option2FileTableWrapper";
import Option2DSnFilesWrapper from "./option2DSnFilesWrapper";
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer
export default class newAdapt2 extends Component{
    constructor(props){
        super(props)
        this.state = {

        };
    }

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
    handleSubmit=(form)=>{
        console.log(form)
    }

    render() {
        const { systemStore, authStore, adapt2Store } = this.props
        const radioStyle = {
            display: 'block',
            height: '40px',
            lineHeight: '30px',
        };
        const adaFolderList = authStore.adaFolderList
        const submitCheck = ()=>{
            //console.log("systemStore.doiValid", systemStore.doiValid, "systemStore.dataversePermissionValid", systemStore.dataversePermissionValid)
            //console.log("systemStore.destinationDOIValid", systemStore.destinationDOIValid, "systemStore.datasetPermissionValid", systemStore.datasetPermissionValid)
            console.log(toJS([...systemStore.localSelectedKeys.values()]))
            if (adapt2Store.selection !==1){
                if(adapt2Store.selection ===2){
                    if(adapt2Store.createDataset && !systemStore.dataversePermissionValid){
                        return true
                    }
                    else return false
                }
                else if(adapt2Store.selection ===3){
                    if([...systemStore.localSelectedKeys.values()].length ===0 && [...systemStore.remoteSelectedKeys.values()].length ===0){
                        return true
                    }
                    else if(!adapt2Store.selectedADAFolder){
                        return true
                    }
                    else return false
                }

            }
            else {
                return false
                // if(systemStore.doiValid && systemStore.dataversePermissionValid && systemStore.destinationDOIValid && systemStore.datasetPermissionValid)
                //     return false
                // else return true
            }
        }
        console.log(adapt2Store.selection)
        console.log(systemStore.showfinalResultDVFiles)

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
                                <Link href="#adaid" title="ADAID"/>
                                {
                                    adapt2Store.selection !==1?
                                        <>
                                        <Link href="#fileSource" title="File Source"/>
                                        <Link href="#dvForm" title="Create Dataset"/>
                                        <Link href="#fileTable" title="Select Files"/>
                                        </>: null
                                }

                                {
                                    systemStore.showfinalResult?
                                        <Link href="#finalResult" title="Final Result"/>: null
                                }
                                {/*<Link href="#components-anchor-demo-basic" title="Basic demo" />*/}
                            </Anchor>
                        </Col>
                        <Col xs={{ span: 22, offset: 0 }} sm={{ span: 20, offset: 0 }} md={{ span: 18, offset: 1 }} lg={{ span: 16, offset: 1 }} xl={{ span: 14, offset: 1 }} xxl={{ span: 14, offset: 1 }}>

                            <div style={{marginTop: '3%', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    form="datasetCreation"
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    onClick={adapt2Store.selection ===1?()=>adapt2Store.handleSubmit(): null}
                                    loading={adapt2Store.isLoading}
                                    disabled={submitCheck()}
                                >
                                    {adapt2Store.isLoading ? 'Uploading' : 'Get ADAID'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                            <div style={{paddingBottom: '1vh'}}>
                                <span style={{fontSize:'medium',fontWeight:'bold'}}>1. ADAID: </span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div id="adaid" style={{paddingTop: '3vh', paddingBottom: '2vh', paddingLeft: '5vw'}}>
                                <Radio.Group
                                    onChange={this.handleRadioChange}
                                    value={adapt2Store.selection}
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
                                        <Row>
                                            <Col>
                                                <Radio value={3}>
                                                    Existing ADAID - select on existing ADAID and add files
                                                </Radio>
                                            </Col>
                                            <Col>
                                                <div style={{paddingLeft: '1vw'}}>
                                                    <Select
                                                        value={adapt2Store.selectedADAFolder}
                                                        style={{ width: '100%' }}
                                                        placeholder="select a ADA folder"
                                                        allowClear
                                                        size={"small"}
                                                        disabled={adapt2Store.selection !== 3}
                                                        //defaultValue={['china']}
                                                        onChange={e=>adapt2Store.adaFolderOnChange(e)}
                                                        optionLabelProp="label"
                                                    >
                                                        {
                                                            adaFolderList && adaFolderList.length>0?
                                                                adaFolderList.map((folder,index)=>
                                                                    <Select.Option value={folder} key={index} label={folder}>
                                                                        {folder}
                                                                    </Select.Option>
                                                                ):null

                                                        }
                                                    </Select>
                                                </div>

                                            </Col>
                                        </Row>
                                    </div>
                                </Radio.Group>
                            </div>

                        </Col>
                    </Row>
                    {
                        adapt2Store.selection ===2?
                            <>
                                <Option2DSnFilesWrapper handleForm={this.handleForm}/>
                                <Option2DatasetWrapper handleForm={this.handleForm}/>
                                <Option2FileTableWrapper handleForm={this.handleForm}/>
                            </>: null
                    }
                    {
                        adapt2Store.selection ===3?
                            <>
                                <Option2DSnFilesWrapper handleForm={this.handleForm}/>
                                <Option2DatasetWrapper handleForm={this.handleForm}/>
                                <Option2FileTableWrapper handleForm={this.handleForm}/>
                            </>: null
                    }
                    <Row>
                        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{marginTop: '3%', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    form="datasetCreation"
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    onClick={adapt2Store.selection ===1?()=>adapt2Store.handleSubmit(): null}
                                    loading={adapt2Store.isLoading}
                                    disabled={submitCheck()}
                                >
                                    {adapt2Store.isLoading ? 'Uploading' : 'Get ADAID'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {/*ref => {adapt2Store.adapt2Ref = ref}*/}
                    <div id="finalResult" ref={adapt2Store.adapt2Ref}>
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