
var player = {
	"best": 0,
	"round": 0,
	"answered": []
};

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

var storeGamestate = function () {
	document.cookie=JSON.stringify("gamestate="+gamestate);
}

var restoreGamestate = function () {
	console.log(document.cookie);
};

var setPoints = function (points) {
	player.points = points;
	document.getElementById("points_round_points").innerHTML = points;

	checkBest(points);
}

var checkBest = function (points) {
	if (points > player.best) {
		player.best = points;
		document.getElementById("points_best_points").innerHTML = points;
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

			setPoints(player.round+1);
		} else {
			markAnswer(answer, "wrong");
			document.getElementById("banner_wrong").style.display = "block";
			answerCorrect = false;
			
			setPoints(0);
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

newQuestion();