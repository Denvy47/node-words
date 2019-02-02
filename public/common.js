'use strict';

let engWords = [];
let ruWords = [];

const showBtn = document.getElementById('show-tr-btn');
const resetBtn = document.getElementById('reset-btn');
const addBtn = document.getElementById('add-wrd-btn');
const remBtn = document.getElementById('rem-wrd-btn');
const startBtn = document.getElementById('btn__start');
const sendBtn = document.querySelector('#form__send');
const closeBtn = document.querySelector('#form__close');
const inputWordFormBlock = document.querySelector('.form__container');
const inputStart = document.getElementById('input__start');
let wordsInSection;

showBtn.addEventListener('click', showAnswers);
resetBtn.addEventListener('click', replaceWords);
addBtn.addEventListener('click', function() { showForm(inputWordFormBlock) });
closeBtn.addEventListener('click', function() { showForm(inputWordFormBlock) });
sendBtn.addEventListener('click', addWordToDB);
remBtn.addEventListener('click', removeWordFromDB);
startBtn.addEventListener('click', start);

getData();

inputStart.oninput = function () {
	if (this.value.length > 1) {
		this.value = this.value.slice(0, 1);
	}
}

function start() {
	const startContainer = document.querySelector('.start-container');
	wordsInSection = +inputStart.value;

	const hiddenElems = document.querySelectorAll('.hide');

	for (let i = 0; i < hiddenElems.length; i++) {
		hiddenElems[i].classList.remove('hide');
	}

	startContainer.classList.add('hide');

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

	for (let i = wordsInSection; i < Math.floor(wordsInSection * 2); i++) {
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

function showForm(selector) {
	if (selector.style.opacity == 1) {
		selector.style.opacity = 0;
	} else {
		selector.style.opacity = 1;
	}
}

function addWordToDB() {
	let newEngWord;
	let newRuWord;
	let link;

	//проверяем показывается ли форма
	if (inputWordFormBlock.style.opacity == 1) {
		newEngWord = document.getElementById('input-eng').value;
		newRuWord = document.getElementById('input-rus').value;

		//Проверяем поля на наличие символов и показываем ошибку
		if (newEngWord === '' || newRuWord === '') {
			let err = document.querySelector('.input__error');
			err.style.opacity = 1;

			//удаляем ошибку через 4 сек
			setTimeout(function () { err.style.opacity = 0; }, 4000);
			} else {

			//если поля не пустые, то формируем ссылку, отправляем запрос, показываем саккссес
			const inputSuccess = document.querySelector('.input__successful');
			link = '/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord;
			sendGetHttp(link);
			inputSuccess.style.opacity = 1;	
			
			//убираем акссесс через 4 секунды
			setTimeout(function () { inputSuccess.style.opacity = 0; }, 4000);

			//очищаем поля после отправки запроса
			const formInput = document.querySelectorAll('.form__input');
			for (let i = 0; i < formInput.length; i++) {
				formInput[i].value = '';
			}
		}
	} else {
		inputWordFormBlock.style.opacity = 1;
	}
}

function removeWordFromDB() {
	const delWord = prompt('Введите слово для удаления (англ.): ');
	const link = '/removeWord?engWord=' + delWord;

	if (delWord === null || delWord === '') {
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
			}
		})
}