// === for Daniel to edit ===
const instructions = `
在这个任务中，我们将要求您
列出属于特定类别或以特定字母开头的单词。
<br>
首先，我们想对您的打字速度进行快速测试。


`;


const typingQuote = `教育是生活不可分割的一部分。从出生起您就接受不同的课程和活动。有时我们很容易掌握事物并发展出自己的做事方式，有时我们只是简单地模仿。教育某人并不意味着获得书面知识。它也负责您的全面发展。您的科学书中显示了各种活动，它们来自我们的日常活动，您应该尝试它们，因为当您执行此类活动时，您的思维会自动产生各种问题，这会导致探索倾向。`;

function generateQuoteHTML(quote) {
    const chars = quote.split("");
    let quoteHTML = "";
    for (let i = 0; i < chars.length; i++) {
        quoteHTML += `<span>${chars[i]}</span>`;
    }
    return quoteHTML;
}

const typingQuoteHTML = generateQuoteHTML(typingQuote);


const PAGES = {

    instructionsPage: `
        <p class="h3">
            ${instructions}
        </p>
        <button class="btn btn-primary" onclick="renderNextPage('typingInstructionsPage');">
            结束指导
        </button>
    `,

    semanticInstructionsPage: `
    <p class="h3">
    您现在将完成一个语义流畅性任务。
    <br> 
    屏幕上将展示一个类别，您将有1分钟的时间列出尽可能多的属于该类别的单词。
    <br>
    当您准备好继续时，请按继续按钮。
    </p>
    <button class="btn btn-primary" onclick="renderNextPage('animalsPage');">
    继续
    </button>
    `,

    animalsPage: `
        <form>
            <label for="animals" class="h4">请尽可能多地列出属于类别
                <b>"动物"</b>的单词，用逗号和空格分隔 <br>- 您有 <span id="timeLeft">60</span> 秒</label>
            <textarea class="form-control" name="animals" id="animals" placeholder="动物1, 动物2, ..."></textarea>
            <button disabled type="button" class="form-control btn btn-primary mt-3" onclick="saveResultAndNext('animals', 'jobsPage');">下一步</button>
        </form>
    `,

    jobsPage: `
    <form>
        <label for="animals" class="h4">请尽可能多地列出属于类别
            <b>"职业"</b>的单词，用逗号和空格分隔 <br>- 您有 <span id="timeLeft">60</span> 秒</label>
        <textarea class="form-control" name="jobs" id="jobs" placeholder="职业1, 职业2, ..."></textarea>
        <button disabled type="button" class="form-control btn btn-primary mt-3" onclick="saveResultAndNext('jobs', 'verbalSPage');">下一步</button>
    </form>
    `,

    verbalInstructionsPage: `
    <p class="h3">
    您现在将完成一个语言流畅性任务。
    <br>
     屏幕上将展示一个字母，您将1分钟的时间列出尽可能多的以该字母开头的单词。
    <br>
     当您准备好继续时，请按继续按钮。
    </p>
    <button class="btn btn-primary" onclick="renderNextPage('verbalSPage');">
    继续
    </button>
    `,

    verbalSPage: `
    <form>
        <label for="S" class="h4">
        请尽可能多地列出以字母
            <b>"s"或中文“s”音</b>开头的单词，用逗号和空格分隔 <br>- 您有 <span id="timeLeft">60</span> 秒</label>
            <textarea class="form-control" name="S" id="S" placeholder="s---, s----, 三---, 四---, ..."></textarea>
            <button disabled type="button" class="form-control btn btn-primary mt-3" onclick="saveResultAndNext('S', 'verbalFPage');">下一步</button>
    </form>
    `,

    verbalFPage: `
    <form>
    <label for="F" class="h4">
    请尽可能多地列出以字母
        <b>"f"或中文“f”音</b>开头的单词，用逗号和空格分隔 <br>- 您有 <span id="timeLeft">60</span> 秒</label>
        <textarea class="form-control" name="F" id="F" placeholder="f-----, f----, 飞---, 翻---, ..."></textarea>
        <button disabled type="button" class="form-control btn btn-primary mt-3" onclick="saveResultAndNext('F', 'typingInstructionsPage');">下一步</button>
    </form>
    `,

    typingInstructionsPage: `
    <p class="h3">
    在下一部分中，屏幕上将出现一段文字。
    <br>在下面出现的文本框中在60秒内尽可能快地输入这段文字。
    <br>当您准备好继续时，请按继续按钮。
    </p>
    <button class="btn btn-primary" onclick="renderNextPage('typingPage');">
    继续
    </button>
    `,

    typingPage: `
    <span id="timeLeft">60</span>
    <div class="typing-container">
        <div class="quote-display" id="quoteDisplay">${typingQuoteHTML}
        </div>
        <textarea id="typing" class="quote-input" autofocus></textarea>
        <button disabled type="button" class="form-control btn btn-primary mt-3" onclick="saveResultAndNext('typing', 'semanticInstructionsPage');">下一步</button>
    </div>
    `,
    endingPage: `
    <p class="h3">
    任务完成。<br>感谢您参与本研究。
    <br>您可以关闭此窗口。
    </p>
    `,
}
