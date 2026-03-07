function removeStartingNumber(str1){
    const list1 = str1.split(" ");
    if(isNumber(list1[0])) return str1.substring(2);

    return str1;
}

function isNumber(str) {
    return !isNaN(str) && str.trim() !== '';
}

function getIndex(currentPage){
    for(var i=0;i<fileNames.length;i++)
        if(removeStartingNumber(fileNames[i]) === currentPage) return i;
    return 0;
}

function imgItemCreator(filename,foldername){

    // <div class="img-item">
    //             <div class="img-box"><img src="Images/Dr Stone.jpg"/></div>
    //             <div class="img-name">Dr Stone</div>
    // </div>

    var imgItem = document.createElement("div");
    imgItem.setAttribute("class","img-item");
    imgItem.addEventListener('click', async () => await navigator.clipboard.writeText(filename.slice(0,filename.lastIndexOf('.'))));

    var imgBox = document.createElement("div");
    imgBox.setAttribute("class","img-box")
    var imgTag = document.createElement("img");
    imgTag.setAttribute("src","Images/"+foldername+"/"+filename);
    imgTag.addEventListener('dblclick',() => {
        // Open the image in a new tab
        console.log('double clicked');
        window.open(imgTag.src, '_blank');
    });
    imgBox.appendChild(imgTag);

    var imgName = document.createElement("div");
    imgName.setAttribute("class","img-name");
    // imgName.innerHTML = filename.length > 31 ? filename.slice(0,29)+".." : filename;
    imgName.innerHTML = filename.slice(0,filename.lastIndexOf('.'));

    imgItem.appendChild(imgBox);
    imgItem.appendChild(imgName);

    return imgItem;
}

var url = window.location.href;
// var currentPage = (window.location.href+"").slice(64);
var currentPage = url.substring(url.indexOf('#')+1);

console.log('current page:',currentPage);

if(currentPage === "home" || currentPage.slice(-5) === ".html")
    homeListGenerator();
else{
    currentPage = currentPage.replaceAll('%20'," ");
    var index = getIndex(currentPage);
    imgListGenerator(fileNames[index],mainList[index]);
}

function imgListGenerator(foldername,animeList,random){
    var imgContainer = document.getElementById("imgs-container");
    imgContainer.innerHTML = "";

    animeList = [...animeList];
    if(random === 'random')
        animeList.sort(() => Math.random() - 0.5);
    
    animeList.forEach((value)=>{
        imgContainer.appendChild(imgItemCreator(value,foldername));
    })
}

function getWhichList(value){
    for(var i=0;i<fileNames.length;i++){
        if(mainList[i].includes(value)) return i;
    }
    return 0;
}

start = 0; end = 50;

function homeListGenerator(random){
    fullList = [];
    for(var i=0;i<fileNames.length;i++)
        fullList.push(...mainList[i]);

    tempSet = new Set(fullList);
    fullList = [...tempSet];

    if(random === 'random')
        fullList.sort(() => Math.random() - 0.5);
    else
        fullList.sort();

    // console.log(fullList);
    tempRes = '';
    var imgContainer = document.getElementById("imgs-container");
    imgContainer.innerHTML = "";
    fullList.forEach((value)=>{
        for(var i=0;i<fileNames.length;i++){
            if(mainList[i].includes(value)){
                imgContainer.appendChild(imgItemCreator(value,fileNames[i]));
                input = value;
                tempRes+=input.substring(0, input.lastIndexOf('.')) + '\n';
            }
        }
    })
    // console.log(tempRes);
}

function changeList(num){
    if(num === 'home')   homeListGenerator();
    else{
        var index = getIndex(num);
        imgListGenerator(fileNames[index],mainList[index]);
    }
}

var allFilesCount = 0;
for(var i=0;i<fileNames.length;i++){
    allFilesCount += mainList[i].length;
    document.getElementById("data-"+removeStartingNumber(fileNames[i])).innerHTML = mainList[i].length;
    document.getElementById("data1-"+removeStartingNumber(fileNames[i])).innerHTML = mainList[i].length;
}
document.getElementById("data0").innerHTML = allFilesCount;
document.getElementById("data1").innerHTML = allFilesCount;


// sendData();
function sendData() {
    // Send the form data to the server using fetch
    console.log('sendData url:',url);
    fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        // Show the server's response
        // imgListGenerator(JSON.parse(data.message),url);
        console.log('successful fetch');

    })
    .catch(error => {
        console.error('Error:', error);
    });
}

