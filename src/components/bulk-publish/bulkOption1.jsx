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
    Switch, Tag, Select, TreeSelect, Icon
} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import APIInput from "../adapt-2/apiInput"
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;

const OkSvg = () => (
    <svg enableBackground="new 0 0 497 497" width="2em" height="2em" viewBox="0 0 497 497" xmlns="http://www.w3.org/2000/svg">
      <path d="m95.284 73.273c6.597-3.013 12.933-6.264 18.452-10.28 20.06-14.599 33.855-43.067 57.955-50.892 23.253-7.55 51.039 7.126 76.809 7.126s53.556-14.676 76.809-7.126c24.1 7.825 37.895 36.293 57.955 50.892 20.261 14.745 51.543 19.169 66.288 39.43 14.599 20.06 9.235 51.106 17.061 75.206 7.55 23.253 30.387 45.101 30.387 70.871s-22.837 47.618-30.387 70.871c-7.825 24.1-2.461 55.146-17.061 75.206-14.745 20.261-46.028 24.685-66.288 39.43-20.06 14.599-33.855 43.067-57.955 50.892-23.253 7.55-51.039-7.126-76.809-7.126s-53.556 14.676-76.809 7.126c-24.1-7.825-37.895-36.293-57.955-50.892-20.261-14.745-51.543-19.169-66.288-39.43-14.599-20.06-9.235-51.106-17.06-75.206-7.551-23.253-30.388-45.101-30.388-70.871s22.837-47.618 30.387-70.871c7.825-24.1 2.462-55.146 17.061-75.206 4.652-6.392 10.95-11.207 18.028-15.268" fill="#77d1b3"/>
      <path d="m449.946 248.5c0 20.89-18.513 38.602-24.633 57.452-6.344 19.537-1.995 44.704-13.83 60.966-11.953 16.424-37.312 20.01-53.736 31.964-16.262 11.835-27.444 34.912-46.981 41.256-18.85 6.121-41.375-5.776-62.265-5.776s-43.415 11.897-62.265 5.776c-19.537-6.343-30.719-29.421-46.981-41.256-16.424-11.953-41.783-15.539-53.737-31.964-11.835-16.262-7.487-41.429-13.83-60.965-6.121-18.85-24.633-36.561-24.633-57.452 0-20.89 18.513-38.602 24.633-57.452 6.343-19.537 1.995-44.704 13.83-60.965 11.953-16.424 37.312-20.01 53.737-31.964 16.262-11.835 27.444-34.912 46.981-41.256 18.85-6.121 41.375 5.776 62.265 5.776s43.415-11.897 62.265-5.777c19.537 6.343 30.719 29.421 46.981 41.256 16.424 11.953 41.784 15.539 53.737 31.964 11.835 16.262 7.487 41.429 13.83 60.965 6.119 18.85 24.632 36.562 24.632 57.452z" fill="#f5f5f5"/>
      <path d="m466.613 177.629c-7.825-24.1-2.461-55.146-17.061-75.206-14.745-20.261-46.028-24.685-66.288-39.43-20.06-14.599-33.855-43.067-57.955-50.892-9.845-3.196-20.503-2.405-31.476-.433.493.139.987.274 1.476.433 24.1 7.825 37.895 36.293 57.955 50.892 20.261 14.745 51.543 19.169 66.288 39.43 14.599 20.06 9.235 51.106 17.061 75.206 7.55 23.252 30.387 45.101 30.387 70.871s-22.837 47.618-30.387 70.871c-7.825 24.1-2.461 55.146-17.061 75.206-14.745 20.261-46.028 24.685-66.288 39.43-20.06 14.599-33.855 43.067-57.955 50.892-.489.159-.983.294-1.477.434 10.973 1.971 21.632 2.763 31.477-.434 24.1-7.825 37.895-36.293 57.955-50.892 20.261-14.745 51.543-19.169 66.288-39.43 14.599-20.06 9.236-51.106 17.061-75.206 7.55-23.253 30.387-45.101 30.387-70.871s-22.837-47.619-30.387-70.871z" fill="#67b59f"/>
      <path d="m425.313 191.048c-6.343-19.537-1.995-44.704-13.83-60.965-11.953-16.424-37.312-20.011-53.737-31.963-16.262-11.835-27.444-34.913-46.981-41.256-9.041-2.936-18.928-1.724-29.074.329 18.964 6.762 30.053 29.281 46.055 40.927 16.424 11.953 41.784 15.539 53.737 31.963 11.835 16.262 7.487 41.429 13.83 60.965 6.121 18.85 24.633 36.561 24.633 57.452 0 20.89-18.513 38.602-24.633 57.452-6.344 19.537-1.995 44.704-13.83 60.965-11.953 16.424-37.312 20.011-53.736 31.964-16.001 11.645-27.091 34.164-46.055 40.926 10.146 2.053 20.033 3.265 29.074.33 19.537-6.344 30.719-29.421 46.981-41.256 16.424-11.953 41.783-15.539 53.736-31.964 11.835-16.262 7.487-41.429 13.83-60.965 6.12-18.85 24.633-36.561 24.633-57.452s-18.513-38.602-24.633-57.452z" fill="#efe9f1"/>
      <path d="m197.332 329.095-37.233-44.799c-5.619-6.761-4.693-16.798 2.068-22.417l10.438-8.675c6.761-5.619 16.797-4.693 22.417 2.068l18.758 22.57c4.482 5.393 12.666 5.671 17.503.593l95.896-93.564c6.064-6.366 16.14-6.61 22.505-.546l9.828 9.362c6.366 6.064 6.61 16.14.546 22.505l-115.832 114.491c-12.959 13.604-34.885 12.862-46.894-1.588z" fill="#92e0c4"/>
      <path d="m359.512 193.687-9.828-9.362c-6.366-6.064-16.442-5.819-22.505.546l-3.419 3.336 5.752 5.48c6.366 6.064 6.61 16.14.546 22.505l-115.832 114.491c-2.329 2.445-4.95 4.418-7.748 5.94 12.06 6.555 27.634 4.677 37.748-5.94l115.833-114.491c6.063-6.366 5.819-16.442-.547-22.505z" fill="#77d1b3" />
    </svg>
  );
