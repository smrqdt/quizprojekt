
var player = {
	"best": 0,
	"round": 0,
	"answered": []
};

var gamestate = {
/*	"currentQuestion": null,
	"currentAnswers": {


	} */
}

var getAnsChar = function (num) {
	var chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	return chars[num-1]; 
}

var newQuestion = function () {
	var i=0;
	do {
		var qid = Math.floor(Math.random()*questions.length);
		i++;
	} while (player.answered.indexOf(qid) > -1 && i < questions.length)

	console.log(qid);
	console.log(questions[qid])

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

			document.getElementById("answerbox_bool").innerHTML += '<div class="answer_container" onclick="userAnswer('+i+');"><div id="ans'+i+'" class="answer"><div class="answer_char">'+getAnsChar(i)+'</div><div id="ans'+i+'_text" class="answer_text">'+questions[qid].answers[aid].ans+'</div></div></div>'

		}

	}


}

newQuestion();