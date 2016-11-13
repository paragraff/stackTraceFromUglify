#!/usr/bin/env node

var fs = require('fs'),
	// библиотека для получения объектов стека ошибок из строки stacktrace браузера
	parser = require('error-stack-parser'),
	// библиотека для маппинга места ошибки в сжатом скрипте на место ошибки в исходном коде
	StackTraceGPS = require('stacktrace-gps');

// parser ожидает на вход объект Error, поэтому преобразовываем строку stacktrace в Error, содержащий
// нужный нам stacktrace
var error = new Error();
error.stack = (
		'file2.js:11 Uncaught Error: some error' +
		' at ButtonSend.send (http://stacktrace-test.com:8000/built.min.js:1:526)' +
		' at ButtonSend.action (http://stacktrace-test.com:8000/built.min.js:1:444)' +
		' at HTMLInputElement.<anonymous> (http://stacktrace-test.com:8000/built.min.js:1:125)'
	)
// убираем из trace домен и path, иначе библиотека будет загружать исходные файлы через xhr запросы
	.replace(/http:\/\/stacktrace-test\.com:8000\//g, '')
// убираем из trace первую строку - она не относится к stacktrace
	.replace('file2.js:11 Uncaught Error: some error', '')
// расставляем переносы строк - парсер ожидает что они будут
	.replace(/ at /g, '\n at ');

// получаем массив объектов стека ошибок
var errorStack = parser.parse(error),
	appFile = fs.readFileSync('./dest/built.min.js', 'utf-8'),
	appMapFile = fs.readFileSync('./dest/built.min.js.map', 'utf-8'),
// библиотеке маппинга нужен сжатый файл и его map файл для маппинга
	stackTraceOptions = {
		sourceCache: {
			'built.min.js': appFile,
			'built.min.js.map': appMapFile
		}
	};

// получаем массив промисов замапленных объектов стека
var decodedErrorStackPromises = errorStack.map(function (errorFrame) {
	// для каждого объекта стека создадим экземпляр маппера и получим промис готового объекта стека
	return new StackTraceGPS(stackTraceOptions).pinpoint(errorFrame);
});

Promise.all(decodedErrorStackPromises).then(function (errorStackArray) {
	// после того, как все объекты стека будут замаплены, выведем дешифрованный stacktrace
	errorStackArray.forEach(function (decodedStack) {
		console.log(decodedStack.toString());
	});
});