import React, { Component } from "react";
import "./AddTransactionForm.css";
import CurrencyInput from "react-currency-input";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

class AddTransactionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      amount: "",
      floatAmount: 0,
      category: null,
      categories: [],
      vendor: "",
      addingTransaction: false,
      transactionAdded: false,
      error: "",
    };

    this.loadCategories();
  }

  loadCategories = () => {
    const currentComponent = this;

    currentComponent.props.budgetClient
      .listCategories()
      .then((response) => {
        const categories = response.map((c) => {
          return {
            label: c,
            value: c,
          };
        });
        currentComponent.setState({
          categories: categories,
        });
      })
      .catch((error) => {
        console.log("Error listing categories");
        console.log(error);
      });
  };

  handleAmountChange = (event, maskedValue, floatValue) => {
    this.setState({ amount: maskedValue, floatAmount: floatValue });
  };

  handleDateChange = (date) => {
    this.setState({ date: date });
  };

  handleCategoryChange = (category) => {
    this.setState({ category: category });
  };

  handleTagsChange = (tags) => {
    this.setState({ tags: tags });
  };

  handleVendorChange = (event) => {
    this.setState({ vendor: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.addTransaction();
  };

  addTransaction = () => {
    const currentComponent = this;

    if (!currentComponent.inputValid()) {
      return;
    }

    currentComponent.setState({
      addingTransaction: true,
      transactionAdded: false,
      error: "",
    });

    const request = currentComponent.createTransactionObject();

    currentComponent.props.budgetClient
      .addTransaction(request, {})
      .then(() => {
        currentComponent.setState({
          addingTransaction: false,
          transactionAdded: true,
          date: new Date(),
          amount: "",
          floatAmount: 0,
          category: "",
          vendor: "",
          error: "",
          tags: [],
        });
      })
      .catch((error) => {
        console.log("Error adding transaction");
        console.log(error);
        currentComponent.setState({
          addingTransaction: false,
          transactionAdded: false,
          error: JSON.stringify(error, null, 2),
        });
      });
  };

  createTransactionObject = () => {
    return {
      date: this.state.date,
      amount: this.state.floatAmount,
      category: this.state.category.value,
      vendor: this.state.vendor,
    };
  };

  inputValid = () => {
    return (
      this.state.date !== "" &&
      this.state.floatAmount > 0 &&
      this.state.category.value !== "" &&
      this.state.vendor !== ""
    );
  };

  render() {
    // Fix autofocus issues with CurrencyInput
    // on iOS it will still auto focus even if autoFocus=false
    // see https://github.com/jsillitoe/react-currency-input/issues/90
    let componentDidMount_super = CurrencyInput.prototype.componentDidMount;
    CurrencyInput.prototype.componentDidMount = function () {
      if (!this.props.autoFocus) {
        let setSelectionRange_super = this.theInput.setSelectionRange;
        this.theInput.setSelectionRange = () => {};
        componentDidMount_super.call(this, ...arguments);
        this.theInput.setSelectionRange = setSelectionRange_super;
      } else {
        componentDidMount_super.call(this, ...arguments);
      }
    };
    let componentDidUpdate_super = CurrencyInput.prototype.componentDidUpdate;
    CurrencyInput.prototype.componentDidUpdate = function () {
      if (!this.props.autoFocus) {
        let setSelectionRange_super = this.theInput.setSelectionRange;
        this.theInput.setSelectionRange = () => {};
        componentDidUpdate_super.call(this, ...arguments);
        this.theInput.setSelectionRange = setSelectionRange_super;
      } else {
        componentDidMount_super.call(this, ...arguments);
      }
    };
    const disableSubmit = this.state.addingTransaction;
    return (
      <div>
        <form
          onSubmit={this.handleSubmit}
          className="AddTransactionForm-container"
        >
          <label className="AddTransactionForm-label">Date:</label>
          <DatePicker
            className="AddTransactionForm-datepicker"
            calendarClassName="AddTransactionForm-datepicker-container"
            selected={this.state.date}
            onChange={this.handleDateChange}
            onFocus={(e) => (e.target.readOnly = true)}
            disabled={disableSubmit}
            customInput={<DatePickerContainer disabled={disableSubmit} />}
          />

          <label className="AddTransactionForm-label">Amount:</label>
          <CurrencyInput
            inputType="tel"
            className="AddTransactionForm-input"
            value={this.state.amount}
            onChangeEvent={this.handleAmountChange}
            prefix="$"
            allowEmpty={true}
            disabled={disableSubmit}
            autoFocus={false}
            onFocus={(e) => (e.target.value = "")}
          />

          <label className="AddTransactionForm-label">Category:</label>
          <Select
            className="AddTransactionForm-input AddTransactionForm-category"
            classNamePrefix="Categories"
            options={this.state.categories}
            onChange={this.handleCategoryChange}
            isSearchable={false}
            disabled={disableSubmit}
            value={this.state.category}
          />

          <label className="AddTransactionForm-label">Vendor:</label>
          <input
            className="AddTransactionForm-input"
            type="text"
            value={this.state.vendor}
            onChange={this.handleVendorChange}
            disabled={disableSubmit}
          />

          <label className="AddTransactionForm-label">Tags:</label>
          <CreatableSelect
            className="AddTransactionForm-input AddTransactionForm-category"
            classNamePrefix="Categories"
            value={this.state.tags}
            isMulti={true}
            onChange={this.handleTagsChange}
            isSearchable={true}
            disabled={disableSubmit}
          />

          <input
            className="AddTransactionForm-input"
            type="submit"
            value="Add Transaction"
            disabled={disableSubmit}
          />
        </form>
        {this.state.addingTransaction && <p>Adding transaction...</p>}
        {this.state.transactionAdded && <p>Transaction added!</p>}
        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

class DatePickerContainer extends Component {
  render() {
    return (
      <div className="AddTransactionForm-datepicker-container">
        <input
          value={this.props.value}
          onChange={this.props.onChange}
          onClick={this.props.onClick}
          type="text"
          className="AddTransactionForm-datepicker"
          readOnly={true}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}
export default AddTransactionForm;
