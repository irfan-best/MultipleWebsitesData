console.log('file name matching folder.js run');   

var imgs = document.getElementsByTagName('img');
console.log('imgs:',imgs);

// for(var i=0; i<imgs.length; i++)
// {
//     var imgTag = imgs[i];
//     imgTag.addEventListener('dblclick',() => {
//             // Open the image in a new tab
//             // console.log('double clicked');
//             window.open(imgTag.src, '_blank');
//         });
// }

for(var i=0; i<imgs.length; i++){
    imgs[i].removeEventListener('dblclick', function() {});
    imgs[i].addEventListener('dblclick', function() {
        console.log('dblclick img:',this);
        var folderName = this.src.split('/');
        folderName = folderName[folderName.length - 1];
        folderName = folderName.substring(0, folderName.lastIndexOf('.')).replace(/%20/g, ' ');
        console.log('dblclick folderName:',folderName);
        var matchingFolderPath = '';

        console.log('window.location.href:',window.location.href);
        // get last but one part of the URL path
        var urlParts = window.location.href.split('/');
        var lastButOnePart = urlParts[urlParts.length - 2];
        console.log('lastButOnePart:',lastButOnePart);
        var websiteName = lastButOnePart.replace(/%20/g, ' ');
        console.log('websiteName:',websiteName);

        // Byoru, Lady Melamori, Zhu Ke Er
        var starWebSiteNames = ['Alina Becker List','Byoru List','Lady Melamori List','Zhu Ke Er List'];
        if(starWebSiteNames.includes(websiteName)){
            console.log('Website is in starWebSiteNames, making fetch request to matchingFolderPathForStars');
            fetch('http://localhost:3001/matchingFolderPathForStars', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({folderName: folderName, websiteName: websiteName.replace(" List","")}), // Send the form data as JSON
            })
            .then(response => response.json())
            .then(data => {
                console.log('successful fetch in matchingFolderPathForStars:',data);
                // remove last character
                var matchingLinks = data.pathValueTemp.substring(0, data.pathValueTemp.length - 1);
                var linksArray = matchingLinks.split(';');
                console.log('linksArray:',linksArray);
                for(var i=0; i<linksArray.length; i++){
                    var updatedSplits = linksArray[i].split('/');
                    // remove last element;
                    updatedSplits.pop();
                    console.log('updatedSplits:',updatedSplits);
                    var newLink = '';
                    var oldLink = window.location.href;
                    if(oldLink.includes('localhost:3001')){
                        // http://localhost:3001/All%20Websites%20Links/Byoru/Byoru%20Tier%201%20-%20New%20Ones%201/index.html#black%20dress%20pale
                        var splits = oldLink.split('/');
                        splits[splits.length - 1] = 'index.html#' + updatedSplits[updatedSplits.length - 1].replaceAll(' ', '%20');

                        splits[splits.length - 2] = updatedSplits[updatedSplits.length - 3].replaceAll(' ', '%20');
                        newLink = splits.join('/');
                        console.log('Opening URL:',newLink);
                        // var anchorTag = document.createElement('a');
                        // anchorTag.href = newLink;
                        // anchorTag.target = '_blank';
                        // anchorTag.rel = 'noopener noreferrer';
                        // anchorTag.click();
                        window.open(newLink, '_blank');
                    }
                    else{
                        // file:///E:/All%20in%20One/Websites/Get%20Files%20for%20All%20Folders/public/All%20Websites%20Links/Byoru/Byoru%20Tier%201%20-%20New%20Ones%201/Images/black%20dress%20pale
                    }
                }
                // if(data.pathValueTemp.includes('localhost:3001')){
                //     console.log('Opening URL:',data.pathValueTemp);
                //     var anchorTag = document.createElement('a');
                //     anchorTag.href = data.pathValueTemp;
                //     anchorTag.target = '_blank';
                //     anchorTag.rel = 'noopener noreferrer';
                //     anchorTag.click();
                //     // document.open(data.pathValueTemp, '_blank');
                // }
                // else{
                //     navigator.clipboard.writeText(data.pathValueTemp);
                // }
                // openLocalFolder(data.pathValueTemp);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

        // fetch('http://localhost:3001/matchingFolderPath', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({folderName: folderName}), // Send the form data as JSON
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('successful fetch in matchingFolderPath:',data);
        //     if(data.pathValueTemp.includes('localhost:3001')){
        //         console.log('Opening URL:',data.pathValueTemp);
        //         var anchorTag = document.createElement('a');
        //         anchorTag.href = data.pathValueTemp;
        //         anchorTag.target = '_blank';
        //         anchorTag.rel = 'noopener noreferrer';
        //         anchorTag.click();
        //         // document.open(data.pathValueTemp, '_blank');
        //     }
        //     else{
        //         navigator.clipboard.writeText(data.pathValueTemp);
        //     }
        //     // openLocalFolder(data.pathValueTemp);
        // })
        // .catch(error => {
        //     console.error('Error:', error);
        // });
    });
}

function openLocalFolder(path) {
  window.open(`file:///${path}`, '_blank');
}