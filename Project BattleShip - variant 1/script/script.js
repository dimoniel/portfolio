function init() {
	var ships = [];
	var defeats = [];
	var counts = 0;
	var inputCoords;
	var inputForm = document.getElementById("inputForm");
	var outTextArea = document.getElementById("messageArea");

	function generateCoords( number ) {
		var vertical;
		var horisontal;
		var coords;
		var isExist = false;
		var shipsCoordsArray = [];

		for (var i = 0; i < number; i++) {
			do {
				vertical = Math.floor(Math.random()*7);
				horisontal= Math.floor(Math.random()*7);
				coords = vertical.toString() + horisontal.toString();

				for (var i = 0; i < shipsCoordsArray.length; i++) {
					if (coords === shipsCoordsArray[i]) {
						isExist = true;
						break;
					} else {
						isExist = false;
					}
				}
			} while(isExist);
			shipsCoordsArray.push(coords);
		}
		
		return shipsCoordsArray;
	};

	function clickOnFire(e) {
		var outputCoords;

		function inputCheck( inputString ) {
			var mainRegExp = new RegExp( "^([a-g]{1}[0-6]{1})$|^([0-6]{1}[a-g]{1})$", "i" );
			var verticalRegExp = new RegExp( "[a-g]{1}", "i" );
			var horisontalRegExp = new RegExp( "[0-6]{1}" );
			var vertical;
			var horisontal;
			var coords;

			if (mainRegExp.test(inputString)) {
				vertical = (inputString.match( verticalRegExp )[0]).toLowerCase();
				horisontal = inputString.match( horisontalRegExp )[0];
				switch( vertical ) {
					case "a": 
						vartical = "0";
						break;
					case "b": 
						vartical = "1";
						break;
					case "c": 
						vartical = "2";
						break;
					case "d": 
						vartical = "3";
						break;
					case "e": 
						vartical = "4";
						break;
					case "f": 
						vartical = "5";
						break;
					case "g": 
						vartical = "6";
						break;
				};
				coords = vartical + horisontal;
				return(coords);
			} else {
				return false;
			}
		};

		function buttle(coords) {
			if (coords) {
				counts++;
				for (var i = 0; i < ships.length; i++) {
					if (coords == ships[i]) {
						defeats.push(ships[i]);
						ships.splice(i, 1);
						document.getElementById("cell" + coords).setAttribute("class", "hit");
						if (ships.length !== 0) {
							outTextArea.innerHTML = "You hited one!";
						} else {
							outTextArea.innerHTML = "You WIN on count " + counts + "! Let`s start again!";
						}

						return;
					}
				}

				for (var i = 0; i < defeats.length; i++) {
					if (coords == defeats[i]) {
						outTextArea.innerHTML = "You already hited this one!";

						return;
					}
				}
				outTextArea.innerHTML = "You miss :(";
				document.getElementById("cell" + coords).setAttribute("class", "miss");

			} else {
				outTextArea.innerHTML = "You have inputed invalid coordinats!";
			}
		};


		e.preventDefault();

		if (ships.length !== 0) {
			inputCoords = document.getElementById("guessInput").value;
			outputCoords = inputCheck( inputCoords );
			console.log(outputCoords);
			buttle( outputCoords );
		}
	};

	outTextArea.innerHTML = "Let`s start the game!"
	ships = generateCoords(3);

	inputForm.addEventListener("submit", clickOnFire, false);

};

window.onload = init;