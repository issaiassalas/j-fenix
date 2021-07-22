'use strict';

const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { sanitizeEntity } = require('strapi-utils');

const create = async (ctx) => {
    const user_agent = ctx.request.header['user-agent'];
    const { user: { id: user } } = ctx.state;
    const account = await strapi.query('account').findOne({ user });
    if (!account) return ctx.badRequest('must have a account');

    const device_code = uuid.v4();
    const device_id = uuid.v4();
    const activation_code = uuid.v4().split('-').join('');

    console.log(activation_code);

    const device = await strapi.services.devices.create({
        account: account.id,
        device_id,
        device_code,
        user_agent,
        activation_code
    });
    await strapi.config.functions.email.sendDeviceActivationCode(account, activation_code, device.id);
    return {
        ...sanitizeEntity(device, { model: strapi.models.devices }),
        device_code
    };
}

const activateDevice = async (ctx) => {
    const { id, code } = ctx.params;

    let device = await strapi.services.devices.findOne({ id, status_in: ['PENDING', 'AVAILABLE'] });
    if (!device) return ctx.notFound('device not found');

    if (device.status === 'AVAILABLE') return ctx.badRequest('the devices is already available');

    if (!(await bcrypt.compare(code, device.activation_code))) {
        return ctx.badRequest('activation code is wrong');
    }

    device = await strapi.query('devices').update({ id: device.id }, {
        status: 'AVAILABLE'
    });

    return sanitizeEntity(device, { model: strapi.models.devices });
};

module.exports = {
    create,
    activateDevice
};
