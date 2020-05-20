import {observable, action, computed, reaction, toJS,} from 'mobx';
import API_URL from '../config'
import PERMISSION_CATEGORY from '../permissionConfig'
import axios from 'axios'
import {inject, observer} from "mobx-react";
import authStore from "./authStore";


export class SystemStore{
    @observable networkError = false
    @observable networkErrorInfo = []
    @observable jsonValidationError = false
    @observable jsonValidationErrorInfo = []
    @observable apiInputOpen = false
    @observable apiInputErrorMsg = null
    @observable failedAPI = []
    @observable checkServerAlias = null
    @observable checkDVID = null
    @observable checkPermissionType = null
    @observable dataversePermissionValid = true
    @observable dataverseSubjects = []
    @observable showfinalResult = false
    @observable showfinalResultDVFiles = false
    @observable fileList=[]
    @observable doiValid=false
    @observable doiMessage=null
    @observable isDoiLoading = false
    @observable finalResultDataset = {}
    @observable finalResultAdaid = null
    @observable finalResultDOI = null
    @observable finalResultFiles = []
    @observable isADAFolderInfoLoading = false
    @observable adaFolderInfo = null
    @observable adaFolderInfoErrorMsg = null


    constructor() {
        this.init()
    }
    //
    @action async init(){
        await this.getDataverseSubjects()
    }

    @action setCheck(server, dvID, permissionType){
        this.checkServerAlias = server
        this.checkDVID = dvID
        this.checkPermissionType = permissionType
    }
    @action resetApiInputErrorMsg(){
        this.apiInputErrorMsg = null
    }
    @action cancleValidationError(){
        this.jsonValidationError = false
    }

    @action removeTempFile(fileName) {
        return fetch(API_URL.Delete_Img + `${fileName}`)
            .then(action(res => res.json()))
            .catch(err => err)
        }

    @action handleAPIInputModal(open) {
        this.apiInputOpen = open
    }
    @action handleAPIInputErrorMsg(msg) {
        this.apiInputErrorMsg = msg
    }
    @action handleFailedAPI (api, type, msg){
        this.failedAPI.push({id:api, type:type, msg:msg})
    }
    @action clearFailedAPI(){
        this.failedAPI = []
        this.resetApiInputErrorMsg()
    }
    @action getDataverseSubjects(){
        return fetch(API_URL.Get_Subjects)
            .then(action(res => res.json()))
            .then(json=>this.dataverseSubjects = json)
            .catch(err => err)
    }
    @action handleFinalResultClose(){
        this.showfinalResult = false

    }
    @action handleFinalResultDVFilesClose(){
        this.showfinalResultDVFiles = false

    }
    @action handleFinalResultOpen(dataset, adaid, doi, files, type){
        if (type === PERMISSION_CATEGORY.dvFiles){
            this.showfinalResultDVFiles = true
        }
        else {
            this.showfinalResult = true
        }

        this.finalResultDataset = dataset
        this.finalResultAdaid = adaid
        this.finalResultDOI = doi
        this.finalResultFiles = files
    }

    @action resetFileList(){
        this.fileList = []
    }

    @action popupInputModal(serverAlias){
        let servers = toJS(authStore.serverList)
        for (let server of servers){
            if (server.alias === serverAlias){
                console.log(server)
                this.handleFailedAPI(server.id, 2, `Bad api key, please enter the correct one.`)
                this.handleAPIInputModal(true)
            }
        }
    }
    @action popupInputModalByServerID(id){

        this.handleFailedAPI(id, 2, `Bad api key, please enter the correct one.`)
        this.handleAPIInputModal(true)
    }

