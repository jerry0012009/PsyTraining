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
  var experiment_data = jsPsych.data.getTrialsOfType('poldrack-multi-stim-multi-response')
  var missed_count = 0
  var trial_count = 0
  var rt_array = []
  var rt = 0
  for (var i = 0; i < experiment_data.length; i++) {
    rt = JSON.parse(experiment_data[i].rt)[0]
    trial_count += 1
    if (rt == -1) {
      missed_count += 1
    } else {
      rt_array.push(rt)
    }
  }
  //calculate average rt
  var avg_rt = -1
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } 
  credit_var = (avg_rt > 200)
  jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = "center-block-text">' +
    feedback_instruct_text + '</p></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getStim = function() {
  var border_i = randomDraw([0, 1]) // get border index
  var number_i = randomDraw([0, 1]) // get inner index
  var stim = stim_prefix + path_source + borders[border_i][0] + ' </img></div></div>'
  var stim2 = stim_prefix + path_source + borders[border_i][0] +
    ' </img></div></div><div class = prp_centerbox><div class = "center-text">' +
    inners[number_i] + '</div></div>'
    // set correct choice for first
  var gonogo_choice;
  if (border_i === 0) {
    gonogo_choice = 75
  } else {
    gonogo_choice = -1
  }
  //update data
  curr_data.gonogo_stim = borders[border_i][1]
  curr_data.choice_stim = inners[number_i]
  curr_data.gonogo_correct_response = gonogo_choice
  curr_data.choice_correct_response = [74, 76][number_i]
  return [stim, stim2]
}

var getISI = function() {
    var ISI = ISIs.shift()
    curr_data.ISI = ISI
    return [ISI, 2000 - ISI]
  }
  /*
  In this task the participant can make two responses - one to a go/nogo stim and one to a 2AFC task. If only one response is made
  and it is one of the 2AFC responses, the person is assumed to have "no-goed" to the go/nogo stim.
  */
