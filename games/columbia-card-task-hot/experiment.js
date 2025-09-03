/* ************************************ */
/* Helper Functions                     */
/* ************************************ */
var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	for (var i = 0; i < experiment_data.length; i++) {
		rt = experiment_data[i].rt
		trial_count += 1
		if (rt == -1) {
			missed_count += 1
		} else {
			rt_array.push(rt)
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	var missed_percent = missed_count/experiment_data.length
  	credit_var = (missed_percent < 0.4 && avg_rt > 200)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var,
									"performance_var": performance_var})
}

function deleteText(input, search_term) {
	index = input.indexOf(search_term)
	indexAfter = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + input.slice(indexAfter)
}


function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}

function appendTextAfter2(input, search_term, new_text, deleted_text) {
	var index = input.indexOf(search_term) + search_term.length
	var indexAfter = index + deleted_text.length
	return input.slice(0, index) + new_text + input.slice(indexAfter)
}

var getBoard = function(board_type) {
	var board = ''
	if (board_type == 2) {
		board = "<div class = cardbox>"
		for (i = 1; i < 33; i++) {
			board += "<div class = square><input type='image' id = " + i +
				" class = 'card_image' src='images/beforeChosen.png' onclick = instructCard(this.id)></div>"
		}

	} else {
		board = "<div class = cardbox>"
		for (i = 1; i < 33; i++) {
			board += "<div class = square><input type='image' id = " + i +
				" class = 'card_image select-button' src='images/beforeChosen.png' onclick = chooseCard(this.id)></div>"
		}
	}
	board += "</div>"
	return board
}


var getText = function() {
	return '<div class = centerbox><p class = block-text>总共您获得了 ' + totalPoints + ' 分。这些是从随机选择的三个试验中用于您奖励的分数：  ' +
		'<ul list-text><li>' + prize1 + '</li><li>' + prize2 + '</li><li>' + prize3 + '</li></ul>' +
		'</p><p class = block-text>按 <strong>回车键</strong> 继续。</p></div>'
}

var appendPayoutData = function(){
	jsPsych.data.addDataToLastTrial({reward: [prize1, prize2, prize3]})
}

var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		which_round: whichRound,
		num_click_in_round: whichClickInRound,
		num_loss_cards: numLossCards,
		gain_amount: gainAmt,
		loss_amount: lossAmt,
		round_points: roundPoints,
		clicked_on_loss_card: lossClicked,
		round_type: round_type
	})
}

// Functions for "top" buttons during test (no card, end round, collect)
var collect = function() {
	for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	currID = 'collectButton'
	whichClickInRound = whichClickInRound + 1
}

var noCard = function() {
	currID = 'noCardButton'
	roundOver=2
	whichClickInRound = whichClickInRound + 1
}

var endRound = function() {
	currID = 'endRoundButton'
	roundOver=2
}

// Clickable card function during test
var chooseCard = function(clicked_id) {
	currID = parseInt(clicked_id)
	whichClickInRound = whichClickInRound + 1
	if (lossRounds.indexOf(whichRound) == -1) {
		if ((cardArray.length - clickedGainCards.length) == numLossCards) {
			clickedLossCards.push(currID)
			index = unclickedCards.indexOf(currID, 0)
			unclickedCards.splice(index, 1)
			roundPoints = roundPoints - lossAmt
			lossClicked = true
			roundOver = 2
		} else { // if you click on a gain card
			clickedGainCards.push(currID) //as a string
			index = unclickedCards.indexOf(currID, 0)
			unclickedCards.splice(index, 1)
			roundPoints = roundPoints + gainAmt
		}
	} else {
		if ((clickedGainCards.length+1) == whichLossCards) {
			clickedLossCards.push(currID)
			index = unclickedCards.indexOf(currID, 0)
			unclickedCards.splice(index, 1)
			roundPoints = roundPoints - lossAmt
			lossClicked = true
			roundOver = 2
		} else { // if you click on a gain card
			clickedGainCards.push(currID) //as a string
			index = unclickedCards.indexOf(currID, 0)
			unclickedCards.splice(index, 1)
			roundPoints = roundPoints + gainAmt
		}
	}
}

