import React, { Component } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import AddTransactionForm from '../AddTransactionForm/AddTransactionForm.js';
import ConfigInfoForm from '../ConfigInfoForm/ConfigInfoForm.js';
import { FaHome, FaPlus, FaCog, FaList } from 'react-icons/fa';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      isLoggedIn: false,
      transactions: [],
      config: {
        clientId: this.loadFromConfigWithDefault('clientId', ""),
        apiKey: this.loadFromConfigWithDefault('apiKey', ""),
        sheetId: this.loadFromConfigWithDefault('sheetId', ""),
      },
    };
  }

  loadFromConfigWithDefault(key, defaultValue) {
    const fromStorage = localStorage.getItem(key);
    return fromStorage ? fromStorage : defaultValue;
  }

  render() {
    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <h2 className="App-header-text">Budget</h2>
          </div>

          <div className="App-main">
            <Switch>
              <Route path="/add">
                <AddTransactionForm />
              </Route>
              <Route path="/list">
                <Transactions transactions={this.state.transactions} />
              </Route>
              <Route path="/settings">
                <ConfigInfoForm
                  clearConfig={this.clearConfig}
                  onSubmit={this.handleConfigInfoSubmit}
                  config={this.state.config}
                  isLoggedIn={this.state.isLoggedIn}
                  handleLoginClick={this.handleLoginClick}
                  handleLogoutClick={this.handleLogoutClick}
                  version={this.props.version}
                />
              </Route>
              <Route path="/">
                <h1>Home</h1>
              </Route>
            </Switch>
            <div>
              { this.state.errorMessage && <label>Error: {this.state.errorMessage}</label> }
            </div>
          </div>

          <nav className="App-navbar">
            <div className="App-navbar-home App-navbar-item">
              <Link className="App-navbar-link" to="/"><FaHome className="App-navbar-icon" /></Link>
            </div>
            <div className="App-navbar-add App-navbar-item">
              <Link className="App-navbar-link" to="/add"><FaPlus className="App-navbar-icon" /></Link>
            </div>
            <div className="App-navbar-list App-navbar-item">
              <Link className="App-navbar-link" to="/list"><FaList className="App-navbar-icon" /></Link>
            </div>
            <div className="App-navbar-settings App-navbar-item">
              <Link className="App-navbar-link" to="/settings"><FaCog className="App-navbar-icon" /></Link>
            </div>
          </nav>
        </div>
      </Router>
    );
  }

  componentDidMount(){
    this.setupAPIClient(null);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.setupAPIClient(prevState.config);
  }

  setupAPIClient = (prevConfig) => {
    if(!this.allConfigSet(this.state.config)) {
      return;
    }

    if(!this.configChanged(prevConfig, this.state.config)) {
      return;
    }

    window.gapi.load('client:auth2', this.initClient);
  }

  handleConfigInfoSubmit = (config) => {
    localStorage.setItem('clientId', config.clientId);
    localStorage.setItem('apiKey', config.apiKey);
    localStorage.setItem('sheetId', config.sheetId);
    this.setState({config: config});
  }

  clearConfig = () => {
    localStorage.removeItem('clientId');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('sheetId');
    this.setState({
      config: {
        clientId: "",
        apiKey: "",
        sheetId: "",
      },
    });
  }

  allConfigSet = (config) => {
    return config.clientId && config.apiKey && config.sheetId && config.clientId !== "null" && config.apiKey !== "null" && config.sheeetId !== "null" && config.clientId !== "undefined" && config.apiKey !== "undefined" && config.sheeetId !== "undefined";
  }

  configChanged = (prevConfig, currConfig) => {
    if(!prevConfig && currConfig) {
      return true
    }
    if(prevConfig && !currConfig) {
      return true
    }
    return prevConfig.clientId !== currConfig.clientId
      || prevConfig.apiKey !== currConfig.apiKey
      || prevConfig.sheetId !== currConfig.sheetId;
  }

  handleLoginClick = () => {
    window.gapi.auth2.getAuthInstance().signIn();
    this.setState({isLoggedIn: true});
  }

  handleLogoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut();
    this.setState({isLoggedIn: false});
  }

  initClient = () => {
    // Client ID and API key from the Developer Console
    const config = this.state.config;

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    let currentComponent = this;

    window.gapi.client.init({
      apiKey: config.apiKey,
      clientId: config.clientId,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      window.gapi.auth2.getAuthInstance().isSignedIn.listen(currentComponent.updateSigninStatus);

      // Handle the initial sign-in state.
      currentComponent.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
      currentComponent.loadTransactions();
    }, function(error) {
      currentComponent.handleError(error);
    });
  }

  handleError = (error) => {
    console.log(error);
    const errMsg = JSON.stringify(error, null, 2)
    this.setState({
      errorMessage: errMsg, 
    });
  }

  updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      this.setState({
        isLoggedIn: true,
      });
    } else {
      this.setState({
        isLoggedIn: false,
      });
    }
  }

  loadTransactions = () => {
    window.gapi.client.load("sheets", "v4", () => {
      window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.state.config.sheetId,
        range: 'Transactions',
      })
      .then(response => {
        this.setState({transactions: this.transformResults(response)});
      })
      .catch(error => {
        this.handleError(error);
      });
    });
  }

  transformResults = (response) => {
    const values = response.result.values;
    return values.slice(1, values.length).map((v) => {
      return {
        date: v[0],
        amount: v[1],
        category: v[2],
        vendor: v[3],
      };
    });
  }
}

function Transactions(props) {
  const listItems = props.transactions.map((t, i) =>
    <li key={i} className="Transactions-list">
      <b className="Transactions-list-item Transactions-list-amount">{t.amount}</b>
      <span className="Transactions-list-item Transactions-list-date">{t.date}</span>
      <span className="Transactions-list-item Transactions-list-category">{t.category}</span>
      <span className="Transactions-list-item Transactions-list-vendor">{t.vendor ? t.vendor : "No vendor"}</span>
    </li>
  );

  return (
    <ul className="Transactions-container">{listItems}</ul>
  );
}

export default App;
