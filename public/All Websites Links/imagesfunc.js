document.querySelectorAll(".black-header a, .black-header1 a").forEach(function(anchor) {
    anchor.addEventListener("click", function(event) {
        if(consoleLevel >= 1){
            console.log('anchor clicked href:',event.target.href);
        }

        focusElement = 0;

        var folderName_With_Percentile20 = event.target.href.split('#')[1]; 
        highLightTheCorrectHeader(folderName_With_Percentile20);

        disableSearchMode();
        clearSearchValue();
        balanceRowLevel();

        multipleElementsSelectionMode = false;
        fileNameChangeFocusMode = false;
        fileNameChangeMode = false;

        if(isFullScreen){
            if(consoleLevel >= 1){
                console.log('isFullScreen is true, navigating to img number 0');
            }
            setTimeout(function() {
                balanceRowLevel();
            }, 50);
        }

        // from serverRelatedButtons.js
        multipleElementsSelectionMode = false;
        selectedImagesList = [];

        setFolderName(); // from serverRelatedButtons.js
    });
});

var searchBox = document.querySelector('.search-box');
searchBox.addEventListener('input', (event) => {
    var searchValue = event.target.value;
    if(consoleLevel === 2){
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

searchBox.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape'){
        if(consoleLevel >= 1){
            console.log('Disabling SearchMode since Shift is entered');
        }
        disableSearchMode();
    }
})

document.addEventListener('fullscreenchange', () => {
    if(isFullScreen && searchMode){ 
        // if we are in full screen mode and in search Mode, when we click on esc
        // then only we should exit search Mode, wihtout exiting full screen;

        setTimeout(() => {
            disableSearchMode();
            toogleFullScreen();
            console.log('fullScreenMode Entered back when SearchMode was on');
            // toogleFullScreen();

        }, 100); // Delay to allow the deleteFile function to complete
       
    }

    isFullScreen = !isFullScreen;
    
    if(consoleLevel >= 1){
        console.log('isFullScreen updated to:',isFullScreen);
    }
});
