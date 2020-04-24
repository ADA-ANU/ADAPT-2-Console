import { observable, action, computed, reaction, } from 'mobx';
import API_URL from '../config'
import axios from 'axios'

export class SystemStore{
    @observable networkError = false
    @observable networkErrorInfo = []
    @observable jsonValidationError = false
    @observable jsonValidationErrorInfo = []
    @observable apiInputOpen = false
    @observable failedAPI = []
    @observable dataverseSubjects = []
    @observable showfinalResult = false
    @observable fileList=[]
    @observable doiValid=false
    @observable isDoiLoading = false


    constructor() {
        this.init()
    }
    //
    @action async init(){
        await this.getDataverseSubjects()
    }
    @action cancleValidationError(){
        this.jsonValidationError = false
    }

    @action removeTempFile(fileName) {
        return fetch(API_URL.QUERY_SITE + `deleteImg/${fileName}`)
            .then(action(res => res.json()))
            .catch(err => err)
        }

    @action handleAPIInputModal(open) {
        this.apiInputOpen = open
    }
    @action handleFailedAPI (api, type, msg){
        this.failedAPI.push({id:api, type:type, msg:msg})
    }
    @action clearFailedAPI(){
        this.failedAPI = []
    }
    @action getDataverseSubjects(){
        return fetch(API_URL.QUERY_SITE + `getSubjects`)
            .then(action(res => res.json()))
            .then(json=>this.dataverseSubjects = json)
            .catch(err => err)
    }
    @action handleFinalResultOpen(open){
        this.showfinalResult = open
    }
    @action getFileListByDOI(doi, server){
        const data = {
            doi: doi,
            server: server
        }
        this.isDoiLoading = true
        return axios.post(API_URL.QUERY_SITE+'getDatasetFileListByDOI', data)
            .then(action(res=>{
                if (res.status ===201){
                    this.fileList = res.data
                    this.doiValid = true
                }
                else {
                    this.fileList = []
                    this.doiValid = false
                }
            })).catch(action(err=>{
                if (err.response) {
                    this.fileList = []
                    this.doiValid = false
                    // if (err.response.status ===404){
                    //     this.doiValid = false
                    // }
                }

            })).finally(()=>this.isDoiLoading = false)

        // return fetch(API_URL.QUERY_SITE + `getDatasetFileListByDOI/${doi}/${server}`)
        //     .then(action(res => res.json()))
        //     .then(json=>console.log(json))
        //     .catch(err => err)
    }
    @action resetFileList(){

        this.fileList = []

    }




}

export default new SystemStore()