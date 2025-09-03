/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}

function appendTextAfter2(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index +
		"'images/grey_small_square.png' onclick = chooseCard(this.id)".length + 5)
}

var appendTestData = function() {
	var color_clicked = ''
	var correct = false
	if (color1_index.indexOf(currID, 0) != -1) {
		color_clicked = colors[0]
		trial_id = 'stim'
		correct = NaN
	} else if (color2_index.indexOf(currID, 0) != -1) {
		color_clicked = colors[1]
		trial_id = 'stim'
		correct = NaN
	} else if (currID == 26) {
		color_clicked = largeColors[0]
		trial_id = 'choice'
		if (color_clicked === colors[0]) {
			correct = true
		}
	} else if (currID == 27) {
		color_clicked = largeColors[1]
		trial_id = 'choice'
		if (color_clicked === colors[0])  {
			correct = true
		}
	}
	jsPsych.data.addDataToLastTrial({
		exp_stage: exp_stage,
		color_clicked: color_clicked,
		which_click_in_round: numClicks,
		correct_response: colors[0],
		trial_num: current_trial,
		correct: correct,
		trial_id: trial_id
	})
}

var getBoard = function(colors, board_type) {
	var whichSmallColor1 = colors[0] + '_' + shapes[0]
	var whichSmallColor2 = colors[1] + '_' + shapes[0]

	var whichLargeColor1 = largeColors[0] + '_' + shapes[1]
	var whichLargeColor2 = largeColors[1] + '_' + shapes[1]
	var board = "<div class = bigbox><div class = numbox>"
	var click_function = ''
	var click_class = ''
	for (var i = 1; i < 26; i++) {
		if (board_type == 'instruction') {
			click_function = 'instructionFunction'
			click_class = 'small_square'
		} else {
			click_function = 'chooseCard'
			click_class = 'select-button small_square'
		}
		if (clickedCards.indexOf(i) != -1) {
			if (color1_index.indexOf(i) != -1) {
				board +=
					"<div class = square><input type='image' class = 'small_square' id = '" +
					i +
					"' src='images/" + whichSmallColor1 +
					".png'></div>"
			} else if (color2_index.indexOf(i) != -1) {
				board +=
					"<div class = square><input type='image' class = 'small_square' id = '" +
					i +
					"' src='images/" + whichSmallColor2 +
					".png'></div>"
			}
		} else {
			board += "<div class = square><input type='image' class = '" + click_class + "'id = '" +
				i +
				"' src='images/grey_small_square.png' onclick = " +
				click_function + "(this.id)></div>"
		}
	}
	board += "</div><div class = smallbox>"
	if (board_type == 'instruction') {
		board +=
			"<div class = bottomLeft><input type='image' class = 'select-button big_square' id = '26' src='images/" +
			whichLargeColor1 + ".png' onclick = makeInstructChoice(this.id)></div>" +
			"<div class = bottomRight><input type='image' class = 'select-button big_square' id = '27' src='images/" +
			whichLargeColor2 + ".png' onclick = makeInstructChoice(this.id)></div></div></div></div>"
	} else {
		board +=
			"<div class = bottomLeft><input type='image' class = 'select-button big_square' id = '26' src='images/" +
			whichLargeColor1 + ".png' onclick = makeChoice(this.id)></div>" +
			"<div class = bottomRight><input type='image' class = 'select-button big_square' id = '27' src='images/" +
			whichLargeColor2 + ".png' onclick = makeChoice(this.id)></div></div></div></div>"
	}
	return board
}

var appendRewardDataDW = function() {
	jsPsych.data.addDataToLastTrial({
		reward: reward,
		trial_num: current_trial
	})
	current_trial += 1
}

var appendRewardDataFW = function() {
	jsPsych.data.addDataToLastTrial({
		reward: reward,
		trial_num: current_trial
	})
	current_trial += 1
}


var getRound = function() {
	gameState = getBoard(colors, 'test')
	return gameState
}


