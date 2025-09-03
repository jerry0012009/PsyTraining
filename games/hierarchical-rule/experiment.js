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
	for (var k = 0; k < choices.length; k++) {
    choice_counts[choices[k]] = 0
  }
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
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
  var missed_percent = missed_count/experiment_data.length
  credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
  if (credit_var === true) {
    performance_var = total_correct
  } else {
    performance_var = 0
  }
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var, "performance_var": performance_var})
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getFixLength = function() {
  return 250 + Math.random() * 500
}
var getFeedback = function() {
  var last_trial = jsPsych.data.getLastTrialData()
  if (last_trial.key_press === -1) {
    return '<div class = centerbox><div class = "center-text">请反应更快!</div></div>'
  } else if (last_trial.correct === true) {
    total_correct += 1
    return '<div class = centerbox><div style = "color: lime"; class = "center-text">正确!</div></div>'
  } else {
    return '<div class = centerbox><div style = "color: red"; class = "center-text">错误</div></div>'
  }
}

var getHierarchicalStim = function() {
  return hierarchical_stims.stimulus.shift()
}


var getHierarchicalData = function() {
  return hierarchical_stims.data.shift()
}


var getFlatStim = function() {
  return flat_stims.stimulus.shift()
}


var getFlatData = function() {
  return flat_stims.data.shift()
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = "center-block-text">' +
    feedback_instruct_text + '</p></div>'
}

var getRestText = function() {
  return '<div class = centerbox><p class = center-block-text>休息一下！您目前已经获得 ' + total_correct + ' 分。</p><p class = center-block-text>按 <strong>回车</strong> 继续。</p></div>'
}

