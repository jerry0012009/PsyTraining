//Reference: The Multi-Source Interference Task: validation study with fMRI in individual subjects, Bush et al.
//Condition records current block (practice/test control/interference), trial_id records stimulus ID (where the target is: left, middle or right) and whether the target is large or small

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

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var run_attention_checks = false
var attention_check_thresh = 0.65
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables

var large_font = 36
var small_font = 20
var practice_control_stimulus = [{
  stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>1</span>xx</div></div>',
  data: {
    correct_response: 49,
    trial_id: "large_middle",
    condition: "practice_control",
    exp_stage: "practice"
  }
}, {
  stimulus: '<div class = centerbox><div class = center-ms-text >x<span class = big>2</span>x</div></div>',
  data: {
    correct_response: 50,
    trial_id: "large_right",
    condition: "practice_control",
    exp_stage: "practice"
  }
}, {
  stimulus: '<div class = centerbox><div class = center-ms-text >xx<span class = big>3</span></div></div>',
  data: {
    correct_response: 51,
    trial_id: "small_middle",
    condition: "practice_control",
    exp_stage: "practice"
  }
}]
var practice_interference_stimulus = [{
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = big>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >22<span class = big>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = small>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >22<span class = small>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >3<span class = big>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = big>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >3<span class = small>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = small>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>2</span>11</div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >11<span class = big>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>2</span>11</div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >11<span class = small>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>2</span>33</div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = big>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>2</span>33</div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = small>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_right",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>3</span>11</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >1<span class = big>3</span>1</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>3</span>11</div></div>',
    data: {
      correct_response: 51,
      trial_id: "small_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >1<span class = small>3</span>1</div></div>',
    data: {
      correct_response: 51,
      trial_id: "small_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>3</span>22</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = big>3</span>2</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>3</span>22</div></div>',
    data: {
      correct_response: 51,
      trial_id: "small_left",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = small>3</span>2</div></div>',
    data: {
      correct_response: 51,
      trial_id: "small_middle",
      condition: "practice_interference",
      exp_stage: "practice"
    }
  },

];

var control_stimulus = [{
  stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>1</span>xx</div></div>',
  data: {
    correct_response: 49,
    trial_id: "large_middle",
    condition: "control",
    exp_stage: "test"
  }
}, {
  stimulus: '<div class = centerbox><div class = center-ms-text >x<span class = big>2</span>x</div></div>',
  data: {
    correct_response: 50,
    trial_id: "large_right",
    condition: "control",
    exp_stage: "test"
  }
}, {
  stimulus: '<div class = centerbox><div class = center-ms-text >xx<span class = big>3</span></div></div>',
  data: {
    correct_response: 51,
    trial_id: "small_middle",
    condition: "control",
    exp_stage: "test"
  }
}]
var interference_stimulus = [{
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = big>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_middle",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >22<span class = big>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = small>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_middle",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >22<span class = small>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >3<span class = big>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_middle",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = big>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "large_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >3<span class = small>1</span>2</div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_middle",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = small>1</span></div></div>',
    data: {
      correct_response: 49,
      trial_id: "small_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>2</span>11</div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >11<span class = big>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>2</span>11</div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >11<span class = small>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>2</span>33</div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = big>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "large_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>2</span>33</div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >33<span class = small>2</span></div></div>',
    data: {
      correct_response: 50,
      trial_id: "small_right",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>3</span>11</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >1<span class = big>3</span>1</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_middle",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>3</span>11</div></div>',
    data: {
      correct_response: 51,
      trial_id: "small_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >1<span class = small>3</span>1</div></div>',
    data: {
      correct_response: 51,
      trial_id: "small_middle",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = big>3</span>22</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = big>3</span>2</div></div>',
    data: {
      correct_response: 51,
      trial_id: "large_middle",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text ><span class = small>3</span>22</div></div>',
    data: {
      correct_response: 511,
      trial_id: "small_left",
      condition: "interference",
      exp_stage: "test"
    }
  }, {
    stimulus: '<div class = centerbox><div class = center-ms-text >2<span class = small>3</span>2</div></div>',
    data: {
      correct_response: 51,
      trial_id: "small_middle",
      condition: "interference",
      exp_stage: "test"
    }
  },

];

var num_blocks = 4 //number of control/interference pairs
var blocks = []
for (var b = 0; b < num_blocks; b++) {
  var control_trials = jsPsych.randomization.repeat(control_stimulus, 8);
  var interference_trials = jsPsych.randomization.shuffle(interference_stimulus);
  blocks.push(control_trials)
  blocks.push(interference_trials)
}

practice_control = jsPsych.randomization.repeat(practice_control_stimulus, 8)
practice_interference = jsPsych.randomization.shuffle(practice_interference_stimulus)
practice_control = practice_control.slice(0, 20)
practice_interference = practice_interference.slice(0, 20)


var practice_blocks = [practice_control, practice_interference]

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
              '<p class = center-block-text style = "font-size: 20px">你对这个任务有什么意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  '欢迎参加实验。请按<strong>回车键</strong>开始。'
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
    '<div class = centerbox><p class = block-text>在这个任务中，你将看到由三个数字或"x"字母组成的刺激。例如，你可能会看到"<span class = big_instructions>1</span>xx"或"<span class = small_instructions>3</span>22"</p><p class = block-text>其中两个字符总是相同的。你的任务是使用三个数字键来指出不同字符（目标字符）的身份。因此在前面两个例子中，你需要对第一个按"1"键，对第二个按"3"键。</p></div>',
    '<div class = centerbox><p class = block-text>有两种试验类型：要么非目标数字也是数字，要么它们是"x"。当非目标字符是"x"时，目标数字总是大的。当所有三个字符都是数字时，目标字符可能比其他字符更大或更小。</p><p class = block-text>你将完成8个试验块。每个块要么只有"x"类型的试验（如"xx3"类型试验），要么是数字试验（如"131"类型试验）。重要的是你要尽可能快地响应，但要确保响应正确！无论目标数字在什么位置，都要通过报告<strong>目标数字是什么</strong>来回应！</p></div>',
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
        '阅读指令过快。请花时间确保你理解了指令。请按<strong>回车键</strong>继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '指令完成。请按<strong>回车键</strong>继续。'
      return false
    }
  }
}

var end_block = {
  type: 'poldrack-text',
  data: {
    exp_id: "multisource",
    trial_id: "end"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>感谢完成这个任务！</p><p class = center-block-text>请按<strong>回车键</strong>继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>开始测试。请按<strong>回车键</strong>开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

/* create experiment definition array */
var multisource_experiment = [];
multisource_experiment.push(instruction_node);
/* define practice block */
for (var b = 0; b < practice_blocks.length; b++) {
  block = practice_blocks[b]
  var practice_block = {
    type: 'poldrack-single-stim',
    timeline: block,
    is_html: true,
    choices: [49, 50, 51],
    timing_stim: 1750,
    timing_response: 1750,
    response_ends_trial: false,
    timing_post_trial: 500
  };
  multisource_experiment.push(practice_block)
}

multisource_experiment.push(start_test_block)
  /* define test block */
for (var b = 0; b < num_blocks; b++) {
  block = blocks[b]
  var test_block = {
    type: 'poldrack-single-stim',
    timeline: block,
    is_html: true,
    choices: [49, 50, 51],
    timing_stim: 1750,
    timing_response: 1750,
    response_ends_trial: false,
    timing_post_trial: 500
  };
  multisource_experiment.push(test_block)
  if ($.inArray(b, [0, 1, 3]) != -1) {
    multisource_experiment.push(attention_node)
  }
}

multisource_experiment.push(post_task_block)
multisource_experiment.push(end_block)