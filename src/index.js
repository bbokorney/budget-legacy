import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import * as serviceWorker from './serviceWorker';
import {BudgetServicePromiseClient} from './client/budget/budget_grpc_web_pb.js';

const version = process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : 'not set';
const budgetServicesAddr =  process.env.REACT_APP_BUDGET_SERVICE_ADDR ?
  process.env.REACT_APP_BUDGET_SERVICE_ADDR : 'http://127.0.0.1:5000'
const budgetService = new BudgetServicePromiseClient(budgetServicesAddr);

ReactDOM.render(
  <App version={version} budgetService={budgetService} />,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
