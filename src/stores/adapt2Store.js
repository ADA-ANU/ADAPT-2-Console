import {observable, action, computed, reaction, toJS,} from 'mobx';
import API_URL from '../config'
import PERMISSION_CATEGORY from '../permissionConfig'
import axios from 'axios'
import {inject, observer} from "mobx-react";
import authStore from "./authStore";
import systemStore from "./systemStore";
import {notification} from "antd";
import React from "react";


export class adapt2Store{

    @observable selection = 1
    @observable isLoading = false
    @observable ShowFinalResult = false
    @observable newFinalFiles = []
    @observable newFileList = []
    @observable newFormData = {}
    @observable existFinalFiles = []
    @observable existFileList = []
    @observable adapt2Ref = React.createRef();
    @observable createDataset = false
    @observable doiServer = null
    @observable doi = null

    // constructor() {
    //
    //     this.adapt2Ref = React.createRef();
    //
    // }
    scrollToMyRef = () => window.scrollTo(0, this.adapt2Ref.current.offsetTop)
    @action setDoiServer(server){
        this.doiServer = server
    }
    @action setDoi(doi){
        this.doi = doi
    }
    @action handleNewDatasetSwitch(value){
        this.createDataset = value
    }
    @action SelectionOnChange(value){

        this.selection = value
    }
    @action handleSubmit(){
        console.log("submit")
        if(this.selection ===1){
            const obj = {
                newDataset: false,
                title: null,
                author: null,
                email: null,
                description: null,
                subject: null,
                server: null,
                dataverse: null,
                uploadSwitch: false,
                userid: authStore.currentUser.userID,
                type: 'new'
            }
            const json = JSON.stringify(obj);
            this.isLoading = true
            axios.post(API_URL.AdaID, json, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            ).then(action(res=>{
                console.log(res.data)
                systemStore.handleFinalResultOpen({}, res.data.msg.adaid)
                //this.adapt2Ref.scrollIntoView({behavior:'smooth'})
                //this.scrollToMyRef()
                this.adapt2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            })).catch(err=>{
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);
                    this.openNotificationWithIcon('error','files', `${err.response.data}, please refresh the page and retry.`)
                }
                else {
                    this.openNotificationWithIcon('error','files', `${err}, please refresh the page and retry.`)
                }


            }).finally(action(()=>{
                this.isLoading = false
            }))
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
                message: 'Submission Failed',
                description:
                    `${error}`,
                duration: 0,
            });
        }

    };
}

export default new adapt2Store()