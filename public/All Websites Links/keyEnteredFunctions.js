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

async function searchOperation(enteredKey, isCtrlKey){
    var searchBox = document.querySelector('.search-box');
    searchBox.focus();

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