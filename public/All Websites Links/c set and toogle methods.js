function get_No_Of_Imgs_Per_Row_From_LocalStorage(){
    var numData = Number(localStorage.getItem('numData'));
    return numData === 0 ? 4 : Number(localStorage.getItem('numData'));
}

function update_numData_To_LocalStorage(){
    localStorage.setItem("numData", "" + no_Of_Imgs_Per_Row);
}

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- toogle Methods --------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

function toogle_M_Mode(){
    var mSwitchOn = document.getElementById('m-switch-on');
    var mSwitchOff = document.getElementById('m-switch-off');
    if(M_Mode){
        mSwitchOn.style.display = 'none';
        mSwitchOff.style.display = 'block';
    }
    else{
        mSwitchOn.style.display = 'block';
        mSwitchOff.style.display = 'none';
    }
    M_Mode = !M_Mode;
    if(consoleLevel >= 1){
        console.log('toogle_M_Mode: Mode is now:', M_Mode);
    }
}

function toogleImgExtensions(){
    showImgExetension = !showImgExetension;
    call_HomeList_OR_imgList_Generator();
}

function toogleFullScreen(){
    if(isFullScreen){
        document.exitFullscreen();
    }
    else{
        document.documentElement.requestFullscreen();
    }
}

function toogleImgNames(){
    showImgNames = !showImgNames;
    var imgNames = document.getElementsByClassName('img-name');
    for(var i=0;i<imgNames.length;i++){
        imgNames[i].style.display = showImgNames ? 'inline' : 'none';
    }

    if(consoleLevel >= 1){
        console.log('toogleImgNames called, showImgNames after change:',showImgNames);
    }

}

function toogleFolderNames(){
    var imageFolders = document.getElementsByClassName('img-folder-name');
    showFolderNames = !showFolderNames;
    for(var i=0;i<imageFolders.length;i++){
        imageFolders[i].style.display = showFolderNames ? 'block' : 'none' ;
    }

    if(consoleLevel >= 1){
        console.log('toogleFolderNames called, showFolderNames after change:',showFolderNames);
    }
}