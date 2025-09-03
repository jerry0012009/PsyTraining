/* ***************************************** */
/*          Define helper functions          */
/* ***************************************** */


/* get subject number entry, load stimuli, and report back to subject */
var getSubjnum = function () {
	var subjnum_trial = jsPsych.data.getLastTrialData()
	var subjstring = subjnum_trial.responses[7] + subjnum_trial.responses[8] + subjnum_trial.responses[9]
	var subjnum = Number(subjstring);
	var stimArray = picArray[subjnum];
	var subjcode = subjcodeArray[subjnum];
	if (typeof stimArray == "undefined") {
		stimArray = picArray[0];
		var listerrortext = "<div class = centerbox><p class = block-text><div style='color:red'>参与者编号 </p><p class = block-text>" + subjnum + " 未找到！  </p><p class = block-text>请<strong>退出</strong>并检查参与者编号！！</p></div></div>"
	} else {
		var listerrortext = "<div class = centerbox><p class = block-text><div style='color:black'>参与者编号 </p><p class = block-text><strong>" + subjnum + "</strong>，代码为 <strong>" + subjcode + "</strong> 已找到！  </p><p class = block-text>按<strong>回车键</strong>继续。</p></div></div>"
	};
	jsPsych.pluginAPI.preloadImages(stimArray);
	answers = genLearnphasestims(stimArray)
	return listerrortext
};


var getSubjreport = function () {
	if (typeof stimArray == "undefined") {
		stimArray = picArray[0];
		var listerrortext = "<div class = centerbox><p class = block-text><div style='color:red'>参与者编号 </p><p class = block-text>" + numtemp + " 未找到！  </p><p class = block-text>请<strong>退出</strong>并检查参与者编号！！</p></div></div>"
	} else {
		stimArray = picArray(subjnum);
		var listerrortext = "<div class = centerbox><p class = block-text><div style='color:black'>参与者编号 </p><p class = block-text>" + numtemp + " 已找到！  </p><p class = block-text>按<strong>回车键</strong>继续。</p></div></div>"
	};
	return listerrortext
};



var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function getDisplayElement() {
   $('<div class = display_stage_background></div>').appendTo('body')
   return $('<div class = display_stage></div>').appendTo('body')
}

function addID() {
 jsPsych.data.addDataToLastTrial({exp_id: 'reward_learning'})
}

var getStim = function() {
	stim = learnPhaseStimsComplete.image.pop()
	curr_data = learnPhaseStimsComplete.data.pop()
	return stim
}

var getResponse = function() {
	return answers.answers.pop()
}

var getYes = function() {
  var throwaway = answers.nofdbk.pop()
	return answers.yesfdbk.pop()
}

var getNo = function() {
  var throwaway = answers.yesfdbk.pop()
	return answers.nofdbk.pop()
}

var getMissed = function() {
	var throwaway = answers.yesfdbk.pop()
	throwaway = answers.nofdbk.pop()
	return "<div class = containerbox><div class = centerbox><div style='color:red'; class = center-text>太晚了！-$0.50</div></div></div>"
}

var getITIdurstim = function() {
	return itilist.itistim.pop()
}

var getITIdurresp = function() {
	return itilist.itiresp.pop()
}


var getITI = function() {
	gap = ( Math.floor(Math.random() * 1500) + 250 )
	return gap
}


var genITIs = function () {
	var ititemp = [];
	for(var i = 0; i < Learn_trials; i++){
		ititemp.push( Math.floor(Math.random() * 1500) + 250 );		
		};
  var itilist = [];
	var itistim = [];
	var itiresp = [];
	for(var i = 0; i < Learn_trials; i++){
		itistim.push(ititemp[i]),
		itiresp.push(ititemp[i])
	}
	return {
	  itilist: itilist,
		itistim: itistim,
		itiresp: itiresp
	};
};



