// this method returns data in below format
// <div class="img-item">
//             <div class="img-box"><img src="Images/{FolderName}/{Filename}"/></div>
//             <div class="img-folder-name" style="display:none;">{FolderName}</div>
//             <div class="img-name">{Filename}</div>
// </div>
// yellow-color setting for video files
// img width setup
// when img is clicked focusElement is update (that listner also set)
// when we click on img, img name will be copied( if includeAnimeOrNot = true, then img name + " Anime" copied)
function imgItemCreator(imgNameWithExtension,foldername){
    if(consoleLevel === 2){
        console.log('imgItemCreator start:',imgNameWithExtension,foldername);
    }

    var imgItem = document.createElement("div");
    imgItem.setAttribute("class","img-item");

    var imgNameWithoutExtension = imgNameWithExtension.slice(0,imgNameWithExtension.lastIndexOf('.'));
    imgItem.addEventListener('click', async () => {
            if(!multipleElementsSelectionMode) 
                await navigator.clipboard.writeText(!includeAnimeOrNot ? imgNameWithoutExtension : imgNameWithoutExtension + " Anime");
            else{
                console.log('multipleElementsSelectionMode imgitem clicked');

                // console.log('event.target:',event.target);
                // console.log('event.target parent:',event.target.parentElement);
                var element = event.target;
                while(true){
                    // console.log('inside while:'+element);
                    if(element.classList.contains('img-item')){
                        // console.log('while breaking');
                        break;

                    }
                    element = element.parentElement;
                }
                // console.log('corect event.target:',element);

                element.classList.toggle('selected-img'); // selected-img always gets added here
                if(!selectedImagesList.includes(element.querySelector('img').src)){
                    selectedImagesList.push(element.querySelector('img').src);
                }
                else{
                    selectedImagesList.splice(selectedImagesList.indexOf(element.querySelector('img').src),1);
                }

                console.log('selected Img List:',selectedImagesList);
            }
    });

    imgItem.addEventListener('dblclick', async (event) => {
        console.log('dblckick',event.target);
        var fileExplorerFolderPath = event.target.src;
        fileExplorerFolderPath = fileExplorerFolderPath.substring(0, fileExplorerFolderPath.lastIndexOf('/'));
        console.log('fileExplorerFolderPath:',fileExplorerFolderPath);
        await navigator.clipboard.writeText(fileExplorerFolderPath);
    });

    var imgBox = document.createElement("div");
    imgBox.setAttribute("class","img-box")
    var imgTag = document.createElement("img");
    imgTag.setAttribute("class","img-tag");
    imgTag.setAttribute("src","Images/"+foldername+"/"+imgNameWithExtension);
    imgTag.addEventListener("click", function(event) {
        set_FocusElement_onImgClick(event.target); 
    });
    
    imgBox.appendChild(imgTag);

    // deletion button logic
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "X";
    deleteButton.style.display = 'none'; // Initially hide the button
    deleteButton.setAttribute("class", "delete-button");
    deleteButton.onclick = function() {
        var imgBox = this.parentElement; // Get the parent img-box
        var imgElement = imgBox.querySelector('.img-tag'); // Get the img-tag element inside the img-box
        
        deleteFile(imgElement.src); // server method to delete the img

        var imgItem = imgBox.parentElement;
        imgItem.remove(); // Remove the img-box from the DOM

        updateHeaderCounts();

        setTimeout(() => {
            sendData(); // to update the current website
        }, 2000); // Delay to allow the deleteFile function to complete
    };
    imgBox.appendChild(deleteButton);

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

    var imgNameInputBox = document.createElement('input');
    imgNameInputBox.name = 'imageName';
    imgNameInputBox.value = !includeFileExtensions ? imgNameWithoutExtension : imgNameWithExtension;
    imgNameInputBox.setAttribute('class','img-name-input-box');
    imgItem.appendChild(imgNameInputBox);
    
    imgNameInputBox.addEventListener('focus',function(){
        fileNameChangeFocusMode = true;
    })

    imgNameInputBox.addEventListener('blur',function(){
        fileNameChangeFocusMode = false;
    })

    imgNameInputBox.style.display = 'none';

    var submitButton = document.createElement('button');
    submitButton.innerHTML = 'Update FileName';
    submitButton.setAttribute('class','submit-button');
    submitButton.style.display = 'none';
    imgItem.appendChild(submitButton);

    submitButton.onclick = function(){
        var parentElement = this.parentElement;
        var currentImgUrl = parentElement.querySelector('img').src;
        var newImageName = parentElement.querySelector('input').value;
        // console.log('currentImgUrl:'+currentImgUrl);
        // console.log('newImageName:'+newImageName);

        if(!includeFileExtensions){
            // var splitData = currentImgUrl.split('.');
            // var lastIndexOf = currentImgUrl.lastIndexOf('.');
            var tempSplitData = currentImgUrl.split('.');
            // '.' + tempSplitData[tempSplitData.length - 1];
            // console.log('url string')
            newImageName = newImageName + '.' + tempSplitData[tempSplitData.length - 1];
        }
        renameFile(currentImgUrl,newImageName);

        var imgName = parentElement.querySelector('.img-name');
        imgName.innerHTML = newImageName.split('.')[0];

        setTimeout(() => {
            // console.log('sendData 5secs called after deleteFile');
            sendData(); // to update the website
            // imgBox.remove(); // Remove the img-box from the DOM
        }, 2000);

    }

    // recheck
    // var hidden_ImgTag_WithFileExtension = document.createElement('div');
    // hidden_ImgTag_WithFileExtension.innerHTML = imgNameWithExtension;
    // hidden_ImgTag_WithFileExtension.style.display = 'none';
    // hidden_ImgTag_WithFileExtension.classList.add('hidden-img-tag-with-file-extension');
    // imgItem.appendChild(hidden_ImgTag_WithFileExtension);

    return imgItem;
}

