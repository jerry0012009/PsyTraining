/*
reference: http://www.sciencedirect.com/science/article/pii/S1053811905001424
Cognitive control and brain resources in major depression: An fMRI study using the n-back task Harvey at al. 2005
This task differs in that the subject only has to respond on target trials, rather than indicating whether the current trial is 
a match or not
*/

/* ************************************ */
/* Define helper functions */
/* ************************************ */
function evalAttentionChecks() {
	var check_percent = 1
	if (run_attention_checks) {
		var attention_check_trials = jsPsych.data.getTrialsOfType('attention-check')
		var checks_passed = 0
		for (var i = 0; i < attention_check_trials.length; i++) {
			if (attention_check_trials[i].correct === true) {
				checks_passed += 1
			}
		}
		check_percent = checks_passed / attention_check_trials.length
	}
	return check_percent
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

//Calculates whether the last trial was correct and records the accuracy in data object
var record_acc = function() {
	var global_trial = jsPsych.progress().current_trial_global
	var stim = jsPsych.data.getData()[global_trial].stim.toLowerCase()
	var target = jsPsych.data.getData()[global_trial].target.toLowerCase()
	var key = jsPsych.data.getData()[global_trial].key_press
	if (stim == target && key == 37) {
		correct = true
	} else if (stim != target && key == 40) {
		correct = true
	} else {
		correct = false
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		trial_num: current_trial
	})
	current_trial = current_trial + 1
}


/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var current_trial = 0
var letters = 'bBdDgGtTvV'
var num_blocks = 2 //of each delay
var num_trials = 50
var num_practice_trials = 25
var delays = jsPsych.randomization.shuffle([1, 2, 3])
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var stims = [] //hold stims per block

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention_check"
	},
	timing_response: 180000,
	response_ends_trial: true,
	timing_post_trial: 200
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请概述您在此任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对此任务有任何意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'欢迎参与实验。请按<strong>回车键</strong>开始。'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "instruction"
	},
	cont_key: [13],
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
		'<div class = centerbox><p class = block-text>在这个实验中，你将看到一连串字母逐个呈现。你的任务是：当当前字母与之前1、2或3次试验中出现的字母相同时，按<strong>左箭头键</strong>，否则按<strong>下箭头键</strong>。字母有大写和小写，你应忽略大小写（即"t"与"T"匹配）。</p><p class = block-text>不同试验区块中需要注意的具体延迟会有所不同，在开始试验区块前会告知你延迟时间。</p><p class = block-text>例如，如果延迟是2，当当前字母与2次试验前出现的字母匹配时，你应按左箭头键。如果你看到序列：g...G...v...T...b...t...b，你应在最后一个"t"和最后一个"b"时按左箭头键，其他字母都按下箭头键。</p><p class = block-text>有一个试验区块没有延迟。在此区块中，你将被指示在出现特定字母时按左箭头键。例如，特定字母可能是"t"，这种情况下你应在看到"t"或"T"时按左箭头键。</p></div>',
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
				'您阅读指导说明的速度过快。请花时间仔细阅读并确保理解指导说明。按<strong>回车键</strong>继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '指导说明已完成。按<strong>回车键</strong>继续。'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "end",
		exp_id: 'n_back'
	},
	text: '<div class = centerbox><p class = center-block-text>感谢您完成此任务！</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};


var start_practice_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>开始练习。在练习中，当当前字母与前1次试验中的字母匹配时，请按左箭头键。否则请按下箭头键</p><p class = center-block-text>在练习中您将收到正确与否的反馈。正式实验中不会有反馈。按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>开始测试区块。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_control_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "control_intro"
	},
	text: '<div class = centerbox><p class = block-text>在此区块中，您不需要将字母与之前的字母匹配。相反，每当您看到"t"或"T"时按左箭头键，所有其他字母按下箭头键。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

//Setup 1-back practice
practice_trials = []
for (var i = 0; i < (num_practice_trials); i++) {
	var stim = randomDraw(letters)
	stims.push(stim)
	if (i >= 1) {
		target = stims[i - 1]
	}
	if (stim == target) { 
		correct_response = 37
	} else {
		correct_response = 40
	}
	var practice_block = {
		type: 'poldrack-categorize',
		is_html: true,
		stimulus: '<div class = centerbox><div class = center-text>' + stim + '</div></div>',
		key_answer: correct_response,
		data: {
			trial_id: "stim",
			exp_stage: "practice",
			stim: stim,
			target: target
		},
		correct_text: '<div class = centerbox><div style="color:green;font-size:60px"; class = center-text>正确！</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red;font-size:60px"; class = center-text>错误</div></div>',
		timeout_message: '<div class = centerbox><div style="font-size:60px" class = center-text>请更快回应！</div></div>',
		timing_feedback_duration: 500,
		show_stim_with_feedback: false,
		choices: [37,40],
		timing_stim: 500,
		timing_response: 2000,
		timing_post_trial: 500
	};
	practice_trials.push(practice_block)
}

//Define control (0-back) block
var control_trials = []
for (var i = 0; i < num_trials; i++) {
	var stim = randomDraw(letters)
	var control_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		stimulus: '<div class = centerbox><div class = center-text>' + stim + '</div></div>',
		data: {
			trial_id: "stim",
			exp_stage: "test",
			load: 0,
			stim: stim,
			target: 't'
		},
		choices: [37,40],
		timing_stim: 500,
		timing_response: 2000,
		timing_post_trial: 0,
		on_finish: record_acc
	};
	control_trials.push(control_block)
}

//Set up experiment
var n_back_experiment = []
n_back_experiment.push(instruction_node);
n_back_experiment.push(start_practice_block)
n_back_experiment = n_back_experiment.concat(practice_trials)

if (control_before === 0) {
	n_back_experiment.push(start_control_block)
	n_back_experiment = n_back_experiment.concat(control_trials)
}
for (var d = 0; d < delays.length; d++) {
	var delay = delays[d]
	var start_delay_block = {
		type: 'poldrack-text',
		data: {
			trial_id: "delay_text"
		},
		timing_response: 180000,
		text: '<div class = centerbox><p class = block-text>在接下来的区块中，当当前字母与前 ' +
			delay +
			' 次试验中出现的字母匹配时，请按左箭头键。否则请按下箭头键</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
		cont_key: [13]
	};
	n_back_experiment.push(start_delay_block)
	for (var b = 0; b < num_blocks; b++) {
		n_back_experiment.push(start_test_block)
		var target = ''
		stims = []
		for (var i = 0; i < num_trials; i++) {
			var stim = randomDraw(letters)
			stims.push(stim)
			if (i >= delay) {
				target = stims[i - delay]
			}
			var test_block = {
				type: 'poldrack-single-stim',
				is_html: true,
				stimulus: '<div class = centerbox><div class = center-text>' + stim + '</div></div>',
				data: {
					trial_id: "stim",
					exp_stage: "test",
					load: delay,
					stim: stim,
					target: target
				},
				choices: [37,40],
				timing_stim: 500,
				timing_response: 2000,
				timing_post_trial: 0,
				on_finish: record_acc
			};
			n_back_experiment.push(test_block)
		}
	}
	n_back_experiment.push(attention_node)
}
if (control_before == 1) {
	n_back_experiment.push(start_control_block)
	n_back_experiment = n_back_experiment.concat(control_trials)
}
n_back_experiment.push(post_task_block)
n_back_experiment.push(end_block)