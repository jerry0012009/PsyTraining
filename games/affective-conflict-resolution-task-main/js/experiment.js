const resultList = [];
let result = {};
let isActive = false;
let praceticeRounds = 16;
let realRounds = 144;
function setButtonHTML() {
    const angryButton = `<button id="angry" class="button" onclick="checkEmotion('ANGRY');">愤怒</button>`;
    const happyButton = `<button id="happy" class="button" onclick="checkEmotion('HAPPY');">开心</button>`;
    const sadButton = `<button id="sad" class="button" onclick="checkEmotion('SAD');">悲伤</button>`;
    const scaredButton = `<button id="scared" class="button" onclick="checkEmotion('SCARED');">恐惧</button>`;
    const array = [angryButton, happyButton, sadButton, scaredButton];
    let currentIndex = array.length, randomIndex;

    // 当还有元素需要洗牌时...
    while (currentIndex != 0) {

        // 选择一个剩余元素...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // 与当前元素交换
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    const numbers = ["one", "two", "three", "four"];
    for (let i = 0; i < array.length; i++) {
        array[i] = array[i].replace(`class="button"`, `class="button ${numbers[i]}"`);
    }
    return array.join(" ");
}

const buttonGroupInnerHTML = setButtonHTML();
function generateImage() {
    const sadImages = [
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad1.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad10.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad2.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad3.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad4.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad5.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad6.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad7.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad8.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad9.jpeg'
    ];
    const angryImages = [
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry1.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry10.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry2.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry3.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry4.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry5.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry6.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry7.jpeg",
        "https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry8.jpeg",
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/angry9.jpeg'
    ];
    const happyImages = [
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy1.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy10.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy2.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy3.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy4.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy5.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy6.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy7.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy8.jpeg',
        'https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/happy9.jpeg'
    ];

    const scaredImages = [
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared1.jpeg?alt=media&token=0da6347f-e36c-49f2-b1ea-4f0e7e7170ab',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared10.jpeg?alt=media&token=96b47c30-f5bc-460c-8ae1-c7146f5b7c61',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared2.jpeg?alt=media&token=da26bcf1-9c0a-4993-b65e-23ab3502add2',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared3.jpeg?alt=media&token=9afa9190-0263-40b0-b55b-2439cd908dca',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared4.jpeg?alt=media&token=53f6454d-c89e-4b51-877b-4ca0e59b8f1a',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared5.jpeg?alt=media&token=b4a4368d-fa6d-4cc3-8957-037983853f47',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared6.jpeg?alt=media&token=5674044b-fe69-4776-b005-8164ad0022a4',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared7.jpeg?alt=media&token=65bbb185-74ec-43cd-8ba4-997a99338fef',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared8.jpeg?alt=media&token=c89b2ffa-b345-4366-b63d-ac3a24b27597',
        'https://firebasestorage.googleapis.com/v0/b/emotional-stroop.appspot.com/o/scared9.jpeg?alt=media&token=85e96257-6b9a-418f-98d1-5937e7617176'
    ];

    const imageMap = {
        0: sadImages,
        1: angryImages,
        2: happyImages,
        3: scaredImages
    }
    const emotionList = [
        "悲伤",
        "愤怒",
        "开心",
        "恐惧"
    ]
    const emotionListEng = [
        "SAD",
        "ANGRY",
        "HAPPY",
        "SCARED"
    ]
    const min = 0;
    const max = 3;
    const rand = Math.floor(Math.random() * (max - min + 1) + min);



    const imageList = imageMap[rand];

    const randomImage = imageList[Math.floor(Math.random() * imageList.length)];
    const randomImageEmotion = emotionList[rand];
    const randomText = emotionList[Math.floor(Math.random() * emotionList.length)];
    result["emotion"] = emotionListEng[rand];
    result["text"] = emotionListEng[emotionList.indexOf(randomText)];
    const imageContainer = document.getElementById("imageContainer");
    const img = document.createElement('img');
    const text = document.createElement('p');
    text.classList.add('centered')
    text.innerText = randomText;
    text.style.display = 'none';
    text.setAttribute('id', 'text');
    img.onload = randomTimer;
    img.src = randomImage;
    img.style.visibility = 'hidden';
    img.setAttribute('id', 'img');
    img.classList.add(randomImageEmotion)
    imageContainer.className = '';
    // 将文本情绪（"悲伤"、"开心"...）添加到 imageContainer 的 class 中 
    imageContainer.classList.add(randomText);
    imageContainer.appendChild(img);
    imageContainer.appendChild(text)

}
function showImage() {
    const image = document.getElementById('img');
    image.style.visibility = 'visible';
    const text = document.getElementById('text');
    text.style.display = 'inline';
    result["startTime"] = performance.now();

}

function checkEmotion(chosenEmotion) {
    let nextPageName = "";
    if (isActive) {
        isActive = false;
        result["endTime"] = performance.now();
        result["chosenEmotion"] = chosenEmotion;
        const emotionText = document.getElementById("imageContainer").className;
        if (emotionText != chosenEmotion) {
            result["correctness"] = "incorrect";
        } else {
            result["correctness"] = "correct";
        }

        if (praceticeRounds == 0 && realRounds != 0) {
            resultList.push(result);
            realRounds--
            if (realRounds == 0) {
                return renderEndPage();
            }
            nextPageName = "情绪冲突解决任务"
        } else {
            praceticeRounds--
            if (praceticeRounds == 0) {
                return renderWarning();
            }
            nextPageName = "练习轮次"
        }
        result = {}
        resetScreen(nextPageName);
        if (praceticeRounds != 0) {
            const title = document.getElementsByClassName("title")[0];
            if (emotionText != chosenEmotion) {
                title.innerHTML = `
                    <span id="incorrect">错误</span>
                `;

            } else {
                title.innerHTML = `
                    <span id="correct">正确</span>
                `;
            }
            setTimeout(() => {
                title.innerHTML = `
                练习轮次
            `}, (800));
        }
        return generateImage();
    }
}

function activatecheckEmotion() {
    isActive = true;
}

function randomTimer() {
    const min = 0.5;
    const max = 1.5;
    let rand = Math.floor(Math.random() * (max - min + 1) + min);

    setTimeout(activatecheckEmotion, rand * 1000)
    setTimeout(showImage, rand * 1000);
}

function resetScreen(nextPageName) {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = "";
    const buttonGroup = document.getElementsByClassName("button-group")[0];
    buttonGroup.innerHTML = buttonGroupInnerHTML;
    const content = document.getElementById("content");
    content.innerHTML = "";
    const title = document.getElementsByClassName("title")[0];
    if (nextPageName != "情绪冲突解决任务") {
        title.innerText = nextPageName;
    }
}

function renderInstructions() {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `
            <img src='https://filedn.com/ltpGl4CBYf5Hf3ADcupJL7B/emostroop_img/sad1.jpeg' alt="">
            <div class="centered instruction-image-text">开心</div>
    `;
    const buttonGroup = document.getElementsByClassName("button-group")[0];
    buttonGroup.innerHTML = `
    <button class="button" onclick="startTrial('练习轮次');">开始练习轮次</button>
    `;
}

function startTrial(nextPageName) {
    resetScreen(nextPageName);
    generateImage();
}

function renderWarning() {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = ``;
    const buttonGroup = document.getElementsByClassName("button-group")[0];
    buttonGroup.innerHTML = `<button class="button" onclick="startTrial('情绪冲突解决任务');">开始</button>`;
    const title = document.getElementsByClassName("title")[0];
    title.innerHTML = `警告`;
    const content = document.getElementById("content");
    content.innerHTML = `<h3>练习轮次已完成。点击下方按钮开始正式试验！</h3>`;
}

function renderEndPage() {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `感谢您参与我们的研究。`;
    const buttonGroup = document.getElementsByClassName("button-group")[0];
    buttonGroup.innerHTML = `<button class="button" onclick="sendResults();">结束试验</button>`;
    const title = document.getElementsByClassName("title")[0];
    title.innerHTML = `任务完成`;
}


async function sendResults(data) {
    const imageContainer = document.getElementById("imageContainer");
    imageContainer.innerHTML = `感谢您的参与。`;
    const buttonGroup = document.getElementsByClassName("button-group")[0];
    buttonGroup.innerHTML = ``;
    const title = document.getElementsByClassName("title")[0];
    title.innerHTML = `结果已保存`;
    $.ajax({
        type: "POST",
        url: '/save',
        data: { "data": data },
        success: function () { document.location = "/next" },
        dataType: "application/json",

        // 端点未运行，本地保存
        error: function (err) {

            if (err.status == 200) {
                document.location = "/next";
            } else {

                // 如果出错，假设本地保存
                console.log("我们这边出现了一些问题...");
            }
        }
    });
}


renderInstructions();