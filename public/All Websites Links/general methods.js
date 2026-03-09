
// this method returns data in below format
// <div class="img-item">
//             <div class="img-box"><img src="Images/{FolderName}/{Filename}"/></div>
//             <div class="img-folder-name" style="display:none;">{FolderName}</div>
//             <div class="img-name">{Filename}</div>
// </div>
function imgItemCreator(imgNameWithExtension,foldername){
    if(consoleLevel === 2){
        console.log('imgItemCreator start:',imgNameWithExtension,foldername);
    }

    var imgItem = document.createElement("div");
    imgItem.setAttribute("class","img-item");

    var imgNameWithoutExtension = imgNameWithExtension.slice(0,imgNameWithExtension.lastIndexOf('.'));
    imgItem.addEventListener('click', async () => await navigator.clipboard.writeText(!includeAnimeOrNot ? imgNameWithoutExtension : imgNameWithoutExtension + " Anime"));

    var imgBox = document.createElement("div");
    imgBox.setAttribute("class","img-box")
    var imgTag = document.createElement("img");
    imgTag.setAttribute("class","img-tag");
    imgTag.setAttribute("src","Images/"+foldername+"/"+imgNameWithExtension);
    
    imgBox.appendChild(imgTag);
    imgBox.addEventListener("click", function(event) {
        elementToScroll = event.target;
        set_FocusElement_onImgClick(event.target); 
    });

    var imgName = document.createElement("div");
    imgName.setAttribute("class","img-name");

    if(videoFileExtensions.some(ext => imgNameWithExtension.endsWith(ext))){
        if(consoleLevel === 2){
            console.log('File that got colored to yellow:',image.src);
        }
        imgName.classList.add('yellow-text');
    }

    imgName.innerHTML = showImgExetension ? imgNameWithExtension : imgNameWithoutExtension;

    var widthPercentValue = ( 100 / no_Of_Imgs_Per_Row ) + "%";  
    imgItem.style.width = widthPercentValue;
    
    imgItem.appendChild(imgBox);

    var imgFolderName = document.createElement("div");
    imgFolderName.innerHTML = foldername;
    imgFolderName.setAttribute("class","img-folder-name");
    imgFolderName.setAttribute("style","display:none;");
    imgItem.appendChild(imgFolderName);

    imgItem.appendChild(imgName);

    return imgItem;
}

// sorting order can be "random", "asc" or "desc"
// empties the imgs-container
// calls imgItemCreator for each image and appends it to the imgs-container
// called when url doesn't have foldername mentioned or url ends with home or .html
// when currently on home page and when we click on 'r' or 'R' or 't' this method will get fired.
function homeListGenerator(sortingOrder){
    if(consoleLevel === 1){
        console.log('homeListGenerator start:',sortingOrder);
    }

    fullList = [];
    for(var i=0;i<fileNames.length;i++)
        fullList.push(...mainList[i]);

    tempSet = new Set(fullList);
    fullList = [...tempSet];

    if(sortingOrder === 'random')
        fullList.sort(() => Math.random() - 0.5);
    else if(sortingOrder === 'desc')
        fullList.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
    else
        fullList.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    var imgContainer = document.getElementById("imgs-container");
    imgContainer.innerHTML = "";
    fullList.forEach((value)=>{
        for(var i=0;i<fileNames.length;i++){
            if(mainList[i].includes(value)){
                imgContainer.appendChild(imgItemCreator(value,fileNames[i]));
            }
        }
    })
}

// sorting order can be "random", "asc" or "desc"
// imgNamePresentInFolder is the list of img name present in an particular folder
// empties the imgs-container
// calls imgItemCreator for each image present in the {foldername} and appends it to the imgs-container
// called when url has foldername mentioned in it
// when currently on folder page and when we click on 'r' or 'R' or 't' this method will get fired.
function imgListGenerator(foldername,imgNamePresentInFolder,sortingOrder){

    if(consoleLevel === 1){
        console.log('imgListGenerator start:',foldername,imgNamePresentInFolder,sortingOrder);
    }

    var imgContainer = document.getElementById("imgs-container");
    imgContainer.innerHTML = "";

    imgNamePresentInFolder = [...imgNamePresentInFolder];
    if(sortingOrder === 'random')
        imgNamePresentInFolder.sort(() => Math.random() - 0.5);
    else if(sortingOrder === 'desc')
        imgNamePresentInFolder.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
    
    imgNamePresentInFolder.forEach((value)=>{
        imgContainer.appendChild(imgItemCreator(value,foldername));
    })
}

