var url = 'Animes/Tanjuro Animes/';

function sendData(url) {
    // Send the form data to the server using fetch
    console.log('sendData url:',url);
    fetch('http://localhost:3001/allFolders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({url: url}), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');

    })
    .catch(error => {
        console.error('Error:', error);
    });
}
var LAST_URL_Array = [];
setLAST_URL_Array();
function setLAST_URL_Array(){
    var anchors = document.querySelectorAll('a');
    anchors.forEach(anchor => {
        var href = anchor.getAttribute('href');
        if (href && !LAST_URL_Array.includes(href)) {
            var content = href.substring(0,href.lastIndexOf('index.html')).replaceAll('%20'," ");
            var contentIndex = content.indexOf('/');
            LAST_URL_Array.push(content.substring(contentIndex+1));
        }
    });
    console.log('LAST_URL_Array:'+LAST_URL_Array);
}

var mode = false; // means opens website.
var anchors = document.querySelectorAll('a');

if(window.location.href === "http://localhost:3001/"){
    backgroundColor = 'black';
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = 'white';
    document.body.style.fontFamily = 'Arial, sans-serif';

    var anchorElements = document.querySelectorAll('a');
    anchorElements.forEach(anchor => {
        anchor.style.color = 'white';
        anchor.style.textDecoration = 'none';
    });
}


window.addEventListener('keydown', async function(event) {
    if (event.key === 't'){
        console.log('t key pressed');
        console.log('window.url.href:',window.location.href);
        if(window.location.href === "http://localhost:3001/"){
            var HardCodedURL = 'E:/All in One/Websites/Get Files for All Folders/public/index.html';
            // window.open(HardCodedURL, '_blank');
            navigator.clipboard.writeText(HardCodedURL);
        }
        else{

            // navigator.clipboard.writeText("http://localhost:3001/");
            window.open("http://localhost:3001/", '_blank');
        }
    }

    else if (event.key === 'a'){

        for(var i=0;i<anchors.length;i++){
            anchors[i].classList.add('started-coloring');
        }
        console.log('lasUrlArry:',LAST_URL_Array);
        for(var i=1;i<LAST_URL_Array.length;i++){
            await new Promise(resolve => setTimeout(resolve, 1000));
            sendData(LAST_URL_Array[i]);
            console.log('Sent data for:', LAST_URL_Array[i]);
            anchors[i].classList.remove('started-coloring');
            anchors[i].classList.add('done-coloring');
        }

        console.log('All data sent successfully.');
        for(var i=0;i<anchors.length;i++){
            anchors[i].classList.remove('done-coloring');
        }
    }

    else if (event.key === 'A'){

        for(var i=anchors.length-1;i>=0;i--){
            anchors[i].classList.add('started-coloring');
        }
        console.log('lasUrlArry:',LAST_URL_Array);
        for(var i=LAST_URL_Array.length-1;i>0;i--){
            await new Promise(resolve => setTimeout(resolve, 1000));
            sendData(LAST_URL_Array[i]);
            console.log('Sent data for:', LAST_URL_Array[i]);
            anchors[i].classList.remove('started-coloring');
            anchors[i].classList.add('done-coloring');
        }

        console.log('All data sent successfully.');
        for(var i=anchors.length-1;i>=0;i--){
            anchors[i].classList.remove('done-coloring');
        }
    }

    else if (event.key === 'm') {
        console.log('m key pressed');
        mode = !mode; // Toggle mode
        if(mode){
            console.log('Mode is now:', mode);
            document.body.style.backgroundColor = 'black';
            document.body.style.color = 'white';
            document.body.style.fontFamily = 'Arial, sans-serif';
            var anchorElements = document.querySelectorAll('a');
            anchorElements.forEach(anchor => {
                anchor.style.color = 'white';
                anchor.style.textDecoration = 'none';
            });
        }
        else{
            console.log('Mode is now:', mode);
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
            document.body.style.fontFamily = '';
            var anchorElements = document.querySelectorAll('a');
            anchorElements.forEach(anchor => {
                anchor.style.color = '';
                anchor.style.textDecoration = '';
            });
        }
    }
});

var anchors = document.querySelectorAll('a');
anchors.forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        if(mode){
            // console.log('Mode is true, sending data to server.');
            // console.log('event.target.innerHTML:',event.target.innerHTML);
            // if(event.target.innerHTML.includes('Copy Time Stamps')){
            //     console.log('Copy Time Stamps clicked');
            //     return;
            // }

            event.preventDefault(); // Prevent default anchor click behavior
            var href = this.getAttribute('href');
            console.log('Anchor clicked:', href);
            var urlForServer = href.replaceAll('%20', " ");
            urlForServer = urlForServer.split('/');
            console.log('urlForServer:', urlForServer);
            // urlForServer 
            // var urlForServer = url.substring(0,url.lastIndexOf('index.html')).replaceAll('%20'," ");
            // console.log('urlForServer:',urlForServer);
            sendData(urlForServer[1]+'/'+urlForServer[2]+'/');

        }
        
        // if(href.includes('Naruto 2')){
        //     redirectLink = 'Main/Naruto 2/';
        //     // href = '../' + redirectLink + 'index.html';
        //     href = 'first.html';
            
        //     console.log('Redirecting to:', href);
        // }
        // else{
        //     fun(href); // Call the fun function with the href value
        // }
        // fun(href); // Call the fun function with the href value
    });
});

function fun(url){
    console.log('fun url:',url);

    var Base_URL = 'file:///E:/All%20in%20One/Websites/All%20Created%20Websites/All%20Websites%20Links/';
    
    // 'E:\All in One\Websites\All Created Websites\All Websites Links\List Data\0 Files.js
    // file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/All%20Website%20Links/Main/Naruto%202/index.html#hanabi

    if (!mode){
        // If mode is false, open the URL in a new tab
        window.open(Base_URL+url, '_blank');
    }
    else{
        var urlForServer = url.substring(0,url.lastIndexOf('index.html')).replaceAll('%20'," ");
        console.log('urlForServer:',urlForServer);
        sendData(urlForServer);
    }
}

var url = window.location.href;
console.log('Current URL:', url);
if(url === "http://localhost:3001/"){
    mode = true;
}


var mainBoxs = document.querySelectorAll('.main-box');
mainBoxs.forEach(box => {
    console.log('Box:', box);
    var anchors = box.querySelectorAll('a');
    console.log('Box children:', anchors.length);
    var h1 = box.querySelector('h1');
    h1.textContent += ' (' + (anchors.length) + ')';
});

var copyTerminalPath = document.getElementById('copy-terminal-path');
copyTerminalPath.onclick = function(event){
    navigator.clipboard.writeText(event.target.innerHTML);
} 