// generate a random list of numbers to add / subtract to the feedback amounts
var feedbacknoise = jsPsych.randomization.repeat([0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05, 0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05, 0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05, 0.01, -0.01, 0.02, -0.02, 0.03, -0.03, 0.04, -0.04, 0.05, -0.05],1);
		

var genResponses = function(stimuli) {
	var answers_stim1 = jsPsych.randomization.repeat([38, 38, 38, 38, 38, 38, 38, 38, 38, 38],
		eachRepNum / 10);
	var answers_stim2 = jsPsych.randomization.repeat([40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
		eachRepNum / 10);
	var answers_stim3 = jsPsych.randomization.repeat([38, 38, 38, 38, 38, 38, 38, 38, 38, 38],
		eachRepNum / 10);
	var answers_stim4 = jsPsych.randomization.repeat([40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
		eachRepNum / 10);
	var answers_stim5 = jsPsych.randomization.repeat([38, 38, 38, 38, 38, 38, 38, 38, 38, 38],
		eachRepNum / 10);
	var answers_stim6 = jsPsych.randomization.repeat([40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
		eachRepNum / 10);
	var answers_stim7 = jsPsych.randomization.repeat([38, 38, 38, 38, 38, 38, 38, 38, 38, 38],
		eachRepNum / 10);
	var answers_stim8 = jsPsych.randomization.repeat([40, 40, 40, 40, 40, 40, 40, 40, 40, 40],
		eachRepNum / 10);
	
	var count1 = 0;
	var count2 = 0;
	var count3 = 0;
	var count4 = 0;
	var count5 = 0;
	var count6 = 0;
	var count7 = 0;
	var count8 = 0;
	
	var answers = [];
	var yesfdbk = [];
	var nofdbk = [];
	
	for (var i = 0; i < Learn_trials; i++) {
	
		if (stimuli.data[i].condition === 'stim1') {
			answers.push(answers_stim1[count1]);
			yesnumb = 0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count1 = count1 + 1;
		} else if (stimuli.data[i].condition === 'stim2') {
			answers.push(answers_stim2[count2]);
			yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count2 = count2 + 1;
		} else if (stimuli.data[i].condition === 'stim3') {
			answers.push(answers_stim3[count3]);
			yesnumb = 0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count3 = count3 + 1;
		} else if (stimuli.data[i].condition === 'stim4') {
			answers.push(answers_stim4[count4]);
			yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count4 = count4 + 1;
		} else if (stimuli.data[i].condition === 'stim5') {
			answers.push(answers_stim5[count5]);
			yesnumb = 0.45 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count5 = count5 + 1;
		} else if (stimuli.data[i].condition === 'stim6') {
			answers.push(answers_stim6[count6]);
			yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count6 = count6 + 1;
		} else if (stimuli.data[i].condition === 'stim7') {
			answers.push(answers_stim7[count7]);
			yesnumb = 0.45 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = -0.05 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count7 = count7 + 1;
		} else {
			answers.push(answers_stim8[count8]);
			yesnumb = -0.25 + feedbacknoise[i]; yesnumb = yesnumb.toFixed(2);
			nonumb = 0.00 + feedbacknoise[i]; nonumb = nonumb.toFixed(2);
			count8 = count8 + 1;
		}
		if (stimuli.data[i].optimal_response == choices[0]) {
			yesfdbk.push("<div class = containerbox><div class = centerbox><div style='color:#64FF64'; class = center-text>+" + yesnumb + "!</div></div></div>");
			nofdbk.push("<div class = containerbox><div class = centerbox><div style='color:#FF0000'; class = center-text>" + nonumb + "!</div></div></div>");
		} else {
			yesfdbk.push("<div class = containerbox><div class = centerbox><div style='color:#FF0000'; class = center-text>" + yesnumb + "!</div></div></div>");
			nofdbk.push("<div class = containerbox><div class = centerbox><div style='color:white'; class = center-text>" + nonumb + "!</div></div></div>");
		}
	}
	return {
        answers: answers,
        yesfdbk: yesfdbk,
        nofdbk: nofdbk
    };
};



var getPrevresponse = function() {
	var choice_trial = jsPsych.data.getLastTrialData()
	var keypress = choice_trial.key_press
	var rt = choice_trial.rt
	if (keypress == -1) {
		return getMissed
	} else if (keypress == 38 ) {
		return getYes	
	} else if (keypress == 40 ) {
		return getNo
	};
};



/*************************************************************************/
/*                 DEFINE EXPERIMENTAL VARIABLES                         */
/*************************************************************************/
// task specific variables
var choices = [38, 40]
var curr_data = []
var stim = ''
// specify the number of trials in the learning phase
var Learn_trials = 40;
var eachRepNum = 5;


// load pre-rated individualized stims
// jsPsych.pluginAPI.preloadImages(stimArray)

// var stims = [['stim1', stimArray[0], choices[0]],
// 			['stim2', stimArray[1], choices[1]],
// 			['stim3', stimArray[2], choices[0]],
// 			['stim4', stimArray[3], choices[1]],
// 			['stim5', stimArray[4], choices[0]],
// 			['stim6', stimArray[5], choices[1]],
// 			['stim7', stimArray[6], choices[0]],
// 			['stim8', stimArray[7], choices[1]],
// 			['Yes', stimArray[8], 101],
// 			['No', stimArray[9], 102]]

// var optionstims = [['Yes', stimArray[8]],			
// 			['No', stimArray[9]]]




/* learning phase stims, randomized */
// learnPhaseStims = [];
// 	for (var i = 0; i<8; i++) {
// 		var list_stim = {}
// 		list_stim.image = "<div class = containerbox><div class = decision-up><img src='" + stims[8][1] +
// 			"'></img></div><div class = centerbox><input type = 'image' class = 'picture_size' src='" + stims[i][1] + 
// 			"'></div><div class = decision-down><img src='" + stims[9][1] +
// 			"'></img></div></div>"
// 		list_stim.data = {
// 			trial_id: 'stim',
// 			exp_stage: 'learning',
// 			condition: stims[i][0],
// 			optimal_response: stims[i][2]
// 		}
// 		learnPhaseStims.push(list_stim)
// 	};

var genLearnphasestims = function (stimArray) {
	var stims = [['stim1', stimArray[0], choices[0]],
				['stim2', stimArray[1], choices[1]],
				['stim3', stimArray[2], choices[0]],
				['stim4', stimArray[3], choices[1]],
				['stim5', stimArray[4], choices[0]],
				['stim6', stimArray[5], choices[1]],
				['stim7', stimArray[6], choices[0]],
				['stim8', stimArray[7], choices[1]],
				['Yes', stimArray[8], 101],
				['No', stimArray[9], 102]]
	learnPhaseStims = [];
	for (var i = 0; i<8; i++) {
		var list_stim = {}
		list_stim.image = "<div class = containerbox><div class = decision-up><img src='" + stims[8][1] +
			"'></img></div><div class = centerbox><input type = 'image' class = 'picture_size' src='" + stims[i][1] + 
			"'></div><div class = decision-down><img src='" + stims[9][1] +
			"'></img></div></div>"
		list_stim.data = {
			trial_id: 'stim',
			exp_stage: 'learning',
			condition: stims[i][0],
			optimal_response: stims[i][2]
		}
		learnPhaseStims.push(list_stim)
	};
	learnPhaseStimsComplete = jsPsych.randomization.repeat(learnPhaseStims, eachRepNum, true);
	var answers = genResponses(learnPhaseStimsComplete)
	return answers
};

// var learnPhaseStimsComplete = jsPsych.randomization.repeat(learnPhaseStims, eachRepNum, true);
// var answers = genResponses(learnPhaseStimsComplete)
var curr_data = ''


var itilist = genITIs()



/* ************************************ */
/*         Set up jsPsych blocks        */
/* ************************************ */

// set up pre-task entry of subject number
var pre_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "subject number entry"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请输入您的3位数参与者编号（试点测试：111）：</p>'],
   rows: [1, 1],
   columns: [3, 3]
};

// set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在这个任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */

// introduction
var feedback_instruct_text =
	'欢迎回到实验！按<strong>回车键</strong>开始。'
var learning_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000000
};


// subject number processing and picture list creation
var learning_participantexists = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
	text: getSubjnum,
	timing_post_trial: 0,
	timing_response: 180000000
};


