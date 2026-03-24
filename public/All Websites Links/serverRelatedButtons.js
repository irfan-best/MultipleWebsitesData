function updateHeaderCounts(){
    var anchorElements = document.querySelectorAll("a");
    var currentPage = window.location.href.substring(window.location.href.indexOf('#')+1);

    if(currentPage.includes('.html')){
        currentPage = 'home';
    }

    for(var i=0;i<anchorElements.length;i++){
        temp = anchorElements[i].href.split('#')[1];
        if(temp === currentPage){
            var spanElement = anchorElements[i].querySelector('span');
            spanElement.innerHTML = spanElement.innerHTML - 1;
        }

        if(currentPage !== 'home' && temp === 'home'){
            var spanElement = anchorElements[i].querySelector('span');
            spanElement.innerHTML = spanElement.innerHTML - 1;
        }
    }

}

var copyOrMoveMode = '';

var moveButton = document.createElement('button');
moveButton.innerHTML = 'Move Button';
moveButton.setAttribute('class','copy-button');
moveButton.onclick = function(){

    // console.log('mvoebugtton Clicked');
    if(!multipleElementsSelectionMode || selectedImagesList.length===0){
        return;
    }

    var picklistContainer = document.querySelector('.picklist-container');
    picklistContainer.style.visibility = 'visible';

    var url = window.location.href;
    splitData = url.split('/');

    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    // folderSelect
    const folderSelect = document.getElementById('folderSelect');
    console.log('splitData for move button1:',splitData);
    // splitData[splitData.length - 3].replaceAll('%20',' ')
    var tempu1 = splitData[splitData.length - 3].replaceAll('%20',' ');
    console.log('tempu1:',tempu1);
    console.log('tempu1 length:',tempu1.length);
    console.log('categorySelect value to be set splitdata:',splitData[splitData.length - 3].replaceAll('%20',' '));
    
    categorySelect.value = splitData[splitData.length - 3].replaceAll('%20',' ');
    console.log('categorySelect value set to:',categorySelect.value);
    categorySelect.dispatchEvent(new Event('change'));
    // console.log('value changed category');

    var currentWebSite = splitData[splitData.length - 2].replaceAll('%20',' ');
    console.log('currentWebSite before modification:',currentWebSite);
    if((currentWebSite.includes('Alina Becker') || currentWebSite.includes('Byoru') || 
    currentWebSite.includes('todopokie') || currentWebSite.includes('Lady Melamori') || 
    currentWebSite.includes('victoria') || currentWebSite.includes('Zhu Ke Er')) 
        && currentWebSite.includes(' - Avg')){
        // remove " - Avg" from the end of the website name
        currentWebSite = currentWebSite.substring(0,currentWebSite.length - 6);
        console.log('currentWebSite after modification 1:',currentWebSite);
    }
    else if((currentWebSite.includes('Alina Becker') || currentWebSite.includes('Byoru') || 
    currentWebSite.includes('todopokie') || currentWebSite.includes('lady melamori') || 
    currentWebSite.includes('victoria')) && currentWebSite.includes('Tier')){
        // add " - Avg" to the end of the website name
        currentWebSite = currentWebSite + ' - Avg';
        console.log('currentWebSite after modification 2:',currentWebSite);
    }
    websiteSelect.value = currentWebSite;
    websiteSelect.dispatchEvent(new Event('change'));

    folderSelect.value = '-- Create Folder --';
    folderSelect.dispatchEvent(new Event('change'));

    // input.new-folder
    const newFolderInput = document.querySelector('input.new-folder');
    // set current folder name
    newFolderInput.value = splitData[splitData.length - 1].replaceAll('%20',' ');
    // remove index.html# from the start
    newFolderInput.value = newFolderInput.value.replace('index.html#','');
    console.log('newFolderInput value set to:',newFolderInput.value);

    copyOrMoveMode = 'Move';
}

var deleteButton = document.createElement('button');
deleteButton.innerHTML = 'Delete Button';
deleteButton.setAttribute('class','copy-button');
deleteButton.onclick = function(){
    if(!multipleElementsSelectionMode && selectedImagesList.length===0){
        return;
    }
    deleteServerCaller();

    var selectedImages = document.querySelectorAll('.selected-img');
    for(var i=0;i<selectedImages.length;i++){
        selectedImages[i].remove();
    }

    setTimeout(() => {
        // console.log('sendData 5secs called after deleteFile');
        sendData(); // to update the website
    }, 2000); // Delay to allow the deleteFile function to complete
           
}

var copyImgToFolderButton = document.createElement('button');
copyImgToFolderButton.innerHTML = 'Copy Imgs To Folder';
copyImgToFolderButton.setAttribute('class','copy-button');
copyImgToFolderButton.onclick = function(){
    // console.log('copyImgToFolderButton Clicked');
    if(!multipleElementsSelectionMode || selectedImagesList.length===0){
        return;
    }

    var picklistContainer = document.querySelector('.picklist-container');
    picklistContainer.style.visibility = 'visible';

    var url = window.location.href;
    splitData = url.split('/');

    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    categorySelect.value = splitData[splitData.length - 3].replaceAll('%20',' ');
    categorySelect.dispatchEvent(new Event('change'));
    websiteSelect.value = splitData[splitData.length - 2].replaceAll('%20',' ');
    websiteSelect.dispatchEvent(new Event('change'));

    copyOrMoveMode = 'Copy';
}

