import React, {Component, useState} from 'react';
import {
    Form,
    Input,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Button,
    ConfigProvider,
    Modal,
    Popover, notification, Typography, Alert
} from 'antd';
import { UploadOutlined, InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
const { TextArea } = Input;
const { Text } = Typography;
import { toJS } from 'mobx'
import axios from "axios";

@inject('routingStore', 'systemStore', 'authStore')
@observer

export default class APIInput extends Component{
    state={
        isLoading: false
    }

    handleLoading =(value)=>{
        this.setState({
            isLoading: value
        })
    }
    onCancel = ()=>{
        this.props.systemStore.handleAPIInputModal(false)
        this.props.systemStore.clearFailedAPI()
        if(this.props.newDatasetSwitch){
            this.props.newDatasetSwitch(false)
        }

    }
    onFinish = values => {
        console.log('Received values of form1: ', values);
        this.handleLoading(true)
        const currentUser = toJS(this.props.authStore.currentUser)
        const obj = {
            failedAPiArray: this.props.systemStore.failedAPI,
            newInput: values,
            userid: currentUser.userID
        }
        const json = JSON.stringify(obj);
        axios.post(`${API_URL.QUERY_SITE}updateAPI`, json, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(res=>{
            if (res.status ===201){
                console.log(res.data)
                this.props.authStore.getServerList(currentUser.userID)
                    .then(res=>{
                        this.handleLoading(false)
                        this.props.systemStore.clearFailedAPI()
                        this.props.systemStore.handleAPIInputModal(false)
                        this.openNotificationWithIcon('success','APIs', '')
                    })

            }
            else {
                this.props.systemStore.clearFailedAPI()
                this.handleLoading(false)
                this.openNotificationWithIcon('error','APIs', 'please try again.')
            }
        }).catch(err=>{
            this.props.systemStore.handleAPIInputModal(false)
            this.props.systemStore.clearFailedAPI()
            this.handleLoading(false)
            this.openNotificationWithIcon('error','APIs', err)
        })

    };

    openNotificationWithIcon = (type,fileName,error) => {
        if (type === 'success'){
            notification[type]({
                message: 'Successful',
                description:
                    `You have successfully uploaded your ${fileName}`,
            });
        }
        else {
            notification[type]({
                message: 'Upload Failed',
                description:
                    `Uploading ${fileName} failed, ${error}`,
                duration: 0,
            });
        }

    };

    render() {
        const { systemStore, authStore } = this.props
        const serverList = toJS(authStore.serverList)
        return (
            <CollectionCreateForm
                visible={systemStore.apiInputOpen}
                onCreate={this.onFinish}
                onCancel={() => this.onCancel()}
                neededAPIs = {systemStore.failedAPI}
                APIs = {serverList}
                isLoading={this.state.isLoading}
            />
        )
    }
}
const CollectionCreateForm = ({ visible, onCreate, onCancel, neededAPIs, APIs, isLoading }) => {
    const [form] = Form.useForm();
    const NeededAPIs = toJS(neededAPIs)

    return (
        <Modal
            visible={visible}
            maskClosable={false}
            closable={false}
            centered
            title="We need your API keys for operations on Dataverses."
            // okText="Submit"
            // cancelText="Cancel"
            //onCancel={onCancel}
            // onOk={() => {
            //     form
            //         .validateFields()
            //         .then(values => {
            //             form.resetFields();
            //             onCreate(values);
            //         })
            //         .catch(info => {
            //             console.log('Validate Failed:', info);
            //         });
            // }}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Return
                </Button>,
                <Button key="submit" type="primary" loading={isLoading} onClick={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onCreate(values);
                        })
                        .catch(info => {
                            console.log('Validate Failed:', info);
                        });
                }}>
                    Submit
                </Button>,
            ]}
        >

            <Form
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={{
                    modifier: 'public',
                }}
            >
                {
                    APIs.length>0&& NeededAPIs.length>0?
                        NeededAPIs.map(api=>
                            <Form.Item
                                key={api.id-1}
                                name={api.id}
                                label={APIs[api.id-1].servername}
                                rules={[
                                    {
                                        required: true,
                                        message: `Please input the API key for ${APIs[api.id-1].servername}!`,
                                    },
                                ]}
                            >
                                <div style={{paddingBottom:'2%'}}>
                                    <Alert message={api.msg} type="warning" showIcon />
                                </div>
                                <Input
                                    placeholder={`API key for ${APIs[api.id-1].servername}`}
                                />
                            </Form.Item>
                        ): null
                }

            </Form>
            <div>
                <Popover placement="topLeft" content={"Log into the specific dataverse, click your name on the top right corner and then click API token in the dropdown menu."} trigger="click">
                    {/*<InfoCircleOutlined />*/}
                    <span style={{marginLeft:'2%', color:'red',cursor:'pointer'}}>Where can I find the API key?</span>
                </Popover>
            </div>
            <div>
                <Popover placement="topLeft" content={"It's either the API key you entered is wrong or your account does not have permission on that specific dataverse."} trigger="click">
                    {/*<InfoCircleOutlined />*/}
                    <span style={{marginLeft:'2%', color:'red',cursor:'pointer'}}>What does "Not Authorised" mean?</span>
                </Popover>
            </div>
        </Modal>
    );
};