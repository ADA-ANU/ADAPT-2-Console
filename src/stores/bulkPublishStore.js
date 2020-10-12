import {observable, action, computed, reaction, toJS,} from 'mobx';
import API_URL from '../config'
import PERMISSION_CATEGORY from '../permissionConfig'
import axios from 'axios'
import {inject, observer} from "mobx-react";
import authStore from "./authStore";
import systemStore from "./systemStore";
import {notification} from "antd";
import React from "react";


export class bulkPublishStore{

    @observable selection = 1
    @observable isLoading = false
    @observable selectedServer = undefined
    @observable selectedDVID = undefined
    @observable subDSs = []
    @observable publishType = new Map()
    
    scrollToMyRef = () => window.scrollTo(0, this.adapt2Ref.current.offsetTop)
    @action SelectionOnChange(value){
        this.selection = value
    }

    @action serverOnChange(value){
        this.selectedServer = value
    }

    @action dvOnChange(value){
        this.selectedDVID = value
    }

    @action getSubDSs(server, dvID){
        this.isLoading = true
        const data = {
            userID: authStore.currentUser.userID,
            server: server,
            dvID: dvID
        }
        const jsonData = JSON.stringify(data);
        axios.post(API_URL.getSubDSs, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(action(res=>{
            console.log(res.data)
            this.subDSs = res.data
            //systemStore.handleFinalResultOpen({}, res.data.msg.adaid)
            //this.adapt2Ref.scrollIntoView({behavior:'smooth'})
            //this.scrollToMyRef()
            //this.adapt2Ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

    @action handlePublishType(dsID, type){
        console.log(dsID, type)
        //this.publishType.set(dsID, type)
        if(type){
            // if(this.publishType.has(dsID)){
            //     this.publishType.delete(dsID)
            // }
            this.publishType.set(dsID, type)
        }
        else{
            this.publishType.delete(dsID)
        }
    }

    @action handleClick(record, selected){
        if(selected){
            // if(this.publishType.has(record.id)){
            //     this.publishType.delete(record.id)
            // }
            this.publishType.set(record.id, "major")
        }
        else {
            this.publishType.delete(record.id)
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

export default new bulkPublishStore()