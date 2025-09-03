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
var categories = ['动物', '颜色', '国家', '距离', '金属', '亲属']
var exemplars = {
	'动物': ['鱼', '鸟', '蛇', '牛', '鲸'],
	'颜色': ['红色', '黄色', '绿色', '蓝色', '棕色'],
	'国家': ['中国', '美国', '英国', '印度', '巴西'],
	'距离': ['英里', '公里', '米', '英尺', '英寸'],
	'金属': ['铁', '钛', '铝', '铅', '黄铜'],
	'亲属': ['妈妈', '爸爸', '哥哥', '姐姐', '阿姨']
}

var difficulty_order = jsPsych.randomization.shuffle([3, 4, 5])
var num_blocks = 3 //per difficulty level
var blocks = []
var targets = []
var practice_block = []
var practice_targets = []
var last_targets = {}

/* Draw 2 or 3 exemplars from each of six categories totalling 15 exemplars for each block. Start
with a practice block (difficulty = 3). Then present 3 test blocks for each difficulty level, where each difficulty level has a different number
 of target categories (randomly drawn)
*/
var target_categories = jsPsych.randomization.repeat(categories, 1, false).slice(0, 3) //select the target categories
var block_exemplars = []
var cat_repeats = jsPsych.randomization.repeat([2, 2, 2, 3, 3, 3], 1, false) //determines how many exemplars from each category to select for this block
for (var cat = 0; cat < categories.length; cat++) {
	var exemplars_to_add = jsPsych.randomization.repeat(exemplars[categories[cat]], 1, false).slice(0,
		cat_repeats[cat])
	var items = []
	exemplars_to_add.forEach(function(entry) {
		items.push([categories[cat]].concat(entry))
	})
	block_exemplars = block_exemplars.concat(items)
}
practice_block.push(jsPsych.randomization.repeat(block_exemplars, 1, false))
practice_targets.push(target_categories)

for (var i = 0; i < difficulty_order.length; i++) {
	for (var b = 0; b < num_blocks; b++) {
		var target_categories = jsPsych.randomization.repeat(categories, 1, false).slice(0,
				difficulty_order[i]) //select the target categories
		var block_exemplars = []
		var cat_repeats = jsPsych.randomization.repeat([2, 2, 2, 3, 3, 3], 1, false) //determines how many exemplars from each category to select for this block
		for (var cat = 0; cat < categories.length; cat++) {
			var exemplars_to_add = jsPsych.randomization.repeat(exemplars[categories[cat]], 1, false).slice(
				0, cat_repeats[cat])
			var items = []
			exemplars_to_add.forEach(function(entry) {
				items.push([categories[cat]].concat(entry))
			})
			block_exemplars = block_exemplars.concat(items)
		}
		blocks.push(jsPsych.randomization.repeat(block_exemplars, 1, false))
		targets.push(target_categories)
	}
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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在此任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对此任务有任何意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var category_instructions = '<ul class = list-text>' +
	'<li><strong>动物</strong>: 鱼, 鸟, 蛇, 牛, 鲸</li>' +
	'<li><strong>颜色</strong>: 红色, 黄色, 绿色, 蓝色, 棕色</li>' +
	'<li><strong>国家</strong>: 中国, 美国, 英国, 印度, 巴西</li>' +
	'<li><strong>距离</strong>: 英里, 公里, 米, 英尺, 英寸</li>' +
	'<li><strong>金属</strong>: 铁, 钛, 铝, 铅, 黄铜</li>' +
	'<li><strong>亲属</strong>: 妈妈, 爸爸, 哥哥, 姐姐, 阿姨</li>'


var feedback_instruct_text =
	'欢迎参加实验。此实验大约需要6分钟。按<strong>回车键</strong>开始。'
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
	data: {
		trial_id: 'instruction'
	},
	pages: [
		'<div class = centerbox><p class = block-text>在本实验中，您将看到一系列词语逐一呈现。这些词语将分为六个类别：动物、颜色、国家、距离、金属和亲属。</p><p class = block-text>其中3到5个类别将是屏幕上显示的“目标”类别。您的目标是记住每个目标类别中显示的<strong>最后</strong>一个词，并在试验结束时输入它们。</p></div>',
		'<div class = centerbox><p class = block-text>为了确保您不会对哪个词语属于哪个类别产生混淆，以下列出了每个类别中的词语：' +
		category_instructions +
		'</p><p class = block-text>请确保您知道每个词语属于哪个类别。</p></div>',
		'<div class = centerbox><p class = block-text>总结一下，每个试验将首先向您呈现3-5个目标类别（例如"颜色、动物、亲属"）。然后您将看到来自所有六个类别的词语序列，一个接一个地出现。</p><p class = block-text>例如，一个试验可能以："...狗"..."阿姨"..."中国"..."红色"..."钛"..."鸟"结束。您必须记住每个目标类别中的最后一个词，并在试验结束时写下它们。</p><p class = block-text>对于前面提到的目标的示例序列，您应该回答"红色，阿姨，鸟"，因为它们分别是颜色、亲属和动物类别中的最后一个词。您写下类别的顺序无关紧要。</p><p class = block-text>指令结束后，您将完成一个练习试验块。</p></div>',
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
				'阅读指令过快。请仔细阅读并确保您理解了指令。按<strong>回车键</strong>继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '指令完成。按<strong>回车键</strong>继续。'
			return false
		}
	}
}

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: 'end',
		exp_id: 'keep_track'
	},
	text: '<div class = centerbox><p class = center-block-text>感谢您完成这个任务！</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
	cont_key: [13],
	timing_post_trial: 0
};

