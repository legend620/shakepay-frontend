import axios from "axios";

const CURRENCIES = [
  { symbol: "CAD", name: "Dollars" },
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
];
const BASE_URL = "https://shakepay.github.io/programming-exercise/web";

const getBalance = (transactions) => {
  let balance = 0;

  transactions.forEach((tx) => {
    if (tx.direction === "credit") {
      balance += tx.amount;
    } else {
      balance -= tx.amount;
    }
  });
  return balance;
};

export const getAssets = async () => {
  const [rates, transactions] = await Promise.all([
    axios.get(`${BASE_URL}/rates.json`).then((x) => x.data),
    axios.get(`${BASE_URL}/transaction_history.json`).then((x) => x.data),
  ]);

  const assets = CURRENCIES.map(({ symbol, name }) => {
    const balance = getBalance(
      transactions.filter((tx) => tx.currency === symbol)
    );
    return { name, symbol, balance, rate: rates[`${symbol}_CAD`] || 1 };
  });

  return assets;
};

export const getCurrencyData = async (symbol) => {
  let transactions = await axios
    .get(`${BASE_URL}/transaction_history.json`)
    .then((x) => x.data);
  transactions = transactions.filter((tx) => tx.currency === symbol);

  const balance = getBalance(transactions);
  const { name } = CURRENCIES.find((x) => x.symbol === symbol);

  return { name, balance, transactions };
};
