/* ************************************ */
/* Define helper functions */
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

var appendTestData = function() {
	jsPsych.data.addDataToLastTrial({
		num_cards_chosen: currID,
		num_loss_cards: numLossCards,
		gain_amount: gainAmt,
		loss_amount: lossAmt,
		round_points: roundPointsArray.slice(-1),
		whichRound: whichRound
	})
}

var getButtons = function(buttonType) {
	var buttons = ""
	buttons = "<div class = allbuttons>"
	for (i = 0; i < 33; i++) {
		buttons += "<button type = 'button' class = 'CCT-btn chooseButton' id = " + i +
			" onclick = chooseButton(this.id)>" + i + "</button>"
	}
	return buttons
}

var getBoard = function(board_type) {
	var board = ''
	if (board_type == 2) {
		board = "<div class = cardbox>"
		for (i = 1; i < 33; i++) {
		board += "<div class = square><input type='image' class = card_image id = c" + i +
			" src='images/beforeChosen.png'></div>"
		}
		
	} else {
		board = "<div class = cardbox2>"
		for (i = 1; i < 33; i++) {
		board += "<div class = square><input class = card_image type='image' id = c" + i +
			" src='images/beforeChosen.png'></div>"
		}
	}
	board += "</div>"
	return board
}

var getText = function() {
	return '<div class = centerbox><p class = block-text>总体来说，您获得了 ' + totalPoints + ' 分。这些是从三个随机选择的试次中用于奖金的分数：' +
		'<ul list-text><li>' + prize1 + '</li><li>' + prize2 + '</li><li>' + prize3 + '</li></ul>' +
		'</p><p class = block-text>按 <strong>回车键</strong> 继续。</p></div>'
}

var turnOneCard = function(whichCard, win) {
	if (win === 'loss') {
		document.getElementById("c" + whichCard + "").src =
			'images/loss.png';
	} else {
		document.getElementById("c" + whichCard + "").src =
			'images/chosen.png';
	}
}

function doSetTimeout(card_i, delay, points, win) {
	CCT_timeouts.push(setTimeout(function() {
		turnOneCard(card_i, win);
		document.getElementById("current_round").innerHTML = '当前回合分数：' + points
	}, delay));
}

function clearTimers() {
	for (var i = 0; i < CCT_timeouts.length; i++) {
		clearTimeout(CCT_timeouts[i]);
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
		'<strong>示例 1：</strong>在下面的示例中，您看到 32 张未知卡片。显示器告诉您其中有 1 张是损失卡片。它还告诉您翻开每张收益卡片可以为您获得 10 分，而翻开损失卡片将使您失去 750 分。假设您决定翻开 7 张卡片然后决定停止。请点击"查看结果"按钮看看会发生什么：<font color = "red">幸运的是，您翻开的七张卡片中没有一张是损失卡片，所以您这一轮的分数是 70 分。请点击下一页按钮。</font>'
		}, delay))
}

var instructFunction2 = function() {
	$('#instructButton').prop('disabled', true)
	var tempArray = [3, 5, 6, 7, 9, 10, 11, 12, 19, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26,
		27, 28, 29, 31, 32
	]
	var instructTurnCards = function() {
		document.getElementById("8").src =
			'images/loss.png';
		document.getElementById("2").src =
			'images/loss.png';

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
			'<strong>示例 2：</strong>在下面的示例中，您看到 32 张未知卡片。显示器告诉您其中有 3 张是损失卡片。它还告诉您翻开每张收益卡片可以为您获得 30 分，而翻开损失卡片将使您失去 250 分。假设您决定翻开 10 张卡片然后决定停止。请点击"查看结果"按钮看看会发生什么：<font color = "red">这次，您翻开的第四张卡片是损失卡片。如您所见，一旦翻开损失卡片，该轮将立即结束。您从 3 张收益卡片获得了 90 分，然后因损失卡片扣除了 250 分，所以您这一轮的分数是 -160 分。在从您的轮次总分中扣除损失分数后，计算机还向您显示了您尚未翻开的卡片。请点击下一页按钮。</font>'
	}, delay))
	CCT_timeouts.push(setTimeout(instructTurnCards, delay + 1000))
}



var getPractice1 = function() {
	whichLossCards = [17]
	gainAmt = 30
	lossAmt = 250
	return practiceSetup1
}

var getPractice2 = function() {
	whichLossCards = [2,6,31]
	gainAmt = 10
	lossAmt = 750
	return practiceSetup2
}

