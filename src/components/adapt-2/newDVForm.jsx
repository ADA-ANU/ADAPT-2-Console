import React, {Component, useState} from 'react';
import {Form, Input, Select, Switch, Button, ConfigProvider, Modal, Row, Col, TreeSelect} from 'antd';
import { inject, observer } from 'mobx-react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import APIInput from "./apiInput";
import { toJS } from 'mobx'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DynamicField from "./dynamicFields";
import FinalResult from "./finalResult";
const { TextArea } = Input;

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer
export default class NewDVForm extends Component{
    state={
        createDataset: false,
        fileUploadSwitch: true,
        modalOpen: false,
        selectedServer: null,
        selectedDataverse: null
    }

    formRef = React.createRef();

    fileUploadSwitchOnChange = (checked)=>{
        this.setState({
            fileUploadSwitch: checked
        })
    }


    checkAPI = ()=>{
        const servers = toJS(this.props.authStore.serverList)
        if (servers.length>0) {
            servers.map(server=>{
                if(!server.API){
                    this.props.systemStore.handleFailedAPI(server.id, 1, 'No API found.')
                    this.props.systemStore.handleAPIInputModal(true)
                }
            })
        }

    }

    serverOnChange =(value) => {
        console.log(`selected ${value}`);
        this.props.formRef.current.setFieldsValue({
            dataverse: undefined,
        })
        // this.setState({
        //     selectedServer: value
        // })
        this.props.adapt2Store.setDVFormServer(value)

    }

    onLoadData = treeNode =>{
        const { id } = treeNode.props;
        return new Promise((resolve, reject)=>{
            this.props.authStore.getSubDataversesForAdapt2(id)
                .then(res=>resolve())
                .catch(err=>{
                    console.log(err)
                }).catch(e=>{
                    console.log(e)
            })
        })

    }
    dataverseOnChange =(value, label) => {
        console.log(`selected ${value}`);
        //const userid = toJS(this.props.authStore.currentUser).userID
        const serverValue = this.props.formRef.current.getFieldValue("server")
        const servers = toJS(this.props.authStore.serverList)
        // const dvID = value[1]
        // const dvName = value[0]
        const dvID = value
        const dvName = label
        this.props.systemStore.checkDVPermission(serverValue, dvID, dvName, 'ADD_DS', true)
        // .then(res=>{
        //     if (res === false){
        //         for (let server of servers){
        //             if (server.alias === serverValue){
        //                 this.props.systemStore.handleFailedAPI(server.id, 2, `Sorry, you don't have permission to create a dataset in ${dvName} dataverse,
        //                  please make sure your API key is correct`)
        //                 this.props.systemStore.handleAPIInputModal(true)
        //                 return
        //             }
        //         }
        //     }
        // })
    }

    dataverseOnBlur = ()=> {
        console.log('blur');
    }

    dataverseOnFocus = ()=> {
        console.log('focus');
    }

    dataverseOnSearch = (val)=> {
        console.log('search:', val);
    }

    handleSubjectChange= value =>{
        console.log(value)
    }
    onFinish=value=>{
        this.props.adapt2Store.handleSubmit(value)
    }


