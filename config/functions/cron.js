'use strict';

const { default: createStrapi } = require("strapi");

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/configurations.html#cron-tasks
 */

module.exports = {
  '*/1 * * * *': async () => {
    const coinData = await strapi.config.functions.api.getCoinDetails();
    await strapi.services['coin-details'].createOrUpdate(coinData);
    ;
  }
};
