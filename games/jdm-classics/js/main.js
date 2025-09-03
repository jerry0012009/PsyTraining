function handleEnter(event) {
    const keyName = event.key;
    if (keyName == "Enter") {
        document.removeEventListener("keypress", handleEnter);
        renderInstructions();
    }
}
document.addEventListener('keypress', handleEnter, false);


function renderInstructions() {
    BODY.innerHTML = `<p class="h2">您将估算 6 个问题的答案。
     您一次只能看到一个问题，您的任务是
            对答案做出合理的猜测。</p>
    <p class="h2">点击 <b>下一页</b> 结束说明。</p>
    <div class="d-flex flex-column align-items-center">
    <button class="btn btn-primary px-4" onclick="renderQ1();">下一页</button>
    </div>
    `;
}

function renderQ1() {
    let options;
    if (RESULTS.version == 'A') {
        options = [
            `琳达31岁，单身，直言不讳，非常聪明。她主修哲学。作为一名学生，她非常
        关注歧视和社会公正问题，还参加了反核武器示威活动。`, `琳达积极参与女权主义运动。`, `琳达是一名银行出纳员。`,
            `琳达是一名银行出纳员，同时
    积极参与女权主义运动。`, `琳达在书店工作并上瑜伽课。`, `琳达是一名保险销售员。`
        ]
    } else {
        options = [
            `比尀34岁。他很聪明，但缺乏想象力，强迫性格，总体上毫无生气。在学校里，他数学成绩很好，但社会研究和人文学科较弱。`,
            `比尔是一名会计师。`,
            `比尔把打爵士乐作为爱好。`,
            `比尔是一名会计师，把打爵士乐作为爱好。`,
            `比尔把冲浪作为爱好。`,
            `比尔是一名建筑师。`,
        ]
    }
    BODY.innerHTML = `
    <p class="h3">${options[0]}</p>
<p class="h3">请按真实性的可能性对以下五个陈述进行排序。</p>
</p>
<p class="h4 mb-4"> (1 = 最可能, 5 = 最不可能) </p>
<div class="row h5" id="a">
    <label class="">(a) ${options[1]}</label>

<div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="a1" value="1">
            <label class="form-check-label" for="a1">1</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="a2" value="2">
            <label class="form-check-label" for="a2">2</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="a3" value="3">
            <label class="form-check-label" for="a3">3</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="a3" value="4">
            <label class="form-check-label" for="a4">4</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="inlineRadioOptions" id="a3" value="5">
            <label class="form-check-label" for="a5">5</label>
        </div>
</div>


</div>


<div class="row h5" id="b">
    <label for="">(b) ${options[2]}</label>

<div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="b" id="a1" value="1">
            <label class="form-check-label" for="a1">1</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="b" id="a2" value="2">
            <label class="form-check-label" for="a2">2</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="b" id="a3" value="3">
            <label class="form-check-label" for="a3">3</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="b" id="a3" value="4">
            <label class="form-check-label" for="a4">4</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="b" id="a3" value="5">
            <label class="form-check-label" for="a5">5</label>
        </div>
</div>

</div>

<div class="row h5" id="c">
    <label for="">(c) ${options[3]}</label>

    <div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="cc" id="a1" value="1">
            <label class="form-check-label" for="a1">1</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="cc" id="a2" value="2">
            <label class="form-check-label" for="a2">2</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="cc" id="a3" value="3">
            <label class="form-check-label" for="a3">3</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="cc" id="a3" value="4">
            <label class="form-check-label" for="a4">4</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="cc" id="a3" value="5">
            <label class="form-check-label" for="a5">5</label>
        </div>
    </div>

</div>

<div class="row h5" id="d">
    <label for="">(d) ${options[4]}</label>

    <div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="dd" id="a1" value="1">
            <label class="form-check-label" for="a1">1</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="dd" id="a2" value="2">
            <label class="form-check-label" for="a2">2</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="dd" id="a3" value="3">
            <label class="form-check-label" for="a3">3</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="dd" id="a3" value="4">
            <label class="form-check-label" for="a4">4</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="dd" id="a3" value="5">
            <label class="form-check-label" for="a5">5</label>
        </div>
    </div>

</div>


<div class="row h5" id="e">
    <label for="">(e) ${options[5]}

    </label>

    <div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="ee" id="a1" value="1">
            <label class="form-check-label" for="a1">1</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="ee" id="a2" value="2">
            <label class="form-check-label" for="a2">2</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="ee" id="a3" value="3">
            <label class="form-check-label" for="a3">3</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="ee" id="a3" value="4">
            <label class="form-check-label" for="a4">4</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="ee" id="a3" value="5">
            <label class="form-check-label" for="a5">5</label>
        </div>
    </div>

</div>




<div class="d-flex flex-column align-items-center">
<button class="btn btn-primary px-4 mt-3" onclick="renderQ2();">下一页</button>
</div>
`
}
function getCheckedRadio(fieldId) {
    const field = document.getElementById(fieldId);
    const children = field.children;
    let checked = 0;
    const array = [...children[1].children]
    array.forEach(item => {
        let radioChildren = item.children;
        let radioArray = [...radioChildren];
        radioArray.forEach(item => {
            if (item.checked) {
                checked = item.value;
            }
        });
    });
    return [checked, fieldId];
}

