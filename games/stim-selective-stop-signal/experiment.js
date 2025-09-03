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
	var experiment_data = jsPsych.data.getTrialsOfType('stop-signal');
	var missed_count = 0;
	var trial_count = 0;
	var rt_array = [];
	var rt = 0;
  var avg_rt = -1;
	//record choices participants made
	var choice_counts = {}
	choice_counts[-1] = 0
	for (var k = 0; k < choices.length; k++) {
    choice_counts[choices[k]] = 0
  }
	for (var i = 0; i < experiment_data.length; i++) {
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
	//calculate average rt
  if (rt_array.length !== 0) {
    avg_rt = math.median(rt_array)
  } else {
    avg_rt = -1
  }
	//calculate whether response distribution is okay
	var responses_ok = true
	Object.keys(choice_counts).forEach(function(key, index) {
		if (choice_counts[key] > trial_count * 0.85) {
			responses_ok = false
		}
	})
	credit_var = (avg_rt > 200) && responses_ok
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var})
}

var randomDraw = function(lst) {
  var index = Math.floor(Math.random() * (lst.length))
  return lst[index]
}

var getPracticeFeedback = function() {
  return '<div class = centerbox><p class = block-text>' + practice_feedback_text + '</p></div>'
}
var getSelectiveFeedback = function(){
	var data_length = 0
	var global_trial = jsPsych.progress().current_trial_global
	if(jsPsych.data.getDataByTrialIndex(global_trial - 5).exp_stage == 'practice'){
		data_length = 60
	}else if (jsPsych.data.getDataByTrialIndex(global_trial - 5).exp_stage == 'test'){
		data_length = 100
	}
	var start_cut = global_trial - data_length
	var numIgnore = 0
	var ignoreRespond = 0
	for (var i = 0; i < data_length; i++){
		if(jsPsych.data.getDataByTrialIndex(start_cut + i).trial_id == 'stim' &&  jsPsych.data.getDataByTrialIndex(start_cut + i).condition == 'ignore'){
			numIgnore = numIgnore + 1
			if(jsPsych.data.getDataByTrialIndex(start_cut + i).rt != -1){
				ignoreRespond = ignoreRespond + 1
			}
		}
	}
	var ignoreRespond_percent = ignoreRespond / numIgnore
	if (ignoreRespond_percent <= selective_threshold){
      	selective_feedback_text =
          '<p class = block-text>您对蓝色和橙色星星都停了下来。请确保<strong>仅在蓝色星星出现时停止您的反应。</strong></p><p class = block-text>按<strong>回车键</strong>查看块反馈。'
  	} else {
  		selective_feedback_text =
          '<p class = block-text>按<strong>回车键</strong>查看块反馈。'
    }
  	return '<div class = centerbox>' + selective_feedback_text + '</p></div>'
}
		
	
	

