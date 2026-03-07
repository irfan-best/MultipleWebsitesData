function getCurrentWebsiteName(){ // returns in %20 format
    var path = window.location.href;
    var pathParts = path.split("/");
    return pathParts[pathParts.length - 2]; 
}

function getCurrentFolderName(){ // returns in %20 format
    var anchors = document.getElementsByTagName("a");
    for (var i = 0; i < anchors.length; i++) {
        if(anchors[i].style.color === 'rgb(10, 221, 150)'){
            var tempu = anchors[i].innerText.replace(/ /g, '%20');
            return tempu.substring(0,tempu.indexOf('('));
        }
    }
}

function remove_20_encoding(str) {
    return str.replace(/%20/g, ' ');
}

console.log('listsites website:',getCurrentWebsiteName());
console.log('listsites folder:',getCurrentFolderName());

// if(!getCurrentWebsiteName().includes('%20List')){
//     return;
// }

