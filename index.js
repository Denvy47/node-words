const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const connect = {
	// host: 'packy.db.elephantsql.com',
	// port: 5432,
	// database: 'iekeqaju',
	// user: 'iekeqaju',
	// password: 'c3xxRc5LjmG9cWkY9lu2TdYdfZA_N7uo'
	host: 'localhost',
	port: 5432,
	database: 'postgres',
	user: 'postgres',
	password: 'postgres'
};
const db = pgp(connect);

app.use(express.static('public'));

app.get('/getData', function (req, res) {
	db.any('SELECT * FROM words')
		.then(function (result) {
			res.json(result);
		})
})

app.get('/add-new-word', function (req, res) {
	db.none('INSERT INTO words(eng_words, rus_words) VALUES(${eng}, ${rus})', {
		eng: req.query.engWord,
		rus: req.query.ruWord
	})

	res.send('Ok');
});

app.get('/removeWord', function (req, res) {
	db.none('DELETE FROM words WHERE eng_words = ${eng}', {
		eng: req.query.engWord
	})

	res.send('Ok');
})

app.listen(process.env.PORT || 8080, () => console.log("All is ok"));