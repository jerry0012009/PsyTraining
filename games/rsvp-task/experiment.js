var rsvp_task = []; // main timeline

// RSVP stimuli
var letters          = alphabetRange('A', 'Z');
var numbers          = alphabetRange('2', '9');
var response_choices = keyCodeRange('2', '9');

// stimuli definitions
var rsvp_iti = {
    type: 'html-keyboard-response',
    stimulus: '<span></span>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 30,
    data: {test_part: 'iti'}
};
var rsvp_demo_iti = {
    type: 'html-keyboard-response',
    stimulus: '<span></span>',
    choices: jsPsych.NO_KEYS,
    trial_duration: 90,
    data: {test_part: 'iti'}
};
var fixation = {
  type: 'html-keyboard-response',
  stimulus: '<div class="rsvp">+</div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 2000,
  data: {test_part: 'fixation'}
}
var blank = {
  type: 'html-keyboard-response',
  stimulus: '<div class="rsvp"></div>',
  choices: jsPsych.NO_KEYS,
  trial_duration: 250,
  data: {test_part: 'blank'}
}
var rsvp_stimulus_block = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: jsPsych.NO_KEYS,
    trial_duration: 70,
    data: jsPsych.timelineVariable('data'),
};
var rsvp_demo_stimulus_block = {
    type: 'html-keyboard-response',
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: jsPsych.NO_KEYS,
    trial_duration: 210,
    data: jsPsych.timelineVariable('data'),
};
var response_block = {
  type: "html-keyboard-response",
  stimulus: jsPsych.timelineVariable('stimulus'),
  prompt: jsPsych.timelineVariable('prompt'),
  choices: response_choices,
  data: jsPsych.timelineVariable('data'),
  trial_duration: 5000,
  on_finish: function(data) {
    data.correct = data.correct_responses.includes(data.key_press); // accuracy irrespective of order
    if ( ! data.lag ) {                                             // only T2 has a lag
	    data.t1_correct = data.correct_response == data.key_press;  // T1 accuracy
	} else {
	    data.t2_correct = data.correct_response == data.key_press;  // T2 accuracy
	}
  }
}

// full screen
rsvp_task.push({
  type: 'fullscreen',
  message: '<div class="instructions"><p>欢迎参加本实验。</p><p>请点击下方按钮进入全屏模式开始实验。</p></div>',
  fullscreen_mode: true
});

// instructions
var instructions_1 = {
  type: "html-keyboard-response",
  stimulus: "<div class='instructions'><p>您将在电脑屏幕上看到一系列快速出现的字母和数字。" +
            "您的任务是记住序列中的数字。</p><p>当序列结束时，您需要回答问题'您看到了哪两个数字？'</p><p>您需要" +
            "输入您看到的数字（顺序不重要），然后下一个序列会出现。</p>" +
            "<p>按任意键查看任务示例。</p></div>",
  data: {test_part: 'instructions'},
  post_trial_gap: 1000
};
rsvp_task.push(instructions_1);

// make slow instruction trial
rsvp_task.push(make_rsvp_timeline([ {t1_location: 8, lag: 3} ], 'instructions'));

var instructions_2 = {
  type: "html-keyboard-response",
  stimulus: "<div class='instructions'><p>在您刚才看到的示例中，" +
            "字母和数字出现得相当缓慢。</p>" +
            "<p>真正的任务更具挑战性，字母和数字" +
            "会出现得快得多。</p>" +
            "<p>在开始正式测试之前，您将有一些时间练习。</p>" +
            "<p>按任意键开始练习。</p></div>",
  data: {test_part: 'instructions_2'},
  post_trial_gap: 1000
};
rsvp_task.push(instructions_2);


// Factorial design
// 3 locations x 4 lags = 12
var factors = {
    t1_location: [7, 8, 9],
    lag: [1, 3, 5, 8]
};
var practice_repetitions = 2;
var test_repetitions     = 12;
var practice_block       = 0;

