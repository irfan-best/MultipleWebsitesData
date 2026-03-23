no_Of_Imgs_Per_Row = get_No_Of_Imgs_Per_Row_From_LocalStorage();
localHost_on = window.location.href.includes(localHostURL);

if(window.location.href.endsWith('.html')){
    window.location.href = window.location.href + '#home';
}

call_HomeList_OR_imgList_Generator(); // add imgs based on url, verify home page or folder page
setHomePage_AND_AllFolderImgCounts(); // adds no of imgs in header items

var showWebsiteNameButton = document.getElementById("show-website-name");
showWebsiteNameButton.innerHTML = getWebsiteNameFromUrl();

var noOfFolders = document.getElementById("no-of-folders");
noOfFolders.innerHTML = ( document.querySelectorAll('.black-header a').length - 1) + " folders";

highLightTheCorrectHeader();

var imgContainer = document.querySelector('.imgs-container');
imgContainer.style.alignItems = scroll_To_Top_OR_Bottom_Of_Img ? 'flex-start': 'flex-end';

document.addEventListener("keydown", function(event) {
    if(consoleLevel === 2){
        console.log('entered Key:',event.key);
    }

    if(event.key === 'Enter' && event.ctrlKey){
        ctrlEnter();
        return;
    }

    if(event.key === 'k' && event.ctrlKey){
        openShortcutsFile();
        return;
    }
    
    // dont run custom logic for these combos - since default browser behavior is what i'm expecting to use.
    // ctrl + 1 -> goes to 1st tab on browser, to make this works i'm returning here.
    // ctrl + r -> page reload
    // ctrl + f -> search in page
    // ctrl + a -> select all (can be useful when doing select all in input boxes)
    // ctrl + l -> i will highlight current url and we can copy or replace current url
    if(event.ctrlKey && (NumKeysList.includes(event.key) || event.key.toLowerCase() === 'r' || event.key.toLowerCase() === 'f' || event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'l')){
        if(consoleLevel >= 1)
            console.log('Ctrl + R or F or A or L pressed, not running custom functionality');
        return;
    }

    // we are always not running up/Down arrows default functions
    if(upDownKeys.includes(event.key)){
        event.preventDefault();
    }

    if(event.key === 'Escape'){
        event.preventDefault();
        console.log('preventign default')
    }

    if(multipleElementsSelectionMode){
        if(event.key === 'l'){
            navigator.clipboard.writeText(getAllSelectedImgNames());   
            return;     
        }
        else if(event.key === 'm'){
            if(consoleLevel >= 1){
                console.log('multipleElementsSelectionMode - m key entered');
            }
            getButton_BasedOn_InnerHTML('Move Button')?.click();
            return;
        }
        else if(event.key === 'Shift'){
            console.log('multipleElementsSelectionMode - Space key entered');
            getButton_BasedOn_InnerHTML('Submit').click();
            return;
        }
        else if( NumKeysList.includes(event.key) ) {
            var enteredKeyNumber = Number(event.key) == 0 ? 10 : Number(event.key);
            if(enteredKeyNumber <= no_Of_Imgs_Per_Row){

                var selectionImgNumber = (focusElement - (focusElement % no_Of_Imgs_Per_Row)) + enteredKeyNumber - 1;
                if(consoleLevel === 2){
                    console.log('focusElement in multipleElementsSelectionMode:',focusElement);
                    console.log('selectionImgNumber:',selectionImgNumber);
                }
                var imgItems = document.getElementsByClassName("img-item");

                imgItems[selectionImgNumber].click();

                if(consoleLevel === 2){
                    console.log('multipleElementsSelectionMode - selectionImgNumber:',selectionImgNumber);
                }

                return;
            }
        }
    }

    if (M_Mode && !upDownKeys.includes(event.key) && !leftRightKeys.includes(event.key)){
        if(event.key === 'M'){
            toogle_M_Mode();
        }
        else{
            M_Mode_Operation(event.key);
        }
        return;
    }
    console.log('preve def2');


    if(fileNameChangeMode){
        if(event.key === ';'){
            if(!includeFileExtensions){
                includeFileExtensions = true;
                // console.log('y entered, include extensions');
                var imgNameInputBox = document.querySelectorAll('.img-name-input-box');
                for(var i=0;i<imgNameInputBox.length;i++){
                    var tempSplitData = imgNameInputBox[i].parentElement.querySelector('img').src.split('.');
                    imgNameInputBox[i].value += '.' + tempSplitData[tempSplitData.length - 1];
                }
            }
            else{
                includeFileExtensions = false;
                // console.log('y entered, exclude extensions');
                var imgNameInputBox = document.querySelectorAll('.img-name-input-box');
                for(var i=0;i<imgNameInputBox.length;i++){
                    imgNameInputBox[i].value = imgNameInputBox[i].value.substring(0,imgNameInputBox[i].value.lastIndexOf('.'));
                }
            }
            return;
        }
        else if(event.key === 'Escape'){ // disable fileNameChangeMode
            var imgNameInputBox = document.querySelectorAll('.img-name-input-box');
            fileNameChangeMode = false;
    
            for(var i=0;i<imgNameInputBox.length; i++){
                imgNameInputBox[i].style.display = 'none'; // Hide all delete buttons
                imgNameInputBox[i].parentElement.querySelector('.submit-button').style.display = 'none';
            }
            return;
        }
        else if(leftRightKeys.includes(event.key)){
            event.preventDefault(); 
        }
    }

    if ( !ifAnyOfWriteModeIsTrue() && (leftRightKeys.includes(event.key) || event.key === " ") ) {
        event.preventDefault(); 
        // except when we are some text writting mode we should prevent default behavior of these keys
    }

    if(ifAnyOfWriteModeIsTrue()){
        if(isLetter(event.key) || NumKeysList.includes(event.key) || event.key === ' ' || WrittableSpecialKeyList.includes(event.key)) {
            console.log('coming here');
            console.log('coming here',isLetter(event.key));
            console.log('coming here',NumKeysList.includes(event.key));
            console.log('coming here',event.key === ' ');
            console.log('coming here',WrittableSpecialKeyList.includes(event.key));
            return;
        }
    }

    console.log('arrowdown bro2');

    var blackHeader = document.getElementsByClassName('black-header')[0];
    var blackHeader1 = document.getElementsByClassName('black-header1')[0];
    var copyContainer = document.querySelector(".copy-container");

    if (event.key === "h"){
        if(headToogle === 'off'){
            return;
        }

        headToogle = !headToogle;
        blackHeader1.style.display = headToogle ? "none" : "block"; 
        if(consoleLevel >= 1){
            console.log('On h click blackheader1 become:',!headToogle);
        }
        return;
    } 

    if(event.key === "H"){ // this is also logic for header
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
        toogleImgNames();
        return;
    }
    
    if(event.key === "A"){  
        toogleFolderNames();
        return;
    }

    // this should happen only when no other modes are true except fullscreen mode.
    if (event.key === "m") {
        toogle_M_Mode();
        return;
    }

    if(event.key === '`'){
        var windowHref = window.location.href;

        if(!localHost_on){ 
            windowHref = windowHref.replace(space_to_Percentile20(nrmlURL), localHostURL);
            if(consoleLevel >= 1){
                console.log('clicked ` opening local host url:',windowHref);
            }
            window.open(windowHref,'_self');
        }

        else{
            windowHref = windowHref.replace(localHostURL, space_to_Percentile20(nrmlURL)); 
            if(consoleLevel >= 1){
                console.log('clicked ` coped nrml url:',windowHref);
            }
            navigator.clipboard.writeText(windowHref);
        }
        return;
    }

    if(event.key === '-' || event.key === '='){
        changeWidth_For_Minus_Equal_Keys(event.key);
        balanceRowLevel();
        return;
    }

    if(event.key === 'e'){
        toogleImgExtensions();
    }

    if(event.key ===';'){
        smoothMoment = !smoothMoment;
    }

    if(event.key === '/' || event.key === 'z'){
        scroll_To_Top_OR_Bottom_Of_Img = !scroll_To_Top_OR_Bottom_Of_Img;
        var imgContainer = document.querySelector('.imgs-container');
        imgContainer.style.alignItems = scroll_To_Top_OR_Bottom_Of_Img ? 'flex-start': 'flex-end';

        if(consoleLevel >= 1){
            console.log('/ or z key pressed, toggling scroll_To_Top_OR_Bottom_Of_Img:',scroll_To_Top_OR_Bottom_Of_Img);
        }
        balanceRowLevel();
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

    if (event.key === 'f'){
        toogleFullScreen(); 
        return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp"){
        arrowTopOrBottomClicked(event.key);
        return;
    } 
    
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        arrowLeftOrRightClicked(event.key);
        return;
    }

    if (event.key === "r" || event.key === "R" || event.key === 't') {
        if(event.key === "r") sortingOrder = 'random';
        else if(event.key === 't') sortingOrder = 'desc';
        else sortingOrder = 'asc';

        call_HomeList_OR_imgList_Generator();
    }

    if(event.key === 'i'){
        var imgItems = document.getElementsByClassName('img-tag');
        var imgNames = document.getElementsByClassName('img-name');

        if(imgItems[0].style.display !== 'none'){
            for(var i=0;i<imgItems.length;i++){
                imgItems[i].style.display = 'none';

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
                imgNames[i].style.height = 'auto';
                imgNames[i].style.border = 'none';
            }
        }
    }

    if(event.key === ' '){
        if(consoleLevel >= 1){
            console.log('space key pressed, toggling search mode enter bro'); 
        }
        ToogleSearchMode();
        return;
    }

    if(event.key === 'p'){
        var copyText = getPathToOpenInFileExplorer();
        navigator.clipboard.writeText(copyText);
        return;
    }

    if(event.key === 'l'){
        navigator.clipboard.writeText(getAllVisibleImgNames());
        return;
    }

    if(event.key === 'u'){
        navigator.clipboard.writeText(getUrlPathData());
        return;
    }

    if(event.key === 'y'){
        navigator.clipboard.writeText(getFolderNameFromUrl());
        return;
    }

    if(event.key === 'q'){
        document.querySelectorAll(".black-header a")[0].click();
        return;
    }

    if(event.key === 's'){
        includeAnimeOrNot = !includeAnimeOrNot;
        return;
    }

    if(NumKeysList.includes(event.key)){
        no_Of_Imgs_Per_Row = event.key === '0' ? 10 : Number(event.key);
        update_numData_To_LocalStorage();
        setWidthForAll_ImgItems_Based_No_Of_Imgs_Per_Row();
        balanceRowLevel();
        return;
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

    if(event.key === 'x'){
        var imgNameInputBox = document.querySelectorAll('.img-name-input-box');
        fileNameChangeMode = true;
                
        for(var i=0;i<imgNameInputBox.length; i++){
            imgNameInputBox[i].style.display = 'block'; // Show all delete buttons
            imgNameInputBox[i].parentElement.querySelector('.submit-button').style.display = 'block';
        }
        return;
    }

    if(event.key === 'Tab'){
        event.preventDefault();
        multipleElementsSelectionMode = !multipleElementsSelectionMode;
        if(consoleLevel >= 1){
            console.log('tab entered multipleElementsSelectionMode updated to:',multipleElementsSelectionMode);
        }

        if(!multipleElementsSelectionMode){
            var imgItems = document.querySelectorAll('.img-item');
            for(var i=0;i<imgItems.length;i++){
                imgItems[i].classList.remove('selected-img');
            }
            selectedImagesList = [];
        }
        return;
    }

    if (event.key === 'd') {
        var deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            if( button.style.display === 'none') {
                button.style.display = 'block'; // Show all delete buttons
            }
            else{
                button.style.display = 'none'; // Hide all delete buttons
            }
        });
        return;
    }

});
