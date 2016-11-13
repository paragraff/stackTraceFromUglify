function ButtonSimple(selector) {
	var self = this;
	this.button = document.querySelector(selector);
	this.button.addEventListener('click', function () {
		self.action();
	});
}

ButtonSimple.prototype = Object.create(null);
ButtonSimple.prototype.constructor = ButtonSimple;
ButtonSimple.prototype.action = function () {
	console.log('action!');
};

