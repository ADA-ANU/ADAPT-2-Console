import React, {Component, useState} from 'react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import {Result, Button, Typography, Form, Input, Popover, Modal, Collapse, Tag} from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import {inject, observer} from "mobx-react";
import {toJS} from "mobx";
import axios from 'axios'
const { Panel } = Collapse;
const { Paragraph, Text } = Typography;

@inject('routingStore', 'systemStore', 'authStore')
@observer

export default class FinalResult extends Component{

    handleCloseFinalResult=()=>{
        this.props.systemStore.handleFinalResultOpen(false)
        this.props.clearResult()

    }
    render(){
        const { systemStore, authStore, dataset, adaid, files, doi } = this.props
        const { server, dataverse, title, author, authorFields, email, description, subject, uploadSwitch } = dataset
        const dataverseName = dataverse?dataverse[0]:''
        const serverList = toJS(authStore.serverList)
        let serverURL = null
        for (let serve of serverList){
            if (serve.alias === server){
                serverURL = serve.url
            }
        }
        const url = doi !==null && doi !== undefined && serverURL !== null && serverURL !== undefined?serverURL+'dataset.xhtml?persistentId=doi:'+doi: null
        return(
            <Modal
                visible={systemStore.showfinalResult}
                maskClosable={false}
                closable={false}
                centered
                footer={null}
                width='30%'
            >
                <Result
                    status="success"
                    title="Submission Successful"
                    subTitle="Please check your submission details below."
                    extra={[
                        <Button type="primary" key="console" onClick={this.handleCloseFinalResult}>
                            OK
                        </Button>
                    ]}
                >
                    <div className="desc">
                        <Paragraph>
                            <Text
                                strong
                                style={{
                                    fontSize: 16,
                                }}
                            >
                                ADAID: {adaid? adaid:''}

                            </Text>
                        </Paragraph>
                        <Paragraph>
                            Dataset Link: {
                                doi !== null && doi !==undefined?
                                    <a href={url} target="_blank">Click Here</a>
                                    :'Failed to get the link.'

                            }

                        </Paragraph>
                        <Paragraph>
                            Dataset DOI: {doi}
                        </Paragraph>
                        <Paragraph>
                            Dataset Status: Draft
                        </Paragraph>
                        <Paragraph>
                            <Collapse>
                                <Panel header="Dataset information" key="1">
                                    <p>Server: {server?server:''}</p>
                                    <p>Dataverse: {dataverseName}</p>
                                    <p>Title: {title?title:''}</p>
                                    <p>Author: {author && authorFields?author +', '+authorFields.map(field=>field.name).join(', '):''}</p>
                                    <p>Email: {email?email:''}</p>
                                    <p>Description: {description?description:''}</p>
                                    <p>Subject: {subject?subject.map(sub=><Tag color="success">{sub[0]}</Tag>):''}</p>
                                </Panel>
                            </Collapse>
                        </Paragraph>
                        <Paragraph>
                            {/*<CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet*/}
                            {/*eligible to apply <a>Apply Unlock &gt;</a>*/}
                            <ol>
                                {
                                    files && files.length>0?<Text
                                        strong
                                        style={{
                                            fontSize: 16,
                                        }}
                                    >
                                        File List:

                                    </Text>:''
                                }
                                {
                                    files && files.length>0?files.map(file=>
                                        <li>{file}</li>
                                    ):''
                                }
                            </ol>
                        </Paragraph>
                    </div>
                </Result>

            </Modal>

        )
    }

}