/* After each test block let the subject know their average RT and accuracy. If they succeed or fail on too many stop signal trials, give them a reminder */
var getTestFeedback = function() {
  var data = test_block_data
  var rt_array = [];
  var sum_correct = 0;
  var go_length = 0;
  var stop_length = 0;
  var num_responses = 0;
  var successful_stops = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].SS_trial_type != 'stop') {
      go_length += 1
      if (data[i].rt != -1) {
        num_responses += 1
        rt_array.push(data[i].rt);
        if (data[i].key_press == data[i].correct_response) {
          sum_correct += 1
        }
      }
    } else {
      stop_length += 1
      if (data[i].rt == -1) {
        successful_stops += 1
      }
    }
  }

  var average_rt = -1;
  if (rt_array.length !== 0) {
    average_rt = math.median(rt_array);
    rtMedians.push(average_rt)
  }
  var rt_diff = 0
  if (rtMedians.length !== 0) {
      rt_diff = (average_rt - rtMedians.slice(-1)[0])
  }
  var GoCorrect_percent = sum_correct / go_length;
  var missed_responses = (go_length - num_responses) / go_length
  var StopCorrect_percent = successful_stops / stop_length
  stopAccMeans.push(StopCorrect_percent)
  var stopAverage = math.mean(stopAccMeans)
  
  test_feedback_text = "<br>测试块完成。请利用这段时间阅读您的反馈并稍作休息！在您阅读完反馈后请按<strong>回车键</strong>继续。"
  test_feedback_text += "</p><p class = block-text><strong>平均反应时间：" + Math.round(average_rt) + "毫秒。非蓝星试验的准确率：" + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
  if (average_rt > RT_thresh || rt_diff > rt_diff_thresh) {
    test_feedback_text +=
      '</p><p class = block-text>您的反应过慢，请尽可能对每个形状做出快速准确的反应。'
  }
  if (missed_responses >= missed_response_thresh) {
    test_feedback_text +=
      '</p><p class = block-text><strong>我们检测到在一些需要反应的试验中没有做出反应。请确保您对每个形状都做出反应，除非出现蓝色星星。</strong>'
  }
  if (GoCorrect_percent < accuracy_thresh) {
    test_feedback_text += '</p><p class = block-text>您的准确率过低。请记住，正确的按键如下：' + prompt_text
  }
      
  if (StopCorrect_percent < (0.5-stop_thresh) || stopAverage < 0.45){
        test_feedback_text +=
          '</p><p class = block-text><strong>记住，当您看到蓝色停止信号时，请尝试停止您的反应。</strong>' 
  } else if (StopCorrect_percent > (0.5+stop_thresh) || stopAverage > 0.55){
    test_feedback_text +=
      '</p><p class = block-text><strong>记住，不要放慢对形状的反应速度来等待蓝色星星的出现。请尽可能对每个形状做出快速准确的反应。</strong>'
  }

  return '<div class = centerbox><p class = block-text>' + test_feedback_text + '</p></div>'
}


/* Staircase procedure. After each successful stop, make the stop signal delay longer (making stopping harder) */
var updateSSD = function(data) {
  if (data.condition == 'stop') {
    if (data.rt == -1 && SSD < 850) {
      SSD = SSD + 50
    } else if (data.rt != -1 && SSD > 0) {
      SSD = SSD - 50
    }
  }
}

var getSSD = function() {
  return SSD
}

/* These methods allow NoSSPractice and SSPractice to be randomized for each iteration
of the "while" loop */
var getNoSSPracticeStim = function() {
  practice_trial_data = NoSS_practice_list.data.pop()
  return NoSS_practice_list.stimulus.pop()
}

var getNoSSPracticeData = function() {
  return practice_trial_data
}

var getSSPracticeStim = function() {
  practice_stop_trial = practice_stop_trials.pop()
  practice_trial_data = practice_list.data.pop()
  practice_trial_data.condition = practice_stop_trial
  return practice_list.stimulus.pop()
}

var getSSPracticeData = function() {
  return practice_trial_data
}

var getSSPractice_trial_type = function() {
  if (practice_stop_trial == 'ignore') {
    return 'stop'
  } else {
    return practice_stop_trial
  }
}