// like "Alina Becker" or "1 Main" or "5 Pics Data"
// this method works for both localhost or without localhost url
function getCategoryNameFromUrl(){
    var url = window.location.href;
    var splitData = url.split("/");
    // last but two
    var categoryName = splitData[splitData.length - 3].replaceAll('%20',' ');
    if(consoleLevel === 1){
        console.log('getCategoryNameFromUrl called:',categoryName);
    }
    return categoryName;
}

// like "Alina Becker List" or "Ani List" or "Not Completed List"
// this method works for both localhost or without localhost url
function getWebsiteNameFromUrl(){
    var url = window.location.href;
    var splitData = url.split("/");
    // last but one
    var websiteName = splitData[splitData.length - 2].replaceAll('%20',' ');
    if(consoleLevel === 1){
        console.log('getWebsiteNameFromUrl called:',websiteName);
    }
    return websiteName;
}

// like "1 Hype" or "1 relaxing"
// this method works for both localhost or without localhost url
function getFolderNameFromUrl(){
    var url = window.location.href;
    var folderName = url.split("#")[1].replaceAll('%20',' ');
    if(consoleLevel === 1){
        console.log('getFolderNameFromUrl called:',folderName);
    }
    return folderName;
}

function space_to_Percentile20(text){
    var updatedText = text.replaceAll(' ','%20');
    if(consoleLevel === 3){
        console.log('space_to_Percentile20 called:',text,updatedText);
    }
    return updatedText;
}

function percentile20_to_Space(text){
    var updatedText = text.replaceAll('%20',' ');
    if(consoleLevel === 3){
        console.log('percentile20_to_Space called:',text,updatedText);
    }
    return updatedText;
}

// this method returns the index of the foldername in fileNames list
// if foldername is not present in fileNames list then it returns 0
function getFolderIndex(folderName){
    if(consoleLevel === 1){
        console.log('getFolderIndex called:',folderName);
    }

    for(var i=0;i<fileNames.length;i++)
        if(fileNames[i] === folderName){
            return i;
        }
    return 0;
}

// this method updates imgs to be shown when we click on an header item
function changeList(folderName){
    if(consoleLevel === 1){
        console.log('changeList called:',folderName);
    }

    if(folderName === 'home')   homeListGenerator();
    else{
        var index = getFolderIndex(folderName);
        imgListGenerator(fileNames[index],mainList[index]);
    }
}

// returns URL Path Data - irrespective of localhost or without localhost url
    // URL path Data -> when we click on 'u', URL path data will get copied to clipboard
    // Example: All Websites Links/1 Main/Ani List/index.html#1%20relaxing
    // we can use that data to update in public/index.html
function getUrlPathData(){
    var data = window.location.href;
    console.log('getUrlPathData data:',data);
    if(data.includes(localHostURL)){
        var content = data.substring(localHostURL.length);
    }
    else{
        var content = data.substring(space_to_Percentile20(nrmlURL).length);
    }
    var splits = content.split('#');
    var URLPathData = splits[0].replaceAll('%20',' ') + '#' + splits[1];
    if(consoleLevel === 1){
        console.log('getUrlPathData called:',URLPathData);
    }
    return URLPathData;
}

// return img names seperated by new line.
// when we are doing search, then few img-items will get hidden, 
// this method will ignore those hidden items and copy only visible img names to clipboard
function getAllVisibleImgNames() {
    var data = "";
    var imgName = document.querySelectorAll(".img-name");
    for(var i = 0; i < imgName.length; i++) {
        var imgItem = imgName[i].parentElement;
        if(imgItem.style.display === "none") continue; // skip if img is hidden
        var name = imgName[i].innerHTML;
        data += `${name}\n`;
    }

    if(consoleLevel === 1){
        console.log('getAllVisibleImgNames called:',data);
    }
    return data;
}

// when 
function getAllSelectedImgNames(){
    var selectedImgs = document.getElementsByClassName('selected-img');
    var imgNamesString = '';
    for(var i=0;i<selectedImgs.length;i++){
        var imgName = selectedImgs[i].getElementsByClassName('img-name')[0].innerText;
        imgNamesString += imgName + '\n';
    }
    return imgNamesString;
}

// returns path that we can use to open folder in file explorer
// we can take any img src because all imgs are in same folder, 
// so src of any img will give us the path of that folder
// it works for both localhost or without localhost url, it will return path accordingly
function getPathToOpenInFileExplorer() {
    var path = space_to_Percentile20(`${nrmlURL}${folderInsidePublic}${getCategoryNameFromUrl()}/${getWebsiteNameFromUrl()}/Images/${getFolderNameFromUrl()}`);

    if(consoleLevel === 1){
        console.log('getPathToOpenInFileExplorer called:',path);
    }
    return path;
}

