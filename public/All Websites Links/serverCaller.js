// when we click on 'x' for an image, this method will be executed
function deleteFile(imgSrc) {
    if(consoleLevel >= 1){
        console.log('deleteFile called in serverCaller:', imgSrc);
    }

    fetch('/delete-img', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({        
            imgPath: imgSrc
        })
        
    })
}

function setCategoryNWebsites(){
    if(consoleLevel >= 1)
        console.log('setCategoryNWebsites called');
    
    fetch('http://localhost:3001/get-categories-webistes-foldernames', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        var {categoriesToWebistesMapObject, websiteToFolderMapObject, categoriesList} = JSON.parse(data);
        
        if(consoleLevel>=3){
            console.log('successful fetch get-categories-webistes-foldernames:',data);
            console.log('categoriesToWebistesMapObject:',categoriesToWebistesMapObject);
            console.log('websiteToFolderMapObject:',websiteToFolderMapObject);
            console.log('categoriesList:',categoriesList);
        }

        const categorySelect = document.getElementById('categorySelect');
        const websiteSelect = document.getElementById('websiteSelect');
        const folderSelect = document.getElementById('folderSelect');

        // add categories picklist values
        for (const websiteCategory of Object.keys(categoriesToWebistesMapObject) ) {
            const option = document.createElement('option');
            option.value = websiteCategory;
            option.textContent = websiteCategory;
            categorySelect.appendChild(option);
        }

        // every time category changes, websites picklist values will get changed
        categorySelect.addEventListener('change', function () {
            console.log('category changed');
            const selectedCategory = this.value;
            const websites = categoriesToWebistesMapObject[selectedCategory] || [];

            // Clear and disable website dropdown if no category is selected
            websiteSelect.innerHTML = '<option value="">-- Select Website --</option>';
            websiteSelect.disabled = websites.length === 0;

            // populate websites options if available
            websites.forEach(website => {
                const option = document.createElement('option');
                option.value = website;
                option.textContent = website;
                websiteSelect.appendChild(option);
            });

        });

        // every time website changes, folders picklist values will get changed
        websiteSelect.addEventListener('change', function () {
            console.log('website changed');
            const selectedWebiste = this.value;
            const folders = websiteToFolderMapObject[selectedWebiste] || [];

            // Clear and disable folder dropdown if no website is selected
            folderSelect.innerHTML = '<option value="">-- Select Folder --</option>';
            folderSelect.disabled = folders.length === 0;

            // populate folders options if available
            const option = document.createElement('option');
            option.value = '-- Create Folder --';
            option.textContent = '-- Create Folder --';
            folderSelect.appendChild(option);

            folders.forEach(website => {
                const option = document.createElement('option');
                option.value = website;
                option.textContent = website;
                folderSelect.appendChild(option);
            });

        });

        // when "Create Folder" option is selected then we will be showing
        // new folder name enter box
        folderSelect.addEventListener('change',function(event){
            console.log('folder changed',event.target.value);
            
            var newFolderLabel = document.querySelector(".new-folder-label");
            var newFolder = document.querySelector(".new-folder");
            
            if(event.target.value === '-- Create Folder --'){
                newFolderLabel.style.display = 'block';
                newFolder.style.display = 'block';
            }
            else{
                newFolderLabel.style.display = 'none';
                newFolder.style.display = 'none';
            }
            
        })

    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function renameFile(folderPath,currentImgName,newImageName){
    fetch('http://localhost:3001/rename-single-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                folderPath: folderPath,
                currentImgName: currentImgName.replaceAll('%20', ' '),
                newImageName: newImageName 
            }
        ), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('renameFile success:',data);

    })
    .catch(error => {
        console.error('renameFile Error:', error);
    });
}

function moveSelectedImagesCaller(){
    
    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    const folderSelect = document.getElementById('folderSelect');

    var folderName = folderSelect.value;

    if(folderSelect.value === '-- Create Folder --'){
        folderName = document.querySelector('.new-folder').value;
    }
    
    var oldFolderPath = getCurrentFolderFullPath();
    var newFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + categorySelect.value + "/" + websiteSelect.value + "/Images/" + folderName + "/";

    var selectImgNamesList = getSelectImgNamesList();

    if(consoleLevel >= 1){
        console.log('oldFolderPath:', oldFolderPath);
        console.log('newFolderPath:', newFolderPath);
        console.log('selectImgNamesList:', selectImgNamesList);
    }

    fetch('http://localhost:3001/move-selected-images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                oldFolderPath: oldFolderPath, 
                newFolderPath: newFolderPath, 
                selectImgNamesList: selectImgNamesList,

                websiteSelected: websiteSelect.value,
                fromFolderName: getFolderNameFromUrl(), 
                toFolderName: folderName,
                starName: categorySelect.value,
            }) 
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log('move-selected-images success:',data);
    })
    .catch(error => {
        console.error('move-selected-images Error:', error);
    });
}

