var widthPercent = {1:100,2:50,3:33.33,4:25,5:20,6:16.66,7:14.28,8:12.5,9:11.11,10:10};
var count = 4;

var blackHeader1 = document.getElementsByClassName('black-header1')[0];
blackHeader1.style.display = 'none';

var focusElement = 0;

var isFullScreen = false;
var mode = false;

var scrollIntoViewValue = true;

var inputMode = false;
var historyMode = false;

var fileNameChangeMode = false;
var count2Or1Toogle = false;

var smoothMoment = false;

function getElementNumberThatHasBeenClicked(element){
    var imgItems = document.getElementsByClassName('img-item');
    for(var j=0;j<imgItems.length;j++){
        var tempElement = imgItems[j].getElementsByTagName('img')[0];
        // console.log('imgItems[j]:',tempElement);
        if(tempElement === element){
            return j;
        }
    }
    return -1;
}

var historyData = [];
// console.log('window.location.href:',window.location.href);
historyData.push(window.location.href.split('#')[1]);

var rowLevel = 0;
var rowHeights = [];

// calculateRowHeights();

// used key, h,j,J,t,T,r,R,s,S,a,A
// 1,2,3,4,5,6,7,8,9,0

var headToogle = true;

var elementToScroll;

setClickonImageBox();
// this function is used to set the click event on each image box, 
// click event is to store focusElement open clicking on image box
function setClickonImageBox(){
    var imgBoxs = document.getElementsByClassName('img-box');
    for(var ii=0;ii<imgBoxs.length;ii++){
        imgBoxs[ii].addEventListener("click", function(event) {
            elementToScroll = event.target;
            focusElement = getElementNumberThatHasBeenClicked(event.target);
            // console.log('focusElement:',focusElement);
        });
    }
}  

setAData(); 
setNumData();
calculateRowHeights();
setWidth();
navigateToTop();
highLightTheCorrectHeader(); 
makeVideosTextCloredYellow();
functionForCount2();

function setAData(){
    // console.log('setAData called');
    var imageNames = document.getElementsByClassName('img-name');
    var aData = localStorage.getItem("aData");
    if(aData === "true"){
        for(var i=0;i<imageNames.length;i++){
            imageNames[i].style.display = 'inline';
        }
    }
    else{
        for(var i=0;i<imageNames.length;i++){
            imageNames[i].style.display = 'none';
        }
    }
}

function setNumData(){
    // console.log('setNumData called');
    count = Number(localStorage.getItem("numData"));
    // console.log('count:',count);
    if(count === 0) count = 4;
    // console.log('count after check:',count);
}

function calculateRowHeights(){
    rowLevel = 0;
    rowHeights = [];

    var imgItems = document.getElementsByClassName('img-item');
    for(var i=0;i<imgItems.length;){
        var currentMaxHeightofRow = 0;
        for(var j=i;j<i+count && j<imgItems.length;j++){
            // console.log('height value:',imgItems[j].heightValue);
            currentMaxHeightofRow = Math.max(currentMaxHeightofRow,imgItems[j].clientHeight);
        }
        i += count;
        rowHeights.push(currentMaxHeightofRow);
    }
}

function setWidth(){
    // console.log('setWidth called');
    const imageItems = document.querySelectorAll(".img-item");

    imageItems.forEach(function(imageItem) {
        imageItem.style.width = widthPercent[count] + "%";  
    });

    // console.log('setWidth called, count:',count);
    // console.log('setWidth called, width:',widthPercent[count] + "%");

    if(imageItems.length == 0) 
        return; // no images in a folder case
}

