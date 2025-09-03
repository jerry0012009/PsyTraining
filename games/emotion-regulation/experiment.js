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
  return '<div class = centerbox><p class = "center-block-text">' + feedback_instruct_text +
    '</p></div>'
}

var getChoiceText = function() {
  var options = jsPsych.randomization.shuffle(['分心', '重新评价'])
  var choice_text = '<div class = leftBox><div class = center-text>' + options[0] +
    '</div></div>' + '<div class = rightBox><div class = center-text>' + options[1] +
    '</div></div>'
  return choice_text
}

var getTrainingInstruct = function() {
  var instructions = trainingVars.instruction.shift()
  var instruct_text = ''
  if (instructions == 'distract') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>在这个试次中，请想一些情绪上中性的事情（分心）。</div></div>'
  } else if (instructions == 'reappraise') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>在这个试次中，请以一种减少其负面意义的方式来思考这幅图像（重新评价）。</div></div>'
  }
  return instruct_text
}

var getTrainingImage = function() {
  var intensity = trainingVars.intense.shift()
  var stim = ''
  if (intensity == 'high') {
    stim = base_path + 'high_intensity/' + high_intensity_stims.shift()
  } else {
    stim = base_path + 'low_intensity/' + low_intensity_stims.shift()
  }
  return '<div class = imageBox><img class = image src = ' + stim + ' </img></div>'
}

var getPracticeInstruct = function() {
  var instructions = practiceVars.instruction.shift()
  var instruct_text = ''
  if (instructions == 'choose') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>在这个试次中，请选择是想一些情绪上中性的事情（分心），还是以一种减少其负面意义的方式来思考这幅图像（重新评价）。</div></div>'
  } else if (instructions == 'distract') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>在这个试次中，请想一些情绪上中性的事情（分心）。</div></div>'
  } else if (instructions == 'reappraise') {
    instruct_text =
      '<div class = centerbox><div class = center-block-text>在这个试次中，请以一种减少其负面意义的方式来思考这幅图像（重新评价）。</div></div>'
  }
  return instruct_text
}

var getPracticeImage = function() {
  var intensity = practiceVars.intense.shift()
  var stim = ''
  if (intensity == 'high') {
    stim = base_path + 'high_intensity/' + high_intensity_stims.shift()
  } else {
    stim = base_path + 'low_intensity/' + low_intensity_stims.shift()
  }
  return '<div class = imageBox><img class = image src = ' + stim + ' </img></div>'
}

var setImage = function() {
  var intensity = stim_intensities.shift()
  if (intensity == 'high') {
    curr_stim = 'high_intensity/' + high_intensity_stims.shift()
  } else {
    curr_stim = 'low_intensity/' + low_intensity_stims.shift()
  }
}

var getImage = function() {
  var stim = base_path + curr_stim
  return '<div class = imageBox><img class = image src = ' + stim + ' </img></div>'
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
var training_len = 4
var practice_len = 8
var exp_len = 30
var curr_trial = 0
var choices = [37, 39]

var base_path = 'images/'
var low_intensity_stims = ['1270.JPG', '1301.JPG', '2278.JPG', '2312.JPG', '2490.JPG', '2691.JPG',
  '2700.JPG', '6010.JPG', '6020.JPG', '6190.JPG', '6241.JPG', '6836.JPG', '7360.JPG', '9101.JPG',
  '9102.JPG', '9120.JPG', '9140.JPG', '9160.JPG', '9171.JPG', '9440.JPG', '9470.JPG'
]
var low_intensity_stims = jsPsych.randomization.shuffle(low_intensity_stims)
var high_intensity_stims = ['2053.JPG', '2800.JPG', '3000.JPG', '3010.JPG', '3015.JPG', '3030.JPG',
  '3068.JPG', '3140.JPG', '3150.JPG', '3180.JPG', '3230.JPG', '3261.JPG', '3530.JPG', '6831.JPG',
  '9181.JPG', '9252.JPG', '9301.JPG', '9320.JPG', '9433.JPG', '9410.JPG', '9420.JPG'
]
var high_intensity_stims = jsPsych.randomization.shuffle(high_intensity_stims)
var stim_intensities = jsPsych.randomization.repeat(['high', 'low'], exp_len / 2)
var trainingVars = {
  'instruction': [],
  'intense': []
}

var images = []
for (var i = 0; i < low_intensity_stims.length; i++) {
  images.push(base_path + 'low_intensity/' + low_intensity_stims[i])
  images.push(base_path + 'high_intensity/' + high_intensity_stims[i])
}
//preload images
jsPsych.pluginAPI.preloadImages(images)

if (Math.random() < 0.5) {
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('high');
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('high');
} else {
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('reappraise');
  trainingVars.intense.push('high');
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('low');
  trainingVars.instruction.push('distract');
  trainingVars.intense.push('high');
}

var practiceVars = jsPsych.randomization.repeat([{
  instruction: 'choose',
  intense: 'high'
}, {
  instruction: 'choose',
  intense: 'high'
}, {
  instruction: 'choose',
  intense: 'low'
}, {
  instruction: 'choose',
  intense: 'low'
}, {
  instruction: 'distract',
  intense: 'high'
}, {
  instruction: 'distract',
  intense: 'low'
}, {
  instruction: 'reappraise',
  intense: 'high'
}, {
  instruction: 'reappraise',
  intense: 'low'
}], 1, true)
setImage()
var curr_stim = getImage()

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
// Set up attention check node
var attention_check_block = {
  type: 'attention-check',
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
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有任何意见吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};
/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'end',
    exp_id: 'emotion_regulation'
  },
  text: '<div class = centerbox><p class = "center-block-text">感谢您完成这个任务！</p><p class = "center-block-text">按 <strong>Enter</strong> 键继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};

