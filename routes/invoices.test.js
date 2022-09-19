process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
const db = require('../db');

let testInvo;

beforeEach(async function() {
	let comp = await db.query(`INSERT INTO companies
    VALUES ('goo','google','Large tech company') RETURNING *`);
	let result = await db.query(`INSERT INTO invoices (comp_Code, amt, paid, paid_date)
    VALUES ('goo',750,'f','2022-09-18') RETURNING *`);
	testInvo = result.rows[0];
});

describe('GET /invoices', () => {
	test('Get list of all the invoices', async () => {
		const response = await request(app).get(`/invoices/`);
		expect(response.statusCode).toEqual(200);
	});
});

describe('GET /invoice/id', () => {
	test('Get a specific invoice', async () => {
		const response = await request(app).get(`/invoices/${testInvo.id}`);
		expect(response.statusCode).toEqual(200);
	});
});

describe('POST /invoices/', () => {
	test('Get a specific company', async () => {
		const response = await request(app).post(`/invoices`).send({
			comp_Code: 'goo',
			amt: '11111',
			paid: 'f',
			paid_date: '2022-09-18'
		});

		expect(response.statusCode).toEqual(201);
	});
});

describe('DELETE /invoices/id', () => {
	test('test to see if you can delete a company', async () => {
		const response = await request(app).delete(`/invoices/${testInvo.id}`);
		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({ msg: 'Deleted' });
	});
});

afterEach(async () => {
	await db.query('DELETE FROM invoices');
	await db.query('DELETE FROM companies');
});

afterAll(async () => {
	await db.end();
});
