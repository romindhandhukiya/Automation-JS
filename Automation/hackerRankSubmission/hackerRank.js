const puppeteer = require("puppeteer");

const codeAns = require("./ans");
const loginLink = "https://www.hackerrank.com/auth/login";
const email = "a1b1c1@gmail.com";
const password = "abc@123";
let page;

puppeteer.launch({
    headless:false,
    defaultViewport:null,
    args:["--start-maximized"]
}).then(function(browser){
    let newPagePromise = browser.newPage();
    return newPagePromise;
}).then(function(newTab){
    page = newTab;
    let loginPage = newTab.goto(loginLink);
    return loginPage;
}).then(function(){
    let emailIsEntered = page.type("input[id='input-1']", email, {delay : 50});
    return emailIsEntered;
}).then(function(){
    let passwordIsEntered = page.type("input[type='password']", password, {delay : 50});
    return passwordIsEntered;
}).then(function(){
    let loginClicked = page.click("button[type='submit']", {delay : 50});
    return loginClicked;
}).then(function(){
    let clickOnAlgoPromise = waitAndClick(".topic-card a[data-attr1='algorithms']", page);
    return clickOnAlgoPromise;
}).then(function(){
    let checkBoxPromise = waitAndClick("input[value='warmup']", page);
    return checkBoxPromise;
}).then(function(){
    let waitFor2sec = page.waitForTimeout(2000);
    return waitFor2sec;
}).then(function(){
    let waitingPromise = page.waitForSelector("div.challenge-submit-btn", {visible : true});
    return waitingPromise;
}).then(function(){
    //$ for querySelector $$ for querySelectorAll
    let allQuePromise = page.$$("div.challenge-submit-btn", {delay:50});
    return allQuePromise;
}).then(function(allQues){
    console.log(allQues.length);
    let queSolvePromise = queSolver(page, allQues[1], codeAns.answers[0]);
    return queSolvePromise;
})


function waitAndClick(selector, page){
    let waitingPromise = page.waitForSelector(selector);
    waitingPromise.then(function(){
        let clickPromise = page.click(selector, {delay:50});
        return clickPromise;
    }).catch(function(err){
        console.log(err);
    })
}

function queSolver(page, question, answer){
    let queClick = question.click();
    queClick.then(function(){
        let textEditorPromise = waitAndClick(".monaco-editor.no-user-select.vs", page);
        return textEditorPromise;
    }).then(function(){
        return waitAndClick(".checkbox-input", page);
    }).then(function(){
        return page.waitForSelector("textarea.custominput", page);
    }).then(function(){
        return page.type("textarea.custominput", answer, {delay:10});
    }).then(function(){
        let ctrlIsPressed = page.keyboard.down("Control");
        return ctrlIsPressed;
    }).then(function(){
        let aIsPressed = page.keyboard.press("a", {delay:100});
        return aIsPressed;
    }).then(function(){
        let xIsPressed = page.keyboard.press("x", {delay:100});
        return xIsPressed;
    }).then(function(){
        let ctrlIsUnpressed = page.keyboard.up("Control");
        return ctrlIsUnpressed;
    }).then(function(){
        let waitingPromise = page.waitForSelector(".monaco-editor.no-user-select.vs", {visible : true});
        return waitingPromise;
    }).then(function(){
        let textEditorPromise = page.click(".monaco-editor.no-user-select.vs");
        return textEditorPromise; 
    }).then(function(){
        let ctrlIsPressed = page.keyboard.down("Control");
        return ctrlIsPressed;
    }).then(function(){
        let aIsPressed = page.keyboard.press("a", {delay:100});
        return aIsPressed;
    }).then(function(){
        let vIsPressed = page.keyboard.press("v", {delay:100});
        return vIsPressed;
    }).then(function(){
        let ctrlIsUnpressed = page.keyboard.up("Control");
        return ctrlIsUnpressed;
    }).then(function(){
        return page.click("button.hr-monaco-submit", {delay:100});
    })
}