var appendPayoutData = function(){
	jsPsych.data.addDataToLastTrial({reward: [prize1, prize2, prize3]})
}

var chooseButton = function(clicked_id) {
	$('#nextButton').prop('disabled', false)
	$('.chooseButton').prop('disabled', true)
	currID = parseInt(clicked_id)
	var roundPoints = 0
	var cards_to_turn = jsPsych.randomization.repeat(cardArray, 1).slice(0, currID)
	for (var i = 0; i < cards_to_turn.length; i++) {
		var card_i = cards_to_turn[i]
		if (whichLossCards.indexOf(card_i) == -1) {
			roundPoints += gainAmt
		} else {
			roundPoints -= lossAmt
			break
		}
	}
	roundPointsArray.push(roundPoints)
	if ($('#feedback').length) {
		document.getElementById("feedback").innerHTML =
			'<strong>您选择了 ' + clicked_id +
			' 张卡片</strong>。当您点击"下一轮"按钮时，下一轮开始。请注意，损失金额、收益金额和损失卡片数量可能已经改变。'
	}
}

var instructButton = function(clicked_id) {
	currID = parseInt(clicked_id)
	document.getElementById(clicked_id).src =
		'images/chosen.png';
}

// appends text to be presented in the game
function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}



// this function sets up the round params (loss amount, gain amount, which ones are loss cards, initializes the array for cards to be clicked, )
var getRound = function() {
	var currID = 0
	cardArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
		24, 25, 26, 27, 28, 29, 30, 31, 32
	]
	shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
	whichRound = whichRound + 1
	randomChosenCards = []
	roundParams = shuffledParamsArray.pop()
	numLossCards = roundParams[0]
	gainAmt = roundParams[1]
	lossAmt = roundParams[2]
	whichLossCards = []
	for (i = 0; i < numLossCards; i++) {
		whichLossCards.push(shuffledCardArray.pop())
	}
	gameState = gameSetup
	gameState = appendTextAfter(gameState, 'Game Round: ', whichRound)
	gameState = appendTextAfter(gameState, 'Loss Amount: ', lossAmt)
	gameState = appendTextAfter(gameState, 'Number of Loss Cards: ', numLossCards)
	gameState = appendTextAfter(gameState, 'Gain Amount: ', gainAmt)
	return gameState
}




/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var currID = 0
var numLossCards = 1
var gainAmt = ""
var lossAmt = ""
var points = []
var whichLossCards = [17]
var CCT_timeouts = []
var numRounds = 24
var whichRound = 0
var totalPoints = 0
var roundOver = 0
var roundPointsArray = []
var prize1 = 0
var prize2 = 0
var prize3 = 0

var practiceSetup1 =
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>练习 1：</strong>如前所述，在您即将玩的这个版本的纸牌游戏中，您不会一张一张地翻卡片。相反，您只需选择想要翻开的卡片总数（从 0 到 32），然后进入下一轮。如果翻开任何卡片对您来说都太冒险，您可以点击零按钮，在这种情况下，您这一轮的分数将自动为零。这是一个练习回合，它看起来就像您将要玩的游戏一样。请根据损失卡片的数量以及如果翻开收益或损失卡片可能获得或失去的分数，选择您想要翻开的卡片数量，如下所示。请注意：计算机会在所有 " + numRounds + " 个游戏回合结束后告诉您做得如何！</div></div>" +
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>游戏轮次：1</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>损失金额：250</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>收益金额：30</div></div>    <div class = titlebox><div class = center-text>您想要拿多少张卡片？</div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>损失卡片数量：1</div></div>"+
	"<div class = buttonbox><button type='button' id = nextButton class = 'CCT-btn select-button' onclick = clearTimers() disabled>下一轮</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()
	


var practiceSetup2 =
 	"<div class = practiceText><div class = block-text2 id = instruct2><strong>练习 2：</strong>计算机将记录您每轮的得分，并在您完成游戏的所有 " + numRounds + " 轮后向您显示总分。这是第二个练习回合。请再次根据损失卡片的数量以及如果翻开收益或损失卡片可能赢得或失去的分数来选择您想要的卡片数量，如下所示。</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>游戏轮次：2</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>损失金额：750</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>收益金额：10</div></div>    <div class = titlebox><div class = center-text>您想要拿多少张卡片？</div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>损失卡片数量：3</div></div>"+
	"<div class = buttonbox><button type='button' id = nextButton class = 'CCT-btn select-button' onclick = clearTimers() disabled>下一轮</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()	
	
	
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
	24, 25, 26, 27, 28, 29, 30, 31, 32
]

