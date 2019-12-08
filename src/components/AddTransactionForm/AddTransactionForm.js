import React, { Component } from 'react';
import './AddTransactionForm.css';
import CurrencyInput from 'react-currency-input';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'

class AddTransactionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      amount: "",
      floatAmount: 0,
      category: "",
      vendor: "",
      addingTransaction: false,
      transactionAdded: false,
      error: "",
    };

    this.categories = [
      { value: 'Grocery', label: 'Grocery' },
      { value: 'Restaurant', label: 'Restaurant' },
      { value: 'To go food', label: 'To go food' },
      { value: 'Gas', label: 'Gas' },
      { value: 'Auto insurance', label: 'Auto insurance' },
      { value: 'Rent', label: 'Rent' },
    ];
  }

  handleAmountChange = (event, maskedValue, floatValue) => {
    this.setState({amount: maskedValue, floatAmount: floatValue});
  }

  handleDateChange = (date) => {
    this.setState({ date: date });
  };

  handleCategoryChange = (category) => {
    this.setState({ category: category.value });
  };

  handleVendorChange = (event) => {
    this.setState({ vendor: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.addTransaction();
  }

  getFormattedDate(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return month + '/' + day + '/' + year;
  }

  addTransaction = () => {
    const currentComponent = this;

    currentComponent.setState({
      addingTransaction: true,
      transactionAdded: false,
      error: "",
    });

    window.gapi.client.load("sheets", "v4", () => {
      window.gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId :'1H89VCjaXRq5d4XT8J92N7eavaBIvIGSfP240VOMasRo',
        range: 'Transactions',
        valueInputOption: 'USER_ENTERED',
        resource: currentComponent.formatTransactionRow(),
      })
      .then(response => {
        console.log(response);
        currentComponent.setState({
          addingTransaction: false,
          transactionAdded: true,
          date: new Date(),
          amount: "",
          floatAmount: 0,
          category: "",
          vendor: "",
          error: "",
        });
      })
      .catch(error => {
        console.log(error);
        currentComponent.setState({
          addingTransaction: false,
          transactionAdded: false,
          error: JSON.stringify(error, null, 2),
        });
      });
    });
  }

  formatTransactionRow = () => {
    return {
      values: [[this.getFormattedDate(this.state.date), this.state.amount, this.state.category, this.state.vendor]],
    };
  }

  render() {
    const disableSubmit = this.state.addingTransaction;

    return (
      <form onSubmit={this.handleSubmit} className="AddTransactionForm-container">
        <label className="AddTransactionForm-label">Date:</label>
        <DatePicker
          className="AddTransactionForm-input"
          selected={this.state.date}
          onChange={this.handleDateChange}
          onFocus={(e) => e.target.readOnly = true}
          disabled={disableSubmit}
        />

        <label className="AddTransactionForm-label">Amount:</label>
        <CurrencyInput inputType="tel" className="AddTransactionForm-input" value={this.state.amount} onChangeEvent={this.handleAmountChange} prefix="$" allowEmpty={true} disabled={disableSubmit}  />

        <label className="AddTransactionForm-label">Category:</label>
        <Select
          className="AddTransactionForm-input"
          classNamePrefix="Categories"
          options={this.categories}
          onChange={this.handleCategoryChange}
          isSearchable={false}
          disabled={disableSubmit}
        />

        <label className="AddTransactionForm-label">Vendor:</label>
        <input
          className="AddTransactionForm-input"
          type="text"
          value={this.state.vendor}
          onChange={this.handleVendorChange}
          disabled={disableSubmit}
        />

        <input className="AddTransactionForm-input" type="submit" value="Add Transaction" disabled={disableSubmit} />

        {this.state.addingTransaction && <p>Adding transaction...</p>}
        {this.state.transactionAdded && <p>Transaction added!</p>}
        {this.state.error && <p>{this.state.error}</p>}
      </form>
    )
  }
}
export default AddTransactionForm;
