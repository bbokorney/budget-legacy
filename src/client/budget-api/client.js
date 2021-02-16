import axios from "axios";

class BudgetClient {
  constructor(url, token) {
    this.url = url;
    this.httpClient = axios.create({
      baseURL: `${url}/v1`,
      timeout: 10000,
      headers: { "X-Auth-Token": token },
    });
  }

  listCategories = () => {
    return this.httpClient.get("categories").then((result) => {
      return result.data;
    });
  };

  listTransactions = () => {
    return this.httpClient
      .get("transactions?current_month=true")
      .then((result) => {
        return result.data;
      });
  };

  addTransaction = (transaction) => {
    const body = JSON.stringify(transaction);
    return this.httpClient.post("transactions", body).then((result) => {
      return result;
    });
  };

  getCurrentSpending = () => {
    return this.httpClient.get("spending").then((result) => {
      return result.data;
    });
  };

  getCategoryLimits = () => {
    return this.httpClient.get("category-limits").then((result) => {
      return result.data;
    });
  };

  getAnnualLimits = () => {
    return this.httpClient.get("annual-limits").then((result) => {
      return result.data;
    });
  };
}

export default BudgetClient;
