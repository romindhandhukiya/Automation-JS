const puppeteer = require("puppeteer");
const ans = require("./ans");

const codeAns = require("./ans");
const loginLink = "https://www.hackerrank.com/auth/login";
const email = "a1b1c1@gmail.com";
const password = "abc@123";
let page;

(async function(){
    try {
        let openBrowser = await puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized"]
        })

        let page = await openBrowser.newPage();
        await page.goto(loginLink);
        await page.type("input[id='input-1']", email, {delay : 50});
        await page.type("input[type='password']", password, {delay : 50});
        await page.click("button[type='submit']", {delay : 50});
        await waitAndClick(".topic-card a[data-attr1='algorithms']", page);
        await waitAndClick("input[value='warmup']", page);
        await page.waitForSelector("div.challenge-submit-btn", {visible : true});
        let allQues = await page.$$("div.challenge-submit-btn", {delay:50});
        console.log(allQues.length);
        await queSolver(page, allQues[1], codeAns.answers[0]);

    } catch (error) {
        console.log(error);
    }

})()  //function is called here we have to not call another time in new line.


async function waitAndClick(selector, page){
    await page.waitForSelector(selector);
    let click = await page.click(selector, {delay:50});
    return click;
}

async function queSolver(page, question, answer){
    await question.click();
    await waitAndClick(".monaco-editor.no-user-select.vs", page);
    await waitAndClick(".checkbox-input", page);
    await page.type("textarea.custominput", answer, {delay:10});
    await page.keyboard.down("Control");
    await page.keyboard.press("a", {delay:100});
    await page.keyboard.press("x", {delay:100});
    await page.keyboard.up("Control");
    await page.waitForSelector(".monaco-editor.no-user-select.vs", {visible : true});
    await page.click(".monaco-editor.no-user-select.vs");
    await page.keyboard.down("Control");
    await page.keyboard.press("a", {delay:100});
    await page.keyboard.press("v", {delay:100});
    await page.keyboard.up("Control");
    await page.click("button.hr-monaco-submit", {delay:100});
}