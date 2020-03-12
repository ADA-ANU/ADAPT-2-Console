import { observable, action, computed, reaction, } from 'mobx';
import API_URL from '../config'

export class SystemStore{
    @observable networkError = false
    @observable networkErrorInfo = []
    @observable jsonValidationError = false
    @observable jsonValidationErrorInfo = []

    @action cancleValidationError(){
        this.jsonValidationError = false
    }
}

export default new SystemStore()