// instructions part 1
var instructions_block = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction"
	},
	pages: [
		'<div class = containerbox><div class = centerbox><p class = block-text>今天您将继续学习关于幸运和不幸运场景的知识。提醒一下，您将看到每个场景上方有"是"选项，下方有"否"选项。对于每个场景，您必须使用<strong>上</strong>或<strong>下</strong>箭头键来选择一个选项。</p><p class = block-text>每个场景有不同的"幸运"概率。您的任务是通过在幸运形状上押注"是"和在不幸运形状上押注"否"来最大化您的奖金（$）。</p></div></div>',
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};


var learning_phase_trials = {
	type: 'poldrack-categorize',
	stimulus: getStim,
	key_answer: getResponse,
	choices: choices,
	show_stim_with_feedback: false,
	correct_text: "<div class = containerbox><div class = centerbox><div class = center-text></div></div></div>",
  incorrect_text: "<div class = containerbox><div class = centerbox><div class = center-text></div></div></div>",
	timeout_message: "<div class = containerbox><div class = centerbox><div class = center-text></div></div></div>",	
	timing_stim: 1500,
	timing_response: 1500,
	timing_feedback_duration: 1000,
	response_ends_trial: false,
	timing_post_trial: 0,
	is_html: true
};


var learning_phase_feedback = {
	type: 'poldrack-single-stim',
	choices: 'none',
	response_ends_trial: false,
	stimulus: getPrevresponse,
	is_html: true,
	choices: 'none',
	data: {
			trial_id: "feedback",
			exp_stage: "learn"
	},
	timing_post_trial: 0,
	timing_stim: 750,
	timing_response: 750
}


