// if main link, open avg link in new tab, if avg link, open main link in new tab
// main link -> file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/All%20Websites%20Links/Alina%20Becker/Alina%20Becker%20Tier%201/Images/0%20Pale%20Black
// avg link  -> file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/All%20Websites%20Links/Alina%20Becker/Alina%20Becker%20Tier%201%20-%20Avg/Images/0%20Pale%20Black
function ctrlEnter(){
    var categoryName = getCategoryNameFromUrl();
    if(starNamesList.includes(categoryName)){
        
        var url = window.location.href;
        var splitData = url.split("/");

        var lastButOnePart = splitData[splitData.length - 2];
        // lastButOnePart - is website name

        if(consoleLevel === 2)
            console.log('ctrlEnter lastButOnePart ctrl enter:',lastButOnePart);
        
        // replace last but one part of URL
        if(lastButOnePart.includes('Avg')){
            splitData[splitData.length - 2] = lastButOnePart.replace('%20-%20Avg','');
        }
        else{
            splitData[splitData.length - 2] = lastButOnePart + '%20-%20Avg';
        }

        var newUrl = splitData.join("/");
        if(consoleLevel === 2){
            console.log('ctrlEnter newUrl ctrl enter:',newUrl);
        }
        window.open(newUrl, '_blank');
    }   
}

function openShortcutsFile(){
    var anchorElement = document.createElement("a");
    anchorElement.href = "../../Shortcut Keys.html";
    anchorElement.target = "_blank"; // Open in a new tab
    anchorElement.click();
}

function searchOperation(enteredKey, isCtrlKey){
    if(consoleLevel >= 1){
        console.log('searchOperation called');
    }
    var searchBox = document.querySelector('.search-box');

    if(enteredKey === "Shift" && !isCtrlKey){ // to empty the search box
        searchBox.value = '';

        // when we are clearing the searchBox.value, input event is not getting fired by default
        // so im' firing it manually
        const inputEvent = new Event('input', {
            bubbles: true,    // Allows the event to move up the DOM tree
            cancelable: true  // Allows the event to be canceled if needed
        });

        // 3. Dispatch (fire) the event
        searchBox.dispatchEvent(inputEvent);
    }
}

// when tabs are -> home, hype, rom-com, relaxing, hero
// when we are on hype tab, when we are M_Mode and enter h, then it will search for tab starting with 'h'
// search starting from current tab and goes to right direct.
// we are on hype tab, enter h, then we will get redirected to hero tab
// if we enter 'h' again, we will get redirected to home tab
// if we enter 'r' now we will get redirected to 'rom-com' tab
// this will redirect even to home tab
function M_Mode_Operation(enteredKey){
    const aElement = document.querySelectorAll("a");
    var url = window.location.href;

    var searchStartIndex = 1;

    if(url.endsWith('.html')){ // when url is dfsdfsdf.html - without #home
        searchStartIndex = 1;
    }
    else{
        for(var i=0;i<aElement.length;i++){
            if(aElement[i].href === url){
                searchStartIndex = i + 1;
                break;
            }
        }
    }

    // no there will have 2 sets of anchor tags
    // one set is for black-header and other set is for black-header1
    // when tabs are -> home, hype, rom-com, relaxing, hero
    // when we are on "relaxing" tab, then search starts from "hero" tab
    // after hero tab, index will increase further but now 2nd set of black-header1 anchors starts
    // and it will go "home", "hype" and then "rom-com" -> these are for 2nd set i.e for black-header1
    var numberOfIterations = aElement.length;
    while(numberOfIterations--){
        if(searchStartIndex >= aElement.length) searchStartIndex = 0;
        var startingLetterofAnchor = aElement[searchStartIndex].href.split('#')[1][0];
        if(startingLetterofAnchor.toLowerCase() === enteredKey.toLowerCase()){
            aElement[searchStartIndex].click();
            break;
        }
        searchStartIndex++;
    }
    // if no matching tab with starting letter, then no redirection happens
}

function arrowLeftOrRightClicked(keyEntered){
    const blackHeader_Anchors = document.querySelectorAll(".black-header a");

    var currFolder_Percentile20 = space_to_Percentile20(getFolderNameFromUrl());
            
    for(var i=0;i<blackHeader_Anchors.length;i++){
        var anchorHrefValue = blackHeader_Anchors[i].href.split('#')[1];
        if(anchorHrefValue === currFolder_Percentile20){

            if(keyEntered === "ArrowRight"){
                if(i===blackHeader_Anchors.length-1){
                    // if we are on last tab, then go to 2nd tab instead of home tab
                    blackHeader_Anchors[1].click();
                }
                else{
                    blackHeader_Anchors[i+1].click();
                }
            }

            else{
                if(i === 0 || i === 1){ // if we are on 1st or 2nd tab goto last tab
                    // since we should not be going to home tab(1st tab)
                    blackHeader_Anchors[blackHeader_Anchors.length-1].click();
                }
                else{
                    blackHeader_Anchors[i - 1].click();
                }
            }

            break;
        }
    }
}