function copySelectedImagesCaller(){
    
    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    const folderSelect = document.getElementById('folderSelect');

    var folderName = folderSelect.value;

    if(folderSelect.value === '-- Create Folder --'){
        folderName = document.querySelector('.new-folder').value;
    }
    
    var oldFolderPath = getCurrentFolderFullPath();
    var newFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + categorySelect.value + "/" + websiteSelect.value + "/Images/" + folderName + "/";

    var selectImgNamesList = getSelectImgNamesList();

    if(consoleLevel >= 1){
        console.log('oldFolderPath:', oldFolderPath);
        console.log('newFolderPath:', newFolderPath);
        console.log('selectImgNamesList:', selectImgNamesList);
    }

    fetch('http://localhost:3001/copy-selected-images', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                oldFolderPath: oldFolderPath, 
                newFolderPath: newFolderPath, 
                selectImgNamesList: selectImgNamesList,

                websiteSelected: websiteSelect.value,
                fromFolderName: getFolderNameFromUrl(), 
                toFolderName: folderName,
                starName: categorySelect.value,
            }) 
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log('copy-selected-images success:',data);
    })
    .catch(error => {
        console.error('copy-selected-images Error:', error);
    });
}

function updateCurrentFolderNameCaller(){
    const currentFolderNameInput = document.querySelector('.folder-name-enter');
    var newFolderName = currentFolderNameInput.value;
    var folderPath = getCurrentFolderFullPath().replaceAll('/','\\');
    // last part to get parent folder path

    var parentFolderPath = folderPath.substring(0, folderPath.length - 1); // remove last backslash
    parentFolderPath = parentFolderPath.substring(0, parentFolderPath.lastIndexOf('\\') + 1); // get parent folder path

    var newFolderPath = parentFolderPath + newFolderName + '\\';

    var oldFolderName = getFolderNameFromUrl();
    // update hash part of website with newFolderName
    window.location.hash = newFolderName.replaceAll(' ', '%20');


    if(consoleLevel >= 1){
        console.log('updateCurrentFolderNameCaller newFolderName:', newFolderName);
        console.log('updateCurrentFolderNameCaller folderPath:', folderPath);
        console.log('updateCurrentFolderNameCaller newFolderPath:', newFolderPath);
    }

    var oldFolderPath = folderPath;
    var websitePath = getCategoryNameFromUrl() + "/" + getWebsiteNameFromUrl() + "/";

    fetch('http://localhost:3001/move-folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                oldFolderPath: oldFolderPath, newFolderPath: newFolderPath, renameFolder: true, url: websitePath, newFolderName: newFolderName, oldFolderName: oldFolderName
            })
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log('moveFolderServerCaller success:',data);
    })
    .catch(error => {
        console.error('moveFolderServerCaller Error:', error);
    });

    // setTimeout(() => {
    //     updateCurrentWebiste(); // to update the current website
    // }, 2000); // Delay to allow the deleteFile function to complete
}

function moveFolderServerCaller(){
    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    
    var oldFolderPath = getCurrentFolderFullPath().replaceAll('/','\\');
    var newFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + categorySelect.value 
        + "/" + websiteSelect.value + '/Images/' + getFolderNameFromUrl() + '/';
    newFolderPath = newFolderPath.replaceAll('/','\\');

    console.log('moveFolderServerCaller oldFolderPath',oldFolderPath);
    console.log('moveFolderServerCaller newFolderPath',newFolderPath);

    fetch('http://localhost:3001/move-folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                oldFolderPath: oldFolderPath, newFolderPath: newFolderPath
            })
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log('moveFolderServerCaller success:',data);
    })
    .catch(error => {
        console.error('moveFolderServerCaller Error:', error);
    });
}

