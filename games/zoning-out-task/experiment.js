/* ************************************ */
/* Define helper functions */
/* ************************************ */
var getInstructFeedback = function() {
  return '<div class = centerbox><p class = center-block-text>' + feedback_instruct_text + '</p></div>'
}

/* ************************************ */
/* Define experimental variables */
/* ************************************ */
// generic task variables
var sumInstructTime = 0 //ms
var instructTimeThresh = 0 ///in seconds

// task specific variables
var last_page = 16
var pages = []
var furthest_page = 0
var timelimit = 15

/* ************************************ */
/* Set up jsPsych blocks */
/* ************************************ */
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
  data: {
    exp_id: "zoning_out_task",
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
    "<div class = centerbox><p class = block-text>阅读这些说明后，我们希望您花费 " + timelimit + 
    " 分钟，阅读托尔斯泰小说<em>《战争与和平》</em>的一些页面。</p><p class = block-text>请以您正常的阅读速度阅读，如果您需要重新阅读任何内容，可以使用<strong>上一页</strong>和<strong>下一页</strong>按钮。" +
    "实验将在 " + timelimit + '分钟后自动提问你所阅读的内容。' + ' </p>' +
    '<p class=block-text>我们建议您保持直立、放松、舒适的姿势。</p></div>'
  ],
  allow_keys: false,
  show_clickable_nav: true,
  timing_post_trial: 500
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
        '阅读说明过快。请花费时间确保您理解说明。按 <strong>回车键</strong> 继续。'
      return true
    } else if (sumInstructTime > instructTimeThresh * 1000) {
      feedback_instruct_text =
        '说明完成。按 <strong>回车键</strong> 继续。'
      return false
    }
  }
}

// read all of the pages
for (i=0; i <= last_page; i++) {
  // FIXME: http://stackoverflow.com/questions/29315005/synchronous-xmlhttprequest-deprecated/43915786#43915786
  $.ajax({
      url : 'text/' + i + '.html',
      cache: false,
      async: false,
      success : function(result) {
          pages.push(result);
      }
  });
}

var pages_block = {
  type: 'reading',
  data: {
    trial_id: 'text_pages'
  },
  pages: pages,
  allow_keys: true,
  show_clickable_nav: true,
  timing_response: timelimit * 60000,
  timing_post_trial: 500,
  on_finish: function(data) {
    // select answerable questions based on what's been read
    furthest_page = data.furthest_page;
    for (var key in questions) {
      if (furthest_page > key) {
        q.push(questions[key])
      }
    }
  }
};

// Same pseudorandom order for all participants set using following R code
// set.seed(001)
// sample(1:10 >= 5)
// [1] FALSE  TRUE FALSE  TRUE  TRUE  TRUE  TRUE FALSE  TRUE FALSE
//
// Keys are page numbers which contain the answer to associated question
var questions = {
  0: '安娜·帕夫洛夫娜说她一直在受头痛之苦。',
  2: '根据安娜·帕夫洛夫娜所说，英国拒绝撤出马耳他。',
  4: '玛丽·博尔科斯基亚公爵小姐是安娜·帕夫洛夫娜的亲戚。',
  5: '玛丽·博尔科斯基亚公爵小姐被誉为彼得堡最迷人的女人',
  7: '皮埃尔身材肥胖，体格健壮。',
  9: '德恩海恩公爵被谋杀了。',
  10: '海伦公爵小姐穿着一件用苔藓和常春藤装饰的白色连衣裙。',
  12: '皮埃尔是法国人。',
  13: '安德烈·博尔科斯基公爵要上战场了。',
  15: '瓦西里公爵可以很容易地向皇帝提出请求。'
}
var q = [];

// Questions block has to be configured dynamically, _after_ we know how many pages were read
var questions_block = {
  type: 'survey-multi-choice',
  data: {
    trial_id: 'questions'
  },
  questions: function() { return q },
  options:   function() { var o = []; for (i = 0; i < q.length; i++) { o.push(['true','false']) } return o },
  required:  function() { var r = []; for (i = 0; i < q.length; i++) { r.push(true) }; return r }
}

// FYI: dynamic timelines (https://groups.google.com/forum/#!topic/jspsych/iyc5WQoMbQs)

// consent page
// SEE ALSO: poldrack_plugins/jspsych-consent.js
var check_consent = function(elem) {
  if ($('#consent_checkbox').is(':checked')) {
    return true;
  }
  else {
    alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
    return false;
  }
  return false;
};
var consent = {
  type:'html',
  url: "/static/experiments/zoning_out_task/text/consent.html",
  cont_btn: "start",
  check_fn: check_consent
};


/* create experiment definition array */
/* name MUST be of the form {{exp_id}}_experiment  */
var zoning_out_task_experiment = [];
zoning_out_task_experiment.push(instruction_node);
zoning_out_task_experiment.push(pages_block);
zoning_out_task_experiment.push(questions_block);
//zoning_out_task_experiment.push(post_task_block);
zoning_out_task_experiment.push(end_block);