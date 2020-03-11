import React from 'react';
import ReactDOM from 'react-dom';
import { createHashHistory} from 'history';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore } from 'mobx-react-router';
import { Router } from 'react-router';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';
import authStore from "./stores/authStore";
import routingStore from './stores/routingStore'

const stores = {
    routingStore: routingStore,
    authStore: authStore,
    // systemStore: systemStore,
    // statsStore: statsStore
}

const hashHistory = createHashHistory();
const history = syncHistoryWithStore(hashHistory, stores.routingStore);

const Root = (
    <Provider  { ...stores}>
        <Router history={history}>
                <App />
        </Router>
    </Provider>
);

ReactDOM.render(Root, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
