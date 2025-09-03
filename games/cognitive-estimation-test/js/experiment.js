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

const jsPsych = initJsPsych(settings);
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
                jsPsych.data.get().localSave('csv', 'cognitive-estimation-test.csv');
            }
        }
    });
}

const block_1 = [];
const versionA = [];
const versionB = [];

// randomize order
const number = Math.round(Math.random());
const order = number ? [versionA, versionB] : [versionB, versionA];

const welcome = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ["Enter"],
    stimulus: `<p class="h3">欢迎参加实验！ </p>
     <p class="h3">
     在这个任务中，我们将测试您对几个问题的数字答案的估计能力。
     </p>
     <p class="h3">      
     按 ENTER 继续查看指导。</p>
        `
}
block_1.push(welcome);

const instructions_1 = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ["Enter"],
    stimulus: `<p class="h3">在这个任务中，您将估计9个问题的答案。您将一次看到一个问题，您的任务是
            对答案做出合理的猜测。</p><p class="h3"> 每个问题都需要以指定单位给出数值答案。
            一旦您得出估计，请将数字输入到提供的文本框中，然后点击“继续”进入下一个
            问题。</p><p class="h3">再次提醒，您不需要知道这些问题的确切答案。我们只要求您
            做出合理的猜测或给出您的最佳估计。</p><p class="h3">当您准备好开始时，请按 ENTER。</p>
        `
}
block_1.push(instructions_1);


const question1A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">哈雷戴维森摩托车的最高速度是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}

versionA.push(question1A);


const question2A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">平均新生儿的身长是多少？（单位：厘米）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}

versionA.push(question2A);

const question3A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">赛马的跑速是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionA.push(question3A);


const question4A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">平均慢跑速度是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionA.push(question4A);


const question5A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">一个橙子有多少瓣？</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionA.push(question5A);


const question6A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">一支新铅笔的长度是多少？（单位：厘米）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionA.push(question6A);


const question7A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">猎豹的最高速度是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionA.push(question7A);


const question8A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">一辆男式普通山地自行车的长度是多少？（单位：米）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionA.push(question8A);


const question9A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">标准电脑键盘有多少个键？</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionA.push(question9A);


const question1B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">典型健康成年男子的平均步行速度是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}

versionB.push(question1B);


const question2B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">一条普通领带的长度是多少？（单位：厘米）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question2B);


const question3B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">最快的网球发球速度是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question3B);


const question4B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">标准钢琴有多少个键？</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question4B);


const question5B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">您所在国家最年长的人多少岁？</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question5B);


const question6B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">成年男子的平均脊柱长度是多少？（单位：厘米）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question6B);


const question7B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">骑行者的最大速度是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question7B);


const question8B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">一台竖琴有多少根弦？</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question8B);


const question9B = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p class="h3">一级方程式赛车的最高速度是多少？（单位：公里/小时）</p><p class="h3">请仅用数字回答</p>`,
    html: '<p class="h3"><input type="number" id="test-resp-box" name="response" size="10" required/></p>',
    autofocus: 'test-resp-box'
}
versionB.push(question9B);

const ending = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ["Enter"],
    stimulus: `
    <p class="h3">
    感谢您参与本次研究。
    </p>
    <p class="h3">
    按 ENTER 退出此调查。
    </p>
        `
}


const timeline = block_1.concat(order[0]);
timeline.push(ending);
jsPsych.run(timeline);