// when we goto top row or below row or when we goto an focus element
// that element would be visible crct but on the same row some imgs might be outside of the screen
// to make sure that wont happen this methods handles the logic
function balanceRowLevel(){
    var imgItems = document.getElementsByClassName('img-item');
    console.log('balanceRowLevel',focusElement);

    var rowStartIndex = focusElement - (focusElement % no_Of_Imgs_Per_Row);
    var rowEndIndex = Math.min(rowStartIndex + no_Of_Imgs_Per_Row, imgItems.length);

    console.log(rowStartIndex,rowEndIndex);

    var maxHeight = 0;
    var tallestImgIndex = rowStartIndex;
    
    for(var k = rowStartIndex; k < rowEndIndex; k++){
        if(imgItems[k].clientHeight > maxHeight){
            maxHeight = imgItems[k].clientHeight;
            tallestImgIndex = k;
        }
    }
    console.log('tallestImgIndex',tallestImgIndex)
    focusElement = tallestImgIndex;
    navigateToImgNumber(focusElement);
}

// this method is used to return img index that has been clicked,
// first img will have index 0.
// the returned value will be use to update the focusElement.
function getElementNumberThatHasBeenClicked(element){
    var imgItems = document.getElementsByClassName('img-item');
    var newFocusIndex = -1;
    for(var j=0;j<imgItems.length;j++){
        var tempElement = imgItems[j].getElementsByTagName('img')[0];
        if(tempElement === element){
            newFocusIndex = j;
            break;
        }
    }
    if(consoleLevel === 1){
        console.log('getElementNumberThatHasBeenClicked called, newFocusIndex:',newFocusIndex);
    }
    return newFocusIndex;
}

// when an img-box is clicked, focusElement will get update to index of the img-box 
function set_On_Click_Event_ForImageBoxs(){
    var imgBoxs = document.getElementsByClassName('img-box');
    for(var i=0;i<imgBoxs.length;i++){
        imgBoxs[i].addEventListener("click", function(event) {
            elementToScroll = event.target;
            focusElement = getElementNumberThatHasBeenClicked(event.target);
        });
    }
}  

function set_FocusElement_onImgClick(clickedImgBoxElement){
    focusElement = Array.from(document.getElementsByClassName('img-item'))
    .findIndex(item => item.querySelector('img') === clickedImgBoxElement)
    if(consoleLevel === 1) 
        console.log('set_FocusElement_onImgClick focusElement updated to:',focusElement);
}

// this method will make rowLevel = 0 and calculates row heights.
// Example, when no_Of_Imgs_Per_Row is 4, then it will calculate max height for each 4 img-boxees and push it to rowHeights array,
// so rowHeights[0] will have max height of first 4 img-boxees, rowHeights[1] will have max height of next 4 img-boxees and so on.
function calculateRowMaxImageHeights(){
    if(consoleLevel === 1){
        console.log('calculateRowMaxImageHeights entered no_Of_Imgs_Per_Row',no_Of_Imgs_Per_Row);
    }
    rowHeights = [];

    var imgItems = document.getElementsByClassName('img-item');
    for(var i=0;i<imgItems.length;i++){
        var currentMaxHeightofRow = 0;
        for(var j=i;j<i+no_Of_Imgs_Per_Row && j<imgItems.length;j++){
            // console.log('height value:',imgItems[j].heightValue);
            currentMaxHeightofRow = Math.max(currentMaxHeightofRow,imgItems[j].clientHeight);
        }
        i += no_Of_Imgs_Per_Row;
        rowHeights.push(currentMaxHeightofRow);
    }
    if(consoleLevel === 1){
        console.log('calculateRowMaxImageHeights ended, rowHeights:',rowHeights);
    }
}
// same method instead of img-item, we are calculating max height for img-boxes
// function calculateRowMaxImageHeights(){
//     rowHeights = [];

//     var imgBoxes = document.getElementsByClassName('img-box');
//     for(var i=0;i<imgBoxes.length;){
//         var currentMaxHeightofRow = 0;
//         for(var j=i;j<i+no_Of_Imgs_Per_Row && j<imgBoxes.length;j++){
//             // console.log('height value:',imgBoxes[j].heightValue);
//             currentMaxHeightofRow = Math.max(currentMaxHeightofRow,imgBoxes[j].clientHeight);
//         }
//         i += no_Of_Imgs_Per_Row;
//         rowHeights.push(currentMaxHeightofRow);
//     }
//     if(consoleLevel === 1){
//         console.log('calculateRowMaxImageHeights called, rowHeights:',rowHeights);
//     }
// }

