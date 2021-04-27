'use strict';

const api = strapi.config.functions.api;

const balance = async (ctx) => {
    const { user } = ctx.state;
    const { wallet } = await strapi.services.account.findOne({
        user: user.id
    });
    const {
        balance,
        ...rest
    } = await api.getBalance(wallet);
    const { decimals } = await strapi.services['coin-details'].find();
    
    return {
        balance: balance / Math.pow(10, decimals),
        ...rest
    };
};

const transactions = async (ctx) => {
    const { user } = ctx.state;
    const { wallet } = await strapi.services.account.findOne({
        user: user.id
    });

    const transactions = await api.getTransactions(wallet);

    return transactions;
}

module.exports = {
    balance,
    transactions
};