function copyFolderServerCaller(){
    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    
    var oldFolderPath = getCurrentFolderFullPath().replaceAll('/','\\');
    var newFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + categorySelect.value 
        + "/" + websiteSelect.value + '/Images/' + getFolderNameFromUrl() + '/';
    newFolderPath = newFolderPath.replaceAll('/','\\');

    console.log('copyFolderServerCaller oldFolderPath',oldFolderPath);
    console.log('copyFolderServerCaller newFolderPath',newFolderPath);

    fetch('http://localhost:3001/copy-folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                oldFolderPath: oldFolderPath, newFolderPath: newFolderPath
            })
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log('copyFolderServerCaller success:',data);
    })
    .catch(error => {
        console.error('copyFolderServerCaller Error:', error);
    });
}

function deleteFolderServerCaller(){    
    var folderPath = getCurrentFolderFullPath().replaceAll('/','\\');

    console.log('deleteFolderServerCaller folderPath',folderPath);

    fetch('http://localhost:3001/delete-folder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                folderPath: folderPath
            })
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log('deleteFolderServerCaller success:',data);
    })
    .catch(error => {
        console.error('deleteFolderServerCaller Error:', error);
    });
}

if(localHost_on){
    updateCurrentWebiste();

    setTimeout(setCategoryNWebsites, 2000);
}

function updateCurrentWebiste(){
    updateOneWebiste(getCategoryNameFromUrl() + "/" + getWebsiteNameFromUrl() + "/");
}

// url -> 1 Main/Ani List/
// url -> {category}/{websitename}/
// this method is used to update one website
function updateOneWebiste(url) {
    if(consoleLevel>=1)
        console.log('updateOneWebiste url:',url);
    
    fetch('http://localhost:3001/allFolders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({url: url}), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('updateOneWebiste Successful fetch:',data);
    })
    .catch(error => {
        console.error('updateOneWebiste Error:', error);
    });
}

// new feature - this method will get called when we click on "Updating Ranking" button
function updateRankingFunc(){
    var imgNamesWithExtension = [];

    var imgTags = document.getElementsByClassName('img-tag');
    for(var i=0;i<imgTags.length;i++){
        var imgSrc = imgTags[i].src.replaceAll('%20', ' ');
        imgNamesWithExtension.push(imgSrc.slice(imgSrc.lastIndexOf('/')+1))
    }
    
    var folderPath = getCurrentFolderFullPath();

    if(consoleLevel >= 1){
        console.log('updateRankingFunc new order imgNamesWithExtension:',imgNamesWithExtension);
        console.log('updateRankingFunc Full path of folder where imgs are there:',folderPath);
    }

    fetch('http://localhost:3001/update-img-ranking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({imgNamesWithExtension: JSON.stringify(imgNamesWithExtension),folderPath: folderPath}), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');

    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateIndexFileWithCurrentFolderNameCaller(){
    var folderName = getFolderNameFromUrl();
    var websitePath = getCategoryNameFromUrl() + "/" + getWebsiteNameFromUrl() + "/";
    if(consoleLevel >= 1){
        console.log('updateIndexFileWithCurrentFolderNameCaller folderName:', folderName);
        console.log('updateIndexFileWithCurrentFolderNameCaller websitePath:', websitePath);
    }

    fetch('http://localhost:3001/update-index-file', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {folderName: folderName, websitePath: websitePath  }), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateFolderOrder(folderOrderData){
    console.log('updateFolderOrder called with folderOrderData:',folderOrderData);

    var categoryName = getCategoryNameFromUrl();
    var websiteName = getWebsiteNameFromUrl();
    var starsWebsiteCase = false;

    console.log('updateFolderOrder categoryName:', categoryName);
    console.log('updateFolderOrder websiteName:', websiteName);
    if(starNamesList.includes(categoryName) && websiteName.toLowerCase().includes('tier')){
        starsWebsiteCase = true;
    }
    var websitePath = getCategoryNameFromUrl() + "/" + getWebsiteNameFromUrl() + "/";
    fetch('http://localhost:3001/update-folder-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {folderOrderData: folderOrderData, websitePath: websitePath, starsWebsiteCase: starsWebsiteCase }), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//////////
// above this rechecked
function deleteServerCaller(){
    console.log('deleteServerCaller called');
    console.log('selectedImagesList',selectedImagesList);

    fetch('http://localhost:3001/deleteSelectedImages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {selectedImagesList: selectedImagesList }), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');
    })
    .catch(error => {
        console.error('Error:', error);
    });

}