var end_practice_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: 'practice_end'
	},
	text: '<div class = centerbox><p class = center-block-text>练习块完成。您现在将完成 9 个测试块。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var start_test_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: 'test_intro'
	},
	text: '<div class = centerbox><p class = center-block-text>开始测试块。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		last_targets = {}
	}
};


//Set up experiment
var keep_track_experiment = []
keep_track_experiment.push(instruction_node);

// set up practice
block = practice_block[0]
target = practice_targets[0]
prompt = '<div class = promptbox><div class = prompt-text>Targets: ' + target.join(', ') +
	'</div></div>'
data = {
	trial_id: 'prompt',
	exp_stage: "practice",
	load: target.length,
	targets: target
}
var prompt_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><p class = block-text>以下是目标类别。在试验过程中它们将保持在屏幕底部。当您确信能够记住它们时请按回车键。</p></div>',
	is_html: true,
	choices: [13],
	response_ends_trial: true,
	data: data,
	prompt: prompt,
	timing_post_trial: 1000,
}
var wait_block = {
	type: 'poldrack-single-stim',
	stimulus: ' ',
	is_html: true,
	data: {
		trial_id: 'wait',
		exp_stage: 'practice'
	},
	choices: 'none',
	prompt: prompt,
	timing_stim: 500,
	timing_response: 500,
	timing_post_trial: 0,
}
keep_track_experiment.push(prompt_block)
keep_track_experiment.push(wait_block)

// set up practice blocks
for (i = 0; i < block.length; i++) {
	stim = '<div class = centerbox><div class = keep-track-text>' + block[i][1] + '</div></div>'
	data = {
		trial_id: 'stim',
		category: block[i][0],
		exp_stage: "practice",
		load: target.length,
		targets: target,
		stim: block[i][1]
	}
	var track_block = {
		type: 'poldrack-single-stim',
		stimulus: stim,
		is_html: true,
		choices: 'none',
		data: data,
		timing_response: 1500,
		timing_stim: 1500,
		prompt: prompt,
		timing_post_trial: 0,
		on_finish: function(data) {
			if ($.inArray(data.category, data.targets) != -1) {
				last_targets[data.category] = data.stim
			}
		}
	}
	keep_track_experiment.push(track_block)
}
var response_block = {
	type: 'survey-text',
	questions: [['<p class = center-block-text>每个目标类别中的最后一个词是什么？请用空格分隔您的答案</p>']
	],
	data: {
		trial_id: 'response',
		exp_stage: "practice",
		load: target.length,
		targets: target
	},
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({'correct_responses': last_targets})
	}
}
keep_track_experiment.push(response_block)
keep_track_experiment.push(attention_node)
keep_track_experiment.push(end_practice_block)


// set up test blocks
for (b = 0; b < blocks.length; b++) { 
	keep_track_experiment.push(start_test_block)
	block = blocks[b]
	target = targets[b]
	prompt = '<div class = promptbox><div class = prompt-text>Targets: ' + target.join(', ') +
		'</div></div>'
	data = {
		trial_id: 'prompt',
		exp_stage: "test",
		load: target.length,
		targets: target
	}
	var prompt_block = {
		type: 'poldrack-single-stim',
		stimulus: '<div class = centerbox><p class = block-text>以下是目标类别。在试验过程中它们将保持在屏幕底部。当您确信能够记住它们时请按回车键。</p></div>',
		is_html: true,
		choices: [13],
		data: data,
		prompt: prompt,
		timing_post_trial: 1000,
		response_ends_trial: true
	}
	var wait_block = {
		type: 'poldrack-single-stim',
		stimulus: ' ',
		is_html: true,
		choices: 'none',
		data: {
			trial_id: 'wait',
			exp_stage: 'test'
		},
		prompt: prompt,
		timing_stim: 500,
		timing_response: 500,
		timing_post_trial: 0,
	}
	keep_track_experiment.push(prompt_block)
	keep_track_experiment.push(wait_block)
	for (i = 0; i < block.length; i++) {
		stim = '<div class = centerbox><div class = keep-track-text>' + block[i][1]+ '</div></div>'
		data = {
			trial_id: 'stim',
			category: block[i][0],
			exp_stage: "test",
			load: target.length,
			targets: target,
			stim: block[i][1]
		}
		var track_block = {
			type: 'poldrack-single-stim',
			stimulus: stim,
			is_html: true,
			choices: 'none',
			data: data,
			timing_response: 1500,
			timing_stim: 1500,
			prompt: prompt,
			timing_post_trial: 0,
			on_finish: function(data) {
				if ($.inArray(data.category, data.targets) != -1) {
					last_targets[data.category] = data.stim
				}
			}
		}
		keep_track_experiment.push(track_block)
	}
	var response_block = {
		type: 'survey-text',
		questions: [['<p class = center-block-text>每个目标类别中的最后一个词是什么？请用空格分隔您的答案</p>']],
		data: {
			trial_id: 'response',
			exp_stage: 'test',
			load: target.length,
			targets: target
		},
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({'correct_responses': last_targets})
		}
	}
	keep_track_experiment.push(response_block)
	if ($.inArray(b, [0, 2]) != -1) {
		keep_track_experiment.push(attention_node)
	}
}

keep_track_experiment.push(post_task_block)
keep_track_experiment.push(end_block)