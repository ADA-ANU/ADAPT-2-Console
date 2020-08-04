import {observable, action, computed, reaction, toJS,} from 'mobx';
import API_URL from '../config'
import PERMISSION_CATEGORY from '../permissionConfig'
import axios from 'axios'
import {inject, observer} from "mobx-react";
import authStore from "./authStore";
import systemStore from "./systemStore";


export class adapt2Store{
    @observable Selection = 1
    @observable isLoading = false
    @observable ShowFinalResult = false
    @observable newFinalFiles = []
    @observable newFileList = []
    @observable newFormData = {}
    @observable existFinalFiles = []
    @observable existFileList = []

    @action SelectionOnChange(value){

        this.Selection = value
    }
    @action HandleSubmit(){
        console.log("submit")
        if(this.Selection ===1){
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
            }
            const json = JSON.stringify(obj);
            this.isLoading = true
            axios.post(API_URL.AdaID, json, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            ).then(res=>res.data)
                .then(json=>{
                    if (json.success === true){
                        console.log(json)
                        const formData = new FormData();
                        formData.set('adaid', json.msg.adaid)
                        formData.set('userid', authStore.currentUser.userID)
                        formData.set('datasetid', json.msg.dataset.id)
                        formData.set('server', json.msg.dataverse)
                        formData.set('uploadSwitch', uploadSwitch)
                        formData.set('newDataset', newDataset)
                        formData.set('dataset', JSON.stringify(obj))
                        formData.set('doi', json.msg.doi)

                        this.newFileList.forEach(file => {
                            formData.append('file', file);
                        });
                    }
                }).catch(err=>{
                if (err.response) {
                    console.log(err.response.data);
                    console.log(err.response.status);
                    console.log(err.response.headers);

                    this.newFinalFiles = this.newFileList
                    this.newFileList = []
                    this.isLoading = false
                    if (err.response.status ===401){
                        const servers = authStore.serverList
                        for (let serv of servers){
                            if (serv.alias === this.newFormData.server){
                                systemStore.handleFailedAPI(serv.id, 2, err.response.data)
                                systemStore.handleAPIInputModal(true)
                            }
                        }

                    }
                    else {

                        this.openNotificationWithIcon('error','files', `${err.response.data.message}, please refresh the page and retry.`)
                    }

                }

                else {
                    this.newFinalFiles = this.newFileList
                    this.newFileList = []
                    this.isLoading = false
                    this.openNotificationWithIcon('error','files', `${err}, please refresh the page and retry.`)
                }

            })
        }
    }
}

export default new adapt2Store()