function renderInstructions() {
    const instructions = `
      
        <p class="h3">
        在下一个页面中，您将看到一个蓝色正方形和一个按钮。在接下来的5分钟内，当正方形从蓝色变为红色时，请点击按钮。
        </p>

        <p class="h3">
        如果您在颜色从蓝色变为红色后迅速点击按钮，您的反应时间将显示在页面上。
        </p>

        <p class="h3">
        如果您错过了颜色变化，将不会显示任何内容。 
        </p>

        <p class="h3">
        在正式测试开始之前，将有一个为期<b>30秒</b>的练习试验。
        </p>

        <p class="h3">
        准备好后请继续。
        </p>
    `;
    BODY.innerHTML = `
        <p class="h3">
        ${instructions}
        </p>
        <button class="btn btn-primary" onclick="startTrial();">
            开始练习试验
        </button>
    `;
}

let startTime = 0;
function startTrial() {
    startTime = 0;
    BODY.innerHTML = `

    <div class="container d-flex flex-column justify-content-center align-items-center">
    <p id="reaction-time"></p>
       <div class="align-self-center" id="square"></div>
    </div>
    <button id="btn" class="btn btn-primary" onClick="checkIfMatchedTrial(performance.now());">点击这个按钮</button>

`;
    const square = document.getElementById("square");
    setTimeout(() => {
        BODY.innerHTML = `
        <p class="h3">
        您理解这是如何工作的吗？如果不理解，请再试一次。否则请继续。
        </p>
        <p class="h3">
        注意在正式测试中，您将看到您的反应时间，而不是“好！”和“太慢了”。
        </p>
        <div>
        <button class="btn btn-primary me-3" onclick="startTest();">
        开始测试
    </button>
    <button class="btn btn-primary" onclick="startTrial();">
        再次练习
    </button>
    </div>
    `;
        return clearInterval(test);
    }, PRACTICE_TIMEOUT);
    let cue = 1;
    let randomInterval = Math.floor(Math.random() * (max - min + 1) + min);
    const test = setInterval(() => {
        if (randomInterval == cue) {
            startTime = Math.round(performance.now());
            square.style.backgroundColor = "red";
            cue = 1;
            setTimeout(() => {
                square.style.backgroundColor = "blue"
            }, 500);
            randomInterval = Math.floor(Math.random() * (max - min + 1) + min);
        } else {
            square.style.backgroundColor = "blue";
            cue++
        }
    }, 1000);
}

function checkIfMatchedTrial(endTime) {
    const reactTime = document.getElementById("reaction-time");
    const diff = Math.round(endTime - startTime);
    if (diff > 800) {
        reactTime.innerHTML = `
        <span class="h3" style="color:red">太慢了</span>
        `;
        setTimeout(() => {
            reactTime.innerHTML = ``;
        }, 500);
    } else {
        reactTime.innerHTML = `
        <span class="h3" style="color:green">好！</span>
        `;
        setTimeout(() => {
            reactTime.innerHTML = ``;
        }, 500);
    }

}


function startTest() {
    startTime = 0;
    BODY.innerHTML = `

        <div class="container d-flex flex-column justify-content-center align-items-center">
        <p id="reaction-time"></p>
           <div class="align-self-center" id="square"></div>
        </div>
        <button id="btn" class="btn btn-primary" onClick="checkIfMatched(performance.now());">点击这个按钮</button>

    `;
    const square = document.getElementById("square");
    setTimeout(() => {
        renderEndingPage();
        return clearInterval(test);
    }, TIMEOUT);
    let cue = 1;
    RESULTS[`${0}`] = { "clickedAfter": [] };
    let randomInterval = Math.floor(Math.random() * (max - min + 1) + min);
    const test = setInterval(() => {
        if (randomInterval == cue) {
            startTime = Math.round(performance.now());
            RESULTS[`${startTime}`] = { "clickedAfter": [] };
            square.style.backgroundColor = "red";
            cue = 1;
            setTimeout(() => {
                square.style.backgroundColor = "blue"
            }, 500);
            randomInterval = Math.floor(Math.random() * (max - min + 1) + min);
        } else {
            square.style.backgroundColor = "blue";
            cue++
        }
    }, 1000);
}


function checkIfMatched(endTime) {
    const reactTime = document.getElementById("reaction-time");
    const diff = Math.round(endTime - startTime);
    RESULTS[`${startTime}`]["clickedAfter"].push(diff);
    if (diff > 1000) {

    } else {
        reactTime.innerText = `${diff} ms`;
        setTimeout(() => {
            reactTime.innerText = ``;
        }, 500);
    }

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


function renderEndingPage() {
    sendResults(RESULTS);
    BODY.innerHTML = `
            <p class="h3">
                任务完成。谢谢您参与这项研究。您可以关闭这个窗口。
            </p >
            `;
}