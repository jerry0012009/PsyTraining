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
	credit individual experiments in expfactory. 
	 */
	var experiment_data = jsPsych.data.getTrialsOfType('poldrack-single-stim')
	experiment_data = experiment_data.concat(jsPsych.data.getTrialsOfType('poldrack-categorize'))
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
	var missed_percent = missed_count/trial_count
	credit_var = (missed_percent < 0.4 && avg_rt > 200 && responses_ok)
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
    '</p></div>'
}

// Task Specific Functions
var getKeys = function(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }
  return keys
}

var genStims = function(n) {
  stims = []
  for (var i = 0; i < n; i++) {
    var number = randomDraw('12346789')
    var color = randomDraw(['orange', 'blue'])
    var stim = {
      number: parseInt(number),
      color: color
    }
    stims.push(stim)
  }
  return stims
}

//Sets the cue-target-interval for the cue block
var setCTI = function() {
  return randomDraw([100, 900])
}

var getCTI = function() {
  return CTI
}

/* Index into task_switches using the global var current_trial. Using the task_switch and cue_switch
change the task. If "stay", keep the same task but change the cue based on "cue switch". 
If "switch new", switch to the task that wasn't the current or last task, choosing a random cue. 
If "switch old", switch to the last task and randomly choose a cue.
*/
var setStims = function() {
  var tmp;
  switch (task_switches[current_trial].task_switch) {
    case "stay":
      if (curr_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks))
      }
      if (task_switches[current_trial].cue_switch == "switch") {
        cue_i = 1 - cue_i
      }
      break
    case "switch_new":
      cue_i = randomDraw([0, 1])
      if (last_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        }))
        last_task = tmp
      } else {
        tmp = curr_task
        curr_task = getKeys(tasks).filter(function(x) {
          return (x != curr_task & x != last_task)
        })[0]
        last_task = tmp
      }
      break
    case "switch_old":
      cue_i = randomDraw([0, 1])
      if (last_task == "na") {
        tmp = curr_task
        curr_task = randomDraw(getKeys(tasks).filter(function(x) {
          return (x != curr_task)
        }))
        last_task = tmp
      } else {
        tmp = curr_task
        curr_task = last_task
        last_task = tmp
      }
      break

  }
  curr_cue = tasks[curr_task].cues[cue_i]
  curr_stim = stims[current_trial]
  current_trial = current_trial + 1
  CTI = setCTI()
}

var getCue = function() {
  var cue_html = '<div class = upperbox><div class = "center-text" >' + curr_cue +
    '</div></div><div class = lowerbox><div class = fixation>+</div></div>'
  return cue_html
}

var getStim = function() {
  var stim_html = '<div class = upperbox><div class = "center-text" >' + curr_cue +
    '</div></div><div class = lowerbox><div class = "center-text" style=color:' + curr_stim.color +
    ';>' + curr_stim.number + '</div>'
  return stim_html
}

//Returns the key corresponding to the correct response for the current
// task and stim
var getResponse = function() {
  switch (curr_task) {
    case 'color':
      if (curr_stim.color == 'orange') {
        return response_keys.key[0]
      } else {
        return response_keys.key[1]
      }
      break;
    case 'magnitude':
      if (curr_stim.number > 5) {
        return response_keys.key[0]
      } else {
        return response_keys.key[1]
      }
      break;
    case 'parity':
      if (curr_stim.number % 2 === 0) {
        return response_keys.key[0]
      } else {
        return response_keys.key[1]
      }
  }
}


