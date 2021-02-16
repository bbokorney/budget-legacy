import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App.js";
import * as serviceWorker from "./serviceWorker";

const version = process.env.REACT_APP_VERSION
  ? process.env.REACT_APP_VERSION
  : "not set";
const budgetAPIUrl = process.env.REACT_APP_BUDGET_API_URL
  ? process.env.REACT_APP_BUDGET_API_URL
  : "http://localhost:8000";

ReactDOM.render(
  <App version={version} budgetAPIUrl={budgetAPIUrl} />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
