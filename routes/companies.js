const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query('SELECT * FROM companies;');
		return res.json(results.rows);
	} catch (e) {
		return next(e);
	}
});
router.get('/:code', async (req, res, next) => {
	try {
		const comp = await db.query('SELECT * FROM companies WHERE code=$1', [ req.params.code ]);
		return res.json({ comp: comp.rows });
	} catch (e) {
		return next(e);
	}
});
router.post('/', async (req, res, next) => {
	try {
		const { code, name, description } = req.body;
		const results = await db.query('INSERT INTO companies (code,name,description) VALUES ($1,$2,$3) RETURNING *', [
			code,
			name,
			description
		]);
		return res.json(results.rows);
	} catch (e) {
		next(e);
	}
});
router.put('/:code', async (req, res, next) => {
	try {
		const results = await db.query(
			'UPDATE companies SET code=$1,name=$2,description=$3 WHERE code=$4 RETURNING *;',
			[ req.body.code, req.body.name, req.body.description, req.params.code ]
		);
		return res.json(results.rows[0]);
	} catch (e) {
		return next(e);
	}
});

router.delete('/:code', async (req, res, next) => {
	try {
		const result = await db.query('DELETE FROM companies WHERE code=$1', [ req.params.code ]);
		return res.json({ mes: 'Deleted' });
	} catch (e) {
		return next(e);
	}
});

module.exports = router;