function navigateToImgNumber(index,keyPressed){
    if(smoothMoment){
        if(keyPressed === 'ArrowDown'){
            window.scrollBy(0,100);
        } 
        else if(keyPressed === 'ArrowUp'){
            window.scrollBy(0,-100);
        }
        return;
    }


    var imgItems = document.getElementsByClassName('img-item');
    if(imgItems.length === 0) return; // no images in a folder case

    if(scrollIntoViewValue === true){
        var element = imgItems[index];
        element.scrollIntoView(true);
    }
    else{
        var element = imgItems[index];
        var imgFromElement = element.getElementsByTagName('img')[0];
        imgFromElement.scrollIntoView(false);
    }
    // else{
    //     var forLoopStartIndex = focusElement - (focusElement % count);
    //     // console.log('forLoopStartIndex:',forLoopStartIndex);
    //     var maxHeightElementIndex = forLoopStartIndex;
    //     var maxHeightElementHeight = imgItems[forLoopStartIndex].clientHeight;
    //     for(var i=forLoopStartIndex;i<forLoopStartIndex+count && i<imgItems.length;i++){
    //         if(imgItems[i].clientHeight > maxHeightElementHeight){
    //             maxHeightElementIndex = i;
    //             maxHeightElementHeight = imgItems[i].clientHeight;
    //         }
    //     }

    //     var element = imgItems[maxHeightElementIndex];
    //     element.scrollIntoView({ behavior: 'smooth'});
    // }
}

// this is for highlighting the current page header with green color
function highLightTheCorrectHeader(data){
    var anchorElements = document.querySelectorAll("a");
    if(data === undefined)
        var currentPage = window.location.href.substring(window.location.href.indexOf('#')+1);
    else
        var currentPage = data;

    if(currentPage.includes('.html')){
        currentPage = 'home';
    }

    for(var i=0;i<anchorElements.length;i++){
        temp = anchorElements[i].href.split('#')[1];
        if(temp === currentPage){
            // anchorElements[i].style.color = "red";
            anchorElements[i].style.fontWeight = "bold";
            anchorElements[i].style.color = "#0add96";
            
        }
        else{
            anchorElements[i].style.fontWeight = "normal";
            anchorElements[i].style.color = "white";
        }
    }
}

function navigateToTop(){
    document.body.scrollIntoView(true);
}

function navigateToBottom(){
    document.body.scrollIntoView(false);
}

function removeSearchBox(){
    var searchBox = document.querySelector('.search-box');
    if(searchBox){
        searchBox.remove();
        inputMode = false;
    }
}

function makeVideosTextCloredYellow(){
    // console.log('makeVideosTextCloredYellow called');
    var images = document.querySelectorAll('img');
    images.forEach(function(image) {
        if(image.src.endsWith('.mp4') || image.src.endsWith('.webm') || image.src.endsWith('.avi') || image.src.endsWith('.mkv')){
            var imgName = image.parentElement.parentElement.querySelector('.img-name');
            // console.log('imgName:', imgName);
            if(imgName){
                imgName.style.color = 'black';
                imgName.style.fontWeight = 'bold';
                imgName.style.textDecoration = 'underline';
                imgName.style.backgroundColor = 'cyan';
            }
        }
    });
}

var imgWidthForCount2Mode = 90;
function changeWidth(enterredKey){
    console.log('changeWidth called:', enterredKey);
    if(enterredKey === '=')
        imgWidthForCount2Mode += 1;
    else
        imgWidthForCount2Mode -= 1;

     var imgs = document.querySelectorAll('img');
    for(var i=0;i<imgs.length;i++){
        imgs[i].style.width = imgWidthForCount2Mode + '%';
        imgs[i].style.height = 'auto';
    }

    navigateToImgNumber(focusElement);
}

function functionForCount2(enterredKey){
    if(enterredKey === '2' || enterredKey === '1'){
        // if(count === 2 || count === 1) count2Or1Toogle = !count2Or1Toogle;
    }
    console.log('functionForCount2 called', count, count2Or1Toogle);
    
    if(count === 2 || count === 1){
        // console.log('count is 2');
        var imgs = document.querySelectorAll('img');
        for(var i=0;i<imgs.length;i++){
            // if(count2Or1Toogle){
            //     imgs[i].style.maxHeight = '897px';
            //     imgs[i].style.maxWidth = 'auto';
            // }
            // else{
            //     imgs[i].style.maxWidth = '100%';
            //     imgs[i].style.maxHeight = 'auto';
            // }

            // if(count === 1 && !count2Or1Toogle){
            //     imgs[i].style.maxHeight = 'auto';
            //     imgs[i].style.maxWidth = '97%';
            // }
        }
        
    }
    else{
        // console.log('count is not 2');
        var imgs = document.querySelectorAll('img');
        for(var i=0;i<imgs.length;i++){
            imgs[i].style.maxHeight = '100%';
        }
    }
}