var getRound = function() {
	var gameState = gameSetup
	if (roundOver === 0) { //this is for the start of a round
		whichClickInRound = 0
		unclickedCards = cardArray
		cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
			24, 25, 26, 27, 28, 29, 30, 31, 32
		]
		clickedGainCards = [] //num
		clickedLossCards = [] //num
		roundParams = shuffledParamsArray.shift()
		numLossCards = roundParams[0]
		gainAmt = roundParams[1]
		lossAmt = roundParams[2]

		gameState = appendTextAfter(gameState, '游戏回合： ', whichRound)
		gameState = appendTextAfter(gameState, '损失金额： ', lossAmt)
		gameState = appendTextAfter2(gameState, '当前回合分数： ', roundPoints, '0')
		gameState = appendTextAfter(gameState, '损失牌数量： ', numLossCards)
		gameState = appendTextAfter(gameState, '获利金额： ', gainAmt)
		gameState = appendTextAfter(gameState, "endRound()", " disabled")
		roundOver = 1
		return gameState
	} else if (roundOver == 1) { //this is for during the round
		gameState = appendTextAfter(gameState, '游戏回合： ', whichRound)
		gameState = appendTextAfter(gameState, '损失金额： ', lossAmt)
		gameState = appendTextAfter2(gameState, '当前回合分数： ', roundPoints, '0')
		gameState = appendTextAfter(gameState, '损失牌数量： ', numLossCards)
		gameState = appendTextAfter(gameState, '获利金额： ', gainAmt)
		gameState = appendTextAfter(gameState, "noCard()", " disabled")
		gameState = appendTextAfter2(gameState, "class = 'CCT-btn "," ' disabled", "select-button' onclick = noCard()")
		for (i = 0; i < clickedGainCards.length; i++) {
			gameState = appendTextAfter2(gameState, "id = " + "" + clickedGainCards[i] + ""," class = 'card_image' src='images/chosen.png'", " class = 'card_image select-button' src='images/beforeChosen.png' onclick = chooseCard(this.id)")
		}
		return gameState
	} else if (roundOver == 2) { //this is for end the round
		roundOver = 3
		gameState = appendTextAfter(gameState, '游戏回合： ', whichRound)
		gameState = appendTextAfter(gameState, '损失金额： ', lossAmt)
		gameState = appendTextAfter2(gameState, '当前回合分数： ', roundPoints, '0')
		gameState = appendTextAfter(gameState, '损失牌数量： ', numLossCards)
		gameState = appendTextAfter(gameState, '获利金额： ', gainAmt)
		gameState = appendTextAfter2(gameState, "id = collectButton class = 'CCT-btn", " select-button' onclick = collect()", "'")
		gameState = appendTextAfter(gameState, "endRound()", " disabled")
		gameState = appendTextAfter(gameState, "noCard()", " disabled")
		
		clickedCards = clickedGainCards.concat(clickedLossCards)
		var notClicked = cardArray.filter(function(x) { return (jQuery.inArray(x,clickedCards) == -1)})
		notClicked = jsPsych.randomization.shuffle(notClicked)
		lossCardsToTurn = notClicked.slice(0,numLossCards-clickedLossCards.length)
		gainCardsToTurn = notClicked.slice(numLossCards-clickedLossCards.length)
		for (var i = 1; i < cardArray.length + 1; i++) {
			if (clickedGainCards.indexOf(i) != -1 ) {
				gameState = appendTextAfter2(gameState, "id = " + "" + i + ""," class = 'card_image' src='images/chosen.png'", " class = 'card_image select-button' src='images/beforeChosen.png' onclick = chooseCard(this.id)")
			} else if (clickedLossCards.indexOf(i) != -1 ) {
				gameState = appendTextAfter2(gameState, "id = " + "" + i + ""," class = 'card_image' src='images/loss.png'", " class = 'card_image select-button' src='images/beforeChosen.png' onclick = chooseCard(this.id)")
			} else {
				gameState = appendTextAfter2(gameState, "id = " + "" + i + ""," class = 'card_image' src='images/beforeChosen.png'", " class = 'card_image select-button' src='images/beforeChosen.png' onclick = chooseCard(this.id)")
			}
		}
		
		setTimeout(function() {
			for (var k = 0; k < lossCardsToTurn.length; k++) {
				document.getElementById('' + lossCardsToTurn[k] + '').src =
				'images/loss.png';
			}
			for (var j = 0; j < gainCardsToTurn.length; j++) {
				document.getElementById('' + gainCardsToTurn[j] + '').src =
				'images/chosen.png';
			}
			$('#collectButton').prop('disabled', false)
		}, 1500)

		return gameState
	}
}