var shuffledCardArray = jsPsych.randomization.repeat(cardArray, 1)
var shuffledParamsArray = jsPsych.randomization.repeat(paramsArray, numRounds/8)


var gameSetup = 
	"<div class = practiceText><div class = block-text2 id = feedback></div></div>" +
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text id = game_round>游戏轮次：</div></div>   <div class = titleboxLeft1><div class = center-text id = loss_amount>损失金额：</div></div>    <div class = titleboxMiddle1><div class = center-text id = gain_amount>收益金额：</div></div>    <div class = titlebox><div class = center-text>您想要拿多少张卡片？</div></div>     <div class = titleboxRight1><div class = center-text id = num_loss_cards>损失卡片数量：</div></div>" +
	"<div class = buttonbox><button type='button' id = nextButton class = 'CCT-btn select-button' onclick = clearTimers() disabled>下一轮</button></div>"+
	getButtons()+
	"</div>"+
	getBoard()



/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在此任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对此任务有任何意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'欢迎参加实验。这项任务大约需要 15 分钟。按 <strong>回车键</strong> 开始。'
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
var instruction_trials = []
var instructions_block = {
  type: 'poldrack-instructions',
  data: {trial_id: 'instruction'},
  pages: [
	'<div class = centerbox><p class = block-text><strong>介绍和说明</strong>'+
	'<p>-您现在要参加一个纸牌游戏。在这个游戏中，您将翻开卡片来赢得或失去分数，这些分数价值金钱。</p>'+
	'<p>-在每个游戏回合中，您将在电脑屏幕上看到 32 张牌，面朝下。您将决定翻开其中多少张牌。每张牌要么是收益牌，要么是损失牌（没有中性牌）。您将知道在 32 张牌中有多少张收益牌和损失牌，以及如果您翻开收益牌或损失牌将获得或失去多少分。您不知道的是，您看到的 32 张面朝下的牌中哪些是收益牌，哪些是损失牌。</p>'+
	'<p>-您通过点击一个小按钮来指示想要翻开的卡片数量（从 0 到 32）。您不会看到卡片被翻开，但游戏会选择与您选择数量相等的随机卡片组并"翻开它们"，您看不到过程。每翻开一张收益卡，分数会添加到您的回合总分中，然后翻开另一张卡。这个过程会持续到翻开损失卡或直到达到您选择翻开的卡片数量。第一次翻开损失卡时，损失分数将从您当前的分数总数中扣除，回合结束——即使您指示应该翻开更多卡片。累计总分将是您该回合的分数，然后您进入下一轮。每个新回合都以 0 分开始；这意味着您独立地玩每一轮，不受其他回合影响。</p>'+
	'<p>-您将总共玩 ' + numRounds + ' 轮，其中三轮将在会话结束时随机选择，您将获得与这些轮次成正比的奖金。</p>',
	
    '<div class = centerbox><p class = block-text><strong>未知卡片：</strong>'+
    '<p>这就是未知卡片的样子。点击它来翻开它。</p>'+
    "<p><input type='image' id = '133' src='images/beforeChosen.png' onclick = instructButton(this.id)>"+
	'</p></div>',
	
	'<div class = centerbox><p class = block-text>'+
	'<p><strong>收益卡：</strong></p>'+
	'<p>每翻开一张收益卡，您的分数在不同回合中会增加 10 或 30 分。</p>'+
	"<p><input type='image' src='images/chosen.png'>"+
	'<p><strong>损失卡：</strong></p>'+
	"<p><input type='image' src='images/loss.png'></p>"+
	'<p>每翻开一张损失卡，您的分数在不同回合中会减少 250 或 750 分。此外，该回合会立即结束（您无法再翻开任何卡片）。在任何给定回合中，将有 1 或 3 张损失卡。</p>'+
	'<p>损失卡的数量以及通过翻开收益卡或损失卡可以赢得或失去的分数值在每轮中都是固定的。这些信息将始终显示，以便您知道自己处于哪种类型的回合中。</p>'+
	'</p></div>',
	
	"<div class = practiceText><div class = block-text2 id = instruct1><strong>示例 1：</strong>在下面的示例中，您看到 32 张未知卡片。显示器告诉您其中 1 张是损失卡。它还告诉您翻开每张收益卡可以为您获得 10 分，翻开损失卡将使您失去 750 分。假设您决定翻开 7 张卡片然后决定停止。请点击"查看结果"按钮看看会发生什么：</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>游戏轮次：1</div></div>   <div class = titleboxLeft1><div class = center-text>损失金额：750</div></div>    <div class = titleboxMiddle1><div class = center-text>收益金额：10</div></div>    <div class = titlebox><div class = center-text>您想要拿多少张卡片？</div></div>     <div class = titleboxRight1><div class = center-text>损失卡片数量：1</div></div>   <div class = titleboxRight><div class = center-text id = current_round>当前回合分数：0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = instructButton onclick= instructFunction()>查看结果</button></div></div>"+
	getBoard(2),
	
	"<div class = practiceText><div class = block-text2 id = instruct2><strong>示例 2：</strong>在下面的示例中，您看到 32 张未知卡片。显示器告诉您其中 3 张是损失卡。它还告诉您翻开每张收益卡可以为您获得 30 分，翻开损失卡将使您失去 250 分。假设您决定翻开 10 张卡片然后决定停止。请点击"查看结果"按钮看看会发生什么：</div></div>"+
	"<div class = cct-box2>"+
	"<div class = titleBigBox>   <div class = titleboxLeft><div class = center-text>游戏轮次：1</div></div>   <div class = titleboxLeft1><div class = center-text>损失金额：250</div></div>    <div class = titleboxMiddle1><div class = center-text>收益金额：30</div></div>    <div class = titlebox><div class = center-text>您想要拿多少张卡片？</div></div>     <div class = titleboxRight1><div class = center-text>损失卡片数量：3</div></div>   <div class = titleboxRight><div class = center-text id = current_round>当前回合分数：0</div></div>"+
	"<div class = buttonbox><button type='button' class = CCT-btn id = instructButton onclick= instructFunction2()>查看结果</button></div></div>"+
	getBoard(2),
	"<div class = centerbox><p class = block-text>与那些示例不同，在您即将玩的这个版本的纸牌游戏中，您不会一张一张地翻卡片。相反，您只需选择想要翻开的卡片总数（从 0 到 32），然后继续进行下一轮。我们将完成两个练习回合以确保这一点清楚明了。在继续之前，请确保您理解前两页的示例。</p></div>"
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 1000
};
instruction_trials.push(feedback_instruct_block)
instruction_trials.push(instructions_block)

var instruction_node = {
	timeline: instruction_trials,
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
				'您阅读指令过快。请慢慢来，确保您理解指令。按 <strong>回车键</strong> 继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '指令已完成。按 <strong>回车键</strong> 继续。'
			return false
		}
	}
}

