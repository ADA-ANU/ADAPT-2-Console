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
    Switch, Tag, Select, TreeSelect, Icon, Input
} from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import APIInput from "../adapt-2/apiInput"
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;
const { TextArea } = Input;

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
export default class BulkOption3 extends Component{
    state={
        //createDataset: false,
        fileUploadSwitch: true,
        modalOpen: false,
        selectedServer: null,
        selectedDataverse: null
    }

    bulkRef2 = React.createRef();

    serverOnChange =(value) => {
        console.log(`selected ${value}`);
        // this.bulkRef1.current.setFieldsValue({
        //     dataverse: undefined,
        // })
        this.props.bulkPublishStore.serverOnChangeO2(value)
    }

    onFinish=()=>{
        this.props.bulkPublishStore.handleSubmit()
    }
    textOnchange=(e, type)=>{
        console.log(e.target.value)
        
        this.props.bulkPublishStore.textOnChangeO3(e.target.value, type)
    }
    
    render() {
        const { systemStore, authStore, bulkPublishStore } = this.props
        const serverList = authStore.serverList
        const columns = [
            {
                title: 'Dataset DOI',
                dataIndex: 'doi',
                width: '25%',
                ellipsis: true,
            },
            {
                title: 'Dataverse',
                dataIndex: 'server',
                width: '20%',
                ellipsis: true,
            },
            {
                title: 'Publish Type',
                dataIndex: 'type',
                width: '14%',
                render: (text, row, index) =>{
                    return text.toUpperCase();
                }
            },
            {
                title: 'Published S/F?',
                dataIndex: 'result',
                render: (text, row, index) => {
                    return (
                        text?text==="OK"?<OkSvg />:text:"Not yet published"
                    )
                }
                // render: (text, row, index) => {
                //     return (
                //         //bulkPublishStore.publishingDOIs.get(row.).result?bulkPublishStore.subDSMap.get(row.id).result==="OK"?<OkSvg />: bulkPublishStore.subDSMap.get(row.id).result:"Not yet published"

                //     )
                //   },
            }
        ];
        //console.log([...bulkPublishStore.publishingDOIsO3.values()].flat())
        
        return(
            <div style={{background: 'white', paddingTop:'3vh', paddingBottom:'2vh'}}>
                <div style={{ margin: 'auto'}}>
                    <Form
                        id="bulkPublish_3"
                        onFinish={this.onFinish}
                        layout="horizontal"
                    >
                        <Row>
                            <Col style={{boxShadow:'0 1px 4px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.1)'}} xs={{ span: 22, offset: 1 }} sm={{ span: 20, offset: 2 }} md={{ span: 18, offset: 3 }} lg={{ span: 16, offset: 4 }} xl={{ span: 14, offset: 5 }} xxl={{ span: 14, offset: 5 }}>
                                <Row style={{paddingTop: '5vh', paddingBottom: '3vh'}}>
                                    <Col span={10} offset={1} >
                                        <Row style={{paddingBottom:'2vh'}}>
                                            <Col span={24} style={{textAlign: 'center'}}>
                                                <span style={{fontSize:'medium',fontWeight:'bold'}}>MAJOR:</span>
                                            </Col>
                                            <Col span={24} style={{paddingTop: '3vh'}}>
                                                <TextArea 
                                                    rows={8}
                                                    //value={bulkPublishStore.textMajor}
                                                    placeholder="E.g. doi:10.4225/87/O4AIPZ"
                                                    onChange={e=>this.textOnchange(e, 'major')}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={10} offset={2}>
                                        <Row style={{paddingBottom:'2vh'}}>
                                            <Col span={24} style={{textAlign: 'center'}}>
                                                <span style={{fontSize:'medium',fontWeight:'bold'}}>MINOR:</span>
                                            </Col>
                                            <Col span={24} style={{paddingTop: '3vh'}}>
                                                <TextArea 
                                                    rows={8}
                                                    //value={bulkPublishStore.textMinor}
                                                    placeholder="E.g. doi:10.4225/87/O4AIPZ"
                                                    onChange={e=>this.textOnchange(e, 'minor')}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    {
                                        [...bulkPublishStore.publishingDOIsO3.values()].flat().length>0?
                                            <Col span={22} offset={1} style={{paddingTop: '5vh'}}>
                                                <Table
                                                    columns={columns}
                                                    dataSource={[...bulkPublishStore.publishingDOIsO3.values()].flat()}
                                                    loading={bulkPublishStore.isLoading}
                                                    rowKey={'doi'}
                                                />
                                            </Col>: null
                                    }
                                    
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <APIInput />
            </div>
        )
    }
}