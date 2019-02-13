'use strict';

let engWords = [];
let ruWords = [];

//Вешаем событие на кнопку "Start"
document.getElementById('btn__start').addEventListener('click', start);

//Переменная для хранения количества слов в каждой секции
let wordsPerSection;

window.onload = getData();

//Обрезаем число слов в каждой секции до 1 символа в секции "Старт"
const inputStart = document.getElementById('input__start');
inputStart.oninput = function () {
	if (this.value.length > 1) {
		this.value = this.value.slice(0, 1);
	}
}

function start() {	

	//Вешаем события на кнопки на главном экране	
	document.getElementById('reset-btn').addEventListener('click', replaceWords);
	document.getElementById('add-wrd-btn').addEventListener('click', showForm);
	document.getElementById('rem-wrd-btn').addEventListener('click', showForm);
	document.getElementById('show-tr-btn').addEventListener('click', showAnswers);

	//Вешаем события на кнопки в формах
	document.getElementById('form__btn-add').addEventListener('click', addWordToDB);
	document.getElementById('form__btn-del').addEventListener('click', removeWordFromDB);
	const closeBtnOnForm = document.querySelectorAll('.form__btn-close');
	for (let i = 0; i < closeBtnOnForm.length; i++) {
		closeBtnOnForm[i].addEventListener('click', showForm);
	}

	//Присваиваем глобальной переменной значение числа слов в каждой секции
	wordsPerSection = +inputStart.value;

	//Показываем спрятанные элементы
	const hiddenElems = document.querySelectorAll('.hide');
	for (let i = 0; i < hiddenElems.length; i++) {
		hiddenElems[i].classList.remove('hide');
	}

	//Прячем секцию "Старт"
	document.querySelector('.start-container').classList.add('hide');

	createWords(engWords, ruWords);
}

function createWords(arrayWords, translateArrayWords) {
	let index;
	let word;
	let translate;
	const parentEngWords = document.querySelector('.eng-words');
	const parentEngTranslate = document.querySelector('.eng-words-translate');
	const parentRuWords = document.querySelector('.ru-words');
	const parentRusTranslate = document.querySelector('.ru-words-translate');
	
	//Проверка на повторяющиеся индексы
	let checkIndex = [];
	function containIndex(number) {	return number === index; }

	//Создаем HTML и вставляем значения из массивов-параметров
	for (let i = 0; i < wordsPerSection; i++) {
		index = Math.floor(Math.random() * (arrayWords.length - 1));

		if(checkIndex.some(containIndex)) {
			index = Math.floor(Math.random() * (arrayWords.length - 1));
			i--;
		} else {
			word = document.createElement('p');
			word.classList.add('word');
			word.innerHTML = arrayWords[index];
			parentEngWords.appendChild(word);

			translate = document.createElement('p');
			translate.classList.add('wordt');
			translate.innerHTML = translateArrayWords[index];
			parentEngTranslate.appendChild(translate);

			word = document.createElement('p');
			word.classList.add('word');
			word.innerHTML = translateArrayWords[index];
			parentRuWords.appendChild(word);

			translate = document.createElement('p');
			translate.classList.add('wordt');
			translate.innerHTML = arrayWords[index]
			parentRusTranslate.appendChild(translate);

			//Добавляем новое значение индекса в массив уже созданных индексов
			checkIndex.push(index);
		}		
	}
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
	const showBtn = document.getElementById('show-tr-btn');

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
	//fetch('https://node-words.herokuapp.com/getData')
	fetch('http://localhost:8080/getData')
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
		//link = 'https://node-words.herokuapp.com/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord;
		link = 'http://localhost:8080/add-new-word?ruWord=' + newRuWord + '&engWord=' + newEngWord;
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
		//link = 'https://node-words.herokuapp.com/removeWord?engWord=' + delWord;
		link = 'http://localhost:8080/removeWord?engWord=' + delWord;
		sendGetHttp(link);
		inputSuccess[1].style.opacity = 1;

		//убираем cакссесс через 2 секунды
		setTimeout(function () { inputSuccess[1].style.opacity = 0; }, 2000);

		//очищаем поля после отправки запроса		
		clearInput();
	}
}


//Вспомогательные функции
function sendGetHttp(link) {
	fetch(link)
		.then(function (response) {
			if (response.status != 200) {
				alert(response.status + ': ' + response.statusText);
			}
		})
}

function clearInput() {
	const formInput = document.querySelectorAll('.form__input');

	for (let i = 0; i < formInput.length; i++) {
		formInput[i].value = '';
	}
}