var chooseCard = function(clicked_id) {
	numClicks = numClicks + 1
	currID = parseInt(clicked_id)
	clickedCards.push(currID)
}

var makeChoice = function(clicked_id) {
	roundOver = 1
	numClicks = numClicks + 1
	currID = parseInt(clicked_id)
}


var resetRound = function() {
	DWPoints = 250
	FWPoints = 0
	roundOver = 0
	numCardReward = []
	numClicks = 0
	clickedCards = []
	colors = jsPsych.randomization.shuffle(['green', 'red', 'blue', 'teal', 'yellow', 'orange',
		'purple', 'brown'
	]).slice(0,2)
	var numbersArray = jsPsych.randomization.repeat(numbers, 1)
	var num_majority = Math.floor(Math.random()*5) + 13
	color1_index = numbersArray.slice(0,num_majority)
	color2_index = numbersArray.slice(num_majority)
	largeColors = jsPsych.randomization.shuffle([colors[0],colors[1]])
	trial_start_time = new Date()
}

var getRewardFW = function() {
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).color_clicked
	correctAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).correct_response
	clickedCards = numbers //set all cards as 'clicked'
	if (lastAnswer == correctAnswer) {
		totFWPoints += 100
		reward = 100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>正确！您获得了100分！</div></div>'
	} else if (lastAnswer != correctAnswer) {
		totFWPoints -= 100
		reward = -100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>错误！您损失了100分！</div></div>'
	}
}


var getRewardDW = function() {
	global_trial = jsPsych.progress().current_trial_global
	lastAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).color_clicked
	correctAnswer = jsPsych.data.getDataByTrialIndex(global_trial - 1).correct_response
	clicks = clickedCards.length
	clickedCards = numbers //set all cards as 'clicked'
	if (lastAnswer == correctAnswer) {
		lossPoints = clicks * 10
		DWPoints = DWPoints - lossPoints
		reward = DWPoints
		totDWPoints +=  DWPoints
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>正确！您获得了' + DWPoints +
			'分！</div></div>'
	} else if (lastAnswer != correctAnswer) {
		totDWPoints -= 100
		reward = -100
		return getBoard(colors,'test') + '<div class = rewardbox><div class = reward-text>错误！您损失了100分！</div></div>'
	}
}

var instructionFunction = function(clicked_id) {
	var whichSmallColor1 = colors[0] + '_' + shapes[0]
	var whichSmallColor2 = colors[1] + '_' + shapes[0]
	currID = parseInt(clicked_id)
	if (color1_index.indexOf(currID) != -1) {
		document.getElementById(clicked_id).src =
			'images/' + whichSmallColor1 + '.png';
	} else {
		document.getElementById(clicked_id).src =
			'images/' + whichSmallColor2 + '.png';

	}
}

var makeInstructChoice = function(clicked_id) {
	clickedCards = numbers //set all cards as 'clicked'
	if (largeColors[['26','27'].indexOf(clicked_id)]==colors[0]) {
		reward = 100
	} else if (clicked_id == 27) {
		reward = -100
	}
}

var getRewardPractice = function() {
	var text = ''
	var correct = false
	var color_clicked = colors[1]
	if (reward === 100) {
		correct = true
		color_clicked = colors[0]
		text = getBoard(colors, 'instruction') + '<div class = rewardbox><div class = reward-text>正确！您获得了100分！</div></div></div>'
	} else  {
		 text = getBoard(colors, 'instruction') + '<div class = rewardbox><div class = reward-text>错误！您损失了100分。</div></div></div>'
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		color_clicked: color_clicked
	})
	return text
}

var getDWPoints = function() {
	return "<div class = centerbox><p class = center-text>总分数：" + totDWPoints + "</p></div>"
}

