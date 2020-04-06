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
import systemStore from "../../stores/systemStore";
import FinalResult from "./finalResult";
const { Dragger } = Upload;
const { Panel } = Collapse;

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class Adapt2 extends Component{

    state = {

        fileList: [],
        uploading: false,
        adaID: null,
        formdata:[],
        finalFiles: [],
        formReset:false,
        doi :null,
        returnedFiles:[]
    };

    // handleFormData = (form)=>{
    //     this.setState({
    //         formdata: form
    //     })
    // }
    clearResult=()=>{
        this.setState({
            finalFiles: [],
            adaID: null,
            doi :null,
            returnedFiles:[]
        })
    }
    handleUpload = (form) => {
        const { newDataset, server, dataverse, title, author, authorFields, email, description, subject, uploadSwitch } = form
        const { fileList } = this.state;
        console.log(authorFields)


        this.setState({
            formdata: form
        })

        let obj ={}
        let finalDemo = {}
        if (newDataset === false){
            obj = {
                //doi: null,
                newDataset: false,
                title: null,
                author: null,
                email: null,
                description: null,
                subject: null,
                server: null,
                dataverse: null,
                uploadSwitch: false,
                userid: toJS(this.props.authStore.currentUser).userID,

            }
        }
        else {
            const dataverseID = dataverse[1]
            let subjectIDs =[]
            for(let sub of subject){
                subjectIDs.push(sub[1])
            }
            obj = {
                //doi: doi,
                newDataset: newDataset,
                title: title,
                author: author,
                authorFields: authorFields,
                email: email,
                description: description,
                subject: subjectIDs,
                server: server,
                dataverse: dataverseID,
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
        ).then(res=>res.data)
            .then(json=>{
            if (json.success === true){
                console.log(json)
                this.setState({adaID: json.msg.adaid})
                const formData = new FormData();
                formData.set('adaid', json.msg.adaid)
                formData.set('userid', toJS(this.props.authStore.currentUser).userID)
                formData.set('datasetid', json.msg.dataset.id)
                formData.set('server', json.msg.dataverse)
                formData.set('uploadSwitch', uploadSwitch)
                formData.set('newDataset', newDataset)

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
                          this.setState({returnedFiles:data.files})
                          if (newDataset){
                              const datasetObj={
                                  datasetid:json.msg.dataset.id,
                                  server: server,
                                  userid:toJS(this.props.authStore.currentUser).userID
                              }
                              const jsonData = JSON.stringify(datasetObj);
                              axios.post(`${API_URL.QUERY_SITE}getDatasetInfo`, jsonData, {
                                      headers: {
                                          'Content-Type': 'application/json',
                                      }
                                  }
                              ).then(r=>r.data)
                                  .then(info=>{
                                      let doi = info.data.authority?info.data.authority+'/'+info.data.identifier:null
                                      this.setState({
                                          uploading: false,
                                          finalFiles: fileList,
                                          fileList: [],
                                          formReset: true,
                                          doi: doi
                                      });
                                      systemStore.handleFinalResultOpen(true)
                                  }).catch(err=>{
                                  if (err.response) {
                                      this.setState({
                                          uploading: false,
                                          finalFiles: fileList,
                                          fileList: [],
                                          formReset: true,

                                      });
                                      systemStore.handleFinalResultOpen(true)
                                  }
                              })
                          }
                            else{
                              this.setState({
                                  uploading: false,
                                  finalFiles: fileList,
                                  fileList: [],
                                  formReset: true,
                              });
                              systemStore.handleFinalResultOpen(true)
                          }


                      }
                      else{
                          this.setState({
                              uploading: false,
                              finalFiles: fileList,
                              fileList: [],
                              formReset: true
                          });
                          this.openNotificationWithIcon('error','files', data.msg.message)
                      }
                    }).catch(err=>{
                        console.log(err)
                    this.setState({
                        uploading: false,
                        finalFiles: fileList,
                        fileList: [],
                        formReset: true
                    });
                    this.openNotificationWithIcon('error','files', err)
                })
            }
        }).catch(err=>{
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                this.setState({
                    uploading: false,
                    finalFiles: fileList,
                    fileList: [],
                    formReset: true
                });
                if (err.response.status ===401){
                    const servers = toJS(this.props.authStore.serverList)
                    for (let serv of servers){
                        if (serv.alias === server){
                            this.props.systemStore.handleFailedAPI(serv.id, 2, err.response.data)
                            this.props.systemStore.handleAPIInputModal(true)
                        }
                    }

                }
                else {

                    this.openNotificationWithIcon('error','files', `${err.response.data.message}, please refresh the page and retry.`)
                }

            }

            else {
                this.setState({
                    uploading: false,
                    finalFiles: fileList,
                    fileList: [],
                    formReset: true
                })
                this.openNotificationWithIcon('error','files', `${err}, please refresh the page and retry.`)
            }

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
        const { uploading, fileList, formdata, finalFiles, formReset, adaID, doi, returnedFiles } = this.state;
        const { systemStore, authStore } = this.props
        console.log(formdata)
        console.log(finalFiles)
        console.log(fileList)
        console.log(systemStore.showfinalResult)
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
            <div style={{background: 'white', paddingTop:'2%'}}>
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
                        <DataverseForm handleFormData={this.handleUpload} files={fileList} formReset={formReset}/>
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

                    <FinalResult dataset={formdata} adaid={adaID} doi={doi} files={returnedFiles} clearResult={this.clearResult}/>
                </div>

            </div>
        );
    }
}