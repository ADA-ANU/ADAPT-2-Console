import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter } from 'react-router-dom';
import API_URL from '../../config'
import 'antd/es/spin/style/css';
import {Upload, Button, message, notification, Collapse, Popover, Col, Row, Anchor} from 'antd';
import { UploadOutlined, InboxOutlined, InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios'
import { toJS } from 'mobx'
import DataverseForm from "./dataverseForm";
import systemStore from "../../stores/systemStore";
import FinalResult from "./finalResult";
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Link } = Anchor;

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
    componentDidMount() {
        this.props.systemStore.handleFinalResultClose()
        this.props.systemStore.handleFinalResultDVFilesClose()
    }
    // handleFormData = (form)=>{
    //     this.setState({
    //         formdata: form
    //     })
    // }
    finalResult_New=React.createRef()
    clearResult=()=>{
        this.setState({
            finalFiles: [],
            adaID: null,
            doi :null,
            returnedFiles:[]
        })
    }
    handleUpload = (form) => {
        this.props.systemStore.handleFinalResultClose()
        const { newDataset, server, dataverse, title, authorFields, email, description, subject, uploadSwitch, firstName, lastName } = form
        const { fileList } = this.state;
        console.log(form)


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
            // let subjectIDs =[]
            // for(let sub of subject){
            //     subjectIDs.push(sub[1])
            // }
            obj = {
                //doi: doi,
                newDataset: newDataset,
                title: title,
                //author: author,
                author: `${lastName}, ${firstName}`,
                authorFields: authorFields,
                email: email,
                description: description,
                subject: subject,
                //subjectIDs
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


        axios.post(API_URL.AdaID, json, {
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
                formData.set('dataset', JSON.stringify(obj))
                formData.set('doi', json.msg.doi)

                fileList.forEach(file => {
                    formData.append('file', file);
                });
                axios({
                    url:API_URL.Create_ADAdataset,
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
                              axios.post(API_URL.Get_DatasetInfo, jsonData, {
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
                                          //formReset: true,
                                          doi: doi
                                      });
                                      systemStore.handleFinalResultOpen(this.state.formdata, this.state.adaID, this.state.doi, data.files)
                                      this.finalResult_New.scrollIntoView({behavior:'smooth'})
                                  }).catch(err=>{
                                  if (err.response) {
                                      this.setState({
                                          uploading: false,
                                          finalFiles: fileList,
                                          fileList: [],
                                          //formReset: true,

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
                                  //formReset: true,
                              });
                              systemStore.handleFinalResultOpen(this.state.formdata, this.state.adaID, this.state.doi, data.files)
                              this.finalResult_New.scrollIntoView({behavior:'smooth'})
                          }


                      }
                      else{
                          this.setState({
                              uploading: false,
                              finalFiles: fileList,
                              fileList: [],
                              //formReset: true
                          });
                          this.openNotificationWithIcon('error','files', data.msg.message)
                      }
                    }).catch(err=>{
                        console.log(err)
                    this.setState({
                        uploading: false,
                        finalFiles: fileList,
                        fileList: [],
                        //formReset: true
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
                    //formReset: true
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
                    //formReset: true
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
        <Popover placement="topLeft" content={content} arrowPointAtCenter>
        <InfoCircleOutlined
            onClick={event => {
                // If you don't want click extra trigger collapse, you can prevent this:
                event.stopPropagation();
            }}
        />
        </Popover>
    );
    handleAnchorClick = (e, link) => {
        e.preventDefault();
        console.log(link);
    };

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
        const content = <>
                            <div style={{paddingBottom:'1vh'}}>1. Create a new ADAID: Click Get ADAID button</div>
                            <div style={{paddingBottom:'1vh'}}>2. Create a new ADAID with files: Click or drag files to the uploading component and then click GetADAID button.</div>
                            <div style={{paddingBottom:'1vh'}}>3. Create a new DV dataset: Switch "Create new datase" to right and fill in the blanks below and then click GetADAID button.</div>
                            <div style={{paddingBottom:'1vh'}}>4. Create a new DV dataset with files: Switch "Create new datase" to right, fill in the blanks below, upload files through uploading component, switch "Upload files to dataverse" to right and then click GetADAID button.</div>
                        </>
        return (
            <div style={{background: 'white', paddingTop:'2%'}}>
                <div style={{ margin: 'auto'}}>
                    <Row>
                        <Col xs={{ span: 1, offset: 0 }} sm={{ span: 1, offset: 1 }} md={{ span: 1, offset: 1 }} lg={{ span: 2, offset: 2 }} xl={{ span: 2, offset: 3 }} xxl={{ span: 2, offset: 2 }}>
                            <Anchor
                                onClick={this.handleAnchorClick}
                                offsetTop={150}
                            >
                                <Link href="#uploadFiles" title="Upload Files (optional)"/>
                                <Link href="#Metadata" title="Metadata"/>
                                {
                                    systemStore.showfinalResult?
                                        <Link href="#finalResult" title="Final Result"/>: null
                                }
                                {/*<Link href="#components-anchor-demo-basic" title="Basic demo" />*/}
                            </Anchor>
                        </Col>
                        {/*<Col xs={{ span: 1, offset: 0 }} sm={{ span: 1, offset: 1 }} md={{ span: 1, offset: 1 }} lg={{ span: 2, offset: 2 }} xl={{ span: 2, offset: 3 }} xxl={{ span: 2, offset: 4 }}>*/}
                        {/*    <Anchor*/}
                        {/*        offsetTop={350}*/}
                        {/*    >*/}
                        {/*        <Popover placement="bottomRight" title={`Instruction`} content={content} overlayStyle={{ width: '50vw'}}>*/}
                        {/*            <Button>Instruction</Button>*/}
                        {/*        </Popover>*/}
                        {/*    </Anchor>*/}
                        {/*</Col>*/}
                        <Col xs={{ span: 20, offset: 1 }} sm={{ span: 20, offset: 0 }} md={{ span: 18, offset: 1 }} lg={{ span: 16, offset: 0 }} xl={{ span: 14, offset: 0 }} xxl={{ span: 14, offset: 1 }}>
                            <div style={{marginTop: '3%', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    form="createDataset"
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    //onClick={this.handleUpload}
                                    disabled={!systemStore.dataversePermissionValid}
                                    loading={uploading}
                                >
                                    {uploading ? 'Uploading' : 'Get ADAID'}
                                </Button>
                            </div>
                            <Collapse
                            defaultActiveKey={['1', '2']}
                            // onChange={callback}
                            // expandIconPosition={expandIconPosition}
                        >
                            <Panel header="Files" key="1" extra={this.extraInfo("Click or drag file(s) to this area to upload to the newly created ADA folder")}>
                                <div id="uploadFiles">
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">
                                            Both single and multiple file upload are supported.
                                        </p>
                                    </Dragger>
                                </div>
                            </Panel>
                            <Panel header="Dataset" key="2" extra={this.extraInfo("Create a dataset along with the ADAID and upload the files to that dataset")}>
                                <div id="Metadata">
                                    <DataverseForm handleFormData={this.handleUpload} files={fileList} formReset={formReset}/>
                                </div>

                            </Panel>

                        </Collapse>
                            <div style={{marginTop: '3%', paddingBottom: '3%', textAlign:'center'}}>
                                <Button
                                    form="createDataset"
                                    key="submit"
                                    htmlType="submit"
                                    type="primary"
                                    //onClick={this.handleUpload}
                                    disabled={!systemStore.dataversePermissionValid}
                                    loading={uploading}
                                >
                                    {uploading ? 'Uploading' : 'Get ADAID'}
                                </Button>
                            </div>
                            {/*dataset={formdata} adaid={adaID} doi={doi} files={returnedFiles}*/}
                            <div id="finalResult" ref={ref => {this.finalResult_New = ref}}>
                                {
                                    systemStore.showfinalResult?<FinalResult clearResult={this.clearResult}/>: null
                                }
                            </div>
                        </Col>
                    </Row>
                </div>

            </div>
        );
    }
}