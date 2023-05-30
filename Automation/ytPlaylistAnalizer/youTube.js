const puppeteer = require("puppeteer");
//npm i pdfkit
const pdfkit = require("pdfkit");
const fs = require("fs");

const url = "https://youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ";

(async function(){  
    try {
        let openBrowser = puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized"]
        });

        let browserInstance = await openBrowser;
        let allPages = await browserInstance.pages();
        let page = allPages[0];
        await page.goto(url);
        await page.waitForSelector("h1#title");
        let playlistName = await page.evaluate(function(select){ return document.querySelector(select).innerText }, "h1#title" );
        console.log(playlistName);

        let allData = await page.evaluate(getData, "div#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer");
        console.log(allData);
        
        //if we use this we get op as "2" its return 0th char not elem
        //let totalVideos = allData.noOfVid[0];
        //we must use split 
        let totalVideos = allData.noOfVid.split(" ")[0]; 
        console.log(totalVideos);

        let currVideos = await currentPageVideosLength(page);
        console.log(currVideos);

        while(totalVideos-currVideos >= 20){
            await scrollToBottom(page);
            currVideos = await currentPageVideosLength(page);
        }

        let vidDetails = await getStats(page);
        // console.log(vidDetails);

        let pdf = new pdfkit;
        pdf.pipe(fs.createWriteStream('playList.pdf'));
        pdf.text(JSON.stringify(vidDetails));
        pdf.end();

    } catch (error) {
        console.log(error);
    }
})()

function getData(selector){
    let allElem = document.querySelectorAll(selector);
    let noOfVid = allElem[0].innerText;
    let noOfViews = allElem[1].innerText;

    return{
        noOfVid,
        noOfViews
    } 
}

async function currentPageVideosLength(page){
    let length = await page.evaluate(getLength, "div#container #thumbnail #overlays span.style-scope.ytd-thumbnail-overlay-time-status-renderer");
    return length;
}

function getLength(durationSelector){
    let durationElem = document.querySelectorAll(durationSelector);
    return durationElem.length;
}

async function scrollToBottom(page){
    await page.evaluate(gotoBottom);

    function gotoBottom(){
        window.scrollBy(0, window.innerHeight);
    }
}

function getVidDetails(videoSelector, durationSelector){
    let titleElem = document.querySelectorAll(videoSelector);
    let durationElem = document.querySelectorAll(durationSelector);

    let allVidDetails = [];
    for(let i=0; i<titleElem.length; i++){
        let videoTitle = titleElem[i].innerText;
        let videoDuration = durationElem[i].innerText;
        let video = [
            i+1,
            videoTitle,
            videoDuration
        ]

        allVidDetails.push(video);
    }

    return allVidDetails;
}

async function getStats(page){
    let list = page.evaluate(getVidDetails, "a#video-title", "div#container #thumbnail #overlays span.style-scope.ytd-thumbnail-overlay-time-status-renderer");
    return list;
}