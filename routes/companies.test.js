process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
const db = require('../db');

let testComp;

beforeEach(async function() {
	let result = await db.query(`INSERT INTO companies
    VALUES ('tar','target','shopping store') RETURNING *`);
	testComp = result.rows[0];
});

describe('GET /companies', () => {
	test('Get list of all the companies', async () => {
		const response = await request(app).get(`/companies`);
		expect(response.statusCode).toEqual(200);
		expect(response.body[0]).toEqual({
			code: 'tar',
			name: 'target',
			description: 'shopping store'
		});
	});
});

describe('GET /companies/code', () => {
	test('Get a specific company', async () => {
		const response = await request(app).get(`/companies/${testComp.code}`);
		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({ comp: [ testComp ] });
	});
});

describe('POST /companies/', () => {
	test('Get a specific company', async () => {
		const response = await request(app).post(`/companies/`).send({
			code: 'wal',
			name: 'walmart',
			description: 'Masssive shopping store'
		});
		expect(response.statusCode).toEqual(201);
		expect(response.body[0]).toEqual({
			code: 'wal',
			name: 'walmart',
			description: 'Masssive shopping store'
		});
	});
});

describe('DELETE /companies/code', () => {
	test('test to see if you can delete a company', async () => {
		const response = await request(app).delete(`/companies/${testComp.code}`);
		expect(response.statusCode).toEqual(200);
		expect(response.body).toEqual({ msg: 'Deleted' });
	});
});

afterEach(async () => {
	await db.query('DELETE FROM companies');
});

afterAll(async () => {
	await db.end();
});
