var includeAnimeOrNot = false;
var multipleElementsSelectionMode = false;

// window.location.href generally looks like this:
// file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/All%20Websites%20Links/Alina%20Becker/Alina%20Becker%20Website%20Download/index.html#A14

function getWebsiteNameFromUrl(){
    var url = window.location.href;
    var splitData = url.split("/");
    // last but one
    var websiteName = splitData[splitData.length - 2].replaceAll('%20',' ');
    console.log('getWebsiteNameFromUrl called:',websiteName);
    return websiteName;
}

function getCategoryNameFromUrl(){
    var url = window.location.href;
    var splitData = url.split("/");
    // last but two
    console.log('getCategoryNameFromUrl called:',splitData[splitData.length - 3]);
    var categoryName = splitData[splitData.length - 3].replaceAll('%20',' ');
    return categoryName;
}

function getFolderNameFromUrl(){
    var url = window.location.href;
    var folderName = url.split("#")[1].replaceAll('%20',' ');
    console.log('getFolderNameFromUrl called:',folderName);
    return folderName;
}

function removeStartingNumber(str1){
    // console.log('removeStartingNumber start:',str1);
    const list1 = str1.split(" ");
    if(isNumber(list1[0])) return str1.substring(2);

    // console.log('removeStartingNumber end:',str1);
    return str1;
}

function isNumber(str) {
    // console.log('isNumber start:',str);
    // console.log('isNumber end:',!isNaN(str) && str.trim() !== '');
    return !isNaN(str) && str.trim() !== '';
}

function getIndex(currentPage){
    // console.log('getIndex start:',currentPage);
    for(var i=0;i<fileNames.length;i++)
        if(removeStartingNumber(fileNames[i]) === currentPage){
            // console.log('getIndex end:',i);
            return i;
        }
    // console.log('getIndex end:',0);
    return 0;
}

function getWhichList(value){
    for(var i=0;i<fileNames.length;i++){
        if(mainList[i].includes(value)) return i;
    }
    return 0;
}

function changeList(num){
    if(num === 'home')   homeListGenerator();
    else{
        var index = getIndex(num);
        imgListGenerator(fileNames[index],mainList[index]);
    }
}

// this method returns data in below format
// <div class="img-item">
//             <div class="img-box"><img src="Images/{FolderName}/{Filename}"/></div>
//             <div class="img-folder-name" style="display:none;">{FolderName}</div>
//             <div class="img-name">{Filename}</div>
// </div>
function imgItemCreator(filename,foldername){
    if(consoleLevel === 2){
        console.log('imgItemCreator start:',filename,foldername);
    }

    var imgItem = document.createElement("div");
    imgItem.setAttribute("class","img-item");

    var writeText = filename.slice(0,filename.lastIndexOf('.'));
    // if(includeAnimeOrNot) writeText += " Anime";
    imgItem.addEventListener('click', async () => await navigator.clipboard.writeText(!includeAnimeOrNot ? writeText.replaceAll('%20',' ') : writeText.replaceAll('%20',' ') + " Anime"));

    var imgBox = document.createElement("div");
    imgBox.setAttribute("class","img-box")
    var imgTag = document.createElement("img");
    imgTag.setAttribute("src","Images/"+foldername+"/"+filename);
    
    imgBox.appendChild(imgTag);

    var imgName = document.createElement("div");
    // imgName.setAttribute("contenteditable"  ,"true");
    imgName.setAttribute("class","img-name");
    // imgName.innerHTML = filename.length > 31 ? filename.slice(0,29)+".." : filename;
    imgName.innerHTML = filename.slice(0,filename.lastIndexOf('.'));

    imgItem.appendChild(imgBox);

    var imgFolderName = document.createElement("div");
    imgFolderName.innerHTML = foldername;
    imgFolderName.setAttribute("class","img-folder-name");
    imgFolderName.setAttribute("style","display:none;");
    imgItem.appendChild(imgFolderName);

    imgItem.appendChild(imgName);

    return imgItem;
}

function homeListGenerator(sortingOrder){
    if(consoleLevel === 1){
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

function imgListGenerator(foldername,animeList,sortingOrder){

    if(consoleLevel === 1){
        console.log('imgListGenerator start:',foldername,animeList,sortingOrder);
    }

    var imgContainer = document.getElementById("imgs-container");
    imgContainer.innerHTML = "";

    animeList = [...animeList];
    if(sortingOrder === 'random')
        animeList.sort(() => Math.random() - 0.5);
    else if(sortingOrder === 'desc')
        animeList.sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));
    
    animeList.forEach((value)=>{
        imgContainer.appendChild(imgItemCreator(value,foldername));
    })
}

var url = window.location.href;
// var currentPage = (window.location.href+"").slice(64);
var currentPage = url.substring(url.indexOf('#')+1);

// console.log('current page out of all functions, imagesfunc.js:',currentPage);

if(currentPage === "home" || currentPage.slice(-5) === ".html"){
    // console.log('homeListGenerator Called:');
    homeListGenerator();
    // console.log('homeListGenerator Called Ended:');
}
else{
    currentPage = currentPage.replaceAll('%20'," ");
    var index = getIndex(currentPage);
    // console.log('imgListGenerator currentPage:',currentPage);
    // console.log('imgListGenerator, filesNames[index], mainList[index]:',fileNames[index],mainList[index]);
    imgListGenerator(fileNames[index],mainList[index]);
}

