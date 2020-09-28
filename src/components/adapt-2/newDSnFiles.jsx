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
    Transfer, Popover
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
//import { HashLink as Link } from 'react-router-hash-link';
const { TextArea } = Input;
const { Link } = Anchor;
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

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer
export default class NewDSnFiles extends Component{
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
    fileFormRef = React.createRef();
    componentDidMount() {
        this.props.systemStore.handleFinalResultClose()
        this.props.systemStore.handleFinalResultDVFilesClose()
        this.props.systemStore.resetFileList()
        this.props.systemStore.resetUploadedFileList()
        this.props.adapt2Store.setFormRef(this.fileFormRef)
    }
    finalResult_Existing=React.createRef()


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
        //const { doi, doiMessage } = this.state
        const { doi, doiServer} = this.props.adapt2Store
        const userid = toJS(this.props.authStore.currentUser).userID
        try{
            let check = await this.props.systemStore.getFileListByDOI(doi, doiServer, userid)
            return check
        }catch(error){
            console.log(error)
            return false
        }
    }
    doiOnChange = e =>{
        let value = e.target.value
        if( value.length >0){
            this.props.adapt2Store.handleSourceURLInput(value)
            this.setState({doiExisting:true})
            // this.fileFormRef.current.setFieldsValue({
            //     dataverse: undefined,
            //     server: undefined
            // })

            value = value.split(" ").join('')
            if (value.indexOf('https://')===0){
                let server = value.split('//')[1]
                if (server.indexOf('/')>0){
                    let ser = 'https://'+server.split('/')[0]+"/"
                    let servers = toJS(this.props.authStore.serverList)
                    console.log(servers)
                    let temp = servers.filter(serv=>serv.url ===ser)
                    console.log(temp)
                    if (temp.length ===1){
                        //this.setState({server: ser})
                        this.props.adapt2Store.setSourceServer(ser)
                        //this.setState({doiMessage:temp[0].alias})
                        this.props.adapt2Store.setDoiServer(temp[0].alias)
                        if (value.indexOf('doi')>0){
                            console.log("new list.......")
                            if(this.props.adapt2Store.selection ===2){
                                this.props.adapt2Store.updateCopyMetadata(false)
                            }
                            //this.props.systemStore.resetFileList()
                            const userid = toJS(this.props.authStore.currentUser).userID
                            const newURL = value.split("%3A").join(":").split("%2F").join("/").split(" ").join('')
                            let doi = newURL.split('doi:')[1]
                            //this.setState({doi: doi})
                            this.props.adapt2Store.setDoi(doi)
                            this.props.systemStore.getFileListByDOI(doi, temp[0].alias, userid)
                        }
                        else {
                            console.log("AAAAAAAAAAAAAA")
                            //this.props.systemStore.resetFileList()
                            this.props.systemStore.sortFileList([])
                        }
                    }
                    else {
                        //this.setState({doiMessage:"Server not found."})
                        //this.setState({server: ser})
                        this.props.adapt2Store.setSourceServer(ser)
                        this.props.adapt2Store.setDoiServer("Server not found.")
                    }
                    //this.setState({server: ser})
                }
                else {
                    //this.setState({server: server})
                    this.props.adapt2Store.setSourceServer(server)
                    this.props.adapt2Store.setDoiServer(null)
                }
            }
            else{
                //this.setState({server: null})
                this.props.adapt2Store.setSourceServer(null)
                this.props.adapt2Store.setDoi(null)
                console.log("BBBBBBBBBBB")
                //this.props.systemStore.resetFileList()
                this.props.systemStore.sortFileList([])
            }
        }
        else if(value.length ===0){
            console.log("CCCCCCCCCCCCCC")
            //this.props.systemStore.resetFileList()
            this.props.systemStore.sortFileList([])
            this.setState({
                doiExisting:false,
                // doi: null,
                //server: null
            })
            if(this.props.adapt2Store.selection ===2){
                this.props.adapt2Store.updateCopyMetadata(false)
            }
            this.props.adapt2Store.setSourceServer(null)
            this.props.adapt2Store.setDoi(null)
            this.props.adapt2Store.setDoiServer(null)
            //this.props.systemStore.resetDVForm()
            //this.fileFormRef.current.resetFields()
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
    handleAnchorClick = (e, link) => {
        e.preventDefault();
        console.log(link);
    };
    openNotification = () => {
        notification.warning({
            message: 'Duplicate Files Found',
            description:
                (<div>
                    <span>Following are the duplicates found on the ADA directory {this.state.selectedADAFolder}.</span>
                    <ol>
                        {
                            this.props.systemStore.duplicateFileList.map(file=>{
                                return <li>{file}</li>
                            })
                        }
                    </ol>
                </div>),
            key: 'duplicates',
            duration: 0,
        });
    };

    render() {
        const { authStore, systemStore, files, formReset, adapt2Store } = this.props
        const { server, doiMessage, isLoading, selectedRowKeys, selectedADAFolder, localTargetKeys, remoteTargetKeys } = this.state
        const { userUploadedFiles } = systemStore
        const { doiServer, doi, sourceServer } = adapt2Store
        const datasource = toJS(systemStore.fileList)
        const user = toJS(authStore.currentUser)
        //console.log(server)
        if(systemStore.duplicateFileList.length>0){this.openNotification()}
        else{
            notification.close('duplicates')
        }
        console.log(systemStore.existingShellDS)
        console.log(systemStore.duplicateFileList)
        console.log(systemStore.adaFolderFileList)
        //console.log(toJS(systemStore.lastFileList))
        //console.log(toJS(systemStore.localTargetKeys))
        //console.log(toJS(systemStore.remoteTargetKeys))
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
                //let localfileListIncludes = fileList.includes(file.name)
                let localfileListIncludes = userUploadedFiles.includes(file.name)
                let remoteFileListIncludes = datasource.filter(ele=>ele.filename === file.name).length >0?true:false
                if (localfileListIncludes || remoteFileListIncludes){
                    this.openNotificationWithIcon('error', 'files', `Duplicate file detected.`)
                }
                else {
                    this.setState(state => ({
                        fileList: [...state.fileList, file],
                    }));
                    const tempFile = {id: file.uid, filename:file.name, type:'local'}
                    this.props.systemStore.addFileToFileList(tempFile, file)
                }
                return false;
            },
            //fileList,
            userUploadedFiles,
        };
        const submitCheck = ()=>{
            if(systemStore.localTargetKeys.length ===0 && systemStore.remoteTargetKeys.length ===0){

                return true
            }
            else if(systemStore.adaFolderInfoErrorMsg && systemStore.localTargetKeys.length ===0){
                return true
            }
            else return false

        }

        return (
                <div id="fileSource">
                    {/*<a href="#API" className="anchor">#</a>*/}
                    <Form
                        id="dataverseFiles"
                        ref={this.fileFormRef}
                        scrollToFirstError={true}
                        //onFinish={this.onFinish}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16, offset:1 }}
                        layout="horizontal"
                        initialValues={{ server: undefined, dataverse: undefined, doi: undefined, subject: undefined}}
                        size={"middle"}
                    >
                        {
                            adapt2Store.inputSource ===1?
                                <>
                                    <Form.Item
                                        label="Dataset URL"
                                        name="doi"
                                        hasFeedback
                                        rules={[
                                            {
                                                required: systemStore.localTargetKeys.length >0 || systemStore.remoteTargetKeys.length >0?systemStore.doiValid?false:false:true,
                                                //required: localTargetKeys.length && remoteTargetKeys.length ===0?this.state.doiExisting ===false && this.state.serverExisting ===false ||this.state.doiExisting? true: false: false,
                                                message: "Please enter DOI.",
                                            },
                                            {
                                                //\/.*
                                                type: 'string',
                                                pattern: '(?<![\\w])https:\\/\\/(?:dataverse|dataverse-dev|deposit|dataverse-test)\\.ada.edu.au\\/dataset\\.xhtml\\?persistentId=doi.*\\.*$(?![\\w])',
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
                                        // this.state.server?
                                        sourceServer?
                                            <div style={{marginLeft:'15vw', marginBottom:'1vh'}}><Tag color="default" style={{width: '3vw',textAlign:'center'}}>Server: </Tag>
                                                <span>{sourceServer}</span>
                                                {doiServer?<Tag style={{marginLeft:'1vw'}} color={doiServer ==="Server not found."?"#f50":"#87d068"}>{doiServer}</Tag>
                                                    :null}
                                            </div>: null
                                    }

                                    {
                                        doi?
                                        <div style={{marginLeft:'15vw', marginBottom:'2vh'}}>
                                        <Tag color="default" style={{width: '3vw',textAlign:'center'}}>DOI: </Tag>
                                        <span>{doi}</span>
                                        <Tag style={{marginLeft:'1vw'}} color={systemStore.doiValid ?"#87d068":"#f50"}>{systemStore.doiValid?"Valid":systemStore.doiMessage}</Tag>
                                        <Spin spinning={systemStore.isDoiLoading} delay={20} indicator={doiLoadingIcon} />
                                        </div>: null
                                    }
                                    {
                                        adapt2Store.selection ===2?
                                            <Form.Item
                                                label="Copy Metadata ?"
                                                name="metadata"
                                                hasFeedback
                                                rules={[
                                                    {
                                                        required: true,
                                                        //required: localTargetKeys.length && remoteTargetKeys.length ===0?this.state.doiExisting ===false && this.state.serverExisting ===false ||this.state.doiExisting? true: false: false,
                                                        //message: "Please enter DOI.",
                                                    },

                                                ]}
                                            >
                                                <div>
                                                    <Switch
                                                        checked={adapt2Store.copyMetadata}
                                                        checkedChildren="Yes"
                                                        unCheckedChildren="No"
                                                        defaultChecked={false}
                                                        onChange={e=>adapt2Store.updateCopyMetadata(e)}
                                                        disabled={!systemStore.doiValid}
                                                    />
                                                </div>
                                            </Form.Item>: null
                                    }
                                </>: null
                        }
                        {
                            adapt2Store.inputSource ===2?
                                <div style={{width:'83%', margin: 'auto'}}>
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
                                : null
                        }



                    </Form>
                    <APIInput getFileList={this.getFileList}/>
                </div>


        )
    }
}