var end_instructions = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = center-block-text><strong>指令结束</strong></p><p class = center-block-text>当您准备好玩游戏时，请按 <strong>回车键</strong>。</p></div>',
	is_html: true,
	data: {
		trial_id: 'end_instructions'
	},
	choices: [13],
	timing_post_trial: 0,
	response_ends_trial: true,
};

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'end',
		exp_id: 'columbia_card_task_cold'
	},
	text: '<div class = centerbox><p class = center-block-text>已完成此任务。</p><p class = center-block-text>按 <strong>回车键</strong> 继续。</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
  	on_finish: assessPerformance
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'practice_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>您好，按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>现在我们将开始测试。通过按空格键尽快响应"X"。按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
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
		appendTestData()
		roundOver = 0
		currTrial = 0
		whichRound = 0
		numLossCards = 3
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
		appendTestData()
		roundOver = 0
		currTrial = 0
		whichRound = 0
		roundPointsArray = []
	}
};

var test_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getRound,
	data: {
		trial_id: 'stim',
		exp_stage: 'test'
	},
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};

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
var columbia_card_task_cold_experiment = [];
columbia_card_task_cold_experiment.push(instruction_node);
columbia_card_task_cold_experiment.push(practice_block1);
columbia_card_task_cold_experiment.push(practice_block2);
columbia_card_task_cold_experiment.push(end_instructions)
for (b = 0; b < numRounds; b++) {
	columbia_card_task_cold_experiment.push(test_block);
}
columbia_card_task_cold_experiment.push(payoutTrial);
columbia_card_task_cold_experiment.push(payout_text);
columbia_card_task_cold_experiment.push(post_task_block)
columbia_card_task_cold_experiment.push(end_block);
