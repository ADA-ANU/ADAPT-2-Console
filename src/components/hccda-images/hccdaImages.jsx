import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
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
    Table, Select
} from 'antd';
import { UploadOutlined, InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;

const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15, offset: 1 },
};

@inject('routingStore', 'systemStore', 'authStore', 'hccdaStore')
@observer
export default class hccdaImages extends Component{
    constructor(props){
        super(props)
        this.state = {

        };
    }


    // onFinish = values => {
    //
    //     console.log('Received values of form: ', values);
    //     //this.createDatasetOnChange(false)
    //     //this.submit(values)
    // };
    componentDidMount(){
        this.props.hccdaStore.getData()
    }
    handleRadioChange = e =>{
        console.log(e.target.value)
        const value = e.target.value
        this.props.bulkPublishStore.SelectionOnChange(value)
    }
    handleAnchorClick = (e, link) => {
        e.preventDefault();
    };
    handleSubmit=(form)=>{
        console.log(form)
    }

    render() {
        const { systemStore, authStore, hccdaStore } = this.props
        console.log(hccdaStore.types)
        return(
            <div style={{background: 'white', paddingTop:'2%', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>

                    <Row style={{paddingTop: '2vh'}}>
                        <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div id="select" style={{paddingTop: '4vh', paddingBottom: '2vh'}}>
                            <Form
                                name="hccda"
                                {...formItemLayout}
                                //onFinish={onFinish}
                            >
                                <Form.Item
                                    name="state"
                                    label="State"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Please select the state!' }]}
                                >
                                    <Select 
                                        placeholder="Please select a state"
                                        onChange={val=>hccdaStore.dropDownOnChange(val, 'state')}
                                    >
                                        {
                                            hccdaStore.data? 
                                                Object.keys(hccdaStore.data).map(state=>
                                                    <Select.Option key={state} value={state}>{state}</Select.Option>
                                                    )
                                                :null
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="year"
                                    label="Year"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Please select the year!' }]}
                                >
                                    <Select placeholder="Please select a year">
                                        {
                                            hccdaStore.data && hccdaStore.state?
                                                hccdaStore.data[hccdaStore.state].map(year=>
                                                    <Select.Option key={year} value={year}>{year}</Select.Option>
                                                    )
                                                :null
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="type"
                                    label="Image Type"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Please select the image type!' }]}
                                >
                                    <Select placeholder="Please select an image type">
                                        {
                                            hccdaStore.types?
                                                Object.keys(hccdaStore.types).map(key=>
                                                    <Select.Option key={key} value={key}>{hccdaStore.types[key]}</Select.Option>
                                                    )
                                                :null
                                        }
                                    </Select>
                                </Form.Item>
                            </Form>

                            </div>

                        </Col>
                    </Row>
                    
                    <Row>
                        <Col xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>

                            <div style={{paddingTop: '5vh', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    form={'hccda'}
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    //onClick={adapt2Store.selection ===1?()=>adapt2Store.handleSubmit(): null}
                                    loading={hccdaStore.isLoading}
                                    //disabled={bulkPublishStore.submitCheck()}
                                >
                                    {hccdaStore.isLoading ? 'Publishing' : 'Publish'}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {/*ref => {adapt2Store.adapt2Ref = ref}*/}
                    {/* <div id="finalResult" >
                        {
                            systemStore.showfinalResult?(

                                <Row style={{marginTop:'2vh', marginBottom:'2vh'}}>
                                    <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                                        <FinalResult clearResult={this.clearResult} />
                                    </Col>
                                </Row>

                            ):null
                        }
                    </div> */}
                </div>

            </div>
        )
    }
}