/*Functions below are for practice
*/
var turnCards = function(cards) {

	$('#collectButton').prop('disabled', false)
	$('#NoCardButton').prop('disabled', true)
	for (i = 0; i < 33; i++) {
		if (whichGainCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'images/chosen.png';
		} else if (whichLossCards.indexOf(i) != -1) {
			document.getElementById('' + i + '').src =
				'images/loss.png';
		}
	}
}

var turnOneCard = function(whichCard, win) {
	if (win === 'loss') {
		document.getElementById("" + whichCard + "").src =
			'images/loss.png';
	} else {
		document.getElementById("" + whichCard + "").src =
			'images/chosen.png';
	}
}

function doSetTimeout(card_i, delay, points, win) {
	CCT_timeouts.push(setTimeout(function() {
		turnOneCard(card_i, win);
		document.getElementById("current_round").innerHTML = '当前回合分数： ' + points
	}, delay));
}

var getPractice1 = function() {
	unclickedCards = cardArray
	cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 29, 30, 31, 32
	]
	clickedGainCards = [] 
	clickedLossCards = [] 
	numLossCards = 1
	gainAmt = 30
	lossAmt = 250

	shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
	whichLossCards = [] //this determines which are loss cards at the beginning of each round
	for (i = 0; i < numLossCards; i++) {
		whichLossCards.push(shuffledCardArray.pop())
	}
	whichGainCards = shuffledCardArray
	gameState = practiceSetup
	return gameState
}

var getPractice2 = function() {
	unclickedCards = cardArray
	cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 29, 30, 31, 32
	]
	clickedGainCards = [] //num
	clickedLossCards = [] //num
	numLossCards = 3
	gainAmt = 10
	lossAmt = 750

	shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
	whichLossCards = [] //this determines which are loss cards at the beginning of each round
	for (i = 0; i < numLossCards; i++) {
		whichLossCards.push(shuffledCardArray.pop())
	}
	whichGainCards = shuffledCardArray
	gameState = practiceSetup2
	return gameState
}

/*Functions below are for instruction
*/
var instructCard = function(clicked_id) {
	currID = parseInt(clicked_id)
	document.getElementById("NoCardButton").disabled = true;
	document.getElementById("turnButton").disabled = false;
	appendTextAfter(gameState, 'turnButton', ' onclick = turnCards()')
	if (whichLossCards.indexOf(currID) == -1) {
		instructPoints = instructPoints + gainAmt
		document.getElementById('current_round').innerHTML = '当前回合分数： ' + instructPoints;
		document.getElementById(clicked_id).disabled = true;

		document.getElementById(clicked_id).src =
			'images/chosen.png';
	} else if (whichLossCards.indexOf(currID) != -1) {
		instructPoints = instructPoints - lossAmt
		document.getElementById(clicked_id).disabled = true;
		document.getElementById('current_round').innerHTML = '当前回合分数： ' + instructPoints;
		document.getElementById(clicked_id).src =
			'images/loss.png';
		 $("input.card_image").attr("disabled", true);
		CCT_timeouts.push(setTimeout(function() {turnCards()}, 2000))
	}
}

