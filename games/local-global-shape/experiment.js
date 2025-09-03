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

var makeTrialList = function(len, stim, data) {
  //choice array: numeric key codes for the numbers 1-4
  var choice_array = choices
    // 1 is a switch trial: ensure half the trials are switch trials
  var switch_trials = jsPsych.randomization.repeat([0, 1], len / 2)
    //create test array
  output_list = []
    //randomize first trial
  var trial_index = jsPsych.randomization.shuffle(['global', 'local'])[0]
  if (trial_index == 'global') {
    tmpi = Math.floor(Math.random() * (stim.length / 2))
  } else {
    tmpi = Math.floor(Math.random() * (stim.length / 2)) + stim.length / 2
  }
  var tmp_obj = {}
  tmp_obj.stimulus = stim[tmpi]
  var tmp_data = $.extend({}, data[tmpi])
  tmp_data.switch = 0
  tmp_data.correct_response = choice_array[task_shapes.indexOf(data[tmpi][trial_index + '_shape'])]
  tmp_obj.data = tmp_data
  output_list.push(tmp_obj)
    /* randomly sample from either the global or local stimulus lists (first and half part of the stim/data arrays)
  On stay trials randomly select an additional stimulus from that array. On switch trials choose from the other list. */
  for (i = 1; i < switch_trials.length; i++) {
    tmp_obj = {}
    if (switch_trials[i] == 1) {
      if (trial_index == 'global') {
        trial_index = 'local'
      } else {
        trial_index = 'global'
      }
    }
    if (trial_index == 'global') {
      tmpi = Math.floor(Math.random() * (stim.length / 2))
    } else {
      tmpi = Math.floor(Math.random() * (stim.length / 2)) + stim.length / 2
    }
    tmp_obj.stimulus = stim[tmpi]
    tmp_data = $.extend({}, data[tmpi])
    tmp_data.switch = switch_trials[i]
    tmp_data.correct_response = choice_array[task_shapes.indexOf(data[tmpi][trial_index +
      '_shape'
    ])]
    tmp_obj.data = tmp_data
    output_list.push(tmp_obj)
  }
  return output_list
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
var choices = [49, 50, 51, 52]
var current_trial = 0
var task_colors = jsPsych.randomization.shuffle(['blue', 'black'])
var task_shapes = ['circle', 'X', 'triangle', 'square']
var path = 'images/'
var prefix = '<div class = centerbox><img src = "'
var postfix = '"</img></div>'
var stim = []
var data = []
var images = []
for (c = 0; c < task_colors.length; c++) {
  if (c === 0) {
    condition = 'global'
  } else {
    condition = 'local'
  }
  for (g = 0; g < task_shapes.length; g++) {
    for (l = 0; l < task_shapes.length; l++) {
      images.push([path + task_colors[c] + '_' + task_shapes[g] + 'of' + task_shapes[l] +
        's.png'])
      stim.push(prefix + path + task_colors[c] + '_' + task_shapes[g] + 'of' + task_shapes[l] +
        's.png' + postfix)
      data.push({
        condition: condition,
        global_shape: task_shapes[g],
        local_shape: task_shapes[l]
      })
    }
  }
}

//preload images
jsPsych.pluginAPI.preloadImages(images)

//Set up experiment stimulus order
var practice_trials = makeTrialList(36, stim, data)
for (i = 0; i < practice_trials.length; i++) {
  practice_trials[i].key_answer = practice_trials[i].data.correct_response
}
var test_trials = makeTrialList(96, stim, data)



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
   questions: ['<p class = center-block-text style = "font-size: 20px">请简要总结您在这个任务中需要做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么意见或建议吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'local_global_shape'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>感谢您完成这个任务！</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  '欢迎参加实验。这个实验大约需要8分钟。按<strong>回车键</strong>开始。'
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
    '<div class = centerbox><p class = block-text>在这个实验中，您将看到由较小形状组成的蓝色或黑色大形状，如下图所示。所有的小形状都是相同的。大形状和小形状都可以是圆形、X、三角形或正方形。</p><div class = instructionImgBox><img src = "images/blue_squareofcircles.png" height = 200 width = 200></img></div></div>',
    '<div class = centerbox><p class = block-text>您的任务是根据颜色来判断大形状或小形状的边数。如果形状是' +
    task_colors[0] + '色，请根据大形状的边数回答。如果形状是' +
    task_colors[1] +
    '色，请根据小形状的边数回答。</p><p class = block-text>使用数字键回答：1代表圆形，2代表X，3代表三角形，4代表正方形。</p></div>',
    '<div class = centerbox><p class = block-text>例如，对于下面的形状，您应该掉3，因为它是' +
    task_colors[1] +
    '色，这意味着您应该根据小形状来回答。如果形状是' +
    task_colors[0] +
    '色，您应该掉2。</p><div class = instructionImgBox><img src = "images/' +
    task_colors[1] + '_Xoftriangles.png" height = 200 width = 200></img></div></div>'
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
        '阅读说明太快了。请放慢速度，确保您理解了说明内容。按<strong>回车键</strong>继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '说明完成。按<strong>回车键</strong>继续。'
      return false
    }
  }
}

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>我们将从一些练习开始。在练习期间，您将收到关于回答正确性的反馈。在实验的其余部分中，您将不会收到反馈。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>现在我们将开始正式测试。记住，如果形状是' +
    task_colors[0] + '色，请根据大形状的边数回答。如果形状是' +
    task_colors[1] +
    '色，请根据小形状的边数回答。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
  	current_trial = 0
  }
};

/* define practice block */
var practice_block = {
  type: 'poldrack-categorize',
  timeline: practice_trials,
  is_html: true,
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  correct_text: '<div class = centerbox><div style="color:green"; class = center-text>正确！</div></div>',
  incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>不正确</div></div>',
  timeout_message: '<div class = centerbox><div class = center-text>请更快回答！</div></div>',
  choices: choices,
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_response: 2000,
  timing_post_trial: 500,
  on_finish: function(data) {
  	jsPsych.data.addDataToLastTrial({
  		trial_num: current_trial
  	})
  	current_trial += 1
  }
}

/* define test block */
var test_block = {
  type: 'poldrack-single-stim',
  timeline: test_trials,
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  is_html: true,
  choices: choices,
  timing_post_trial: 500,
  timing_response: 2000,
  on_finish: function(data) {
    correct = false
  	if (data.key_press === data.correct_response) {
      correct = true
    }
  	jsPsych.data.addDataToLastTrial({
  		correct: correct,
  		trial_num: current_trial
  	})
  	current_trial += 1
  }
};

/* create experiment definition array */
var local_global_shape_experiment = [];
local_global_shape_experiment.push(instruction_node);
local_global_shape_experiment.push(start_practice_block);
local_global_shape_experiment.push(practice_block);
local_global_shape_experiment.push(start_test_block);
local_global_shape_experiment.push(test_block);
local_global_shape_experiment.push(attention_node)
local_global_shape_experiment.push(post_task_block)
local_global_shape_experiment.push(end_block);