//const OKIcon = props => <Icon component={okSvg} {...props} />;
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
        this.props.bulkPublishStore.dvOnChange(dvID, label)
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
    onFinish=()=>{
        this.props.bulkPublishStore.handleSubmit()
    }
    render() {
        const { systemStore, authStore, bulkPublishStore } = this.props
        const { selectedServer } = this.state
        console.log(bulkPublishStore.subDSMap.get(2474)?bulkPublishStore.subDSMap.get(2474).result: null)
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
                            {
                                row.version === "Never Published"?null: <Select.Option value="minor">Minor</Select.Option>
                            }
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
            },
            {
                title: 'Published S/F?',
                render: (text, row, index) => {
                    return (
                        
                        bulkPublishStore.subDSMap.get(row.id).result?bulkPublishStore.subDSMap.get(row.id).result==="OK"?<OkSvg />: bulkPublishStore.subDSMap.get(row.id).result:"Not yet published"
                        
                    )
                  },
            }
        ];
        const rowSelection = {
            selectedRowKeys: [...bulkPublishStore.publishType.keys()],
            
            onSelect: (record, selected) =>{
                console.log(record, selected)
                bulkPublishStore.handleClick(record, selected)
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                if (selected) {
                    for(let row of selectedRows){
                        if(!bulkPublishStore.publishType.has(row.id)){  
                            bulkPublishStore.publishType.set(row.id, "major")
                        }
                    }
                } else {
                    bulkPublishStore.publishType.clear()
                }
              },
            selections: [
                {
                    key: 'allMajor',
                    text: 'All Major',
                    onSelect: changableRowKeys => {
                        for(let key of changableRowKeys){
                            if(bulkPublishStore.publishType.has(key)){
                                bulkPublishStore.publishType.delete(key)
                                bulkPublishStore.publishType.set(key, "major")
                            }
                            bulkPublishStore.publishType.set(key, "major")
                        }
                    },
                },
                {
                    key: 'allMinor',
                    text: 'All Minor',
                    onSelect: changableRowKeys => {
                        for(let key of changableRowKeys){
                            if(bulkPublishStore.subDSMap.get(key).version === "Never Published"){
                                if(bulkPublishStore.publishType.has(key)){
                                    bulkPublishStore.publishType.delete(key)
                                    bulkPublishStore.publishType.set(key, "major")
                                }
                                bulkPublishStore.publishType.set(key, "major")
                            }
                            else {
                                if(bulkPublishStore.publishType.has(key)){
                                    bulkPublishStore.publishType.delete(key)
                                    bulkPublishStore.publishType.set(key, "minor")
                                }
                                bulkPublishStore.publishType.set(key, "minor")
                            }
                        }
                    },
                },
                {
                    key: 'deselectAll',
                    text: 'Deselect All',
                    onSelect: changableRowKeys => {
                        bulkPublishStore.publishType.clear()
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
                                    onFinish={this.onFinish}
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
                                                dataSource={[...bulkPublishStore.subDSMap.values()].flat()}
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