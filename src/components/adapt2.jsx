import React, {Component, useState} from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, withRouter, Link } from 'react-router-dom';
import API_URL from '../config'
import 'antd/es/spin/style/css';
import { Upload, Button, message, notification } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
const { Dragger } = Upload;

@inject('routingStore', 'systemStore', 'authStore')
@observer
export default class Adapt2 extends Component{

        state = {

            files: [],
            uploading: false,

        };


    setFileInfo=(file)=>{

        this.setState({
            files: [...this.state.files, file]
        })
    }
    onChange=(info)=> {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }

        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            if( info.file.response){
                const f ={
                    uid: info.file.uid,
                    originalName: info.file.name,
                    fileName: info.file.response[0].filename,
                    path: info.file.response[0].path
                }
                this.setFileInfo(f)
            }
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    onRemove=(dFile)=>{
        console.log(dFile)
        this.removeFile(dFile)

    }
    removeFile=(dFile)=>{
        const deletedFile = this.state.files.filter(file=>file.uid === dFile.uid)
        const newFiles = this.state.files.filter(file=>file.uid !== dFile.uid)
        console.log(deletedFile)
        if(deletedFile.length>0){
            const fileName = deletedFile[0].fileName
            this.props.systemStore.removeTempFile(fileName)
                .then(res=>{
                    if (res.success && res.success === true){
                        this.setState({
                            files: newFiles
                        })
                        //this.openNotificationWithIcon('success', dFile.name, null)
                        message.success(`${dFile.name} file deleted successfully.`);
                    }
                    else {
                        this.openNotificationWithIcon('error', dFile.name, res)
                        //message.error(`${dFile.name} file deleted unsuccessfully, ${res}.`);
                    }
                })
        }

    }
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


    render() {
        return (
            <div style={{background: 'white'}}>
                <div style={{width: '30%', margin: 'auto'}}>
                    <Dragger
                        name='file'
                        action={API_URL.QUERY_SITE+'uploadFiles'}
                        multiple={true}
                        onChange={this.onChange}
                        onRemove={this.onRemove}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload.
                        </p>
                    </Dragger>
                </div>
            </div>
        );
    }
}