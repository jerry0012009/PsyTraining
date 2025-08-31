// === jsPsych v6 ===
/*
// jsPsych.init({
//     fullscreen: true,
//     on_finish: function (data) {
//         // Serialize the data
//         var promise = new Promise(function (resolve, reject) {
//             var data = jsPsych.data.dataAsJSON();
//             resolve(data);
//         })

//         promise.then(function (data) {
//             sendResults(data);
//         })
//     }

// });
*/
const settings = {
    fullscreen: true,
    on_finish: function (data) {
        // Serialize the data
        var promise = new Promise(function (resolve, reject) {
            var data = jsPsych.data.get().json();
            resolve(data);
        })

        promise.then(function (data) {
            sendResults(data);
        })
    }

}

async function sendResults(data) {
    $.ajax({
        type: "POST",
        url: '/save',
        data: { "data": data },
        success: function () { document.location = "/next" },
        dataType: "application/json",

        // Endpoint not running, local save
        error: function (err) {

            if (err.status == 200) {
                document.location = "/next";
            } else {

                // If error, assue local save
                jsPsych.data.get().localSave('csv', 'berlin_numeracy_test_results.csv');
            }
        }
    });
}


const jsPsych = initJsPsych(settings);
const block_1 = [];
const versionA = [];
const versionB = [];

// randomize order
const number = Math.round(Math.random());
const order = number ? [versionA, versionB] : [versionB, versionA];

const welcome = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ["Enter"],
    stimulus: `<p>欢迎参加实验！在这个任务中，我们将测试您估算几个问题数值答案的能力。
         请按<b>回车键</b>继续查看说明。</p>
    `
}
block_1.push(welcome);

const instructions_1 = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ["Enter"],
    stimulus: `<p>在这个任务中，您将估算4个问题的答案。您将一次看到一个问题，您的任务是对答案进行合理的猜测。</p><p>每个问题都需要用指定单位的数值来回答。一旦您得出一个估计值，请将数字输入到提供的文本框中，然后点击"继续"进入下一个问题。</p><p>再次提醒您，您并不需要知道这些问题的确切答案。我们只要求您做出合理的猜测或给出您的最佳估计。</p><p>当您准备好开始时，请按<b>回车键</b>。</p>
    `
}
block_1.push(instructions_1);





const question1A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>想象我们投掷一个五面骰子50次。平均而言，在这个50次投掷中，这个五面骰子有多少次会显示奇数（1、3或5）？</p>
    <p></p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  次（怲50次投掷中）</p > ',
    autofocus: 'test-resp-box'
}
versionA.push(question1A);


const question2A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>在一个小镇的1000人中，有500人是合唱团成员。在这500个合唱团成员中，有100人是男性。<br>
在不是合唱团成员的500人中，有300人是男性。<br>
随机抽取一个男性是合唱团成员的概率是多少？<br>
（请用百分比表示概率）。</p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  &#37;</p>',
    autofocus: 'test-resp-box'
}
versionA.push(question2A);


const question3A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>

        想象我们投掷一个加权的骰子（6面）。<br>
         骰子显示6的概率是其他每个数字概率的两倍。<br>
         平均而言，在这70次投掷中，骰子显示数字6的次数是多少？
        
        </p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  次（怲70次投掷中）</p>',
    autofocus: 'test-resp-box'
}
versionA.push(question3A);


const question4A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>

        在一个森林中，20%的蘑菇是红色的，50%是棕色的，30%是白色的。<br>
         红色蘑菇有毒的概率是20%。<br>
          非红色蘑菇有毒的概率是5%。<br>
          森林中一个有毒蘑菇是红色的概率是多少？

        </p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  &#37; </p>',
    autofocus: 'test-resp-box'
}
versionA.push(question4A);

// Version B Questions (Chinese translations)
const question1B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>想象我们从一副标准扑克牌中抽取20张牌。平均而言，在这20张牌中，有多少张会是红色的（红心或方块）？</p>
    <p></p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  张（共20张牌中）</p>',
    autofocus: 'test-resp-box'
}
versionB.push(question1B);

const question2B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>在一所大学的2000名学生中，有800名学生学习数学专业。在这800名数学专业学生中，有200名是女性。<br>
在不学数学专业的1200名学生中，有600名是女性。<br>
随机抽取一名女学生是数学专业学生的概率是多少？<br>
（请用百分比表示概率）。</p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  &#37;</p>',
    autofocus: 'test-resp-box'
}
versionB.push(question2B);

const question3B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>

        想象我们有一个不公平的硬币。<br>
         这枚硬币显示正面的概率是反面概率的三倍。<br>
         平均而言，在80次投掷中，硬币显示正面的次数是多少？
        
        </p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  次（共80次投掷中）</p>',
    autofocus: 'test-resp-box'
}
versionB.push(question3B);

const question4B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>

        在一个城市中，30%的出租车是蓝色的，70%是绿色的。<br>
         蓝色出租车发生事故的概率是15%。<br>
          绿色出租车发生事故的概率是5%。<br>
          如果一辆出租车发生了事故，它是蓝色出租车的概率是多少？

        </p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  &#37; </p>',
    autofocus: 'test-resp-box'
}
versionB.push(question4B);

const timeline = block_1.concat(order[0]);
jsPsych.run(timeline);