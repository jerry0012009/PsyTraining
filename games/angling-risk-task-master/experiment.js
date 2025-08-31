// Reference: http://www.ncbi.nlm.nih.gov/pubmed/18193561
// Decision Making and Learning While Taking Sequential Risks. Pleskac 2008

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
	var experiment_data = jsPsych.data.getTrialsOfType('single-stim-button')
	var missed_count = 0
	var trial_count = 0
	var rt_array = []
	var rt = 0
	for (var i = 0; i < experiment_data.length; i++) {
		rt = experiment_data[i].rt
		trial_count += 1
		if (rt == -1) {
			missed_count += 1
		} else {
			rt_array.push(rt)
		}
	}
	//calculate average rt
	var sum = 0
	for (var j = 0; j < rt_array.length; j++) {
		sum += rt_array[j]
	}
	var avg_rt = sum / rt_array.length || -1
	var missed_percent = missed_count/experiment_data.length
  	credit_var = (missed_percent < 0.4 && avg_rt > 200)
  	if (credit_var === true) {
    	performance_var = total_points
  	} else {
    	performance_var = 0
  	}
	jsPsych.data.addDataToLastTrial({"credit_var": credit_var, "performance_var": performance_var})

}

var getInstructFeedback = function() {
	return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text +
		'</p></div>'
}

function appendTextAfter(input, search_term, new_text) {
	var index = input.indexOf(search_term) + search_term.length
	return input.slice(0, index) + new_text + input.slice(index)
}

function getRoundOverText() {
	return '<div class = centerbox><p class = center-block-text>' + round_over_text +
		' 本轮结束。</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>'
}

