var player;
var gamestate = {
	"round": 0
}

// get char for question 
var getAnsChar = function (num) {
	var chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	if (num > 26) {
		throw "More than 26 Answers? Uh, no more letters left. Sorry, not possible.";
	}
	return chars[num-1];
}

var markAnswer = function (answer, markAs) {
	console.log("markAnswer(answer="+answer+",markAs="+markAs+");");
	document.getElementById("ans"+answer).classList.add(markAs);
}

var readCookies = function () {
	var cookies = document.cookie.split(";")
	var cookiesObject = []

	for (var i=0; i<cookies.length; i++) {
		cookie = cookies[i];
		cookiesObject.push({
			"name" : cookie.split("=")[0],
			"value" : unescape(cookie.split("=")[1])
		})
	}
	return cookiesObject;
}

var getCookie = function (cookieName) {
	console.log("getCookie(cookieName="+cookieName+")")
	cookiesObject = readCookies();
	for (var i=0; i<cookiesObject.length; i++) {
		if (cookiesObject[i]["name"] == cookieName) {
			return cookiesObject[i]["value"];
		}
	}
}

var storeCookie = function (name, value) {
	document.cookie = name+"="+escape(value);
}

var storePlayer = function () {
	storeCookie("player", JSON.stringify(player));
}

var restorePlayer = function () {
	console.log(getCookie("player"));
	cookiePlayer = getCookie("player");

	if (cookiePlayer != undefined) {
		player = JSON.parse(cookiePlayer);
	} else {
		player = {
			"best": 0,
			"points": 0,
			"answered": []
		};
	}

};

var showPoints = function() {
	document.getElementById("points_round_points").innerHTML = player.points;
	document.getElementById("points_best_points").innerHTML = player.best;
}

var setPoints = function (points) {
	console.log("setPoints("+points+")");
	player.points = points;

	checkBest(points);
	showPoints();
}

var checkBest = function (points) {
	if (points > player.best) {
		player.best = points;
		showPoints();
	}
}

// shows a new random Question with randomly ordered answers
var newQuestion = function () {

	gamestate.round++;
	document.getElementById("banner_right").style.display = "none";
	document.getElementById("banner_wrong").style.display = "none";
	document.getElementById("button_next").style.display = "none";


	var i=0;
	do {
		var qid = Math.floor(Math.random()*questions.length);
		i++;
	} while (player.answered.indexOf(qid) > -1 && i < questions.length)

	gamestate.currentQuestion = qid;

	// questions with true or false answers (type bool)
	if (questions[qid].type == "bool") {
		gamestate.currentQuestType = "bool"
		document.getElementById("question").innerHTML = questions[qid].quest;

		document.getElementById("answerbox_bool").innerHTML = "";

		gamestate.currentAnswers = []
		for (var i=1; i<=questions[qid].answers.length; i++) {
			do {
				var aid = Math.floor(Math.random()*questions[qid].answers.length);
			} while (gamestate.currentAnswers.indexOf(aid) > -1)

			gamestate.currentAnswers[i]=aid;

			document.getElementById("answerbox_bool").innerHTML += '<div class="answer_container"><div id="ans'+i+'" class="answer chooseable" onclick="userAnswer(\'bool\','+i+')"><div class="answer_char">'+getAnsChar(i)+'</div><div id="ans'+i+'_text" class="answer_text">'+questions[qid].answers[aid].ans+'</div></div></div>'
		}
	}
}

// logs in user answer and checks if it’s right
var userAnswer = function (type, answer) {
	console.log("userAnswer(type="+type+",answer="+answer+");");
	if (type = "bool") {

		var qid = gamestate.currentQuestion;
		var aid = gamestate.currentAnswers[answer];
		var answerCorrect = false;

		// disable onclick and hover 
		for (var i=0; i<document.getElementsByClassName("answer").length; i++) {
			document.getElementsByClassName("answer")[i].onclick="";
			document.getElementsByClassName("answer")[i].classList.remove("chooseable");


		}

		// decide if answer was right and colour red/green
		if (questions[qid].answers[aid].correct) {
			markAnswer(answer, "right");
			document.getElementById("banner_right").style.display = "block";
			answerCorrect = true;

			setPoints(player["points"]+1);
			storePlayer();
		} else {
			markAnswer(answer, "wrong");
			document.getElementById("banner_wrong").style.display = "block";
			answerCorrect = false;
			
			setPoints(0);
			storePlayer();
		}

		// colour all correct answers green
		for (var i=0; i<questions[qid].answers.length; i++) {
			if (gamestate.currentAnswers.indexOf(i) != answer && questions[qid].answers[i].correct) {
				markAnswer(gamestate.currentAnswers.indexOf(i), "alsoright");
			}


		document.getElementById("button_next").style.display = "block";

		}
	}
}

console.log("Cookie: "+document.cookie)
restorePlayer();
showPoints();
newQuestion();