function validateRadio(fields) {
    const dict = {};
    let checked;
    for (let i = 0; i < fields.length; i++) {
        checked = getCheckedRadio(fields[i]);
        if (checked[0] == 0) {
            return alert("无效回答：\n您必须对所有选项进行排序。")
        } else if (checked[0] in dict) {
            return alert("无效回答：\n您的排序中不能有重复项。");
        } else {
            dict[checked[0]] = checked[1];
        }


    }
    return dict;
}
function renderQ2() {
    const result = validateRadio(['a', 'b', 'c', 'd', 'e']);
    if (!result) {
        return;
    }
    RESULTS['q1'] = result;
    if (!IS_PRODUCTION) {
        console.dir(RESULTS);
    }
    let options;
    let text;
    if (RESULTS.version == 'A') {
        text = [
            `考虑以下假设情况：一副10张牌被随机洗牌10次。这10张牌中，7张牌的背面是数字"1"，3张牌的背面是数字"2"。每次重新洗牌后，您的任务是预测顶层牌背面的数字。想象一下，您每次正确预测一个背面数字可以得到100美元，而且您希望尽可能多地赚钱。`,
            `洗牌`,
        ]
        options = [1, 2]
    } else {
        text = [
            `一个装着弹珠的罐子里放着20个弹珠。其中14个弹珠是红色的，6个弹珠是蓝色的。您一次只取一个弹珠，记录其颜色，然后放回罐子里。因此，罐子里总是有同样的20个弹珠，只是按新的顺序混合在一起。罐子是不透明的材料，所以您无法看到随机选取的弹珠颜色。
            您的工作是每次取出弹珠时猜测正确的颜色。想象一下您一次取一个，连续取10个弹珠（每次都把取出的弹珠放回罐子并混合）。
            您对每次抽取都会做什么猜测？`,
            `抽取`
        ]
        options = ['蓝色', '红色'];
    }

    let html = `<p class="h3">${text[0]}</p>`;
    for (let i = 1; i < 11; i++) {
        html += `
        <div class="row h5" id="${i}">
    <label class="">在第 ${i} 次${text[1]}后您会预测什么？</label>

<div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="two${i}" id="a1" value="${options[0]}">
            <label class="form-check-label" for="a1">${options[0]}</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="two${i}" id="a2" value="${options[1]}">
            <label class="form-check-label" for="a2">${options[1]}</label>
        </div>
</div>

</div>
        `
    }
    html += `<div class="d-flex flex-column align-items-center">
    <button class="btn btn-primary px-4 mt-3" onclick="renderQ3();">下一页</button>
    </div>
    `
    BODY.innerHTML = html;
}

function validateQ2(fields) {
    const dict = {};
    let checked;
    for (let i = 0; i < fields.length; i++) {
        checked = getCheckedRadio(fields[i]);
        if (checked[0] == 0) {
            return alert("无效回答：\n您必须填写所有选项。")
        } else {
            dict[checked[1]] = checked[0];
        }


    }
    return dict;
}

