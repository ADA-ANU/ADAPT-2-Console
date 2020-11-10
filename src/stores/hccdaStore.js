import {observable, action, computed, reaction, toJS,} from 'mobx';
import API_URL from '../config'
import PERMISSION_CATEGORY from '../permissionConfig'
import axios from 'axios'
import {inject, observer} from "mobx-react";
import authStore from "./authStore";
import systemStore from "./systemStore";
import {notification} from "antd";
import React from "react";


export class hccdaStore{

    @observable isLoading = false
    @observable data = undefined
    @observable types = undefined
    @observable state = undefined
    @observable year = undefined
    @observable type = undefined
    @observable imageCheckMsg = undefined
    @observable imageExisting = false
    @observable hccdaRef = React.createRef();
    
    scrollToMyRef = () => window.scrollTo(0, this.adapt2Ref.current.offsetTop)
    @action reset(){
        //this.subDSs = []
        this.publishType = new Map()
        this.subDSMap = new Map()
    }
    @action dropDownOnChange(value, name){
        if(name === 'state') {
            this.state = value
            if (this.year && this.type){
                this.checkHccdaImages()
            }
        }
        else if(name === 'year') {
            this.year = value
            if (this.state && this.type){
                this.checkHccdaImages()
            }
        }
        else if(name === 'type') {
            this.type = value
            if (this.year && this.state){
                this.checkHccdaImages()
            }
        }
        else openNotificationWithIcon('warning', '', 'Invalid input')

    }
    @action getData(){
        this.isLoading = true
        axios.get(API_URL.getHCCDAdata)
        .then(action(res=>{
            console.log(res.data)
            this.data = res.data.states
            this.types = res.data.types
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

    @action checkHccdaImages(){
        this.isLoading = true
        const data = {
            state: this.state,
            year: this.year,
            suffix: this.type,
        }
        //console.log(data.publishArray)
        //const jsonData = JSON.stringify(data);
        axios.post(API_URL.checkHccdaImages, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(action(res=>{
            console.log(res.data)
            if(res.data.existing){
                this.imageExisting = true
                this.imageCheckMsg = `Requested file exists at ${res.data.path}`
            }
            else if(this.type ==='1'){
                this.imageExisting = false
                this.imageCheckMsg = `Requested file doesn't exist, it will be generated and then uploaded to Dataverse Test`
            }
            else {
                this.imageExisting = false
                this.imageCheckMsg = `Requested file doesn't exist, it will be generated and then placed in HCCDA folder on D10`
            }
            
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

    @action handleSubmit(){
        this.isLoading = true
        const data = {
            state: this.state,
            year: this.year,
            suffix: this.type,
            userid: authStore.currentUser.userID
        }
        //console.log(data.publishArray)
        //const jsonData = JSON.stringify(data);
        axios.post(API_URL.getHccdaImages, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(action(res=>{
            console.log(res.data)
            this.imageCheckMsg = undefined
            const remoteFiles = this.type ==='1'?[res.data.file]: undefined
            systemStore.handleFinalResultOpen(res.data, undefined, undefined, undefined, remoteFiles)
            this.hccdaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    
    openNotificationWithIcon = (type,fileName,error) => {
        if (type === 'success'){
            notification[type]({
                message: 'Successful',
                description:
                    `You have successfully uploaded file ${fileName}`,
            });
        }
        else if(type === 'error'){
            notification[type]({
                message: 'Submission Failed',
                description:
                    `${error}`,
                duration: 0,
            });
        }
        else {
            notification['warning']({
                message: 'Warning',
                description:
                    `${error}`,
                duration: 0,
            });
        }

    };
}

export default new hccdaStore()