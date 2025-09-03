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

var randomDraw = function(lst) {
	var index = Math.floor(Math.random() * (lst.length))
	return lst[index]
}

var get_correct_key = function() {
	return correct_key
}

var update_count = function() {
	if (practice_count < practice_trials.length) {
		var stim = practice_trials[practice_count].data.stim_color
		if (stim == 'red') {
			red_count += 1
		} else if (stim == 'green') {
			green_count += 1
		} else if (stim == 'blue') {
			blue_count += 1
		}

		if (stim == 'red' && red_count == 4) {
			correct_key = 32
			red_count = 0
		} else if (stim == 'green' && green_count == 4) {
			correct_key = 32
			green_count = 0
		} else if (stim == 'blue' && blue_count == 4) {
			correct_key = 32
			blue_count = 0
		} else {
			correct_key = 'none'
		}
		practice_count += 1
	}
}

var reset_count = function(data) {
	var stim = data.stim_color
	var key = data.key_press
	if (stim == 'red' && key != -1) {
		red_count = 0
	} else if (stim == 'green' && key != -1) {
		green_count = 0
	} else if (stim == 'blue' && key != -1) {
		blue_count = 0
	} else {
		return 'none'
	}
}

var getInstructFeedback = function() {
		return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
			'</p></div>'
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
var red_count = 0
var green_count = 0
var blue_count = 0
var correct_key = 'none'
var practice_count = 0

practice_stims = [{
	stimulus: '<div class = centerbox><div class = shape id = stim1></div></div>',
	data: {
		stim_color: 'red',
		trial_id: 'stim'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim2></div></div>',
	data: {
		stim_color: 'green',
		trial_id: 'stim'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim3></div></div>',
	data: {
		stim_color: 'blue',
		trial_id: 'stim'
	}
}]

stims = [{
	stimulus: '<div class = centerbox><div class = shape id = stim1></div></div>',
	data: {
		stim_color: 'red',
		trial_id: 'stim'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim2></div></div>',
	data: {
		stim_color: 'green',
		trial_id: 'stim'
	}
}, {
	stimulus: '<div class = centerbox><div class = shape id = stim3></div></div>',
	data: {
		stim_color: 'blue',
		trial_id: 'stim'
	}
}]

last_shape = randomDraw(practice_stims)
practice_trials = jsPsych.randomization.repeat(practice_stims, 8);
practice_trials.push(last_shape)

block_num = 4
blocks = []
for (b = 0; b < block_num; b++) {
	block_trials = jsPsych.randomization.repeat(stims, 8);
	last_shape = randomDraw(stims)
	block_trials.push(last_shape)
	blocks.push(block_trials)
}

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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下在这个任务中你被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">你对这个任务有什么评论吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'欢迎参与实验。请按<strong>回车键</strong>开始。'
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
		'<div class = centerbox><p class = block-text>在这个实验中，你将看到按顺序出现的形状，一个接一个。每次试验中，你将看到三种形状中的一种：红色方形、绿色方形或蓝色方形。</p></div>',
		'<div class = centerbox><p class = block-text>你的任务是追踪每种形状重复出现的次数，当看到任何形状重复出现四次时按空格键响应。例如，如果你看到"红、红、蓝、绿、红、蓝、绿、<strong>红</strong>"，你应该在最后一个（第四个）红色形状时响应。</p><p class = block-text>如果形状序列继续为"红、绿、蓝、<strong>绿</strong>"，你需要再次响应，因为绿色形状已经重复四次了，以此类推。</p></div>',
		"<div class = centerbox><p class = block-text>在你按空格键响应后，你应该'重置'该形状的计数。所以在之前的例子中，一旦你针对红色形状按下空格键，你应该重新从0开始计数红色形状。</p><p class = block-text>即使你认为你在错误的时机按下了空格键（如果你认为只有3个红色形状而不是4个），你<strong>仍然应该重置你的计数</strong>。所以如果你计数了3个红色形状并且不当地响应了，请重新从0开始计数红色形状。</p></div>",
		'<div class = centerbox><p class = block-text>总结一下，你将追踪三种不同的形状：蓝色、绿色和红色。当你计数任何形状达到4个时，按空格键。在你响应某个形状后（无论是否正确），在心理上重置该形状的计数，同时保持其他形状的计数不变。</p></div>'
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
				'阅读指导语过快。请花时间仔细阅读并确保你理解了指导语。请按<strong>回车键</strong>继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '指导语完成。请按<strong>回车键</strong>继续。'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		exp_id: "image_monitoring",
		trial_id: "end"
	},
	text: '<div class = centerbox><p class = center-block-text>谢谢你完成这个任务！</p><p class = center-block-text>请按<strong>回车键</strong>继续。</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var start_practice_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "practice_intro"
	},
	text: '<div class = centerbox><p class = block-text>我们将从一些练习开始，然后进行 ' +
		block_num +
		' 个测试块。在练习期间，你将得到关于你的响应是否正确的反馈，在实验的其余部分你将不会得到这种反馈。请按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "test_intro"
	},
	text: '<div class = centerbox><p class = block-text>开始测试块。记住在形状重复出现四次后响应，并在你按下空格键后"重置"你的计数，<strong>无论你是否正确</strong>。</p><p class = block-text>请按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var update_block = {
	type: 'call-function',
	data: {
		trial_id: "reset_post_trial_gap"
	},
	func: update_count,
	timing_post_trial: 0
}

//Set up experiment
var image_monitoring_experiment = []
image_monitoring_experiment.push(instruction_node);
image_monitoring_experiment.push(start_practice_block);
// set up practice
image_monitoring_experiment.push(update_block)
var practice_shape_block = {
	type: 'poldrack-categorize',
	is_html: true,
	timeline: practice_trials,
	key_answer: get_correct_key,
	correct_text: '<div class = centerbox><div style="color:green"; class = center-text>正确！</div></div>',
	incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>错误</div></div>',
	timeout_message: ' ',
	choices: [32],
	timing_stim: 500,
	timing_response: 2000,
	timing_feedback_duration: 1000,
	show_stim_with_feedback: false,
	response_ends_trial: false,
	timing_post_trial: 500,
	on_finish: function(data) {
		update_count()
		reset_count(data)
		jsPsych.data.addDataToLastTrial({
			exp_stage: 'practice'
		})
	}
};
image_monitoring_experiment.push(practice_shape_block)

// set up test
for (b = 0; b < block_num; b++) {
	block = blocks[b]
	image_monitoring_experiment.push(start_test_block)
	var test_shape_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		timeline: block,
		choices: [32],
		timing_stim: 500,
		timing_response: 2500,
		response_ends_trial: false,
		timing_post_trial: 0,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: 'test'
			})
		}
	};
	image_monitoring_experiment.push(test_shape_block)
	if ($.inArray(b, [0, 2, 3]) != -1) {
		image_monitoring_experiment.push(attention_node)
	}
}

image_monitoring_experiment.push(post_task_block)
image_monitoring_experiment.push(end_block)