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
    @observable datasetPermissionValid = false
    @observable dataverseSubjects = []
    @observable showfinalResult = false
    @observable showfinalResultDVFiles = false
    @observable fileList=[]
    @observable selectedRowKeys = []
    @observable selectedRowNames = []
    @observable lastFileList=[]
    @observable doiValid=false
    @observable destinationDOIValid=false
    @observable doiMessage=null
    @observable destinationDOIMessage=null
    @observable isDoiLoading = false
    @observable isDestinationDoiLoading = false
    @observable finalResultDataset = {}
    @observable finalResultAdaid = null
    @observable finalResultDOI = null
    @observable finalResultLocalFiles = []
    @observable finalResultRemoteFiles = []
    @observable isADAFolderInfoLoading = false
    @observable adaFolderInfo = null
    @observable adaFolderInfoErrorMsg = null
    @observable localTargetKeys = []
    @observable remoteTargetKeys = []
    @observable copyRange = 1




    constructor() {
        this.init()
    }
    //
    @action async init(){
        await this.getDataverseSubjects()
    }
    @action setLocalKeys(key){
        this.localTargetKeys = key
    }
    @action setRemoteKeys(key){
        this.remoteTargetKeys = key
    }
    @action resetKeys(){
        let filteredLocalKeys = this.localTargetKeys.filter(ele=>!this.lastFileList.includes(ele))
        let filteredRemoteKeys = this.remoteTargetKeys.filter(ele=>!this.lastFileList.includes(ele))
        this.localTargetKeys = filteredLocalKeys
        this.remoteTargetKeys = filteredRemoteKeys
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
    @action setCopyRange(value){
        this.copyRange = value
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

    @action clearAdaFolderInfoErrorMsg(){
        this.adaFolderInfoErrorMsg = null
    }
    @action handleFinalResultDVFilesClose(){
        this.showfinalResultDVFiles = false

    }
    @action handleFinalResultOpen(dataset, adaid, doi, localFiles, remoteFiles, type){
        if (type === PERMISSION_CATEGORY.dvFiles){
            this.showfinalResultDVFiles = true
        }
        else {
            this.showfinalResult = true
        }

        this.finalResultDataset = dataset
        this.finalResultAdaid = adaid
        this.finalResultDOI = doi
        this.finalResultLocalFiles = localFiles
        this.finalResultRemoteFiles = remoteFiles
    }

    @action resetFileList(){
        console.log(toJS(this.lastFileList))
        let filteredList = this.fileList.filter(ele=>!this.lastFileList.includes(ele.filename)
        )
        console.log(filteredList)
        this.fileList = filteredList
        this.adaFolderInfoErrorMsg = null
        this.resetKeys()
        this.selectedRowKeys = []
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

    @action addFileToFileList(file){
        this.fileList = [...this.fileList, file]
    }
    @action deleteFileFromFileList(fileID, filename){
        console.log("deleting")
        console.log(fileID)
        const tempList = toJS(this.fileList)
        this.fileList = tempList.filter(file=> file.id !== fileID)
        this.localTargetKeys = this.localTargetKeys.filter(file=> file !== filename)
        this.remoteTargetKeys = this.remoteTargetKeys.filter(file=> file !== filename)
    }
    @action copyToolFileListOnChange(selectedRowKeys, selectedRows){
        this.selectedRowKeys = selectedRowKeys
        let fileNames = []
        for (let row of selectedRows){
            fileNames.push(row.filename)
        }
        this.selectedRowNames = fileNames
    }
    @action resetCopyToolSelectedRowKeys(){
        this.selectedRowKeys = []
    }
    @action regainCopyToolSelectedRowKeys(){
        let rowKeys = []
        for(let file of this.fileList){
            rowKeys.push(file.id)
        }
        this.selectedRowKeys = rowKeys
    }
    @action getFileListByDOI(doi, server, userid){
        console.log(server)
        const data = {
            doi: doi,
            server: server,
            userid: userid
        }
        this.isDoiLoading = true
        console.log("send request")
        return axios.post(API_URL.Get_Dataset_FileList_ByDOI, data)
            .then(action(res=>{
                console.log("got result")
                if (res.status ===201){

                    if (this.lastFileList.length >0){
                        console.log("this step")
                        let filteredList = this.fileList.filter(ele=>!this.lastFileList.includes(ele.filename))
                        this.fileList = [...filteredList, ...res.data.fileList]
                        //this.fileList = res.data
                        this.doiValid = true
                        let lastFiles = []
                        let fileNames = []
                        let rowKeys = []
                        for (let file of res.data.fileList){
                            lastFiles.push(file.filename)
                            fileNames.push(file.filename)
                            rowKeys.push(file.id)
                        }
                        this.selectedRowKeys = rowKeys
                        this.selectedRowNames = fileNames
                        this.lastFileList = lastFiles
                        return true
                    }
                    else {
                        console.log("that step")
                        let lastFiles = []
                        let rowKeys = []
                        let fileNames = []
                        for (let file of res.data.fileList){
                            rowKeys.push(file.id)
                            lastFiles.push(file.filename)
                            fileNames.push(file.filename)
                        }
                        this.selectedRowKeys = rowKeys
                        this.selectedRowNames = fileNames
                        this.lastFileList = lastFiles
                        this.fileList = [...this.fileList, ...res.data.fileList]
                        //this.fileList = res.data
                        this.doiValid = true
                        return true
                    }

                }
                else {
                    //this.fileList = []
                    this.doiValid = false
                    return false
                }
            })).catch(action(err=>{
                if (err.response) {
                    //this.fileList = []
                    this.doiValid = false
                    if (err.response.status ===404){
                        this.doiMessage = 'DOI not found'
                        //this.resetKeys()
                        this.resetFileList()
                    }
                    else if (err.response.status ===401){
                        this.doiMessage = 'No permission to view'
                        this.handleAPIInputErrorMsg(`${PERMISSION_CATEGORY.VIEW_UNPUBLISHED_DV.errorMsg} in doi:${doi} dataset.`)
                        this.handleAPIInputModal(true)
                        //this.resetKeys()
                        this.resetFileList()
                    }
                    else if (err.response.status ===402){
                        this.popupInputModal(server)
                        //this.resetKeys()
                        this.resetFileList()
                    }
                    else {
                        authStore.networkError = true
                        authStore.networkErrorMessage = err.response.data
                        //this.resetKeys()
                        this.resetFileList()
                    }
                }

            })).finally(()=>{
                this.isDoiLoading = false
                return false
            })

        // return fetch(API_URL.QUERY_SITE + `getDatasetFileListByDOI/${doi}/${server}`)
        //     .then(action(res => res.json()))
        //     .then(json=>console.log(json))
        //     .catch(err => err)
    }

    @action getFileListByDestinationDOI(doi, server, userid){
        console.log(server)
        const data = {
            doi: doi,
            server: server,
            userid: userid
        }
        this.isDestinationDoiLoading = true
        console.log("send request")
        return axios.post(API_URL.Get_Dataset_FileList_ByDOI, data)
            .then(action(res=>{
                console.log("got result")
                if (res.status ===201){

                    this.destinationDOIValid = true
                    return true

                }
                else {
                    //this.fileList = []
                    this.destinationDOIValid = false
                    return false
                }
            })).catch(action(err=>{
                if (err.response) {
                    //this.fileList = []
                    this.destinationDOIValid = false
                    if (err.response.status ===404){
                        this.destinationDOIMessage = 'DOI not found'
                    }
                    else if (err.response.status ===401){
                        this.destinationDOIMessage = 'No permission to view'
                        this.handleAPIInputErrorMsg(`${PERMISSION_CATEGORY.VIEW_UNPUBLISHED_DV.errorMsg} in doi:${doi} dataset.`)
                        this.handleAPIInputModal(true)
                        //this.resetKeys()
                        //this.resetFileList()
                    }
                    else if (err.response.status ===402){
                        this.popupInputModal(server)
                        //this.resetKeys()
                        //this.resetFileList()
                    }
                    else {
                        authStore.networkError = true
                        authStore.networkErrorMessage = err.response.data
                        //this.resetKeys()
                        //this.resetFileList()
                    }
                }

            })).finally(()=>this.isDestinationDoiLoading = false)

        // return fetch(API_URL.QUERY_SITE + `getDatasetFileListByDOI/${doi}/${server}`)
        //     .then(action(res => res.json()))
        //     .then(json=>console.log(json))
        //     .catch(err => err)
    }

    @action resetDestinationURL(){
        this.destinationDOIValid = false
        this.destinationDOIMessage = null
        this.isDestinationDoiLoading = false
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
                        console.log("404")
                        this.adaFolderInfoErrorMsg = 'DOI not found'

                    }
                    else if (err.response.status ===401){
                        this.adaFolderInfoErrorMsg = 'No permission to view'
                        this.handleAPIInputErrorMsg(`Sorry, you don't have permission to view the content.`)
                        this.handleAPIInputModal(true)

                    }
                    else if (err.response.status ===402){
                        console.log(err.response)
                        this.adaFolderInfoErrorMsg = 'No permission to view'
                        let serverid = err.response.data
                        this.popupInputModalByServerID(serverid)

                    }
                    else if (err.response.status ===405){
                        this.adaFolderInfoErrorMsg = 'Server info not found'

                    }
                    else {
                        this.adaFolderInfoErrorMsg = `Error, ${err.response.data}`
                        // authStore.networkError = true
                        // authStore.networkErrorMessage = err.response.data

                    }
                }

            })).finally(()=>{
                setTimeout(() => {
                    this.isADAFolderInfoLoading = false
                }, 1000)})
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
                console.log(res.data)
                if (res.data === false){
                    if (modalOpen){
                        console.log("permission false modalOpen")
                        // this.setCheck(server, dvID, permissionType)
                        //let servers = toJS(this.props.authStore.serverList)
                        this.dataversePermissionValid = false
                        this.handleAPIInputErrorMsg(`${PERMISSION_CATEGORY[permissionType].errorMsg} in ${dvName} dataverse.`)
                        this.handleAPIInputModal(true)
                    }
                    else {
                        console.log("permission false no modalOpen")
                        this.dataversePermissionValid = false
                        return false
                    }

                }
                else{
                    console.log("permission true")
                    this.dataversePermissionValid = true
                }
            })).catch(action(err=>{
                this.dataversePermissionValid = false
                if (err.response) {
                    if (err.response.status ===401){
                        console.log("permission 401 error")
                        this.setCheck(serverAlias, dvID, PERMISSION_CATEGORY[permissionType].type)
                        console.log(toJS(authStore.serverList))
                        console.log(serverAlias)
                        let servers = toJS(authStore.serverList)
                        for (let server of servers){
                            if (server.alias === serverAlias){
                                console.log("found server")
                                this.handleFailedAPI(server.id, 2, `Bad api key, please enter the correct one.`)
                                this.handleAPIInputModal(true)
                            }
                        }

                    }

                }

            })).finally(()=>this.isDoiLoading = false)

    }

    @action checkDSPermission(serverAlias, doi, permissionType, modalOpen){
        const data = {
            userid: toJS(authStore.currentUser).userID,
            server: serverAlias,
            doi: doi,
            request: PERMISSION_CATEGORY[permissionType].type
        }
        this.isDoiLoading = true
        return axios.post(API_URL.Check_DS_Permission, data)
            .then(action(res=>{
                if (res.data.permission === false){
                    if (modalOpen){
                        // this.setCheck(server, dvID, permissionType)
                        //let servers = toJS(this.props.authStore.serverList)
                        this.datasetPermissionValid = false
                        this.handleAPIInputErrorMsg(`${PERMISSION_CATEGORY[permissionType].errorMsg} ${res.data.dsName}.`)
                        this.handleAPIInputModal(true)
                    }
                    else {
                        this.datasetPermissionValid = false
                        return false
                    }

                }
                else{
                    this.datasetPermissionValid = true
                }
            })).catch(action(err=>{
                this.datasetPermissionValid = false
                if (err.response) {
                    if (err.response.status ===401){
                        this.setCheck(serverAlias, res.data.dsName, PERMISSION_CATEGORY[permissionType].type)
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