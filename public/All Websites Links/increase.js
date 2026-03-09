calculateRowMaxImageHeights();
highLightTheCorrectHeader(); 

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

    // we are always not running up/Down arrows default functions
    if(upDownKeys.includes(event.key)){
        event.preventDefault();
    }

    // dont run custom logic for these combos - since default browser behavior is what i'm expecting to use.
    // ctrl + r -> page reload
    // ctrl + f -> search in page
    // ctrl + a -> select all (can be useful when doing select all in input boxes)
    // ctrl + l -> i will highlight current url and we can copy or replace current url
    if(event.ctrlKey && (event.key.toLowerCase() === 'r' || event.key.toLowerCase() === 'f' || event.key.toLowerCase() === 'a' || event.key.toLowerCase() === 'l')){
        if(consoleLevel === 1)
            console.log('Ctrl + R or F or A or L pressed, not running custom functionality');
        return;
    }
    
    if(fileNameChangeMode){
        if(!navigationKeys.includes(event.key)){
            // we should still allow custom ArrowUp and ArrowDown functions
        }
        else{
            // not allow other operations
            // we should not allow even custom ArrowRight and ArrowLeft - since while rename files, it should not goto otherpage.
            return;
        }
    }

    if(multipleElementsSelectionMode){
        if(event.key === 'l'){
            navigator.clipboard.writeText(getAllSelectedImgNames());   
            return;     
        }
        else if(event.key === 'm'){
            if(consoleLevel === 1){
                console.log('multipleElementsSelectionMode - m key entered');
            }
            getButton_BasedOn_InnerHTML('Move Button')?.click();
            return;
        }
        else if(event.key === ' '){
            console.log('multipleElementsSelectionMode - Space key entered');
            getButton_BasedOn_InnerHTML('Submit').click();
        }
        else if(!directionalKeys.includes(event.key) && event.key != 'z' && event.key != '/' && event.key != 'w' && event.key != '1' && event.key != '2' && event.key != '3'){
            return;
        }
    }

    if(searchMode){
        // search-box has input event listner in imagefunc.js file check it
        searchOperation(event.key,event.ctrlKey);
        return;
    }

    // when left side blackbox is enabled then also this logic should not run update it. 
    if(!searchMode && !fileNameChangeMode && (event.key === '-' || event.key === '=')){
        changeWidth_For_Minus_Equal_Keys(event.key);
        navigateToFocusElement();
        return;
    }

    if (M_Mode){
        M_Mode_Operation(event.key);
        return;
    }
    // this should happen only when no other modes are true except fullscreen mode.
    if (event.key === "m" && !M_Mode) {
        toogle_M_Mode();
        return;
    }

    if (event.key === "M" && M_Mode){
        toogle_M_Mode();
        return;
    }

    window.addEventListener("keydown", function(e) {
        // Check if the pressed key is the Down Arrow key
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === " ") {
            if(!fileNameChangeMode && !searchMode){
                e.preventDefault(); // Prevent the default scrolling behavior
                // console.log('stopped default behavior');
            }
        }
    });

    console.log('isFullScreen',isFullScreen);

    if(isFullScreen && (no_Of_Imgs_Per_Row === 2 || no_Of_Imgs_Per_Row === 3) && (event.key === "1" || event.key === "2" || event.key === "3") ){
        console.log('eneterd our block')
        var enteredKeyNumber = Number(event.key);
        if(enteredKeyNumber <= no_Of_Imgs_Per_Row){ 
            console.log('full screen better mode');
            console.log('enteredKeyNumber',enteredKeyNumber);
            console.log('no_Of_Imgs_Per_Row',no_Of_Imgs_Per_Row);
            var selectionImgNumber = (focusElement - (focusElement % no_Of_Imgs_Per_Row)) + enteredKeyNumber - 1;
            var imgItems = document.getElementsByClassName("img-item");
            console.log('imgItems:',imgItems);
            console.log('selectionImgNumber',selectionImgNumber);
            imgItems[selectionImgNumber].click();
            return;
        }
    }

    if(event.key === 'e'){
        toogleImgExtensions();
    }

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

    if(event.key === "b"){ // this is also logic for header
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
        toogleImgNames();
        return;
    }
    
    if(event.key === "A"){  
        toogleFolderNames();
        return;
    }

    if(event.key === '`'){
        var windowHref = window.location.href;
        console.log('windowHref:',windowHref);
        if(!windowHref.includes(localHostURL)){ 
            windowHref = windowHref.replace(space_to_Percentile20(nrmlURL), localHostURL);
            console.log('opening url:',windowHref);
            window.open(windowHref,'_self');
        }
        else{
            windowHref = windowHref.replace(localHostURL, space_to_Percentile20(nrmlURL)); 
            console.log('opening url:',windowHref);
            navigator.clipboard.writeText(windowHref);
        }
        return;
    }

    if(event.key ===';'){
        smoothMoment = !smoothMoment;
    }

    if(event.key === '/' || event.key === 'z'){
        scroll_To_Top_OR_Bottom_Of_Img = !scroll_To_Top_OR_Bottom_Of_Img;
        console.log('slash or z key pressed, toggling scroll_To_Top_OR_Bottom_Of_Img:',scroll_To_Top_OR_Bottom_Of_Img);
        navigateToImgNumber(focusElement,event.key);
        return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp"){
        var imgItems = document.getElementsByClassName('img-item');
        if (event.key === 'ArrowDown'){
            focusElement = (focusElement + no_Of_Imgs_Per_Row)
            modValue = focusElement % no_Of_Imgs_Per_Row;
            focusElement = focusElement - modValue; 
            
            if(focusElement >= imgItems.length){
                focusElement = imgItems.length - 1;
            }

            // if focusElement = 0, no_Of_Imgs_Per_Row = 3, if img with biggest height among the 3 img on first row
            // then make focusElement as biggest img
            // also if there are only total 4 imgs, the on 2nd row only until 4th img we can check
            // so focusElement = (4-1) = index 3
            if(scroll_To_Top_OR_Bottom_Of_Img === false){
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
                focusElement = tallestImgIndex;
            }

            navigateToImgNumber(focusElement,event.key);
            // if((imgItems.length-1)/no_Of_Imgs_Per_Row > rowLevel) rowLevel++;
        }
        else{
            focusElement = (focusElement - no_Of_Imgs_Per_Row)
            modValue = focusElement % no_Of_Imgs_Per_Row;
            focusElement = focusElement - modValue; 
            if(focusElement < 0){
                focusElement = 0;
            }

            // if focusElement = 3(img of 2nd row), no_Of_Imgs_Per_Row = 3, if img with biggest height among the  0 to 2 imgs on first row
            // then make focusElement as biggest img of previous row i.e 1
           
            navigateToImgNumber(focusElement,event.key);
            balanceRowLevel();

        }

        var sumOfRowHeights = 0;
        for (var i = 0; i < rowLevel && i < rowHeights.length; i++) {
            sumOfRowHeights += rowHeights[i];
        }
        // console.log('blackHeader.clientHeight:',blackHeader.clientHeight);
        // console.log('blackHeader1.clientHeight:',blackHeader1.clientHeight);
        // window.scrollTo(0, blackHeader.clientHeight + blackHeader1.clientHeight + sumOfRowHeights);

        // if(no_Of_Imgs_Per_Row === 2){
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
        toogleFullScreen();
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
            var index = getFolderIndex(currentPage);
            imgListGenerator(fileNames[index],mainList[index],sortingOrder);
        }

        rowLevel = 0;
        calculateRowMaxImageHeights();
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
       console.log('space key pressed, toggling search mode enter bro'); 
       enableSearchMode();
       event.preventDefault();
       return;
    }

    if(event.key === 'p'){
        var copyText = getPathToOpenInFileExplorer();
        // if(copyText.includes('http://localhost:3001/')){
        //     // console.log('if inlucde http://localhost:3001/');
        //     copyText = copyText.replace('http://localhost:3001/','file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/');
        // }
        navigator.clipboard.writeText(copyText);
        return;
    }

    if(event.key === 'l' && !event.ctrlKey){
        navigator.clipboard.writeText(getAllVisibleImgNames());
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

            rowLevel = 0;
            calculateRowMaxImageHeights();

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
    else if(event.key === "1") no_Of_Imgs_Per_Row = 1;
    else if(event.key === "2") no_Of_Imgs_Per_Row = 2;
    else if(event.key === "3") no_Of_Imgs_Per_Row = 3;
    else if(event.key === "4") no_Of_Imgs_Per_Row = 4;
    else if(event.key === "5") no_Of_Imgs_Per_Row = 5;
    else if(event.key === "6") no_Of_Imgs_Per_Row = 6;
    else if(event.key === "7") no_Of_Imgs_Per_Row = 7;
    else if(event.key === "8") no_Of_Imgs_Per_Row = 8;
    else if(event.key === "9") no_Of_Imgs_Per_Row = 9;
    else if(event.key === "0") no_Of_Imgs_Per_Row = 10;

    if(event.key === "s" || event.key === "S" || event.key === "1" || event.key === "2" || event.key === "3" || event.key === "4" || event.key === "5" || event.key === "6" || event.key === "7" || event.key === "8" || event.key === "9" || event.key === "0"){
        update_numData_To_LocalStorage();
        rowLevel = 0;
        calculateRowMaxImageHeights();
        setWidthForAll_ImgItems_Based_No_Of_Imgs_Per_Row();
        navigateToImgNumber(focusElement,event.key);
    }
});

function fixA(){

}
