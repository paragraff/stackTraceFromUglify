function ButtonSend(selector) {
	ButtonSimple.call(this, selector);
}

ButtonSend.prototype = Object.create(ButtonSimple.prototype);
ButtonSend.prototype.action = function () {
	this.send();
};
ButtonSend.prototype.send = function () {
	console.log(this.button.value);
	throw new Error('some error');
};

