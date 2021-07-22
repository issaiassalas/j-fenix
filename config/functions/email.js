'use strict';

const _ = require('lodash');

const sendDeviceActivationCode = async ({ user }, activation_code, id) => {
	const { 
		API_URL = 'http://localhost:1337',
		MAIL_FROM = 'issaiassalas@gmail.com'
	} = process.env ;
	const activationURL = `${API_URL}/devices/activation/${id}/${activation_code}`;
	const emailTemplate = {
		subject: 'Welcome <%= user.firstname %>',
		text: `Check this new device in your account.`,
		html: `<a href="${activationURL}">Activate</a>`,
	};

	try {
		await strapi.plugins.email.services.email.sendTemplatedEmail(
			{ to: user.email, from: MAIL_FROM }, emailTemplate,
		  	{ user: _.pick(user, ['username', 'email', 'firstname', 'lastname']) }
		);
	} catch (err) {
		console.log(err.response.body)
	}


};

module.exports = {
	sendDeviceActivationCode
};