    render() {
        const { authStore, systemStore, files, formReset, createDataset, formRef, adapt2Store } = this.props
        const serverList = toJS(authStore.serverList)
        const user = toJS(authStore.currentUser)
        const dataverses = toJS(authStore.newDVList)
        const treeData = Object.keys(authStore.newDVList).length>0 && adapt2Store.dvFormSelectedServer?authStore.newDVList[adapt2Store.dvFormSelectedServer].dataverses: []
        console.log(user)
        console.log(serverList)
        console.log(this.state.selectedDataverse)
        console.log(dataverses)
        console.log(toJS(systemStore.dataverseSubjects))
        return (
            <>
                <Form
                    id="datasetCreation"
                    ref={formRef}
                    onFinish={this.onFinish}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16, offset:1 }}
                    layout="horizontal"
                    initialValues={{ newDataset: false, uploadSwitch: false, server: undefined,
                        dataverse: undefined, doi: undefined, title: undefined, author: undefined,
                        email: undefined, description: undefined, subject: undefined, firstName: undefined,
                        lastName: undefined
                    }}
                    size={"middle"}
                >
                    {/*<Form.Item*/}
                    {/*    label="Create new dataset?"*/}
                    {/*    name="newDataset"*/}
                    {/*    valuePropName="checked"*/}
                    {/*    rules={[*/}
                    {/*        {*/}
                    {/*            required: this.state.createDataset,*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <Switch*/}
                    {/*        defaultChecked={true}*/}
                    {/*        checkedChildren="Yes"*/}
                    {/*        unCheckedChildren="No"*/}
                    {/*        onChange={this.createDatasetOnChange}*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        label="Dataverse"
                        name="server"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please select a dataverse.",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a dataverse"
                            disabled={!createDataset}
                            onChange={this.serverOnChange}
                        >
                            {
                                serverList && serverList.length>0?
                                    serverList.map(server=>{
                                        return(
                                            server.id !== 2?
                                                <Select.Option key={server.id} value={server.alias}>{server.servername} ({server.url})</Select.Option>: null
                                        )
                                    }):<Select.Option value={0}>Loading</Select.Option>

                            }
                            {/*<Select.Option value="self">Self Deposit (deposit.ada.edu.au)</Select.Option>*/}
                            {/*<Select.Option value="production">Production Deposit (dataverse.ada.edu.au)</Select.Option>*/}
                            {/*<Select.Option value="test">Test Deposit (dataverse-test.ada.edu.au)</Select.Option>*/}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Sub-Dataverse"
                        name="dataverse"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please select a sub-dataverse.",
                            },
                        ]}
                    >
                        <TreeSelect
                            treeDataSimpleMode
                            showSearch
                            //allowClear
                            autoClearSearchValue='false'
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            disabled={!createDataset || adapt2Store.dvFormSelectedServer === null}
                            placeholder="Select a sub-dataverse"
                            optionFilterProp="children"
                            onChange={this.dataverseOnChange}
                            loadData={this.onLoadData}
                            loading={true}
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
{/*                        <Select*/}
{/*                            showSearch*/}
{/*                            disabled={!createDataset || this.state.selectedServer === null}*/}
{/*                            placeholder="Select a sub-dataverse"*/}
{/*                            optionFilterProp="children"*/}
{/*                            onChange={this.dataverseOnChange}*/}
{/*                            loading={Object.keys(dataverses).length < 1}*/}
{/*                            // onFocus={this.dataverseOnFocus}*/}
{/*                            // onBlur={this.dataverseOnBlur}*/}
{/*                            // onSearch={this.dataverseOnSearch}*/}
{/*                            filterOption={(input, option) =>*/}
{/*                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0*/}
{/*                            }*/}
{/*                        >*/}
{/*                            {*/}
{/*                                Object.keys(dataverses).length > 0 && this.state.selectedServer?*/}
{/*                                    dataverses[this.state.selectedServer].dataverses.map(dataverse=>{*/}
{/*                                        return(*/}
{/*                                            <Select.Option key={dataverse.id} value={[dataverse.title, dataverse.id]}>{dataverse.title}</Select.Option>*/}
{/*                                        )*/}
{/*                                    }):null*/}
{/*//<Select.Option value={0}>Loading <LoadingOutlined style={{ fontSize: 24 }} spin /></Select.Option>*/}
{/*                            }*/}
{/*                        </Select>*/}
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label="Dataset DOI"*/}
                    {/*    name="doi"*/}
                    {/*    rules={[*/}
                    {/*        {*/}
                    {/*            required: this.state.createDataset,*/}
                    {/*            message: "Please input DOI.",*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <Input*/}
                    {/*        placeholder="input doi"*/}
                    {/*        disabled={!this.state.createDataset}*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        label="Dataset Title"
                        name="title"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please enter title.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter title ..."
                            disabled={!createDataset}
                        />
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label="Dataset Author"*/}
                    {/*    name="author"*/}
                    {/*    rules={[*/}
                    {/*        {*/}
                    {/*            required: this.state.createDataset,*/}
                    {/*            message: "Please enter author name.",*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <Input*/}
                    {/*        placeholder="Enter familyName, givenName ..."*/}
                    {/*        disabled={!this.state.createDataset}*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        label="Author's First Name"
                        name="firstName"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please enter author's first name.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter first name ..."
                            disabled={!createDataset}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Author's Last Name"
                        name="lastName"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please enter author's last name.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter last name ..."
                            disabled={!createDataset}
                        />
                    </Form.Item>
                    <DynamicField required={createDataset}/>
                    <Form.Item
                        label="Contact Email"
                        name="email"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please enter email.",
                                type: 'email'
                            },
                        ]}
                    >
                        <Input
                            placeholder="Enter email ..."
                            disabled={!createDataset}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Dataset Description"
                        name="description"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please enter description.",
                            },
                        ]}
                    >
                        <TextArea
                            placeholder="Enter description ..."
                            autoSize={{ minRows: 4, maxRows: 15 }}
                            disabled={!createDataset}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Dataset Subject"
                        name="subject"
                        rules={[
                            {
                                required: createDataset,
                                message: "Please select subject.",
                            },
                        ]}
                    >
                        {/*<Input*/}
                        {/*    disabled={!this.state.createDataset}*/}
                        {/*/>*/}
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Select one or more subjects"
                            disabled={!createDataset}
                            //defaultValue={['china']}
                            //onChange={this.handleSubjectChange}
                            optionLabelProp="label"
                        >
                            {
                                systemStore.dataverseSubjects && systemStore.dataverseSubjects.length>0?
                                    systemStore.dataverseSubjects.map(subject=>
                                        <Select.Option value={subject.subjectname} key={subject.id} label={subject.subjectname}>
                                            {/*{[subject.subjectname,subject.id]}*/}
                                            {subject.subjectname}
                                        </Select.Option>
                                    ):null

                            }

                        </Select>
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*    label="Upload files to dataverse "*/}
                    {/*    name="uploadSwitch"*/}
                    {/*    valuePropName="checked"*/}
                    {/*    rules={[*/}
                    {/*        {*/}
                    {/*            required: createDataset,*/}
                    {/*        },*/}
                    {/*    ]}*/}
                    {/*>*/}
                    {/*    <Switch*/}
                    {/*        // defaultChecked={true}*/}
                    {/*        //checked={this.state.fileUploadSwitch}*/}
                    {/*        disabled={!createDataset || files.length===0}*/}
                    {/*        checkedChildren="Yes"*/}
                    {/*        unCheckedChildren="No"*/}
                    {/*        onChange={this.fileUploadSwitchOnChange}/>*/}
                    {/*</Form.Item>*/}

                </Form>
                <APIInput newDatasetSwitch={this.createDatasetOnChange}/>
            </>
        )
    }
}