var copyContainer = document.querySelector('.copy-container');
copyContainer.appendChild(moveButton);
copyContainer.appendChild(deleteButton);
copyContainer.appendChild(copyImgToFolderButton);

var xButton = document.querySelector('.remove-button');
xButton.onclick = function(){
    var picklistContainer = document.querySelector('.picklist-container');
    picklistContainer.style.visibility = 'hidden';
}

var submitButtonForWebsiteSelection = document.querySelector('.submit-button-for-website-selection');
submitButtonForWebsiteSelection.onclick = function(){
    // console.log('submitButtonForWebsiteSelection called');
    var selectedImages = document.querySelectorAll('.selected-img');

    var picklistContainer = document.querySelector('.picklist-container');
    picklistContainer.style.visibility = 'hidden';

    if(copyOrMoveMode === 'Move'){
        for(var i=0;i<selectedImages.length;i++){
            selectedImages[i].remove();
        }
    }
    
    if(copyOrMoveMode === 'Copy'){
        copyServerCaller();
    }

    else if(copyOrMoveMode === 'Move'){
        moveServerCaller();

        setTimeout(() => {
            // console.log('sendData 5secs called after deleteFile');
            sendData(); // to update the website
            selectedImagesList = [];
            // imgBox.remove(); // Remove the img-box from the DOM
        }, 2000);   
    }

    else if(copyOrMoveMode === 'Copy Folder'){
        copyFolderServerCaller();
    }
    else if(copyOrMoveMode === 'Move Folder'){
        moveFolderServerCaller();
        setTimeout(() => {
            // console.log('sendData 5secs called after deleteFile');
            sendData(); // to update the website
            // imgBox.remove(); // Remove the img-box from the DOM
        }, 2000);   
    }

 
     setTimeout(() => {
        // console.log('sendData 5secs called after deleteFile');
        const categorySelect = document.getElementById('categorySelect');
        const websiteSelect = document.getElementById('websiteSelect');

        updateOtherWebiste(categorySelect.value+'/'+websiteSelect.value+'/'); // to update the website

        // imgBox.remove(); // Remove the img-box from the DOM
    }, 4000); 
}

var moveFolder = document.createElement('button');
moveFolder.innerHTML = 'Move Folder';
moveFolder.setAttribute('class','copy-button');
moveFolder.onclick = function(){

    var picklistContainer = document.querySelector('.picklist-container');
    picklistContainer.style.visibility = 'visible';

    var url = window.location.href;
    splitData = url.split('/');
    console.log('splitData for move folder:',splitData);

    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    categorySelect.value = splitData[splitData.length - 3].replaceAll('%20',' ');
    categorySelect.dispatchEvent(new Event('change'));
    websiteSelect.value = splitData[splitData.length - 2].replaceAll('%20',' ');
    websiteSelect.dispatchEvent(new Event('change'));

    copyOrMoveMode = 'Move Folder';
}
copyContainer.appendChild(moveFolder);

var copyFolder = document.createElement('button');
copyFolder.innerHTML = 'Copy Folder';
copyFolder.setAttribute('class','copy-button');
copyFolder.onclick = function(){

    var picklistContainer = document.querySelector('.picklist-container');
    picklistContainer.style.visibility = 'visible';

    var url = window.location.href;
    splitData = url.split('/');

    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    categorySelect.value = splitData[splitData.length - 3].replaceAll('%20',' ');
    categorySelect.dispatchEvent(new Event('change'));
    websiteSelect.value = splitData[splitData.length - 2].replaceAll('%20',' ');
    websiteSelect.dispatchEvent(new Event('change'));

    copyOrMoveMode = 'Copy Folder';
}
copyContainer.appendChild(copyFolder);


var currentFolderName = document.createElement('input');
currentFolderName.setAttribute('type','text');
currentFolderName.setAttribute('class','folder-name-enter');

currentFolderName.style.color = 'white';
copyContainer.appendChild(currentFolderName);
setFolderName();

var currentFolderNameSubmitButton = document.createElement('button');
currentFolderNameSubmitButton.setAttribute('class','copy-button');
currentFolderNameSubmitButton.innerHTML = 'Set Folder Name';
copyContainer.appendChild(currentFolderNameSubmitButton);

var updateRankingButton = document.createElement('button');
updateRankingButton.setAttribute('class','copy-button');
updateRankingButton.innerHTML = 'Updating Ranking';
updateRankingButton.onclick = updateRankingFunc;
copyContainer.appendChild(updateRankingButton);


function setFolderName(){
    var anchorElements = document.querySelectorAll("a");
    for(var i=0;i<anchorElements.length;i++){
        if(anchorElements[i].style.color !== 'white'){
            var tempText = anchorElements[i].innerHTML;
            var funText = 'chainsaw man blue (10)';
            var lastParenIndex = tempText.lastIndexOf('(');
            if (lastParenIndex !== -1) {
                tempText = tempText.substring(0, lastParenIndex).trim();
            }
            currentFolderName.value = tempText;
        }
    }
}