function renderQ3() {
    // === save q2 data ===
    const result = validateQ2([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    if (!result) {
        return;
    }
    RESULTS['q2'] = result;
    console.dir(RESULTS);

    // === render q3 === 
    let text;
    let options;
    if (RESULTS.version == 'A') {
        text = [
            `Imagine that there will be a deadly flu going around your area next winter. Your doctor says that you have a 10% chance (10 out of 100) of dying from this flu. However, a new flu vaccine has
            been developed and tested. If taken, the vaccine prevents you from catching the deadly flu. However, there is one serious risk involved with taking this vaccine. The vaccine is made from a somewhat weaker type of flu virus, and there is a 5% (5 out of 100) risk of the vaccine causing you to die from the weaker type of flu. Imagine that this vaccine is completely covered by health insurance.`,

        ]
        options = [
            `I should definitely not take the vaccine. I would thus accept the 10% chance of dying from this flu.`,
            `I should definitely take the vaccine. I would thus accept the 5% chance of dying from the weaker flu in the vaccine.`,
            `I do not know.`
        ]
    } else {
        text = [
            `Imagine you are spending Sunday in the house with your dog. Your dog seems to be sick – she’s lethargic and won’t eat. You have pet insurance and you take the dog to your veterinarian. The vet diagnoses your dog with a bacterial infection and says that the infection has a 10% chance of killing her. The vet also says that there is an antibiotic available that is covered by your insurance that will cure the infection, but has one serious side effect: it causes a fatal heart attack in 5% of dogs who take the medicine.`,

        ]
        options = [
            `I should definitely not give my dog the antibiotic. I would thus accept the 10% chance of the dog dying from this infection.`,
            `I should definitely give my dog the antibiotic. I would thus accept the 5% chance of the dog dying from the antibiotic.`,
            `I do not know.`
        ];
    }

    BODY.innerHTML = `
    
    <p class="h3">${text[0]}</p>
<p class="h3">If you had to decide now, which would you choose?</p>
</p>

<div class="row h5" id="q3">
    <label class=""></label>
    <div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="aa" id="a1" value="no">
            <label class="form-check-label" for="a1">${options[0]}</label>
        </div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="aa" id="a2" value="yes">
            <label class="form-check-label" for="a2">${options[1]}</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="aa" id="a3" value="idk">
            <label class="form-check-label" for="a3">${options[2]}</label>
        </div>

    </div>
    </div>
    <div class="d-flex flex-column align-items-center">
    <button class="btn btn-primary px-4 mt-3" onclick="renderQ4();">Next</button>
</div>

    
    `
}
function validateQ3(fieldIds) {
    const dict = {};
    let checked;
    for (let i = 0; i < fieldIds.length; i++) {
        checked = getCheckedRadio(fieldIds[i]);
        if (checked[0] == 0) {
            return alert("无效回答：\n您必须填写所有选项。")
        } else {
            dict[checked[1]] = checked[0];
        }


    }
    // console.log(dict);
    return dict;

}
function renderQ4() {
    // === save q3 data ===
    const result = validateQ3(['q3']);
    if (!result) {
        return;
    }
    RESULTS['q3'] = result;
    // console.dir(RESULTS);

    // === render q4 ===
    let text;
    let options;
    if (RESULTS.version == 'A') {
        text = [
            `A panel of psychologists has interviewed and administered personality tests to a large population of engineers and lawyers, all successful in their respective fields. On the basis of this information, thumbnail descriptions of the engineers and lawyers have been written. The population consists of 10% engineers and 90% lawyers. Below is a description, chosen at random from the available descriptions.
            Sam is a 30-year-old man. He is married with no children. A man of high ability and high motivation, he promises to be quite successful in his field. He is well-liked by his colleagues.
            How likely is it that Sam is an engineer?`,
        ]

    } else {
        text = [
            `
A college dormitory has 90% of students who are majoring in the social sciences (e.g., psychology or economics) and 10% who are majoring in the humanities (e.g., history). You are reviewing short bios that different students have written as part of a graduation activity. You draw one bio at random. The bio reads:
“I am from a suburb of a major city. My high school had about 500 kids. I have a younger brother. I like hanging out with my friends and watching movies.”
How likely is it that this student is a humanities major?
`
        ]

    }

    BODY.innerHTML = `
    
    <p class="h3">${text[0]}</p>
</p>

<div class="row h5" id="q4">
    <label>Choose the option that you think is closest to the true probability.</label>
    <div class="form-control">
        <select id="val" name="probability" required>
            <option value="">--Please choose an option--</option>
            <option value="0">0</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value="25">25</option>
            <option value="30">30</option>
            <option value="35">35</option>
            <option value="40">40</option>
            <option value="45">45</option>
            <option value="50">50</option>
            <option value="55">55</option>
            <option value="60">60</option>
            <option value="65">65</option>
            <option value="70">70</option>
            <option value="75">75</option>
            <option value="80">80</option>
            <option value="85">85</option>
            <option value="90">90</option>
            <option value="95">95</option>
            <option value="100">100</option>
        </select>
    </div>


</div>
<div class="d-flex flex-column align-items-center">
<button class="d-flex flex-column align-items-center" class="btn btn-primary px-4 mt-3" onclick="renderQ5();">Next</button>
</div>

    `
}
function validateQ4() {
    const val = document.getElementById("val");
    return val.value;
}

function renderQ5() {
    // === save q4 data ===
    const result = validateQ4();
    if (!result) {
        return;
    }
    RESULTS['q4'] = { 'q4': result };
    // console.dir(RESULTS);


    // === render q5 ===
    let text;
    let options;
    if (RESULTS.version == 'A') {
        text = [
            `Imagine that you are presented with three bowls of Halloween candy. Each bowl contains both your favorite and least favorite kind of candy.
            You must draw out one piece of candy (without peeking, of course) from a bowl.
<p class="h3">Bowl 1 has 100 pieces of candy</p>
<p class="h3">Bowl 2 has 50 pieces of candy</p>
<p class="h3">Bowl 3 has 10 pieces of candy</p>

<p class="h3">Your favorite candy has been distributed in the 3 bowls in the following way:</p>

<p class="h3"><b>Bowl 1</b> : 12 of your favorite candy, 88 of your least favorite candy
</p class="h3">
<p class="h3"><b>Bowl 2</b> : 6 of your favorite candy, 44 of your least favorite candy</p>

<p class="h3"><b>Bowl 3</b> : 2 of your favorite candy, 8 of your least favorite candy
</p>
            `, `If you had to choose, what bowl would you choose to draw from?`
        ]
        options = [
            "Bowl", "Bowl", "Bowl"
        ]

    } else {
        text = [
            `
            Imagine that you are presented with three trays of black and white marbles. 
            The marbles are spread in a single layer in each tray. You must draw out one marble 
            (without peeking, of course) from a tray. If you draw a black marble you win $2.
            <p class="h3">Tray 1 has 50 marbles</p>
            <p class="h3">Tray 2 has 25 marbles</p>
            <p class="h3">Tray 3 has 10 marbles</p>
            
            <p class="h3">The black marbles have been distributed in the 3 trays in the following way:</p>
            
            <p class="h3"><b>Tray 1</b>: 4 black marbles, 46 white marbles
            </p>
            <p class="h3"><b>Tray 2</b>: 2 black marbles, 23 white marbles</p>
            
            <p class="h3"><b>Tray 3</b>: 1 black marble, 9 white marbles
            </p>            
            `, `Recall that if you draw a black marble you win 2 dollars. If you had to choose, what tray would you choose to draw from?`
        ]
        options = [
            "Tray", "Tray", "Tray"
        ]

    }

    BODY.innerHTML = `
     
     <p class="h3">${text[0]}</p>
 </p>
 
 <div class="row h5" id="q5">
    <label class="">${text[1]}</label>
    <div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="aa" id="a1" value="1">
            <label class="form-check-label" for="a1">${options[0]} 1</label>
        </div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="aa" id="a2" value="2">
            <label class="form-check-label" for="a2">${options[1]} 2</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="aa" id="a3" value="3">
            <label class="form-check-label" for="a3">${options[2]} 3</label>
        </div>

    </div>
    </div>
    <div class="d-flex flex-column align-items-center" >
     <button class="btn btn-primary px-4 mt-3" onclick="renderQ6();">Next</button>
</div>

 
     `
}

function renderQ6() {
    // === save q5 data ===
    const result = validateQ3(['q5']);
    if (!result) {
        return;
    }
    RESULTS['q5'] = { "q5": result };
    // console.dir(RESULTS);


    // === render q6 ===
    let text;
    let options;
    if (RESULTS.version == 'A') {
        text = [
            `  Imagine that you are a research chemist for a pharmaceutical company. You want to assess how well a certain experimental drug works to reduce obesity. In order to do so, you will study 100 laboratory rats that are obese. In your experiment, you will give some rats the drug and others a placebo, which is known to have no effect on obesity. After the experiment, there will be four types of rats:

            <p class="h3">1. Those who received the drug and whose obesity was reduced.
</p>
            <p class="h3">2. Those who received the drug and whose obesity was not reduced.
</p>
            <p class="h3">3. Those who did not receive the drug and whose obesity was reduced.
</p>
            <p class="h3">4. Those who did not receive the drug and whose obesity was not reduced.
</p>
            `, `Remember, you want to assess how well a certain experimental drug works to reduce obesity. To evaluate the effectiveness of the drug, which of these types of rat do you need to observe?`
        ]
        options = [
            "Just 1", "1 and 3", "1 and 2", "1, 2, and 3", "All of them"
        ]

    } else {
        text = [
            `
            Steve is a professional baseball player. Thirty percent of baseball games are played during the day. Seventy percent are played at night. Steve thinks he is a better hitter at night. He wants to test whether this is true. There are four kinds of data to look up.

            <p class="h3">1. How many hits he has in night games.
</p>
            <p class="h3">2. How many times he has batted in night games.
</p>
            <p class="h3">3. How many hits he has in day games.
</p>
            <p class="h3">4. How many times he has batted in day games.
</p>

            `, `Which kind of data does he need to know to test whether he is a better hitter at night?`
        ]
        options = [
            "Just 1", "1 and 3", "1 and 2", "1, 2, and 3", "All of them"
        ]

    }

    BODY.innerHTML = `
     
     <p class="h3">${text[0]}</p>
 </p>
 
 <div class="row h5" id="q6">
    <label class="">${text[1]}</label>
    <div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="aa" id="a1" value="[1]">
            <label class="form-check-label" for="a1">${options[0]}</label>
        </div>
        <div class="form-check form-check-inline mb-3">
            <input class="form-check-input" type="radio" name="aa" id="a2" value="[1,3]">
            <label class="form-check-label" for="a2">${options[1]}</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="aa" id="a3" value="[1, 2]">
            <label class="form-check-label" for="a3">${options[2]}</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="aa" id="a3" value="[1, 2, 3]">
            <label class="form-check-label" for="a3">${options[3]}</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="aa" id="a3" value="[1, 2, 3, 4]">
            <label class="form-check-label" for="a3">${options[4]}</label>
        </div>
    </div>
</div>
    <div class="d-flex flex-column align-items-center">
<button class="btn btn-primary px-4 mt-3" onclick="finish();">Next</button>
</div>

 
     `
}


// how to save final result, I think:
async function sendResults(results) {
    if (IS_PRODUCTION) {
        $.ajax({
            type: "POST",
            url: '/save',
            data: results,
            success: function () { document.location = "/next" },
            dataType: "application/json",

            // Endpoint not running, local save
            error: function (err) {

                if (err.status == 200) {
                    document.location = "/next";
                } else {

                    // If error, print.
                    console.log("results===>\n", results);
                }
            }
        });
    } else {
        console.log("===done===>", results);
    }

}



function finish() {
    // === save q6 data ===
    const result = validateQ3(['q6']);
    if (!result) {
        return;
    }
    RESULTS['q6'] = { "q6": result };
    if (IS_PRODUCTION) {
        sendResults(RESULTS);
    } else {
        console.dir(RESULTS);
    }
    BODY.innerHTML = `
    <p class="h1">
        Task over. Thank you for participating in this study. You can close this window.
    </p >
    `;
}