var instructFunction = function() {
	$('#instructButton').prop('disabled', true)
	$('#jspsych-instructions-next').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	$('#jspsych-instructions-back').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	var cards_to_turn = [1, 17, 18, 15, 27, 31, 8]
	var total_points = 0
	var points_per_card = 10
	var delay = 0
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		delay += 250
		total_points += points_per_card
		doSetTimeout(card_i, delay, total_points, 'win')
	}
	CCT_timeouts.push(setTimeout(function() {
		document.getElementById("instruct1").innerHTML =
		'<strong>示例1：</strong>在下面的示例中，您看到32张未知牌。显示告诉您其中1张是损失牌。它还告诉您翻开每张获利牌值10分，翻开损失牌将花费您750分。让我们假设您决定翻开7张牌，然后决定停止。请点击“查看结果”按钮看看会发生什么： <font color = "red">很幸运，您翻开的7张牌中没有一张是损失牌，所以您这一回合的得分是70分。请点击下一步按钮。</font>'
		}, delay))
}

var instructFunction2 = function() {
	$('#instructButton').prop('disabled', true)
	var tempArray = [3, 5, 6, 7, 9, 10, 11, 12, 19, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26,
		27, 28, 29, 31, 32
	]
	var instructTurnCards = function() {
		document.getElementById("8").src = 'images/loss.png';
		document.getElementById("2").src = 'images/loss.png';

		for (i = 0; i < tempArray.length; i++) {
			document.getElementById("" + tempArray[i] + "").src =
				'images/chosen.png';
		}
	}

	$('#jspsych-instructions-next').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})

	$('#jspsych-instructions-back').click(function() {
		for (var i = 0; i < CCT_timeouts.length; i++) {
			clearTimeout(CCT_timeouts[i]);
		}
	})
	var cards_to_turn = [1, 4, 30]
	var total_points = 0
	var points_per_card = 30
	var delay = 0
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		delay += 250
		total_points += points_per_card
		doSetTimeout(card_i, delay, total_points, 'win')
	}
	delay += 250
	total_points -= 250
	doSetTimeout(13, delay, total_points, 'loss')
	CCT_timeouts.push(setTimeout(function() {
		document.getElementById("instruct2").innerHTML =
			'<strong>示例2：</strong>在下面的示例中，您看到32张未知牌。显示告诉您其中3张是损失牌。它还告诉您翻开每张获利牌值30分，翻开损失牌将花费您250分。让我们假设您决定翻开10张牌，然后决定停止。请点击“查看结果”按钮看看会发生什么： <font color = "red">这次，您翻开的第四张牌是损失牌。正如您所看到的，当您翻开损失牌时，回合将立即结束。您因为3张获利牌赚得90分，然后因为损失牌被扣除了250分，所以您这一回合的得分是-160分。在损失分数从您的回合总分中扣除后，电脑还向您展示了您还未翻开的牌。请点击下一步按钮。</font>'
	}, delay))
	CCT_timeouts.push(setTimeout(instructTurnCards, delay + 1000))
}

var instructButton = function(clicked_id) {
	currID = parseInt(clicked_id)
	document.getElementById(clicked_id).src =
		'images/chosen.png';
}

/* ************************************ */
/* Experimental Variables               */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var currID = ""
var numLossCards = ""
var gainAmt = ""
var lossAmt = ""
var CCT_timeouts = []
var numWinRounds =  24
var numLossRounds = 4
var numRounds = numWinRounds + numLossRounds
var lossRounds = jsPsych.randomization.shuffle([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,25,26,27,28]).slice(0,numLossRounds)
var riggedLossCards = []
var lossClicked = false
var whichClickInRound = 0
var whichRound = 1
var round_type = lossRounds.indexOf(whichRound)==-1 ? 'rigged_win' : 'rigged_loss'
var roundPoints = 0
var totalPoints = 0
var roundOver = 0 //0 at beginning of round, 1 during round, 2 at end of round
var instructPoints = 0
var clickedGainCards = []
var clickedLossCards = []
var roundPointsArray = [] 
var whichGainCards = []
var whichLossCards = []
var prize1 = 0
var prize2 = 0
var prize3 = 0

// this params array is organized such that the 0 index = the number of loss cards in round, the 1 index = the gain amount of each happy card, and the 2nd index = the loss amount when you turn over a sad face
var paramsArray = [
	[1, 10, 250],
	[1, 10, 750],
	[1, 30, 250],
	[1, 30, 750],
	[3, 10, 250],
	[3, 10, 750],
	[3, 30, 250],
	[3, 30, 750]
]

var cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
	24, 25, 26, 27, 28, 29, 30, 31, 32]
var shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
var shuffledParamsArray = jsPsych.randomization.repeat(paramsArray, numWinRounds/8)
for (var i = 0; i < numLossRounds; i++) {
	riggedLossCards.push(Math.floor(Math.random()*10)+2)
	var before = shuffledParamsArray.slice(0,lossRounds[i])
	var after = shuffledParamsArray.slice(lossRounds[i])
	var insert = [paramsArray[Math.floor(Math.random()*8)]]
	shuffledParamsArray = before.concat(insert,after)
}

var gameSetup =
	"<div class = cct-box>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>游戏回合： </div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>损失金额： </div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>获利金额： </div></div>    <div class = titlebox><div class = center-text>您想取几张牌？ </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>损失牌数量： </div></div>   <div class = titleboxRight><div class = center-text id = current_round>当前回合分数： 0</div></div>"+
	"<div class = buttonbox><button type='button' id = NoCardButton class = 'CCT-btn select-button' onclick = noCard()>No Card</button><button type='button' id = turnButton class = 'CCT-btn select-button' onclick = endRound()>STOP/Turn Over</button><button type='button' id = collectButton class = 'CCT-btn' disabled>Next Round</button></div></div>"+
	getBoard()

var practiceSetup =
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>练习1：</strong>当您点击牌片时，您可以看到您的回合总分在右上方框中变化。如果您翻开了几张牌，然后想要停止并进入下一回合，请点击<strong>停止/翻牌</strong>按钮，然后点击<strong>下一回合</strong>。如果翻牌似乎风险太大，您可以点击<strong>不取牌</strong>按钮，在这种情况下，您本回合的得分将自动为零。这是一个练习回合，看起来就像您将要玩的游戏一样。请根据下面显示的损失牌数量以及获利牌和损失牌的金额，选择您将翻开的牌数。</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>游戏回合： 1</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>损失金额： 250</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>获利金额： 30</div></div>    <div class = titlebox><div class = center-text>您想取几张牌？ </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>损失牌数量： 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>当前回合分数： 0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = NoCardButton onclick = turnCards()>No Card</button><button type='button' class = CCT-btn id = turnButton onclick = turnCards() disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  onclick = collect() disabled>Next Round</button></div></div>"+
	getBoard(2)

var practiceSetup2 =
	"<div class = practiceText><div class = block-text2 id = instruct2><strong>练习2：</strong>电脑将记录您每个回合的分数，并在您完成所有" + numRounds + "个回合的游戏后显示总分。这是第二个练习回合。请根据损失牌数量以及您翻开获利牌或损失牌可以赢得或失去的金额（如下所示），再次翻开您想要的尽可能多的牌。</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>游戏回合： 2</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>损失金额： 750</div></div>    <div class = titleboxMiddle1><div class = center-text gain_amount>获利金额： 10</div></div>    <div class = titlebox><div class = center-text>您想取几张牌？ </div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>损失牌数量： 3</div></div>   <div class = titleboxRight><div class = center-text id = current_round>当前回合分数： 0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = NoCardButton onclick = turnCards()>No Card</button><button type='button' class = CCT-btn id = turnButton onclick = turnCards() disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  onclick = collect() disabled>Next Round</button></div></div>"+
	getBoard(2)


/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在这个任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对此任务有任何意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */

