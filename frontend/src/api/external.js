import axios from "axios";

const NEWS_API_STRING = `https://newsapi.org/v2/everything?q=tesla&from=2023-09-06&sortBy=publishedAt&apiKey=${process.env.REACT_APP_NEW_API}`;
const CRYPTO_API_STRING = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en`;
export const getNews = async () => {
  let response;
  try {
    response = await axios.get(NEWS_API_STRING);

    return response.data.articles;
  } catch (error) {}
};

export const getCrypto = async () => {
  let response;
  try {
    response = await axios.get(CRYPTO_API_STRING);
    return response.data;
  } catch (error) {
    return error;
  }
};
