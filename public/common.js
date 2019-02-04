'use strict';

let engWords = [];
let ruWords = [];

//вешаем события на кнопки на главном экране
const startBtn = document.getElementById('btn__start');
startBtn.addEventListener('click', start);

const resetBtn = document.getElementById('reset-btn');
resetBtn.addEventListener('click', replaceWords);

const addBtn = document.getElementById('add-wrd-btn');
addBtn.addEventListener('click', showForm);

const remBtn = document.getElementById('rem-wrd-btn');
remBtn.addEventListener('click', showForm);

const showBtn = document.getElementById('show-tr-btn');
showBtn.addEventListener('click', showAnswers);

//выбираем формы
const addForm = document.querySelector('.form__container_add');
const delForm = document.querySelector('.form__container_del');

//вешаем события на кнопки в формах
const addBtnOnForm = document.getElementById('form__btn-add');
addBtnOnForm.addEventListener('click', addWordToDB);

const closeBtnOnForm = document.querySelectorAll('.form__btn-close');
for (let i = 0; i < closeBtnOnForm.length; i++) {
	closeBtnOnForm[i].addEventListener('click', showForm);
}

const delBtnOnForm = document.getElementById('form__btn-del');
delBtnOnForm.addEventListener('click', removeWordFromDB);

const inputStart = document.getElementById('input__start');
let wordsPerSection;

inputStart.oninput = function () {
	if (this.value.length > 1) {
		this.value = this.value.slice(0, 1);
	}
}

getData();

function start() {
	const startContainer = document.querySelector('.start-container');
	wordsPerSection = +inputStart.value;

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

	for (let i = 0; i < wordsPerSection; i++) {
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

	for (let i = 0; i < wordsPerSection; i++) {
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

	for (let i = 0; i < wordsPerSection; i++) {
		index = Math.floor(Math.random() * (engWords.length - 1));
		words[i].innerHTML = engWords[index];
		wordt[i].innerHTML = ruWords[index];
	}

	for (let i = wordsPerSection; i < Math.floor(wordsPerSection * 2); i++) {
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
	fetch('https://node-words.herokuapp.com/getData')
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

function showForm(event) {
	let form = event.target.closest('.form-btn__container').firstElementChild;
	
	if (form.style.opacity == 1) {
		form.style.opacity = 0;
		form.style.zIndex = 0;
	} else {
		form.style.opacity = 1;
		form.style.zIndex = 99;
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
		link = 'https://node-words.herokuapp.com/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord;
		sendGetHttp(link);
		inputSuccess[0].style.opacity = 1;

		//убираем акссесс через 2 секунды
		setTimeout(function () { inputSuccess[0].style.opacity = 0; }, 2000);

		//очищаем поля после отправки запроса		
		clearInput();
	}

}

function removeWordFromDB() {
	const delWord = document.getElementById('form__input-del').value;
	let link;

	if (delWord === '') {
		let err = document.querySelectorAll('.input__error');
		err[1].style.opacity = 1;

		//удаляем ошибку через 2 сек
		setTimeout(function () { err[1].style.opacity = 0; }, 2000);

	} else {
		//если поля не пустые, то формируем ссылку, отправляем запрос, показываем саккссес
		const inputSuccess = document.querySelectorAll('.input__success');
		link = 'https://node-words.herokuapp.com/removeWord?engWord=' + delWord;
		sendGetHttp(link);
		inputSuccess[1].style.opacity = 1;

		//убираем cакссесс через 2 секунды
		setTimeout(function () { inputSuccess[1].style.opacity = 0; }, 2000);

		//очищаем поля после отправки запроса		
		clearInput();
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

//очищение полей в инпутах
function clearInput() {
	const formInput = document.querySelectorAll('.form__input');

	for (let i = 0; i < formInput.length; i++) {
		formInput[i].value = '';
	}
}