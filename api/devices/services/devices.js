'use strict';

const bcrypt = require('bcryptjs');

const create = async (data) => {
    const device_code = await bcrypt.hash(data.device_code, 10);
    const activation_code = await bcrypt.hash(data.activation_code, 10);
    const device = await strapi.query('devices').create({
        ...data, device_code, activation_code
    });
    return device;
};

module.exports = {
    create
};