var getSSPractice_stop_signal = function() {
  if (practice_stop_trial == 'ignore') {
    return ignore_signal
  } else {
    return stop_signal
  }
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
var credit_var = true


// task specific variables
// Define and load images
var prefix = 'images/'
var images = [prefix + 'rectangle.png', prefix + 'oval.png', prefix + 'trapezoid.png', prefix +
  'moon.png'
]
jsPsych.pluginAPI.preloadImages(images);

/* Stop signal delay in ms */
var SSD = 250
var stop_signal =
  '<div class = stopbox><div class = centered-shape id = stop-signal></div><div class = centered-shape id = stop-signal-inner></div></div>'
var ignore_signal =
  '<div class = stopbox><div class = centered-shape id = ignore-signal></div><div class = centered-shape id = ignore-signal-inner></div></div>'

/* Instruction Prompt */
var possible_responses = [
  ["M key", 77],
  ["Z key", 90]
]
var choices = [possible_responses[0][1], possible_responses[1][1]]

var correct_responses = jsPsych.randomization.shuffle([possible_responses[0], possible_responses[0],
  possible_responses[1], possible_responses[1]
])
var tab = '&nbsp&nbsp&nbsp&nbsp'
var prompt_text = '<ul list-text><li><img class = prompt_stim src = ' + images[0] + '></img>' + tab +
  correct_responses[0][0] + '</li><li><img class = prompt_oval_stim src = ' + images[1] + '></img>' + tab +
  correct_responses[1][0] + ' </li><li><img class = prompt_stim src = ' + images[2] + '></img>   ' +
  '&nbsp&nbsp&nbsp' + correct_responses[2][0] +
  ' </li><li><img class = prompt_stim src = ' + images[3] + '></img>' + tab + correct_responses[3][0] +
  ' </li></ul>'

/* Global task variables */
var current_trial = 0
var rtMedians = []
var stopAccMeans =[]
var RT_thresh = 1000
var rt_diff_thresh = 75
var selective_threshold = 0.6;
var missed_response_thresh = 0.1
var accuracy_thresh = 0.8
var stop_thresh = 0.2
var practice_repetitions = 1
var practice_repetition_thresh = 5
var test_block_data = [] // records the data in the current block to calculate feedback
var NoSSpractice_block_len = 12
var practice_block_len = 30
var test_block_len = 50
var numblocks = 6

/* Define Stims */
var stimulus = [{
  stimulus: '<div class = shapebox><img class = stim src = ' + images[0] + '></img></div>',
  data: {
    correct_response: correct_responses[0][1],
    trial_id: 'stim'
  }
}, {
  stimulus: '<div class = shapebox><img class = stim src = ' + images[1] + '></img></div>',
  data: {
    correct_response: correct_responses[1][1],
    trial_id: 'stim'
  }
}, {
  stimulus: '<div class = shapebox><img class = stim src = ' + images[2] + '></img></div>',
  data: {
    correct_response: correct_responses[2][1],
    trial_id: 'stim'
  }
}, {
  stimulus: '<div class = shapebox><img class = stim src = ' + images[3] + '></img></div>',
  data: {
    correct_response: correct_responses[3][1],
    trial_id: 'stim'
  }
}]


var practice_trial_data = '' //global variable to track randomized practice trial data
var NoSS_practice_list = jsPsych.randomization.repeat(stimulus, NoSSpractice_block_len / 4, true)
var practice_list = jsPsych.randomization.repeat(stimulus, practice_block_len / 4, true)
var practice_stop_trials = jsPsych.randomization.repeat(['stop', 'ignore', 'go',
  'go', 'go'], practice_block_len / 5)

//setup blocks
var blocks = []
for (i = 0; i < numblocks; i++) {
  blocks.push(jsPsych.randomization.repeat(stimulus, test_block_len / 4, true))
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
    trial_id: "end",
    exp_id: 'stim_selective_stop_signal'
  },
  text: '<div class = centerbox><p class = center-block-text>感谢您完成这个任务！</p><p class = center-block-text>按<strong>回车键</strong>继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0,
  on_finish: assessPerformance
};

var feedback_instruct_text =
  '欢迎参加实验。本实验大约需要22分钟。按<strong>回车键</strong>开始。'
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
    '<div class = centerbox><p class = block-text>在这个任务中，您将看到黑色形状逐一出现在屏幕上。您需要通过按"Z"和"M"键来对它们做出反应。</p></div>',
    '<div class = centerbox><p class = block-text>每个形状只有一个正确的按键。正确的按键如下：' + prompt_text +
    '</p><p class = block-text>这些说明在练习阶段会保留在屏幕上，但在测试阶段会被移除。</p><p class = block-text>您应该尽可能快速准确地对每个形状做出反应。</p></div>',
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
        '您阅读说明的速度过快。请仔细阅读并确保您理解了说明。按<strong>回车键</strong>继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '说明完毕。按<strong>回车键</strong>继续。'
      return false
    }
  }
}

var fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = centerbox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation",
    exp_stage: "test"
  },
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500
}

/* prompt blocks are used during practice to show the instructions */

