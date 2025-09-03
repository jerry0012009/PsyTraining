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
  var missed_percent = missed_count/trial_count
  credit_var = (missed_percent < 0.4 && avg_rt > 200)
  var bonus = randomDraw(bonus_list)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var,
                  "performance_var": JSON.stringify(bonus)})
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

// task specific variables
var choices = [81, 80]
var bonus_list = [] //keeps track of choices for bonus
//hard coded options in the amounts and order specified in Kirby and Marakovic (1996)
var options = {
  small_amt: [54, 55, 19, 31, 14, 47, 15, 25, 78, 40, 11, 67, 34, 27, 69, 49, 80, 24, 33, 28, 34,
    25, 41, 54, 54, 22, 20
  ],
  large_amt: [55, 75, 25, 85, 25, 50, 35, 60, 80, 55, 30, 75, 35, 50, 85, 60, 85, 35, 80, 30, 50,
    30, 75, 60, 80, 25, 55
  ],
  later_del: [117, 61, 53, 7, 19, 160, 13, 14, 192, 62, 7, 119, 186, 21, 91, 89, 157, 29, 14, 179,
    30, 80, 20, 111, 30, 136, 7
  ]
}

var stim_html = []

//loop through each option to create html
for (var i = 0; i < options.small_amt.length; i++) {
  stim_html[i] =
    "<div class = centerbox id='container'><p class = center-block-text>请选择你偏好的选项，按<strong>'q'</strong>键选择左侧，按<strong>'p'</strong>键选择右侧：</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$" +
    options.small_amt[i] +
    "<br>今天</font></center></div><div id = 'option'><center><font color='green'>$" + options.large_amt[
      i] + "<br>" + options.later_del[i] + " 天后</font></center></div></div></div></div>"
}

data_prop = []

for (var i = 0; i < options.small_amt.length; i++) {
  data_prop.push({
    small_amount: options.small_amt[i],
    large_amount: options.large_amt[i],
    later_delay: options.later_del[i]
  });
}

trials = []

//used new features to include the stimulus properties in recorded data
for (var i = 0; i < stim_html.length; i++) { 
  trials.push({
    stimulus: stim_html[i],
    data: data_prop[i]
  });
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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下这个任务要求你做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">你对这个任务有什么意见或建议吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  '欢迎参与实验。本实验大约需要5分钟。按<strong>回车键</strong>开始。'
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
    '<div class = centerbox><p class = block-text>在这个实验中，你将在两个金额之间进行选择。其中一个金额现在就可以获得，另一个金额需要等到未来才能获得。你的任务是通过按键表明你的偏好：按<strong>"q"</strong>键选择左侧选项，按<strong>"p"</strong>键选择右侧选项。</p><p class = block-text>你应该表明你的<strong>真实</strong>偏好，因为实验结束时会随机选择一个试次，你将根据你在该试次中选择的选项获得相应的奖励金额。</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true
};

var instruction_node = {
  timeline: [feedback_instruct_block, instructions_block],
  /* This function defines stopping criteria */
  loop_function: function(data) {
    for (var i = 0; i < data.length; i++) {
      if ((data[i].trial_type == 'poldrack-instructions') && (data[i].rt != -1)) {
        rt = data[i].rt
        sumInstructTime = sumInstructTime + rt
      }
    }
    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedback_instruct_text =
        '你阅读指导说明的速度太快了。请仔细阅读并确保你理解了指导说明。按<strong>回车键</strong>继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '指导说明已完成。按<strong>回车键</strong>继续。'
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
  text: '<div class = centerbox><p class = center-block-text>这是一个练习试次。你在这个试次中的选择不会计入奖励支付。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
  cont_key: [13],
  //timing_post_trial: 1000
};

var practice_block = {
  type: 'poldrack-single-stim',
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  stimulus: "<div class = centerbox id='container'><p class = center-block-text>请选择你偏好的选项，按<strong>'q'</strong>键选择左侧，按<strong>'p'</strong>键选择右侧：</p><div class='table'><div class='row'><div id = 'option'><center><font color='green'>$20<br>今天</font></center></div><div id = 'option'><center><font color='green'>$25<br>5天后</font></center></div></div></div></div>",
  is_html: true,
  choices: choices,
  response_ends_trial: true, 
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>你现在可以开始正式实验了。</p><p class = center-block-text>记住要表明你的<strong>真实</strong>偏好。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
  cont_key: [13],
  //timing_post_trial: 1000
};

var test_block = {
  type: 'poldrack-single-stim',
  data: {
    trial_id: "stim",
    exp_stage: "test"
  },
  timeline: trials,
  is_html: true,
  choices: choices,
  response_ends_trial: true,
  //used new feature to include choice info in recorded data
  on_finish: function(data) {
    var choice = false;
    if (data.key_press == 80) {
      choice = 'larger_later';
      bonus_list.push({'amount': data.large_amount, 'delay': data.later_delay})
    } else if (data.key_press == 81) {
      choice = 'smaller_sooner';
      bonus_list.push({'amount': data.small_amount, 'delay': 0})
    }
    jsPsych.data.addDataToLastTrial({
      choice: choice
    });
  }
};

var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'kirby'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>感谢你完成这个任务！</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};


//Set up experiment
var kirby_experiment = []
kirby_experiment.push(instruction_node);
kirby_experiment.push(start_practice_block);
kirby_experiment.push(practice_block);
kirby_experiment.push(attention_node);
kirby_experiment.push(start_test_block);
kirby_experiment.push(test_block);
kirby_experiment.push(attention_node);
kirby_experiment.push(post_task_block)
kirby_experiment.push(end_block);