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
    Popover,
    Upload,
    Transfer,
    TreeSelect,
    Radio,
    Checkbox
} from 'antd';
import { inject, observer } from 'mobx-react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import APIInput from "./apiInput";
import { toJS } from 'mobx'
import axios from 'axios'
import { MinusCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import DynamicField from "./dynamicFields";
import FinalResult from "./finalResult";
//import { HashLink as Link } from 'react-router-hash-link';
const { TextArea } = Input;
// const { Link } = Anchor;
const { Dragger } = Upload;
const { Option } = Select;
const { Link } = Anchor;
const doiLoadingIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

const columns = [
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    // },
    {
        title: 'File Name',
        dataIndex: 'filename',
    },
    // {
    //     title: 'Size',
    //     dataIndex: 'filesize',
    // },
    //
    // {
    //     title: 'MD5',
    //     dataIndex: 'md5',
    // }
];

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class Test extends Component{
    state={
        createDataset: false,
        doiExisting: false,
        destinationDOIExisting: false,
        serverExisting: false,
        modalOpen: false,
        selectedServer: null,
        selectedDataverse: null,
        selectedADAFolder: null,
        newADAID: false,
        doi: null,
        destinationDOI: null,
        server: null,
        destinationServer: null,
        doiMessage: null,
        destinationDOIMessage: null,
        isLoading: false,
        fileList:[],
        localTargetKeys:[],
        remoteTargetKeys:[],
        switchLocal: false,
        switchRemote: false

        //copyRange: null
    }
    componentDidMount() {
        this.props.systemStore.handleFinalResultClose()
        this.props.systemStore.handleFinalResultDVFilesClose()
        this.props.systemStore.handlePermission(true)
        this.props.systemStore.resetFileList()
        this.props.authStore.resetProdSubDVs()
        this.props.systemStore.resetDestinationURL()
        this.props.systemStore.resetUploadedFileList()
    }
    finalResult_CopyTool=React.createRef()
    copyToolFormRef = React.createRef();




    onFinish = values => {

        console.log('Received values of form: ', values);
        //this.createDatasetOnChange(false)
        this.submit(values)
    };

    submit=(form)=>{
        this.setState({isLoading: true})
        this.props.systemStore.handleFinalResultDVFilesClose()
        //console.log(form)
        const { dataverse, copyRange, destinationServer, destinationDSURL } = form
        const { doi, doiMessage, destinationDOI, destinationDOIMessage } = this.state
        //console.log(this.state)
        console.log(this.props.systemStore.selectedRowNames)
        const obj = {
            destinationDVID: dataverse,
            userid: toJS(this.props.authStore.currentUser).userID,
            destinationServer: destinationServer,
            originServer: doiMessage,
            originDOI: doi,
            copyRange: copyRange,
            remoteFiles: this.props.systemStore.selectedRowNames,
            destinationDOI: destinationDOI,
            destinationDOIServer: destinationDOIMessage,
            destinationDSURL: destinationDSURL

        }
        //console.log(obj)
        const json = JSON.stringify(obj);

        axios.post(API_URL.createProdDS, json, {headers: {'Content-Type': 'application/json'}})
            .then(res=>res.data)
            .then(data=>{
                this.props.systemStore.handleFinalResultOpen({datasetURL: data.datasetURL, metaData: data.metaData}, null, null, [], data.remoteFileList, 'dvFiles')
                //this.resetState()
                this.setState({
                    isLoading: false
                });
                this.finalResult_CopyTool.scrollIntoView({behavior:'smooth'})
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
                        console.log(err.response.data)
                        this.openNotificationWithIcon('error', 'files', `${err.response.data}, please try again.`)
                    }

                } else {
                    this.setState({
                        isLoading: false
                    });
                    this.openNotificationWithIcon('error', 'files', `${err}, please refresh the page and retry.`)
                }

            })
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
            // this.fileFormRef.current.setFieldsValue({
            //     dataverse: undefined,
            //     server: undefined
            // })


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
                            this.copyToolFormRef.current.setFieldsValue({
                                copyRange: 1
                            })
                            this.props.systemStore.setCopyRange(1)
                            const userid = toJS(this.props.authStore.currentUser).userID
                            let doi = value.split('doi:')[1]
                            if (doi.includes('&version=')){
                                doi = doi.split('&version=')[0]
                            }
                            this.setState({doi: doi})
                            this.props.systemStore.getFileListByDOI(doi, temp[0].alias, userid)
                            // .then(res=>{
                            //     if (res === false){
                            //         this.copyToolFormRef.current.setFieldsValue({
                            //             copyRange: undefined
                            //         })
                            //     }
                            // })
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
            //this.fileFormRef.current.resetFields()
        }
    }

    destinationDOIOnChange = e =>{
        const value = e.target.value
        if( value.length >0){

            this.setState({destinationDOIExisting:true})
            // this.fileFormRef.current.setFieldsValue({
            //     dataverse: undefined,
            //     server: undefined
            // })


            if (value.indexOf('https://')===0){
                let server = value.split('//')[1]
                if (server.indexOf('/')>0){
                    let ser = 'https://'+server.split('/')[0]+"/"
                    let servers = toJS(this.props.authStore.serverList)
                    console.log(servers)
                    let temp = servers.filter(serv=>serv.url ===ser)
                    console.log(temp)
                    if (temp.length ===1){
                        this.setState({destinationDOIMessage:temp[0].alias})
                        if (value.indexOf('doi:')>0){
                            const userid = toJS(this.props.authStore.currentUser).userID
                            let doi = value.split('doi:')[1]
                            if (doi.includes('&version=')){
                                doi = doi.split('&version=')[0]
                            }
                            this.setState({destinationDOI: doi})
                            this.props.systemStore.getFileListByDestinationDOI(doi, temp[0].alias, userid)
                            console.log(temp[0].alias, doi, 'EDIT_DS', true)
                            this.props.systemStore.checkDSPermission(temp[0].alias, doi, 'EDIT_DS', true)
                        }
                        // else {
                        //     console.log("AAAAAAAAAAAAAA")
                        //     this.props.systemStore.resetFileList()
                        // }
                    }
                    else {
                        this.setState({destinationDOIMessage:"Server not found."})

                    }
                    this.setState({destinationServer: ser})
                }
                else {
                    this.setState({destinationServer: server, destinationDOIMessage: null})
                }
            }
            else{
                this.setState({destinationServer: null, destinationDOI: null})
                //this.props.systemStore.resetFileList()
            }
        }
        else if(value.length ===0){
            //this.props.systemStore.resetFileList()
            this.setState({
                destinationDOIExisting:false,
                destinationDOI: null,
                destinationServer: null
            })
            //this.fileFormRef.current.resetFields()
        }
    }

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
    dataverseOnChange =(value, label) => {
        //console.log(`selected ${value}`);
        //console.log(`selected ${label}`);
        const dvID = value
        const dvName = label
        this.props.systemStore.checkDVPermission('production', dvID, dvName, 'ADD_DS', true)

    }
    copyRangeOnChange = e =>{
        console.log(e.target.value)

        if(e.target.value === 2){
            this.props.systemStore.resetCopyToolSelectedRowKeys()
        }
        else if(e.target.value === 3){
            this.props.systemStore.handlePermission(true)
            this.props.systemStore.regainCopyToolSelectedRowKeys()
        }
        else {
            this.props.systemStore.regainCopyToolSelectedRowKeys()
        }
        //this.setState({copyRange: e.target.value})
        this.props.systemStore.setCopyRange(e.target.value)
    }
    serverOnChange =(value) => {
        console.log(`selected ${value}`);
        this.copyToolFormRef.current.setFieldsValue({
            dataverse: undefined,
        })
        this.props.authStore.setCTServer(value)
        // this.setState({
        //     selectedServer: value
        // })

    }
    handleAnchorClick = (e, link) => {
        e.preventDefault();
        //console.log(link);
    };
    extraInfo = (content) => (
        <Popover placement="topLeft" content={content} arrowPointAtCenter>
            <InfoCircleOutlined
                onClick={event => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation();
                }}
            />
        </Popover>
    );

    plainOptions = ["1","2"]
    handleSwitchOnChange=(value, ele)=>{
        console.log(value, ele)
        if(ele ==='local'){
            this.setState({switchLocal: value})
        }
        else if(ele ==='remote'){
            this.setState({switchRemote: value})
        }

    }

    render() {
        const { authStore, systemStore, files, formReset } = this.props
        const { doi, doiMessage, isLoading, selectedRowKeys, selectedADAFolder, fileList, destinationDOIMessage, switchLocal, switchRemote } = this.state
        const copyRange = systemStore.copyRange
        const serverList = toJS(authStore.serverList)
        const datasource = systemStore.fileList
        const user = toJS(authStore.currentUser)
        const treeData = Object.keys(authStore.ctDVList).length>0 && authStore.ctSelectedServer?authStore.ctDVList[authStore.ctSelectedServer].dataverses: []
        const selectedServer = authStore.ctSelectedServer
        console.log(systemStore.checkGroupValue)
        //console.log(toJS(authStore.productionDVList))
        //console.log(toJS(treeData))
        //console.log([...systemStore.testSelectedKeys.values()].flat().map(ele=>ele.filename))

        console.log(toJS(systemStore.testSelectedKeys))
        const rowSelection = {
            selectedRowKeys: systemStore.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                //this.setState({ selectedRowKeys });
                systemStore.copyToolFileListOnChange(selectedRowKeys, selectedRows)
            },
            getCheckboxProps: record => ({
                disabled: copyRange === 2, // Column configuration not to be checked
                name: record.name,
            }),
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
                {
                    key: 'prefix1',
                    text: 'Select Prefix 1',
                    onSelect: (changableRowKeys) => {
                        systemStore.prefixFilter( 1)
                    },
                },
                {
                    key: 'prefix2',
                    text: 'Select Prefix 2',
                    onSelect: (changableRowKeys) => {
                        systemStore.prefixFilter(2)
                    },
                },
                {
                    key: 'prefix1&2',
                    text: 'Select Prefix 1&2',
                    onSelect: (changableRowKeys) => {
                        systemStore.prefixFilter(1,2)
                    },
                }
            ]
        };
        const rowSelectionLocal = {
            selectedRowKeys: [...systemStore.localSelectedKeys.values()].flat().map(ele=>ele.filename),
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            //     //this.setState({ selectedRowKeys });
            //     //systemStore.copyToolFileListOnChange(selectedRowKeys, selectedRows)
            //     systemStore.testAddRowKey(selectedRows)
            // },
            onSelect: (record, selected, selectedRows, nativeEvent) =>{
                console.log(record)
                systemStore.localAddRowKey(record, selected)
            },
            getCheckboxProps: record => ({
                disabled: copyRange === 2, // Column configuration not to be checked
                name: record.name,
            }),
            hideSelectAll: true,
        };
        const rowSelectionRemote = {
            selectedRowKeys: [...systemStore.remoteSelectedKeys.values()].flat().map(ele=>ele.filename),
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            //     //this.setState({ selectedRowKeys });
            //     //systemStore.copyToolFileListOnChange(selectedRowKeys, selectedRows)
            //     systemStore.testAddRowKey(selectedRows)
            // },
            onSelect: (record, selected, selectedRows, nativeEvent) =>{
                console.log(record)
                systemStore.remoteAddRowKey(record, selected)
            },
            getCheckboxProps: record => ({
                disabled: copyRange === 2, // Column configuration not to be checked
                name: record.name,
            }),
            hideSelectAll: true,
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
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const submitCheck = ()=>{
            //console.log("systemStore.doiValid", systemStore.doiValid, "systemStore.dataversePermissionValid", systemStore.dataversePermissionValid)
            //console.log("systemStore.destinationDOIValid", systemStore.destinationDOIValid, "systemStore.datasetPermissionValid", systemStore.datasetPermissionValid)
            if (copyRange !==3){
                if(systemStore.doiValid && systemStore.dataversePermissionValid)
                    return false
                else return true
            }
            else {
                if(systemStore.doiValid && systemStore.dataversePermissionValid && systemStore.destinationDOIValid && systemStore.datasetPermissionValid)
                    return false
                else return true
            }
        }

        return (
            <div style={{background: 'white', paddingTop:'2%', paddingBottom:'2vh'}} >
                <div style={{ margin: 'auto'}}>
                    {/*<a href="#API" className="anchor">#</a>*/}
                    <Form
                        id="dataverseFiles"
                        ref={this.copyToolFormRef}
                        onFinish={this.onFinish}
                        scrollToFirstError={true}
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16, offset:1 }}
                        layout="horizontal"
                        initialValues={{ server: undefined, dataverse: undefined, doi: undefined, subject: undefined, copyRange: 1}}
                        size={"middle"}
                    >
                        <Row>
                            <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>

                            </Col>
                        </Row>
                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            {/*border:'1px solid #BFBFBF'*/}
                            <Col xs={{ span: 1, offset: 0 }} sm={{ span: 1, offset: 1 }} md={{ span: 1, offset: 1 }} lg={{ span: 2, offset: 1 }} xl={{ span: 3, offset: 1 }} xxl={{ span: 3, offset: 1 }}>
                                <Anchor
                                    onClick={this.handleAnchorClick}
                                    offsetTop={150}
                                >
                                    <Link href="#sourceDS" title="Source Dataset"/>
                                    <Link href="#copyRange" title="Copy Range"/>
                                    <Link href="#fileList" title="File List"/>
                                    <Link href="#destinationDV" title={copyRange !== 3?"Destination Dataverse": "Existing Destination Dataset"}/>
                                    {
                                        systemStore.showfinalResultDVFiles?
                                            <Link href="#finalResult" title="Final Result"/>: null
                                    }
                                    {/*<Link href="#components-anchor-demo-basic" title="Basic demo" />*/}
                                </Anchor>
                            </Col>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 0 }} sm={{ span: 20, offset: 0 }} md={{ span: 18, offset: 1 }} lg={{ span: 16, offset: 1 }} xl={{ span: 14, offset: 1 }} xxl={{ span: 14, offset: 1 }}>
                                <div id="sourceDS" style={{textAlign: 'center', paddingTop:'2vh'}}>
                                    <span>Source Dataset: </span>
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
                                        <div style={{marginLeft:'30%', marginBottom:'1vh'}}><Tag color="default" style={{width: '3vw',textAlign:'center'}}>Server: </Tag>
                                            <span>{this.state.server}</span>
                                            {this.state.doiMessage?<Tag style={{marginLeft:'1vw'}} color={this.state.doiMessage ==="Server not found."?"#f50":"#87d068"}>{this.state.doiMessage}</Tag>
                                                :null}
                                        </div>: null
                                }
                                {
                                    this.state.doi?
                                        <div style={{marginLeft:'30%', marginBottom:'5vh'}}>
                                            <Tag color="default" style={{width: '3vw',textAlign:'center'}}>DOI: </Tag>
                                            <span>{this.state.doi}</span><
                                            Tag style={{marginLeft:'1vw'}} color={systemStore.doiValid ?"#87d068":"#f50"}>{systemStore.doiValid?"Valid":systemStore.doiMessage}</Tag>
                                            <Spin spinning={systemStore.isDoiLoading} delay={20} indicator={doiLoadingIcon} />
                                        </div>: null
                                }
                                <div id="copyRange">
                                    <Form.Item
                                        label="Copy Range"
                                        name="copyRange"
                                        //wrapperCol={{ span: 16, offset:4 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please select copy range.",
                                            },
                                        ]}
                                    >
                                        <Radio.Group
                                            onChange={this.copyRangeOnChange}
                                            disabled={!systemStore.doiValid}
                                        >
                                            <div style={radioStyle}>
                                                <Radio value={1}>
                                                    Metadata & Files {this.extraInfo("creates a new Dataset draft in destination Dataverse")}
                                                </Radio>

                                            </div>
                                            <div style={radioStyle}>
                                                <Radio value={2}>
                                                    Metadata Only {this.extraInfo("creates a new Dataset draft in destination Dataverse")}
                                                </Radio>

                                            </div>
                                            <div style={radioStyle}>
                                                <Radio value={3}>
                                                    Files Only {this.extraInfo("copies to an existing Destination Dataset")}
                                                </Radio>

                                            </div>
                                        </Radio.Group>
                                    </Form.Item>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                                <div id="fileList" style={{textAlign: 'center', paddingTop:'2vh'}}>
                                    <span>Files to copy: </span>
                                    <Divider />
                                </div>

                                <Table
                                    rowSelection={{
                                        type: 'checkbox',
                                        ...rowSelection,
                                    }}
                                    columns={columns}
                                    dataSource={datasource}
                                    rowKey={'filename'}
                                />

                            </Col>
                        </Row>

                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                                <div id="fileList" style={{textAlign: 'center', paddingTop:'2vh'}}>
                                    <span>Files to copy2: </span>
                                    <Divider />
                                </div>
                                <Row>
                                    <Col span={10} offset={1}>
                                        <div>
                                            <Row style={{paddingBottom:'2vh'}}>
                                                <Col>
                                                    <span style={{fontSize:'medium',fontWeight:'bold'}}>Upload files to Directory:</span>
                                                </Col>
                                                <Col>
                                                    <div style={{paddingLeft:'1vw'}}>
                                                        <Switch
                                                            checkedChildren="Yes"
                                                            unCheckedChildren="No"
                                                            defaultChecked={false}
                                                            onChange={value=>this.handleSwitchOnChange(value, 'local')}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div style={{border:'1px solid #444', borderRadius:'8px', marginBottom: '3vh'}}>
                                                <div style={{display: "flex", justifyContent: "center", paddingBottom:'3vh', paddingTop:'2vh'}}>
                                                    {/*<Checkbox.Group options={systemStore.testCheck} onChange={value=>systemStore.CheckGroupOnChange(value)} />*/}
                                                    {
                                                        systemStore.testCheck.length>0?
                                                            systemStore.testCheck.map(option=>
                                                                <Checkbox
                                                                    indeterminate={systemStore.localCheckStatus.get(option).indeterminate}
                                                                    onChange={e=>systemStore.handleCheckOnchange(e.target.checked, option, 'local')}
                                                                    checked={systemStore.localCheckStatus.get(option).checked}
                                                                    key={option}
                                                                    disabled={!switchLocal}
                                                                >
                                                                    {option}
                                                                </Checkbox>
                                                            ): null
                                                    }
                                                </div>
                                                <Table
                                                    rowSelection={switchLocal?{
                                                        type: 'checkbox',
                                                        ...rowSelectionLocal,
                                                    }:null}
                                                    columns={columns}
                                                    dataSource={datasource}
                                                    rowKey={'filename'}
                                                    disabled={!switchLocal}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={10} offset={2}>
                                        <div>
                                            <Row  style={{paddingBottom:'2vh'}}>
                                                <Col>
                                                    <span style={{fontSize:'medium',fontWeight:'bold'}}>Upload files to Dataset:</span>
                                                </Col>
                                                <Col>
                                                    <div style={{paddingLeft:'1vw'}}>
                                                        <Switch
                                                            checkedChildren="Yes"
                                                            unCheckedChildren="No"
                                                            defaultChecked={false}
                                                            onChange={value=>this.handleSwitchOnChange(value, 'remote')}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <div style={{border:'1px solid #444', borderRadius:'8px', marginBottom: '3vh'}}>
                                                <div style={{display: "flex", justifyContent: "center", paddingBottom:'3vh', paddingTop:'2vh'}}>
                                                    {/*<Checkbox.Group options={systemStore.testCheck} onChange={value=>systemStore.CheckGroupOnChange(value)} />*/}
                                                    {
                                                        systemStore.testCheck.length>0?
                                                            systemStore.testCheck.map(option=>
                                                                <Checkbox
                                                                    indeterminate={systemStore.remoteCheckStatus.get(option).indeterminate}
                                                                    onChange={e=>systemStore.handleCheckOnchange(e.target.checked, option, 'remote')}
                                                                    checked={systemStore.remoteCheckStatus.get(option).checked}
                                                                    key={option}
                                                                    disabled={!switchRemote}
                                                                >
                                                                    {option}
                                                                </Checkbox>
                                                            ): null
                                                    }
                                                </div>
                                                <Table
                                                    rowSelection={switchRemote?{
                                                        type: 'checkbox',
                                                        ...rowSelectionRemote,
                                                    }: null}
                                                    columns={columns}
                                                    dataSource={datasource}
                                                    rowKey={'filename'}
                                                    disabled={!switchRemote}
                                                />
                                            </div>
                                        </div>

                                    </Col>
                                </Row>


                            </Col>
                        </Row>

                        <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                                <div id="destinationDV" style={{textAlign: 'center', paddingTop:'3vh', paddingBottom:'2vh'}}>
                                    <span>{copyRange !==3?'Destination Dataverse:': 'Existing Destination Dataset:' }</span>
                                    <Divider />

                                </div>
                                {
                                    copyRange !==3?
                                        <>
                                            <Form.Item
                                                label="Server"
                                                name="destinationServer"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please select a dataverse server.",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Select a server"
                                                    //disabled={!this.state.createDataset}
                                                    onChange={this.serverOnChange}
                                                >
                                                    {
                                                        serverList && serverList.length>0?
                                                            serverList.map(server=>{
                                                                return(
                                                                    <Select.Option key={server.id} value={server.alias}>{server.servername} ({server.url})</Select.Option>
                                                                )
                                                            }):<Select.Option value={0}>Loading</Select.Option>

                                                    }
                                                    {/*<Select.Option value="self">Self Deposit (deposit.ada.edu.au)</Select.Option>*/}
                                                    {/*<Select.Option value="production">Production Deposit (dataverse.ada.edu.au)</Select.Option>*/}
                                                    {/*<Select.Option value="test">Test Deposit (dataverse-test.ada.edu.au)</Select.Option>*/}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                label="Dataverse"
                                                name="dataverse"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: "Please select a destination dataverse.",
                                                    },
                                                ]}

                                            >
                                                <TreeSelect
                                                    treeDataSimpleMode
                                                    showSearch
                                                    //allowClear
                                                    autoClearSearchValue='false'
                                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                    disabled={selectedServer ===null}
                                                    placeholder="Select a dataverse"
                                                    optionFilterProp="children"
                                                    onChange={this.dataverseOnChange}
                                                    loadData={this.onLoadData}
                                                    filterTreeNode={(value, node)=>node.title.toLowerCase().indexOf(value.toLowerCase())>=0}
                                                    // onFocus={this.dataverseOnFocus}
                                                    // onBlur={this.dataverseOnBlur}
                                                    // onSearch={this.dataverseOnSearch}
                                                    // filterOption={(input, option) =>
                                                    //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    // }
                                                    treeData={treeData}
                                                >
                                                </TreeSelect>
                                            </Form.Item>
                                        </>
                                        :
                                        <>
                                            <Form.Item
                                                label="Dataset URL"
                                                name="destinationDSURL"
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
                                                    //disabled={this.state.serverExisting}
                                                    onChange={this.destinationDOIOnChange}
                                                />

                                            </Form.Item>
                                            {
                                                this.state.destinationServer?
                                                    <div style={{marginLeft:'30%', marginBottom:'1vh'}}><Tag color="default" style={{width: '3vw',textAlign:'center'}}>Server: </Tag>
                                                        <span>{this.state.destinationServer}</span>
                                                        {this.state.destinationDOIMessage?<Tag style={{marginLeft:'1vw'}} color={this.state.doiMessage ==="Server not found."?"#f50":"#87d068"}>{this.state.destinationDOIMessage}</Tag>
                                                            :null}
                                                    </div>: null
                                            }
                                            {
                                                this.state.destinationDOI?
                                                    <div style={{marginLeft:'30%', marginBottom:'5vh'}}>
                                                        <Tag color="default" style={{width: '3vw',textAlign:'center'}}>DOI: </Tag>
                                                        <span>{this.state.destinationDOI}</span><
                                                        Tag style={{marginLeft:'1vw'}} color={systemStore.destinationDOIValid ?"#87d068":"#f50"}>{systemStore.destinationDOIValid?"Valid":systemStore.destinationDOIMessage}</Tag>
                                                        <Spin spinning={systemStore.isDestinationDoiLoading} delay={20} indicator={doiLoadingIcon} />
                                                    </div>: null
                                            }
                                        </>
                                }


                            </Col>
                        </Row>

                        {/*<Row style={{marginBottom:'5vh'}} >*/}
                        {/*    <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 12, offset: 6 }}>*/}
                        {/*        <div style={{textAlign: 'center', paddingBottom:'3vh'}}>*/}
                        {/*            <Button type="primary" htmlType="submit" disabled={submitCheck()} loading={isLoading}>*/}
                        {/*                COPY*/}
                        {/*            </Button>*/}
                        {/*        </div>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}

                    </Form>
                    <div id="finalResult" ref={ref => {this.finalResult_CopyTool = ref}}>
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