document.querySelectorAll("a").forEach(function(anchor) {
    anchor.addEventListener("click", function(event) {
        // console.log('anchor clicked:',event.target.href);
        setAData();
        setNumData();
        calculateRowHeights();
        setWidth();

        highLightTheCorrectHeader(event.target.href.split('#')[1]);
        setClickonImageBox();
        removeSearchBox();
        makeVideosTextCloredYellow();
        console.log('anchor version');
        functionForCount2();

        if(!isFullScreen){
            console.log('isFullScreen is false, navigating to top');
            navigateToTop();
        }
        else{
            console.log('isFullScreen is true, navigating to img number 0');
            navigateToImgNumber(1,event.key);
            setTimeout(function() {
                // Code to be executed after 2 seconds
                console.log("This message appears after 2 seconds.");
                navigateToImgNumber(0,event.key);
            }, 50);
        }
        var currentPage = event.target.href.split('#')[1];
        historyData.push(currentPage);
        // console.log('historyData:', historyData);

        addDeleteButtons(); // from serverRelatedButtons.js
        multipleElementsSelectionMode = false // from serverRelatedButtons.js

        setFolderName(); // from serverRelatedButtons.js
    });
});

// document.querySelectorAll(".img-name").forEach(function(imgName) {
//     imgName.addEventListener("click", function(event) {
//         console.log('')
//     });
// }


