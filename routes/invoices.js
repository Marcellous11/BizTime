const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
	try {
		const results = await db.query('SELECT * FROM invoices');

		res.json(results.rows);
	} catch (e) {
		next(e);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		const result = await db.query('SELECT * FROM invoices WHERE id = $1', [ req.params.id ]);
		res.json(result.rows);
	} catch (e) {
		next(e);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const result = await db.query(
			'INSERT INTO invoices (comp_Code, amt, paid, paid_date) VALUES ($1,$2,$3,$4) RETURNING *',
			[ req.body.comp_Code, req.body.amt, req.body.paid, req.body.paid_date ]
		);

		return res.status(201).json(result.rows);
	} catch (e) {
		return next(e);
	}
});

router.put('/:id', async (req, res, next) => {
	try {
		const result = await db.query(
			'UPDATE invoices SET comp_Code=$1, amt=$2, paid=$3, paid_date=$4 WHERE id=$5 RETURNING * ',
			[ req.body.comp_Code, req.body.amt, req.body.paid, req.body.paid_date, req.params.id ]
		);

		return res.json({ invocies: result.rows[0] });
	} catch (e) {
		return next(e);
	}
});

router.delete('/:id', async (req, res, next) => {
	try {
		const result = await db.query('DELETE FROM invoices WHERE id =$1', [ req.params.id ]);
		return res.json({ msg: 'Deleted' });
	} catch (e) {
		next(e);
	}
});

module.exports = router;
