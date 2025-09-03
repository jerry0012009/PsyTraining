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

var changeData = function() {
		data = jsPsych.data.getTrialsOfType('text')
		practiceDataCount = 0
		testDataCount = 0
		for (i = 0; i < data.length; i++) {
			if (data[i].trial_id == 'practice_intro') {
				practiceDataCount = practiceDataCount + 1
			} else if (data[i].trial_id == 'test_intro') {
				testDataCount = testDataCount + 1
			}
		}
		if (practiceDataCount >= 1 && testDataCount === 0) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "practice"
			})
		} else if (practiceDataCount >= 1 && testDataCount >= 1) {
			//temp_id = data[i].trial_id
			jsPsych.data.addDataToLastTrial({
				exp_stage: "test"
			})
		}
	}
	/* ************************************ */
	/* Define experimental variables */
	/* ************************************ */
	// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var head_left_keys = [32,39]
var head_right_keys = [13,37]
var all_keys = [].concat(head_left_keys, head_right_keys)
window.test_stimuli = [{
	image_url: 'images/rrlrr.png',
	data: {
		correct_response: head_right_keys,
		condition: 'oddball-incogruent',
		trial_id: 'stim'
	}
}, {
	image_url: 'images/llrll.png',
	data: {
		correct_response: head_left_keys,
		condition: 'standard-incogruent',
		trial_id: 'stim'
	}
}, {
	image_url: 'images/lllll.png',
	data: {
		correct_response: head_right_keys,
		condition: 'standard-congruent',
		trial_id: 'stim'
	}
}, {
	image_url: 'images/rrrrr.png',
	data: {
		correct_response: head_left_keys,
		condition: 'oddball-congruent',
		trial_id: 'stim'
	}
}];
// define images
$.each(test_stimuli, function() {
  this.image = new Image();
  this.image.src = this.image_url
})
var practice_len = 5 //5
var exp_len = 25 //5
var practice_trials = jsPsych.randomization.repeat(test_stimuli, Math.ceil(practice_len / test_stimuli.length)).slice(0, practice_len);
var test_trials = jsPsych.randomization.repeat(test_stimuli, Math.ceil(exp_len / test_stimuli.length)).slice(0, exp_len);

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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下这个任务要求你做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">你对这个任务有什么意见或建议吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};
/* define static blocks */
var feedback_instruct_text =
	'欢迎来到实验。按<strong>回车键</strong>开始。'
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
	pages: [
		"<div class = centerbox><p class = block-text>在这个实验中，你将看到排成一行的五条鱼。有些向左游，有些向右游。你需要给中间那条鱼喂食，为此你需要识别中间那条鱼游向哪个方向。 <br /> 例如，你可能会看到 <img class='in-line-img' src='images/rrrrr.png' height='20' width='100'/> 或者 <img class='in-line-img' src='images/llrll.png' height='20' width='100'/>。你的任务是按下对应<strong>中间</strong>那条鱼方向的按键。所以如果你看到 <img class='in-line-img' src='images/rrlrr.png' height='20' width='100'/> （中间的鱼向左游），你应该按"左方向键"或黄色按钮。如果鱼向右游，你应该按"右方向键"或红色按钮。 </p><p class = block-text>每次回应后，你会得到正确或错误的反馈。我们先从一组简短的练习开始。</p></div>"
	],
	allow_keys: false,
	data: {
		trial_id: "instruction"
	},
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
				'指导说明阅读得太快了。请仔细阅读并确保理解指导说明。按<strong>回车键</strong>继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '指导说明完成。按<strong>回车键</strong>继续。'
			return false
		}
	}
}

function compute_experiment_summary() {
  var trials = jsPsych.data.getTrialsOfType('poldrack-categorize');
  var count = 0;
  var sum_rt = 0;
  var correct_trial_count = 0;
  var correct_rt_count = 0;
  for (var i = 0; i < trials.length; i++) {
    var trial = trials[i]
    if(trial.exp_stage == "test") {
      count++;
      if(trial.correct == true) {
        correct_trial_count++;
        if(trial.rt > -1){
          sum_rt += trial.rt;
          correct_rt_count++;
        }
      }
    }
  }
  return {
    rt: Math.floor(sum_rt / correct_rt_count),
    accuracy: Math.floor(correct_trial_count / count * 100)
  }
}

var end_block = {
	type: 'poldrack-text',
	timing_response: 180000,
	data: {
		trial_id: "end",
		exp_id: 'flanker'
	},
	text: function() {
    var data = compute_experiment_summary()
    return "<p>你在 "+data.accuracy+"% 的试验中回答正确。" +
      "你的平均反应时间是 <strong>" + data.rt + " 毫秒</strong>。按回车键完成实验。谢谢你！</p>"
  },
	cont_key: [13],
	timing_post_trial: 0
};

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>练习完成。开始测试。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000
};

var fixation_block = {
	type: 'poldrack-single-stim',
	stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
	is_html: true,
	data: {
		trial_id: "fixation"
	},
	choices: 'none',
	timing_stim: 500,
	timing_response: 500,
	timing_post_trial: 0,
	on_finish: changeData,
};

//Set up experiment
flanker_experiment = []
flanker_experiment.push(instruction_node);
for (i = 0; i < practice_len; i++) {
	flanker_experiment.push(fixation_block)
  var practice_trial = practice_trials[i]
	var practice_block = {
		type: 'poldrack-categorize',
		stimulus: practice_trial.image,
		key_answer: practice_trial.data.correct_response,
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>正确！</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>错误</div></div>',
		timeout_message: '<div class = centerbox><div class = flanker-text>回应更快一点</div></div>',
		choices: all_keys,
		data: practice_trial.data,
		timing_feedback_duration: 1000,
		show_stim_with_feedback: false,
		timing_response: 1500,
		timing_post_trial: 500,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: "practice"
			})
		}
	}
	flanker_experiment.push(practice_block)
}
flanker_experiment.push(attention_node)
flanker_experiment.push(start_test_block)

/* define test block */
for (i = 0; i < exp_len; i++) {
  var test_trial = test_trials[i];
	flanker_experiment.push(fixation_block)
	var test_block = {
		type: 'poldrack-categorize',
		stimulus: test_trial.image,
		key_answer: test_trial.data.correct_response,
		correct_text: '<div class = centerbox><div style="color:green"; class = center-text>正确！</div></div>',
		incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>错误</div></div>',
		timeout_message: '<div class = centerbox><div class = flanker-text>回应更快一点！</div></div>',
		choices: all_keys,
		data: test_trial.data,
		timing_feedback_duration: 1000,
		timing_response: 1500,
		show_stim_with_feedback: false,
		timing_post_trial: 500,
		on_finish: function() {
			jsPsych.data.addDataToLastTrial({
				exp_stage: "test"
			})
		}
	}
	flanker_experiment.push(test_block)
}
flanker_experiment.push(attention_node)
flanker_experiment.push(post_task_block)
flanker_experiment.push(end_block)