var getEndText = function() {
  return '<div class = centerbox><p class = "center-block-text">感谢您完成此任务！您共获得了 ' + total_correct + ' 分。</p><p class = "center-block-text">按 <strong>回车</strong> 开始。</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.45
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds
var credit_var = true
var performance_var = 0

// task specific variables
var hierarchical_only = true //When this is true, do not run the flat task
var exp_len = 360 //number of trials per rule-set
var flat_first =  Math.floor(Math.random())
var path_source = 'images/'
var stim_prefix = '<div class = centerbox><div class = stimBox><img class = hierarchicalStim src ='
var border_prefix = '<img class = hierarchicalBorder src ='
var prompt_prefix = '<img class = hierarchicalPrompt src ='
var postfix = ' </img></div></div>'
var choices = [74, 75, 76]
var total_correct = 0 // tracks correct trials
var current_trial = 0

//generate stims
//1=red, 2=blue, 3=green, 4=yellow BORDER COLORS
//1=vertical, 2=slant, 3=horizontal ORIENTATION OF STIMS
flat_stims = []
hierarchical_stims = []
colors = jsPsych.randomization.shuffle([1, 2, 3, 4]) //border colors
stims = jsPsych.randomization.shuffle([1, 2, 3, 4, 5, 6])
orientations = [1, 2, 3]
color_data = ['red', 'blue', 'green', 'yellow']
orientation_data = ['vertical', 'slant', 'horizontal']
random_correct = jsPsych.randomization.repeat(choices, 6) // correct responses for random stim
for (var c = 0; c < colors.length; c++) {
  for (var s = 0; s < stims.length / 2; s++) {
    for (var o = 0; o < orientations.length; o++) {
      if (c < colors.length / 2) {
        flat_stims.push({
          stimulus: stim_prefix + path_source + stims[s] + orientations[o] + '.bmp </img>' +
            border_prefix + path_source + colors[c] + '_border.png' + postfix,
          data: {
            stim: stims[s],
            orientation: orientation_data[orientations[o] - 1],
            border: color_data[colors[c] - 1],
            exp_stage: "flat_test",
            correct_response: random_correct.pop()
          }
        })
      } else {
        if (c == 2) {
          correct_response = choices[s]
        } else if (c == 3) {
          correct_response = choices[o]
        }
        hierarchical_stims.push({
          stimulus: stim_prefix + path_source + stims[s + (stims.length / 2)] + orientations[o] +
            '.bmp </img>' + border_prefix + path_source + colors[c] + '_border.png' + postfix,
          data: {
            stim: stims[s + (stims.length / 2)],
            orientation: orientation_data[orientations[o] - 1],
            exp_stage: "hierarchical_test",
            border: color_data[colors[c] - 1],
            correct_response: correct_response
          }
        })
      }
    }
  }
}
//instruction stims
var instruct_stims = []
var hierarchical_instruct_stims = jsPsych.randomization.repeat(hierarchical_stims, 1, true).stimulus
var flat_instruct_stims = jsPsych.randomization.repeat(flat_stims, 1, true).stimulus
if (flat_first === 0) {
  instruct_stims = hierarchical_instruct_stims
  instruct_stims2 = flat_instruct_stims
} else {
  instruct_stims = flat_instruct_stims
  instruct_stims2 = hierarchical_instruct_stims
}

//preload stims
jsPsych.pluginAPI.preloadImages(flat_stims)
jsPsych.pluginAPI.preloadImages(hierarchical_stims)
// flat_stims = jsPsych.randomization.repeat(flat_stims,20,true)
// hierarchical_stims = jsPsych.randomization.repeat(hierarchical_stims,20,true)
// Change structure of object array to work with new structure
flat_stims = jsPsych.randomization.repeat(flat_stims, exp_len/18, true)
hierarchical_stims = jsPsych.randomization.repeat(hierarchical_stims, exp_len/18, true)




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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在此任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text = '欢迎参加实验。此实验大约需要40分钟。按 <strong>回车</strong> 开始。'
if (hierarchical_only === true) {
  feedback_instruct_text ='欢迎参加实验。此实验大约需要22分钟。按 <strong>回车</strong> 开始。'
}
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
var instruct_text_array = ['<div class = centerbox><p class = "block-text">在这个实验中，刺激会一个接一个地出现。您应该通过按 J、K 或 L 键来响应，之后您将收到关于您是否正确的反馈。如果您答对了，您将获得积分，这将有助于您的奖励支付。</p><p class = "block-text">您应该尽可能多地正确回答试验。这个实验中有18个刺激。按下一步查看您将要回应的18个刺激。</p></div>']
for (var i = 0; i < instruct_stims.length; i++) {
  instruct_text_array.push(instruct_stims[i] + '<div class = instructionBox><p class = center-block-text>请熟悉这些页面上显示的刺激。</p></div>')
}
instruct_text_array.push('<div class = centerbox><p class = "block-text">确保您熟悉刚才看到的刺激。记住，通过按 J、K 或 L 来响应刺激。您将根据您的表现获得奖金，所以请尽力而为！</p><p class = "block-text">实验将在您结束说明后立即开始。将有5次休息时间。</p></div>')

var instructions_block = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: instruct_text_array,
  allow_keys: false,
  show_clickable_nav: true
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
        '阅读说明太快了。请花时间确保您理解说明。按 <strong>回车</strong> 继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '说明完毕。按 <strong>回车</strong> 继续。'
      return false
    }
  }
}

var instruct_text_array2 = ['<div class = centerbox><p class = "block-text">您现在将对新刺激做出响应。您仍然应该通过按 J、K 或 L 键来响应，之后您将收到关于您是否正确的反馈，就像在上一个任务中一样。<p class = "block-text">这个实验中有18个刺激。按下一步查看您将要回应的18个刺激。</p></div>']
for (var i = 0; i < instruct_stims2.length; i++) {
  instruct_text_array2.push(instruct_stims2[i] + '<div class = instructionBox><p class = center-block-text>请熟悉此页面上显示的刺激。</p></div>')
}
instruct_text_array2.push('<div class = centerbox><p class = "block-text">确保您熟悉刚才看到的刺激。记住，通过按 J、K 或 L 来响应刺激。您将根据您的表现获得奖金，所以请尽力而为！</p><p class = "block-text">实验将在您结束说明后立即开始。将有5次休息时间。</p></div>')

