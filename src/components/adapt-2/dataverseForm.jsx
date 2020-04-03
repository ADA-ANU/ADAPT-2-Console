import React, {Component, useState} from 'react';
import { Form, Input, Select, Switch, Button, ConfigProvider, Modal, Row, Col } from 'antd';
import { inject, observer } from 'mobx-react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import APIInput from "./apiInput";
import { toJS } from 'mobx'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import DynamicField from "./dynamicFields";
import FinalResult from "./finalResult";
const { TextArea } = Input;

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class DataverseForm extends Component{
    state={
        createDataset: false,
        fileUploadSwitch: true,
        modalOpen: false,
        selectedServer: '',
        selectedDataverse: ''
    }

    formRef = React.createRef();

    fileUploadSwitchOnChange = (checked)=>{
        this.setState({
            fileUploadSwitch: checked
        })
    }
    createDatasetOnChange = (checked)=>{
        console.log("create button value change to "+ checked)
        this.setState({
            createDataset: checked
        })
        if (checked === false){
            this.formRef.current.resetFields()
        }
        else {
            this.checkAPI()
        }
    }

    checkAPI = ()=>{
        const servers = toJS(this.props.authStore.serverList)
        if (servers.length>0) {
            servers.map(server=>{
                if(!server.API){
                    this.props.systemStore.handleFailedAPI(server.id, 1)
                    this.props.systemStore.handleAPIInputModal(true)
                }
            })
        }

    }

    onFinish = values => {
        console.log('Received values of form: ', values);
        this.props.handleFormData(values)
        this.createDatasetOnChange(false)
    };
    serverOnChange =(value) => {
        console.log(`selected ${value}`);
        this.formRef.current.setFieldsValue({
            dataverse: undefined,
        })
        this.setState({
            selectedServer: value
        })

    }

    dataverseOnChange =(value) => {
        console.log(`selected ${value}`);
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


    render() {
        const { authStore, systemStore, files, formReset } = this.props
        const serverList = toJS(authStore.serverList)
        const user = toJS(authStore.currentUser)
        const dataverses = toJS(authStore.Dataverses)
        console.log(user)
        console.log(serverList)
        console.log(this.state.selectedDataverse)
        console.log(files)
        return (
            <>
                <Form
                    id="createDataset"
                    ref={this.formRef}
                    onFinish={this.onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18, offset:1 }}
                    layout="horizontal"
                    initialValues={{ newDataset: false, uploadSwitch: false, server: undefined,
                        dataverse: undefined, doi: undefined, title: undefined, author: undefined,
                        email: undefined, description: undefined, subject: undefined
                    }}
                    size={"middle"}
                >
                    <Form.Item
                        label="Create new dataset?"
                        name="newDataset"
                        valuePropName="checked"
                        rules={[
                            {
                                required: this.state.createDataset,
                            },
                        ]}
                    >
                        <Switch
                            defaultChecked={true}
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            onChange={this.createDatasetOnChange}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Server"
                        name="server"
                        rules={[
                            {
                                required: this.state.createDataset,
                                message: "Please select a dataverse server.",
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select a server"
                            disabled={!this.state.createDataset}
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
                                required: this.state.createDataset,
                                message: "Please select a dataverse.",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            disabled={!this.state.createDataset}
                            placeholder="Select a dataverse"
                            optionFilterProp="children"
                            onChange={this.dataverseOnChange}
                            // onFocus={this.dataverseOnFocus}
                            // onBlur={this.dataverseOnBlur}
                            // onSearch={this.dataverseOnSearch}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                dataverses && this.state.selectedServer?
                                    dataverses[this.state.selectedServer].dataverses.map(dataverse=>{
                                        return(
                                            <Select.Option key={dataverse.id} value={[dataverse.title, dataverse.id]}>{dataverse.title}</Select.Option>
                                        )
                                    }):<Select.Option value={0}>Loading</Select.Option>

                            }
                            {/*<Select.Option value="jack">Jack</Select.Option>*/}
                            {/*<Select.Option value="lucy">Lucy</Select.Option>*/}
                            {/*<Select.Option value="tom">Tom</Select.Option>*/}
                        </Select>
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
                                required: this.state.createDataset,
                                message: "Please input title.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="input dataset title"
                            disabled={!this.state.createDataset}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Dataset Author"
                        name="author"
                        rules={[
                            {
                                required: this.state.createDataset,
                                message: "Please input author name.",
                            },
                        ]}
                    >
                        <Input
                            placeholder="input name of dataset author"
                            disabled={!this.state.createDataset}
                        />
                    </Form.Item>
                    <DynamicField required={this.state.createDataset}/>
                    <Form.Item
                        label="Contact Email"
                        name="email"
                        rules={[
                            {
                                required: this.state.createDataset,
                                message: "Please input email.",
                                type: 'email'
                            },
                        ]}
                    >
                        <Input
                            placeholder="input contact email"
                            disabled={!this.state.createDataset}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Dataset Description"
                        name="description"
                        rules={[
                            {
                                required: this.state.createDataset,
                                message: "Please input description.",
                            },
                        ]}
                    >
                        <TextArea
                            placeholder="input description"
                            autoSize={{ minRows: 4, maxRows: 15 }}
                            disabled={!this.state.createDataset}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Dataset Subject"
                        name="subject"
                        rules={[
                            {
                                required: this.state.createDataset,
                                message: "Please input subject.",
                            },
                        ]}
                    >
                        {/*<Input*/}
                        {/*    disabled={!this.state.createDataset}*/}
                        {/*/>*/}
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="select one or more subjects"
                            disabled={!this.state.createDataset}
                            //defaultValue={['china']}
                            //onChange={this.handleSubjectChange}
                            optionLabelProp="label"
                        >
                            {
                                systemStore.dataverseSubjects && systemStore.dataverseSubjects.length>0?
                                    systemStore.dataverseSubjects.map(subject=>
                                            <Select.Option value={[subject.subjectname,subject.id]} key={subject.id} label={subject.subjectname}>
                                                {subject.subjectname}
                                            </Select.Option>
                                    ):null

                            }

                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Update files to dataverse "
                        name="uploadSwitch"
                        valuePropName="checked"
                        rules={[
                            {
                                required: this.state.createDataset,
                            },
                        ]}
                    >
                        <Switch
                            // defaultChecked={true}
                            //checked={this.state.fileUploadSwitch}
                            disabled={!this.state.createDataset || files.length===0}
                            checkedChildren="Yes"
                            unCheckedChildren="No"
                            onChange={this.fileUploadSwitchOnChange}/>
                    </Form.Item>

                </Form>
                <APIInput newDatasetSwitch={this.createDatasetOnChange}/>
            </>
        )
    }
}