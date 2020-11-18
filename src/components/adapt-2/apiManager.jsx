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

@inject('routingStore', 'systemStore', 'authStore', 'adapt2Store')
@observer

export default class APIManager extends Component{
    state={
        isLoading: false
    }
    
    handleLoading =(value)=>{
        this.setState({
            isLoading: value
        })
    }
    onCancel = ()=>{
        this.props.adapt2Store.handleApiManagerVisible(false)
        //this.props.systemStore.handleAPIInputModal(false)
        //this.props.systemStore.clearFailedAPI()
        // if(this.props.newDatasetSwitch){
        //     this.props.newDatasetSwitch(false)
        // }

    }
    onFinish = values => {
        console.log('Received values of form1: ', values);
        this.props.adapt2Store.updateUserAPIs(values)

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
        const { systemStore, authStore, adapt2Store } = this.props
        return (
            <>
                <span style={{cursor:'pointer'}} onClick={()=>{adapt2Store.handleApiManagerVisible(true)}}>Manage API Keys</span>
                <CollectionCreateForm
                    visible={adapt2Store.apiManagerVisible}
                    onCreate={this.onFinish}
                    onCancel={() => this.onCancel()}
                    APIs = {authStore.serverList}
                    isLoading={this.state.isLoading}
                    errorMsg={systemStore.apiInputErrorMsg}
                />
            </>
        )
    }
}

const layout = {
    labelCol: { span: 10, offset: 2 },
    wrapperCol: { span: 20, offset: 2 },
  };
 
const CollectionCreateForm = ({ visible, onCreate, onCancel, APIs, isLoading, errorMsg }) => {
    const [form] = Form.useForm();
    //console.log(NeededAPIs)
    //console.log(APIs)
    const footer = errorMsg? ([<Button key="cancel" onClick={onCancel}>
        Return
    </Button>]):(
        [<Button key="cancel" onClick={onCancel}>
            Return
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={() => {
            //console.log(form.fields)
            form.validateFields()
                .then(values => {
                    console.log(values)
                    //form.resetFields();
                    onCreate(values);
                })
                .catch(info => {
                    console.log('Validate Failed:', info);
                });
        }}>
            Submit
        </Button>])
    console.log(errorMsg)
    return (
        <Modal
            visible={visible}
            maskClosable={false}
            //closable={true}
            onCancel={()=>onCancel()}
            centered
            title="API Keys"
            footer={footer}
        >

            <Form
                {...layout}
                form={form}
                layout="vertical"
                name="form_in_modal"
                initialValues={APIs.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.API}), {})}
            >
                {
                    errorMsg?
                    <div style={{paddingBottom:'2%'}}>
                        <Alert message={errorMsg} type="error" showIcon />
                    </div>: null
                }
                {
                    //&& NeededAPIs[0].id !== 2
                    APIs.length>0?
                        APIs.map(api=>{
                            return (<Form.Item
                                key={api.id-1}
                                //label={APIs[api.id-1].servername}
                                label={api.servername}
                            >
                                <Form.Item
                                    name={api.id}
                                    rules={[
                                        {
                                            type: 'string',
                                            pattern: '^[0-9A-Za-z\\-]+$',
                                            message: 'This field must be a valid Dataverse API key.'
                                        }
                                    ]}
                                >
                                    <Input
                                    placeholder={`API key for ${api.servername}`}
                                    //APIs[api.id-1].servername
                                    />
                                </Form.Item>

                            </Form.Item>)}

                        ): null
                }

            </Form>
            <div>
                <Popover placement="topLeft" content={"Log into the specific dataverse, click your name on the top right corner and then click API token in the dropdown menu."} trigger="click">
                    {/*<InfoCircleOutlined />*/}
                    <span style={{marginLeft:'2%', color:'red',cursor:'pointer'}}>Where can I find the API key?</span>
                </Popover>
            </div>
        </Modal>
    );
};