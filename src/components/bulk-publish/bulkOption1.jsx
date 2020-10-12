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
    Switch, Tag, Select, TreeSelect
} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import APIInput from "../adapt-2/apiInput";
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;


@inject('routingStore', 'systemStore', 'authStore', 'bulkPublishStore')
@observer
export default class BulkOption1 extends Component{
    state={
        //createDataset: false,
        fileUploadSwitch: true,
        modalOpen: false,
        selectedServer: null,
        selectedDataverse: null
    }

    bulkRef1 = React.createRef();

    serverOnChange =(value) => {
        console.log(`selected ${value}`);
        this.bulkRef1.current.setFieldsValue({
            dataverse: undefined,
        })
        this.props.bulkPublishStore.serverOnChange(value)
    }

    dataverseOnChange =(value, label) => {
        console.log(`selected ${value}`);
        //const userid = toJS(this.props.authStore.currentUser).userID
        const serverValue = this.bulkRef1.current.getFieldValue("server")
        const servers = toJS(this.props.authStore.serverList)
        // const dvID = value[1]
        // const dvName = value[0]
        const dvID = value
        const dvName = label
        this.props.bulkPublishStore.dvOnChange(dvID)
        this.props.systemStore.checkDVPermission(serverValue, dvID, dvName, 'ADD_DS', true)
        this.props.bulkPublishStore.getSubDSs(serverValue, dvID)
    }

    onLoadData = treeNode =>{
        const { id } = treeNode.props;
        return new Promise((resolve, reject)=>{
            this.props.authStore.getSubDataversesForBulk(id)
                .then(res=>resolve())
                .catch(err=>{
                    console.log(err)
                    reject()
                })
        })

    }

    render() {
        const { systemStore, authStore, bulkPublishStore } = this.props
        const { selectedServer } = this.state
        console.log([...bulkPublishStore.publishType.keys()])
        const serverList = authStore.serverList
        const treeData = Object.keys(authStore.bulkDVList).length>0 && bulkPublishStore.selectedServer?authStore.bulkDVList[bulkPublishStore.selectedServer].dataverses: []
        const columns = [
            {
                title: 'Publish',
                render: (text, row, index) => {
                    return (
                        <Select
                            allowClear
                            value={bulkPublishStore.publishType.get(row.id)}
                            style={{ width: 120 }}
                            onChange={(value)=>bulkPublishStore.handlePublishType(row.id, value)}
                            placeholder="Select type"
                        >
                            <Select.Option value="major">Major</Select.Option>
                            <Select.Option value="minor">Minor</Select.Option>
                        </Select>
                    )
                  },
            },
            {
                title: 'Dataset Title',
                dataIndex: 'title',
            },
            {
                title: 'Latest Version',
                dataIndex: 'version',
            },
        
            {
                title: 'DOI',
                dataIndex: 'doi',
            }
        ];
        const rowSelection = {
            selectedRowKeys: [...bulkPublishStore.publishType.keys()],
            // onChange: (selectedRowKeys, selectedRows) => {
            //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            //     //this.setState({ selectedRowKeys });
            //     //systemStore.copyToolFileListOnChange(selectedRowKeys, selectedRows)
            //     bulkPublishStore.handleClick(selectedRowKeys, selectedRows)
            // },
            onSelect: (record, selected) =>{
                console.log(record, selected)
                bulkPublishStore.handleClick(record, selected)
            },
            selections: [
                
                {
                    key: 'allMajor',
                    text: 'All Major',
                    onSelect: changableRowKeys => {
                        // let newSelectedRowKeys = [];
                        // newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                        //     if (index % 2 !== 0) {
                        //         return false;
                        //     }
                        //     return true;
                        // });
                        // this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                }
            ]
        };
        return(
            <div style={{background: 'white', paddingTop:'3vh', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>
                    
                    <Row>
                        <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{paddingTop: '3vh', paddingBottom: '2vh'}}>
                                <Form
                                    id="bulkPublish_1"
                                    ref={this.bulkRef1}
                                    scrollToFirstError={true}
                                    //onFinish={this.onFinish}
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 16, offset:1 }}
                                    layout="horizontal"
                                    initialValues={{ destinationServer: undefined, dataverse: undefined}}
                                    size={"middle"}
                                >
                                    <Form.Item
                                        label="Dataverse"
                                        name="server"
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
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Sub-Dataverse"
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
                                            disabled={bulkPublishStore.selectedServer === undefined}
                                            placeholder="Select a sub-dataverse"
                                            optionFilterProp="children"
                                            onChange={this.dataverseOnChange}
                                            loadData={this.onLoadData}
                                            //loading={true}
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
                                    <Row style={{marginTop:'6vh', marginBottom:'2vh'}}>
                                        <Col style={{ width: '90%', margin: 'auto'}} >
                                            <div id="fileList" style={{textAlign: 'center', paddingTop:'2vh', paddingBottom:'2vh'}}>
                                                <span>Unpublished datasets: </span>
                                                
                                            </div>

                                            <Table
                                                rowSelection={{
                                                    type: 'checkbox',
                                                    ...rowSelection,
                                                }}
                                                columns={columns}
                                                dataSource={bulkPublishStore.subDSs}
                                                loading={bulkPublishStore.isLoading}
                                                rowKey={'id'}
                                            />

                                        </Col>
                                    </Row>
                                </Form>
                            </div>

                        </Col>
                    </Row>
                </div>
                <APIInput />
            </div>
        )
    }
}