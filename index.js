const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const connect = {
    host: 'packy.db.elephantsql.com',
    port: 5432,
    database: 'iekeqaju',
    user: 'iekeqaju',
    password: 'c3xxRc5LjmG9cWkY9lu2TdYdfZA_N7uo'
  };
const db = pgp(connect);

app.use(express.static('public'));

app.get('/getData', function(req,res) {
    db.any('SELECT * FROM words')
        .then(function(result){
            res.json(result);
        })
})

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

app.listen(3000, function () {
  console.log('Running on http://localhost:3000');
});