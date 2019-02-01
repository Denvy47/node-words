'use strict';

let engWords = [];
let ruWords = [];

const showBtn = document.getElementById('show-tr-btn');
const resetBtn = document.getElementById('reset-btn');
const addBtn = document.getElementById('add-wrd-btn');
const remBtn = document.getElementById('rem-wrd-btn');
const startBtn = document.getElementById('btn__start');
let wordsInSection = +prompt('Number of words you will see in one section: ');

showBtn.addEventListener('click', showAnswers);
resetBtn.addEventListener('click', replaceWords);
addBtn.addEventListener('click', addWordToDB);
remBtn.addEventListener('click', removeWordFromDB);
startBtn.addEventListener('click', start);

getData();

function start() {
	const hiddenElems = document.querySelectorAll('.hide');

	for (let i = 0; i < hiddenElems.length; i++) {
		hiddenElems[i].classList.remove('hide');
	}

	startBtn.style.display = 'none';

	insertRandomEngWords();	
	insertRandomRuWords();			
}

function insertRandomEngWords() {
	let index;
	let word;
	let translate;
	const parentWords = document.querySelector('.eng-words');
	const parentTranslate = document.querySelector('.eng-words-translate');

	for (let i = 0; i < wordsInSection; i++) {
		index = Math.floor(Math.random() * (engWords.length - 1));
		
		word = document.createElement('p');
		word.classList.add('word');
		word.innerHTML = ruWords[index];
		parentWords.appendChild(word);

		translate = document.createElement('p');
		translate.classList.add('wordt');
		translate.innerHTML = engWords[index]
		parentTranslate.appendChild(translate);
	};
}

function insertRandomRuWords() {
	let index;
	let word;
	let translate;
	const parentWords = document.querySelector('.ru-words');
	const parentTranslate = document.querySelector('.ru-words-translate');

	for (let i = 0; i < wordsInSection; i++) {
		index = Math.floor(Math.random() * (engWords.length - 1));
		
		word = document.createElement('p');
		word.classList.add('word');
		word.innerHTML = engWords[index];
		parentWords.appendChild(word);

		translate = document.createElement('p');
		translate.classList.add('wordt');
		translate.innerHTML = ruWords[index]
		parentTranslate.appendChild(translate);
	};
}

function replaceWords() {
	let index;
	const words = document.querySelectorAll('.word');
	const wordt = document.querySelectorAll('.wordt');

	for (let i = 0; i < wordsInSection; i++) {
		index = Math.floor(Math.random() * (engWords.length - 1));
		words[i].innerHTML = engWords[index];
		wordt[i].innerHTML = ruWords[index];
	}

	for (let i = wordsInSection; i < wordsInSection * 2; i++) {
		index = Math.floor(Math.random() * (engWords.length - 1));
		words[i].innerHTML = ruWords[index];
		wordt[i].innerHTML = engWords[index];
	}

	getData();
}

function showAnswers() {
	const wordt = document.querySelectorAll('.wordt');

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
	let newEngWord;
	let newRuWord;
	let link; 

	newEngWord = prompt('Enter the word (eng): ');
	if (newEngWord === null || newEngWord === '') {
		alert('Field must contain 1 symbol or more!')
	} else {
		newRuWord = prompt('Enter the translate (rus): ');
		if (newRuWord === null || newRuWord === '') {
			alert('Field must contain 1 symbol or more!');
		} else {
			link = '/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord;
			sendGetHttp(link);
		}
	}
}

function removeWordFromDB() {
	const delWord = prompt('Введите слово для удаления (англ.): ');
	const link = '/removeWord?engWord=' + delWord;

	if (delWord === null || delWord === ''){
		alert('Field must contain 1 symbol or more!')
	} else {
		sendGetHttp(link);
	}
}

function sendGetHttp(link) {
	fetch(link)
		.then(function (response) {
			if (response.status != 200) {
				alert(response.status + ': ' + response.statusText);
			} else {
				alert('Operation completed');
			}
		})
}