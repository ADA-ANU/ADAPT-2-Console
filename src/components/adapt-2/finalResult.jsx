import React, {Component, useState} from 'react';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import {Result, Button, Typography, Form, Input, Popover, Modal, Collapse, Tag, List, Descriptions, Badge} from 'antd';
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
        const { server, dataverse, title, author, authorFields, email, description, subject, uploadSwitch, newDataset } = dataset

        const serverList = toJS(authStore.serverList)
        let data =[]
        let serverURL = null
        for (let serve of serverList){
            if (serve.alias === server){
                serverURL = serve.url
            }
        }
        const url = doi !==null && doi !== undefined && serverURL !== null && serverURL !== undefined?serverURL+'dataset.xhtml?persistentId=doi:'+doi: null

        if (newDataset){
            data.push({title:'Server', result:server?server.toUpperCase():''})
            data.push({title:'Dataverse', result:dataverse?dataverse[0]:''})
            data.push({title:'Title', result:title?title:''})
            data.push({title:'Authors', result:author?authorFields?author +', '+authorFields.map(field=>field.name).join(', '):author:''})
            data.push({title:'Email', result:email?email:''})
            data.push({title:'Description', result:description?description:''})
            data.push({title:'Subjects', result:subject?subject.map(sub=><Tag color="success">{sub[0]}</Tag>):''})
        }

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
                        {
                            newDataset?
                                <>
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

                                    <Collapse>
                                        <Panel header="Dataset information" key="1">
                                            <Descriptions
                                                //title="Responsive Descriptions"
                                                bordered
                                                layout='vertical'
                                                //column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                                            >
                                                {data.map(item=>
                                                    <Descriptions.Item label={item.title}>{item.result}</Descriptions.Item>
                                                )}

                                            </Descriptions>
                                        </Panel>
                                    </Collapse>

                                </>
                                :null
                        }

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
                                    files && files.length>0?files.map(file=>{
                                        let beforePath = file.path.split('/')[1]
                                        let afterPath = `./${beforePath}/${file.originalname}`
                                        return(
                                            <li><p>{file.originalname}</p>
                                                <p>{`Path: ${afterPath}`}</p>
                                            </li>
                                        )
                                        }

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