function getGame() {
	/* At the beginning of each round the task displays either a new lake (if a new tournament is starting)
	or the state of the lake from the last round after the action had been chosen. This function works
	by editing "game_setup" a string which determines the html to display, followed by calling the "makeFish"
	function, which...makes fish.
	*/
	if (total_fish_num === 0) {
		round_over = 0
		trial_num = 0
		game_state = game_setup
		game_state = appendTextAfter(game_state, '垂钓积分库: </strong>', trip_bank)
		game_state = appendTextAfter(game_state, '锦标赛积分库: </strong>', tournament_bank)
		game_state = appendTextAfter(game_state, '冷藏箱中的红鱼: </strong>', 0)
		game_state = appendTextAfter(game_state, "钓鱼模式: ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		$('.jspsych-display-element').html(game_state)
		if (weather == "晴朗") {
			$('.lake').css("background-color", "LightBlue")
		} else {
			$('.lake').css("background-color", "CadetBlue")
		}
		makeFish(start_fish_num)
	} else {
		// Update game state with cached values
		game_state = game_setup
		game_state = appendTextAfter(game_state, 'lake>', lake_state)
		if (weather == "晴朗") {
			game_state = appendTextAfter(game_state, '湖中红鱼数量: </strong>', red_fish_num)
			game_state = appendTextAfter(game_state, '湖中蓝鱼数量: </strong>', total_fish_num -
				red_fish_num)
		}
		game_state = appendTextAfter(game_state, '垂钓积分库: </strong>', trip_bank)
		game_state = appendTextAfter(game_state, '锦标赛积分库: </strong>', tournament_bank)
		game_state = appendTextAfter(game_state, "钓鱼模式: ", release)
		game_state = appendTextAfter(game_state, "weathertext>", weather)
		if (release == "保留") {
			game_state = appendTextAfter(game_state, '冷藏箱中的红鱼: </strong>', trip_bank)
		}
		$('.jspsych-display-element').html(game_state)
		if (weather == "晴朗") {
			$('.lake').css("background-color", "LightBlue")
		} else {
			$('.lake').css("background-color", "CadetBlue")
		}
		makeFish(total_fish_num)
	}
}

function get_data() {
	/* Records state of the world before the person made their choice
	 */
	var data = {
		exp_stage: "test",
		trial_id: "stim",
		red_fish_num: red_fish_num,
		trip_bank: trip_bank,
		tournament_bank: tournament_bank,
		weather: weather,
		release: release,
		round_num: round_num,
		trial_num: trial_num
	}
	trial_num += 1
	return data
}

function get_practice_data() {
	/* Records state of the world before the person made their choice
	 */
	var data = {
		exp_stage: "practice",
		trial_id: "stim",
		red_fish_num: red_fish_num,
		trip_bank: trip_bank,
		tournament_bank: tournament_bank,
		weather: weather,
		release: release,
		round_num: round_num,
		trial_num: trial_num
	}
	trial_num += 1
	return data
}

function makeFish(fish_num) {
	/* This function makes fish. This includes setting the global variables that track fish number and displaying the
		fish in the lake if it is sunny out. It uses the placeFish function to set the fish locations
	
	*/
	$(".redfish").remove();
	$(".bluefish").remove();
	$(".greyfish").remove();
	red_fish_num = 0
	total_fish_num = 0
	filled_areas = [];
	if (max_x === 0) {
		min_x = $('.lake').width() * 0.05;
		min_y = $('.lake').height() * 0.05;
		max_x = $('.lake').width() * 0.9;
		max_y = $('.lake').height() * 0.9;
	}
	for (i = 0; i < fish_num - 1; i++) {
		red_fish_num += 1
		if (weather == "晴朗") {
			$('.lake').append('<div class = redfish id = red_fish' + red_fish_num + '></div>')
		}
	}
	if (weather == "晴朗") {
		$('.lake').append('<div class = bluefish id = blue_fish></div>')
	}
	place_fish()
	if (weather == "晴朗") {
		$('#red_count').html('<strong>湖中红鱼数量:</strong> ' + red_fish_num)
		$('#blue_count').html('<strong>湖中蓝鱼数量:</strong> 1')
	}
	total_fish_num = red_fish_num + 1
}

function goFish() {
	/* If the subject chooses to goFish, one fish is randomly selected from the lake. If it is red, the trip bank
		is increased by "pay". If it is blue the round ends. If the release rule is "Keep", the fish is also removed
		from the lake. Coded as keycode 36 for jspsych
	*/
	if (total_fish_num > 0) {
		if (Math.random() < 1 / (total_fish_num)) {
			$('#blue_fish').remove();
			trip_bank = 0
			$(".lake").html('')
			red_fish_num = 0
			total_fish_num = 0
			last_pay = 0
			round_over = 1
			round_num += 1
			round_over_text = "你钓到了蓝色的鱼！你失去了本轮收集的所有积分。"
		} else {
			if (release == "保留") {
				$('#red_fish' + red_fish_num).remove()
				red_fish_num -= 1
				total_fish_num -= 1
			}
			trip_bank += pay
			last_pay = pay

		}

		lake_state = $('.lake').html()
	}
}

function collect() {
	round_over = 1
	round_num += 1
	round_over_text = "你已经将垂钓积分库中的积分（" + trip_bank +
		" 分）转移到了锦标赛积分库。"
		// Tranfers points from trip bank to tournament bank and ends the round. Coded as keycode 35 for jspsych
	tournament_bank += trip_bank
	tournment_bank = tournament_bank
	trip_bank = 0
	$(".redfish").remove();
	$(".bluefish").remove();
	$('#tournament_bank').html('<strong>锦标赛积分库:</strong> ' + tournament_bank)
	$('#trip_bank').html('<strong>垂钓积分库:</strong> ' + trip_bank)
	red_fish_num = 0
	total_fish_num = 0
	lake_state = $('.lake').html()
	cooler_state = $('.lake').html()
}



function calc_overlap(a1) {
	// helper function when placing fish. 
	var overlap = 0;
	for (var i = 0; i < filled_areas.length; i++) {
		a2 = filled_areas[i]
			// no intersection cases
		if (a1.x + a1.width < a2.x) {
			continue;
		}
		if (a2.x + a2.width < a1.x) {
			continue;
		}
		if (a1.y + a1.height < a2.y) {
			continue;
		}
		if (a2.y + a2.height < a1.y) {
			continue;
		}

		// intersection exists : calculate it !
		var x1 = Math.max(a1.x, a2.x);
		var y1 = Math.max(a1.y, a2.y);
		var x2 = Math.min(a1.x + a1.width, a2.x + a2.width);
		var y2 = Math.min(a1.y + a1.height, a2.y + a2.height);

		var intersection = ((x1 - x2) * (y1 - y2));

		overlap += intersection;

	}
	return overlap;
}

function place_fish() {
	/* Places fish in the lake and attempts to overlap them as little as possible. It does this by randomly placing the fish
	   up to maxSearchIterations times. It stops if it places the fish with no overlap. Otherwise, the fish goes where there is the
	   least overlap. 
	*/
	var index = 0;
	fish_types = ['redfish', 'bluefish', 'greyfish']
	for (f = 0; f < fish_types.length; f++) {
		fish = fish_types[f]
		$('.' + fish).each(function(index) {
			var rand_x = 10;
			var rand_y = 10;
			var smallest_overlap = '';
			var best_choice;
			var area;
			for (var i = 0; i < maxSearchIterations; i++) {
				rand_x = Math.round(min_x + ((max_x - min_x) * (Math.random())));
				rand_y = Math.round(min_y + ((max_y - min_y) * (Math.random())));
				area = {
					x: rand_x,
					y: rand_y,
					width: $(this).width(),
					height: $(this).height()
				};
				var overlap = calc_overlap(area);
				if (smallest_overlap === '') {
					smallest_overlap = overlap
					best_choice = area
				} else if (overlap < smallest_overlap) {
					smallest_overlap = overlap;
					best_choice = area;
				}
				if (overlap === 0) {
					break;
				}
			}

			filled_areas.push(best_choice)
			$(this).css({
				position: "absolute",
				"z-index": index++
			});

			$(this).css({
				left: rand_x,
				top: rand_y
			});
		});
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
var performance_var = 0

// task specific variables
var num_practice_rounds = 2
var num_rounds = 30
var red_fish_num = 0
var total_fish_num = 0
var start_fish_num = 0
var trip_bank = 0
var tournament_bank = 0
var total_points = 0 // used to determine bonus pay
	//each block defines the weather and release law
var blocks = [{
	weather: "晴朗",
	release: "放回"
}, {
	weather: "晴朗",
	release: "保留"
}, {
	weather: "多云",
	release: "放回"
}, {
	weather: "多云",
	release: "保留"
}]
var exp_stage = 'practice'
var practiceblocks = jsPsych.randomization.shuffle(blocks)
var blocks = jsPsych.randomization.shuffle(blocks)
var pay = 1 //payment for one red fish
var last_pay = 0 //variable to hold the last amount of points received
var lake_state = '' //variable for redrawing the board from trial to trial
var trial_num = 0 // global variable to track the number of trials into a round
var round_num = 0 // global variable to track the number of rounds into a tournament
var round_over = 0 //equals 1 if a blue fish is caught or the participant 'collects'
var round_over_text = '' 

//Variables for placing fish
var maxSearchIterations = 100;
var min_x = 0
var max_x = 0
var min_y = 0
var max_y = 0
var filled_areas = [];

var game_setup = "<div class = titlebox><div class = center-text>钓鱼模式: </div></div>" +
	"<div class = lake></div>" +
	"<div class = cooler><p class = info-text>&nbsp<strong>冷藏箱中的红鱼: </strong></p></div>" +
	"<div class = weatherbox><div class = center-text id = weathertext></div></div>" +
	"<div class = infocontainer>" +
	"<div class = subinfocontainer>" +
	"<div class = infobox><p class = info-text id = red_count>&nbsp<strong>湖中红鱼数量: </strong></p></div>" +
	"<div class = infobox><p class = info-text id = blue_count>&nbsp<strong>湖中蓝鱼数量: </strong></p></div>" +
	"</div>" +
	"<div class = subimgcontainer>" +
	"<div class = imgbox></div>" +
	"</div>" +
	"<div class = subinfocontainer>" +
	"<div class = infobox><p class = info-text id = trip_bank><strong>垂钓积分库: </strong></p></div> " +
	"<div class = infobox><p class = info-text id = tournament_bank><strong>锦标赛积分库: </strong></p></div>" +
	"</div>" +
	"</div>" +
	"<div class = buttonbox><button id = 'goFish' class = select-button onclick = goFish()>开始钓鱼</button><button id = 'Collect' class = select-button onclick = collect()>收集积分</button></div>"
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
   questions: ['<p class = center-block-text style = "font-size: 20px">请简要说明你在此任务中需要做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">你对这个任务有任何意见或建议吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var feedback_instruct_text =
	'欢迎参加实验。本实验大约需要25分钟。按 <strong>回车键</strong> 开始。'
var feedback_instruct_block = {
	type: 'poldrack-text',
	cont_key: [13],
	data: {
		trial_id: 'instruction'
	},
	text: getInstructFeedback,
	timing_post_trial: 0,
	timing_response: 180000
};
/// This ensures that the subject does not read through the instructions too quickly.  If they do it too quickly, then we will go over the loop again.
var instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox><p class = block-text>在这个任务中，你将参加一场钓鱼锦标赛。在锦标赛期间，你将进行多轮钓鱼游戏。每一轮，你将看到一个有许多鱼的湖泊。你的目标是尽可能多地钓到鱼。</p><p class = block-text>在屏幕上，你将看到一个湖泊和两个按钮："开始钓鱼"和"收集积分"。如果你点击"开始钓鱼"，你将随机钓到湖中的一条鱼。每条鱼被钓到的概率相等。</p><p class = block-text>湖中有许多红色的鱼和一条蓝色的鱼。每条红鱼为你赢得1分，这些积分会进入本轮的"垂钓积分库"，然后你可以点击"收集积分"将这些积分转移到你的"锦标赛积分库"并开始新的一轮。但是，如果你钓到蓝色的鱼，本轮将结束，你将失去这一轮赢得的所有积分。</p><p class = block-text>要保留你的积分，你必须在钓到蓝鱼之前停止钓鱼并按"收集积分"。</p><p class = block-text>在说明结束后，你将进行 ' + num_practice_rounds + ' 轮钓鱼游戏练习。</p></div>'
	],
	allow_keys: false,
	data: {
		trial_id: 'instruction'
	},
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
				'阅读说明太快了。请花时间确保你理解了说明。按 <strong>回车键</strong> 继续。'
			return true
		} else if (sumInstructTime > instructTimeThresh * 1000) {
			feedback_instruct_text = '说明阅读完毕。按 <strong>回车键</strong> 继续。'
			return false
		}
	}
}