// header and black header(setting logic)
var allFilesCount = 0;
for(var i=0;i<fileNames.length;i++){
    allFilesCount += mainList[i].length;
    document.getElementById("data-"+removeStartingNumber(fileNames[i])).innerHTML = mainList[i].length;
    document.getElementById("data1-"+removeStartingNumber(fileNames[i])).innerHTML = mainList[i].length;
}
document.getElementById("data0").innerHTML = allFilesCount;
document.getElementById("data1").innerHTML = allFilesCount;
// header and black header(setting logic end)

// sendData(); not using this function for now
// function sendData() {
//     // Send the form data to the server using fetch
//     console.log('sendData url:',url);
//     fetch('http://localhost:3000/submit', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(), // Send the form data as JSON
//     })
//     .then(response => response.json())
//     .then(data => {
//         // Show the server's response
//         // imgListGenerator(JSON.parse(data.message),url);
//         console.log('successful fetch');

//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }


// New DAta
function getUrlPathData(){
    var data = window.location.href;
    if(data.includes('http://localhost:3001/')){
        var content = data.substring('http://localhost:3001/'.length);
    }
    else{
        var content = data.substring(data.indexOf('/public/')+8);
    }
    var splits = content.split('#');
    return splits[0].replaceAll('%20',' ') + '#' + splits[1];
    // console.log('getUrlPathData data:',content);
    // return content;
}

function getData() {
    var data = "";
    var imgName = document.querySelectorAll(".img-name");
    for(var i = 0; i < imgName.length; i++) {
        var name = imgName[i].innerHTML;
        data += `${name}\n`;
    }
    return data;
}

function getPathData() {
    // console
    var data = "";
    var imgName = document.querySelectorAll("img");
    // console.log('imgName[0]:',imgName[0].src);
    var lastIndex = imgName[0].src.lastIndexOf("/");
    var path = imgName[0].src.substring(0, lastIndex);
    // console.log('data:',path);
    return path;
}

var copyContainer = document.createElement("div");
copyContainer.setAttribute("class", "copy-container");

var websiteNameButton = document.createElement("button");
websiteNameButton.setAttribute("class", "copy-button");
websiteNameButton.innerHTML = getWebsiteNameFromUrl();
copyContainer.appendChild(websiteNameButton);

var copyUrlPath = document.createElement("button");
copyUrlPath.setAttribute("class", "copy-button");
copyUrlPath.innerHTML = "Copy Url Path";
copyUrlPath.style.display = "block";
copyUrlPath.addEventListener('click', async () => await navigator.clipboard.writeText(getUrlPathData()));

copyContainer.appendChild(copyUrlPath);


var copyButton = document.createElement("button");
copyButton.setAttribute("class", "copy-button");
copyButton.innerHTML = "Copy List";
copyButton.style.display = "block";
copyButton.addEventListener('click', async () => await navigator.clipboard.writeText(getData()));

copyContainer.appendChild(copyButton);

var copyPathButton = document.createElement("button");
copyPathButton.setAttribute("class", "copy-button");
copyPathButton.innerHTML = "Copy Path";
copyPathButton.style.display = "block";
copyPathButton.addEventListener('click', async () => await navigator.clipboard.writeText(getPathData()));

copyContainer.appendChild(copyPathButton);

/*
<label class="switch">
  <input type="checkbox" class="mode-input">
  <span class="slider round"></span>
</label> 
*/
var modeSwitch = document.createElement("label");
modeSwitch.setAttribute("class", "switch");
var modeInput = document.createElement("input");
modeInput.setAttribute("type", "checkbox");
modeInput.setAttribute("class", "mode-input");
var modeSpan = document.createElement("span");
modeSpan.setAttribute("class", "slider round");
modeSwitch.appendChild(modeInput);
modeSwitch.appendChild(modeSpan);

copyContainer.appendChild(modeSwitch);

var imgContainer = document.getElementById("imgs-container");
document.body.insertBefore(copyContainer, imgContainer);


// shortcuts tables

// new code for checkbox at the top of the page:
var anchorTags = document.querySelectorAll('a');
var headerNamesList = [];
for(var i=0;i<anchorTags.length;i++){
    if(!headerNamesList.includes(anchorTags[i].innerText)) headerNamesList.push(anchorTags[i].innerText);
}

console.log('headerNamesList',headerNamesList)
createCheckBoxs(headerNamesList);
function createCheckBoxs(headerNamesList){
    var checkBoxesContainers = document.querySelector('#checkboxes-container');
    for(var i=1;i<headerNamesList.length;i++){
        var checkBoxDiv = document.createElement("div");
        checkBoxDiv.setAttribute("class",'check-box-div');
        var checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.id = 'myCheckbox'+i;

        // Create the label
        const label1 = document.createElement('label');
        label1.htmlFor = 'myCheckbox'+i; // Link label to checkbox
        label1.innerText = headerNamesList[i];

        checkBox.addEventListener('change',function(){
            console.log('element clicked');
        })

        checkBoxDiv.appendChild(checkBox);
        checkBoxDiv.appendChild(label1);

        console.log(checkBoxDiv,checkBoxDiv.innerHTML);

        checkBoxesContainers.appendChild(checkBoxDiv);
    }
    // checkBoxesContainers.appendChild
}
