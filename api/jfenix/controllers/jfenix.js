'use strict';

const axios = require('axios');
const api = strapi.config.functions.api;

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const COIN_RANKING_API = "https://api.coinranking.com";
const JFENIX_COIN_ID = "EMrmg_qJr";

const getHistory = async (ctx) => {
    const { timePeriod } = ctx.request.body;
    const { data } = await api.getHistory(timePeriod);
    return data;
}

const updateCoinData = async (ctx) => {
    const coinData = await strapi.config.functions.api.getCoinDetails();
    await strapi.services['coin-details'].createOrUpdate(coinData);
}

module.exports = {
    getHistory,
    updateCoinData
};
