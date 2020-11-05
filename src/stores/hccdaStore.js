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
    
    scrollToMyRef = () => window.scrollTo(0, this.adapt2Ref.current.offsetTop)
    @action reset(){
        //this.subDSs = []
        this.publishType = new Map()
        this.subDSMap = new Map()
    }
    @action dropDownOnChange(value, name){
        if(name === 'state') this.state = value
        else if(name === 'year') this.year = value
        else if(name === 'type') this.type = value
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