document.addEventListener("keydown", function(event) {
    // console.log('entered Key:',event.key);
    // console.log('event.ctrlKey:',event.ctrlKey);

    // console.log('filechangeMode in increase:',fileNameChangeMode);

    // ctrl + enter
    if(event.key === 'Enter' && event.ctrlKey){
        var starsList = ['Alina Becker','Byoru','Lady Melamori','Zhu Ke Er'];
        var websiteName = getWebsiteNameFromUrl();
        var categoryName = getCategoryNameFromUrl();
        console.log('websiteName ctrl enter:',websiteName);
        console.log('categoryName ctrl enter:',categoryName);
        if(starsList.includes(categoryName)){
            // main link -> file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/All%20Websites%20Links/Alina%20Becker/Alina%20Becker%20Tier%201/Images/0%20Pale%20Black
            // avg link  -> file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/All%20Websites%20Links/Alina%20Becker/Alina%20Becker%20Tier%201%20-%20Avg/Images/0%20Pale%20Black
            // if main link, open avg link in new tab, if avg link, open main link in new tab
            var url = window.location.href;
            // replace last but one part of URL
            var splitData = url.split("/");
            var lastButOnePart = splitData[splitData.length - 2];
            console.log('lastButOnePart ctrl enter:',lastButOnePart);
            if(lastButOnePart.includes('Avg')){
                splitData[splitData.length - 2] = lastButOnePart.replace('%20-%20Avg','');
            }
            else{
                splitData[splitData.length - 2] = lastButOnePart + '%20-%20Avg';
            }
            var newUrl = splitData.join("/");
            console.log('newUrl ctrl enter:',newUrl);
            window.open(newUrl, '_blank');
        }
        return;
    }

    if(event.key === 'l' && multipleElementsSelectionMode){
        var selectedImgs = document.getElementsByClassName('selected-img');
        var copyString = '';
        for(var i=0;i<selectedImgs.length;i++){
            var imgName = selectedImgs[i].getElementsByClassName('img-name')[0].innerText;
            copyString += imgName + '\n';
        }
        navigator.clipboard.writeText(copyString);        
        return;
    }

    if(fileNameChangeMode){
        return;
    }

    if(multipleElementsSelectionMode){
        return;
    }

    if(event.ctrlKey && (event.key === 'r' || event.key === 'R' || event.key === 'f' || event.key === 'F' || event.key === 'a' || event.key === 'A')){
        // console.log('Ctrl + R or F or A pressed, ignoring');
        return;
    }

    if(event.key === 'K'){
        // console.log('K key pressed, redirecting to Shortcuts.html');
        var anchorElement = document.createElement("a");
        anchorElement.href = "../../Shortcut Keys.html";
        anchorElement.target = "_blank"; // Open in a new tab
        anchorElement.click();
        return;
    }

    if(inputMode === false && (event.key === '-' || event.key === '=')){
        changeWidth(event.key);
        return;
    }

    if(event.key === 'H'){
        historyMode = !historyMode;
        return;
    }

    if(historyMode && event.key === 'ArrowLeft'){
        if(historyData.length > 1){
            historyData.pop(); // remove the current page
            var previousPage = historyData[historyData.length - 1];
            // console.log('previousPage:', previousPage);
            // highLightTheCorrectHeader(previousPage);
            var anchorElements = document.querySelectorAll("a");
            for(var i=0;i<anchorElements.length;i++){
                if(anchorElements[i].href.split('#')[1] === previousPage){
                    anchorElements[i].click();
                    break;
                }
            }
        }
        historyData.pop();
        return;   
    }
    
    if(inputMode){
        var searchBox = document.querySelector('.search-box');
        var noOfImgs = 0; var imgNameToCopy = '';
        if(event.key === "Backspace"){
            searchBox.value = searchBox.value.slice(0, -1);
        }
        else if(event.key === 'c' && event.ctrlKey){
            return;
        }
        else if(event.key === "Shift"){
            searchBox.value = '';
        }
        else if(event.key === 'backspace' && event.ctrlKey){
            searchBox.value = '';
        }
        else if(event.key === 'Shift' || event.key === 'Control' || event.key === 'Alt' || event.key === 'Meta' || event.key === 'CapsLock' || event.key === 'Tab' || event.key === 'Enter' || event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'){
            return;
        }
        else if(event.key == 'Escape'){
            inputMode = false;
            searchBox.style.display = 'none';
            return;
        }
        else{
            searchBox.value += event.key;
        }

        var itemItems = document.getElementsByClassName('img-item');
        for(var i=0;i<itemItems.length;i++){
            var imgName = itemItems[i].getElementsByClassName('img-name')[0];
            if(imgName.innerText.toLowerCase().includes(searchBox.value.toLowerCase())){
                itemItems[i].style.display = 'block';
                noOfImgs++;
                if(noOfImgs === 1){
                    imgNameToCopy = imgName.innerText;
                }
            }
            else{
                itemItems[i].style.display = 'none';
            }
        }

        if(searchBox.value === ''){
            return;
        }


        navigator.clipboard.writeText(imgNameToCopy + (!includeAnimeOrNot ? "" : " Anime"));
        return;}

    var modeInput = document.querySelector(".mode-input");
    if (event.key === "m") {
        if(!mode){
            mode = true;
            modeInput.checked = true;
            return;
        }
    }

    if (event.key === "M" && mode){
        mode = false;
        modeInput.checked = false;
        return;
    }

    if (mode){
        const aElement = document.querySelectorAll("a");
        var url = window.location.href;

        var searchStartIndex = 1;

        if(url.endsWith('.html')){ // when url is dfsdfsdf.html - without #home
            searchStartIndex = 0;
        }
        else{
            var currentPage = url.substring(url.indexOf('#')+1);

            for(var i=0;i<aElement.length;i++){
                if(aElement[i].href === url){
                    searchStartIndex = i + 1;
                    break;
                }
            }
        }

        var numberOfIterations = aElement.length;
        while(numberOfIterations--){
            if(searchStartIndex >= aElement.length) searchStartIndex = 0;
            var startingLetterofAnchor = aElement[searchStartIndex].href.split('#')[1][0];
            if(startingLetterofAnchor.toLowerCase() === event.key.toLowerCase()){
                focusElement = 0;
                aElement[searchStartIndex].click();
                break;
            }
            searchStartIndex++;
        }
        
        return;
    }

    // console.log('this is running even then');
    window.addEventListener("keydown", function(e) {
        // Check if the pressed key is the Down Arrow key
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
            if(!fileNameChangeMode && !multipleElementsSelectionMode){
                e.preventDefault(); // Prevent the default scrolling behavior
                // console.log('stopped default behavior');
            }
        }
    });


    var blackHeader = document.getElementsByClassName('black-header')[0];
    var blackHeader1 = document.getElementsByClassName('black-header1')[0];
    if (event.key === "h"){
        if(headToogle === 'off'){
            return;
        }

        if(headToogle){
            blackHeader1.style.display = "block";
            blackHeader1.style.position = "fixed";
            blackHeader1.style.top = "0px";
        } 
        else{
            blackHeader1.style.display = 'none';
        }  
        headToogle = !headToogle;
        return;
    } 

    if(event.key === "b"){
        var copyContainer = document.querySelector(".copy-container");
        if(blackHeader.style.display === 'none' && blackHeader1.style.display === 'none'){
            blackHeader.style.display = "block";
            
            copyContainer.style.display = "flex";
            headToogle = true;
        }
        else{
            blackHeader1.style.display = 'none';
            blackHeader.style.display = 'none';

            copyContainer.style.display = "none";

            headToogle = 'off';
        }
        return;
    }

    if(event.key === "a"){  
        var imageNames = document.getElementsByClassName('img-name');

        if (window.getComputedStyle(imageNames[0]).display !== 'none'){
            
            localStorage.setItem("aData", "false");
            for(var i=0;i<imageNames.length;i++){
                imageNames[i].style.display = 'none';
            }
        }
        else{
            localStorage.setItem("aData", "true");
            for(var i=0;i<imageNames.length;i++){
                imageNames[i].style.display = 'inline';
            }
        }
    }
    
    if(event.key === "A"){  
        var imageFolders = document.getElementsByClassName('img-folder-name');

        if (window.getComputedStyle(imageFolders[0]).display !== 'none'){
            
            for(var i=0;i<imageFolders.length;i++){
                imageFolders[i].style.display = 'none';
            }
        }
        else{
            for(var i=0;i<imageFolders.length;i++){
                imageFolders[i].style.display = 'block';
            }
        }
    }

    if(event.key === '`'){
        var windowHref = window.location.href;
        console.log('windowHref:',windowHref);
        if(!windowHref.includes('http://localhost:3001/')){
            console.log('opening url:','http://localhost:3001/' + windowHref.split('file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/')[1]);
            window.open('http://localhost:3001/' + windowHref.split('file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/')[1],'_self');
        }
    }

    if(event.key ===';'){
        smoothMoment = !smoothMoment;
    }

    if(event.key === '/' || event.key === 'z'){
        scrollIntoViewValue = !scrollIntoViewValue;
        console.log('slash or z key pressed, toggling scrollIntoViewValue:',scrollIntoViewValue);
        navigateToImgNumber(focusElement,event.key);
        return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp"){
        var imgItems = document.getElementsByClassName('img-item');
        if (event.key === 'ArrowDown'){
            focusElement = (focusElement + count)
            modValue = focusElement % count;
            focusElement = focusElement - modValue; 
            
            if(focusElement >= imgItems.length){
                focusElement = imgItems.length - 1;
            }
            navigateToImgNumber(focusElement,event.key);
            // if((imgItems.length-1)/count > rowLevel) rowLevel++;
        }
        else{
            focusElement = (focusElement - count)
            modValue = focusElement % count;
            focusElement = focusElement - modValue; 
            if(focusElement < 0){
                focusElement = 0;
            }
            navigateToImgNumber(focusElement,event.key);

        }

        var sumOfRowHeights = 0;
        for (var i = 0; i < rowLevel && i < rowHeights.length; i++) {
            sumOfRowHeights += rowHeights[i];
        }
        // console.log('blackHeader.clientHeight:',blackHeader.clientHeight);
        // console.log('blackHeader1.clientHeight:',blackHeader1.clientHeight);
        // window.scrollTo(0, blackHeader.clientHeight + blackHeader1.clientHeight + sumOfRowHeights);

        // if(count === 2){
        //     if()
        // }
        return;
    } 

    if (event.key === 'w'){
        navigateToTop();
        return;
    }

    if (event.key === 'W'){
        navigateToBottom();
        return;
    }

    if(event.ctrlKey && (event.key === 'f' || event.key === 'F')){
            return;
    }

    if (event.key === 'f'){
        if(isFullScreen){
            isFullScreen = false;
            document.exitFullscreen();
        }
        else{
            isFullScreen = true;
            document.documentElement.requestFullscreen();
        }
        return;
    }
    
    if (event.key === "ArrowRight") {
        const aElement = document.querySelectorAll("a");
        var url = window.location.href;

        if(url.endsWith('.html')){ // when url is dfsdfsdf.html - without #home
            aElement[1].click();
            return;
        }

        focusElement = 0;
        var clicked = false;
      
        for(var i=0;i<aElement.length/2;i++){
            if(aElement[i].href === url){
                if(i=== (aElement.length/2)-1) aElement[1].click();
                else aElement[i+1].click();
                clicked = true;
                break;
            }
        }

        if(!clicked){
            aElement[1].click();
        }
        return;
    }

    if (event.key === "ArrowLeft") {
        const aElement = document.querySelectorAll("a");
        var url = window.location.href;

        console.log('ArrowLeft pressed, url:',url);
        console.log('aElement length:',aElement.length);
        console.log('aElement:',aElement);

        for(var i=0;i<aElement.length/2;i++){
            console.log('aElement[i].href:',aElement[i].href);
            if(aElement[i].href === url){
                // console.log('aElement[i].href',aElement[i].href);
                if(i === 1) aElement[aElement.length-1].click();
                else if(i === 0) aElement[aElement.length-1].click();
                else aElement[i-1].click();
                return;
            }
        }
        return;
    }

    if (event.key === "r" || event.key === "R" || event.key === 't') {
        // console.log('randome click:');
        var sortingOrder = '';
        if(event.key === "r") sortingOrder = 'random';
        else if(event.key === 't') sortingOrder = 'desc';
        else sortingOrder = 'asc';
        var url = window.location.href;
        var currentPage = url.substring(url.indexOf('#')+1);

        if(currentPage === "home" || currentPage.slice(-5) === ".html")
            homeListGenerator(sortingOrder);
        else{
            currentPage = currentPage.replaceAll('%20'," ");
            var index = getIndex(currentPage);
            imgListGenerator(fileNames[index],mainList[index],sortingOrder);
        }

        setAData();
        setNumData();
        calculateRowHeights();
        setWidth();
    }

    if(event.key === 'i'){
        var imgItems = document.getElementsByTagName('img');
        var imgNames = document.getElementsByClassName('img-name');

        if(imgItems[0].style.display !== 'none'){
            for(var i=0;i<imgItems.length;i++){
                imgItems[i].style.display = 'none';
            }

            for(var i=0;i<imgNames.length;i++){
                imgNames[i].style.display = 'flex';
                imgNames[i].style.justifyContent = 'center';
                imgNames[i].style.alignItems = 'center';
                imgNames[i].style.height = '100px';

                imgNames[i].style.border = '1px solid #0ab2eb';
            }
        }

        else{
            for(var i=0;i<imgItems.length;i++){
                imgItems[i].style.display = 'block';
            }
            var imgNames = document.getElementsByClassName('img-name');
            for(var i=0;i<imgNames.length;i++){
                // imgNames[i].style.display = '';
                imgNames[i].style.height = 'auto';
                imgNames[i].style.border = 'none';
            }
        }
    }

    if(event.key === ' '){
        var searchBox = document.querySelector('.search-box');
        if(searchBox){
            searchBox.style.display = 'block';
            inputMode = true;
            return;
        }
        var searchBox = document.createElement('input');
        searchBox.type = 'text';
        searchBox.style.position = 'fixed';
        searchBox.style.border = "6px solid #0ab2eb";
        searchBox.style.height = '30px';
        searchBox.style.top = '50px';
        searchBox.style.color = '#0ddb1f';
        searchBox.style.fontSize = '20px';
        searchBox.style.fontWeight = 'bold';
        searchBox.style.right = '10px';
        searchBox.className = 'search-box';
        document.body.appendChild(searchBox);

        inputMode = true;
    }

    if(event.key === 'p'){
        var copyText = getPathData();
        if(copyText.includes('http://localhost:3001/')){
            // console.log('if inlucde http://localhost:3001/');
            copyText = copyText.replace('http://localhost:3001/','file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/');
        }
        navigator.clipboard.writeText(copyText);
        return;
    }

    if(event.key === 'l'){
        navigator.clipboard.writeText(getData());
        return;
    }

    if(event.key === 'u'){
        navigator.clipboard.writeText(getUrlPathData());
        return;
    }

    if(event.key === 'y'){
        var anchorElements = document.querySelectorAll("a");
        for(var i=0;i<anchorElements.length;i++){
            if(anchorElements[i].style.fontWeight === 'bold' || anchorElements[i].style.color === '#0add96'){
                var text = anchorElements[i].innerHTML.split('<span')[0];  
                var copyText = text.slice(0, text.length - 1);
                navigator.clipboard.writeText(copyText);
                return;
            }
        }
        return;
    }

    if(event.key === 'C'){
        toogleCheckBoxes();
    }

    if(event.key === 'c'){
        var imgs = document.getElementsByTagName('img');
        var imgPaths = [];
        for(var i=0;i<imgs.length;i++){
            imgPaths.push(imgs[i].src);
        }

        console.log('c key pressed:',imgPaths);
        fetch('http://localhost:3001/getImgsCreatedDates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({imgPaths: imgPaths}), // Send the form data as JSON
        })
        .then(response => response.json())
        .then(data => {
            // console.log('imgs created dates:',data);
            var imgContainer = document.getElementById("imgs-container");
            imgContainer.innerHTML = "";

            for(var i=0;i<data.newImgPaths.length;i++){
                var imgPathValue = data.newImgPaths[i].imgPath;
                var filename = imgPathValue.substring(imgPathValue.lastIndexOf('/')+1);
                var foldername = imgPathValue.substring(0,imgPathValue.lastIndexOf('/')).substring(imgPathValue.lastIndexOf('/',imgPathValue.lastIndexOf('/')-1)+1);
                // console.log('filename:',filename.replaceAll('%20',' '),'foldername:',foldername);
                imgContainer.appendChild(imgItemCreator(filename,foldername));
            }

            setAData();
            setNumData();
            calculateRowHeights();
            setWidth();

            var imgNames = document.getElementsByClassName('img-name');
            var imgFolderNames = document.getElementsByClassName('img-folder-name');
            for(var i=0;i<imgNames.length;i++){
                imgNames[i].innerHTML = imgNames[i].innerHTML.replaceAll('%20',' ');
                imgFolderNames[i].innerHTML = imgFolderNames[i].innerHTML.replaceAll('%20',' ');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
        return;
    }

    if(event.key === 'q'){
        document.querySelectorAll("a")[0].click();
        return;
    }

    if(event.key === 's'){
        includeAnimeOrNot = !includeAnimeOrNot;
    }

    if(event.ctrlKey && (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' || event.key === '5' || event.key === '6' || event.key === '7' || event.key === '8' || event.key === '9' || event.key === '0'))
        return;
    else if(event.key === "1") count = 1;
    else if(event.key === "2") count = 2;
    else if(event.key === "3") count = 3;
    else if(event.key === "4") count = 4;
    else if(event.key === "5") count = 5;
    else if(event.key === "6") count = 6;
    else if(event.key === "7") count = 7;
    else if(event.key === "8") count = 8;
    else if(event.key === "9") count = 9;
    else if(event.key === "0") count = 10;

    console.log('count after key press:');
    functionForCount2(event.key);

    if(event.key === "s" || event.key === "S" || event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4" || event.key === "5" || event.key === "6" || event.key === "7" || event.key === "8" || event.key === "9" || event.key === "0"){
        localStorage.setItem("numData", "" + count);
        // console.log('in even lsitioner');
        calculateRowHeights();
        setWidth();
        navigateToImgNumber(focusElement,event.key);
    }
});

function fixA(){

}

function toogleCheckBoxes(){
    var checkBoxDiv = document.querySelector('#checkboxes-container');
    if(checkBoxDiv.style.display === 'inline-block'){
        checkBoxDiv.style.display = 'none';
    }
    else{
        checkBoxDiv.style.display = 'inline-block';
    }
}
toogleCheckBoxes();
toogleCheckBoxes();