var prompt_fixation_block = {
  type: 'poldrack-single-stim',
  stimulus: '<div class = shapebox><div class = fixation>+</div></div>',
  is_html: true,
  choices: 'none',
  data: {
    trial_id: "fixation",
    exp_stage: "practice"
  },
  timing_post_trial: 0,
  timing_stim: 500,
  timing_response: 500,
  prompt: prompt_text
}

/* Initialize 'feedback text' and set up feedback blocks */
var practice_feedback_text =
  '现在我们将开始练习阶段。在练习中，请专注于对每个形状快速准确地做出反应。按<strong>回车键</strong>继续。'
var practice_feedback_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "feedback",
    exp_stage: "practice"
  },
  timing_response: 180000,
  cont_key: [13],
  text: getPracticeFeedback
};

var selective_feedback_text = ''
var selective_feedback_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "feedback",
    exp_stage: "practice"
  },
  timing_response: 180000,
  cont_key: [13],
  text: getSelectiveFeedback
};

var test_feedback_block = {
  type: 'poldrack-text',
  data: {
    trial_id: "feedback",
    exp_stage: "test"
  },
  timing_response: 180000,
  cont_key: [13],
  text: getTestFeedback,
  on_finish: function() {
    test_block_data = []
  }
};



/* ************************************ */
/* Set up experiment */
/* ************************************ */

var stim_selective_stop_signal_experiment = []
stim_selective_stop_signal_experiment.push(instruction_node);

/* Practice block w/o SS */

NoSS_practice_trials = []
NoSS_practice_trials.push(practice_feedback_block)
for (i = 0; i < NoSSpractice_block_len; i++) {
  NoSS_practice_trials.push(prompt_fixation_block)
  var stim_block = {
    type: 'poldrack-single-stim',
    stimulus: getNoSSPracticeStim,
    data: getNoSSPracticeData,
    is_html: true,
    choices: choices,
    timing_post_trial: 0,
    timing_stim: 850,
    timing_response: 1850,
    prompt: prompt_text,
    on_finish: function() {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "NoSS_practice",
        trial_num: current_trial
      })
      current_trial += 1
    }
  }
  NoSS_practice_trials.push(stim_block)
}

var NoSS_practice_node = {
  timeline: NoSS_practice_trials,
  loop_function: function(data) {
    practice_repetitions += 1
    var rt_array = [];
    var sum_correct = 0;
    var go_length = 0;
    var num_responses = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == 'stim') {
        if (data[i].rt != -1) {
          num_responses += 1
          rt_array.push(data[i].rt);
          if (data[i].key_press == data[i].correct_response) {
            sum_correct += 1
          }
        }
        go_length += 1
      }
    }
    var average_rt = -1
    if (rt_array.length !== 0) {
      average_rt = math.median(rt_array);
    }
    var GoCorrect_percent = sum_correct / go_length;
    var missed_responses = (go_length - num_responses) / go_length
    practice_feedback_text = "</p><p class = block-text><strong>平均反应时间：" + Math.round(average_rt) + "毫秒。非蓝星试验的准确率：" + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
    if ((average_rt < RT_thresh && GoCorrect_percent > accuracy_thresh && missed_responses <
        missed_response_thresh) || practice_repetitions > practice_repetition_thresh) {
      // end the loop
      current_trial = 0
      practice_repetitions = 1
      practice_feedback_text +=
        '</p><p class = block-text>在实验的其余部分中，在一定比例的试验中，形状周围会出现蓝色或橙色星星。如果星星是蓝色的，它就是“停止信号”。<strong>当蓝色星星出现时，请尽您最大努力停止您的反应，在那次试验中不要按任何键。如果星星是橙色的，请继续对形状做出反应。</strong> </p><p class = block-text>星星将在形状出现的同时或稍后出现。因此，当蓝色星星出现时，您并不总是能够成功停止。但是，如果您继续非常努力地在蓝色星星出现时停止，您有时能够停止，但不是总是能停止。</p><p class = block-text>如果橙色星星出现，请按平时那样按正确的键做出反应。</p><p class = block-text><strong>请平衡对形状做出快速准确反应的要求，同时非常努力地在蓝色停止信号出现时停止。</strong></p><p class = block-text>按<strong>回车键</strong>继续'
      return false;
    } else {
      //rerandomize stim order
      NoSS_practice_list = jsPsych.randomization.repeat(stimulus, 3, true)
      // keep going until they are faster!
      practice_feedback_text += '</p><p class = block-text>我们将再进行一个练习块。'
      if (average_rt > RT_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>您的反应过慢，请尽可能对每个形状做出快速准确的反应。'
      }
      if (missed_responses >= missed_response_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text><strong>我们检测到在一些需要反应的试验中没有做出反应。请确保您对每个形状都做出反应。</strong>'
      }
      if (GoCorrect_percent <= accuracy_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>您的准确率过低。请记住，正确的按键如下：' + prompt_text
      }
      practice_feedback_text += '</p><p class = block-text>按<strong>回车键</strong>继续'
      return true;
    }
  }
}

