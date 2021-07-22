'use strict';
const { broadcast, transfer } = require('@waves/waves-transactions');
const { sanitizeEntity } = require('strapi-utils');
const bs58 = require('bs58')
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

    console.log(wallet, '*****************************************************')

    const transactions = await api.getTransactions(wallet);

    return transactions;
}

const create = async (ctx) => {
    const { user: { id: user } } = ctx.state;
    const { body } = ctx.request;

    if (await strapi.services.account.findOne({ user })) {
        return ctx.badRequest('user has a account');
    }


    const entity = await strapi.services.account.create({ ...body, user });

    return sanitizeEntity(entity, { model: strapi.models.account });
}

const transferFunction = async (ctx) => {
    const { user: { id: user } } = ctx.state;
    const { recipient, amount, description } = ctx.request.body;
    const bytes = Buffer.from(description || '');
    const attachment = bs58.encode(bytes);
    const { decimals } = await strapi.services['coin-details'].find();
    const { JFX_ASSET_ID, WAVES_NODE_URL } = await strapi.config.functions.constants;
    // Math.pow(10, decimals);

    const seed = await strapi.services.account.getSeed(user, ctx.request.body);

    if (!seed) return seed;
    if (seed.error) return ctx.badRequest(seed.message);

    const money = { 
        recipient, amount: amount*Math.pow(10, decimals), assetId: JFX_ASSET_ID, description
    };
    let wavesResponse;
    try {
        const transferTx = transfer(money, seed);
        console.log(transferTx)
        wavesResponse = await broadcast(transferTx, WAVES_NODE_URL);
    } catch (err) {
        wavesResponse = err;
    }
    return wavesResponse;
}

module.exports = {
    balance,
    transactions,
    create,
    transferFunction
};