var getFB = function() {
  var data = jsPsych.data.getLastTrialData()
  var keys = JSON.parse(data.key_presses)
  var rts = JSON.parse(data.rt)
  var tooShort = false
  var gonogoFB;
  var choiceFB;
  // If the person responded to the colored square
  if (keys[0] == choices[1]) {
    if (rts[1] < data.ISI + 50 && rts[1] > 0) {
      tooShort = true
    } else {
      if (data.gonogo_correct_response != -1) {
        gonogoFB = '您对彩色方块的反应正确！'
      } else {
        gonogoFB = '您不应该对' + borders[1][1] + '方块做出反应。'
      }
      if (keys[1] == data.choice_correct_response) {
        choiceFB = '您对数字的反应正确！'
      } else if (keys[1] == -1) {
        choiceFB = '记得对数字做出反应。'
      } else {
        choiceFB = '您对数字的反应不正确。请记住：如果数字是' +
          inners[0] + '，请用您的食指按"J"键。如果数字是' + inners[1] +
          '，请用您的无名指按"L"键。'
      }
    }
  }
  // If the person didn't respond to the colored square
  else if (keys[1] == -1 && keys[0] != choices[1]) {
    if (rts[0] > 0 && rts[0] < data.ISI + 50) {
      tooShort = true
    } else {
      if (data.gonogo_correct_response == -1) {
        gonogoFB = '您对彩色方块的反应正确！'
      } else {
        gonogoFB =
          '您应该用中指按"K"键来对' + borders[0][1] + '方块做出反应。'
      }
      if (keys[0] == data.choice_correct_response) {
        choiceFB = '您对数字的反应正确！'
      } else if (keys[0] == -1) {
        choiceFB = '记得对数字做出反应。'
      } else {
        choiceFB = '您对数字的反应不正确。请记住：如果数字是' +
          inners[0] + '，请用您的食指按"J"键。如果数字是' + inners[1] +
          '，请用您的无名指按"L"键。'
      }
    }
  } else if (keys[0] != choices[1] && keys[1] == choices[1]) {
    gonogoFB = '您必须先对彩色方块做出反应，然后再对数字反应。'
    if (keys[0] == data.choice_correct_response) {
      choiceFB = '您对数字的反应正确！'
    } else if (keys[0] == -1) {
      choiceFB = '记得对数字做出反应。'
    } else {
      choiceFB = 'You did not respond to the number correctly. Remember: if the number is ' +
        inners[0] + ' press the "J" key with your index finger. If the number is ' + inners[1] +
        ' press the "L" key with your ring finger.'
    }
  }
  if (tooShort) {
    return '<div class = prp_centerbox><p class = "center-block-text">您在数字出现在屏幕上之前就按了"J"或"L"键！请等待数字出现后再做出反应！</p><p class = "center-block-text">按任意键继续</p></div>'
  } else {
    return '<div class = prp_centerbox><p class = "center-block-text">' + gonogoFB +
      '</p><p class = "center-block-text">' + choiceFB +
      '</p><p class = "center-block-text">按任意键继续</p></div>'
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
var credit_var = true

// task specific variables
var practice_len = 32
var exp_len = 200
var current_trial = 0
var choices = [74, 75, 76]
var practice_ISIs = jsPsych.randomization.repeat([50, 150, 300, 800],
  exp_len / 4)
var ISIs = practice_ISIs.concat(jsPsych.randomization.repeat([50, 150, 300, 800], exp_len / 4))
var curr_data = {
    ISI: '',
    gonogo_stim: '',
    choice_stim: '',
    gonogo_correct_response: '',
    choice_correct_response: ''
  }
  //stim variables
var path_source = 'images/'
var stim_prefix = '<div class = prp_centerbox><div class = prp_stimBox><img class = prpStim src ='
  // border color relates to the go-nogo task. The subject should GO to the first two borders in the following array:
var borders = jsPsych.randomization.shuffle([['2_border.png', 'blue'],
    ['4_border.png', 'yellow']
  ])
  // inner number reflect the choice RT. 
var inners = jsPsych.randomization.shuffle([3, 4])

//instruction stim
var box1 = '<div class = prp_left-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[0][0] + ' </img></div></div>'
var box2 =
  '<div class = prp_right-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[1][0] + ' </img></div></div>'
var box_number1 =
  '<div class = prp_left-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[0][0] + ' </img></div></div>' +
  '<div class = prp_left-instruction><div class = "center-text">' + inners[0] +
  '</div></div>'
var box_number2 =
  '<div class = prp_right-instruction><div class = prp_stimBox><img class = prpStim src = ' +
  path_source + borders[1][0] + ' </img></div></div>' +
  '<div class = prp_right-instruction><div class = "center-text">' + inners[1] +
  '</div></div>'


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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在这个任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'end',
    exp_id: 'psychological_refractory_period_gonogo_choice'
  },
  text: '<div class = prp_centerbox><p class = "center-block-text">感谢您完成这个任务！</p><p class = "center-block-text">按<strong>Enter</strong>键继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  '欢迎参加实验。这个实验大约需要12分钟。按<strong>Enter</strong>键开始。'
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
    '<div class = prp_centerbox><p class ="block-text">在这个实验中，您需要连续完成两个任务。您需要分别用食指、中指和无名指按"J"、"K"和"L"键。</p><p class ="block-text">首先，屏幕上会出现一个彩色方块。如果是左下方的' + borders[0][1] + '方块，您应该用中指按"K"键。如果是右下方的' + borders[1][1] + '方块，您不应该做出反应。</p>' +
    box1 + box2 + '</div>',
    '<div class = prp_centerbox><p class ="block-text">经过短暂延迟后，方块中会出现两个数字中的一个（如下方所示）。如果数字是' +
    inners[0] + '，请用食指按"J"键。如果数字是' + inners[1] +
    '，请用无名指按"L"键。</p><p class ="block-text">尽可能快的反应非常重要！您应该先对彩色方块做出反应，然后再对数字反应。如果您应该对彩色方块反应，请尽快反应，然后再对数字反应。如果您不应该对彩色方块反应，请尽可能快地对数字反应。</p>' +
    box_number1 + box_number2 + '</div>', '<div class = prp_centerbox><p class ="block-text">在您结束指导后，我们将开始一些练习。在继续之前，请确保您记住要对哪些彩色方块做出反应，以及对两个数字要按哪些键。如有需要，请重新阅读指导。</p></div>'
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
        '您阅读指导的速度太快。请花时间仔细阅读，确保您理解了指导内容。按<strong>Enter</strong>键继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '指导完成。按<strong>Enter</strong>键继续。'
      return false
    }
  }
}