var conditions_instructions_block = {
	type: 'poldrack-instructions',
	pages: [
		'<div class = centerbox><p class = block-text><p class = block-text>你将参加四场锦标赛，每场都有不同的规则。锦标赛之间的一个差异是你是保留还是放回所钓到的鱼。在<span style="color:red">钓后放回</span>条件下，你总是会放回刚钓到的鱼，所以红鱼和蓝鱼的数量在整个回合中保持不变。</p><p class = block-text>在<span style="color:red">钓后保留</span>条件下，你钓到的鱼会从湖中取出放入你的冷藏箱。因此，每钓到一条红鱼，钓到蓝鱼的机会就会增加。</p></div>',
		'<div class = centerbox><p class = block-text><span style="color:blue">天气</span>在不同锦标赛中也会不同。当天气<span style="color:blue">晴朗</span>时，你可以看到湖中有多少条鱼。湖下方还会显示计数器，准确地告诉你湖中还有多少条红鱼和蓝鱼。</p><p class = block-text>当天气<span style="color:blue">多云</span>时，湖水浑浊，你将无法看到任何鱼。计数器也会是空白的。但保留或放回规则仍然适用。如果你在<span style="color:red">钓后放回</span>模式，每次"开始钓鱼"后湖中的鱼数保持不变。如果你在<span style="color:red">钓后保留</span>模式，鱼会从湖中取出。</p></div>',
		'<div class = centerbox><p class = block-text>你将进行四场锦标赛，分别对应<span style="color:blue">天气</span>（晴朗或多云）和<span style="color:red">放回</span>（放回或保留）规则的每一种组合。每场锦标赛都是独立的。你在一场锦标赛中赢得的积分不会影响下一场。你的目标是在所有四场锦标赛中都尽可能取得好成绩。</p><p class = block-text>通过在任务中取得好成绩，你可以获得奖金，所以请尽力最大化你的收益！你的奖金将与你的收益成正比。</p></div>',
		'<div class = centerbox><p class = block-text>在正式开始锦标赛之前，我们将为四场锦标赛各进行一次简短的练习。在每次练习锦标赛开始前，你可以选择湖中鱼的数量（1-200）。在正式实验中，你将无法选择鱼的数量。</p></div>'
	],
	allow_keys: false,
	data: {
		trial_id: 'instruction'
	},
	show_clickable_nav: true,
	timing_post_trial: 1000
};