var feedback_instruct_text =
	"欢迎参加实验。此任务将花费大约25分钟。请按 <strong>回车键</strong> 开始。"
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: 'instruction'
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
  type: 'poldrack-instructions',
  data: {trial_id: 'instruction'},
  pages: [
	'<div class = centerbox><p class = block-text><strong>介绍和说明</strong>'+
	'<p>-您现在将要参加一个纸牌游戏。在这个游戏中，您将翻牌来赢得或失去值钱的分数。</p>'+
	'<p>-在每个游戏回合中，您将在电脑屏幕上看到32张朝下的牌。您需要决定翻开其中多少张牌。每张牌要么是获利牌要么是损失牌（没有中性牌）。您将知道32张牌中有多少张获利牌和损失牌，以及如果您翻开获利牌或损失牌将获得或失去多少分数。您不知道的是，您看到的32张朝下的牌中哪些是获利牌，哪些是损失牌。</p>'+
	'<p>-您通过点击来指示要翻开哪些牌。每翻开一张获利牌，分数就会加到您的回合总分中。您继续翻牌直到翻开损失牌或决定停止。第一次翻开损失牌时，损失的分数将从您当前的分数总数中扣除，回合结束。累计总分将是您该回合的得分，然后进入下一回合。每个新回合都从0分开始；这意味着您独立地进行每个回合。</p>'+
	'<p>-您将总共进行 ' + numRounds + ' 个回合，其中三个将在会话结束时随机选择，您将获得与这些回合成比例的奖励。</p>',
	
    '<div class = centerbox><p class = block-text><strong>未知牌：</strong>'+
    '<p>这就是未知牌的样子。点击它来翻开它。</p>'+
    "<p><input type='image' id = '133' src='images/beforeChosen.png' onclick = instructButton(this.id)>"+
	'</p></div>',
	
	'<div class = centerbox><p class = block-text>'+
	'<p><strong>获利牌：</strong></p>'+
	'<p>每翻开一张获利牌，您的分数在不同回合中会增加10或30分。</p>'+
	"<p><input type='image' src='images/chosen.png'>"+
	'<p><strong>损失牌：</strong></p>'+
	"<p><input type='image' src='images/loss.png'></p>"+
	'<p>每翻开一张损失牌，您的分数在不同回合中会减少250或750分。而且，回合立即结束（您不能再翻开任何牌）。在任何给定回合中将有1或3张损失牌。</p>'+
	'<p>损失牌的数量以及翻开获利牌或损失牌可以赢得或失去的分数在每个回合中都是固定的。此信息将始终显示，以便您知道您处于什么类型的回合中。</p>'+
	'</p></div>',
	
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>示例1：</strong>在下面的示例中，您看到32张未知牌。显示告诉您其中1张是损失牌。它还告诉您翻开每张获利牌值10分，翻开损失牌将花费您750分。让我们假设您决定翻开7张牌，然后决定停止。请点击“查看结果”按钮看看会发生什么：</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>游戏回合： 1</div></div>   <div class = titleboxLeft1><div class = center-text>损失金额： 750</div></div>    <div class = titleboxMiddle1><div class = center-text>获利金额： 10</div></div>    <div class = titlebox><div class = center-text>您想取几张牌？ </div></div>     <div class = titleboxRight1><div class = center-text>损失牌数量： 1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>当前回合分数： 0</div></div>"+
	"<div class = buttonbox><button type='button' class = 'CCT-btn select-button' id = NoCardButton disabled>No Card</button><button type='button' class = 'CCT-btn select-button' class = 'CCT-btn select-button' id = turnButton disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  disabled>Next Round</button></div>"+
	"<div class = buttonbox2><button type='button' class = CCT-btn id = instructButton onclick= instructFunction()>See Result</button></div></div>"+
	getBoard(2),
	
	"<div class = practiceText><div class = block-text2 id = instruct2><strong>示例2：</strong>在下面的示例中，您看到32张未知牌。显示告诉您其中3张是损失牌。它还告诉您翻开每张获利牌值30分，翻开损失牌将花费您250分。让我们假设您决定翻开10张牌，然后决定停止。请点击“查看结果”按钮看看会发生什么：</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>游戏回合： 1</div></div>   <div class = titleboxLeft1><div class = center-text>损失金额： 250</div></div>    <div class = titleboxMiddle1><div class = center-text>获利金额： 30</div></div>    <div class = titlebox><div class = center-text>您想取几张牌？ </div></div>     <div class = titleboxRight1><div class = center-text>损失牌数量： 3</div></div>   <div class = titleboxRight><div class = center-text id = current_round>当前回合分数： 0</div></div>"+
	"<div class = buttonbox><button type='button' class = 'CCT-btn select-button' id = NoCardButton disabled>No Card</button><button type='button' class = 'CCT-btn select-button' class = 'CCT-btn select-button' id = turnButton disabled>STOP/Turn Over</button><button type='button' class = 'CCT-btn select-button' id = collectButton  disabled>Next Round</button></div>"+
	"<div class = buttonbox2><button type='button' class = CCT-btn id = instructButton onclick= instructFunction2()>See Result</button></div></div>"+
	getBoard(2),
	"<div class = centerbox><p class = block-text>在您结束说明后，您将在继续之前完成两个练习回合。请确保在结束说明之前理解最后两页的示例。</p></div>"
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block],
	/* This function defines stopping criteria */
	loop_function: function(data) {
		for (i = 0; i < data.length; i++) {
			if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
				rt = data[i].rt
				sumInstructTime = sumInstructTime + rt
			}
		}
		if (sumInstructTime <= instructTimeThresh * 1000) {
			feedback_instruct_text =
				'阅读说明过快。请慰慰地阅读，确保您理解说明。按 <strong>回车键</strong> 继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '说明完成。按 <strong>回车键</strong> 继续。'
			return false
		}
	}
}





