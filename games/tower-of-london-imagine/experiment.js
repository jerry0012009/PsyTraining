/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getStim = function() {
  var response_area = '<div class = tol_response_div>' +
    '<button class = tol_response_button id = 1>1</button>' +
    '<button class = tol_response_button id = 2>2</button>' +
    '<button class = tol_response_button id = 3>3</button>' +
    '<button class = tol_response_button id = 4>4</button>' +
    '<button class = tol_response_button id = 5>5</button>' +
    '<button class = tol_response_button id = 6>6</button>' +
    '<button class = tol_response_button id = 7>7</button>' +
    '<button class = tol_response_button id = 8>8</button>' +
    '<button class = tol_response_button id = 9>9</button>' +
    '<button class = tol_response_button id = ">10">>10</button></div>'
  return ref_board + makeBoard('peg_board', problems[problem_i]) + response_area
}

var makeBoard = function(container, ball_placement) {
  var board = '<div class = tol_' + container + '><div class = tol_base></div>'
  if (container == 'reference_board') {
    board += '<div class = tol_peg_label><strong>参考棋盘</strong></div>'
  } else {
    board += '<div class = tol_peg_label><strong>目标棋盘</strong></div>'
  }
  for (var p = 0; p < 3; p++) {
    board += '<div class = tol_peg_' + (p + 1) + '><div class = tol_peg></div></div>' //place peg
      //place balls
    board += '<div class = tol_peg_' + (p + 1) + '>'
    var peg = ball_placement[p]
    for (var b = 0; b < peg.length; b++) {
      if (peg[b] !== 0) {
        ball = colors[peg[b] - 1]
        board += '<div class = "tol_ball tol_' + ball + '"><div class = tol_ball_label>' + ball[0] +
          '</div></div>'
      }
    }
    board += '</div>'
  }
  board += '</div>'
  return board
}

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
var colors = ['绿色', '红色', '蓝色']
var problem_i = 0
  /*keeps track of peg board (where balls are). Lowest ball is the first value for each peg.
  So the initial_placement has the 1st ball and 2nd ball on the first peg and the third ball on the 2nd peg.
  */
  // make reference board
var initial_placement = [
  [1, 2, 0],
  [3, 0],
  [0]
]
var ref_board = makeBoard('reference_board', initial_placement)
var example_problem1 = [
  [1, 2, 0],
  [0, 0],
  [3]
]
var example_problem2 = [
  [1, 0, 0],
  [3, 0],
  [2]
]

var problems = [
  [
    [0, 0, 0],
    [3, 1],
    [2]
  ],
  [
    [1, 0, 0],
    [2, 0],
    [3]
  ],
  [
    [1, 3, 0],
    [2, 0],
    [0]
  ],
  [
    [1, 0, 0],
    [2, 3],
    [0]
  ],
  [
    [2, 1, 0],
    [3, 0],
    [0]
  ],
  [
    [3, 0, 0],
    [2, 1],
    [0]
  ],
  [
    [2, 3, 0],
    [0, 0],
    [1]
  ],
  [
    [0, 0, 0],
    [2, 3],
    [1]
  ],
  [
    [2, 1, 3],
    [0, 0],
    [0]
  ],
  [
    [2, 3, 1],
    [0, 0],
    [0]
  ],
  [
    [3, 1, 0],
    [2, 0],
    [0]
  ],
  [
    [3, 0, 0],
    [2, 0],
    [1]
  ]
]
var answers = [2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
//Set up post task questionnaire
var post_task_block = {
   type: 'survey-text',
   data: {
       trial_id: "post task questions"
   },
   questions: ['<p class = center-block-text style = "font-size: 20px">请总结一下您在此任务中被要求做什么。</p>',
              '<p class = center-block-text style = "font-size: 20px">您对此任务有什么评论吗？</p>'],
   rows: [15, 15],
   columns: [60,60]
};

/* define static blocks */
var end_block = {
  type: 'poldrack-text',
  data: {
    exp_id: 'tower_of_london_imagine',
    trial_id: 'end'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = center-block-text>感谢您完成此任务！</p><p class = center-block-text>按 <strong>回车键</strong> 继续。</p></div>',
  cont_key: [13],
  timing_post_trial: 0
};


var feedback_instruct_text =
  '欢迎来到实验。按 <strong>回车键</strong> 开始。'
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
    '<div class = tol_topbox><p class = block-text>在此任务中，一次将展示两幅图片。图片将显示在木铉上排列的彩色球，就像这样：</p></div>' +
    ref_board + makeBoard('peg_board', example_problem1) +
    '<div class = tol_bottombox><p class = block-text>想象这些球中间有孔，木铉穿过这些孔。请注意，第一根木铉可以放三个球，第二根木铉可以放两个球，第三根木铉可以放一个球。</p></div>',
    '<div class = tol_topbox><p class = block-text>您的任务是计算需要多少步移动才能让参考图片中的球排列变成目标图片中的排列。</p></div>' +
    ref_board + makeBoard('peg_board', example_problem1) +
    '<div class = tol_bottombox><p class = block-text>想象目标图片中的球是固定不动的，但参考图片中的球是可以移动的。您需要移动参考图片中的球，使其看起来像目标图片。当您将一个球从一根木铉移动到另一根木铉时，这被认为是一步移动。您一次只能移动一个球。有时为了取到下面的球，您可能需要先将一个球移动到不同的木铉上。在此任务中，重要的是记住，您要想象的是让参考图片变成目标图片所需的<strong>最少步数</strong>。您有 20 秒的时间做决定。</p></div>',
    '<div class = tol_topbox><p class = block-text>这里是一个例子。注意参考图片中的球排列与目标图片不同。如果我们将参考图片中的红色球从第一根木铉移动到第三根木铉，那么它就会看起来像目标图片。</p></div>' +
    ref_board + makeBoard('peg_board', example_problem2) +
    '<div class = tol_bottombox><p class = block-text>我们只移动了一个球一次，所以答案是一步移动。在测试过程中，您将使用屏幕上的按钮输入您的答案。</p></div>'
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
        '您阅读说明的速度太快了。请放慢速度，确保您理解说明。按 <strong>回车键</strong> 继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '说明阅读完毕。按 <strong>回车键</strong> 继续。'
      return false
    }
  }
}



var start_test_block = {
  type: 'poldrack-text',
  data: {
    trial_id: 'test_intro'
  },
  timing_response: 180000,
  text: '<div class = centerbox><p class = block-text>我们现在开始测试。将有 ' +
    problems.length + ' 道题需要完成。按 <strong>回车键</strong> 开始。</p></div>',
  cont_key: [13],
  timing_post_trial: 1000
};


/* define test block */
var test_block = {
  type: 'single-stim-button',
  data: {
    trial_id: 'stim',
    exp_stage: 'test'
  },
  stimulus: getStim,
  button_class: 'tol_response_button',
  timing_stim: 20000,
  timing_response: 20000,
  timing_post_trial: 1000,
  on_finish: function() {
    jsPsych.data.addDataToLastTrial({
      'problem': problems[problem_i],
      'answer': answers[problem_i]
    })
    problem_i += 1
  }
};

/* create experiment definition array */
var tower_of_london_imagine_experiment = [];
tower_of_london_imagine_experiment.push(instruction_node);
tower_of_london_imagine_experiment.push(start_test_block);
for (var i = 0; i < problems.length; i++) {
  tower_of_london_imagine_experiment.push(test_block);
}
tower_of_london_imagine_experiment.push(post_task_block)
tower_of_london_imagine_experiment.push(end_block);