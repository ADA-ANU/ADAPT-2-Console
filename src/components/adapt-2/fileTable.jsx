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
import {adapt2Store} from "../../stores/adapt2Store";
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

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer
export default class FileTable extends Component{
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

    handleSwitchOnChange=(value, ele)=>{
        console.log(value, ele)
        this.props.adapt2Store.handleFileSwitch(value, ele)
        // if(ele ==='local'){
        //     this.setState({switchLocal: value})
        // }
        // else if(ele ==='remote'){
        //     this.setState({switchRemote: value})
        // }
        if(!value){
            this.props.systemStore.switchOff(ele)
        }
    }

    render() {
        const { authStore, systemStore, files, formReset, adapt2Store } = this.props
        const { doi, doiMessage, isLoading, selectedRowKeys, selectedADAFolder, fileList, destinationDOIMessage, switchLocal, switchRemote } = this.state
        const { localSwitch, remoteSwitch } = adapt2Store
        const copyRange = systemStore.copyRange
        const serverList = toJS(authStore.serverList)
        const datasource = systemStore.fileList
        const user = toJS(authStore.currentUser)
        const treeData = Object.keys(authStore.ctDVList).length>0 && authStore.ctSelectedServer?authStore.ctDVList[authStore.ctSelectedServer].dataverses: []
        const selectedServer = authStore.ctSelectedServer
        console.log(systemStore.checkGroupValue)
        //console.log(toJS(authStore.productionDVList))
        //console.log(toJS(treeData))
        //console.log(toJS(systemStore.sortedFileList))
        console.log(toJS(systemStore.localCheckStatus))
        console.log(systemStore.testCheck)
        console.log([...systemStore.localSelectedKeys.values()].flat().map(ele=>ele.filename))
        console.log([...systemStore.remoteSelectedKeys.values()].flat().map(ele=>ele.filename))
        // const rowSelection = {
        //     selectedRowKeys: systemStore.selectedRowKeys,
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //         //this.setState({ selectedRowKeys });
        //         systemStore.copyToolFileListOnChange(selectedRowKeys, selectedRows)
        //     },
        //     getCheckboxProps: record => ({
        //         disabled: copyRange === 2, // Column configuration not to be checked
        //         name: record.name,
        //     }),
        //     selections: [
        //         Table.SELECTION_ALL,
        //         Table.SELECTION_INVERT,
        //         {
        //             key: 'prefix1',
        //             text: 'Select Prefix 1',
        //             onSelect: (changableRowKeys) => {
        //                 systemStore.prefixFilter( 1)
        //             },
        //         },
        //         {
        //             key: 'prefix2',
        //             text: 'Select Prefix 2',
        //             onSelect: (changableRowKeys) => {
        //                 systemStore.prefixFilter(2)
        //             },
        //         },
        //         {
        //             key: 'prefix1&2',
        //             text: 'Select Prefix 1&2',
        //             onSelect: (changableRowKeys) => {
        //                 systemStore.prefixFilter(1,2)
        //             },
        //         }
        //     ]
        // };
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
        const switchCheck=()=>{
            if(adapt2Store.selection ===2){
                if(!adapt2Store.createDataset) return true
                else return false
            }
            else if(adapt2Store.selection ===3){
                if(!adapt2Store.createDataset && !systemStore.existingShellDS) return true
                else return false
            }
        }

        return (
            <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                <Col span={10} offset={1}>
                    <div>
                        <Row style={{paddingBottom:'2vh'}}>
                            <Col>
                                <span style={{fontSize:'medium',fontWeight:'bold'}}>Upload to Directory (Preservation):</span>
                            </Col>
                            <Col>
                                <div style={{paddingLeft:'1vw'}}>
                                    <Switch
                                        checked={adapt2Store.localSwitch}
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
                                                disabled={!localSwitch}
                                            >
                                                {option}
                                            </Checkbox>
                                        ): null
                                }
                            </div>
                            <div style={{paddingBottom:'2vh'}}>
                                <Table
                                    rowSelection={localSwitch?{
                                        type: 'checkbox',
                                        ...rowSelectionLocal,
                                    }:null}
                                    columns={columns}
                                    dataSource={datasource}
                                    rowKey={'filename'}
                                    disabled={!localSwitch}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={10} offset={2}>
                    <div>
                        <Row  style={{paddingBottom:'2vh'}}>
                            <Col>
                                <span style={{fontSize:'medium',fontWeight:'bold'}}>Upload to Dataset (Curation):</span>
                            </Col>
                            <Col>
                                <div style={{paddingLeft:'1vw'}}>
                                    <Switch
                                        checked={adapt2Store.remoteSwitch}
                                        checkedChildren="Yes"
                                        unCheckedChildren="No"
                                        defaultChecked={false}
                                        onChange={value=>this.handleSwitchOnChange(value, 'remote')}
                                        disabled={switchCheck()}
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
                                                disabled={!remoteSwitch}
                                            >
                                                {option}
                                            </Checkbox>
                                        ): null
                                }
                            </div>
                            <div style={{paddingBottom:'2vh'}}>
                                <Table
                                    rowSelection={remoteSwitch?{
                                        type: 'checkbox',
                                        ...rowSelectionRemote,
                                    }: null}
                                    columns={columns}
                                    dataSource={datasource}
                                    rowKey={'filename'}
                                    disabled={!remoteSwitch}
                                />
                            </div>
                        </div>
                    </div>

                </Col>
            </Row>

        )
    }
}