'use strict';

const NodeRSA = require('node-rsa');
const bcrypt = require('bcryptjs')

const { PUBLIC_KEY, PRIVATE_KEY } = process.env;

const createKeys = async () => {
    const key = new NodeRSA({ b: 2048 });
    const encryption_key = key.exportKey('public');
    const decryption_key = key.exportKey('private');

    return { encryption_key, decryption_key };
}

const encrypt = (data, seed) => {
    const key = new NodeRSA(seed);
    if (typeof data === 'object') {
        return Object.keys(data).reduce((acc, cur) => {
            acc[cur] = key.encrypt(data[cur], 'base64');
            return acc;
        }, {})
    }
    return key.encrypt(data, 'base64');
}

const decrypt = (data, seed) => {
    const key = new NodeRSA(seed);
    return key.decrypt(data, 'utf8');
}

const create = async (data) => {
    const { secret_phrase, private_key } = data;
    const keys = await createKeys();
    const encryptedKeys = Object.keys(keys).reduce((acc, cur) => {
        acc[cur] = encrypt(keys[cur], PUBLIC_KEY);
        return acc;
    }, {});
    data = Object.assign(
        data, 
        encrypt({ secret_phrase, private_key }, keys.encryption_key), 
        encryptedKeys,
        {password: await bcrypt.hash(data.password, 10)}
    );
    const result = await strapi.query('account').create(data);
    return result;
}

const getSeed = async (user, { password, device_id, device_code }) => {
    const account = await strapi.services.account.findOne({ user });
    if (!account) return account;
    const device = account.devices.find(item => item.device_id === device_id && item.status === 'AVAILABLE');
    if (!device) return { error: true, message: 'device not found'};
    if (!(await bcrypt.compare(device_code, device.device_code)))
        return { error: true, message: 'device code is wrong' };

    if (await bcrypt.compare(password, account.password)) {
        const decryption_key = decrypt(account.decryption_key, PRIVATE_KEY);
        return decrypt(account.secret_phrase, decryption_key);
    }
    
    return {
        error: true,
        message: 'wrong password'
    };
}

module.exports = {
    create,
    getSeed
};