var instructions_block2 = {
  type: 'poldrack-instructions',
  data: {
    trial_id: "instruction"
  },
  pages: instruct_text_array2,
  allow_keys: false,
  show_clickable_nav: true
};

var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
    exp_id: 'hierarchical_rule'
  },
  text: getEndText,
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};


var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = "center-block-text">我们现在开始测试。</p><p class = "center-block-text">按 <strong>回车</strong> 开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: prompt_prefix + path_source + 'FIX.png' + ' style:"z-index: -1"' + postfix,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation",
    exp_stage: "test"
  },
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: -1,
  timing_response: getFixLength
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFeedback,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "feedback",
    exp_stage: "test"
  },
  response_ends_trial: false,
  timing_post_trial: 0,
  timing_stim: 1000,
  timing_response: 1000
}


var flat_stim_block = {
  type: 'poldrack-single-stim',
  stimulus: getFlatStim,
  data: getFlatData,
  is_html: true,
  choices: choices,
  timing_stim: 1000,
  timing_response: 3000,
  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
  timing_post_trial: 0,
  on_finish: function(data) {
  	var correct = false
  	if (data.key_press == data.correct_response) {
  		correct = true
  	}
    jsPsych.data.addDataToLastTrial({
      trial_id: "flat_stim",
      exp_stage: "test",
      correct: correct,
      trial_num: current_trial
    })
  }
}

var hierarchical_stim_block = {
  type: 'poldrack-single-stim',
  stimulus: getHierarchicalStim,
  data: getHierarchicalData,
  is_html: true,
  choices: choices,
  timing_stim: 1000,
  timing_response: 3000,
  prompt: prompt_prefix + path_source + 'FIX_GREEN.png' + ' style:"z-index: -1"' + postfix,
  timing_post_trial: 0,
  on_finish: function(data) {
  	var correct = false
  	if (data.key_press == data.correct_response) {
  		correct = true
  	}
    jsPsych.data.addDataToLastTrial({
      trial_id: "hierarchical_stim",
      exp_stage: "test",
      correct: correct,
      trial_num: current_trial
    })
  }
}

//conditional rest every 90 trials
var rest_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "rest"
  },
  timing_response: 180000,
  text: getRestText,
  cont_key: [13],
  timing_post_trial: 1000
};

var rest_node = {
    timeline: [rest_block],
    conditional_function: function(){
        if ($.inArray(current_trial,[59,119,179,239,299]) !== -1){
            return true;
        } else {
            return false;
        }
    }
}


// loop nodes instead of creating a huge array with three blocks for all trials
var flat_loop_node = {
  timeline: [fixation_block, flat_stim_block, feedback_block, rest_node],
  loop_function: function(data) {
    if (flat_stims.stimulus.length > 0) {
      current_trial += 1
      return true;
    } else {
      current_trial = 0
      return false;
    }
  }
}

var hierarchical_loop_node = {
  timeline: [fixation_block, hierarchical_stim_block, feedback_block, rest_node],
  loop_function: function(data) {
    if (hierarchical_stims.stimulus.length > 0) {
      current_trial += 1
      return true;
    } else {
      current_trial = 0
      return false;
    }
  }
}

//Set up experiment
var hierarchical_rule_experiment = []
hierarchical_rule_experiment.push(instruction_node);
hierarchical_rule_experiment.push(start_test_block);
// setup exp w/ loop nodes after pushing the practice etc. blocks
if (hierarchical_only) {
  hierarchical_rule_experiment.push(hierarchical_loop_node, attention_node);
} else {
  if (flat_first == 1) {
    hierarchical_rule_experiment.push(flat_loop_node, attention_node, instruct_block2, start_test_block,
      hierarchical_loop_node, attention_node);
  } else {
    hierarchical_rule_experiment.push(hierarchical_loop_node, attention_node, instruct_block2, start_test_block,
      flat_loop_node, attention_node);
  }
}

hierarchical_rule_experiment.push(post_task_block)
hierarchical_rule_experiment.push(end_block)
