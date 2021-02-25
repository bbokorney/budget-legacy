import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import AddTransactionForm from "../AddTransactionForm/AddTransactionForm.js";
import ConfigInfoForm from "../ConfigInfoForm/ConfigInfoForm.js";
import SpendingView from "../SpendingView/SpendingView.js";
import { FaPlus, FaCog, FaList, FaChartPie } from "react-icons/fa";
import { FormatDollarAmount } from "../../utils/formatting.js";
import BudgetClient from "../../client/budget-api/client.js";

class App extends Component {
  constructor(props) {
    super(props);
    const token = this.loadFromConfigWithDefault("token", null)
    var initializingMessage = "Loading..."
    if(!token) {
      initializingMessage = "App not set up. Please use set up link."
    }
    var budgetClient = null;
    if(token) {
      budgetClient = new BudgetClient(this.props.budgetAPIUrl, token);
    }
    this.state = {
      token: token,
      errorMessage: "",
      initializingMessage: initializingMessage,
      transactions: [],
      categories: [],
      currentSpending: null,
      spendingLimits: null,
      annualBudget: null,
      budgetClient: budgetClient,
    };
  }

  loadFromConfigWithDefault(key, defaultValue) {
    var fromStorage = localStorage.getItem(key);
    if(fromStorage == "null") {
      fromStorage = null;
    }
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
            version={this.props.version}
          />
        </Route>
        <Route path="/">
          <AddTransactionForm categories={this.state.categories} budgetClient={this.state.budgetClient} />
        </Route>
      </Switch>
    );

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
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if(token) {
      localStorage.setItem("token", token);
      // redirect to URL without the API info as query params
      const url = new URL(window.location.href);
      window.location.href = url.protocol + "//" + url.host;
      this.setState({token: token});
      return;
    }

    if(this.state.token) {
      this.loadData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.token !== this.state.token) {
      this.setState({budgetClient: new BudgetClient(this.props.budgetAPIUrl, this.state.token)});
      return;
    }

    if (prevState.budgetClient != this.state.budgetClient) {
      // the token was updated so we should try to
      // fetch the data again.
      this.loadData();
    }
  }

  loadData() {
    if(!this.state.budgetClient) {
      return;
    }
    this.loadTransactions();
    this.loadSpendingView();
    this.loadSpendingLimits();
    this.loadAnnualSpendingLimits();
    this.loadCategories();
  }

  handleError = (error) => {
    console.log(error);
    const errMsg = JSON.stringify(error, null, 2);
    this.setState({
      errorMessage: errMsg,
    });
  };

  loadTransactions = () => {
    this.state.budgetClient
      .listTransactions()
      .then((transactions) => {
        this.setState({
          transactions: transactions,
          initializingMessage: "",
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  loadSpendingView = () => {
    this.state.budgetClient
      .getCurrentSpending()
      .then((currentSpending) => {
        this.setState({
          currentSpending: currentSpending,
          initializingMessage: "",
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  loadSpendingLimits = () => {
    this.state.budgetClient
      .getCategoryLimits()
      .then((spendingLimits) => {
        this.setState({
          spendingLimits: spendingLimits,
          initializingMessage: "",
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  loadAnnualSpendingLimits = () => {
    this.state.budgetClient
      .getAnnualLimits()
      .then((annualBudget) => {
        this.setState({
          annualBudget: annualBudget,
          initializingMessage: "",
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };

  loadCategories = () => {
    const currentComponent = this;

    currentComponent.state.budgetClient
      .listCategories()
      .then((response) => {
        const categories = response.map((c) => {
          return {
            label: c.name,
            value: c.name,
          };
        });
        currentComponent.setState({
          categories: categories,
        });
      })
      .catch((error) => {
        this.handleError(error);
      });
  };
}

function Transactions(props) {
  const listItems = props.transactions
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    .map((t, i) => (
      <li key={i} className="Transactions-list">
        <b className="Transactions-list-item Transactions-list-amount">
          {FormatDollarAmount(t.amount)}
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
