let xPlayer = document.querySelector("#xPlayer"),
	oPlayer = document.querySelector("#oPlayer"),
	start = document.querySelector(".start"),
	inputBox = document.querySelector(".players"),
	leaderBoard = document.querySelector(".leaderBoard"),
	playerName = document.querySelector(".name.player"),
	playerScore = document.querySelector(".score.player"),
	xoBox = document.querySelector(".xoBox");

//Start The Game.
start.addEventListener("click", (e) => {
	e.preventDefault();
	let players = [
		{
			name: xPlayer.value !== "" ? xPlayer.value : "",
			score: 0,
		},
		{
			name: oPlayer.value !== "" ? oPlayer.value : "",
			score: 0,
		},
	];

	//Check If Name Fields Is Not Empty Save Player Data In The Local Storage Else Send Message.
	if (players[0].name !== "" && players[1].name !== "" && players[0].name !== players[1].name) {
		localStorage.setItem("players", JSON.stringify(players));
		inputBox.classList.add("hide");
		xoBox.classList.add("show");
	} else {
		let body = document.querySelector("body"),
			msg = `<ol class='msg'>
							<li>Please Fill The Names Field</li>
							<li>Don't Use The Same Names In Both Fields</li>
							<span class='close'>X</span>
						</ol>`;
		body.insertAdjacentHTML("afterbegin", msg);
		start.style.pointerEvents = "none";

		//Close The Warning Message.
		let close = document.querySelector(".close");
		close.addEventListener("click", () => {
			let msg = document.querySelector(".msg");
			msg.classList.add("hide");
			start.style.pointerEvents = "unset";
		});
	}
});

let squares = document.querySelectorAll(".square"),
	emptySquare;
turn = "x";
//Print X & O In The Squares
squares.forEach((s, index) => {
	emptySquare = Array.from(squares).filter((s) => s.getAttribute("value") !== null);
	s.setAttribute("num", index + 1);
	s.addEventListener("click", (e) => {
		e.stopPropagation();
		//Prevent Click When There Is No Empty Squares OR Squares Have Been Clicked .
		if (emptySquare.length !== 9 && e.target.getAttribute("value") == null) {
			//Print & Save The Values Of X & O.
			if (turn === "x") {
				e.target.textContent = "X";
				e.target.setAttribute("value", "x");
				turn = "o";
			} else {
				e.target.textContent = "O";
				e.target.setAttribute("value", "o");
				turn = "x";
			}
		}
	});
});

//Win Conditions
let winBox = document.querySelector(".winBox"),
	playersData = JSON.parse(localStorage.getItem("players"));
squares.forEach((s) => {
	s.addEventListener("click", () => {
		emptySquare = Array.from(squares).filter((s) => s.getAttribute("value") !== null);

		//Win Conditions : Check The Diagonal, Horizental And Vertical Matches.
		if (winCondition(0, 1, 2)) {
			endGame(0);
		} else if (winCondition(0, 3, 6)) {
			endGame(0);
		} else if (winCondition(0, 4, 8)) {
			endGame(0);
		} else if (winCondition(1, 4, 7)) {
			endGame(1);
		} else if (winCondition(2, 4, 6)) {
			endGame(2);
		} else if (winCondition(2, 5, 8)) {
			endGame(2);
		} else if (winCondition(3, 4, 5)) {
			endGame(3);
		} else if (winCondition(6, 7, 8)) {
			endGame(6);
		} else if (emptySquare.length === 9) {
			squares.forEach((s) => {
				s.style.pointerEvents = "none";
			});
			winBox.classList.add("show");
			winBox.innerHTML = `
      <span>Draw</span>
      <div class='btnBox'>
      <button class='new'>New Round</button>
      <button class='end'>End Game</button>
      </div>`;

			//Start A New Round Function
			playersData = JSON.parse(localStorage.getItem("players"));
			newRound();
		}
	});
});

//Get The Value Of Specific Square
function getValue(index) {
	if (squares[index].hasAttribute("value")) {
		return squares[index].getAttribute("value");
	}
}

//Check If The Is A Match Squeres
function winCondition(firstVal, secondVal, thirdVal) {
	return (
		getValue(firstVal) !== undefined &&
		getValue(firstVal) == getValue(secondVal) &&
		getValue(firstVal) == getValue(thirdVal)
	);
}

function newRound() {
	//Start New Round
	let newRoundBtn = document.querySelector(".winBox .new");
	//Reset The Game And All Values
	newRoundBtn.addEventListener("click", () => {
		winBox.classList.remove("show");
		leaderBoard.classList.add("show");
		squares.forEach((s) => {
			s.style.pointerEvents = "unset";
			s.textContent = "";
			s.removeAttribute("value");
		});

		//Save The Last Game The Data And Show It In The LeaderBoard
		localStorage.setItem("players", JSON.stringify(playersData));
		leaderBoard.innerHTML = `
		<ul>
			<li>
				<div class='name'>Player Name</div>
				<div class='score'>Player Scores</div>
			</li>
			<li>
				<div class='name player'>X Player: ${playersData[0].name}</div>
				<div class='name score'>${playersData[0].score}</div>
			</li>
			<li>
				<div class='name player'>O Player: ${playersData[1].name}</div>
				<div class='name score'>${playersData[1].score}</div>
			</li>
		<ul/>
		`;
	});
}

function endGame(value) {
	playersData = JSON.parse(localStorage.getItem("players"));
	winBox.classList.add("show");
	winBox.innerHTML = `
	<span>${getValue(value).toUpperCase()} Win</span>
	<div class='btnBox'>
		<button class='new'>New Round</button>
		<button class='end'>End Game</button>
	</div>`;

	//Prevent Mouse Clicking Event
	squares.forEach((s) => {
		s.style.pointerEvents = "None";
	});

	//Check The Winner Value
	let winner = document.querySelector(".winBox span").textContent[0];
	if (winner == "X") {
		playersData[0].score++;
	} else {
		playersData[1].score++;
	}

	//new Round
	newRound();

	//End Game Event
	let end = document.querySelector(".winBox .end");
	end.addEventListener("click", () => window.reload());
}