var end_block = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = center-block-text>感谢你完成这个任务！</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	data: {
		trial_id: "end",
    	exp_id: 'angling_risk_task'
	},
	timing_response: 180000,
	timing_post_trial: 0,
	on_finish: assessPerformance
};

var round_over_block = {
	type: 'poldrack-text',
	text: getRoundOverText,
	cont_key: [13],
	timing_response: 180000,
	data: {
		trial_id: "round_over"
	},
	timing_post_trial: 0,
	on_finish: function() {
		caught_blue = false
		if (round_over_text.indexOf('你钓到了蓝色的鱼！') != -1) {
			caught_blue = true
		}
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage,
			caught_blue: caught_blue,
			weather: weather,
			release: release
		})
	},
};

var update_performance_var_block = {
	type: 'call-function',
	data: {
		trial_id: 'update_performance_var'
	},
	func: function() {
		total_points += tournament_bank
	}
}

var ask_fish_block = {
	type: 'survey-text',
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	},
	data: {
		trial_id: "ask fish"
	},
	questions: [
		[
			"<p class = center-block-text>在这次锦标赛中，湖里有多少条红鱼？请输入1-200之间的数字</p><p class = center-block-text>如果你不回应或输入的数字超出范围，红鱼数量将随机设置为1-200之间。</p>"
		]
	],
}

