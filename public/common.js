'use strict';

let engWords = [];
let ruWords = [];
const showBtn = document.getElementById('show-tr-btn');
const resetBtn = document.getElementById('reset-btn');
const addBtn = document.getElementById('add-wrd-btn');
const remBtn = document.getElementById('rem-wrd-btn');

console.log('Общее количество слов: ' + engWords.length);
showBtn.addEventListener('click', showAnswers);
resetBtn.addEventListener('click', reload);
addBtn.addEventListener('click', addWordToDB);
remBtn.addEventListener('click', removeWordFromDB);

insertRandomEngWord('word1', 'word1t');
insertRandomEngWord('word2', 'word2t');
insertRandomEngWord('word3', 'word3t');
insertRandomEngWord('word4', 'word4t');
insertRandomRuWord('word5', 'word5t');
insertRandomRuWord('word6', 'word6t');
insertRandomRuWord('word7', 'word7t');
insertRandomRuWord('word8', 'word8t');

function insertRandomEngWord(word, wordTr) {
	let index = Math.floor(Math.random() * engWords.length);
	document.getElementById(word).innerHTML = engWords[index];
	document.getElementById(wordTr).innerHTML = ruWords[index];
}

function insertRandomRuWord(word, wordTr) {
	let index = Math.floor(Math.random() * ruWords.length);
	document.getElementById(word).innerHTML = ruWords[index];
	document.getElementById(wordTr).innerHTML = engWords[index];
}

function showAnswers() {
	let wordt = document.querySelectorAll('.wordt');

	if (showBtn.innerHTML == 'Show') {
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

function reload() {
	document.location.reload();
}

function addWordToDB() {
	const newEngWord = prompt('Введите добавляемое слово (англ.): ');
	const newRuWord = prompt('Введите перевод добавляемого слова (рус.): ');	

	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:3000/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord, false);
	xhr.send();
	if (xhr.status != 200) {
		alert(xhr.status + ': ' + xhr.statusText);
	} else {
		alert(xhr.responseText);
	}
}

function removeWordFromDB() {
	const remWord = prompt('Введите слово для удаления (англ.): ');

	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://localhost:3000/removeWord?engWord=' + remWord, false);
	xhr.send();
	if (xhr.status != 200) {
		alert(xhr.status + ': ' + xhr.statusText);
	} else {
		alert(xhr.responseText);
	}
}