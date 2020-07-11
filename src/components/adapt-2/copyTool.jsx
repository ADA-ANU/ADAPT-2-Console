import React, {Component, useState} from 'react';
import {
    Form,
    Input,
    Select,
    Switch,
    Button,
    Table,
    Spin,
    Row,
    Col,
    Divider,
    Tag,
    notification,
    Anchor,
    List,
    Skeleton,
    Upload,
    Transfer,
    TreeSelect
} from 'antd';
import { inject, observer } from 'mobx-react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import APIInput from "./apiInput";
import { toJS } from 'mobx'
import axios from 'axios'
import { MinusCircleOutlined, InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import DynamicField from "./dynamicFields";
import FinalResult from "./finalResult";
import { HashLink as Link } from 'react-router-hash-link';
const { TextArea } = Input;
// const { Link } = Anchor;
const { Dragger } = Upload;
const { Option } = Select;
const doiLoadingIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'File Name',
        dataIndex: 'filename',
    },
    {
        title: 'Size',
        dataIndex: 'filesize',
    },

    {
        title: 'MD5',
        dataIndex: 'md5',
    }
];

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class CopyTool extends Component{
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
        fileList:[],
        selectedRowKeys:[],
        localTargetKeys:[],
        remoteTargetKeys:[]
    }
    componentDidMount() {
        this.props.systemStore.handleFinalResultClose()
        this.props.systemStore.handleFinalResultDVFilesClose()
        this.props.systemStore.resetFileList()
        this.props.authStore.resetProdSubDVs()
    }
    finalResult_Existing=React.createRef()
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
        this.setState({isLoading: true})
        this.props.systemStore.handleFinalResultDVFilesClose()
        console.log(form)
        const { doi, adaIDSelect, newADAID } = form
        const { doiMessage} = this.state
        console.log(this.props.systemStore.localTargetKeys)
        let localTargetKeys = this.props.systemStore.localTargetKeys
        console.log(this.props.systemStore.remoteTargetKeys)
        let remoteTargetKeys = this.props.systemStore.remoteTargetKeys

        let adaid = adaIDSelect
        console.log(adaid)
        if (newADAID){
            let obj = {
                doi: null,
                newDataset: false,
                title: null,
                author: null,
                email: null,
                description: null,
                subject: null,
                server: null,
                dataverse: null,
                uploadSwitch: false,
                userid: toJS(this.props.authStore.currentUser).userID,

            }
            const json = JSON.stringify(obj);
            let d = await axios.post(API_URL.AdaID, json, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )

            adaid = d.data.msg.adaid
        }

        const formData = new FormData();
        formData.set('adaid', adaid)
        formData.set('userid', toJS(this.props.authStore.currentUser).userID)
        formData.set('newADAID', newADAID)
        formData.set('server', doiMessage)
        formData.set('doi', doi)
        formData.set('localFileList', JSON.stringify(localTargetKeys))
        formData.set('remoteFileList', JSON.stringify(remoteTargetKeys))

        this.state.fileList.forEach(file => {
            if( localTargetKeys.includes(file.name) || remoteTargetKeys.includes(file.name) ){
                formData.append('file', file);
            }
        });
        axios({
            url:API_URL.uploadFilesFromExsitingPage,
            method: 'post',
            data: formData,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
        }).then(res=>res.data)
            .then(data=>{
                this.props.systemStore.handleFinalResultOpen({datasetURL: data.datasetURL}, data.adaid, doi, data.localFiles, data.remoteFiles, 'dvFiles')
                //this.resetState()
                this.setState({
                    isLoading: false
                });
                this.finalResult_Existing.scrollIntoView({behavior:'smooth'})
            })
            .catch(err=>{
                console.log(err)
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
        // const { doi, server, dataverse, adaIDSelect, newADAID } = form
        // if (dataverse ===undefined){
        //     form.server = this.state.doiMessage
        // }
        // form.userid = toJS(this.props.authStore.currentUser).userID
        // console.log(form)
        // //let data = JSON.stringify(form)
        // // console.log(await this.getFileList())
        // // if (await this.getFileList()) {
        //     this.setState({isLoading: true})
        //     axios.post(API_URL.Download_Dataset_Files, form)
        //         .then(res => {
        //             if (res.status === 201) {
        //                 const data = res.data
        //                 this.props.systemStore.handleFinalResultOpen({datasetURL: data.datasetURL}, data.adaid, doi, data.files, 'dvFiles')
        //                 this.resetState()
        //                 this.fileFormRef.current.resetFields()
        //             }
        //         })
        //         .catch(err => {
        //             if (err.response) {
        //                 this.setState({
        //                     isLoading: false
        //                 });
        //                 if (err.response.status === 403) {
        //                     const servers = toJS(this.props.authStore.serverList)
        //                     for (let serv of servers) {
        //                         if (serv.alias === form.server) {
        //                             this.props.systemStore.handleFailedAPI(serv.id, 2, err.response.data)
        //                             this.props.systemStore.handleAPIInputModal(true)
        //                         }
        //                     }
        //
        //                 } else if (err.response.status === 405) {
        //                     const servers = toJS(this.props.authStore.serverList)
        //                     for (let serv of servers) {
        //                         if (serv.alias === form.server) {
        //                             this.props.systemStore.handleFailedAPI(serv.id, 1, err.response.data)
        //                             this.props.systemStore.handleAPIInputModal(true)
        //                         }
        //                     }
        //                 } else {
        //                     //console.log(err)
        //                     this.openNotificationWithIcon('error', 'files', `${err.response.data}, please try again.`)
        //                 }
        //
        //             } else {
        //                 this.setState({
        //                     isLoading: false
        //                 });
        //                 this.openNotificationWithIcon('error', 'files', `${err}, please refresh the page and retry.`)
        //             }
        //         })
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
                message: 'Submission Failed',
                description:
                    `${error}`,
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
            console.log("clearAdaFolderInfo")
            this.props.systemStore.clearAdaFolderInfoErrorMsg()
            //this.fileFormRef.current.resetFields()
        }
        else {
            // this.fileFormRef.current.setFieldsValue({
            //     dataverse: undefined,
            //     doi: undefined
            // })
            this.props.systemStore.clearAdaFolderInfoErrorMsg()
            this.setState({
                selectedADAFolder: value,
            })
            let userid = toJS(this.props.authStore.currentUser).userID
            this.props.systemStore.getDatasetInfoByADAID(value, userid)
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
    // onSelectChange = selectedRowKeys => {
    //     console.log('selectedRowKeys changed: ', selectedRowKeys);
    //     this.setState({ selectedRowKeys });
    // };
    handleLocalTransferChange = targetKeys => {

        this.setState({ localTargetKeys: targetKeys });
    };
    handleRemoteTransferChange = targetKeys => {

        this.setState({ remoteTargetKeys: targetKeys });
    };
    onLoadData = treeNode =>{
        const { id } = treeNode.props;
        return new Promise((resolve, reject)=>{
             this.props.authStore.getSubDataverses(id)
                .then(res=>resolve())
                .catch(err=>{
                    console.log(err)
                })
        })

    }

    render() {
        const { authStore, systemStore, files, formReset } = this.props
        const { doi, doiMessage, isLoading, selectedRowKeys, selectedADAFolder, fileList, localTargetKeys, remoteTargetKeys } = this.state
        const serverList = toJS(authStore.serverList)
        const datasource = systemStore.fileList
        const user = toJS(authStore.currentUser)
        const treeData = authStore.productionDVList
        const adaFolderList = authStore.adaFolderList
        console.log(fileList)
        console.log(toJS(authStore.productionDVList))
        console.log(treeData)
        console.log(toJS(datasource))
        console.log(toJS(systemStore.lastFileList))
        //console.log(datasource)
        const rowSelection = {
            // selectedRowKeys: datasource.map(ele=>ele.id),
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({ selectedRowKeys });
            },
        };
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
                systemStore.deleteFileFromFileList(file.uid, file.name)
                let localKeys = localTargetKeys.filter(ele=>ele !== file.name)
                let remoteKeys = remoteTargetKeys.filter(ele=>ele !== file.name)
                this.setState({localTargetKeys: localKeys, remoteTargetKeys: remoteKeys})
            },
            multiple: true,
            listType: 'picture',
            beforeUpload: file => {
                let localfileListIncludes = fileList.includes(file.name)
                let remoteFileListIncludes = datasource.filter(ele=>ele.filename === file.name).length >0?true:false
                if (localfileListIncludes || remoteFileListIncludes){
                    this.openNotificationWithIcon('error', 'files', `Duplicate file detected.`)
                }
                else {
                    this.setState(state => ({
                        fileList: [...state.fileList, file],
                    }));
                    const tempFile = {id: file.uid, filename:file.name, type:'local'}
                    this.props.systemStore.addFileToFileList(tempFile)

                }
                return false;
            },
            fileList,
        };

        return (
            <div style={{background: 'white', paddingTop:'2%', paddingBottom:'2vh'}} >
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
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
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
                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                                <div style={{textAlign: 'center', paddingTop:'3vh', paddingBottom:'2vh'}}>
                                    <span>File List: </span>
                                    <Divider />

                                </div>
                                <Row style={{ marginBottom:'2vh' }}>
                                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 20, offset: 2 }}>
                                        <div style={{textAlign:'center'}}>
                                            <Transfer
                                                dataSource={datasource}
                                                showSearch
                                                listStyle={{
                                                    width: 350,
                                                    height: 400,
                                                    textAlign:'left'
                                                }}
                                                operations={['Add to ADA Directory', 'Revert']}
                                                targetKeys={systemStore.localTargetKeys}
                                                //this.state.localTargetKeys
                                                onChange={(ele)=>systemStore.setLocalKeys(ele)}
                                                //this.handleLocalTransferChange
                                                render={item => `${item.filename}`}
                                                rowKey={record => record.filename}
                                                //footer={this.renderFooter}
                                            />
                                        </div>

                                        {/*<Table*/}
                                        {/*    rowSelection={rowSelection}*/}
                                        {/*    columns={columns}*/}
                                        {/*    dataSource={datasource}*/}
                                        {/*    rowKey="id"*/}
                                        {/*/>*/}
                                    </Col>
                                </Row>
                                <Row style={{ marginBottom:'5vh', marginTop:'5vh' }}>
                                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 20, offset: 2 }}>
                                        <div style={{textAlign:'center'}}>
                                            <Transfer
                                                dataSource={datasource}
                                                showSearch
                                                listStyle={{
                                                    width: 350,
                                                    height: 400,
                                                    textAlign:'left'
                                                }}
                                                operations={['Add to Dataset', 'Revert']}
                                                targetKeys={systemStore.remoteTargetKeys}
                                                //this.state.remoteTargetKeys
                                                onChange={(ele)=>systemStore.setRemoteKeys(ele)}
                                                //this.handleRemoteTransferChange
                                                render={item => `${item.filename}`}
                                                rowKey={record => record.filename}
                                                disabled={this.state.newADAID || systemStore.adaFolderInfoErrorMsg?true:false}
                                                //footer={this.renderFooter}
                                            />
                                        </div>

                                        {/*<Table*/}
                                        {/*    rowSelection={rowSelection}*/}
                                        {/*    columns={columns}*/}
                                        {/*    dataSource={datasource}*/}
                                        {/*    rowKey="id"*/}
                                        {/*/>*/}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                                <div style={{textAlign: 'center', paddingTop:'3vh', paddingBottom:'0vh'}}>
                                    <span>Upload Files: </span>
                                    <Divider />

                                </div>
                                <Row style={{ marginBottom:'2vh' }}>
                                    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 20, offset: 2 }}>
                                        <div>
                                            <Dragger {...props}>
                                                <p className="ant-upload-drag-icon">
                                                    <InboxOutlined />
                                                </p>
                                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                <p className="ant-upload-hint">
                                                    Both single and multiple file upload are supported.
                                                </p>
                                            </Dragger>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                                <div style={{textAlign: 'center', paddingTop:'3vh', paddingBottom:'2vh'}}>
                                    <span>Production Dataverse: </span>
                                    <Divider />

                                </div>
                                <Form.Item
                                    label="Dataverse"
                                    name="dataverse"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please select a dataverse.",
                                        },
                                    ]}

                                    // validateStatus={()=>{
                                    //     if( this.state.selectedServer ===null){
                                    //         return 'success'
                                    //     }
                                    // }}
                                >
                                    <TreeSelect
                                        treeDataSimpleMode
                                        showSearch
                                        allowClear
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        //disabled={this.state.selectedServer ===null}
                                        placeholder="Select a dataverse"
                                        optionFilterProp="children"
                                        onChange={this.dataverseOnChange}
                                        loadData={this.onLoadData}
                                        // onFocus={this.dataverseOnFocus}
                                        // onBlur={this.dataverseOnBlur}
                                        // onSearch={this.dataverseOnSearch}
                                        // filterOption={(input, option) =>
                                        //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        // }
                                        treeData={treeData}
                                    >
                                        {/*{*/}
                                        {/*    dataverses.dataverses && dataverses.dataverses.length>0?*/}
                                        {/*        dataverses.dataverses.map(dataverse=>{*/}
                                        {/*            return(*/}
                                        {/*                <Select.Option key={dataverse.id} value={[dataverse.title, dataverse.id]}>{dataverse.title}</Select.Option>*/}
                                        {/*            )*/}
                                        {/*        }):<Select.Option value={0}>Loading</Select.Option>*/}

                                        {/*}*/}
                                    </TreeSelect>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row style={{marginBottom:'5vh'}} >
                            <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>
                                <div style={{textAlign: 'center', paddingBottom:'3vh'}}>
                                    <Button type="primary" htmlType="submit" disabled={!systemStore.doiValid} loading={isLoading}>
                                        Submit
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                    </Form>
                    <div ref={ref => {this.finalResult_Existing = ref}}>
                        {
                            systemStore.showfinalResultDVFiles?(

                                <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                                    <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>
                                        <FinalResult clearResult={this.clearResult} />
                                    </Col>
                                </Row>

                            ):null
                        }
                    </div>
                </div>
                <APIInput getFileList={this.getFileList}/>

            </div>

        )
    }
}