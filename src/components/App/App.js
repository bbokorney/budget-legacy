import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm.js";
import ConfigInfoForm from "../ConfigInfoForm/ConfigInfoForm.js";
import SpendingView from "../SpendingView/SpendingView.js";
import { FaPlus, FaCog, FaList, FaChartPie } from "react-icons/fa";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      isLoggedIn: false,
      initializingMessage: "Loading...",
      transactions: [],
      currentSpending: null,
      spendingLimits: null,
      annualBudget: null,
      config: {
        clientId: this.loadFromConfigWithDefault("clientId", ""),
        apiKey: this.loadFromConfigWithDefault("apiKey", ""),
        sheetId: this.loadFromConfigWithDefault("sheetId", ""),
      },
    };
  }

  loadFromConfigWithDefault(key, defaultValue) {
    const fromStorage = localStorage.getItem(key);
    return fromStorage ? fromStorage : defaultValue;
  }

  render() {
    var mainBody = (
      <Switch>
        <Route path="/budget">
          <SpendingView
            currentSpending={this.state.currentSpending}
            spendingLimits={this.state.spendingLimits}
            annualBudget={this.state.annualBudget}
          />
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
          <AddTransactionForm budgetClient={this.props.budgetClient} />
        </Route>
      </Switch>
    );

    if (!this.state.isLoggedIn) {
      mainBody = (
        <div>
          <p>Please log in</p>
          <button onClick={this.handleLoginClick}> Login </button>
        </div>
      );
    }

    if (this.state.initializingMessage) {
      mainBody = <p>{this.state.initializingMessage}</p>;
    }

    return (
      <Router>
        <div className="App">
          <div className="App-header">
            <p className="App-header-text">
              <b>Budget</b>
            </p>
          </div>

          <div className="App-main">
            {mainBody}
            <div>
              {this.state.errorMessage && (
                <label>Error: {this.state.errorMessage}</label>
              )}
            </div>
          </div>

          <div className="App-blank"></div>

          <nav className="App-navbar">
            <div className="App-navbar-home App-navbar-item">
              <Link className="App-navbar-link" to="/">
                <FaPlus className="App-navbar-icon" />
              </Link>
            </div>
            <div className="App-navbar-add App-navbar-item">
              <Link className="App-navbar-link" to="/budget">
                <FaChartPie className="App-navbar-icon" />
              </Link>
            </div>
            <div className="App-navbar-list App-navbar-item">
              <Link className="App-navbar-link" to="/list">
                <FaList className="App-navbar-icon" />
              </Link>
            </div>
            <div className="App-navbar-settings App-navbar-item">
              <Link className="App-navbar-link" to="/settings">
                <FaCog className="App-navbar-icon" />
              </Link>
            </div>
          </nav>
        </div>
      </Router>
    );
  }

  componentDidMount() {
    this.setupAPIClient(null);
  }

  componentDidUpdate(prevProps, prevState) {
    this.setupAPIClient(prevState.config);
  }

  setupAPIClient(prevConfig) {
    this.checkAPIConfigParams();

    if (!this.configChanged(prevConfig, this.state.config)) {
      return;
    }

    if (!this.allConfigSet(this.state.config)) {
      this.setState({
        initializingMessage: "App not set up. Please use set up link.",
      });
      return;
    }

    window.gapi.load("client:auth2", this.initClient);
  }

  checkAPIConfigParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get("clientId");
    const apiKey = urlParams.get("apiKey");
    const sheetId = urlParams.get("sheetId");
    if (clientId && apiKey && sheetId) {
      this.saveAPIConfigToLocalStorage({
        clientId: clientId,
        apiKey: apiKey,
        sheetId: sheetId,
      });

      // redirect to URL without the API info as query params
      const url = new URL(window.location.href);
      window.location.href = url.protocol + "//" + url.host;
      return;
    }
    return;
  };

  saveAPIConfigToLocalStorage = (config) => {
    localStorage.setItem("clientId", config.clientId);
    localStorage.setItem("apiKey", config.apiKey);
    localStorage.setItem("sheetId", config.sheetId);
  };

  handleConfigInfoSubmit = (config) => {
    this.saveAPIConfigToLocalStorage(config);
    this.setState({ config: config });
  };

  clearConfig = () => {
    localStorage.removeItem("clientId");
    localStorage.removeItem("apiKey");
    localStorage.removeItem("sheetId");
    this.setState({
      config: {
        clientId: "",
        apiKey: "",
        sheetId: "",
      },
    });
  };

  allConfigSet = (config) => {
    return (
      config.clientId &&
      config.apiKey &&
      config.sheetId &&
      config.clientId !== "null" &&
      config.apiKey !== "null" &&
      config.sheeetId !== "null" &&
      config.clientId !== "undefined" &&
      config.apiKey !== "undefined" &&
      config.sheeetId !== "undefined"
    );
  };

  configChanged = (prevConfig, currConfig) => {
    if (!prevConfig && currConfig) {
      return true;
    }
    if (prevConfig && !currConfig) {
      return true;
    }
    return (
      prevConfig.clientId !== currConfig.clientId ||
      prevConfig.apiKey !== currConfig.apiKey ||
      prevConfig.sheetId !== currConfig.sheetId
    );
  };

  handleLoginClick = () => {
    let currentComponent = this;
    window.gapi.auth2
      .getAuthInstance()
      .signIn()
      .then(function () {
        currentComponent.initClient();
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  handleLogoutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut();
    this.setState({ isLoggedIn: false });
  };

  initClient = () => {
    // Client ID and API key from the Developer Console
    const config = this.state.config;

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = [
      "https://sheets.googleapis.com/$discovery/rest?version=v4",
    ];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/spreadsheets";

    let currentComponent = this;

    window.gapi.client
      .init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          window.gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen(currentComponent.updateSigninStatus);

          // Handle the initial sign-in state.
          currentComponent.updateSigninStatus(
            window.gapi.auth2.getAuthInstance().isSignedIn.get()
          );
          if (currentComponent.state.isLoggedIn) {
            currentComponent.loadTransactions();
            currentComponent.loadSpendingView();
            currentComponent.loadSpendingLimits();
            currentComponent.loadAnnualSpendingLimits();
          }
        },
        function (error) {
          currentComponent.handleError(error);
        }
      );
  };

  handleError = (error) => {
    console.log(error);
    const errMsg = JSON.stringify(error, null, 2);
    this.setState({
      errorMessage: errMsg,
    });
  };

  updateSigninStatus = (isSignedIn) => {
    if (isSignedIn) {
      this.setState({
        isLoggedIn: true,
        errorMessage: "",
        initializingMessage: "",
      });
    } else {
      this.setState({
        isLoggedIn: false,
        errorMessage: "",
        initializingMessage: "",
      });
    }
  };

  loadTransactions = () => {
    this.props.budgetClient
      .listTransactions()
      .then((transactions) => {
        this.setState({
          transactions: transactions,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  transformTransactionResults = (response) => {
    const values = response.result.values;
    return values.slice(0, values.length).map((v) => {
      return {
        date: v[0],
        amount: v[1],
        category: v[2],
        vendor: v[3],
      };
    });
  };

  loadSpendingView = () => {
    this.props.budgetClient
      .getCurrentSpending()
      .then((currentSpending) => {
        this.setState({
          currentSpending: currentSpending,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  loadSpendingLimits = () => {
    this.props.budgetClient
      .getCategoryLimits()
      .then((spendingLimits) => {
        this.setState({
          spendingLimits: spendingLimits,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  loadAnnualSpendingLimits = () => {
    window.gapi.client.load("sheets", "v4", () => {
      window.gapi.client.sheets.spreadsheets.values
        .get({
          spreadsheetId: this.state.config.sheetId,
          range: "Annual Budget",
        })
        .then((response) => {
          const values = response.result.values;
          const annualBudget = {};
          values.forEach((v) => {
            annualBudget[v[0]] = v[1];
          });
          this.setState({ annualBudget: annualBudget });
        })
        .catch((error) => {
          this.handleError(error);
        });
    });
  };
}

function Transactions(props) {
  const listItems = props.transactions
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .map((t, i) => (
      <li key={i} className="Transactions-list">
        <b className="Transactions-list-item Transactions-list-amount">
          {t.amount}
        </b>
        <span className="Transactions-list-item Transactions-list-date">
          {prettyDate(t.date)}
        </span>
        <span className="Transactions-list-item Transactions-list-category">
          <b>{t.category}</b>
        </span>
        <span className="Transactions-list-item Transactions-list-vendor">
          {t.vendor ? t.vendor : "No vendor"}
        </span>
      </li>
    ));

  return <ul className="Transactions-container">{listItems}</ul>;
}

function prettyDate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[date.getMonth()] + " " + date.getDate();
}

export default App;
