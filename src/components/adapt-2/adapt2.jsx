import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import { Upload, Button, message, notification, Collapse, Popover,} from 'antd';
import { UploadOutlined, InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import DataverseForm from "./dataverseForm";
const { Dragger } = Upload;
const { Panel } = Collapse;

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class Adapt2 extends Component{

    state = {

        fileList: [],
        uploading: false,
        adaID: '',
        formdata:[],
        finalFiles: []

    };

    // handleFormData = (form)=>{
    //     this.setState({
    //         formdata: form
    //     })
    // }

    handleUpload = (form) => {
        const { newDataset, server, dataverse, title, author, authorFields, email, description, subject, uploadSwitch } = form
        const { fileList } = this.state;
        this.setState({
            formdata: form
        })

        let obj ={}
        if (newDataset === false){
            obj = {
                //doi: null,
                title: null,
                author: null,
                email: null,
                description: null,
                subject: null,
                server: null,
                dataverse: null,
                uploadSwitch: false,
                userid: toJS(this.props.authStore.currentUser).userID
            }
        }
        else {
            obj = {
                //doi: doi,
                newDataset: newDataset,
                title: title,
                author: author,
                authorFields: authorFields,
                email: email,
                description: description,
                subject: subject,
                server: server,
                dataverse: dataverse,
                uploadSwitch: uploadSwitch,
                userid: toJS(this.props.authStore.currentUser).userID
            }
        }

        const json = JSON.stringify(obj);

        this.setState({
            uploading: true,
        });

        // You can use any AJAX library you like
        axios.post(`${API_URL.QUERY_SITE}adaID`, json, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(res=>{
            if (res.status ===201){
                console.log(res)
                return res.data
            }
            else if (res.status === 401){

            }
        }).then(json=>{
            if (json.success === true){
                console.log(json)
                this.setState({adaID: json.msg.adaid.adaID})
                const formData = new FormData();
                formData.set('adaid', json.msg.adaid.adaID)
                formData.set('userid', toJS(this.props.authStore.currentUser).userID)
                formData.set('datasetid', json.msg.dataset.id)
                formData.set('server', json.msg.dataverse)
                formData.set('uploadSwitch', uploadSwitch)

                fileList.forEach(file => {
                    formData.append('file', file);
                });
                axios({
                    url:`${API_URL.QUERY_SITE}createADAdataset`,
                    method: 'post',
                    data: formData,
                    config: { headers: {'Content-Type': 'multipart/form-data' }}
                }).then(res=>res.data)
                  .then(data=>{
                      console.log(data)
                      if (data.success ===true){
                          console.log("recovering")
                          this.setState({
                              uploading: false,
                              finalFiles: fileList,
                              fileList: []
                          });
                      }
                      else{
                          this.setState({
                              uploading: false,

                          });
                          this.openNotificationWithIcon('error','files', data.msg.message)
                      }
                    }).catch(err=>{
                        console.log(err)
                    this.openNotificationWithIcon('error','files', err)
                })
            }
        }).catch(err=>{
            this.openNotificationWithIcon('error','files', err)
        })


    };

    openNotificationWithIcon = (type,fileName,error) => {
        if (type === 'success'){
            notification[type]({
                message: 'Successful',
                description:
                    `You have successfully uploaded file ${fileName}`,
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
    extraInfo = (content) => (
        <Popover placement="topLeft" content={content} trigger="click" arrowPointAtCenter>
        <InfoCircleOutlined
            onClick={event => {
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
            }}
        />
        </Popover>
    );


    render() {
        const { uploading, fileList, formdata, finalFiles } = this.state;
        console.log(formdata)
        console.log(finalFiles)
        console.log(fileList)

        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            multiple: true,
            listType: 'picture',
            beforeUpload: file => {
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            },
            fileList,
        };
        return (
            <div style={{background: 'white'}}>
                <div style={{width: '50%', margin: 'auto'}}>
                <Collapse
                    defaultActiveKey={['1', '2']}
                    // onChange={callback}
                    // expandIconPosition={expandIconPosition}
                >
                    <Panel header="Files" key="1" extra={this.extraInfo("Select files to upload to ADA directory")}>
                        <div >
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Both single and multiple file uploading are supported.
                                </p>
                            </Dragger>
                        </div>
                    </Panel>
                    <Panel header="Dataset" key="2" extra={this.extraInfo("Create a dataset on dataverse")}>
                        <DataverseForm handleFormData={this.handleUpload}/>
                    </Panel>

                </Collapse>
                    <div style={{marginTop: '3%', paddingBottom: '3%', textAlign:'center'}}>
                        <Button
                            form="createDataset"
                            key="submit"
                            htmlType="submit"
                            type="primary"
                            //onClick={this.handleUpload}
                            // disabled={fileList.length === 0}
                            loading={uploading}
                        >
                            {uploading ? 'Uploading' : 'Go'}
                        </Button>
                    </div>
                </div>

            </div>
        );
    }
}