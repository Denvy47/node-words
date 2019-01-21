const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const connect = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
  };
const db = pgp(connect);

app.use(express.static('public'));

app.get('/add-new-word', function(req, res) {    
    res.send('Слово добавлено'); 
    
    db.none('INSERT INTO words(eng_words, rus_words) VALUES(${eng}, ${rus})', {
        eng: req.query.engWord,
        rus: req.query.ruWord   
    })
});

app.get('/removeWord', function(req, res) {
    res.send('Слово удалено');

    db.none('DELETE FROM words WHERE eng_words = ${eng}', {
        eng: req.query.engWord
    })
})

db.any('select * from words')
    .then(function (data) {
        console.log('DATA:', data)
    })

app.listen(3000, function () {
  console.log('Running on http://localhost:3000');
});