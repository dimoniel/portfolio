//  JavaScript code

window.onload = init;
			
function init() {
	var inputArray = [];
	var regExpArray = [
						new RegExp("(^[A-Z]{1}[a-z]+$)"),
						new RegExp("(^[A-Za-z0-9-_]+@[a-z0-9-_]{2,}\\.[a-z]{2,6}$)"),
						new RegExp("(^.+$)")
						];
	inputArray.push( document.getElementById("userName") );
	inputArray.push( document.getElementById("userEmail") );
	inputArray.push( document.getElementById("userMessage") );
	
	var form = document.getElementById("messageForm");
	form.addEventListener("submit", send, false);
	
	for (var i = 0; i < inputArray.length; i++) {
		inputArray[i].addEventListener("blur", check, false);
	}
			
	function send(e) {
		e.preventDefault();
		for (var i = 0; i < inputArray.length; i++) {
			if (/invalid/i.test(inputArray[i].className)) {
				alert("Форма не заполнена");
				return;
			}
		}
		e.target.submit();
		var obj = new Creator(inputArray);
		console.log(obj);
	};
				
	function check(e) {
		var index = inputArray.indexOf(e.target);

		if (!regExpArray[index].test(inputArray[index].value)) {
			inputArray[index].setAttribute("class", "invalid");
		} else {
			inputArray[index].removeAttribute("class");
		}
	};
			
	function Creator(array) {
		for (var i = 0; i < array.length; i++) {
			this[array[i].name] = array[i].value;
		}
	};
};