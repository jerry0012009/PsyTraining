/* ************************************ */
/* Define helper functions */
/* ************************************ */
function assessPerformance() {
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-categorize')
	var missed_count = 0
	var trial_count = 0
	var correct_count = 0
	var rt_array = []
	var rt = 0
		//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
		choice_counts[choices[k]] = 0
	}
	for (var i = 0; i < experiment_data.length; i++) {
		if (experiment_data[i].possible_responses != 'none') {
			trial_count += 1
			rt = experiment_data[i].rt
			key = experiment_data[i].key_press
			correct = experiment_data[i].correct
			choice_counts[key] += 1
			if(correct) correct_count += 1
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
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	var missed_pct = missed_count/trial_count
	var accuracy = correct_count/trial_count
	var attn_correct_pct = evalAttentionChecks()
	
	credit_var = (missed_pct < 0.4 && avg_rt > 200 && responses_ok && accuracy > 0.6)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
	
	results = {
			missed_pct: missed_pct, 
			accuracy: accuracy, 
			attn_correct_pct: attn_correct_pct, 
			credit_var: credit_var
			};
	
	return(results);
}


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

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = true
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = 0

/*
/* High contrast, color-blind safe colors
/*	红色 = #f64747
/*	蓝色 = #00bfff
/*	黄色 = #F1F227
*/

// task specific variables
var congruent_stim = [{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#f64747">红色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'red',
		stim_word: 'red',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#00bfff">蓝色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'blue',
		stim_word: 'blue',
		correct_response: 66
	},
	key_answer: 66
},{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#F1F227">黄色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'congruent',
		stim_color: 'yellow',
		stim_word: 'yellow',
		correct_response: 89
	},
	key_answer: 89
}];

var incongruent_stim = [{
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#f64747">蓝色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'red',
		stim_word: 'blue',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#f64747">黄色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'red',
		stim_word: 'yellow',
		correct_response: 82
	},
	key_answer: 82
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#00bfff">红色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'blue',
		stim_word: 'red',
		correct_response: 66
	},
	key_answer: 66
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#00bfff">黄色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'blue',
		stim_word: 'yellow',
		correct_response: 66
	},
	key_answer: 66
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#F1F227">红色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'yellow',
		stim_word: 'red',
		correct_response: 89
	},
	key_answer: 89
}, {
	stimulus: '<div class = centerbox><div class = stroop-stim style = "font-weight:bold;color:#F1F227">蓝色</div></div>',
	data: {
		trial_id: 'stim',
		condition: 'incongruent',
		stim_color: 'yellow',
		stim_word: 'blue',
		correct_response: 89
	},
	key_answer: 89
}];
// High proportion congruency: twice as many congruent as incongruent
var stims = [].concat(congruent_stim, congruent_stim, congruent_stim, congruent_stim, incongruent_stim)
var practice_len = 18
var practice_stims = jsPsych.randomization.repeat(stims, practice_len / 18, true)
var exp_len = 72
var test_stims = jsPsych.randomization.repeat(stims, exp_len / 18, true)
var choices = [66, 82, 89]
var exp_stage = 'practice'

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: "attention_check"
	},
	timing_response: 7500,
	response_ends_trial: true,
	timing_post_trial: 1000
}

var attention_node = {
	timeline: [attention_check_block],
	conditional_function: function() {
		return run_attention_checks
	}
}

/* define static blocks */
var response_keys =
	'<ul class="list-text"><li><span class = "large" style = "color:#f64747;font-weight:bold">红色字体</span>: "R键"</li><li><span class = "large" style = "color:#00bfff;font-weight:bold">蓝色字体</span>: "B键"</li><li><span class = "large" style = "color:#F1F227;font-weight:bold">黄色字体</span>: "Y键"</li></ul>'