var getFWPoints = function() {
	return "<div class = centerbox><p class = center-text>总分数：" + totFWPoints + "</p></div>"
}
var get_post_gap = function() {
	return Math.max(1000,(17-total_trial_time)*1000)
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var exp_stage = ''
var num_trials = 10
var reward = 0 //reward value
var totFWPoints = 0
var totDWPoints = 0
var DWPoints = 250
var FWPoints = 0
var roundOver = 0
var numClicks = 0
var current_trial = 0
var trial_start_time = 0 // variable to track beginning of trial time
var total_trial_time = 0 // Variable to track total trial time
var numCardReward = []
var colors = jsPsych.randomization.repeat(['green', 'red', 'blue', 'teal', 'yellow', 'orange',
	'purple', 'brown'
], 1)
var largeColors = []
var shapes = ['small_square', 'large_square']
var numbers = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
var clickedCards = []
//preload images
images = []
var path = 'images/'
for (var c = 0; c<colors.length; c++) {
	images.push(path + colors[c] + '_small_square.png')
	images.push(path + colors[c] + '_large_square.png')
}
jsPsych.pluginAPI.preloadImages(images)
resetRound()
instructionsSetup = getBoard(colors, 'instruction')

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
              '<p class = center-block-text style = "font-size: 20px">您对此任务有什么评论吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
		exp_id: 'information_sampling_task'
	},
	text: '<div class = centerbox><p class = center-block-text>此任务已完成。</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var feedback_instruct_text =
	'欢迎参加实验。此实验大约需要12分钟。按<strong>回车键</strong>开始。'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = centerbox><p class = block-text>在此实验中，您将看到排列成5×5矩阵的小方格。最初所有方格都是灰色的，但当您点击一个方格时，它会显示为两种颜色中的一种，这两种颜色对应屏幕底部的两个大方格。<p class = block-text>您的任务是决定您认为哪种颜色占多数。</p></div>',
		'<div class = centerbox><p class = block-text>您可以按自己的节奏打开方格，在做出选择之前可以打开任意数量的小灰方格。</p><p class = block-text>在做决定前打开多少个方格完全由您决定。</p><p class = block-text>当您做出决定后，应该点击屏幕底部相应的大色块。指导结束后您将完成一次练习试验。</p></div>',
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
				'指导阅读太快。请花时间仔细阅读，确保您理解指导内容。按<strong>回车键</strong>继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '指导完成。按<strong>回车键</strong>继续。'
			return false
		}
	}
}

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	text: '<div class = centerbox><p class = block-text>每次试验都将是这样的。有两种条件会影响您的奖励计算方式。</p><p class = block-text>在<strong>递减获胜</strong>条件下，您将从250分开始。每打开一个方格直到您做出选择，都会从总分中扣除10分。例如，如果您在做出正确选择前打开了7个方格，您该轮的得分将是180分。无论打开多少个方格，错误的决定都会损失100分。</p><p class = block-text>在<strong>固定获胜</strong>条件下，您将从0分开始。无论打开多少个方格，正确的决定都会获得100分。同样，错误的决定会损失100分。<br><br>在两种条件下都要尽可能赢取更多分数。按<strong>回车键</strong>继续。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
};

var DW_intro_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "DW_intro"
	},
	text: '<div class = centerbox><p class = block-text>您将在<strong>递减获胜</strong>条件下开始游戏。</p><p class = block-text>记住，您将从250分开始。每打开一个方格直到您做出正确选择，都会从总分中扣阴10分，之后的余额就是您本轮获得的分数。无论打开多少个方格，错误的决定都会损失100分。请尽可能赢取更多分数。<br><br>按<strong>回车键</strong>继续。</div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function() {
		exp_stage = 'Decreasing Win'
		current_trial = 0
		trial_start_time = new Date()
	}
};

var FW_intro_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "FW_intro"
	},
	text: '<div class = centerbox><p class = block-text>您将在<strong>固定获胜</strong>条件下开始游戏。</p><p class = block-text>记住，您将从0分开始。如果您做出正确选择，您将获得100分。无论打开多少个方格，错误的决定都会损失100分。请尽可能赢取更多分数。<br><br>按<strong>回车键</strong>继续。</div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: function() {
		exp_stage = 'Fixed Win'
		current_trial = 0
		trial_start_time = new Date()
	}
};

