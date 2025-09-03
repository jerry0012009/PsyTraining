/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var grid =
  '<div class = numbox>' +
  '<button id = button_1 class = "square num-button"><div class = numbers>1</div></button>' +
  '<button id = button_2 class = "square num-button"><div class = numbers>2</div></button>' +
  '<button id = button_3 class = "square num-button"><div class = numbers>3</div></button>' +
  '<button id = button_4 class = "square num-button"><div class = numbers>4</div></button>' +
  '<button id = button_5 class = "square num-button"><div class = numbers>5</div></button>' +
  '<button id = button_6 class = "square num-button"><div class = numbers>6</div></button>' +
  '<button id = button_7 class = "square num-button"><div class = numbers>7</div></button>' +
  '<button id = button_8 class = "square num-button"><div class = numbers>8</div></button>' +
  '<button id = button_9 class = "square num-button"><div class = numbers>9</div></button>' +
  '</div>'

var empty_grid =
  '<div class = numbox><div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div>' +
  '<div class = "blank-square num-button"><div class = content><div class = numbers ></div></div></div></div>'



var num_trials = 162
practice_stims = []
test_stims = []
for (var i = 0; i < 10; i++) {
  practice_stims.push(grid)
}
for (var i = 0; i < num_trials; i++) {
  test_stims.push(grid)
}
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */

//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下在这个任务中您被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么评论吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  '欢迎参加实验。按<strong>回车键</strong>开始。'
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
    '<div class = centerbox><p class = block-text>在这个任务中，您的工作是生成一个随机的数字序列。您需要用鼠标点击虚拟数字键盘来完成此任务。点击后，数字会暂时变成红色。每次试验您需要在不到一秒内回应，所以快速反应很重要！</p><p class = block-text>试验结束后，数字会暂时消失。当它们再次出现时，下一个试验就开始了，您应该尽快回应。</p><p class = block-text>您的目标是完全随机地选择每个数字，就像从装有9张纸条的帽子中抽取数字，读取后再放回，然后再抽取下一个数字一样。</p></div>',
  ],
  allow_keys: false,
  show_clickable_nav: true,
  //timing_post_trial: 1000
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
        '您阅读指令过快。请慢慢阅读，确保您理解指令内容。按<strong>回车键</strong>继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '指令阅读完毕。按<strong>回车键</strong>继续。'
      return false
    }
  }
}


var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "end",
    exp_id: 'random_number_generation'
  },
  text: '<div class = centerbox><p class = center-block-text>感谢您完成此任务！</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>开始练习环节。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>开始测试环节。</p><p class = center-block-text>按<strong>回车键</strong>开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};

var wait_block = {
  type: 'poldrack-single-stim',
  stimuli: [empty_grid],
  choices: 'none',
  is_html: true,
  data: {
    trial_id: "wait"
  },
  timing_stim: 200,
  timing_response: 200,
  response_ends_trial: false,
  timing_post_trial: 0
};

//Set up experiment
var random_number_generation_experiment = []
random_number_generation_experiment.push(instruction_node);
random_number_generation_experiment.push(start_practice_block);
for (var i = 0; i < practice_stims.length; i++) {
  var practice_block = {
    type: 'single-stim-button',
    stimulus: practice_stims[i],
    button_class: 'num-button',
    data: {
      trial_id: "stim",
      exp_stage: "practice"
    },
    timing_response: 800,
    response_ends_trial: false,
    timing_post_trial: 0
  };
  random_number_generation_experiment.push(practice_block)
  random_number_generation_experiment.push(wait_block)
}
random_number_generation_experiment.push(start_test_block);
//Loop should be changed to go until test_stims.length later
for (var i = 0; i < practice_stims.length; i++) {
  var test_block = {
    type: 'single-stim-button',
    stimulus: test_stims[i],
    button_class: 'num-button',
    data: {
      trial_id: "stim",
      exp_stage: "test"
    },
    timing_response: 800,
    response_ends_trial: false,
    timing_post_trial: 0
  };
  random_number_generation_experiment.push(test_block)
  random_number_generation_experiment.push(wait_block)
}
random_number_generation_experiment.push(post_task_block)
random_number_generation_experiment.push(end_block)
