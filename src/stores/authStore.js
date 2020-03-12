import { observable, action, computed, reaction, createTransformer } from 'mobx';


class AuthStore {
    @observable currentUser = JSON.parse(window.localStorage.getItem('current'))||{};
    @observable token = window.localStorage.getItem('jwt');
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

    // constructor() {
    //     reaction(
    //         () => this.token,
    //         token => {
    //             if (token) {
    //                 window.localStorage.setItem('jwt', token);
    //             } else {
    //                 window.localStorage.removeItem('jwt');
    //             }
    //         }
    //     );
    // }

    // @action init(){
    //     {

            // if(this.currentUser.name){
            //     const URL = config.WS_URL;
            //     this.ws = new WebSocket(URL)
            //     console.log(this.currentUser)
            //     return agent.Account.getSaleWeChat(this.currentUser.iduser)
            //         .then ((res) => {
            //             if (res.length>0 && res[0].wechatName){
            //                 let result = Object.keys(JSON.parse(res[0].wechatName)).map(key =>`${key}(${JSON.parse(res[0].wechatName)[key]})`).join('|');
            //                 this.currentUser['wechat'] = result
            //                 // this.currentUser['wechatName'] = result
            //                 window.localStorage.setItem('current', JSON.stringify(this.currentUser))
            //             }
            //         })
            //         .then(()=>{
            //             if(this.currentUser.role.indexOf('counsellor')>=0){
            //                 ordersStore.getUserOrders(this.currentUser.iduser)
            //                 ordersStore.getUserOrdersDetail(this.currentUser.iduser)
            //             }
            //
            //             if(this.currentUser.role.indexOf('saleman')>=0){
            //                 //console.log("afasfas   "+this.currentUser.iduser)
            //                 customerStore.init();
            //                 ordersStore.getSalesOrdersDetail(this.currentUser.iduser)
            //                 ordersStore.getSaleOrdersResult(this.currentUser.iduser)
            //                 ordersStore.loadSalePackage(this.currentUser.iduser)
            //             }
            //         })
            // }
       // }

        // if(this.currentUser.name){
        //     const URL = config.WS_URL;
        //     this.ws = new WebSocket(URL)
        //     console.log(this.currentUser)
        //     return agent.Account.getSaleWeChat(this.currentUser.iduser)
        //         .then ((res) => {
        //             if (res.length>0 && res[0].wechatName){
        //                 let result = Object.keys(JSON.parse(res[0].wechatName)).map(key =>`${key}(${JSON.parse(res[0].wechatName)[key]})`).join('|');
        //                 this.currentUser['wechat'] = result
        //                 // this.currentUser['wechatName'] = result
        //                 window.localStorage.setItem('current', JSON.stringify(this.currentUser))
        //             }
        //         })
        //         .then(()=>{
        //             if(this.currentUser.role.indexOf('counsellor')>=0){
        //                 ordersStore.getUserOrders(this.currentUser.iduser)
        //                 ordersStore.getUserOrdersDetail(this.currentUser.iduser)
        //             }
        //
        //             if(this.currentUser.role.indexOf('saleman')>=0){
        //                 //console.log("afasfas   "+this.currentUser.iduser)
        //                 customerStore.init();
        //                 ordersStore.getSalesOrdersDetail(this.currentUser.iduser)
        //                 ordersStore.getSaleOrdersResult(this.currentUser.iduser)
        //                 ordersStore.loadSalePackage(this.currentUser.iduser)
        //             }
        //         })
        // }
    // }

}

export default new AuthStore();
