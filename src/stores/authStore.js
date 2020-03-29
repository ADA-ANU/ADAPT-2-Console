import { observable, action, computed, reaction, createTransformer, toJS } from 'mobx';
import API_URL from '../config'


class AuthStore {
    @observable currentUser = {};
    @observable loginErrorMessage = ''
    @observable aafLoginUrl = 'https://rapid.test.aaf.edu.au/jwt/authnrequest/research/sr3HM5tqO9SC3suYKNF9iQ'
    @observable networkError = false
    @observable networkErrorMessage = ''
    @observable siteLoading = false
    @observable isUserLoggedIn
    @observable serverList = []
    //@observable isLoading = false;
    //@observable errors = undefined;
    //@observable ws = undefined;
    //@observable ns = observable.map();
    // @observable notifications = [];
    //@observable notifications = observable.map();
    // @observable notifiTypes = [
    //     "Order payment has been verified by Admin.",
    //     "Order has been canceled by QA.",
    //     "Order status has been modified by Admin.",
    //     "Order has been assigned to Counsellor by Admin.",
    //     "Order has been assigned to QA by Admin.",
    //     "Unread message",
    //     "Error!"
    // ]

    constructor() {
        // reaction(
        //     () => this.token,
        //     token => {
        //         if (token) {
        //             window.localStorage.setItem('jwt', token);
        //         } else {
        //             window.localStorage.removeItem('jwt');
        //         }
        //     }
        // );
        this.init()
    }

    @action authenticate(){
        return fetch(API_URL.QUERY_SITE+'authenticate', {credentials: 'include'})
            .then(action(res=>res.json()))
            .then(action(json=>{
                if(json.success===true){
                    this.isUserLoggedIn = true
                    this.currentUser = json.user
                    return this.getServerList(json.user.userID)
                        .then(action(res=>{
                            return true
                        }))

                    // fetch(API_URL.QUERY_SITE + `getServerList/${json.user.userID}`)
                    //     .then(res => res.json())
                    //     .then(json=>{
                    //         this.serverList= json
                    //         return true
                    //     }).catch(err => err)

                }
                else {
                    this.isUserLoggedIn = false
                    this.loginErrorMessage = json.msg
                    return false
                }
            }))
    }

    @action loadSite(){
        return fetch(API_URL.QUERY_SITE+'site')
            .then(action(res=>{
                //console.log(res.status)
                if (res.status === 200){
                    this.networkError = false
                }
                else {
                    this.networkError = true
                }
            }))
            .catch(err=>{
                this.networkError = true
                this.networkErrorMessage = err
            })
    }
    @action getServerList(userid) {
        return fetch(API_URL.QUERY_SITE + `getServerList/${userid}`)
            .then(action(res => res.json()))
            .then(action(json=>{
                this.serverList= json
                return json
            })).catch(err => err)
    }

    @action async init(){
        this.siteLoading = true
        await this.loadSite()
        const a = await this.authenticate()
        console.log(a)
        this.siteLoading = false

       //  {
       //
       //      if(this.currentUser.name){QUERY_SITE
       //          const URL = config.WS_URL;
       //          this.ws = new WebSocket(URL)
       //          console.log(this.currentUser)
       //          return agent.Account.getSaleWeChat(this.currentUser.iduser)
       //              .then ((res) => {
       //                  if (res.length>0 && res[0].wechatName){
       //                      let result = Object.keys(JSON.parse(res[0].wechatName)).map(key =>`${key}(${JSON.parse(res[0].wechatName)[key]})`).join('|');
       //                      this.currentUser['wechat'] = result
       //                      // this.currentUser['wechatName'] = result
       //                      window.localStorage.setItem('current', JSON.stringify(this.currentUser))
       //                  }
       //              })
       //              .then(()=>{
       //                  if(this.currentUser.role.indexOf('counsellor')>=0){
       //                      ordersStore.getUserOrders(this.currentUser.iduser)
       //                      ordersStore.getUserOrdersDetail(this.currentUser.iduser)
       //                  }
       //
       //                  if(this.currentUser.role.indexOf('saleman')>=0){
       //                      //console.log("afasfas   "+this.currentUser.iduser)
       //                      customerStore.init();
       //                      ordersStore.getSalesOrdersDetail(this.currentUser.iduser)
       //                      ordersStore.getSaleOrdersResult(this.currentUser.iduser)
       //                      ordersStore.loadSalePackage(this.currentUser.iduser)
       //                  }
       //              })
       //      }
       // }
       //
       //  if(this.currentUser.name){
       //      const URL = config.WS_URL;
       //      this.ws = new WebSocket(URL)
       //      console.log(this.currentUser)
       //      return agent.Account.getSaleWeChat(this.currentUser.iduser)
       //          .then ((res) => {
       //              if (res.length>0 && res[0].wechatName){
       //                  let result = Object.keys(JSON.parse(res[0].wechatName)).map(key =>`${key}(${JSON.parse(res[0].wechatName)[key]})`).join('|');
       //                  this.currentUser['wechat'] = result
       //                  // this.currentUser['wechatName'] = result
       //                  window.localStorage.setItem('current', JSON.stringify(this.currentUser))
       //              }
       //          })
       //          .then(()=>{
       //              if(this.currentUser.role.indexOf('counsellor')>=0){
       //                  ordersStore.getUserOrders(this.currentUser.iduser)
       //                  ordersStore.getUserOrdersDetail(this.currentUser.iduser)
       //              }
       //
       //              if(this.currentUser.role.indexOf('saleman')>=0){
       //                  //console.log("afasfas   "+this.currentUser.iduser)
       //                  customerStore.init();
       //                  ordersStore.getSalesOrdersDetail(this.currentUser.iduser)
       //                  ordersStore.getSaleOrdersResult(this.currentUser.iduser)
       //                  ordersStore.loadSalePackage(this.currentUser.iduser)
       //              }
       //          })
       //  }
    }

}

export default new AuthStore();