// uses sorting order global variable
// empties the imgs-container
// calls imgItemCreator for each image and appends it to the imgs-container
// called when url doesn't have foldername mentioned or url ends with home or .html
// when currently on home page and when we click on 'r' or 'R' or 't' this method will get fired.
function homeListGenerator(){
    if(consoleLevel >= 1){
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

// uses sorting order global varaible
// imgNamePresentInFolder is the list of img name present in an particular folder
// empties the imgs-container
// calls imgItemCreator for each image present in the {foldername} and appends it to the imgs-container
// called when url has foldername mentioned in it
// when currently on folder page and when we click on 'r' or 'R' or 't' this method will get fired.
function imgListGenerator(foldername,imgNamePresentInFolder){

    if(consoleLevel >= 1){
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
    if(consoleLevel >= 1){
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
    if(consoleLevel >= 1){
        console.log('getWebsiteNameFromUrl called:',websiteName);
    }
    return websiteName;
}

// like "1 Hype" or "1 relaxing"
// this method works for both localhost or without localhost url
function getFolderNameFromUrl(){
    var url = window.location.href;
    console.log('getFolderNameFromUrl url',url);
    console.log('url split',url.split("#"));
    var folderName = url.split("#")[1].replaceAll('%20',' ');
    if(consoleLevel >= 1){
        console.log('getFolderNameFromUrl called:',folderName);
    }
    return folderName;
}

function space_to_Percentile20(text){
    var updatedText = text.replaceAll(' ','%20');
    if(consoleLevel === 2){
        console.log('space_to_Percentile20 called:',text,updatedText);
    }
    return updatedText;
}

function percentile20_to_Space(text){
    var updatedText = text.replaceAll('%20',' ');
    if(consoleLevel === 2){
        console.log('percentile20_to_Space called:',text,updatedText);
    }
    return updatedText;
}

// this method returns the index of the foldername in fileNames list
// if foldername is not present in fileNames list then it returns 0
function getFolderIndex(folderName){
    if(consoleLevel >= 1){
        console.log('getFolderIndex called:',folderName);
    }

    for(var i=0;i<fileNames.length;i++)
        if(fileNames[i] === folderName){
            return i;
        }
    return -1;
}

// this method updates imgs to be shown when we click on an header item
function changeList(folderName){
    if(consoleLevel >= 1){
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
    if(data.includes(localHostURL)){
        var content = data.substring(localHostURL.length);
    }
    else{
        var content = data.substring(space_to_Percentile20(nrmlURL).length);
    }
    var splits = content.split('#');
    var URLPathData = splits[0].replaceAll('%20',' ') + '#' + splits[1];
    if(consoleLevel >= 1){
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

    if(consoleLevel >= 1){
        console.log('getAllVisibleImgNames called:',data);
    }
    return data;
}

function getAllSelectedImgNames(){
    var selectedImgs = document.getElementsByClassName('selected-img');
    var imgNamesString = '';
    for(var i=0;i<selectedImgs.length;i++){
        var imgName = selectedImgs[i].getElementsByClassName('img-name')[0].innerText;
        imgNamesString += imgName + '\n';
    }
    if(consoleLevel >= 1)
        console.log('getAllSelectedImgNames imgNamesString:',imgNamesString);
    return imgNamesString;
}

// returns path that we can use to open folder in file explorer
// we can take any img src because all imgs are in same folder, 
// so src of any img will give us the path of that folder
// it works for both localhost or without localhost url, it will return path accordingly
function getPathToOpenInFileExplorer() {
    var path = space_to_Percentile20(`${nrmlURL}${folderInsidePublic}${getCategoryNameFromUrl()}/${getWebsiteNameFromUrl()}/Images/${getFolderNameFromUrl()}`);

    if(consoleLevel >= 1){
        console.log('getPathToOpenInFileExplorer called:',path);
    }
    return path;
}

// when we goto top row or below row or when we goto an focus element
// that element would be visible crct but on the same row some imgs might be outside of the screen
// to make sure that wont happen this methods handles the logic
function balanceRowLevel(){
    var imgItems = document.getElementsByClassName('img-item');

    if(imgItems.length === 0){
        return; // when there are no imgs then return;
    }

    if(consoleLevel >= 1){
        console.log('balanceRowLevel focusElement:',focusElement);
    }

    var rowStartIndex = focusElement - (focusElement % no_Of_Imgs_Per_Row);
    var rowEndIndex = Math.min(rowStartIndex + no_Of_Imgs_Per_Row, imgItems.length);

    var maxHeight = 0;
    var tallestImgIndex = rowStartIndex;
    
    for(var k = rowStartIndex; k < rowEndIndex; k++){
        if(imgItems[k].clientHeight > maxHeight){
            maxHeight = imgItems[k].clientHeight;
            tallestImgIndex = k;
        }
    }
    navigateToImgNumber(tallestImgIndex);
}

function set_FocusElement_onImgClick(clickedImgBoxElement){
    focusElement = Array.from(document.getElementsByClassName('img-tag'))
    .findIndex(item => item === clickedImgBoxElement)
    if(consoleLevel >= 1) 
        console.log('set_FocusElement_onImgClick focusElement updated to:',focusElement);
}

// this method will set width of all img-items based on no_Of_Imgs_Per_Row value,
// Example, when no_Of_Imgs_Per_Row is 4, then width of each img-item will be 25%
function setWidthForAll_ImgItems_Based_No_Of_Imgs_Per_Row(){
    const imgItems = document.querySelectorAll(".img-item");

    var widthPercentValue = ( 100 / no_Of_Imgs_Per_Row ) + "%";  
    imgItems.forEach(function(imgItem) {
        imgItem.style.width = widthPercentValue;
    });

    if(consoleLevel >= 1){
        console.log('setWidthForAll_ImgItems_Based_No_Of_Imgs_Per_Row called, no_Of_Imgs_Per_Row:',no_Of_Imgs_Per_Row,'widthPercentValue:',widthPercentValue);
    }

    if(imgItems.length == 0) 
        return; // no images in a folder case
}

// when '-' or '=' are entered img width will decresed/increased
// img tag's width will be reduced
function changeWidth_For_Minus_Equal_Keys(enterredKey){
    if(consoleLevel >= 1){
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

function navigateDownByValue(value){
    if(consoleLevel >= 1)
        console.log('navigateDownByValue:',value);
    window.scrollBy(0,value);
}

function navigateUpByValue(value){
    if(consoleLevel >= 1)
        console.log('navigateUpByValue:',value);
    window.scrollBy(0,value * -1);
}

// this method will take us to top of page with in an page,
// suppose we are at the middle of page, near 15th image, then when we click on 'w' then
// navigateToTop method will take us to top of the page
function navigateToTop(){
    if(consoleLevel >= 1)
        console.log('navigateToTop');
    document.body.scrollIntoView(true);
}

//  when we click on 'W' then navigateToBottom method will take us to bottom of the page.
function navigateToBottom(){
    if(consoleLevel >= 1)
        console.log('navigateToBottom');   
    document.body.scrollIntoView(false);
}

function navigateToImgNumber(index){
    if(consoleLevel >= 1){
        console.log('navigateToImgNumber index:',index, 'scroll_To_Top_OR_Bottom_Of_Img',scroll_To_Top_OR_Bottom_Of_Img)
    }
    var imgTags = document.getElementsByClassName('img-tag');
    if(imgTags.length === 0) return; // no images in a folder case - this check no longer needed i guess

    var element = imgTags[index];
    element.scrollIntoView(scroll_To_Top_OR_Bottom_Of_Img);
}

// this will make SearchMode = false and makes search-box hidden
function disableSearchMode(){
    if(consoleLevel >= 1)
        console.log('disableSearchMode');   
    var searchBox = document.querySelector('.search-box');
    searchBox.style.display = 'none';
    searchMode = false;
}

// this will make SearchMode = true and makes search-box visible
function enableSearchMode(){
    if(consoleLevel >= 1)
        console.log('enableSearchMode');   
    var searchBox = document.querySelector('.search-box');
    searchBox.style.display = 'block';
    searchMode = true;
    searchBox.focus();
}

function ToogleSearchMode(){
    var searchBox = document.querySelector('.search-box');
    searchMode = !searchMode;
    if(consoleLevel >= 1)
        console.log('ToogleSearchMode searchMode after toogling',searchMode);   
    searchBox.style.display = searchMode ? 'block' : 'none';
    if(searchMode)
        searchBox.focus();
}

function clearSearchValue(){
    if(consoleLevel >= 1)
        console.log('clearSearchValue');   
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

    if(consoleLevel >= 1){
        console.log('highLightTheCorrectHeader called, folderName_With_Percentile20:',folderName_With_Percentile20);
    }
    
    var atleastOneMatchFound = false;

    for(var i=0;i<anchorElements.length;i++){
        var anchorFolderName_With_Percentile20 = anchorElements[i].href.split('#')[1];
        if(anchorFolderName_With_Percentile20 === folderName_With_Percentile20){
            anchorElements[i].style.fontWeight = "bold";
            anchorElements[i].style.color = "#0add96";   
            atleastOneMatchFound = true;
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

function ifAnyOfWriteModeIsTrue(){
    return searchMode || M_Mode || fileNameChangeFocusMode;
}

function isLetter(char){
    return char.length === 1 && ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'));
}

function isDigit(char) {
    return char >= '0' && char <= '9';
}

// will call homeList or imgList(for folder page) based on current url
function call_HomeList_OR_imgList_Generator(){
    var url = window.location.href;
    var folderName = getFolderNameFromUrl();
    
    if(folderName === "home" || url.slice(-5) === ".html"){
        if(consoleLevel >= 1){
            console.log('call_HomeList_OR_imgList_Generator home page');
        }
        homeListGenerator();
    }
    else{
        if(consoleLevel >= 1){
            console.log('call_HomeList_OR_imgList_Generator folder page:',folderName);
        }
        var index = getFolderIndex(folderName); 
        if(index === -1){ // #hash part of url doesn't match any folder names
            var firstFolderName = document.querySelectorAll('.black-header a')[1];

            window.location.hash = '#' + firstFolderName.href.split('#')[1];
            index = 0;
        }
        imgListGenerator(fileNames[index],mainList[index]);
    }
}

// setting no.of imgs counts for black-header and black-header1 (setting logic)
function setHomePage_AND_AllFolderImgCounts(){
    if(consoleLevel >= 1){
        console.log('setHomePage_AND_AllFolderImgCounts called');
    }

    var allFilesCount = 0;
    for(var i=0;i<fileNames.length;i++){
        allFilesCount += mainList[i].length;
        document.getElementById("data-"+(space_to_Percentile20(fileNames[i]))).innerHTML = mainList[i].length;
        document.getElementById("data1-"+(space_to_Percentile20(fileNames[i]))).innerHTML = mainList[i].length;
    }
    document.getElementById("data0").innerHTML = allFilesCount; // home page no of imgs
    document.getElementById("data1").innerHTML = allFilesCount; // home page no of imgs
}
