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
var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

var practice_block_num = 2
var practice_blocks = []
var practice_seq_lengths = [5, 7]
var pathSource = '<div class = centerbox><div class = center-text>'

for (var b = 0; b < practice_block_num; b++) {
	var num_trials = practice_seq_lengths[b]
	var block_trials = []
	for (var i = 0; i < num_trials; i++) {
		var stim = randomDraw(letters)
		var tmp_obj = {
			stimulus: '<div class = centerbox><div class = center-text>' + stim +
				'</div></div>',
			data: {
				trial_id: 'stim',
				exp_stage: 'practice',
				sequence_length: num_trials,
				stimulus: stim
			}
		}
		block_trials.push(tmp_obj)
	}
	practice_blocks.push(block_trials)
}

var block_num = 12
var blocks = []
for (var b = 0; b < block_num; b++) {
	var num_trials = randomDraw([5, 7, 9, 11])
	var block_trials = []
	for (var i = 0; i < num_trials; i++) {
		var testStim = randomDraw(letters)
		var tmp_obj = {
			stimulus: '<div class = centerbox><div class = center-text>' + testStim +
				'</div></div>',
			data: {
				trial_id: 'stim',
				exp_stage: 'test',
				sequence_length: num_trials,
				stimulus: testStim
			}
		}
		block_trials.push(tmp_obj)
	}
	blocks.push(block_trials)
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
	type: 'attention-check',
	data: {
		trial_id: 'attention_check'
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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在此任务中被要求做的事情。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对此任务有任何评论吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'欢迎来到实验。按 <strong>回车键</strong> 开始。'
var feedback_instruct_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'instruction'
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
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text>在这个实验中，您将看到一个字母序列，一次显示一个字母。您的任务是记住最后呈现的四个字母，并在序列结束时报告它们。</p><p class = block-text>例如，如果呈现的序列是 F...J...K...N...F...L，您应该报告 KNFL。</p><p class = block-text>序列的长度是变化的，因此跟踪每个字母很重要。为确保这一点，在执行任务时，请在字母呈现时大声或心中重复最后四个字母（如果显示的字母少于四个，则重复所有字母）。</p></div>',
		'<div class = centerbox><p class = block-text>我们将从两个练习序列开始。接下来将进行 12 个测试块。</p></div>'
	],
	allow_keys: false,
	show_clickable_nav: true,
	timing_post_trial: 01000
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
				'阅读说明太快了。请慢慢来，确保您理解说明。按 <strong>回车键</strong> 继续。'
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
		exp_id: 'letter_memory'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>感谢您完成此任务！</p><p class = center-block-text>按 <strong>回车键</strong> 结束。</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var start_practice_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'practice_intro'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>开始练习阶段。</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: 'test_intro'
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>开始测试阶段。</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};


//Set up experiment
var letter_memory_experiment = []
letter_memory_experiment.push(instruction_node);

// set up practice
for (var b = 0; b < practice_block_num; b++) { 
	block = practice_blocks[b]
	letter_memory_experiment.push(start_practice_block)
	var letter_seq_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		timeline: practice_blocks[b],
		choices: 'none',
		timing_stim: 2000,
		timing_response: 2000,
		timing_post_trial: 0,
	};
	letter_memory_experiment.push(letter_seq_block)

	var response_block = {
		type: 'survey-text',
		questions: [
			['<p class = center-block-text>最后一个序列中的最后四个字母是什么？</p>']
		],
		data: {
			trial_id: 'response',
			exp_stage: 'practice',
			condition: blocks[b].length
		}
	}
	letter_memory_experiment.push(response_block)
}


// set up test
for (var b = 0; b < block_num; b++) { 
	block = blocks[b]
	letter_memory_experiment.push(start_test_block)
	var letter_seq_block = {
		type: 'poldrack-single-stim',
		is_html: true,
		timeline: blocks[b],
		choices: 'none',
		timing_stim: 2000,
		timing_response: 2000,
		timing_post_trial: 0,
	};
	letter_memory_experiment.push(letter_seq_block)

	var response_block = {
		type: 'survey-text',
		questions: [
			['<p class = center-block-text>最后一个序列中的最后四个字母是什么？</p>']
		],
		data: {
			trial_id: 'response',
			exp_stage: 'test',
			condition: blocks[b].length
		}
	}
	letter_memory_experiment.push(response_block)
	if ($.inArray(b, [2, 4, 11]) != -1) {
		letter_memory_experiment.push(attention_node)
	}
}

letter_memory_experiment.push(post_task_block)
letter_memory_experiment.push(end_block)
