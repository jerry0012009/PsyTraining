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

function assessPerformance() {
	/* Function to calculate the "credit_var", which is a boolean used to
	credit individual experiments in expfactory. */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	choice_counts[32] = 0
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			choice_counts[key] += 1
			if (rt == -1) {
				missed_count += 1
			} else {
				rt_array.push(rt)
			}
		}
	}
	//calculate average rt
	var avg_rt = -1
	if (rt_array.length !== 0) {
		avg_rt = math.median(rt_array)
	} 
	var missed_percent = missed_count/experiment_data.length
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	credit_var = (missed_percent < 0.4 && (avg_rt > 200) && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
};


//Calculates whether the last trial was correct and records the accuracy in data object
var record_acc = function(data) {
	var target_lower = data.target.toLowerCase()
	var stim_lower = curr_stim.toLowerCase(0)
	var key = data.key_press
	if (stim_lower == target_lower && key == 37) {
		correct = true
		if (block_trial >= delay) {
			block_acc += 1
		}
	} else if (stim_lower != target_lower && key == 40) {
		correct = true
		if (block_trial >= delay) {
			block_acc += 1
		}
	} else {
		correct = false
	}
	jsPsych.data.addDataToLastTrial({
		correct: correct,
		stim: curr_stim,
		trial_num: current_trial
	})
	current_trial = current_trial + 1
	block_trial = block_trial + 1
};

var update_delay = function() {
	var mistakes = base_num_trials - block_acc
	if (delay >= 2) {
		if (mistakes < 3) {
			delay += 1
		} else if (mistakes > 5) {
			delay -= 1
		}
	} else if (delay == 1) {
		if (mistakes < 3) {
			delay += 1
		}
	}
	block_acc = 0
	current_block += 1
};

var update_target = function() {
	if (stims.length >= delay) {
		target = stims.slice(-delay)[0]
	} else {
		target = ""
	}
};

var getStim = function() {
	var trial_type = target_trials.shift()
	var targets = letters.filter(function(x) { return x.toLowerCase() == target.toLowerCase()})
	var non_targets = letters.filter(function(x) { return x.toLowerCase() != target.toLowerCase()})
	if (trial_type === 'target') {
		curr_stim = randomDraw(targets)
	} else {
		curr_stim = randomDraw(non_targets)
	}
	stims.push(curr_stim)
	return '<div class = "centerbox"><div class = "center-text">' + curr_stim + '</div></div>'
}

var getData = function() {
	return {
		trial_id: "stim",
		exp_stage: "adaptive",
		load: delay,
		target: target,
		block_num: current_block
	}
}

var getText = function() {
	return '<div class = "centerbox"><p class = "block-text">在接下来的测试中，当当前字母与 ' +
	delay +
		' 轮之前出现的字母相同时，请按左方向键。否则请按下方向键</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true //default to true

// task specific variables
var letters = 'bBdDgGtTvV'.split("")
var num_blocks = 20 // number of adaptive blocks
var base_num_trials = 20 // total num_trials = base + load 
var control_before = Math.round(Math.random()) //0 control comes before test, 1, after
var block_acc = 0 // record block accuracy to determine next blocks delay
var delay = 2 // starting delay
var trials_left = 0 // counter used by adaptive_test_node
var target_trials = [] // array defining whether each trial in a block is a target trial
var current_trial = 0
var current_block = 0  
var block_trial = 0
var target = ""
var curr_stim = ''
var stims = [] //hold stims per block

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention"
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
   questions: ['<p class = center-block-text style = "font-size: 20px">请简述这个任务要求您做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么意见或建议吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'欢迎参加实验。此任务大约需要20分钟。按 <strong>回车键</strong> 开始。'
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
	pages: [
		'<div class = "centerbox"><p class = "block-text">在此实验中，您将看到逐个呈现的字母序列。当当前字母与之前某个特定轮次（称为"延迟"）出现的字母相同时，请按<strong>左方向键</strong>，否则请按<strong>下方向键</strong>。字母可能是大写或小写，请忽略大小写差异（例如"t"与"T"视为相同）。</p><p class = block-text>不同测试块的延迟轮数不同，每个测试块开始前会告知您具体的延迟数。</p><p class = block-text>例如，如果延迟为2，当当前字母与2轮前出现的字母相同时，您应按左方向键。如果看到序列：g...G...v...T...b...t...b，您应在最后的"t"和最后的"b"时按左方向键，其他字母按下方向键。</p><p class = block-text>有一个测试块没有延迟。在此测试块中，您需要对特定字母按左方向键。例如，如果指定字母是"t"，当看到"t"或"T"时按左方向键。</p></div>'
	],
	data: {
		trial_id: 'instruction'
	},
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
				'阅读说明过快。请仔细阅读并确保理解实验说明。按 <strong>回车键</strong> 继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '说明阅读完毕。按 <strong>回车键</strong> 继续。'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	text: '<div class = "centerbox"><p class = "center-block-text">感谢您完成此任务！</p><p class = center-block-text>按 <strong>回车键</strong> 结束。</p></div>',
	cont_key: [13],
	data: {
		trial_id: "end",
    	exp_id: 'adaptive_n_back'
	},
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var start_practice_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>开始练习。练习时，当当前字母与1轮前出现的字母相同时按左方向键，否则按下方向键。</p><p class = center-block-text>练习时会提供反馈，正式实验中没有反馈。按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	timing_post_trial: 1000
};

var update_delay_block = {
	type: 'call-function',
	func: update_delay,
	data: {
		trial_id: "update_delay"
	},
	timing_post_trial: 0
}

var update_target_block = {
	type: 'call-function',
	func: update_target,
	data: {
		trial_id: "update_target"
	},
	timing_post_trial: 0
}

var start_control_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>在此测试块中，您不需要匹配之前的字母。当看到"t"或"T"时按左方向键，看到其他字母时按下方向键。</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	data: {
		trial_id: "instruction"
	},
	timing_response: 180000,
	timing_post_trial: 2000,
	on_finish: function() {
		target_trials = jsPsych.randomization.repeat(['target','0', '0'], Math.round(base_num_trials/3)).slice(0,base_num_trials)
	}
};

