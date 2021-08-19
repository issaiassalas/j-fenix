'use strict';

const refresh = async (ctx) => {
    await strapi.services['j-fenix-price'].newPrice();
}

const last = async (ctx) => {
    const results = await strapi.services['j-fenix-price'].find();
    return (results.reverse()[0] || {});
}

module.exports = {
    refresh,
    last
};
