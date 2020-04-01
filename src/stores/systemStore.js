import { observable, action, computed, reaction, } from 'mobx';
import API_URL from '../config'

export class SystemStore{
    @observable networkError = false
    @observable networkErrorInfo = []
    @observable jsonValidationError = false
    @observable jsonValidationErrorInfo = []
    @observable apiInputOpen = false
    @observable failedAPI = []
    @observable dataverseSubjects = []


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
    @action handleFailedAPI (api, type){
        this.failedAPI.push({id:api, type:type})
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



}

export default new SystemStore()