var feedback_instruct_text =
  '欢迎参加实验。按 <strong>Enter</strong> 键开始。'
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
    "<div class = centerbox><p class = 'block-text'>在这个任务中，您将观看一些负面图片。这些图片旨在引发负面情绪——它们可能会让您感到不安、愤怒或心烦。这个实验正在研究您可以用来处理这些图像引发的负面情绪的不同策略。</p><p class = block-text>我们对两种策略感兴趣：分心和重新评价。在这个任务中，分心是指在观看图像时想一些情绪上中性的事情。重新评价是指以一种减少其负面意义的方式重新解释图像。</p><p class = block-text>在这个实验过程中，您有时会被指示使用这两种策略中的一种，有时会被允许自主选择。重要的是，在使用其中一种策略时，您必须继续看着图像。当您结束指导后，我们将从一些训练开始，这样您就可以学会使用这两种策略。</p></div>"
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
        '阅读说明过于快速。请花些时间，确保您理解说明。按 <strong>Enter</strong> 键继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '说明完成。按 <strong>Enter</strong> 键继续。'
      return false
    }
  }
}

var training_instruct = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction',
    exp_stage: 'training'
  },
  cont_key: [13],
  text: getTrainingInstruct,
  response_ends_trial: true,
  timing_post_trial: 0,
  timing_response: 180000
}

var training_view = {
  type: 'poldrack-single-stim',
  stimulus: getTrainingImage,
  is_html: true,
  data: {
    trial_id: 'stim-view',
    exp_stage: 'training'
  },
  choices: 'none',
  timing_stim: 15000,
  timing_response: 15000,
  timing_post_trial: 1000
}

var start_practice_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'start_practice'
  },
  text: '<div class = centerbox><p class = "center-block-text">现在您已经熟悉了这两种策略（分心和重新评价）的使用，我们将继续进行。我们将练习交替使用这些策略。在下一组试次中，您将被告知使用哪种策略，或被指示自己选择一种。按 <strong>Enter</strong> 键开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 500
};

var practice_instruct = {
  type: 'poldrack-text',
  data: {
    trial_id: 'instruction',
    exp_stage: 'practice'
  },
  cont_key: [13],
  text: getPracticeInstruct,
  response_ends_trial: true,
  timing_post_trial: 0,
  timing_response: 180000
}

var practice_view = {
  type: 'poldrack-single-stim',
  stimulus: getPracticeImage,
  is_html: true,
  data: {
    trial_id: 'stim-view',
    exp_stage: 'practice'
  },
  choices: 'none',
  timing_stim: 5000,
  timing_response: 5000,
  timing_post_trial: 1000
}

var start_test_block = {
  type: 'poldrack-text',
  timing_response: 180000,
  data: {
    trial_id: 'start_test'
  },
  text: '<div class = centerbox><p class = "center-block-text">我们现在将开始正式测试。您将看到30张图片。在每个试次中，图像将简短地呈现。然后您将被要求在观看图像时选择一个策略——分心或重新评价。在您选择该策略后，图像将再次呈现，在此期间您应使用您选择的策略来减少您的负面情绪。按 <strong>Enter</strong> 键开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 500
};

var preview_block = {
  type: 'poldrack-single-stim',
  stimulus: getImage,
  is_html: true,
  data: {
    trial_id: 'stim-preview',
    exp_stage: 'test'
  },
  choices: 'none',
  timing_stim: 500,
  timing_response: 500,
  timing_post_trial: 0
}

var choice_block = {
  type: 'poldrack-single-stim',
  stimulus: getChoiceText,
  choices: choices,
  is_html: true,
  data: {
    trial_id: 'choice',
    exp_stage: 'test'
  },
  response_ends_trial: true,
  timing_post_trial: 0
}

var view_block = {
  type: 'poldrack-single-stim',
  stimulus: getImage,
  is_html: true,
  data: {
    trial_id: 'stim-view',
    exp_stage: 'test'
  },
  choices: 'none',
  timing_stim: 5000,
  timing_response: 5000,
  timing_post_trial: 1000,
  on_finish: function() {
    setImage()
  }
}



/* create experiment definition array */
var emotion_regulation_experiment = [];
emotion_regulation_experiment.push(instruction_node);
for (var i = 0; i < training_len; i++) {
  emotion_regulation_experiment.push(training_instruct)
  emotion_regulation_experiment.push(training_view)
}
emotion_regulation_experiment.push(start_practice_block)
for (var i = 0; i < practice_len; i++) {
  emotion_regulation_experiment.push(practice_instruct)
  emotion_regulation_experiment.push(practice_view)
}
emotion_regulation_experiment.push(start_test_block)
for (var i = 0; i < exp_len; i++) {
  emotion_regulation_experiment.push(preview_block)
  emotion_regulation_experiment.push(choice_block)
  emotion_regulation_experiment.push(view_block)
}
emotion_regulation_experiment.push(post_task_block)
emotion_regulation_experiment.push(end_block);