var set_fish_block = {
	type: 'call-function',
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			exp_stage: exp_stage
		})
	},
	data: {
		trial_id: "set_fish"
	},
	func: function() {
		var last_data = jsPsych.data.getData().slice(-1)[0]
		var last_response = parseInt(last_data.responses.slice(7, 10))
		start_fish_num = last_response + 1
		if (isNaN(start_fish_num) || start_fish_num >= 200 || start_fish_num < 0) {
			start_fish_num = Math.floor(Math.random() * 200) + 1
		}
	},
	timing_post_trial: 0,
}

var practice_block = {
	type: 'single-stim-button',
	stimulus: getGame,
	button_class: 'select-button',
	data: get_practice_data,
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			'pay_on_trial': last_pay
		})
	}
};


var practice_node = {
	timeline: [practice_block],
	loop_function: function(data) {
		if (round_over == 1) {
			return false
		} else {
			return true
		}
	}
}

var game_block = {
	type: 'single-stim-button',
	stimulus: getGame,
	button_class: 'select-button',
	data: get_data,
	timing_post_trial: 0,
	on_finish: function() {
		jsPsych.data.addDataToLastTrial({
			'pay_on_trial': last_pay
		})
	}
};

var game_node = {
	timeline: [game_block],
	loop_function: function(data) {
		if (round_over == 1) {
			return false
		} else {
			return true
		}
	}
}

var start_test_block = {
	type: 'poldrack-text',
	data: {
		trial_id: "test_intro"
	},
	timing_response: 180000,
	text: '<div class = centerbox><p class = center-block-text>练习结束！现在我们开始正式的锦标赛。总共有四场锦标赛，每场都有30轮钓鱼游戏。</p><p class = center-block-text>按 <strong>回车键</strong> 开始测试。</p></div>',
	cont_key: [13],
	timing_post_trial: 1000,
	on_finish: function() {
		tournament_bank = 0
		exp_stage = 'test'
	}
};

