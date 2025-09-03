/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

var getResponseTime = function() {
  if (writing_start === 0 ) {
    writing_start = new Date()
  }
  var timeLeft = (timelimit-elapsed)*60000
  return timeLeft
}
/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var writing_start = 0
var timelimit = 5
var elapsed = 0

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下这个任务要求您做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么意见或建议吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  data: {
    exp_id: "writing_task",
    trial_id: "end"
  },
  text: '<div class = centerbox><p class = center-block-text>感谢您完成这个任务！</p><p class = center-block-text>按 <strong>回车键</strong> 继续。</p></div>',
  cont_key: [13],
  timing_response: 180000,
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
    '<div class = centerbox><p class = block-text>在这个任务中，我们希望您进行写作。在下一页中，请根据提示"上个月发生了什么？"写作 ' +
    timelimit +
    ' 分钟。</p><p class = block-text>重要提醒：请在整个时间内持续写作并保持专注。结束说明后您将开始写作。实验将在 ' + timelimit + ' 分钟后自动结束。</p></div>'
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
        '您阅读说明过快。请花时间确保您理解了说明。按 <strong>回车键</strong> 继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '说明已完成。按 <strong>回车键</strong> 继续。'
      return false
    }
  }
}
/* define test block */
var write_block = {
  type: 'writing',
  data: {
    trial_id: "write",
    exp_stage: 'test'
  },
  text_class: 'writing_class',
  is_html: true,
  initial_text: '请在此处写作 ' + timelimit + ' 分钟。',
  timing_post_trial: 0,
  timing_response: timelimit * 60000
};


/* create experiment definition array */
var writing_task_experiment = [];
writing_task_experiment.push(instruction_node);
writing_task_experiment.push(write_block);
writing_task_experiment.push(post_task_block)
writing_task_experiment.push(end_block);