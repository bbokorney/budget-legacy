import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import * as serviceWorker from './serviceWorker';
import {TransactionsServiceClient} from './client/transactions/transactions_grpc_web_pb.js';

const version = process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : 'not set';
const transactionsServicesAddr =  process.env.REACT_APP_TRANSACTIONS_SERVICE_ADDR ?
  process.env.REACT_APP_TRANSACTIONS_SERVICE_ADDR : 'http://localhost:8000'
const transactionsService = new TransactionsServiceClient(transactionsServicesAddr);

ReactDOM.render(
  <App version={version} transactionsService={transactionsService} />,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
