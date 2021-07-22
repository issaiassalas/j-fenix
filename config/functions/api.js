const fetch = require('node-fetch');
const {
    WAVES_NODE_URL: NODE_URL,
    JFX_ASSET_ID: ASSET_ID,
    COINRANKING_URL: CR_URL,
    JFX_UUID: UUID
} = require('./constants');

const get = async (url, options = {}) => {
    const res = await fetch(url, options);
    return res.json();
};

const getBalance = wallet => get(`${NODE_URL}/assets/balance/${wallet}/${ASSET_ID}`);

const fetchTransactions = wallet => get(`${NODE_URL}/transactions/address/${wallet}/limit/1000`);

const getTransactions = async wallet => {
    const transactions = await fetchTransactions(wallet);
    return transactions.map(transactionList => transactionList.filter(item => item.assetId === ASSET_ID));
}

const getCoinDetails = () => get(`${NODE_URL}/assets/details/${ASSET_ID}`);

const getCoin = () => get(`${CR_URL}/coin/${UUID}`);

const getHistory = (timePeriod = '5y') => get(`${CR_URL}/coin/${UUID}/history?timePeriod=${timePeriod}`);

const getExchanges = () => get(`${COINRANKING_URL}/coin/${JFX_UUID}/exchanges`);

const getMarkets = () => get(`${COINRANKING_URL}/coin/${JFX_UUID}/markets`);

const getSupply = () => get(`${COINRANKING_URL}/coin/${JFX_UUID}/supply`);

module.exports = {
    getBalance,
    getTransactions,
    getCoinDetails,
    getCoin,
    getHistory,
    getExchanges,
    getMarkets,
    getSupply
}