// this method will set width of all img-items based on no_Of_Imgs_Per_Row value,
// Example, when no_Of_Imgs_Per_Row is 4, then width of each img-item will be 25%

function setWidthForAll_ImgItems_Based_No_Of_Imgs_Per_Row(){
    const imgItems = document.querySelectorAll(".img-item");

    var widthPercentValue = ( 100 / no_Of_Imgs_Per_Row ) + "%";  
    imgItems.forEach(function(imgItem) {
        imgItem.style.width = widthPercentValue;
    });

    if(consoleLevel === 1){
        console.log('setWidthForAll_ImgItems_Based_No_Of_Imgs_Per_Row called, no_Of_Imgs_Per_Row:',no_Of_Imgs_Per_Row,'widthPercentValue:',widthPercentValue);
    }

    if(imgItems.length == 0) 
        return; // no images in a folder case
}

// when '-' or '=' are entered img width will decresed/increased
// img tag's width will be reduced
function changeWidth_For_Minus_Equal_Keys(enterredKey){
    if(consoleLevel === 1){
        console.log('changeWidth_For_Minus_Equal_Keys called:', enterredKey,'current initialImgWidthPercent:',initialImgWidthPercent);
    }

    if(enterredKey === '=')
        initialImgWidthPercent += 1;
    else
        initialImgWidthPercent -= 1;

    var imgs = document.querySelectorAll('.img-tag');
    for(var i=0;i<imgs.length;i++){
        imgs[i].style.width = initialImgWidthPercent + '%';
    }
}

function navigateToFocusElement(){
    var imgTags = document.getElementsByClassName('img-tag');
    var element = imgTags[focusElement];
    element.scrollIntoView(scroll_To_Top_OR_Bottom_Of_Img);
}

function navigateDownByValue(value){
    window.scrollBy(0,value);
}

function navigateUpByValue(value){
    window.scrollBy(0,value * -1);
}

// this method will take us to top of page with in an page,
// suppose we are at the middle of page, near 15th image, then when we click on 'w' then
// navigateToTop method will take us to top of the page
function navigateToTop(){
    document.body.scrollIntoView(true);
}

//  when we click on 'W' then navigateToBottom method will take us to bottom of the page.
function navigateToBottom(){
    document.body.scrollIntoView(false);
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

    var imgTags = document.getElementsByClassName('img-tag');
    if(imgTags.length === 0) return; // no images in a folder case

    var element = imgTags[index];
    element.scrollIntoView(scroll_To_Top_OR_Bottom_Of_Img);
}

// this will make SearchMode = false and makes search-box hidden
function disableSearchMode(){
    var searchBox = document.querySelector('.search-box');
    searchBox.style.display = 'none';
    searchMode = false;
}

// this will make SearchMode = true and makes search-box visible
function enableSearchMode(){
    var searchBox = document.querySelector('.search-box');
    searchBox.style.display = 'block';
    searchMode = true;
}

function clearSearchValue(){
    var searchBox = document.querySelector('.search-box');
    searchBox.value = '';
}

// this is for highlighting the current folder on header with green color
// it will make all anchor elements font weight normal and color white, 
// then it will make current folder anchor element font weight bold and color green for both header and header1
function highLightTheCorrectHeader(folderName_With_Percentile20){
    var anchorElements = document.querySelectorAll("a");

    if(folderName_With_Percentile20 === undefined) // this is case when we open website for the first time.
        var folderName_With_Percentile20 = space_to_Percentile20(getFolderNameFromUrl());

    var url = window.location.href; 

    if(url.endsWith('.html')){
        folderName_With_Percentile20 = 'home';
    }

    if(consoleLevel === 1){
        console.log('highLightTheCorrectHeader called, folderName_With_Percentile20:',folderName_With_Percentile20);
    }

    for(var i=0;i<anchorElements.length;i++){
        var anchorFolderName_With_Percentile20 = anchorElements[i].href.split('#')[1];
        if(anchorFolderName_With_Percentile20 === folderName_With_Percentile20){
            anchorElements[i].style.fontWeight = "bold";
            anchorElements[i].style.color = "#0add96";   
        }
        else{
            anchorElements[i].style.fontWeight = "normal";
            anchorElements[i].style.color = "white";
        }
    }
}

function getButton_BasedOn_InnerHTML(innerHtmlValue){
    var allButtons = document.querySelectorAll('button');
    for(var i=0;i<allButtons.length;i++){
        if(allButtons[i].innerHTML === innerHtmlValue)
            return allButtons[i];
    }
    return null;
}