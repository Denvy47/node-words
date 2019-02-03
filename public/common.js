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
const sendId = document.getElementById('form__btn-del');
const closeBtn1 = document.getElementById('form__btn-close');
const inputWordFormBlock = document.querySelectorAll('.form__container');
const inputStart = document.getElementById('input__start');
let wordsInSection;

showBtn.addEventListener('click', showAnswers);
resetBtn.addEventListener('click', replaceWords);
addBtn.addEventListener('click', function () { showForm(inputWordFormBlock[0]) });
closeBtn.addEventListener('click', function () { showForm(inputWordFormBlock[0]) });
sendBtn.addEventListener('click', addWordToDB);
remBtn.addEventListener('click', function () { showForm(inputWordFormBlock[1]) });
closeBtn1.addEventListener('click', function () { showForm(inputWordFormBlock[1]) });
sendId.addEventListener('click', removeWordFromDB);
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
		selector.style.zIndex = 0;
	} else {
		selector.style.opacity = 1;
		selector.style.zIndex = 99;
	}
}

function addWordToDB() {
	let newEngWord = document.getElementById('input-eng').value;
	let newRuWord = document.getElementById('input-rus').value;
	let link;

	//Проверяем поля на наличие символов и показываем ошибку
	if (newEngWord === '' || newRuWord === '') {
		let err = document.querySelectorAll('.input__error');
		err[0].style.opacity = 1;

		//удаляем ошибку через 4 сек
		setTimeout(function () { err[0].style.opacity = 0; }, 4000);

	} else {
		//если поля не пустые, то формируем ссылку, отправляем запрос, показываем саккссес
		const inputSuccess = document.querySelectorAll('.input__success');
		link = '/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord;
		sendGetHttp(link);
		inputSuccess[0].style.opacity = 1;

		//убираем акссесс через 4 секунды
		setTimeout(function () { inputSuccess[0].style.opacity = 0; }, 4000);

		//очищаем поля после отправки запроса
		const formInput = document.querySelectorAll('.form__input');
		for (let i = 0; i < formInput.length; i++) {
			formInput[i].value = '';
		}
	}

}

function removeWordFromDB() {
	const delWord = document.getElementById('form__input-del').value;
	let link;
	
	if (delWord === '') {
		let err = document.querySelectorAll('.input__error');
		err[1].style.opacity = 1;

		//удаляем ошибку через 4 сек
		setTimeout(function () { err[1].style.opacity = 0; }, 4000);

	} else {
		//если поля не пустые, то формируем ссылку, отправляем запрос, показываем саккссес
		const inputSuccess = document.querySelectorAll('.input__success');
		link = '/removeWord?engWord=' + delWord;
		sendGetHttp(link);
		inputSuccess[1].style.opacity = 1;

		//убираем акссесс через 4 секунды
		setTimeout(function () { inputSuccess[1].style.opacity = 0; }, 4000);

		//очищаем поля после отправки запроса
		const formInput = document.querySelectorAll('.form__input');
		for (let i = 0; i < formInput.length; i++) {
			formInput[i].value = '';
		}
	}

	// if () {
	// 	alert('Field must contain 1 symbol or more!')
	// } else {
	// 	const link = '/removeWord?engWord=' + delWord;
	// 	sendGetHttp(link);
	// }
}

function sendGetHttp(link) {
	fetch(link)
		.then(function (response) {
			if (response.status != 200) {
				alert(response.status + ': ' + response.statusText);
			}
		})
}