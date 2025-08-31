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
    stimulus: `<p>Welcome to the experiment! In this task, we will be testing you ability to estimate the numerical answers of several questions.
         Press the <b>ENTER</b> key to continue on to the instructions.</p>
    `
}
block_1.push(welcome);

const instructions_1 = {
    type: jsPsychHtmlKeyboardResponse,
    choices: ["Enter"],
    stimulus: `<p>In this task, you will be estimating the answers to 9 questions. You will see one question at a time and your job is to
        make a reasonable guess as to what the answer is.</p><p> Each question requires a numerical response in the units that are specified.
        Once you have come up with an estimate, please type the number into the textbox provided and click "continue" to move on to the 
        next question.</p><p>Once again, just a reminder that you are NOT expected to know the exact answer to these questions. We only ask that
        you make a reasonable guess or give your best estimate.</p><p>When you are ready to begin, press the <b>ENTER</b> key.</p>
    `
}
block_1.push(instructions_1);





const question1A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>Imagine we are throwing a five-sided die 50 times. On average, out of these 50 throws how many times would this five-sided die show an odd number (1, 3 or 5)?</p>
    <p></p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  out of 50 throws</p > ',
    autofocus: 'test-resp-box'
}
versionA.push(question1A);


const question2A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>Out of 1,000 people in a small town 500 are members of a choir. Out of these 500
members in the choir 100 are men. <br>
Out of the 500 inhabitants that are not in the choir 300 are men.<br>
 What is the probability that a randomly drawn man is a member of the choir?<br>
 (please indicate the probability in percent).</p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  &#37;</p>',
    autofocus: 'test-resp-box'
}
versionA.push(question2A);


const question3A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>

        Imagine we are throwing a loaded die (6 sides). <br>
         The probability that the die shows a 6 is twice as high as the probability of each of the other numbers. <br>
         On average, out of these 70 throws, how many times would the die show the number 6?
        
        </p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  out of 70 throws.</p>',
    autofocus: 'test-resp-box'
}
versionA.push(question3A);


const question4A = {
    type: jsPsychSurveyHtmlForm,
    preamble: `<p>

        In a forest 20% of mushrooms are red, 50% brown and 30% white.<br>
         A red mushroom is poisonous with a probability of 20%.<br>
          A mushroom that is not red is poisonous with a probability of 5%.<br>
          What is the probability that a poisonous mushroom in the forest is red?

        </p>`,
    html: '<p id="input"><input type="number" id="test-resp-box" name="response" size="5" required/>  &#37; </p>',
    autofocus: 'test-resp-box'
}
versionA.push(question4A);




const timeline = block_1.concat(versionA);
jsPsych.run(timeline);