var start_adaptive_block = {
	type: 'poldrack-text',
	data: {
		exp_stage: "adaptive",
		trial_id: "delay_text"
	},
	text: getText,
	cont_key: [13],
	on_finish: function() {
		block_trial = 0
		stims = []
		trials_left = base_num_trials + delay
		target_trials = []
		for (var i = 0; i < delay; i++) {
			target_trials.push('0')
		}
		var trials_to_add = []
		for ( var j = 0; j < (trials_left - delay); j++) {
			if (j < (Math.round(base_num_trials/3))) {
				trials_to_add.push('target')
			} else {
				trials_to_add.push('0')
			}
		}
		trials_to_add = jsPsych.randomization.shuffle(trials_to_add)
		target_trials = target_trials.concat(trials_to_add)
		block_acc = 0;
	}
};

var adaptive_block = {
	type: 'poldrack-single-stim',
	is_html: true,
	stimulus: getStim,
	data: getData,
	choices: [37,40],
	timing_stim: 500,
	timing_response: 2000,
	timing_post_trial: 0,
	on_finish: function(data) {
		record_acc(data)
	}
};

//Setup 1-back practice
practice_trials = []
for (var i = 0; i < (base_num_trials + 1); i++) {
	var stim = randomDraw(letters)
	stims.push(stim)
	if (i >= 1) {
		target = stims[i - 1]
	}
	if (stim.toLowerCase() == target.toLowerCase()) { 
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
		timeout_message: '<div class = centerbox><div style="font-size:60px" class = center-text>请更快地响应！</div></div>',
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
for (var i = 0; i < base_num_trials*2; i++) {
	var control_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		stimulus: getStim,
		data: {
			trial_id: "stim",
			exp_stage: "control",
			load: 0,
			target: 't',
		},
		choices: [37,40],
		timing_stim: 500,
		timing_response: 2000,
		timing_post_trial: 0,
		on_finish: function(data) {
			record_acc(data)
		}
	};
	control_trials.push(control_block)
}

var adaptive_test_node = {
	timeline: [update_target_block, adaptive_block],
	loop_function: function() {
		trials_left -= 1
		if (trials_left === 0) {
			return false
		} else { 
			return true 
		}
	}
}
	
//Set up experiment
var adaptive_n_back_experiment = []
adaptive_n_back_experiment.push(instruction_node);
adaptive_n_back_experiment.push(start_practice_block)
adaptive_n_back_experiment = adaptive_n_back_experiment.concat(practice_trials)

if (control_before === 0) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
for (var b = 0; b < num_blocks; b++) { 
	adaptive_n_back_experiment.push(start_adaptive_block)
	adaptive_n_back_experiment.push(adaptive_test_node)
	if ($.inArray(b, [4, 7, 15]) != -1) {
		adaptive_n_back_experiment.push(attention_node)
	}
	adaptive_n_back_experiment.push(update_delay_block)
}



if (control_before == 1) {
	adaptive_n_back_experiment.push(start_control_block)
	adaptive_n_back_experiment = adaptive_n_back_experiment.concat(control_trials)
}
//Set up control
adaptive_n_back_experiment.push(post_task_block)
adaptive_n_back_experiment.push(end_block)