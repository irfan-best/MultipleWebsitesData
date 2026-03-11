function getCurrentWebsiteName(){ // returns in %20 format
    var path = window.location.href;
    var pathParts = path.split("/");
    return pathParts[pathParts.length - 2]; 
}

function remove_20_encoding(str) {
    return str.replace(/%20/g, ' ');
}

console.log('listsites website:',getCurrentWebsiteName());

// if(!getCurrentWebsiteName().includes('%20List')){
//     return;
// }