    @action getFileListByDOI(doi, server, userid){
        console.log(server)
        const data = {
            doi: doi,
            server: server,
            userid: userid
        }
        this.isDoiLoading = true
        return axios.post(API_URL.Get_Dataset_FileList_ByDOI, data)
            .then(action(res=>{
                if (res.status ===201){
                    this.fileList = res.data
                    this.doiValid = true
                    return true
                }
                else {
                    this.fileList = []
                    this.doiValid = false
                    return false
                }
            })).catch(action(err=>{
                if (err.response) {
                    this.fileList = []
                    this.doiValid = false
                    if (err.response.status ===404){
                        this.doiMessage = 'DOI not found'

                    }
                    else if (err.response.status ===401){
                        this.doiMessage = 'No permission to view'
                        this.handleAPIInputErrorMsg(`${PERMISSION_CATEGORY.VIEW_UNPUBLISHED_DV.errorMsg} in doi:${doi} dataset.`)
                        this.handleAPIInputModal(true)

                    }
                    else if (err.response.status ===402){
                        this.popupInputModal(server)

                    }
                    else {
                        authStore.networkError = true
                        authStore.networkErrorMessage = err.response.data

                    }
                }

            })).finally(()=>this.isDoiLoading = false)

        // return fetch(API_URL.QUERY_SITE + `getDatasetFileListByDOI/${doi}/${server}`)
        //     .then(action(res => res.json()))
        //     .then(json=>console.log(json))
        //     .catch(err => err)
    }

    @action getDatasetInfoByADAID(adaid, userid){
        const data = {
            adaid: adaid,
            userid: userid
        }
        this.isADAFolderInfoLoading = true
        return axios.post(API_URL.getADAFolderInfo, data)
            .then(action(res=>{
                if (res.status ===201){
                    this.adaFolderInfoErrorMsg = null
                    console.log(res.data)
                    this.adaFolderInfo = res.data
                }
            })).catch(action(err=>{
                this.adaFolderInfo = null
                if (err.response) {

                    if (err.response.status ===404){
                        this.adaFolderInfoErrorMsg = 'DOI not found'

                    }
                    else if (err.response.status ===401){
                        this.adaFolderInfoErrorMsg = 'No permission to view'
                        this.handleAPIInputErrorMsg(`Sorry, you don't have permission to view the content.`)
                        this.handleAPIInputModal(true)

                    }
                    else if (err.response.status ===402){
                        let serverid = err.response.data
                        this.popupInputModalByServerID(serverid)

                    }
                    else {
                        authStore.networkError = true
                        authStore.networkErrorMessage = err.response.data

                    }
                }

            })).finally(()=>this.isADAFolderInfoLoading = false)
    }
    @action handlePermission(value){
        this.dataversePermissionValid = value
    }
    @action checkDVPermission(serverAlias, dvID, dvName, permissionType, modalOpen){
        const data = {
            userid: toJS(authStore.currentUser).userID,
            server: serverAlias,
            dataverse: dvID,
            request: PERMISSION_CATEGORY[permissionType].type
        }
        this.isDoiLoading = true
        return axios.post(API_URL.Check_DV_Permission, data)
            .then(action(res=>{
                if (res.data === false){
                    if (modalOpen){
                        // this.setCheck(server, dvID, permissionType)
                        //let servers = toJS(this.props.authStore.serverList)
                        this.dataversePermissionValid = false
                        this.handleAPIInputErrorMsg(`${PERMISSION_CATEGORY[permissionType].errorMsg} in ${dvName} dataverse.`)
                        this.handleAPIInputModal(true)
                    }
                    else {
                        this.dataversePermissionValid = false
                        return false
                    }

                }
                else{
                    this.dataversePermissionValid = true
                }
            })).catch(action(err=>{
                this.dataversePermissionValid = false
                if (err.response) {
                    if (err.response.status ===401){
                        this.setCheck(serverAlias, dvID, PERMISSION_CATEGORY[permissionType].type)
                        let servers = toJS(authStore.serverList)
                        for (let server of servers){
                            if (server.alias === serverAlias){
                                this.handleFailedAPI(server.id, 2, `Bad api key, please enter the correct one.`)
                                this.handleAPIInputModal(true)
                            }
                        }

                    }

                }

            })).finally(()=>this.isDoiLoading = false)

    }




}

export default new SystemStore()