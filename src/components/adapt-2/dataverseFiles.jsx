import React, {Component, useState} from 'react';
import {Form, Input, Select, Switch, Button, Table, Spin, Row, Col, Divider, Tag, notification, Anchor} from 'antd';
import { inject, observer } from 'mobx-react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import APIInput from "./apiInput";
import { toJS } from 'mobx'
import axios from 'axios'
import { MinusCircleOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import DynamicField from "./dynamicFields";
import FinalResult from "./finalResult";
const { TextArea } = Input;
const { Link } = Anchor;
const doiLoadingIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        //render: text => <a>{text}</a>,
    },
    {
        title: 'File Name',
        dataIndex: 'filename',
    },
    {
        title: 'Size',
        dataIndex: 'filesize',
    },
    ,
    {
        title: 'MD5',
        dataIndex: 'md5',
    },
];

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class DataverseFiles extends Component{
    state={
        createDataset: false,
        doiExisting: false,
        serverExisting: false,
        modalOpen: false,
        selectedServer: null,
        selectedDataverse: null,
        selectedADAFolder: null,
        newADAID: false,
        doi: null,
        server: null,
        doiMessage: null,
        isLoading: false,
        fileList:[]
    }
    componentDidMount() {
        this.props.systemStore.handleFinalResultClose()
        this.props.systemStore.handleFinalResultDVFilesClose()
    }

    fileFormRef = React.createRef();

    resetState = ()=>{
        this.setState({
            createDataset: false,
            doiExisting: false,
            serverExisting: false,
            modalOpen: false,
            selectedServer: null,
            selectedDataverse: null,
            selectedADAFolder: null,
            newADAID: false,
            doi: null,
            server: null,
            doiMessage: null,
            isLoading: false,
            fileList:[]
        })
        this.props.systemStore.resetFileList()
    }


    onFinish = values => {
        console.log('Received values of form: ', values);
        //this.createDatasetOnChange(false)
        this.submit(values)
    };

    submit=async (form)=>{
        this.props.systemStore.handleFinalResultDVFilesClose()
        const { doi, server, dataverse, adaIDSelect, newADAID } = form
        if (dataverse ===undefined){
            form.server = this.state.doiMessage
        }
        form.userid = toJS(this.props.authStore.currentUser).userID
        console.log(form)
        //let data = JSON.stringify(form)
        // console.log(await this.getFileList())
        // if (await this.getFileList()) {
            this.setState({isLoading: true})
            axios.post(API_URL.Download_Dataset_Files, form)
                .then(res => {
                    if (res.status === 201) {
                        const data = res.data
                        this.props.systemStore.handleFinalResultOpen({}, data.adaid, doi, data.files, 'dvFiles')
                        this.resetState()
                        this.fileFormRef.current.resetFields()
                    }
                })
                .catch(err => {
                    if (err.response) {
                        this.setState({
                            isLoading: false
                        });
                        if (err.response.status === 403) {
                            const servers = toJS(this.props.authStore.serverList)
                            for (let serv of servers) {
                                if (serv.alias === form.server) {
                                    this.props.systemStore.handleFailedAPI(serv.id, 2, err.response.data)
                                    this.props.systemStore.handleAPIInputModal(true)
                                }
                            }

                        } else if (err.response.status === 405) {
                            const servers = toJS(this.props.authStore.serverList)
                            for (let serv of servers) {
                                if (serv.alias === form.server) {
                                    this.props.systemStore.handleFailedAPI(serv.id, 1, err.response.data)
                                    this.props.systemStore.handleAPIInputModal(true)
                                }
                            }
                        } else {
                            //console.log(err)
                            this.openNotificationWithIcon('error', 'files', `${err.response.data}, please try again.`)
                        }

                    } else {
                        this.setState({
                            isLoading: false
                        });
                        this.openNotificationWithIcon('error', 'files', `${err}, please refresh the page and retry.`)
                    }
                })
        //}
    }
    openNotificationWithIcon = (type,fileName,error) => {
        if (type === 'success'){
            notification[type]({
                message: 'Successful',
                description:
                    `You have successfully uploaded file ${fileName}`,
            });
        }
        else {
            notification[type]({
                message: 'Operation Failed',
                description:
                    `Operation failed, ${error}`,
                duration: 0,
            });
        }

    };
    serverOnChange =(value) => {
        console.log(`selected ${value}`);
        if (value === undefined){
            this.setState({
                selectedServer: null,
                serverExisting: false
            })
            this.fileFormRef.current.resetFields()
            // this.fileFormRef.current.setFieldsValue({
            //     server: undefined,
            // })
            // this.fileFormRef.current.setFields([
            //     {
            //         name: 'dataverse',
            //         errors: null,
            //     },
            //     {
            //         name: 'server',
            //         errors: null,
            //     }
            //     ]);

        }
        else {
            this.fileFormRef.current.setFieldsValue({
                dataverse: undefined,
                doi: undefined
            })
            this.setState({
                selectedServer: value,
                serverExisting: true
            })
        }


    }
    handleADAFolderChange = value =>{
        console.log(`ada folder selected ${value}`);
        if (value === undefined){
            this.setState({
                selectedADAFolder: null,
            })
            //this.fileFormRef.current.resetFields()
        }
        else {
            // this.fileFormRef.current.setFieldsValue({
            //     dataverse: undefined,
            //     doi: undefined
            // })
            this.setState({
                selectedADAFolder: value,
            })
        }
    }
    handleNewADA = checked =>{
        this.setState({newADAID: checked})
        if(checked){
            this.fileFormRef.current.setFieldsValue({
                adaIDSelect: undefined,
            })
        }
    }

    getFileList =async () => {
        const { doi, doiMessage } = this.state
        const userid = toJS(this.props.authStore.currentUser).userID
        try{
            let check = await this.props.systemStore.getFileListByDOI(doi, doiMessage, userid)
            return check
        }catch(error){
            console.log(error)
            return false
        }
    }
    doiOnChange = e =>{
        const value = e.target.value
        if( value.length >0){

            this.setState({doiExisting:true})
            this.fileFormRef.current.setFieldsValue({
                dataverse: undefined,
                server: undefined
            })


            if (value.indexOf('https://')===0){
                let server = value.split('//')[1]
                if (server.indexOf('/')>0){
                    let ser = 'https://'+server.split('/')[0]+"/"
                    let servers = toJS(this.props.authStore.serverList)
                    console.log(servers)
                    let temp = servers.filter(serv=>serv.url ===ser)
                    console.log(temp)
                    if (temp.length ===1){
                        this.setState({doiMessage:temp[0].alias})
                        if (value.indexOf('doi:')>0){
                            const userid = toJS(this.props.authStore.currentUser).userID
                            let doi = value.split('doi:')[1]
                            this.setState({doi: doi})
                            this.props.systemStore.getFileListByDOI(doi, temp[0].alias, userid)
                        }
                        else {
                            console.log("AAAAAAAAAAAAAA")
                            this.props.systemStore.resetFileList()
                        }
                    }
                    else {
                        this.setState({doiMessage:"Server not found."})

                    }
                    this.setState({server: ser})
                }
                else {
                    this.setState({server: server, doiMessage: null})
                }
            }
        else{
                this.setState({server: null, doi: null})
                this.props.systemStore.resetFileList()
            }
        }
        else if(value.length ===0){
            this.props.systemStore.resetFileList()
            this.setState({
                doiExisting:false,
                doi: null,
                server: null
            })
            this.fileFormRef.current.resetFields()
        }
    }

    render() {
        const { authStore, systemStore, files, formReset } = this.props
        const { doi, doiMessage, isLoading } = this.state
        const serverList = toJS(authStore.serverList)
        const datasource = toJS(systemStore.fileList)
        const user = toJS(authStore.currentUser)
        const dataverses = toJS(authStore.Dataverses)
        const adaFolderList = toJS(authStore.adaFolderList)

        return (
            <div style={{background: 'white', paddingTop:'2%', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>
                    {/*<a href="#API" className="anchor">#</a>*/}
                    <Form
                        id="dataverseFiles"
                        ref={this.fileFormRef}
                        onFinish={this.onFinish}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16, offset:1 }}
                        layout="horizontal"
                        initialValues={{ server: undefined, dataverse: undefined, doi: undefined, subject: undefined}}
                        size={"middle"}
                    >
                        <Row>
                            <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>

                            </Col>
                        </Row>
                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            {/*border:'1px solid #BFBFBF'*/}
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>
                                <div style={{textAlign: 'center', paddingTop:'2vh'}}>
                                    <span>Dataset: </span>
                                    <Divider />
                                </div>
                                    <Form.Item
                                        label="Dataset URL"
                                        name="doi"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: this.state.doiExisting ===false && this.state.serverExisting ===false ||this.state.doiExisting,
                                                message: "Please enter DOI.",
                                            },
                                            {
                                                //\/.*
                                                type: 'string',
                                                pattern: '(?<![\\w])https:\\/\\/(?:dataverse|dataverse-dev|deposit|dataverse-test)\\.ada.edu.au\\/dataset\\.xhtml\\?persistentId=doi:.*\\/.*$(?![\\w])',
                                                message: 'Please enter a valid doi url.'
                                            }
                                        ]}
                                    >
                                        <Input
                                            placeholder="E.g. https://dataverse-dev.ada.edu.au/dataset.xhtml?persistentId=doi:10.5072/FK2/XS0BPD"
                                            disabled={this.state.serverExisting}
                                            onChange={this.doiOnChange}
                                        />

                                    </Form.Item>
                                    {
                                        this.state.server?
                                            <div style={{marginLeft:'21%', marginBottom:'1vh'}}><Tag color="default" style={{width: '3vw',textAlign:'center'}}>Server: </Tag>
                                                <span>{this.state.server}</span>
                                                {this.state.doiMessage?<Tag style={{marginLeft:'1vw'}} color={this.state.doiMessage ==="Server not found."?"#f50":"#87d068"}>{this.state.doiMessage}</Tag>
                                                :null}
                                            </div>: null
                                    }
                                    {
                                        this.state.doi?
                                            <div style={{marginLeft:'21%', marginBottom:'5vh'}}>
                                                <Tag color="default" style={{width: '3vw',textAlign:'center'}}>DOI: </Tag>
                                                <span>{this.state.doi}</span><
                                                Tag style={{marginLeft:'1vw'}} color={systemStore.doiValid ?"#87d068":"#f50"}>{systemStore.doiValid?"Valid":systemStore.doiMessage}</Tag>
                                                <Spin spinning={systemStore.isDoiLoading} delay={20} indicator={doiLoadingIcon} />
                                            </div>: null
                                    }
                            </Col>
                        </Row>
                                    {/*<Form.Item*/}
                                    {/*    label="Or"*/}
                                    {/*    //name="uploadSwitch"*/}
                                    {/*>*/}
                                    {/*</Form.Item>*/}
                                    {/*<Form.Item*/}
                                    {/*    label="Server"*/}
                                    {/*    name="server"*/}
                                    {/*    rules={[*/}
                                    {/*        {*/}
                                    {/*            required: this.state.doiExisting ===false && this.state.serverExisting ===false ||this.state.selectedServer !==null,*/}
                                    {/*            message: "Please select a dataverse server.",*/}
                                    {/*        },*/}
                                    {/*    ]}*/}
                                    {/*>*/}
                                    {/*    <Select*/}
                                    {/*        placeholder="Select a server"*/}
                                    {/*        allowClear*/}
                                    {/*        disabled={this.state.doiExisting}*/}
                                    {/*        onChange={this.serverOnChange}*/}
                                    {/*    >*/}
                                    {/*        {*/}
                                    {/*            serverList && serverList.length>0?*/}
                                    {/*                serverList.map(server=>{*/}
                                    {/*                    return(*/}
                                    {/*                        <Select.Option key={server.id} value={server.alias}>{server.servername} ({server.url})</Select.Option>*/}
                                    {/*                    )*/}
                                    {/*                }):<Select.Option value={0}>Loading</Select.Option>*/}

                                    {/*        }*/}
                                    {/*        /!*<Select.Option value="self">Self Deposit (deposit.ada.edu.au)</Select.Option>*!/*/}
                                    {/*        /!*<Select.Option value="production">Production Deposit (dataverse.ada.edu.au)</Select.Option>*!/*/}
                                    {/*        /!*<Select.Option value="test">Test Deposit (dataverse-test.ada.edu.au)</Select.Option>*!/*/}
                                    {/*    </Select>*/}
                                    {/*</Form.Item>*/}
                                    {/*<Form.Item*/}
                                    {/*    label="Dataverse"*/}
                                    {/*    name="dataverse"*/}
                                    {/*    rules={[*/}
                                    {/*        {*/}
                                    {/*            required: this.state.selectedServer !==null,*/}
                                    {/*            message: "Please select a dataverse.",*/}
                                    {/*        },*/}
                                    {/*    ]}*/}

                                    {/*    // validateStatus={()=>{*/}
                                    {/*    //     if( this.state.selectedServer ===null){*/}
                                    {/*    //         return 'success'*/}
                                    {/*    //     }*/}
                                    {/*    // }}*/}
                                    {/*>*/}
                                    {/*    <Select*/}
                                    {/*        showSearch*/}
                                    {/*        allowClear*/}
                                    {/*        disabled={this.state.selectedServer ===null}*/}
                                    {/*        placeholder="Select a dataverse"*/}
                                    {/*        optionFilterProp="children"*/}
                                    {/*        onChange={this.dataverseOnChange}*/}
                                    {/*        // onFocus={this.dataverseOnFocus}*/}
                                    {/*        // onBlur={this.dataverseOnBlur}*/}
                                    {/*        // onSearch={this.dataverseOnSearch}*/}
                                    {/*        filterOption={(input, option) =>*/}
                                    {/*            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
                                    {/*        }*/}
                                    {/*    >*/}
                                    {/*        {*/}
                                    {/*            dataverses && this.state.selectedServer?*/}
                                    {/*                dataverses[this.state.selectedServer].dataverses.map(dataverse=>{*/}
                                    {/*                    return(*/}
                                    {/*                        <Select.Option key={dataverse.id} value={[dataverse.title, dataverse.id]}>{dataverse.title}</Select.Option>*/}
                                    {/*                    )*/}
                                    {/*                }):<Select.Option value={0}>Loading</Select.Option>*/}

                                    {/*        }*/}
                                    {/*    </Select>*/}
                                    {/*</Form.Item>*/}
                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>

                                    <div style={{textAlign: 'center', paddingTop:'3vh', paddingBottom:'2vh'}}>
                                        <span>File List: </span>
                                        <Divider />

                                    </div>
                                    <Row style={{ marginBottom:'2vh' }}>
                                        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 20, offset: 2 }}>
                                            <Table
                                                columns={columns}
                                                dataSource={datasource}
                                                rowKey="id"
                                            />
                                        </Col>
                                    </Row>
                            </Col>
                        </Row>
                        <Row style={{marginTop:'2vh', marginBottom:'5vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>

                            <div style={{textAlign: 'center', paddingTop:'2vh', paddingBottom:'3vh'}}>
                                <span>ADAID: </span>
                                <Divider />
                            </div>
                                    <Form.Item
                                        label="Select"
                                        name="adaIDSelect"
                                        rules={[
                                            {
                                                required: !this.state.selectedADAFolder && this.state.newADAID ===false,
                                                message: "Please select a ADA folder.",
                                            },
                                        ]}
                                    >
                                        <Select
                                            // mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder="select a ADA folder"
                                            allowClear
                                            disabled={this.state.newADAID}
                                            //defaultValue={['china']}
                                            onChange={this.handleADAFolderChange}
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
                                    </Form.Item>
                                    <Form.Item
                                        label="Or"
                                        //name="uploadSwitch"
                                    >
                                    </Form.Item>
                                    <Form.Item
                                        label="Create New"
                                        name="newADAID"
                                        valuePropName="checked"
                                        rules={[
                                            {
                                                required: !this.state.selectedADAFolder && this.state.newADAID ===false
                                            },
                                        ]}
                                    >
                                        <Switch
                                            // defaultChecked={true}
                                            //checked={this.state.fileUploadSwitch}
                                            disabled={ this.state.selectedADAFolder?true: false}
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                            onChange={this.handleNewADA}/>
                                    </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{marginBottom:'5vh'}}>
                            <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>
                                <div style={{textAlign: 'center', paddingBottom:'3vh'}}>
                                    <Button type="primary" htmlType="submit" disabled={!systemStore.doiValid} loading={isLoading}>
                                        Submit
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                    </Form>
                    {
                        systemStore.showfinalResultDVFiles?(
                            <div>
                                <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                                    <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>
                                        <FinalResult clearResult={this.clearResult} />
                                    </Col>
                                </Row>
                            </div>
                        ):null
                    }

                </div>
                <APIInput getFileList={this.getFileList}/>

            </div>

        )
    }
}