var learning_phase_itis = {
	type: 'poldrack-single-stim',
	choices: 'none',
	response_ends_trial: false,
	type: 'poldrack-single-stim',
	stimulus: "<div class = containerbox><div class = centerbox><div class = fixwhite>+</div></div></div>",
	is_html: true,
	choices: 'none',
	data: {
			trial_id: "fixation_white",
			exp_stage: "learn"
	},
	timing_post_trial: 0,
	timing_stim: getITIdurstim,
	timing_response: getITIdurresp
}



var learning_phase_prefix = {
	type: 'poldrack-single-stim',
	stimulus: "<div class = containerbox><div class = centerbox><div class = fixation>+</div></div></div>",
	is_html: true,
	choices: 'none',
	response_ends_trial: false,
	data: {
			trial_id: "fixation_black",
			exp_stage: "learn"
	},
	timing_post_trial: 0,
	timing_stim: 250,
	timing_response: 250
}



var learning_phase_start = {
	type: 'poldrack-text',
	timing_response: 1800000,
	data: {
		trial_id: "learning_phase_intro"
	},
	text: '<div class = centerbox><p class = block-text>准备好！</p><p class = block-text> 当您准备好时按<strong>回车键</strong>。</p></div>',
	cont_key: [13]
};

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
		exp_id: 'reward_learning'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>完成这个任务！</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
	cont_key: [13]
};



/* create experiment definition array */
var reward_learning_experiment = [];
reward_learning_experiment.push(pre_task_block);
reward_learning_experiment.push(learning_participantexists);
// reward_learning_experiment.push(learning_instruct_block);
reward_learning_experiment.push(learning_phase_start);
for(var i = 0; i<3; i++){
	reward_learning_experiment.push(learning_phase_itis);
	reward_learning_experiment.push(learning_phase_prefix);
	reward_learning_experiment.push(learning_phase_trials);
	reward_learning_experiment.push(learning_phase_feedback);
}
reward_learning_experiment.push(end_block);