/* Append gap and current trial to data and then recalculate for next trial*/
var appendData = function() {
  var trial_num = current_trial - 1 //current_trial has already been updated with setStims, so subtract one to record data
  var task_switch = task_switches[trial_num]
  jsPsych.data.addDataToLastTrial({
    cue: curr_cue,
    stim_color: curr_stim.color,
    stim_number: curr_stim.number,
    task: curr_task,
    task_switch: task_switch.task_switch,
    cue_switch: task_switch.cue_switch,
    trial_num: trial_num
  })
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
var response_keys = jsPsych.randomization.repeat([{
  key: 77,
  key_name: 'M'
}, {
  key: 90,
  key_name: 'Z'
}], 1, true)
var choices = response_keys.key
var practice_length = 60
var test_length = 440

//set up block stim. correct_responses indexed by [block][stim][type]
var tasks = {
  color: {
    task: 'color',
    cues: ['颜色', '橙色-蓝色']
  },
  parity: {
    task: 'parity',
    cues: ['奇偶性', '奇数-偶数']
  },
  magnitude: {
    task: 'magnitude',
    cues: ['大小', '大-小']
  }
}

var task_switch_types = ["stay", "switch_new", "switch_old"]
var cue_switch_types = ["stay", "switch"]
var task_switches = []
for (var t = 0; t < task_switch_types.length; t++) {
  for (var c = 0; c < cue_switch_types.length; c++) {
    task_switches.push({
      task_switch: task_switch_types[t],
      cue_switch: cue_switch_types[c]
    })
  }
}
var task_switches = jsPsych.randomization.repeat(task_switches, practice_length / 6)
var practiceStims = genStims(practice_length)
var testStims = genStims(test_length)
var stims = practiceStims
var curr_task = randomDraw(getKeys(tasks))
var last_task = 'na' //object that holds the last task, set by setStims()
var curr_cue = 'na' //object that holds the current cue, set by setStims()
var cue_i = randomDraw([0, 1]) //index for one of two cues of the current task
var curr_stim = 'na' //object that holds the current stim, set by setStims()
var current_trial = 0
var CTI = 0 //cue-target-interval
var exp_stage = 'practice' // defines the exp_stage, switched by start_test_block

var task_list = '<ul><li><strong>颜色</strong>或<strong>橙色-蓝色</strong>: 如果是橙色则按' +
  response_keys.key_name[0] + '键，如果是蓝色则按' + response_keys.key_name[1] +
  '键。' +
  '</li><li><strong>奇偶性</strong>或<strong>奇数-偶数</strong>: 如果是偶数则按' + response_keys.key_name[
    0] + '键，如果是奇数则按' + response_keys.key_name[1] + '键。' +
  '</li><li><strong>大小</strong>或<strong>大-小</strong>: 如果数字大于5则按' + response_keys.key_name[
    0] + '键，如果小于5则按' + response_keys.key_name[1] +
  '键。</li></ul>'

var prompt_task_list = '<ul><li><strong>颜色</strong>或<strong>橙色-蓝色</strong>: ' +
  response_keys.key_name[0] + '橙色,' + response_keys.key_name[1] + '蓝色' +
  '</li><li><strong>奇偶性</strong>或<strong>奇数-偶数</strong>: ' + response_keys.key_name[0] +
  '偶数,' + response_keys.key_name[1] + '奇数' +
  '</li><li><strong>大小</strong>或<strong>大-小</strong>: ' + response_keys.key_name[0] +
  '>5,' + response_keys.key_name[1] + '<5</li></ul>'



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
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在这个任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对这个任务有什么评论吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
  '欢迎参加实验。这个实验大约24分钟。按<strong>Enter</strong>键开始。'
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
    '<div class = centerbox><p class = block-text>在这个实验中，您需要通过按"M"和"Z"键来对一系列彩色数字做出反应。您对数字的反应方式取决于当前的任务，该任务在每次试验中都可能发生变化。</p><p class = block-text>例如，在某些试验中，您需要指示数字是奇数还是偶数，在其他试验中，您需要指示数字是橙色还是蓝色。每次试验都会以一个提示开始，告诉您在该试验中要做什么任务。</p></div>',
    '<div class = centerbox><p class = block-text>数字前面的提示是一个表示任务的词语。将有6个不同的提示词来表示3个不同的任务。这些提示词和任务如下所述：</p>' +
    task_list +
    '<p class = block-text>练习将在您结束指示后开始。</p></div>'
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
        '您读指示太快了。请花时间确保您理解指示。按<strong>Enter</strong>键继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '指示完成。按<strong>Enter</strong>键继续。'
      return false
    }
  }
}
var end_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "end",
    exp_id: 'threebytwo'
  },
  text: '<div class = centerbox><p class = center-block-text>感谢您完成这个任务！</p><p class = center-block-text>按<strong>Enter</strong>键继续。</p></div>',
  cont_key: [13],
  timing_response: 180000,
  on_finish: assessPerformance
};