var start_practice_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'intro',
    exp_stage: 'practice'
  },
  text: '<div class = prp_centerbox><p class = "center-block-text">我们将开始' +
    practice_len + '个练习试验。按<strong>Enter</strong>键开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'intro',
    exp_stage: 'test'
  },
  text: '<div class = prp_centerbox><p class ="center-block-text">现在我们将开始正式测试。按<strong>Enter</strong>键开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000,
  on_finish: function() {
    current_trial = 0
  }
};

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = "center-text">+</div></div>',
  is_html: true,
  timing_stim: 300,
  timing_response: 300,
  data: {
    trial_id: 'fixation'
  },
  choices: 'none',
  timing_post_trial: 1000,
  on_finish: function(){
    var last_trial= jsPsych.data.getDataByTrialIndex(jsPsych.progress().current_trial_global-1)
    jsPsych.data.addDataToLastTrial({exp_stage: last_trial.exp_stage})  
  }
}

/* define practice block */
var practice_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStim,
  is_html: true,
  data: {
    trial_id: 'stim',
    exp_stage: 'practice'
  },
  choices: [choices, choices],
  timing_stim: getISI,
  timing_response: 2000,
  response_ends_trial: true,
  on_finish: function() {
    curr_data.trial_num = current_trial
    jsPsych.data.addDataToLastTrial(curr_data)
    current_trial += 1
  },
  timing_post_trial: 500
}

var feedback_block = {
  type: 'poldrack-single-stim',
  stimulus: getFB,
  is_html: true,
  data: {
    trial_id: 'feedback',
    exp_stage: 'practice'
  },
  timing_stim: -1,
  timing_response: -1,
  response_ends_trial: true,
  timing_post_trial: 500
}


/* define test block */
var test_block = {
  type: 'poldrack-multi-stim-multi-response',
  stimuli: getStim,
  is_html: true,
  data: {
    trial_id: 'stim',
    exp_stage: 'test'
  },
  choices: [choices, choices],
  timing_stim: getISI,
  respond_ends_trial: true,
  timing_response: 2000,
  on_finish: function() {
    curr_data.trial_num = current_trial
    jsPsych.data.addDataToLastTrial(curr_data)
    current_trial += 1
  },
  timing_post_trial: 500
}


/* create experiment definition array */
var psychological_refractory_period_gonogo_choice_experiment = [];
psychological_refractory_period_gonogo_choice_experiment.push(instruction_node);
psychological_refractory_period_gonogo_choice_experiment.push(start_practice_block);
for (var i = 0; i < practice_len; i++) {
  psychological_refractory_period_gonogo_choice_experiment.push(fixation_block);
  psychological_refractory_period_gonogo_choice_experiment.push(practice_block);
  psychological_refractory_period_gonogo_choice_experiment.push(feedback_block);
}
psychological_refractory_period_gonogo_choice_experiment.push(attention_node);
psychological_refractory_period_gonogo_choice_experiment.push(start_test_block);
for (var i = 0; i < exp_len; i++) {
  psychological_refractory_period_gonogo_choice_experiment.push(fixation_block);
  psychological_refractory_period_gonogo_choice_experiment.push(test_block)
}
psychological_refractory_period_gonogo_choice_experiment.push(attention_node);
psychological_refractory_period_gonogo_choice_experiment.push(post_task_block)
psychological_refractory_period_gonogo_choice_experiment.push(end_block);