//Setup task
angling_risk_task_experiment = []
angling_risk_task_experiment.push(instruction_node)
//Practice basic layout
weather = "晴朗"
release = "保留"
weather_rule = "你可以看到湖中有多少鱼"
release_rule = "你钓到的鱼会从湖中取出"
var tournament_intro_block_practice = {
	type: 'poldrack-text',
	text: '<div class = centerbox><p class = block-text>你现在将开始一场锦标赛。天气是<span style="color:blue">' +
		weather + '</span>，这意味着' + weather_rule +
		'。钓鱼规则是<span style="color:red">' + release + '</span>，这意味着' +
		release_rule +
		'。</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>',
	cont_key: [13],
	timing_response: 180000,
	data: {
		weather: weather,
		release: release,
		exp_stage: "practice",
		trial_id: "intro"
	},
	on_finish: function(data) {
		weather = data.weather
		release = data.release
		tournament_bank = 0
		round_num = 0
	}
}
angling_risk_task_experiment.push(tournament_intro_block_practice)
angling_risk_task_experiment.push(ask_fish_block)
angling_risk_task_experiment.push(set_fish_block)
for (i = 0; i < num_practice_rounds; i++) {
	angling_risk_task_experiment.push(practice_node)
	angling_risk_task_experiment.push(round_over_block)
}



angling_risk_task_experiment.push(conditions_instructions_block)
//practice each condition
for (b = 0; b < practiceblocks.length; b++) {
	block = practiceblocks[b]
	weather = block.weather
	release = block.release
	if (weather == "晴朗") {
		weather_rule = "你可以看到湖中有多少鱼"
	} else {
		weather_rule = "你无法看到湖中有多少鱼"
	}
	if (release == "保留") {
		release_rule = "你钓到的鱼会从湖中取出"
	} else {
		release_rule = "湖中的鱼数量保持不变"
	}
	var tournament_intro_block_practice = {
		type: 'poldrack-text',
		text: '<div class = centerbox><p class = block-text>你现在将开始一场锦标赛。天气是<span style="color:blue">' +
			weather + '</span>，这意味着' + weather_rule +
			'。钓鱼规则是<span style="color:red">' + release + '</span>，这意味着' +
			release_rule +
			'。</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>',
		cont_key: [13],
		timing_response: 180000,
		data: {
			weather: weather,
			release: release,
			exp_stage: "practice",
			trial_id: "intro"
		},
		on_finish: function(data) {
			weather = data.weather
			release = data.release
			tournament_bank = 0
			round_num = 0
		}
	}
	angling_risk_task_experiment.push(tournament_intro_block_practice)
	angling_risk_task_experiment.push(ask_fish_block)
	angling_risk_task_experiment.push(set_fish_block)
	for (i = 0; i < num_practice_rounds; i++) {
		angling_risk_task_experiment.push(practice_node)
		angling_risk_task_experiment.push(round_over_block)
	}
}

angling_risk_task_experiment.push(start_test_block)
for (b = 0; b < blocks.length; b++) {
	block = blocks[b]
	weather = block.weather
	release = block.release
	if (weather == "晴朗") {
		weather_rule = "你可以看到湖中有多少鱼"
	} else {
		weather_rule = "你无法看到湖中有多少鱼"
	}
	if (release == "保留") {
		start_fish_num = 128
		release_rule = "你钓到的鱼会从湖中取出"
	} else {
		start_fish_num = 65
		release_rule = "湖中的鱼数量保持不变"
	}
	var tournament_intro_block = {
		type: 'poldrack-text',
		text: '<div class = centerbox><p class = block-text>你现在将开始一场锦标赛。天气是<span style="color:blue">' +
			weather + '</span>，这意味着' + weather_rule +
			'。钓鱼规则是<span style="color:red">' + release + '</span>，这意味着' +
			release_rule +
			'。</p><p class = center-block-text>按 <strong>回车键</strong> 开始。</p></div>',
		cont_key: [13],
		timing_response: 120000,
		data: {
			weather: weather,
			release: release,
			start_fish_num: start_fish_num,
			trial_id: "intro",
			exp_stage: "test"
		},
		on_finish: function(data) {
			weather = data.weather
			release = data.release
			start_fish_num = data.start_fish_num
			tournament_bank = 0
			round_num = 0
		}
	}
	angling_risk_task_experiment.push(tournament_intro_block)
	for (i = 0; i < num_rounds; i++) {
		angling_risk_task_experiment.push(game_node)
		angling_risk_task_experiment.push(round_over_block)
	}
	if ($.inArray(b, [0, 2]) != -1) {
		angling_risk_task_experiment.push(attention_node)
	}
	angling_risk_task_experiment.push(update_performance_var_block)
}
angling_risk_task_experiment.push(post_task_block)
angling_risk_task_experiment.push(end_block)