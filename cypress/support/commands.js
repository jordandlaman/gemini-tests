/// <reference types="Cypress" />
var crypto = require('crypto');

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('sendRequestToGeminiAPI', ({ request, symbol, amount, price, side, type, options }) => {
    let payload
    payload = JSON.stringify({
		request: request || '/v1/order/new',
		nonce: Date.now(),
		symbol: symbol || 'btcusd',
		amount: amount || '5',
		price: price || '3633.00',
		side: side || 'buy',
		type: type || 'exchange limit',
		options: options || ['maker-or-cancel'],
	});
     const encoded_payload = new Buffer(payload).toString('base64');
		const signature = crypto
			.createHmac('sha384', Cypress.env('api-secret'))
			.update(encoded_payload)
			.digest('hex');

		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': Cypress.env('api-key'),
				'X-GEMINI-PAYLOAD': encoded_payload,
				'X-GEMINI-SIGNATURE': signature,
			},
			failOnStatusCode: false,
		});
});
