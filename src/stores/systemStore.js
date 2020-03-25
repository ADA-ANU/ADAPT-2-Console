import { observable, action, computed, reaction, } from 'mobx';
import API_URL from '../config'

export class SystemStore{
    @observable networkError = false
    @observable networkErrorInfo = []
    @observable jsonValidationError = false
    @observable jsonValidationErrorInfo = []
    @observable serverList = []

    constructor() {
        this.init()
    }

    @action async init(){
        await this.getServerList()
    }
    @action cancleValidationError(){
        this.jsonValidationError = false
    }

    @action removeTempFile(fileName) {
        return fetch(API_URL.QUERY_SITE + `deleteImg/${fileName}`)
            .then(res => res.json())
            .catch(err => err)
        }

    @action getServerList() {
        return fetch(API_URL.QUERY_SITE + `getServerList`)
            .then(res => res.json())
            .then(json=>this.serverList= json)
            .catch(err => err)
    }

}

export default new SystemStore()