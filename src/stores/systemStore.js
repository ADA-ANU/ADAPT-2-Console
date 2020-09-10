import {observable, action, computed, reaction, toJS,} from 'mobx';
import API_URL from '../config'
import PERMISSION_CATEGORY from '../permissionConfig'
import axios from 'axios'
import {inject, observer} from "mobx-react";
import authStore from "./authStore";
import adapt2Store from "./adapt2Store";


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
    @observable adaFolderFileList = []
    @observable duplicateFileList = []
    @observable checkGroupValue = []
    @observable sortedFileList = new Map()
    @observable localSelectedKeys = new Map()
    @observable remoteSelectedKeys = new Map()
    @observable testCheck = []
    @observable regexPrefix = /^[0-9]_$/
    @observable localCheckStatus = new Map()
    @observable remoteCheckStatus = new Map()
    @observable userUploadedFiles = []
    @observable uploadedFiles = []
    @observable returnedURL = null
    @observable existingShellDS = false




    constructor() {
        this.init()
    }
    //
    @action async init(){
        await this.getDataverseSubjects()
    }
    @action setLocalKeys(key){
        this.localTargetKeys = key
        this.detectDuplicateFiles(key, this.adaFolderFileList)
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


    @action resetUploadedFileList(){
        this.fileList = []
        this.localTargetKeys = []
        this.remoteTargetKeys = []
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

    @action addFileToFileList(file, actualFile){
        this.fileList = [...this.fileList, file]
        this.userUploadedFiles = [...this.userUploadedFiles, file]
        this.uploadedFiles = [...this.uploadedFiles, actualFile]
        this.sortFile(file, 'add')
        adapt2Store.handleFileSwitch(true, 'local')

    }
    @action deleteFileFromFileList(fileID, filename){
        console.log("deleting")
        console.log(fileID)
        const tempList = toJS(this.fileList)
        this.fileList = tempList.filter(file=> file.id !== fileID)
        // this.localTargetKeys = this.localTargetKeys.filter(file=> file !== filename)
        // this.remoteTargetKeys = this.remoteTargetKeys.filter(file=> file !== filename)
        const prefix = this.getPrefix(filename)
        console.log(prefix)
        let newList = this.sortedFileList.get(prefix).filter(file=>file.filename !== filename)
        this.sortedFileList.set(prefix, newList)
        if(newList.length ===0){
            if(this.testCheck.indexOf(prefix) !== -1) {
                this.testCheck.splice(this.testCheck.indexOf(prefix), 1);
            }
        }
        // let remoteNewList = this.sortedFileList.get(prefix).filter(file=>file.filename !== filename)
        // this.sortedFileList.set(prefix, remoteNewList)
        if(this.localSelectedKeys.get(prefix)){
            let newKeys = this.localSelectedKeys.get(prefix).filter(file=>file.filename !== filename)
            console.log(newKeys)
            this.localSelectedKeys.set(prefix, newKeys)
        }
        if(this.remoteSelectedKeys.get(prefix)){
            let newKeys = this.remoteSelectedKeys.get(prefix).filter(file=>file.filename !== filename)
            this.remoteSelectedKeys.set(prefix, newKeys)
        }
        const userUploadListTemp = this.userUploadedFiles.filter(ele=>ele.id !== fileID)
        this.userUploadedFiles = userUploadListTemp
    }
    @action switchOff(ele){
        if(ele==='local'){
            this.localSelectedKeys.clear()
            const prefixes = [...this.localCheckStatus.keys()]
            prefixes.map(prefix=>{
                this.updateCheckStatus(prefix, false, false, 'local')
                }
            )
        }
        if(ele==='remote'){
            this.remoteSelectedKeys.clear()
            const prefixes = [...this.remoteCheckStatus.keys()]
            prefixes.map(prefix=>{
                    this.updateCheckStatus(prefix, false, false, 'remote')
                }
            )
        }
    }
    @action handleCheckOnchange(isChecked, prefix, ele){
        if(isChecked){
            if(ele==='local'){
                this.updateCheckStatus(prefix, false, true, 'local')
                this.localSelectedKeys.set(prefix, this.sortedFileList.get(prefix))
            }
            else if(ele==='remote'){
                this.updateCheckStatus(prefix, false, true, 'remote')
                this.remoteSelectedKeys.set(prefix, this.sortedFileList.get(prefix))
            }

        }
        else{
            if(ele==='local'){
                this.updateCheckStatus(prefix, false, false, 'local')
                this.localSelectedKeys.delete(prefix)
            }
            else if(ele ==='remote'){
                this.updateCheckStatus(prefix, false, false, 'remote')
                this.remoteSelectedKeys.delete(prefix)
            }

        }
    }
    // @action CheckGroupOnChange(value){
    //     this.checkGroupValue = value
    //         this.testSelectedKeys.clear()
    //         let selectedKeys =[]
    //         for(let ele of value){
    //             this.testSelectedKeys.set(ele, this.testFileList.get(ele))
    //             selectedKeys.push(this.testFileList.get(ele))
    //         }
    //         // console.log(toJS(selectedKeys))
    //         // this.testRowKeys = selectedKeys
    // }
    @action getCheckStatus(prefix, ele){
        if(ele ==='local'){
            return this.localCheckStatus.get(prefix)
        }
        else if(ele==='remote'){
            return this.remoteCheckStatus.get(prefix)
        }

    }
    @action updateCheckStatus(prefix, indeterminate, checked, ele){
        if(ele ==='local'){
            this.localCheckStatus.set(prefix, {indeterminate: indeterminate, checked: checked})
        }
        else if(ele==='remote'){
            this.remoteCheckStatus.set(prefix, {indeterminate: indeterminate, checked: checked})
        }
    }
    @action updateCheckStatusWithNewPrefix(prefix){
        console.log("prefix ``````````````````")
        if(this.localSelectedKeys.get(prefix)){
            console.log([...this.sortedFileList.get(prefix)].length, [...this.localSelectedKeys.get(prefix)].length)
            if([...this.sortedFileList.get(prefix)].length === [...this.localSelectedKeys.get(prefix)].length){
                this.updateCheckStatus(prefix, false, true, 'local')
            }
            else{
                this.updateCheckStatus(prefix, true, false, 'local')
            }
        }
        else{
            this.updateCheckStatus(prefix, false, false, 'local')
        }

        // if(this.localCheckStatus.get(prefix)){
        //     // if(this.localCheckStatus.get(prefix).checked ===true){
        //     if(this.sortedFileList.get(prefix).length === this.localSelectedKeys.get(prefix).length){
        //         this.updateCheckStatus(prefix, false, true, 'local')
        //     }
        //     else{
        //         this.updateCheckStatus(prefix, true, false, 'local')
        //     }
        //     // }
        // }
        // else{
        //     //this.updateCheckStatus(prefix, false, false, 'local')
        //     if(this.sortedFileList.get(prefix).length === this.localSelectedKeys.get(prefix).length){
        //         this.updateCheckStatus(prefix, false, true, 'local')
        //     }
        //     else{
        //         this.updateCheckStatus(prefix, true, false, 'local')
        //     }
        // }
        if(this.remoteSelectedKeys.get(prefix)){
            if([...this.sortedFileList.get(prefix)].length === [...this.remoteSelectedKeys.get(prefix)].length){
                this.updateCheckStatus(prefix, false, true, 'remote')
            }
            else{
                this.updateCheckStatus(prefix, true, false, 'remote')
            }
        }
        else{
            this.updateCheckStatus(prefix, false, false, 'remote')
        }
        // if(this.remoteCheckStatus.get(prefix)){
        //     console.log("prefix detected in remoteCheck")
        //     console.log(this.remoteCheckStatus.get(prefix))
        //     if(this.remoteCheckStatus.get(prefix).checked ===true){
        //
        //         this.updateCheckStatus(prefix, true, false, 'remote')
        //     }
        // }
        // else{
        //     this.updateCheckStatus(prefix, false, false, 'remote')
        // }
        console.log(this.remoteCheckStatus.get(prefix))
        console.log(this.localCheckStatus.get(prefix))
    }
    @action isFullSelected(prefix, ele){
        if(ele==='local'){
            return [...this.localSelectedKeys.get(prefix)].length === [...this.sortedFileList.get(prefix)].length
        }
        else if(ele ==='remote'){
            return [...this.remoteSelectedKeys.get(prefix)].length === [...this.sortedFileList.get(prefix)].length
        }
    }
    @action isFullDeselected(prefix, ele){
        if(ele==='local'){
            return !this.localSelectedKeys.get(prefix) || [...this.localSelectedKeys.get(prefix)].length === 0
        }
        else if(ele ==='remote'){
            return !this.remoteSelectedKeys.get(prefix) || [...this.remoteSelectedKeys.get(prefix)].length === 0
        }

    }
    @action localAddRowKey(row, selected){
        const rowKey  = row.filename
        let prefix = this.regexPrefix.test(rowKey.slice(0, 2))?rowKey.slice(0, 2): 'other'
        console.log(prefix)
        if(selected){
            if(this.localSelectedKeys.has(prefix)){
                console.log("key found")
                this.localSelectedKeys.set(prefix, [...this.localSelectedKeys.get(prefix), row])
            }
            else{
                console.log("key not found")
                //this.testCheck = [...this.testCheck, prefix]
                this.localSelectedKeys.set(prefix, [row])
            }
        }
        else{
            console.log("deselect checkbox", rowKey)
            let files = [...this.localSelectedKeys.get(prefix)]
            console.log(files)
            const result = files.filter(ele=>ele.filename !==rowKey)

            //console.log(bbb.length)
            this.localSelectedKeys.set(prefix, result)
        }

        if(this.isFullSelected(prefix, 'local')){
            this.updateCheckStatus(prefix, false, true, 'local')
        }
        else if(this.isFullDeselected(prefix, 'local')){
            this.updateCheckStatus(prefix, false, false, 'local')
        }
        else{
            this.updateCheckStatus(prefix, true, false, 'local')
        }

    }
    @action remoteAddRowKey(row, selected){
        const rowKey  = row.filename
        let prefix = this.regexPrefix.test(rowKey.slice(0, 2))?rowKey.slice(0, 2): 'other'
        console.log(prefix)
        if(selected){
            if(this.remoteSelectedKeys.has(prefix)){
                console.log("key found")
                this.remoteSelectedKeys.set(prefix, [...this.remoteSelectedKeys.get(prefix), row])
            }
            else{
                console.log("key not found")
                //this.testCheck = [...this.testCheck, prefix]
                this.remoteSelectedKeys.set(prefix, [row])
            }
        }
        else{
            console.log("deselect checkbox", rowKey)
            let files = [...this.remoteSelectedKeys.get(prefix)]
            console.log(files)
            const result = files.filter(ele=>ele.filename !==rowKey)

            //console.log(bbb.length)
            this.remoteSelectedKeys.set(prefix, result)
        }

        if(this.isFullSelected(prefix, 'remote')){
            this.updateCheckStatus(prefix, false, true, 'remote')
        }
        else if(this.isFullDeselected(prefix, 'remote')){
            this.updateCheckStatus(prefix, false, false, 'remote')
        }
        else{
            this.updateCheckStatus(prefix, true, false, 'remote')
        }

    }
    @action prefixFilter(prefix1, prefix2){
        let result = []
        if(!prefix2){
            for(let file of this.fileList){
                if(file.filename.slice(0, 2) === `${prefix1}_`){
                    result.push(file.filename)
                }
            }
        }
        else{
            for(let file of this.fileList){
                if(file.filename.slice(0, 2) === `${prefix1}_` || `${prefix2}_`){
                    result.push(file.filename)
                }
            }
        }

        this.selectedRowKeys = result
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
    @action getPrefix(filename){
        let prefix = filename.slice(0,2)
        if(!this.regexPrefix.test(prefix)){
            prefix = 'other'
        }
        return prefix
    }
    @action resetAll(){
        this.dataversePermissionValid = true
        this.datasetPermissionValid = false
        this.doiMessage=null
        this.isDoiLoading = false

        this.finalResultDataset = {}
        this.finalResultAdaid = null
        this.finalResultDOI = null
        this.finalResultLocalFiles = []
        this.finalResultRemoteFiles = []
        this.adaFolderInfoErrorMsg = null

        this.adaFolderFileList = []
        this.duplicateFileList = []
        this.sortedFileList = new Map()
        this.localSelectedKeys = new Map()
        this.remoteSelectedKeys = new Map()
        this.testCheck = []

        this.localCheckStatus = new Map()
        this.remoteCheckStatus = new Map()
        this.userUploadedFiles = []
        this.uploadedFiles = []
        this.returnedURL = null
        this.existingShellDS = false
    }
    @action removeSelectedDOIFiles(newFileList){
        this.localSelectedKeys = new Map()
        this.remoteSelectedKeys = new Map()

        //this.testCheck =[]
        //this.sortFileList(newFileList)
        //const currentLocalKeys = this.localSelectedKeys
        //const currentRemoteKeys = this.remoteSelectedKeys


        // const localKeys = [...this.localSelectedKeys.keys()]
        // localKeys.map(key=>{
        //     const localTemp = this.localSelectedKeys.get(key).filter(file=>file.type && file.type==='local')
        //     //console.log(key, selectedKeys)
        //     if(localTemp.length>0){
        //         this.localSelectedKeys.set(key, localTemp)
        //         if(this.localCheckStatus.get(key).checked){
        //             if(this.localSelectedKeys.get(key).length !== localTemp.length){
        //                 this.updateCheckStatus(key, true, false, 'local')
        //             }
        //         }
        //     }
        //     else{
        //         this.localSelectedKeys.delete(key)
        //         const newPrefixes = this.testCheck.filter(item => item!==key)
        //         this.testCheck = newPrefixes
        //     }
        // })
        //
        // const remoteKeys = [...this.remoteSelectedKeys.keys()]
        // remoteKeys.map(key=>{
        //     const remoteTemp = this.remoteSelectedKeys.get(key).filter(file=>file.type && file.type==='local')
        //     if(remoteTemp.length>0){
        //         this.remoteSelectedKeys.set(key, remoteTemp)
        //         if(this.remoteSelectedKeys.get(key).checked){
        //             if(this.remoteSelectedKeys.get(key).length !== remoteTemp.length){
        //                 this.updateCheckStatus(key, true, false, 'remote')
        //             }
        //         }
        //     }
        //     else{
        //         this.remoteSelectedKeys.delete(key)
        //         const newPrefixes = this.testCheck.filter(item => item!==key)
        //         this.testCheck = newPrefixes
        //     }
        // })


        // const localSelectedFiles = [...this.localSelectedKeys.keys()]
        // localSelectedFiles.map(file=>{
        //
        // })



        // this.testCheck.map(prefix => {
        //     if (!this.localSelectedKeys.get(prefix) || this.localSelectedKeys.get(prefix).length === 0) {
        //         const newPrefixes = this.testCheck.filter(item => item !== prefix)
        //         this.testCheck = newPrefixes
        //     }
        // })

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
        //this.adaFolderInfo = null
        console.log("removeSelectedDOIFiles")
        this.removeSelectedDOIFiles(filteredList)
    }
    @action sortFile(file, type){
        let prefix = file.filename.slice(0,2)
        if(!this.regexPrefix.test(prefix)){
            prefix = 'other'
        }

        if(!this.testCheck.includes(prefix)){
            this.testCheck= [...this.testCheck, prefix]
            this.sortedFileList.set(prefix, [file])

        }
        else{
            this.sortedFileList.set(prefix, [file, ...this.sortedFileList.get(prefix)])
        }
        if(type && type ==='add'){
            if(this.localSelectedKeys.get(prefix)){
                this.localSelectedKeys.set(prefix, [file, ...this.localSelectedKeys.get(prefix)])
            }
            else{
                this.localSelectedKeys.set(prefix, [file])
            }
        }
        this.updateCheckStatusWithNewPrefix(prefix)
    }
    @action sortFileList(fileList){
        console.log(fileList)
        this.fileList = []
        let prefixes = []
        this.testCheck =[]
        //const preSortedArray = [...this.sortedFileList.keys()]
        this.sortedFileList.clear()
        this.removeSelectedDOIFiles(this.userUploadedFiles)
        for(let file of this.userUploadedFiles){
            this.sortFile(file)
            this.fileList.push(file)
        }
        //this.removeSelectedDOIFiles(this.userUploadedFiles)
        this.fileList = [...this.fileList, ...fileList]

        for(let file of fileList){
            let prefix = file.filename.slice(0,2)
            if(!this.regexPrefix.test(prefix)){
                prefix = 'other'
            }
            if(!prefixes.includes(prefix)){
                prefixes.push(prefix)
            }
            if(this.sortedFileList.get(prefix)){
                this.sortedFileList.set(prefix, [...this.sortedFileList.get(prefix), file])
            }
            else{
                this.sortedFileList.set(prefix, [file])
            }
            // else{
            //     this.sortedFileList.set(prefix, [...this.sortedFileList.get(prefix), file])
            // }
        }
        for(let prefix of prefixes){
            console.log(prefix)
            this.localCheckStatus.set(prefix, {indeterminate: false, checked: false})
            this.remoteCheckStatus.set(prefix, {indeterminate: false, checked: false})
            if(!this.testCheck.includes(prefix)){
                this.testCheck = [...this.testCheck, prefix]
            }

        }


        console.log(this.testCheck)
        // this.localCheckStatus.clear()
        // this.remoteCheckStatus.clear()
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
                    console.log(res.data.fileList)
                    this.sortFileList(res.data.fileList)
                    console.log("----------------------")
                    if (this.lastFileList.length >0){
                        console.log("this step")
                        let filteredList = this.fileList.filter(ele=>!this.lastFileList.includes(ele.filename))
                        //this.fileList = [...filteredList, ...res.data.fileList]
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
                        //this.fileList = [...this.fileList, ...res.data.fileList]
                        //this.fileList = res.data
                        this.doiValid = true
                        return true
                    }

                }
                else {
                    //this.fileList = []
                    this.doiValid = false
                    if(adapt2Store.copyMetadata){
                        this.resetDVForm()
                        adapt2Store.copyMetadata = false
                    }
                    return false
                }
            })).catch(action(err=>{
                if (err.response) {
                    //this.fileList = []
                    this.doiValid = false
                    if(adapt2Store.copyMetadata){
                        this.resetDVForm()
                        adapt2Store.copyMetadata = false
                    }

                    if (err.response.status ===404){
                        this.doiMessage = 'DOI not found'
                        //this.resetKeys()
                        //this.resetFileList()
                        this.sortFileList([])
                    }
                    else if (err.response.status ===401){
                        this.doiMessage = 'No permission to view'
                        this.handleAPIInputErrorMsg(`${PERMISSION_CATEGORY.VIEW_UNPUBLISHED_DV.errorMsg} in doi:${doi} dataset.`)
                        this.handleAPIInputModal(true)
                        //this.resetKeys()
                        //this.resetFileList()
                        this.sortFileList([])
                    }
                    else if (err.response.status ===402){
                        this.popupInputModal(server)
                        //this.resetKeys()
                        //this.resetFileList()
                        this.sortFileList([])
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

    @action detectDuplicateFiles(array1, array2){
        let duplicates = array1.filter((val)=> {
            return array2.indexOf(val) != -1;
        });
        this.duplicateFileList = duplicates
    }
    @action resetReturnedURL(){
        this.returnedURL = null
    }
    @action resetDVForm(){
        adapt2Store.setDVFormServer(undefined)
        this.returnedURL = null
        this.adaFolderInfoErrorMsg = null
        adapt2Store.dvFormRef.current.setFieldsValue({
            server: undefined,
            dataverse: undefined,
            subject: undefined,
            title: undefined,
            firstName: undefined,
            lastName: undefined,
            email: undefined,
            description: undefined,
            authorFields: undefined

        })
    }
    @action presetDVForm(form){
        const { dataverse, server, author, authorFields, description, email, subject, title} = form
        let subjectNames = subject.map(sub=>{
            for(let subEle of this.dataverseSubjects){
                if(subEle.id ===sub){
                    return subEle.subjectname
                }
            }
        })
        let authors = authorFields.map(ele=>{
            const firstname = ele.name.split(', ')[1]
            const lastname = ele.name.split(', ')[0]
            return {firstName: firstname, lastName: lastname}
        })
        const firstName = author.split(", ")[1]
        const lastName = author.split(", ")[0]
        console.log(authors)
        adapt2Store.setDVFormServer(server)
        adapt2Store.dvFormRef.current.setFieldsValue({
            server: server,
            dataverse: dataverse,
            subject: subjectNames,
            title: title,
            firstName: firstName,
            lastName: lastName,
            email: email,
            description: description,
            authorFields: authors

        })
    }

    @action getDatasetInfoByADAID(adaid, userid){
        const data = {
            adaid: adaid,
            userid: userid
        }
        this.isADAFolderInfoLoading = true
        return axios.post(API_URL.getADAFolderInfo, data)
            .then(action(res=>{
                console.log(res.data)
                if (res.status ===201){
                    this.existingShellDS = true
                    this.adaFolderInfoErrorMsg = null
                    //console.log(res.data)
                    this.adaFolderInfo = res.data
                    this.returnedURL = res.data.url
                    adapt2Store.handleNewDatasetSwitch(false)
                    this.presetDVForm(res.data)
                    //console.log(res.data.adaFolderContent)
                    this.adaFolderFileList = res.data.adaFolderContent
                    this.detectDuplicateFiles(res.data.adaFolderContent, this.localTargetKeys)
                }
            })).catch(action(err=>{
                this.adaFolderInfo = null
                console.log(err)
                this.existingShellDS = false
                this.resetDVForm()
                if (err.response) {
                    console.log(err.response)
                    this.adaFolderFileList = err.response.data.adaFolderContent
                    this.detectDuplicateFiles(err.response.data.adaFolderContent, this.localTargetKeys)
                    if (err.response.status ===404){
                        console.log("404")
                        this.adaFolderInfoErrorMsg = err.response.data.msg?err.response.data.msg:'DOI not found'
                        adapt2Store.handleNewDatasetSwitch(true)

                    }
                    else if (err.response.status ===401){
                        this.adaFolderInfoErrorMsg = 'No permission to view'
                        this.handleAPIInputErrorMsg(`Sorry, you don't have permission to view the content.`)
                        this.handleAPIInputModal(true)

                    }
                    else if (err.response.status ===402){
                        console.log(err.response)
                        this.adaFolderInfoErrorMsg = 'No permission to view'
                        let serverid = err.response.data.msg
                        this.popupInputModalByServerID(serverid)

                    }
                    else if (err.response.status ===405){
                        this.adaFolderInfoErrorMsg = 'Server info not found'

                    }
                    else {
                        this.adaFolderInfoErrorMsg = `Error, ${err.response.data.msg}`
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