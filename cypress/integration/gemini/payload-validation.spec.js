/// <reference types="Cypress" />

describe('Order Payload Manipulation - Negative Cases', () => {
	it('should make an invalid XHR request against the /v1/order/new endpoint using a bad payload REQUEST', () => {
		//this custom command is found in the cypress/support/command.js file - I wanted to be able to manipulate the
		//encoded payload without duplicating the code everytime
		cy.sendRequestToGeminiAPI({
			request: '/v2/order/new',
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.contain('EndpointMismatch');
			expect(response.body.reason).to.eq('EndpointMismatch');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint using a bad payload SYMBOL', () => {
		//this custom command is found in the cypress/support/command.js file - wanted to be able to manipulate the
		//encoded payload without duplicating the code everytime I wanted to use it in a different block
		cy.sendRequestToGeminiAPI({
			symbol: 'jdlcoin',
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq(
				"Received bad symbol 'jdlcoin' but expected a supported symbol from ['BTCUSD', 'ETHBTC', 'ETHUSD', 'BCHUSD', 'BCHBTC', 'BCHETH', 'LTCUSD', 'LTCBTC', 'LTCETH', 'LTCBCH', 'ZECUSD', 'ZECBTC', 'ZECETH', 'ZECBCH', 'ZECLTC']"
			);
			expect(response.body.reason).to.eq('InvalidSymbol');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint using a bad payload AMOUNT', () => {
		//this custom command is found in the cypress/support/command.js file - wanted to be able to manipulate the
		//encoded payload without duplicating the code everytime I wanted to use it in a different block
		cy.sendRequestToGeminiAPI({
			amount: '-500',
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq('Invalid quantity for symbol BTCUSD: -500');
			expect(response.body.reason).to.eq('InvalidQuantity');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint using a bad payload PRICE', () => {
		//this custom command is found in the cypress/support/command.js file - wanted to be able to manipulate the
		//encoded payload without duplicating the code everytime I wanted to use it in a different block
		cy.sendRequestToGeminiAPI({
			price: '10000000',
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq('Invalid price for symbol BTCUSD: 10000000');
			expect(response.body.reason).to.eq('InvalidPrice');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint using a bad payload SIDE', () => {
		//this custom command is found in the cypress/support/command.js file - wanted to be able to manipulate the
		//encoded payload without duplicating the code everytime I wanted to use it in a different block
		cy.sendRequestToGeminiAPI({
			side: 'foobar',
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq("Invalid side for symbol BTCUSD: 'foobar'");
			expect(response.body.reason).to.eq('InvalidSide');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint using a bad payload TYPE', () => {
		//this custom command is found in the cypress/support/command.js file - wanted to be able to manipulate the
		//encoded payload without duplicating the code everytime I wanted to use it in a different block
		cy.sendRequestToGeminiAPI({
			type: 'something bad',
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq("Invalid order type for symbol BTCUSD: 'something bad'");
			expect(response.body.reason).to.eq('InvalidOrderType');
			expect(response.body.result).to.eq('error');
		});
	});
	it('should make an invalid XHR request against the /v1/order/new endpoint using a bad payload OPTION', () => {
		//this custom command is found in the cypress/support/command.js file - wanted to be able to manipulate the
		//encoded payload without duplicating the code everytime I wanted to use it in a different block
		cy.sendRequestToGeminiAPI({
			options: ['naughty-option'],
		}).should(response => {
			expect(response.status).to.eq(400);
			expect(response.body.message).to.eq('Option "naughty-option" is not supported.');
			expect(response.body.reason).to.eq('UnsupportedOption');
			expect(response.body.result).to.eq('error');
		});
	});
});
describe('Order Payload Manipulation - Valid Cases', () => {
	it('should make a valid XHR request against the /v1/order/new endpoint using a variable payload SYMBOL', () => {
		cy.sendRequestToGeminiAPI({
			symbol: 'ETHUSD',
		}).should(response => {
			expect(response.status).to.eq(200);
			expect(response.body.avg_execution_price).to.eq('0.00');
			expect(response.body.executed_amount).to.eq('0');
			expect(response.body.is_cancelled).to.eq(true);
			expect(response.body.is_hidden).to.eq(false);
			expect(response.body.is_live).to.eq(false);
			expect(response.body.original_amount).to.eq('5');
			expect(response.body.remaining_amount).to.eq('5');
			expect(response.body.side).to.eq('buy');
			expect(response.body.type).to.eq('exchange limit');
			expect(response.body.was_forced).to.eq(false);
			expect(response.body.symbol).to.eq('ethusd');
			expect(response.body.options).to.contain('maker-or-cancel');
			expect(response.body).to.have.property('timestamp');
			expect(response.body).to.have.property('timestampms');
			expect(response.body).to.have.property('order_id');
			expect(response.body).to.have.property('id');
		});
	});
	it('should make a valid XHR request against the /v1/order/new endpoint using a variable payload OPTION', () => {
		cy.sendRequestToGeminiAPI({
			options: ['fill-or-kill'],
		}).should(response => {
			expect(response.status).to.eq(200);
			expect(response.body.avg_execution_price).to.eq('0.00');
			expect(response.body.executed_amount).to.eq('0');
			expect(response.body.is_cancelled).to.eq(true);
			expect(response.body.is_hidden).to.eq(false);
			expect(response.body.is_live).to.eq(false);
			expect(response.body.original_amount).to.eq('5');
			expect(response.body.remaining_amount).to.eq('5');
			expect(response.body.side).to.eq('buy');
			expect(response.body.type).to.eq('exchange limit');
			expect(response.body.was_forced).to.eq(false);
			expect(response.body.symbol).to.eq('btcusd');
			expect(response.body.options).to.contain('fill-or-kill');
			expect(response.body).to.have.property('timestamp');
			expect(response.body).to.have.property('timestampms');
			expect(response.body).to.have.property('order_id');
			expect(response.body).to.have.property('id');
		});
	});
	//Rinse and repeat it blocks for different valid permutations
});
