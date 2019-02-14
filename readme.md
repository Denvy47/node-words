Приложение доступно по ссылке: <https://node-words.herokuapp.com/>

## Цель приложения: 
Помощь в изучении новых англ. слов. Приложение рандомно выбирает слова из заранее заготовленных и показывает их вам. Ваша задача их перевести на английский/русский. Чтобы себя проверить, можно посмотреть перевод.

## Как работает и что умеет: 
В приложении 2 секции. В первой надо перевести с английского на русский, во второй секции - наоборот.
Изначально перевод скрыт. На стартовой странице можно выбрать количество слов в каждой секции.

Кнопки:
 - _"Start"_ - запускает приложение
 - "_Show" / "Hide"_ - показывает / прячет перевод 
 - _"Add"_ - добавляет новое слово с переводом в БД
 - _"Remove"_ - удаляет слово с переводом из БД
 - _"Replace"_ - генерирует новые слова
 
## Что было использовано при создании:

#### Клиентская часть:
 - HTML
 - CSS
 - vanilla JS

#### Серверная часть:
 - Node js
 - Express js

#### База данных:
 - PostgreSQL (<https://www.elephantsql.com/>)

#### Хостинг:
 - Heroku

 ## Чтобы развернуть приложение локально (например, через git clone):
 - Установить node js
 - Открыть cmd
 - npm install
 - npm start
 - сервер на localhost:8080
