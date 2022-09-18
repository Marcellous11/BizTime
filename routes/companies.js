const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
	try {
		const results = await db.query('SELECT * FROM companies;');
		return res.json(results.rows);
	} catch (e) {
		return next(e);
	}
});
router.get('/:code', async (req, res) => {
	try {
		const user = await db.query('SELECT * FROM companies WHERE code=$1', [ req.params.code ]);
		return res.json({ user });
	} catch (e) {
		return next(e);
	}
});
router.post('/', async (req, res) => {
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
// router.get('/', async (req, res) => {
// 	const results = await db.query('SELECT * FROM companies;');
// 	return res.json(results.rows);
// });

module.exports = router;

// const results = await db.query('DELETE FROM companies WHERE id = $1',[req.params.id]);
