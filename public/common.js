'use strict';

let engWords = [];
let ruWords = [];
const showBtn = document.getElementById('show-tr-btn');
const resetBtn = document.getElementById('reset-btn');
const addBtn = document.getElementById('add-wrd-btn');
const remBtn = document.getElementById('rem-wrd-btn');

showBtn.addEventListener('click', showAnswers);
resetBtn.addEventListener('click', reset);
addBtn.addEventListener('click', addWordToDB);
remBtn.addEventListener('click', removeWordFromDB);

getData();

function insertRandomEngWord(word, wordTr) {
	let index = Math.floor(Math.random() * (engWords.length - 1));
	document.getElementById(word).innerHTML = engWords[index];
	document.getElementById(wordTr).innerHTML = ruWords[index];
}

function insertRandomRuWord(word, wordTr) {
	let index = Math.floor(Math.random() * (ruWords.length - 1));
	document.getElementById(word).innerHTML = ruWords[index];
	document.getElementById(wordTr).innerHTML = engWords[index];
}

function showAnswers() {
	let wordt = document.querySelectorAll('.wordt');

	if (showBtn.innerHTML === 'Show') {
		showBtn.innerHTML = 'Hide';
		for (let i = 0; i < wordt.length; i++) {
			wordt[i].style.visibility = 'visible';
		}
	} else {
		showBtn.innerHTML = 'Show';
		for (let i = 0; i < wordt.length; i++) {
			wordt[i].style.visibility = 'hidden';
		}
	}
}

function getData() {

	fetch('/getData')
		.then(response => {
			return response.json()
		}).then(data => {
			for (let i = 0; i < data.length; i++) {
				engWords.push(data[i].eng_words);
				ruWords.push(data[i].rus_words);
			}
			console.log(data);
		})
}

function addWordToDB() {
	const newEngWord = prompt('Введите добавляемое слово (англ.): ');
	const newRuWord = prompt('Введите перевод добавляемого слова (рус.): ');
	const link = '/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord;
	sendGetHttp(link);
}

function removeWordFromDB() {
	const remWord = prompt('Введите слово для удаления (англ.): ');
	const link = '/removeWord?engWord=' + remWord;
	sendGetHttp(link);
}

function reset() {
	resetBtn.innerHTML = 'Reset';

	insertRandomEngWord('word1', 'word1t');
	insertRandomEngWord('word2', 'word2t');
	insertRandomEngWord('word3', 'word3t');
	insertRandomEngWord('word4', 'word4t');
	insertRandomRuWord('word5', 'word5t');
	insertRandomRuWord('word6', 'word6t');
	insertRandomRuWord('word7', 'word7t');
	insertRandomRuWord('word8', 'word8t');
}

function sendGetHttp(link) {
	fetch(link)
		.then(function (response) {
			if (response.status != 200) {
				alert(response.status + ': ' + response.statusText);
			} else {
				alert('Operation completed');
			}
		}) .then(getData())
}