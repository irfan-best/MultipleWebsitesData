var widthPercent = {1:100,2:50,3:33.33,4:25,5:20,6:16.66,7:14.28,8:12.5,9:11.11,10:10};
var count = 4;
// var increase = document.getElementById('increase');

// console.log('increase Global');

var blackHeader1 = document.getElementsByClassName('black-header1')[0];
blackHeader1.style.display = 'none';

var focusElement = 0;

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

function setWidth(){
    console.log('setWidth:');
    // Get all elements with the class "myButton"
    const buttons = document.querySelectorAll(".img-item");

    // Loop through the elements and apply styles
    buttons.forEach(function(button) {
        button.style.width = widthPercent[count] + "%";  
    });

    calculateRowHeights();
    console.log('focusElement:',focusElement);

    if(buttons.length == 0) return;
    navigateToImgNumber(focusElement);
    // else document.body.scrollIntoView(true);
}
// document.body.scrollIntoView(true);

var rowLevel = 0;
var rowHeights = [];
function calculateRowHeights(){
    rowLevel = 0;
    rowHeights = [];

    var imgItems = document.getElementsByClassName('img-item');
    for(var i=0;i<imgItems.length;){
        var currentMaxHeightofRow = 0;
        for(var j=i;j<i+count && j<imgItems.length;j++){
            console.log('height value:',imgItems[j].heightValue);
            currentMaxHeightofRow = Math.max(currentMaxHeightofRow,imgItems[j].clientHeight);
        }
        i += count;
        rowHeights.push(currentMaxHeightofRow);
    }

    console.log('calculated row heights:',rowHeights);
}
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
    console.log('imgBoxs:',imgBoxs);
    for(var ii=0;ii<imgBoxs.length;ii++){
        console.log('imgBoxs[ii]:',imgBoxs[ii]);
        imgBoxs[ii].addEventListener("click", function(event) {
            console.log('img-box clicked:',event.target);
            elementToScroll = event.target;
            focusElement = getElementNumberThatHasBeenClicked(event.target);
            console.log('focusElement:',focusElement);

        });
    }
}

setAData(); 
setNumData();
function setAData(){
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
    count = Number(localStorage.getItem("numData"));
    setWidth();
}

document.querySelectorAll("a").forEach(function(anchor) {
    anchor.addEventListener("click", function(event) {
        console.log('anchor clicked:',event.target.href);
        setAData();
        setNumData();
        highLightTheCorrectHeader(event.target.href.split('#')[1]);
        setClickonImageBox();
    });
});

document.addEventListener("keydown", function(event) {
    console.log(event.key);

    var blackHeader = document.getElementsByClassName('black-header')[0];
    var blackHeader1 = document.getElementsByClassName('black-header1')[0];
    if (event.key === "h"){
        if(headToogle){
            blackHeader1.style.display = "block";
            blackHeader1.style.position = "fixed";
            blackHeader1.style.top = "0px";
        } 
        else{
            blackHeader1.style.display = 'none';
        }  
        headToogle = !headToogle;
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

    if (event.key === "j" || event.key === "J"){
        var imgItems = document.getElementsByClassName('img-item');
        if (event.key === 'j'){
            focusElement = (focusElement + count)
            modValue = focusElement % count;
            focusElement = focusElement - modValue; 
            
            if(focusElement >= imgItems.length){
                focusElement = imgItems.length - 1;
            }
            navigateToImgNumber(focusElement);
            // if((imgItems.length-1)/count > rowLevel) rowLevel++;
        }
        else{
            focusElement = (focusElement - count)
            modValue = focusElement % count;
            focusElement = focusElement - modValue; 
            if(focusElement < 0){
                focusElement = 0;
            }
            navigateToImgNumber(focusElement);

        }

        var sumOfRowHeights = 0;
        for (var i = 0; i < rowLevel && i < rowHeights.length; i++) {
            sumOfRowHeights += rowHeights[i];
        }
        console.log('blackHeader.clientHeight:',blackHeader.clientHeight);
        console.log('blackHeader1.clientHeight:',blackHeader1.clientHeight);
        // window.scrollTo(0, blackHeader.clientHeight + blackHeader1.clientHeight + sumOfRowHeights);
        return;
    } 
    
    if (event.key === "t") {
        const aElement = document.querySelectorAll("a");
        var url = window.location.href;
        focusElement = 0;
        for(var i=0;i<aElement.length;i++){
            if(aElement[i].href === url){
                if(i=== aElement.length-1) aElement[0].click();
                else aElement[i+1].click();
            }
        }
        return;
    }

    if (event.key === "T") {
        const aElement = document.querySelectorAll("a");
        var url = window.location.href;
        for(var i=0;i<aElement.length;i++){
            if(aElement[i].href === url){
                if(i === 0) aElement[aElement.length-1].click();
                else aElement[i-1].click();
            }
        }
        return
    }

    if (event.key === "r" || event.key === "R") {
        console.log('randome click:');
        if(event.key === "r") random = 'random';
        else random = '';
        var url = window.location.href;
        var currentPage = url.substring(url.indexOf('#')+1);

        if(currentPage === "home" || currentPage.slice(-5) === ".html")
            homeListGenerator(random);
        else{
            currentPage = currentPage.replaceAll('%20'," ");
            var index = getIndex(currentPage);
            imgListGenerator(fileNames[index],mainList[index],random);
        }
    }

    if (event.key === "s") {
        if(count === 10) return;
        count++;
    }
    else if(event.key === "S") {
        if(count === 2) return;
        count--;
    }
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
    else return;
    localStorage.setItem("numData", "" + count);
    console.log('in even lsitioner');
    setWidth();
});

// this is for highlighting the current page header with green color
highLightTheCorrectHeader(); 
function highLightTheCorrectHeader(data){
    console.log('highLightTheCorrectHeader:',data);
    var anchorElements = document.querySelectorAll("a");
    if(data === undefined)
        var currentPage = window.location.href.substring(window.location.href.indexOf('#')+1);
    else
        var currentPage = data;

    console.log('highlighgt currentPage:',currentPage);
    for(var i=0;i<anchorElements.length;i++){
        temp = anchorElements[i].href.split('#')[1];
        console.log('highlight temp:',temp);
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


function navigateToImgNumber(index){
    console.log('navigateToImgNumber:',index);
    var imgItems = document.getElementsByClassName('img-item');
    var element = imgItems[index];
    console.log('element:',element);
    element.scrollIntoView(true);
}