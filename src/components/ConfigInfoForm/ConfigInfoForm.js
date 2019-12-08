import React, { Component } from 'react';
import '../AddTransactionForm/AddTransactionForm.css';

class ConfigInfoForm extends Component {
  constructor(props) {
    super(props);
    const config = this.props.config;
    console.log(config);
    this.state = {
      clientId: config.clientId ? config.clientId : "",
      apiKey: config.apiKey,
      sheetId: config.sheetId,
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  }

  handleUpdate = (event) => {
    const id = event.target.id;
    var obj = {};
    obj[id] = event.target.value; 
    this.setState(obj);
  }

  render() {
    const config = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="AddTransactionForm-container">
        <label className="AddTransactionForm-label">Client ID:</label>
        <input className="AddTransactionForm-input" id="clientId" type="text" value={config.clientId} onChange={this.handleUpdate} />

        <label className="AddTransactionForm-label">API Key:</label>
        <input className="AddTransactionForm-input" id="apiKey" type="text" value={config.apiKey} onChange={this.handleUpdate} />

        <label className="AddTransactionForm-label">Sheet ID:</label>
        <input className="AddTransactionForm-input" id="sheetId" type="text" value={config.sheetId} onChange={this.handleUpdate} />

        <input className="AddTransactionForm-input" type="submit" value="Update Configuration" />
      </form>
    );
  }
}


export default ConfigInfoForm;
