import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
import { Provider } from "mobx-react";
import authStore from "./stores/authStore";

const stores = {
    // articlesStore,
    //ordersStore,
    //courseStore,
    // commentsStore,
    authStore,
    //priceRequestStore,
    //customerStore,
    //userStore,
    //helperStore,
    //statisticStore,
    //exchangeRequestStore,
    //exchangeReserveStore,
    //qualityStore,
    //orderResultStore,
    //utilStore
};
const Root = (
    <Provider  { ...stores}>
        <HashRouter>
            <div>
                {/*{init()}*/}
                <App />
            </div>
        </HashRouter>
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
