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

var getStim = function() {
  return randomDraw(randomDraw(letters)) + randomDraw(randomDraw(numbers))
}

var getTopStim = function() {
  stim_place = 'top' + randomDraw(['left', 'right'])
  stim_id = getStim()
  return [stim_place, stim_id, '<div class = numlet-' + stim_place + '><p class = numlet-text>' + stim_id +
    '</p></div><div class = vertical-line></div><div class = horizontal-line></div>'
  ]
}

var getBottomStim = function() {
  stim_place = 'bottom' + randomDraw(['left', 'right'])
  stim_id = getStim()
  return [stim_place, stim_id, '<div class = numlet-' + stim_place + '><p class = numlet-text>' + stim_id +
    '</p></div><div class = vertical-line></div><div class = horizontal-line></div>'
  ]
}

var getRotateStim = function() {
  switch (place) {
    case 0:
      stim_place = 'bottomright'
      break
    case 1:
      stim_place = 'bottomleft'
      break
    case 2:
      stim_place = 'topleft'
      break
    case 3:
      stim_place = 'topright'
      break
  }
  place = (place + 1) % 4
  return [stim_place, '<div class = numlet-' + stim_place + '><p class = numlet-text>' + getStim() +
    '</p></div><div class = vertical-line></div><div class = horizontal-line></div>'
  ]
}



/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var correct_responses = jsPsych.randomization.repeat([
  ["left arrow", 90],
  ["right arrow", 77]
], 1)
var evens = [2, 4, 6, 8]
var odds = [3, 5, 7, 9]
var numbers = [evens, odds]
var consonants = ["G", "K", "M", "R"]
var vowels = ["A", "E", "I", "U"]
var letters = [consonants, vowels]
var place = randomDraw([0, 1, 2, 3])
var choices = [90, 77]
/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在此任务中被要求做的事情。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对此任务有任何意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'end',
    exp_id: 'number_letter'
  },
  text: '<div class = centerbox><p class = center-block-text>感谢您完成此任务！</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  '欢迎参加实验。按<strong>回车键</strong>开始。'
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
    '<div class = centerbox><p class = block-text>在此实验中，您将看到字母-数字对出现在屏幕上的四个象限之一。例如，您可能会在屏幕右上方看到"G9"。</p></div>',
    '<div class = centerbox><p class = block-text>当字母-数字对在屏幕上半部分时，您应该使用"Z"和"M"键表示数字是奇数还是偶数："Z"表示奇数，"M"表示偶数。</p></div>',
    '<div class = centerbox><p class = block-text>当字母-数字对在屏幕下半部分时，您应该使用相同的键表示字母是辅音还是元音："Z"表示辅音，"M"表示元音。</p></div>'
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
        '您阅读指导说明太快了。请花时间确保您理解指导说明。按<strong>回车键</strong>继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '指导说明完成。按<strong>回车键</strong>继续。'
      return false
    }
  }
}

var gap_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = vertical-line></div><div class = horizontal-line></div>',
  choices: 'none',
  is_html: true,
  data: {
    trial_id: 'gap'
  },
  timing_response: 150,
  timing_stim: 150,
  timing_post_trial: 0

}
/* create experiment definition array */
var number_letter_experiment = []
number_letter_experiment.push(instruction_node)

half_block_len = 32
rotate_block_len = 128
for (i = 0; i < half_block_len; i++) {
  stim = getTopStim()
  var top_block = {
    type: 'poldrack-single-stim',
    stimulus: stim[2],
    is_html: true,
    choices: choices,
    data: {
      trial_id: 'stim',
      exp_stage: 'test',
      stim_place: stim[0],
      stim_id: stim[1],
      'condition': 'top_oddeven'
    },
    timing_post_trial: 0,
    response_ends_trial: true
  }
  number_letter_experiment.push(top_block)
  number_letter_experiment.push(gap_block)
}
for (i = 0; i < half_block_len; i++) {
  stim = getBottomStim()
  var bottom_block = {
    type: 'poldrack-single-stim',
    stimulus: stim[2],
    is_html: true,
    choices: choices,
    data: {
      trial_id: 'stim',
      exp_stage: 'test',
      stim_place: stim[0],
      stim_id: stim[1],
      'condition': 'bottom_consonantvowel'
    },
    timing_post_trial: 0,
    response_ends_trial: true
  }
  number_letter_experiment.push(bottom_block)
  number_letter_experiment.push(gap_block)
}
for (i = 0; i < rotate_block_len; i++) {
  stim = getRotateStim()
  var rotate_block = {
    type: 'poldrack-single-stim',
    stimulus: stim[2],
    is_html: true,
    choices: choices,
    data: {
      trial_id: 'stim',
      exp_stage: 'test',
      stim_place: stim[0],
      stim_id: stim[1],
      'condition': 'rotate_switch'
    },
    timing_post_trial: 0,
    response_ends_trial: true
  }
  number_letter_experiment.push(rotate_block)
  number_letter_experiment.push(gap_block)
}
number_letter_experiment.push(post_task_block)
number_letter_experiment.push(end_block)