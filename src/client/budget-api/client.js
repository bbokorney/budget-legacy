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
    const body = JSON.stringify(transaction);
    return this.httpClient.post("transactions", body).then((result) => {
      console.log(result);
    });
  };
}

export default BudgetClient;