var rewardFW_block = {
	type: 'poldrack-single-stim',
	stimulus: getRewardFW,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "Fixed Win"
	},
	choices: 'none',
	timing_response: 2000,
	timing_post_trial: 0,
	on_finish: appendRewardDataFW,
	response_ends_trial: true,
};

var rewardDW_block = {
	type: 'poldrack-single-stim',
	stimulus: getRewardDW,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "Decreasing Win"
	},
	choices: 'none',
	timing_response: 2000,
	timing_post_trial: 0,
	on_finish: appendRewardDataDW,
	response_ends_trial: true,
};

var practiceRewardBlock = {
	type: 'poldrack-single-stim',
	stimulus: getRewardPractice,
	is_html: true,
	data: {
		trial_id: "reward",
		exp_stage: "practice"
	},
	choices: 'none',
	timing_response: 2000,
	timing_post_trial: 1000,
	response_ends_trial: true,
	on_finish: function() {
		clickedCards = []
	}
};

var scoreDW_block = {
	type: 'poldrack-single-stim',
	stimulus: getDWPoints,
	is_html: true,
	data: {
		trial_id: "total_points",
		exp_stage: "Decreasing Win"
	},
	choices: 'none',
	timing_response: get_post_gap,
}

var scoreFW_block = {
	type: 'poldrack-single-stim',
	stimulus: getFWPoints,
	is_html: true,
	data: {
		trial_id: "total_points",
		exp_stage: "Fixed Win"
	},
	choices: 'none',
	timing_response: get_post_gap,
}


var practice_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: instructionsSetup,
	data: {
		trial_id: "choice",
		exp_stage: "practice",
		correct_respose: colors[0]
	},
	timing_post_trial: 0,
	response_ends_trial: true
};

var test_block = {
	type: 'single-stim-button',
	button_class: 'select-button',
	stimulus: getRound,
	timing_post_trial: 0,
	on_finish: appendTestData,
	response_ends_trial: true,
};

var test_node = {
	timeline: [test_block],
	loop_function: function(data) {
		if (roundOver === 1) {
			total_trial_time = (new Date() - trial_start_time)/1000
			return false
		} else if (roundOver === 0) {
			return true
		}
	}
}

var reset_block = {
	type: 'call-function',
	data: {
		trial_id: "reset_round"
	},
	func: resetRound,
	timing_post_trial: 0
}

/* create experiment definition array */
var information_sampling_task_experiment = [];
information_sampling_task_experiment.push(instruction_node);
information_sampling_task_experiment.push(practice_block);
information_sampling_task_experiment.push(practiceRewardBlock);
information_sampling_task_experiment.push(start_test_block);

if (Math.random() < 0.5) { // do the FW first, then DW
	information_sampling_task_experiment.push(FW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardFW_block);
		information_sampling_task_experiment.push(scoreFW_block);
		information_sampling_task_experiment.push(reset_block);
	}
	information_sampling_task_experiment.push(DW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardDW_block);
		information_sampling_task_experiment.push(scoreDW_block);
		information_sampling_task_experiment.push(reset_block);
	}

} else  { ////do DW first then FW
	information_sampling_task_experiment.push(DW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardDW_block);
		information_sampling_task_experiment.push(scoreDW_block);
		information_sampling_task_experiment.push(reset_block);
	}
	information_sampling_task_experiment.push(FW_intro_block);
	for (var i = 0; i < num_trials; i++) {
		information_sampling_task_experiment.push(test_node);
		information_sampling_task_experiment.push(rewardFW_block);
		information_sampling_task_experiment.push(scoreFW_block);
		information_sampling_task_experiment.push(reset_block);
	}
}
information_sampling_task_experiment.push(post_task_block)
information_sampling_task_experiment.push(end_block);
