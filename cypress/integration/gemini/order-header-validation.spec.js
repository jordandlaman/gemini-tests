/// <reference types="Cypress" />
var crypto = require('crypto');

describe('Gemini /v1/order/new API', () => {

	const t = Date.now();
	const payload = JSON.stringify({
		request: '/v1/order/new',
		nonce: t,
		symbol: 'btcusd',
		amount: '5',
		price: '3633.00',
		side: 'buy',
		type: 'exchange limit',
		options: ['maker-or-cancel'],
	});

	const encoded_payload = new Buffer(payload).toString('base64');
	const signature = crypto
		.createHmac('sha384', Cypress.env('api-secret'))
		.update(encoded_payload)
		.digest('hex');

	it('should make a valid XHR request against the /v1/order/new endpoint', () => {
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': Cypress.env('api-key'),
				'X-GEMINI-PAYLOAD': encoded_payload,
				'X-GEMINI-SIGNATURE': signature,
			},
		}).should(response => {
			expect(response.status).to.eq(200);
			expect(response.body.avg_execution_price).to.eq('0.00');
			expect(response.body.executed_amount).to.eq('0');
			expect(response.body.is_cancelled).to.eq(false);
			expect(response.body.is_hidden).to.eq(false);
			expect(response.body.is_live).to.eq(true);
			expect(response.body.original_amount).to.eq('5');
			expect(response.body.remaining_amount).to.eq('5');
			expect(response.body.side).to.eq('buy');
			expect(response.body.type).to.eq('exchange limit');
			expect(response.body.was_forced).to.eq(false);
			expect(response.body.symbol).to.eq('btcusd');
			expect(response.body.options).to.contain('maker-or-cancel');
			expect(response.body).to.have.property('timestamp');
			expect(response.body).to.have.property('timestampms');
			expect(response.body).to.have.property('order_id');
			expect(response.body).to.have.property('id');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint with no incremented nonce value', () => {
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': Cypress.env('api-key'),
				'X-GEMINI-PAYLOAD': encoded_payload,
				'X-GEMINI-SIGNATURE': signature,
			},
			failOnStatusCode: false,
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.contain(
				"Nonce '" + t + "' has not increased since your last call to the Gemini API."
			);
			expect(response.body.reason).to.eq('InvalidNonce');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint with no api key header', () => {
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-PAYLOAD': encoded_payload,
				'X-GEMINI-SIGNATURE': signature,
			},
			failOnStatusCode: false,
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq("Must provide 'X-GEMINI-APIKEY' header");
			expect(response.body.reason).to.eq('MissingApikeyHeader');
			expect(response.body.result).to.eq('error');
		});
	});

	it('should make an invalid XHR request against the /v1/order/new endpoint with no payload header', () => {
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': Cypress.env('api-key'),
				'X-GEMINI-SIGNATURE': signature,
			},
			failOnStatusCode: false,
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq("Must provide 'X-GEMINI-PAYLOAD' header");
			expect(response.body.reason).to.eq('MissingPayloadHeader');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint with no signature header', () => {
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': Cypress.env('api-key'),
				'X-GEMINI-PAYLOAD': encoded_payload,
			},
			failOnStatusCode: false,
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq("Must provide 'X-GEMINI-SIGNATURE' header");
			expect(response.body.reason).to.eq('MissingSignatureHeader');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint with a bad X-GEMINI-SIGNATURE header', () => {
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': Cypress.env('api-key'),
				'X-GEMINI-PAYLOAD': encoded_payload,
				'X-GEMINI-SIGNATURE': 'a8sud8298du298du9du289u8d29',
			},
			failOnStatusCode: false,
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq('InvalidSignature');
			expect(response.body.reason).to.eq('InvalidSignature');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint with a bad X-GEMINI-PAYLOAD header', () => {
		// Is this ERR messaging wrong? Or is it intentional to obfuscate what you have done wrong in case of malicious actors trying to authenticate?
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': Cypress.env('api-key'),
				'X-GEMINI-PAYLOAD': 'jds98das9djsa9djas98djs9s9adjs9adjs9ada9djsa89djs9a',
				'X-GEMINI-SIGNATURE': signature,
			},
			failOnStatusCode: false,
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq('InvalidSignature');
			expect(response.body.reason).to.eq('InvalidSignature');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint with a bad X-GEMINI-APIKEY header', () => {
		// Is this ERR messaging wrong? Or is it intentional to obfuscate what you have done wrong in case of malicious actors trying to authenticate?
		cy.request({
			url: '/v1/order/new',
			method: 'POST',
			headers: {
				'X-GEMINI-APIKEY': '9u8a9dusa9dus8a9dus8a9dusa9ud89sa',
				'X-GEMINI-PAYLOAD': encoded_payload,
				'X-GEMINI-SIGNATURE': signature,
			},
			failOnStatusCode: false,
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq('InvalidSignature');
			expect(response.body.reason).to.eq('InvalidSignature');
			expect(response.body.result).to.eq('error');
		});
	});
});