/* Practice block with SS */

var practice_trials = []
practice_trials.push(practice_feedback_block)
for (i = 0; i < practice_block_len; i++) {
  practice_trials.push(prompt_fixation_block)
  var stop_signal_block = {
    type: 'stop-signal',
    stimulus: getSSPracticeStim,
    SS_stimulus: getSSPractice_stop_signal,
    SS_trial_type: getSSPractice_trial_type,
    data: getSSPracticeData,
    is_html: true,
    choices: choices,
    timing_stim: 850,
    timing_response: 1850,
    prompt: prompt_text,
    SSD: SSD,
    timing_SS: 500,
    timing_post_trial: 0,
    on_finish: function(data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "practice",
        trial_num: current_trial
      })
      current_trial += 1
    }
  }
  practice_trials.push(stop_signal_block)
}
practice_trials.push(selective_feedback_block)

/* Practice node continues repeating until the subject reaches certain criteria */


var practice_node = {
  timeline: practice_trials,
  // This function defines stopping criteria 
  loop_function: function(data) {
    practice_repetitions += 1
    var rt_array = [];
    var sum_correct = 0;
    var go_length = 0;
    var num_responses = 0;
    var stop_length = 0
    var successful_stops = 0
    for (var i = 0; i < data.length; i++) {
      if (data[i].trial_id == 'stim') {
        if (data[i].SS_trial_type != 'stop') {
          if (data[i].rt != -1) {
            num_responses += 1
            rt_array.push(data[i].rt);
            if (data[i].key_press == data[i].correct_response) {
              sum_correct += 1
            }
          }
          go_length += 1
        } else if (data[i].SS_trial_type == "stop") {
          stop_length += 1
          if (data[i].rt == -1) {
            successful_stops += 1
          }
        }
      }
    }
    
    var numIgnore = 0
    var ignoreRespond = 0
    for (var b = 0; b < data.length; b++){
    	if(data[b].trial_id == 'stim' && data[b].condition == 'ignore'){
    		numIgnore = numIgnore + 1
    		if (data[b].rt != -1){
    			ignoreRespond = ignoreRespond + 1
    		}
    	}
    }
    		
    var average_rt = -1
    if (rt_array.length !== 0) {
      average_rt = math.median(rt_array);
    }
    var ignoreRespond_percent = ignoreRespond/numIgnore
    var GoCorrect_percent = sum_correct / go_length;
    var missed_responses = (go_length - num_responses) / go_length
    var StopCorrect_percent = successful_stops / stop_length
    practice_feedback_text = "</p><p class = block-text><strong>平均反应时间：" + Math.round(average_rt) + "毫秒。非蓝星试验的准确率：" + Math.round(GoCorrect_percent * 100)+ "%</strong>" 
    if ((average_rt < RT_thresh && GoCorrect_percent > accuracy_thresh && missed_responses <
        missed_response_thresh && StopCorrect_percent > 0.2 && StopCorrect_percent < 0.8 && ignoreRespond_percent > selective_threshold) || practice_repetitions >
      practice_repetition_thresh) {
      // end the loop
      current_trial = 0
      practice_feedback_text +=
        '</p><p class = block-text>练习完成。我们现在将开始' + 
        numblocks +
        '个测试块。每个块后都会有休息时间。按<strong>回车键</strong>继续。'
      return false;
    } else {
      //rerandomize stim and stop_trial order
      practice_list = jsPsych.randomization.repeat(stimulus, practice_block_len/4, true)
      practice_stop_trials = jsPsych.randomization.repeat(['stop', 'ignore', 'go', 'go', 'go'], practice_list.data.length / 5, false)
        // keep going until they are faster!
      practice_feedback_text += '</p><p class = block-text>我们将再进行一个练习块。'

      if (average_rt > RT_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>您的反应过慢，请尽可能对每个形状做出快速准确的反应。'
      }

      if (missed_responses >= missed_response_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text><strong>我们检测到在一些需要反应的试验中没有做出反应。请确保您对每个形状都做出反应，除非出现蓝色星星。</strong>'
      }

      if (GoCorrect_percent <= accuracy_thresh) {
        practice_feedback_text +=
          '</p><p class = block-text>您的准确率过低。请记住，正确的按键如下：' + prompt_text
      }
      
      if (StopCorrect_percent < 0.8){
        practice_feedback_text +=
          '</p><p class = block-text><strong>记住，当您看到蓝色停止信号时，请尝试停止您的反应。</strong>' 
      } else if (StopCorrect_percent > 0.2){
        practice_feedback_text +=
          '</p><p class = block-text><strong>记住，不要放慢对形状的反应速度来等待蓝色星星的出现。请尽可能对每个形状做出快速准确的反应。</strong>'
      }
      practice_feedback_text += '</p><p class = block-text>按<strong>回车键</strong>继续'
      return true;
    }
  }
}

