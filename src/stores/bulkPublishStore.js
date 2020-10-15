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
    @observable selectedDVName = undefined
    //@observable subDSs = new Map()
    @observable publishType = new Map()
    @observable subDSMap = new Map()
    @observable selectedServerO2 = undefined
    @observable textMajor = []
    @observable textMinor = []
    @observable publishingDOIs = new Map()
    
    scrollToMyRef = () => window.scrollTo(0, this.adapt2Ref.current.offsetTop)
    @action reset(){
        //this.subDSs = []
        this.publishType = new Map()
        this.subDSMap = new Map()
    }
    @action SelectionOnChange(value){
        this.selection = value
        this.reset()
    }

    @action serverOnChange(value){
        this.selectedServer = value
        this.reset()
    }

    @action serverOnChangeO2(value){
        this.selectedServerO2 = value
        this.resetO2()
    }

    @action textOnChangeO2(array, type){
        
        const format = array.replace(/(?:(?!\n)\s)/g, '').split(/\r?\n/)
        if(format[0] === ''){
            this.publishingDOIs.delete(type)
        }
        else{
            let dois = []
            for (let doi of format){
                if(this.hasDuplicates(dois.map(ele=>ele.doi), doi, type)){
                    console.log("duplicate found: ", doi)
                    this.openNotificationWithIcon('duplicate', 'files', `Duplicate found: ${doi}.`)
                }
                else dois.push({doi: doi, type: type})
            }
            this.publishingDOIs.set(type, dois)
        }
    }
    hasDuplicates(array, ele, type) {
        if(array.filter(item => item == ele).length >0) return true
        else{
            if(type ==='major'){
                //console.log(this.publishingDOIs.get('minor') && this.publishingDOIs.get('minor'))
                if(this.publishingDOIs.get('minor') && this.publishingDOIs.get('minor').filter(item => item.doi == ele).length >0) return true
                else return false
            }
            else{
                //console.log(this.publishingDOIs.get('major') && this.publishingDOIs.get('major'))
                if(this.publishingDOIs.get('major') && this.publishingDOIs.get('major').filter(item => item.doi == ele).length >0) return true
                else return false
            }
        }
    }
    @action resetO2(){

    }

    @action dvOnChange(value, label){
        this.selectedDVID = value
        this.selectedDVName = label
        this.reset()
    }

    submitCheck(){
        if (this.selection ===1){
            if(!this.selectedServer || !this.selectedDVID || [...this.publishType.keys()].length===0) return true
            else return false
        }
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
            
            for(let ds of res.data){
                this.subDSMap.set(ds.id, {id: ds.id, title: ds.title, doi: ds.doi, version: ds.version})
            }
            //this.subDSs = res.data
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
            if(this.publishType.has(dsID)){
                this.publishType.delete(dsID)
            }
            this.publishType.set(dsID, type)
        }
        else{
            this.publishType.delete(dsID)
        }
    }

    @action handleClick(record, selected){
        if(selected){
            if(this.publishType.has(record.id)){
                this.publishType.delete(record.id)
            }
            this.publishType.set(record.id, "major")
        }
        else {
            this.publishType.delete(record.id)
        }
    }

    @action handleSubmit(){
        if(this.selection ===1){
            this.handleSubmit_Option1()
        }
        else if(this.selection ===2){
            this.handleSubmit_Option2()
        }
    }
    @action handleSubmit_Option1(){
        this.isLoading = true
        let newPublish = new Map(this.publishType)
        for (const [key, value] of newPublish.entries()){
            const data = this.subDSMap.get(key)
            const newValue = {type: value, doi: data.doi, version: data.version, title: data.title}
            newPublish.set(key, newValue)
        }
        // console.log(newPublish)
        // console.log(this.publishType)
        const data = {
            userID: authStore.currentUser.userID,
            server: this.selectedServer,
            publishArray: Object.fromEntries(newPublish.entries()),
            dvName: this.selectedDVName
        }
        //console.log(data.publishArray)
        const jsonData = JSON.stringify(data);
        axios.post(API_URL.publishOption1, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(action(res=>{
            console.log(res.data)
            for(let ds of res.data.data){
                console.log(ds)
                if(ds.id){
                    let dataset = this.subDSMap.get(parseInt(ds.id))
                    console.log(dataset)
                    dataset['result'] = ds.status
                    this.subDSMap.set(parseInt(ds.id), dataset)
                }
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

    @action handleSubmit_Option2(){
        this.isLoading = true
        const data = {
            userID: authStore.currentUser.userID,
            server: this.selectedServerO2,
            publishArray: Object.fromEntries(this.publishingDOIs.entries()),
            // majorArray: this.textMajor,
            // minorArray: this.textMinor
        }
        //console.log(data.publishArray)
        const jsonData = JSON.stringify(data);
        axios.post(API_URL.publishOption2, jsonData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        ).then(action(res=>{
            console.log(res.data)
            for(let data of res.data.data){
                console.log(data)
                if(data.doi){
                    let dois = this.publishingDOIs.get(data.type)
                    dois.find(ele=>ele.doi === data.doi)['result'] = data.status
                    console.log(dois)
                    this.publishingDOIs.set(data.type, dois)
                    console.log(this.publishingDOIs.get(data.type))
                }
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
            notification['error']({
                message: 'Warning',
                description:
                    `${error}`,
                duration: 0,
            });
        }

    };
}

export default new bulkPublishStore()