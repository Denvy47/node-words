'use strict';

let engWords = [];
let ruWords = [];
let wordsPerSection;

window.onload = getData();

//Вешаем событие на кнопку "Start"
document.getElementById('btn__start').addEventListener('click', start);

//Обрезаем число слов в каждой секции до 1 символа в секции "Старт"
const inputStart = document.getElementById('input__start');
inputStart.oninput = function () {
	if (this.value.length > 1) {
		this.value = this.value.slice(0, 1);
	}
}


function start() {	

	//Проверяем, что слов в базе больше чем число слов в каждой секции
	if (engWords.length < inputStart.value * 2) {
		alert(`Words in database is too low. Enter a number less than ${(Math.floor(engWords.length / 2)) + 1}`);
	} else {
		//Вешаем события на кнопки на главном экране	
		document.getElementById('reset-btn').addEventListener('click', function() { replaceWords(engWords, ruWords) });
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
}

function createWords(arrayWords, translateArrayWords) {
	let index;
	let word;
	let translate;
	const parentEngWords = document.querySelector('.eng-words');
	const parentEngTranslate = document.querySelector('.eng-words-translate');
	const parentRuWords = document.querySelector('.ru-words');
	const parentRusTranslate = document.querySelector('.ru-words-translate');
	
	//Для проверки на повторяющиеся индексы в циклах
	let checkIndex = [];
	function containIndex(number) {	return number === index; }

	//Создаем html элементы в первой секции
	for (let i = 0; i < wordsPerSection; i++) {
		index = Math.floor(Math.random() * (arrayWords.length));

		if(checkIndex.some(containIndex)) {
			index = Math.floor(Math.random() * (arrayWords.length));
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

			checkIndex.push(index);
		}
	}

	//Создаем html элементы во второй секции
	for (let i = 0; i < wordsPerSection; i++) {
		index = Math.floor(Math.random() * (arrayWords.length));

		if(checkIndex.some(containIndex)) {
			index = Math.floor(Math.random() * (arrayWords.length));
			i--;
		} else {

			word = document.createElement('p');
			word.classList.add('word');
			word.innerHTML = translateArrayWords[index];
			parentRuWords.appendChild(word);

			translate = document.createElement('p');
			translate.classList.add('wordt');
			translate.innerHTML = arrayWords[index]
			parentRusTranslate.appendChild(translate);

			checkIndex.push(index);
		}
	}
}

function replaceWords(arrayWords, translateArrayWords) {
	let index;
	const words = document.querySelectorAll('.word');
	const wordt = document.querySelectorAll('.wordt');

	//Для проверки на повторяющиеся индексы в циклах
	let checkIndex = [];
	function containIndex(number) {	return number === index; }

	//Заменяем содержимое html элементов в первой секции
	for (let i = 0; i < wordsPerSection; i++) {
		index = Math.floor(Math.random() * (arrayWords.length));

		if(checkIndex.some(containIndex)) {
			index = Math.floor(Math.random() * (arrayWords.length));
			i--;
		} else {
			words[i].innerHTML = arrayWords[index];
			wordt[i].innerHTML = translateArrayWords[index];

			checkIndex.push(index);
		}
	}

	//Заменяем содержимое html элементов в первой секции
	for (let i = wordsPerSection; i < Math.floor(wordsPerSection * 2); i++) {
		index = Math.floor(Math.random() * (arrayWords.length));

		if(checkIndex.some(containIndex)) {
			index = Math.floor(Math.random() * (arrayWords.length));
			i--;
		} else {
			words[i].innerHTML = translateArrayWords[index];
			wordt[i].innerHTML = arrayWords[index];

			checkIndex.push(index);
		}
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
	fetch('https://node-words.herokuapp.com/getData')
	//fetch('http://localhost:8080/getData')
		.then(response => {
			return response.json()
		}).then(data => {
			engWords.length = 0;
			ruWords.length = 0;

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
		const err = document.querySelectorAll('.input__error');
		err[0].style.opacity = 1;

		//удаляем ошибку через 4 сек
		setTimeout(function() { err[0].style.opacity = 0; }, 4000);

	} else {
		//если поля не пустые, то формируем ссылку, отправляем запрос, показываем саккссес
		const inputSuccess = document.querySelectorAll('.input__success');
		link = `https://node-words.herokuapp.com/add-new-word?ruWord=${newRuWord}&engWord=${newEngWord}`;
		//link = `http://localhost:8080/add-new-word?ruWord=${newRuWord}&engWord=${newEngWord}`;
		sendGetHttp(link);
		inputSuccess[0].style.opacity = 1;

		//убираем акссесс через 2 секунды
		setTimeout(function() { inputSuccess[0].style.opacity = 0; }, 2000);

		//очищаем поля после отправки запроса		
		clearInput();
	}
}

function removeWordFromDB() {
	const delWord = document.getElementById('form__input-del').value;
	let link;

	if (delWord === '') {
		const err = document.querySelectorAll('.input__error');
		err[1].style.opacity = 1;

		//удаляем ошибку через 2 сек
		setTimeout(function() { err[1].style.opacity = 0; }, 2000);

	} else {
		//если поля не пустые, то формируем ссылку, отправляем запрос, показываем саккссес
		const inputSuccess = document.querySelectorAll('.input__success');
		link = `https://node-words.herokuapp.com/removeWord?engWord=${delWord}`;
		//link = `http://localhost:8080/removeWord?engWord=${delWord}`;
		sendGetHttp(link);
		inputSuccess[1].style.opacity = 1;

		//убираем cакссесс через 2 секунды
		setTimeout(function() { inputSuccess[1].style.opacity = 0; }, 2000);

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