stim_selective_stop_signal_experiment.push(NoSS_practice_node)
stim_selective_stop_signal_experiment.push(practice_node)
stim_selective_stop_signal_experiment.push(practice_feedback_block)

/* Test blocks */
// Loop through the multiple blocks within each condition
for (var b = 0; b < numblocks; b++) {
  stop_signal_exp_block = []
  var block = blocks[b]
  var stop_trials = jsPsych.randomization.repeat(['stop', 'ignore', 'go', 'go', 'go'],
      test_block_len / 5)
    // Loop through each trial within the block
  for (var i = 0; i < test_block_len; i++) {
    stop_signal_exp_block.push(fixation_block)
      //Label each trial as an ignore, stop or go trial
    var trial_data = $.extend({}, block.data[i])
    trial_data.condition = stop_trials[i]
    trial_data.exp_stage = 'test'
    if (stop_trials[i] == 'ignore') {
      var stop_trial = 'stop'
      var stop_stim = ignore_signal
    } else {
      var stop_stim = stop_signal
      var stop_trial = stop_trials[i]
      
    }
    var stop_signal_block = {
      type: 'stop-signal',
      stimulus: block.stimulus[i],
      SS_stimulus: stop_stim,
      SS_trial_type: stop_trial,
      data: trial_data,
      is_html: true,
      choices: choices,
      timing_stim: 850,
      timing_response: 1850,
      SSD: getSSD,
      timing_SS: 500,
      timing_post_trial: 0,
      on_finish: function(data) {
        updateSSD(data)
        test_block_data.push(data)
        jsPsych.data.addDataToLastTrial({
          trial_num: current_trial
        })
        current_trial += 1
      }
    }
    stop_signal_exp_block.push(stop_signal_block)
  }

  stim_selective_stop_signal_experiment = stim_selective_stop_signal_experiment.concat(
    stop_signal_exp_block)
  if ($.inArray(b, [0, 1, 4]) != -1) {
    stim_selective_stop_signal_experiment.push(attention_node)
  }
  stim_selective_stop_signal_experiment.push(selective_feedback_block)
  stim_selective_stop_signal_experiment.push(test_feedback_block)
}
stim_selective_stop_signal_experiment.push(post_task_block)
stim_selective_stop_signal_experiment.push(end_block)
