'use strict';

const axios = require('axios');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const COIN_RANKING_API = "https://api.coinranking.com";
const JFENIX_COIN_ID = "EMrmg_qJr";

const getHistory = async (ctx) => {
    const { timePeriod } = ctx.query;
    const { data } = await axios.get(
        `/v2/coin/${JFENIX_COIN_ID}/history`,
        { baseURL: COIN_RANKING_API, params: { timePeriod } }
    );
    ctx.send({ ...data.data });
}

module.exports = {
    getHistory
};
