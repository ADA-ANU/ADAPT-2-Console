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
    Switch, Tag
} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import DataverseForm from "./dataverseForm";
import systemStore from "../../stores/systemStore";
import FinalResult from "./finalResult";
import {adapt2Store} from "../../stores/adapt2Store";
import NewDVForm from "./newDVForm";
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer
export default class Option2DatasetWrapper extends Component{
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


    // test =()=>{
    //     this.props.adapt2Store.setDVFormServer('dev')
    //     this.formRef.current.setFieldsValue({
    //         server: 'dev',
    //         dataverse: 1866,
    //         subject: ["Agricultural Sciences", "Arts and Humanities"]
    //
    //     })
    // }

    handleSwitchOnChange = (checked)=>{
        console.log("create button value change to "+ checked)
        // this.setState({
        //     createDataset: checked
        // })
        this.props.adapt2Store.handleNewDatasetSwitch(checked)
        // if (checked === false){
        //     this.props.adapt2Store.dvFormRef.current.resetFields()
        //     this.props.systemStore.handlePermission(true)
        // }
    }
    render() {
        const { systemStore, authStore, adapt2Store, handleForm } = this.props
        const { createDataset } = adapt2Store
        console.log(systemStore.existingShellDS, systemStore.returnedURL)


        return(
            <div style={{background: 'white', paddingTop:'3vh', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>
                    <Row style={{paddingBottom:'1vh', paddingTop: '1vh'}}>
                        <Col style={{}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                            <Row>
                                <Col>
                                    <span style={{fontSize:'medium',fontWeight:'bold'}}>3. Create Dataset for ADAID:</span>
                                </Col>
                                <Col>
                                    <div style={{paddingLeft:'3vw'}}>
                                        <Switch
                                            checked={adapt2Store.createDataset}
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                            defaultChecked={false}
                                            onChange={this.handleSwitchOnChange}
                                            disabled={systemStore.existingShellDS || adapt2Store.copyMetadata}
                                        />
                                    </div>
                                </Col>
                                {/*<Col>*/}
                                {/*    <div style={{paddingLeft:'1vw'}}>*/}
                                {/*        <Button*/}

                                {/*            type="primary"*/}
                                {/*            onClick={this.test}*/}
                                {/*        >*/}
                                {/*            test*/}
                                {/*        </Button>*/}
                                {/*    </div>*/}
                                {/*</Col>*/}
                                {
                                    systemStore.existingShellDS?
                                        <Col>
                                            <div style={{paddingLeft: '1vw'}}>
                                                <a href={systemStore.returnedURL} target="_blank">{systemStore.returnedURL}</a>
                                            </div>
                                        </Col>: null
                                }
                                {
                                    systemStore.adaFolderInfoErrorMsg?
                                        <Col>
                                            <Tag style={{marginLeft:'1vw'}} color="#f50">{systemStore.adaFolderInfoErrorMsg}</Tag>
                                        </Col>
                                        : null
                                }
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{paddingTop: '3vh', paddingBottom: '2vh'}}>
                                {/*files={fileList} formReset={formReset}*/}
                                <NewDVForm handleFormData={handleForm} createDataset={createDataset} files={[]} formRef={adapt2Store.dvFormRef}/>
                            </div>

                        </Col>
                    </Row>
                </div>

            </div>
        )
    }
}