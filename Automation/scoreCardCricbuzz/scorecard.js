const puppeteer = require("puppeteer");
console.log("before");

let page;
const browserOpenPromise = puppeteer.launch({
    headless:false,
    slowMo:true,
    defaultViewport:null,
    args:["--start-maximized"]  //for full size window 
});
browserOpenPromise
    .then(function(browser){
        //currently opend pages(tabs)
        const pagesArrPromise = browser.pages();
        return pagesArrPromise;
    }).then(function(browserPages){
        page = browserPages[0];
        let gotoPromise = page.goto("https://www.google.com/");
        return gotoPromise;
    }).then(function(){
        //waiting for the element appear on page
        let waitingPromise = page.waitForSelector("input[type='text']", {visible:true});
        return waitingPromise;
    }).then(function(){
        //type on page after appeared 
        let keysWillSentPromise = page.type("input[type='text']", "ind vs sa 4th t20 scorecard", {delay:50});
        return keysWillSentPromise;
    }).then(function(){
        //page.keyboad to type special character
        let enterPressed = page.keyboard.press("Enter");
        return enterPressed;
    }).then(function(){
        let waitingPromise = page.waitForSelector("span.z1asCe.QFl0Ff", {visible : true});
        return waitingPromise;
    }).then(function(){
        //mouse click
        let keysWillSentPromise = page.click("span.z1asCe.QFl0Ff", {delay: 1000});
        return keysWillSentPromise;
    }).then(function(){
        let waitingPromise = page.waitForSelector("li[data-tab_type='CRICKET_MERGED_SCORECARD']", {visible : true});
        return waitingPromise;
    }).then(function(){
        //mouse click
        let keysWillSentPromise = page.click("li[data-tab_type='CRICKET_MERGED_SCORECARD']", {delay: 1000});
        return keysWillSentPromise;
    }).catch(function(error){
        console.log(error);
    })

console.log("after");
