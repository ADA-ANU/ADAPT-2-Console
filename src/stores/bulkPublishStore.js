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
    
    scrollToMyRef = () => window.scrollTo(0, this.adapt2Ref.current.offsetTop)
    @action SelectionOnChange(value){
        this.selection = value
    }

    @action serverOnChange(value){
        this.selectedServer = value
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