function arrowTopOrBottomClicked(keyEntered, isShiftKey){
    console.log('arrowTopOrBottomClicked keyEntered:',keyEntered,"isShiftKey",isShiftKey);
    var imgItems = document.getElementsByClassName('img-item');

    if(isShiftKey){
        // if shift + up/down key then always scroll by 100
        window.scrollBy(0,keyEntered === "ArrowUp" ? -100 : 100);
        return;
    }
    
    if(imgRankingchangeMode){
        var imgItems = document.getElementsByClassName('img-item');
    
        console.log('selectImgs:',selectedImagesList);
        var selectedImgNamesList = [];
        for(var i=0;i<selectedImagesList.length;i++)
            selectedImgNamesList.push(selectedImagesList[i].slice(selectedImagesList[i].lastIndexOf('/')+1).replaceAll("%20",' '));
        console.log('selectedImgNamesList:',selectedImgNamesList);
        
        if(selectedImgNamesList.length === 0 ) return;

        var allImgNames = [];
        var imgTags = document.getElementsByClassName('img-tag');
        for(var i=0; i<imgTags.length;i++){
            var imgSrc = imgTags[i].src
            allImgNames.push(imgSrc.slice(imgSrc.lastIndexOf('/')+1).replaceAll('%20',' '));
        }
        console.log('allImgNames:',allImgNames);

        var imgContainer = document.getElementsByClassName('imgs-container')[0];

        if(keyEntered === 'ArrowUp'){
            var firstSelectImgIndex = -1;
            for(var i=0;i<allImgNames.length;i++){
                if(selectedImgNamesList.includes(allImgNames[i])){
                    firstSelectImgIndex = i;
                    break;
                }
            }
            console.log('first selected img Index:',firstSelectImgIndex);

            if(firstSelectImgIndex === 0){
                return;
                // we should not select first img when we are doing up operation
            }

            var listOfImgItemsToBeMoved = [];
            for(var i=0;i<imgItems.length;i++){
                var imgSrc = imgItems[i].querySelector('.img-tag').src;
                var imgName = imgSrc.slice(imgSrc.lastIndexOf('/')+1).replaceAll("%20"," ");
                if(selectedImgNamesList.includes(imgName)){
                    listOfImgItemsToBeMoved.push(imgItems[i]);
                }
            }

            var previousListItem = imgItems[firstSelectImgIndex - 1];
            console.log('previousListItem',previousListItem)
            for(var i=0;i<listOfImgItemsToBeMoved.length;i++){
                imgContainer.insertBefore(listOfImgItemsToBeMoved[i],previousListItem)
            }

            console.log('listOfImgItemsToBeMoved:',listOfImgItemsToBeMoved);
            focusElement = firstSelectImgIndex - 1;
            balanceRowLevel();
        }
        else{
            var lastSelectImgIndex = -1;
            for(var i=allImgNames.length-1;i>=0;i--){
                if(selectedImgNamesList.includes(allImgNames[i])){
                    lastSelectImgIndex = i;
                    break;
                }
            }
            console.log('last selected img Index:',lastSelectImgIndex);

            if(lastSelectImgIndex === allImgNames.length-1){
                return;
                // we should not select last img when we are doing down operation
            }

            var listOfImgItemsToBeMoved = [];
            for(var i=0;i<imgItems.length;i++){
                var imgSrc = imgItems[i].querySelector('.img-tag').src;
                var imgName = imgSrc.slice(imgSrc.lastIndexOf('/')+1).replaceAll("%20"," ");
                if(selectedImgNamesList.includes(imgName)){
                    listOfImgItemsToBeMoved.push(imgItems[i]);
                }
            }

            var nextListItem = imgItems[lastSelectImgIndex + 1];
            console.log('nextListItem',nextListItem)
            for(var i=0;i<listOfImgItemsToBeMoved.length;i++){
                imgContainer.insertBefore(listOfImgItemsToBeMoved[i], nextListItem );
            }

            imgContainer.insertBefore(nextListItem,listOfImgItemsToBeMoved[0]);

            console.log('listOfImgItemsToBeMoved:',listOfImgItemsToBeMoved);
            focusElement = lastSelectImgIndex + 1;
            balanceRowLevel();
        }

        return;
    }

    if (keyEntered === 'ArrowDown'){

        focusElement = (focusElement - focusElement % no_Of_Imgs_Per_Row) + no_Of_Imgs_Per_Row;
        
        if(focusElement >= imgItems.length){
            focusElement = imgItems.length - 1;
        }
        if(consoleLevel === 2){
            console.log('New FocusElement:',focusElement);
        }

        balanceRowLevel();
    }
    else{

        focusElement = (focusElement - focusElement % no_Of_Imgs_Per_Row) - no_Of_Imgs_Per_Row;

        if(focusElement < 0){
            focusElement = 0;
        }

        if(consoleLevel === 2){
            console.log('New FocusElement:',focusElement);
        }

        balanceRowLevel();
    }
}