var feedback_instruct_text =
	'<div class = centerbox><p class = block-text>让我们来玩一个颜色匹配游戏！专注力在这里很重要，所以在我们开始之前，请确保您已经准备好<u><strong>五分钟</strong></u>不被打断的游戏时间！</p> <p class = block-text">按<strong>Enter键</strong>继续。</p></div>'
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
		'<div class = centerbox style="height:80vh"><p class = block-text">在这个游戏中，您将会看到颜色字词（红色、蓝色、绿色、黄色）逐个出现。这些字词的"字体颜色"也会被着色。例如，您可能会看到：<span class = "large" style = "color:#f64747;font-weight:bold">红色</span>、<span class = "large" style = "color:#00bfff;font-weight:bold">蓝色</span>或<span class = "large" style = "color:#f64747;font-weight:bold">蓝色</span>。</p><p class = block-text">您的任务是按下对应于字词<strong><u>字体颜色</u></strong>的按键。请尽可能<u><strong>快速准确</strong></u>地响应。响应按键如下：</p>' +
		response_keys + '</div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};
var instructions_block2 = {
	type: 'poldrack-instructions',
	data: {
		trial_id: "instruction2"
	},
	pages: [
		'<div class = centerbox style="height:80vh"><p class = block-text">将您的手指放在键盘上最舒适的位置。下面显示了推荐的手指放置方法。</p><p><img src="recommended_finger_placement.svg" alt="推荐的手指放置图示"></p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var instruction_node = {
	timeline: [feedback_instruct_block, instructions_block, instructions_block2],
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
				'阅读指示过快。请您花时间仔细阅读并确保您理解了指示。按<strong>Enter键</strong>继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '指示完成。按<strong>Enter键</strong>继续。'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "end",
    	exp_id: 'stroop'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>感谢您的参与！</p><p class = center-block-text>按<strong>Enter键</strong>继续。</p></div>',
	cont_key: [13],
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "practice_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = block-text>让我们先进行几个练习试验。记住，请按下对应于字词<strong><u>字体颜色</u></strong>的按键。</p><p class = block-text></p><p class = block-text>按<strong>Enter键</strong>开始练习。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>做得好！现在您已经练习了一下，让我们正式开始吧。记住尽可能<u><strong>快速准确</strong></u>地响应。</p><p class = center-block-text>按<strong>Enter键</strong>开始测试。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		exp_stage = 'test'
	}
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	choices: 'none',
	data: {
		trial_id: "fixation"
	},
	timing_post_trial: 500,
	timing_stim: 500,
	timing_response: 500,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'exp_stage': exp_stage})
	},
}

/* create experiment definition array */
stroop_experiment = []
stroop_experiment.push(instruction_node)
stroop_experiment.push(start_practice_block)
	/* define test trials */
for (i = 0; i < practice_len; i++) {
	stroop_experiment.push(fixation_block)
	var practice_block = {
		type: 'poldrack-categorize',
		practice_trial: i,
		stimulus: practice_stims.stimulus[i],
		data: practice_stims.data[i],
		key_answer: practice_stims.key_answer[i],
		is_html: true,
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>正确</font></div></div>',
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>错误!</font></div></div>',
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>请加快速度!</font></div></div>',
		choices: choices,
		timing_response: 1500,
		timing_stim: -1,
		timing_feedback_duration: 500,
		show_stim_with_feedback: true,
		response_ends_trial: true,
		timing_post_trial: 250,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				trial_id: 'stim',
				exp_stage: 'practice'
			})
		}
	}
	stroop_experiment.push(practice_block)
}

stroop_experiment.push(start_test_block)
	/* define test trials */
for (i = 0; i < exp_len; i++) {
	stroop_experiment.push(fixation_block)
	var test_block = {
		type: 'poldrack-categorize',
		stimulus: test_stims.stimulus[i],
		data: test_stims.data[i],
		key_answer: test_stims.key_answer[i],
		is_html: true,
		correct_text: '<div class = fb_box><div class = center-text><font size = 20>正确</font></div></div>',
		incorrect_text: '<div class = fb_box><div class = center-text><font size = 20>错误!</font></div></div>',
		timeout_message: '<div class = fb_box><div class = center-text><font size = 20>请加快速度!</font></div></div>',
		choices: choices,
		timing_response: 1500,
		timing_stim: -1,
		timing_feedback_duration: 500,
		show_stim_with_feedback: true,
		response_ends_trial: true,
		timing_post_trial: 250,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				trial_id: 'stim',
				exp_stage: 'test'
			})
		}
	}
	stroop_experiment.push(test_block)
	if(i == exp_len/2) stroop_experiment.push(attention_node)
}
stroop_experiment.push(end_block)