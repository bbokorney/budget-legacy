import axios from "axios";

class BudgetClient {
  constructor(url) {
    this.url = url;
    this.httpClient = axios.create({
      baseURL: `${url}/v1`,
      timeout: 10000,
    });
  }

  listCategories = () => {
    return this.httpClient.get("categories").then((result) => {
      return result.data;
    });
  };

  addTransaction = (transaction) => {
    console.log(transaction);
  };
}

export default BudgetClient;
