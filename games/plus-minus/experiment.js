// Reference: http://www.sciencedirect.com/science/article/pii/S001002859990734X
//Condition indicates block task (add, subtract, alternate)

/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var numbers = [];
for (var i = 10; i <= 99; i++) {
  numbers.push(i.toString());
}
var numbers = jsPsych.randomization.shuffle(numbers)
var practice_numbers = jsPsych.randomization.shuffle(numbers).slice(0,15)
var add_list = []
var minus_list = []
var alternate_list = []
var practice_list = []
for (var i = 0; i < practice_numbers.length; i++) {
  practice_list.push('<p class = center-block-text>' + practice_numbers[i] + '</p>')
}

for (var i = 0; i < numbers.length; i++) {
  if (i < 30) {
    add_list.push('<p class = center-block-text>' + numbers[i] + '</p>')
  } else if (i < 60) {
    minus_list.push('<p class = center-block-text>' + numbers[i] + '</p>')
  } else {
    alternate_list.push('<p class = center-block-text>' + numbers[i] + '</p>')
  }
}

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post_task"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下这个任务要求您做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么评论吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
    exp_id: 'plus_minus'
  },
  text: '<div class = centerbox><p class = center-block-text>感谢您完成这个任务！</p><p class = center-block-text>按 <strong>回车键</strong> 继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  '欢迎参加实验。按 <strong>回车键</strong> 开始。'
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
    '<div class = centerbox><p class = block-text>在这个实验中，您将进行数字的加法和减法运算。重要的是您要尽可能快速和准确地回答。为了让您熟悉测试，下一个屏幕将显示一个数字列表。对于每个数字，请尽可能快速和准确地将数字输入到空白处。使用"Tab"键在问题之间移动。如果可能的话，使用数字键盘输入数字会更容易。</p></div>'
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
        '您阅读指令的速度太快了。请花时间确保您理解指令。按 <strong>回车键</strong> 继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '指令完成。按 <strong>回车键</strong> 继续。'
      return false
    }
  }
}

var start_add_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "start_add_block"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>在接下来的屏幕上，您将看到一个数字列表。请给每个数字<strong>加上 3</strong>，然后在数字下方的框中输入结果。请尽可能快速准确地完成整个列表。按任意键开始。</p></div>',
  timing_post_trial: 1000
};

var start_minus_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "start_minus_block"
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>在接下来的屏幕上，您将看到一个数字列表。请从每个数字中<strong>减去 3</strong>，然后在数字下方的框中输入结果。请尽可能快速准确地完成整个列表。按任意键开始。</p></div>',
  timing_post_trial: 1000
};

var start_alternate_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "start_alternative_block"
  },
  text: '<div class = centerbox><p class = block-text>在接下来的屏幕上，您将看到一个数字列表。请<strong>交替地对数字加 3 和减 3</strong>，然后在数字下方的框中输入结果。</p><p class = block-text>例如，如果数字是 27、13、40，您的答案应该是 30 (27+3)、10 (13-3)、43 (40+3)。请尽可能快速准确地完成整个列表。按任意键开始。</p></div>',
  timing_post_trial: 1000
};

var practice_block = {
  type: 'survey-text',
  data: {
    trial_id: "stim",
    exp_stage: "practice"
  },
  questions: practice_list
};

var add_block = {
  type: 'survey-text',
  questions: add_list,
  data: {
    exp_id: 'plus_minus',
    condition: 'add',
    trial_id: "stim",
    exp_stage: 'test'
  }
};

var minus_block = {
  type: 'survey-text',
  questions: minus_list,
  data: {
    exp_id: 'plus_minus',
    condition: 'subtract',
    trial_id: "stim",
    exp_stage: 'test'
  }
};

var alternate_block = {
  type: 'survey-text',
  questions: alternate_list,
  data: {
    exp_id: 'plus_minus',
    condition: 'alternate',
    trial_id: "stim",
    exp_stage: 'test'
  }
};

var posttask_questionnaire = {
  type: 'survey-text',
  questions: ['您是否使用了数字键盘？'],
  data: {
    exp_id: 'plus_minus',
    trial_id: 'post-task questionnaire',
    exp_stage: 'test'
  }
};


/* create experiment definition array */
var plus_minus_experiment = [];
plus_minus_experiment.push(instruction_node)
plus_minus_experiment.push(practice_block)
plus_minus_experiment.push(start_add_block)
plus_minus_experiment.push(add_block)
plus_minus_experiment.push(start_minus_block)
plus_minus_experiment.push(minus_block)
plus_minus_experiment.push(start_alternate_block)
plus_minus_experiment.push(alternate_block)
plus_minus_experiment.push(post_task_block)
plus_minus_experiment.push(end_block)