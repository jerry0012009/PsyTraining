function renderNextPage(nextPage) {
    const body = document.getElementsByTagName("body")[0];
    body.innerHTML = PAGES[nextPage];
    if (nextPage == "endingPage") {
        sendResults(RESULTS);
    }
}

function saveResultAndNext(incrementQuestion, dataType) {
    const radioOptions = document.getElementsByClassName("form-check-input");

    let checkedOption;
    for (let i = 0; i < radioOptions.length; i++) {
        if (radioOptions[i].checked == true) {
            checkedOption = radioOptions[i].value;
        }
    }
    if (!RESULTS[QUESTION_NUMBER]) {
        RESULTS[QUESTION_NUMBER] = {};
    }

    if (dataType == "difficulty") {
        RESULTS[QUESTION_NUMBER].difficulty = checkedOption;
        RESULTS[QUESTION_NUMBER].reward = REWARDS[checkedOption];
        if (checkedOption == "hard") {
            REWARDS["easy"] += UPDATE_AMOUNT[QUESTION_NUMBER];
        } else {
            REWARDS["easy"] -= UPDATE_AMOUNT[QUESTION_NUMBER];
        }
        renderQuestion(checkedOption);
    } else if (dataType == "correctness") {
        RESULTS[QUESTION_NUMBER].correctness = isCorrect(checkedOption);
        if (isCorrect(checkedOption)) {
            RESULTS["totalRewards"] += RESULTS[QUESTION_NUMBER].reward;
        };
        if (QUESTION_NUMBER == UPDATE_AMOUNT.length) {
            return renderNextPage("endingPage");
        }
        renderOptionsPage();
    }
    QUESTION_NUMBER += incrementQuestion;
    if (!isProduction) {
        console.log(RESULTS);
    }
}

function renderOptionsPage() {
    const body = document.getElementsByTagName("body")[0];
    body.innerHTML = `
    <form class="needs-validation" nonvalidate>
            <div class="form-check mb-5">
                <input class="form-check-input" type="radio" name="flexRadioDefault" value="easy" id="easy" onclick="activateNext();"
                    required>
                <label class="form-check-label" for="easy">
                    简单任务，获得 ${REWARDS["easy"]} 张抽奖券
                </label>
            </div>
            <div class="form-check mb-5">
                <input class="form-check-input" type="radio" name="flexRadioDefault" value="hard" id="hard" onclick="activateNext();"
                    required>
                <label class="form-check-label" for="hard">
                    困难任务，获得 ${REWARDS["hard"]} 张抽奖券
                </label>
            </div>
            <button type="button" class="btn btn-primary form-control" onclick="saveResultAndNext(0, 'difficulty')" disabled>下一步</button>
        </form>
    `;
}

function isCorrect(check) {
    check = check.split(",");
    let curr;
    let prev = check[0];
    for (let i = 1; i < check.length; i++) {
        curr = check[i];
        if (parseInt(curr) < parseInt(prev)) {
            return false;
        }
        prev = curr;
    }
    return true;
}

function activateNext() {
    const btn = document.getElementsByClassName("btn")[0];
    btn.disabled = false;
}

function renderQuestion(difficulty) {
    const body = document.getElementsByTagName("body")[0];
    const questionType = { "easy": EASY_QUESTIONS, "hard": HARD_QUESTIONS }
    let questionHTML;
    let question;

    question = questionType[difficulty][Math.floor(Math.random() * questionType[difficulty].length)];
    // question = [[5, 8, 10, 11], [5, 8, 10, 9], [8, 9, 6, 5], [4, 6, 5, 8]]
    let currentIndex = question.length;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [question[currentIndex], question[randomIndex]] = [
            question[randomIndex], question[currentIndex]];
    }
    questionHTML = question.map(el => {

        return `
        <div class="form-check mb-3">
                <input class="form-check-input" type="radio" name="flexRadioDefault" value="${el}" id="${el}" onclick="activateNext();"
                    required>
                <label class="form-check-label" for="${el}">
                    ${el.join(", ")}
                </label >
            </div >
            `;
    })
    body.innerHTML = `<form class="needs-validation" nonvalidate> <p class="h3 mb-3">请选择将数字从小到大排序的选项。</p>` +
        questionHTML.join(" ") +
        `<button type="button" class="btn btn-primary form-control" onclick="saveResultAndNext(1, 'correctness')" disabled>下一步</button></form>`;
}

// how to save final result, I think:
async function sendResults(data) {
    if (isProduction) {
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
                    console.log("Something went wrong on our end...")
                }
            }
        });
    } else {
        console.log("===done===>", data);
    }

}

