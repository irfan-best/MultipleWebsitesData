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
    if(consoleLevel>=1){
        console.log('arrowTopOrBottomClicked keyEntered:',keyEntered,"isShiftKey",isShiftKey);
    }
    
    if(folderMoveMode){
        console.log('folderMoveMode is on');

        var getBlackHeaderAnchors = document.querySelectorAll('.black-header a');
        var getCurrentAnchorIndex = -1;
        for(var i=0;i<getBlackHeaderAnchors.length;i++){
            if(getBlackHeaderAnchors[i].href.split('#')[1] === space_to_Percentile20(getFolderNameFromUrl())){
                getCurrentAnchorIndex = i;
                break;
            }
        }
        console.log('current anchor index:',getCurrentAnchorIndex);

        if(keyEntered === "ArrowUp"){
            if(getCurrentAnchorIndex > 1){ 
                // then make current anchor to previous anchor using insertBefore method
                var previousAnchor = getBlackHeaderAnchors[getCurrentAnchorIndex - 1];

                var parentElement = previousAnchor.parentElement.parentElement;
                parentElement.insertBefore(getBlackHeaderAnchors[getCurrentAnchorIndex].parentElement,previousAnchor.parentElement);
            }
        }
        else{
            if(getCurrentAnchorIndex < getBlackHeaderAnchors.length - 1){
                var nextAnchor = getBlackHeaderAnchors[getCurrentAnchorIndex + 1];
                var parentElement = nextAnchor.parentElement.parentElement;
                parentElement.insertBefore(nextAnchor.parentElement,getBlackHeaderAnchors[getCurrentAnchorIndex].parentElement);
            }
        }
        return;
    }

    var imgItems = document.getElementsByClassName('img-item');

    if(isShiftKey){
        // if shift + up/down key then always scroll by 100
        window.scrollBy(0,keyEntered === "ArrowUp" ? -100 : 100);
        return;
    }
    
    if(imgRankingchangeMode){
        var imgItems = document.getElementsByClassName('img-item');
        
        var listOfImgItemsToBeMoved = [];
        
        var firstSelectImgIndex = -1;
        var lastSelectImgIndex = -1;

        for(var i=0;i<imgItems.length;i++){
            var imgSrc = imgItems[i].querySelector('.img-tag').src;
            if(selectedImagesList.includes(imgSrc)){
                console.log('includes src:',imgSrc);
                listOfImgItemsToBeMoved.push(imgItems[i]);

                if(firstSelectImgIndex === -1){
                    firstSelectImgIndex = i;
                }
                lastSelectImgIndex = i;
            }
        }
        
        if(consoleLevel>=1){
            console.log('listOfImgItemsToBeMoved',listOfImgItemsToBeMoved);
            console.log('first selected img Index:',firstSelectImgIndex);
            console.log('last selected img Index:',lastSelectImgIndex);
        }

        if(keyEntered === 'ArrowUp'){
            if(firstSelectImgIndex === 0){
                // we should not select first img when we are doing up operation
                return;
            }

            var previousListItem = imgItems[firstSelectImgIndex - 1];
            for(var i=0;i<listOfImgItemsToBeMoved.length;i++){
                imgContainer.insertBefore(listOfImgItemsToBeMoved[i],previousListItem);
            }

            focusElement = firstSelectImgIndex - 1;
        }
        else{
            if(lastSelectImgIndex === imgItems.length-1){
                // we should not select last img when we are doing down operation
                return;
            }

            var nextListItem = imgItems[lastSelectImgIndex + 1];
            for(var i=0;i<listOfImgItemsToBeMoved.length;i++){
                imgContainer.insertBefore(listOfImgItemsToBeMoved[i], nextListItem );
            }

            imgContainer.insertBefore(nextListItem,listOfImgItemsToBeMoved[0]);

            focusElement = lastSelectImgIndex + 1;
        }
        
        balanceRowLevel();
        return;
    }

    if (keyEntered === 'ArrowDown'){

        if(isFullScreen && no_Of_Imgs_Per_Row === 2){
            var maxHeightOfRow = -1;
            var imgTags = document.getElementsByClassName('img-tag');

            var currRowFirstElement = (focusElement - focusElement % no_Of_Imgs_Per_Row)
            maxHeightOfRow = imgTags[currRowFirstElement].clientHeight > maxHeightOfRow ? imgTags[currRowFirstElement].clientHeight : maxHeightOfRow;

            if(currRowFirstElement < imgTags.length - 1){
                maxHeightOfRow = imgTags[currRowFirstElement + 1].clientHeight > maxHeightOfRow ? imgTags[currRowFirstElement + 1].clientHeight : maxHeightOfRow;
            }

            console.log('special case',maxHeightOfRow);
            if(maxHeightOfRow > 900){
                console.log('more than 900 case');
                if(!specialScrollCase){
                    scroll_To_Top_OR_Bottom_Of_Img = !scroll_To_Top_OR_Bottom_Of_Img; // scroll to top of img
                    balanceRowLevel();
                    specialScrollCase = true;
                    return;
                }
                else{
                    specialScrollCase = false;
                    scroll_To_Top_OR_Bottom_Of_Img = !scroll_To_Top_OR_Bottom_Of_Img; // scroll to bottom of img
                }
            }
        }
        else if(isFullScreen && no_Of_Imgs_Per_Row === 1){
            // in full screen mode with 1 img per row, down arrow key should work like page down key
            var imgTags = document.getElementsByClassName('img-tag');

            var currRowFirstElement = (focusElement - focusElement % no_Of_Imgs_Per_Row);
            var maxHeightOfRow = imgTags[focusElement].clientHeight;
            console.log('special case 2',imgTags[focusElement].clientHeight);

            if(maxHeightOfRow > 900){
                console.log('more than 900 case');
                if(!specialScrollCase){
                    scroll_To_Top_OR_Bottom_Of_Img = !scroll_To_Top_OR_Bottom_Of_Img; // scroll to top of img
                    balanceRowLevel();
                    specialScrollCase = true;
                    return;
                }
                else{
                    specialScrollCase = false;
                    scroll_To_Top_OR_Bottom_Of_Img = !scroll_To_Top_OR_Bottom_Of_Img; // scroll to bottom of img
                }
            }
        }

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
        if(specialScrollCase){
            specialScrollCase = false;
            scroll_To_Top_OR_Bottom_Of_Img = Initial_ScrollValue;
        }
    }
}