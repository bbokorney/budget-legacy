import React, { Component } from 'react';
import {
  BrowserRouter as Router,
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
        apiKey: this.loadFromConfigWithDefault('apiKey'),
        sheetId: this.loadFromConfigWithDefault('sheetId'),
      },
    };
  }

  loadFromConfigWithDefault(key, defaultValue) {
    const fromStorage = localStorage.getItem(key);
    return fromStorage ? fromStorage : defaultValue;
  }

  render() {
    const configSet = this.allConfigSet(this.state.config);
    const isLoggedIn = this.state.isLoggedIn;
    let button;

    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <LoginButton onClick={this.handleLoginClick} />;
    }


        //   <button onClick={this.clearConfig}>Clear config</button>

        //   { this.state.errorMessage && <label>Error: {this.state.errorMessage}</label> }
        //   <Greeting isLoggedIn={isLoggedIn} />
        //   {button}
        //   <Transactions transactions={this.state.transactions} />

        //   <button onClick={this.loadTransactions}>Load Transactions</button>

        // </header>
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
                <h1>List</h1>
              </Route>
              <Route path="/settings">
                <ConfigInfoForm onSubmit={this.handleConfigInfoSubmit} config={this.state.config} />
              </Route>
              <Route path="/">
                <h1>Home</h1>
              </Route>
            </Switch>
          </div>

          <nav className="App-navbar">
            <div className="App-navbar-home">
              <Link to="/"><FaHome /></Link>
            </div>
            <div className="App-navbar-add">
              <Link to="/add"><FaPlus /></Link>
            </div>
            <div className="App-navbar-list">
              <Link to="/list"><FaList /></Link>
            </div>
            <div className="App-navbar-settings">
              <Link to="/settings"><FaCog /></Link>
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
  const listItems = props.transactions.map((t) => 
    <li>{t.date.concat(t.amount, t.category, t.vendor)}</li>
  );
  
  return (
    <div>
      <label>Transactions</label>
      <ul>{listItems}</ul>
    </div>
  );
}

function LoginButton(props) {
  return (
    <button onClick={props.onClick}>
      Login
    </button>
  );
}

function LogoutButton(props) {
  return (
    <button onClick={props.onClick}>
      Logout
    </button>
  );
}

function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign in.</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

export default App;