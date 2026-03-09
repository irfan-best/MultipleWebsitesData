// will call homeList or imgList(for folder page) based on current url
function call_HomeList_OR_imgList_Generator(){
    var url = window.location.href;
    var folderName = getFolderNameFromUrl();
    
    if(folderName === "home" || url.slice(-5) === ".html"){
        if(consoleLevel === 1){
            console.log('home page');
        }
        homeListGenerator();
    }
    else{
        if(consoleLevel === 1){
            console.log('folder page:',folderName);
        }
        var index = getFolderIndex(folderName);
        imgListGenerator(fileNames[index],mainList[index]);
    }
}

// setting no.of imgs counts for black-header and black-header1 (setting logic)
function setHomePage_AND_AllFolderImgCounts(){
    var allFilesCount = 0;
    for(var i=0;i<fileNames.length;i++){
        allFilesCount += mainList[i].length;
        document.getElementById("data-"+(space_to_Percentile20(fileNames[i]))).innerHTML = mainList[i].length;
        document.getElementById("data1-"+(space_to_Percentile20(fileNames[i]))).innerHTML = mainList[i].length;
    }
    document.getElementById("data0").innerHTML = allFilesCount; // home page no of imgs
    document.getElementById("data1").innerHTML = allFilesCount; // home page no of imgs
}

no_Of_Imgs_Per_Row = get_No_Of_Imgs_Per_Row_From_LocalStorage();
call_HomeList_OR_imgList_Generator(); // add imgs based on url, verify home page or folder page
setHomePage_AND_AllFolderImgCounts(); // adds no of imgs in header items

var showWebsiteNameButton = document.getElementById("show-website-name");
showWebsiteNameButton.innerHTML = getWebsiteNameFromUrl();

var noFolders = document.getElementById("no-folders");
noFolders.innerHTML = ( document.querySelectorAll('.black-header a').length - 1) + " folders";

document.querySelectorAll("a").forEach(function(anchor) {
    anchor.addEventListener("click", function(event) {
        if(consoleLevel === 1){
            console.log('anchor clicked href:',event.target.href);
        }

        rowLevel = 0;
        focusElement = 0;
        calculateRowMaxImageHeights();

        var folderName_With_Percentile20 = event.target.href.split('#')[1]; 
        highLightTheCorrectHeader(folderName_With_Percentile20);

        // set_On_Click_Event_ForImageBoxs();
        disableSearchMode();
        clearSearchValue();

        if(isFullScreen){
            if(consoleLevel === 1){
                console.log('isFullScreen is true, navigating to img number 0');
            }
            setTimeout(function() {
                navigateToFocusElement();
            }, 50);
        }

        addDeleteButtons(); // from serverRelatedButtons.js
        multipleElementsSelectionMode = false // from serverRelatedButtons.js
        setFolderName(); // from serverRelatedButtons.js
    });
});

var searchBox = document.querySelector('.search-box');
searchBox.addEventListener('input', (event) => {
    var searchValue = event.target.value;
    if(consoleLevel === 1){
        console.log('Search Box Value changed:',searchValue);
    }
    
    var itemItems = document.getElementsByClassName('img-item');
    var imgNameToCopy = '';
    for(var i=0;i<itemItems.length;i++){
        var imgName = itemItems[i].getElementsByClassName('img-name')[0];
        if(imgName.innerText.toLowerCase().includes(searchValue.toLowerCase())){
            itemItems[i].style.display = 'block';
            if(imgNameToCopy === '') imgNameToCopy = imgName.innerText;
        }
        else{
            itemItems[i].style.display = 'none';
        }
    }

    navigator.clipboard.writeText(imgNameToCopy + (!includeAnimeOrNot ? "" : " Anime"));
});