var start_practice_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "practice_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>先进行一些练习。</p><p class = center-block-text>按<strong>Enter</strong>键继续。</p></div>',
  cont_key: [13]
};

var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "test_intro"
  },
  text: '<div class = centerbox><p class = center-block-text>练习完成。开始正式测试。</p><p class = center-block-text>按<strong>Enter</strong>键开始。</p></div>',
  on_finish: function() {
    current_trial = 0
    stims = testStims
    task_switches = jsPsych.randomization.repeat(task_switches, test_length / 6)
  },
  timing_post_trial: 1000
}

/* define practice and test blocks */
var setStims_block = {
  type: 'call-function',
  data: {
    trial_id: "set_stims"
  },
  func: setStims,
  timing_post_trial: 0
}

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = upperbox><div class = fixation>+</div></div><div class = lowerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation"
  },
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      exp_stage: exp_stage
    })
  }
}

var cue_block = {
  type: 'poldrack-single-stim',
  stimulus: getCue,
  is_html: true,
  choices: 'none',
  data: {
    trial_id: 'cue'
  },
  timing_response: getCTI,
  timing_stim: getCTI,
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      exp_stage: exp_stage
    })
    appendData()
  }
};

var practice_block = {
  type: 'poldrack-categorize',
  stimulus: getStim,
  is_html: true,
  key_answer: getResponse,
  correct_text: '<div class = centerbox><div style="color:green"; class = center-text>正确！</p></div><div class = promptbox>' +
    prompt_task_list + '</div>',
  incorrect_text: '<div class = centerbox><div style="color:red"; class = center-text>错误</p></div><div class = promptbox>' +
    prompt_task_list + '</div>',
  timeout_message: '<div class = centerbox><div class = center-text>太慢了</div></div><div class = promptbox>' +
    prompt_task_list + '</div>',
  choices: choices,
  data: {
    trial_id: 'stim',
    exp_stage: "practice"
  },
  timing_feedback_duration: 1000,
  show_stim_with_feedback: false,
  timing_response: 2000,
  timing_stim: 1000,
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: appendData
}

var test_block = {
  type: 'poldrack-single-stim',
  stimulus: getStim,
  is_html: true,
  key_answer: getResponse,
  choices: choices,
  data: {
    trial_id: 'stim',
    exp_stage: 'test'
  },
  timing_post_trial: 0,
  timing_response: 2000,
  timing_stim: 1000,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
  on_finish: function(data) {
    appendData()
    correct_response = getResponse()
    correct = false
    if (data.key_press === correct_response) {
      correct = true
    }
    jsPsych.data.addDataToLastTrial({
      'correct_response': correct_response,
      'correct': correct
    })
  }
}

var gap_block = {
  type: 'poldrack-single-stim',
  stimulus: ' ',
  is_html: true,
  choices: 'none',
  data: {
    trial_id: 'gap',
    exp_stage: 'practice'
  },
  timing_response: 500,
  timing_stim: 0,
  timing_post_trial: 0,
  prompt: '<div class = promptbox>' + prompt_task_list + '</div>',
};


/* create experiment definition array */
var threebytwo_experiment = [];
threebytwo_experiment.push(instruction_node);
threebytwo_experiment.push(start_practice_block);
for (var i = 0; i < practice_length; i++) {
  threebytwo_experiment.push(setStims_block)
  threebytwo_experiment.push(fixation_block)
  threebytwo_experiment.push(cue_block);
  threebytwo_experiment.push(practice_block);
  threebytwo_experiment.push(gap_block);
}
threebytwo_experiment.push(attention_node)
threebytwo_experiment.push(start_test_block)
for (var i = 0; i < test_length; i++) {
  threebytwo_experiment.push(setStims_block)
  threebytwo_experiment.push(fixation_block)
  threebytwo_experiment.push(cue_block);
  threebytwo_experiment.push(test_block);
}
threebytwo_experiment.push(attention_node)
threebytwo_experiment.push(post_task_block)
threebytwo_experiment.push(end_block)