var performance_block = {
  type: "html-keyboard-response",
  stimulus: function() {
  	var practice_trials = practice_repetitions * 12;
  	var correct         = 0;
  	for (i = 1; i <= practice_trials; i++) {
  		var trials         = jsPsych.data.get().filter({phase: 'practice' + practice_block});
	    trials             = trials.filter({trial_number: i});
		var correct_trials = trials.filter({correct: true});
		if (correct_trials.count() > 1) correct++;
  	}
    var accuracy = Math.round(correct / practice_trials * 100);
    if (accuracy >= 50) {
    	// practice accuracy achieved, so build test trials
    	var test_timeline = make_rsvp_timeline(jsPsych.randomization.factorial(factors, test_repetitions), 'test');
		jsPsych.addNodeToEndOfTimeline(test_timeline, function(){});
		var thanks = {
		  type: "html-keyboard-response",
		  stimulus: "<div class='instructions'><p>感谢您完成本任务。</p><p>按任意键继续。</p></div>",
		  trial_duration: 10000,
		  data: {test_part: 'end'}
		};
		jsPsych.addNodeToEndOfTimeline(thanks, function(){});
		var feedback = "<div class='instructions'><p>做得很好！您在 "+accuracy+"% 的试次中回答正确。</p>" +
	    "<p>按任意键开始正式测试。</p></div>";
    } else {
    	// practice accuracy too low, so repeat practice
    	practice_block++;
    	var practice_timeline = make_rsvp_timeline(jsPsych.randomization.factorial(factors, practice_repetitions), 'practice' + practice_block);
    	practice_timeline.timeline.push(performance_block);
    	jsPsych.addNodeToEndOfTimeline(practice_timeline, function(){});
	    var feedback = "<div class='instructions'><p>您在 "+accuracy+"% 的试次中回答正确。</p>" +
	    "<p>您需要达到至少 50% 的正确率才能开始正式测试。</p>" +
	    "<p>按任意键重新练习。</p></div>";
	}
	return feedback;
  }
};
// make initial practice block
rsvp_task.push(make_rsvp_timeline(jsPsych.randomization.factorial(factors, practice_repetitions), 'practice' + practice_block));
rsvp_task.push(performance_block);


/** functions **/
function alphabetRange (start, end) {
  return new Array(end.charCodeAt(0) - start.charCodeAt(0) + 1).fill().map((d, i) => String.fromCharCode(i + start.charCodeAt(0)));
}
function keyCodeRange (start, end) {
	var start = start.charCodeAt(0);
  return new Array(end.charCodeAt(0) - start + 1).fill().map((d, i) => i + start);
}
function numberRange (start, end) {
  return new Array(end - start + 1).fill().map((d, i) => i + start);
}

function rsvp_trial(o) {
	var stimuli                    = jsPsych.randomization.sampleWithoutReplacement(letters, 20);
	var targets                    = jsPsych.randomization.sampleWithoutReplacement(numbers, 2);
	stimuli[o.t1_location]         = targets[0];
	stimuli[o.t1_location + o.lag] = targets[1];

	return({stimuli: stimuli, targets: targets.map(jsPsych.pluginAPI.convertKeyCharacterToKeyCode)});
}

// Make a block of RSVP stimuli and responses
function make_rsvp_timeline(trials, phase) {
	rsvp_timeline = [];
	trial_number  = 0;
	for (trial in trials) {
		trial_number++;
		rsvp_stimuli = rsvp_trial(trials[trial]);

		// RSVP: 18 letters, 2 number targets
		var rsvp_block_stimuli = [];
		for (stimulus in rsvp_stimuli.stimuli) {
			rsvp_block_stimuli.push(
	  			{
	  				stimulus: "<span class='rsvp'>" + rsvp_stimuli.stimuli[stimulus] + "</span>",
	  				data: {
	  					phase: phase,
	  					test_part: 'rsvp',
	  					stim: rsvp_stimuli.stimuli[stimulus],
	  					trial_number: trial_number
	  				}
	  			}
	  		);
		}
		// attach RSVP stimuli to a timeline
		if (phase == 'instructions') {
			// slow stimuli
			stimulus_trial = rsvp_demo_stimulus_block;
			iti_trial      = rsvp_demo_iti;
		} else {
			stimulus_trial = rsvp_stimulus_block;
			iti_trial      = rsvp_iti;
		}
		var test_procedure = {
			timeline: [stimulus_trial, iti_trial],
			timeline_variables: rsvp_block_stimuli
		}

		// 2 responses
	  	var rsvp_response_stimuli = [];
	  	// T1
	  	rsvp_response_stimuli.push(
			{
				stimulus:'<div class="rsvp">您看到了哪两个数字？</div>',
				prompt: '<p class="rsvp">（按数字键）</p>',
				data: {
					phase: phase,
					test_part: 'response',
					correct_responses: rsvp_stimuli.targets,
					correct_response: rsvp_stimuli.targets[0],
					trial_number: trial_number
				}
			}
		);
	  	// T2
		rsvp_response_stimuli.push(
			{
				stimulus:'<div class="rsvp">您看到了哪两个数字？</div>',
				prompt: '<p class="rsvp">（按另一个数字键）</p>',
				data: {
					phase: phase,
					test_part: 'response',
					correct_responses: rsvp_stimuli.targets,
					correct_response: rsvp_stimuli.targets[1],
					lag: trials[trial].lag,
					trial_number: trial_number
				}
			}
		);
		// attach responses to timeline
		var response_procedure = {
			timeline: [response_block],
			timeline_variables: rsvp_response_stimuli
		}
		rsvp_timeline.push(fixation);
		rsvp_timeline.push(blank);
		rsvp_timeline.push(test_procedure);
		rsvp_timeline.push(response_procedure);
	}
	return { timeline: rsvp_timeline }
}
