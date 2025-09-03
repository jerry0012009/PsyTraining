// === for Daniel to edit ===
const instructions = `
<p>
在这项任务中，您可以选择完成简单或困难任务来获得奖励。您的奖励将以抽奖券的形式发放。
每张抽奖券代表额外一次机会，可以赢得三张50美元亚马逊礼品卡中的一张。
在本研究的数据收集完成后，我们将进行抽奖。
</p>

<p>
在接下来的一系列试验中，您需要在简单任务（将一位数数字从小到大排序）和困难任务（将四位数数字从小到大排序）之间进行选择。
每个任务对应不同数量的抽奖券，您需要选择更愿意执行的任务。
然后您将执行所选择的任务。
</p>

<p>
当您准备好开始时，请继续
</p>
`;

const PAGES = {

    instructionsPage: `
        <p class="h3">
            ${instructions}
        </p>
        <button class="btn btn-primary" onclick="renderOptionsPage();">
            结束说明
        </button>
    `,

    optionsPage: `
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
    `,
    questionsPage: `

    `,

    endingPage: `
    <p class="h3">
    任务结束。感谢您参与本研究。您可以关闭此窗口。
    </p>
    `,
}
