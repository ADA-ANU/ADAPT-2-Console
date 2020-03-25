import React, {Component, useState} from 'react';
import { Form, Input, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect,  Switch, Button, ConfigProvider } from 'antd';
import { inject, observer } from 'mobx-react';
import API_URL from '../config'
import 'antd/es/spin/style/css';
const { TextArea } = Input;
import { toJS } from 'mobx'

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class DataverseForm extends Component{
    state={
        createDataset: false,
        fileUploadSwitch: true
    }

    formRef = React.createRef();

    fileUploadSwitchOnChange = (checked)=>{
        this.setState({
            fileUploadSwitch: checked
        })
    }
    createDatasetOnChange = (checked)=>{
        this.setState({
            createDataset: checked
        })
        if (checked === false){
            this.formRef.current.resetFields()
        }
    }

    onFinish = values => {
        console.log('Received values of form: ', values);
        this.props.handleFormData(values)
        this.formRef.current.resetFields()
    };

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


    render() {
        const serverList = toJS(this.props.systemStore.serverList)
        return (
            <Form
                id="createDataset"
                ref={this.formRef}
                onFinish={this.onFinish}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
                initialValues={{ newDataset: false, uploadSwitch: false, server: undefined,
                    dataverse: undefined, doi: undefined, title: undefined, author: undefined,
                    email: undefined, description: undefined, subject: undefined
                }}
                size={"middle"}
            >
                {/*<Form.Item label="Form Size" name="size">*/}
                {/*    <Radio.Group>*/}
                {/*        <Radio.Button value="small">Small</Radio.Button>*/}
                {/*        <Radio.Button value="middle">Middle</Radio.Button>*/}
                {/*        <Radio.Button value="large">Large</Radio.Button>*/}
                {/*    </Radio.Group>*/}
                {/*</Form.Item>*/}
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
                        },
                    ]}
                >
                    <Select
                        placeholder="Select a server"
                        disabled={!this.state.createDataset}
                    >
                        {
                            serverList && serverList.length>0?
                                serverList.map(server=>{
                                    return(
                                        <Select.Option key={server.id} value={server.id}>{server.servername} ({server.url})</Select.Option>
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
                        },
                    ]}
                >
                    <Select
                        showSearch
                        disabled={!this.state.createDataset}
                        placeholder="Select a person"
                        optionFilterProp="children"
                        onChange={this.dataverseOnChange}
                        onFocus={this.dataverseOnFocus}
                        onBlur={this.dataverseOnBlur}
                        onSearch={this.dataverseOnSearch}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        <Select.Option value="jack">Jack</Select.Option>
                        <Select.Option value="lucy">Lucy</Select.Option>
                        <Select.Option value="tom">Tom</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Dataset DOI"
                    name="doi"
                    rules={[
                        {
                            required: this.state.createDataset,
                        },
                    ]}
                >
                    <Input
                        placeholder="Input doi"
                        disabled={!this.state.createDataset}
                    />
                </Form.Item>
                <Form.Item
                    label="Dataset Title"
                    name="title1"
                    rules={[
                        {
                            required: this.state.createDataset,
                        },
                    ]}
                >
                    <Input
                        placeholder="Input dataset title"
                        disabled={!this.state.createDataset}
                    />
                </Form.Item>
                <Form.Item
                    label="Dataset Author"
                    name="author"
                    rules={[
                        {
                            required: this.state.createDataset,
                        },
                    ]}
                >
                    <Input
                        placeholder="Input dataset author"
                        disabled={!this.state.createDataset}
                    />
                </Form.Item>
                <Form.Item
                    label="Contact Email"
                    name="email"
                    rules={[
                        {
                            required: this.state.createDataset,
                        },
                    ]}
                >
                    <Input
                        placeholder="Input contact email"
                        disabled={!this.state.createDataset}
                    />
                </Form.Item>
                <Form.Item
                    label="Dataset Description"
                    name="description"
                    rules={[
                        {
                            required: this.state.createDataset,
                        },
                    ]}
                >
                    <TextArea
                        placeholder="Input description"
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
                        },
                    ]}
                >
                    <Input
                        disabled={!this.state.createDataset}
                    />
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
                        disabled={!this.state.createDataset}
                        checkedChildren="Yes"
                        unCheckedChildren="No"
                        onChange={this.fileUploadSwitchOnChange}/>
                </Form.Item>

            </Form>
        )
    }
}