var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'end',
		exp_id: 'columbia_card_task_hot'
	},
	text: '<div class = centerbox><p class = center-block-text>任务完成。</p><p class = center-block-text>按 <strong>回车键</strong> 继续。</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
  	on_finish: assessPerformance
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>现在我们将开始测试。按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function(){
		whichClickInRound = 0
		whichLossCards = [riggedLossCards.shift()]
	}
};


var practice_block1 = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getPractice1,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	timing_post_trial: 0,
	response_ends_trial: true,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			num_loss_cards: numLossCards,
			gain_amount: gainAmt,
			loss_amount: lossAmt,
			instruct_points: instructPoints,
		})
		instructPoints = 0
	}
};

var practice_block2 = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getPractice2,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'practice'
	},
	timing_post_trial: 0,
	response_ends_trial: true,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			num_loss_cards: numLossCards,
			gain_amount: gainAmt,
			loss_amount: lossAmt,
			instruct_points: instructPoints,
		})
		instructPoints = 0
	}
};

var test_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getRound,
	is_html: true,
	data: {
		trial_id: 'stim',
		exp_stage: 'test'
	},
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};

var test_node = {
	timeline: [test_block],
	loop_function: function(data) {
		if (currID == 'collectButton') {
			roundPointsArray.push(roundPoints)
			roundOver = 0
			roundPoints = 0
			whichClickInRound = 0
			whichRound = whichRound + 1
			round_type = lossRounds.indexOf(whichRound)==-1 ? 'rigged_win' : 'rigged_loss'
			if (round_type == 'rigged_loss') {
				whichLossCards = [riggedLossCards.shift()]
			}
			lossClicked = false
			return false
		} else {
			return true
		}
	}
}


var payout_text = {
	type: 'poldrack-text',
	text: getText,
	data: {
		trial_id: 'reward'
	},
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: appendPayoutData,
};

var payoutTrial = {
	type: 'call-function',
	data: {
		trial_id: 'calculate reward'
	},
	func: function() {
		totalPoints = math.sum(roundPointsArray)
		randomRoundPointsArray = jsPsych.randomization.repeat(roundPointsArray, 1)
		prize1 = randomRoundPointsArray.pop()
		prize2 = randomRoundPointsArray.pop()
		prize3 = randomRoundPointsArray.pop()
		performance_var = prize1 + prize2 + prize3
	}
};

/* create experiment definition array */
var columbia_card_task_hot_experiment = [];

columbia_card_task_hot_experiment.push(instruction_node);
columbia_card_task_hot_experiment.push(practice_block1);
columbia_card_task_hot_experiment.push(practice_block2);

columbia_card_task_hot_experiment.push(start_test_block);
for (i = 0; i < numRounds; i++) {
	columbia_card_task_hot_experiment.push(test_node);
}
columbia_card_task_hot_experiment.push(payoutTrial);
columbia_card_task_hot_experiment.push(payout_text);
columbia_card_task_hot_experiment.push(post_task_block)
columbia_card_task_hot_experiment.push(end_block);
