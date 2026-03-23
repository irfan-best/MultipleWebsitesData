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

function sendData() {
    url = window.location.href;
    console.log('sendData url:', url);
    url = url.replaceAll('%20', ' ');
    urlSplit = url.split('/');
    console.log('urlSplit:', urlSplit);
    url = urlSplit[urlSplit.length - 3] + '/' + urlSplit[urlSplit.length - 2] + '/';
    console.log('sendData url:', url);
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

function renameFile(currentImgUrl,newImageName){
    fetch('http://localhost:3001/rename', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                currentImgUrl: currentImgUrl,
                newImageName: newImageName 
            }
        ), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');

    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function setCategoryNWebsites(){
    console.log('setCategoryNWebsites called');
    if(!localHost_on) return;
    fetch('http://localhost:3001/getAllWebistes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({url: url}), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch data map and list:',data);

        var categoriesOfWebistesMap = new Map();
        for(var i=0;i<data.categoriesOfWebistes.length;i++){
            categoriesOfWebistesMap.set(data.categoriesOfWebistes[i],data.categoriesOfWebistesObject[data.categoriesOfWebistes[i]]);
        }
        console.log('categoriesOfWebistesMap',categoriesOfWebistesMap);

        const categorySelect = document.getElementById('categorySelect');
        const websiteSelect = document.getElementById('websiteSelect');
        const folderSelect = document.getElementById('folderSelect');


        // Populate continents
        for (const websiteCategory of categoriesOfWebistesMap.keys()) {
            const option = document.createElement('option');
            option.value = websiteCategory;
            option.textContent = websiteCategory;
            categorySelect.appendChild(option);
        }

        // Event listener to update websites based on continent
        categorySelect.addEventListener('change', function () {
            console.log('categroySElecte changed');
            const selectedCategory = this.value;
            const websites = categoriesOfWebistesMap.get(selectedCategory) || [];

            // Clear and disable website dropdown if no continent is selected
            websiteSelect.innerHTML = '<option value="">-- Select Website --</option>';
            websiteSelect.disabled = websites.length === 0;

            // Populate websites if available
            websites.forEach(website => {
                const option = document.createElement('option');
                option.value = website;
                option.textContent = website;
                websiteSelect.appendChild(option);
            });

            if (websites.length > 0) {
                websiteSelect.disabled = false;
            }
        });

        websiteSelect.addEventListener('change', function () {
            const selectedWebiste = this.value;
            const folders = data.mapOfWebsiteAndFolderObject[selectedWebiste] || [];

            // Clear and disable website dropdown if no continent is selected
            folderSelect.innerHTML = '<option value="">-- Select Folder --</option>';
            folderSelect.disabled = folders.length === 0;

            // Populate websites if available
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


            if (folders.length > 0) {
                folderSelect.disabled = false;
            }
        });

        folderSelect.addEventListener('change',function(event){
            console.log('folder cahgne',event.target.value);
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
setCategoryNWebsites();

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

function moveServerCaller(){
    console.log('moveServerCaller called');
    console.log('selectedImagesList',selectedImagesList);

    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    const folderSelect = document.getElementById('folderSelect');

    console.log('categorySelect.value',categorySelect.value);
    console.log('websiteSelect.value',websiteSelect.value);
    console.log('folderSelect.value',folderSelect.value);

    var folderName = folderSelect.value;

    // var newFolder = false;
    if(folderSelect.value === '-- Create Folder --'){
        // newFolder = true;
        var newFolder = document.querySelector('.new-folder');
        console.log('newFolder.value',newFolder.value);
        folderName = newFolder.value;
    }


    fetch('http://localhost:3001/moveSelectedImages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {selectedImagesList: selectedImagesList, categorySelected: categorySelect.value, websiteSelected: websiteSelect.value, folderSelected: folderName,
            }), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

function updateOtherWebiste(url) {
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

function copyServerCaller(){
    console.log('moveServerCaller called');
    console.log('selectedImagesList',selectedImagesList);

    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    const folderSelect = document.getElementById('folderSelect');

    console.log('categorySelect.value',categorySelect.value);
    console.log('websiteSelect.value',websiteSelect.value);
    console.log('folderSelect.value',folderSelect.value);

    var folderName = folderSelect.value;

    // var newFolder = false;
    if(folderSelect.value === '-- Create Folder --'){
        // newFolder = true;
        var newFolder = document.querySelector('.new-folder');
        console.log('newFolder.value',newFolder.value);
        folderName = newFolder.value;
    }

    fetch('http://localhost:3001/copySelectedImages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {selectedImagesList: selectedImagesList, categorySelected: categorySelect.value, websiteSelected: websiteSelect.value, folderSelected: folderName,
            }), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

function copyFolderServerCaller(){
    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    const folderSelect = document.getElementById('folderSelect');

    console.log('categorySelect.value',categorySelect.value);
    console.log('websiteSelect.value',websiteSelect.value);
    // console.log('folderSelect.value',folderSelect.value);

    // var folderName = folderSelect.value;

    // // var newFolder = false;
    // if(folderSelect.value === '-- Create Folder --'){
    //     // newFolder = true;
    //     var newFolder = document.querySelector('.new-folder');
    //     console.log('newFolder.value',newFolder.value);
    //     folderName = newFolder.value;
    // }

    var selectedImagesList = [];
    var imgBoxes = document.querySelectorAll('.img-box');
    imgBoxes.forEach((imgBox) => {
        var img = imgBox.querySelector('img');
        if (img) {
            var imgSrc = img.src;
            console.log('imgSrc:', imgSrc);
            selectedImagesList.push(imgSrc);
        }
    });

    console.log('selectedImagesList in copy folder server:', selectedImagesList);
    console.log('categorySelect.value in copy folder server:', categorySelect.value);
    console.log('websiteSelect.value in copy folder server:', websiteSelect.value);
    var folderNameEnter = document.querySelector('.folder-name-enter');
    var folderName = '';
    if(folderNameEnter){
        folderName = folderNameEnter.value;
    }
    console.log('folder name:',folderName);

    fetch('http://localhost:3001/copySelectedImages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {selectedImagesList: selectedImagesList, categorySelected: categorySelect.value, websiteSelected: websiteSelect.value, folderSelected: folderName,
            }), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

function moveFolderServerCaller(){
    const categorySelect = document.getElementById('categorySelect');
    const websiteSelect = document.getElementById('websiteSelect');
    const folderSelect = document.getElementById('folderSelect');

    console.log('categorySelect.value',categorySelect.value);
    console.log('websiteSelect.value',websiteSelect.value);
    // console.log('folderSelect.value',folderSelect.value);

    // var folderName = folderSelect.value;

    // // var newFolder = false;
    // if(folderSelect.value === '-- Create Folder --'){
    //     // newFolder = true;
    //     var newFolder = document.querySelector('.new-folder');
    //     console.log('newFolder.value',newFolder.value);
    //     folderName = newFolder.value;
    // }

    var selectedImagesList = [];
    var imgBoxes = document.querySelectorAll('.img-box');
    imgBoxes.forEach((imgBox) => {
        var img = imgBox.querySelector('img');
        if (img) {
            var imgSrc = img.src;
            console.log('imgSrc:', imgSrc);
            selectedImagesList.push(imgSrc);
        }
    });

    console.log('selectedImagesList in copy folder server:', selectedImagesList);
    console.log('categorySelect.value in copy folder server:', categorySelect.value);
    console.log('websiteSelect.value in copy folder server:', websiteSelect.value);
    var folderNameEnter = document.querySelector('.folder-name-enter');
    var folderName = '';
    if(folderNameEnter){
        folderName = folderNameEnter.value;
    }
    console.log('folder name:',folderName);

    fetch('http://localhost:3001/moveFolder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {selectedImagesList: selectedImagesList, categorySelected: categorySelect.value, websiteSelected: websiteSelect.value, folderSelected: folderName,
            }), // Send the form data as JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log('successful fetch');
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

var urlHref = window.location.href;
if(urlHref.includes('http://localhost:3001/All%20Websites%20Links/')){
    updateCurrentWebsite();
}
function updateCurrentWebsite(){
    var url = window.location.href;
    var urlSplit = url.split('http://localhost:3001/All%20Websites%20Links/')[1];
    var mainUrl = urlSplit.substring(0,urlSplit.lastIndexOf('/index.html')+1).replaceAll('%20',' ');
    console.log('mainUrl:',mainUrl);
    sendDataOtherOne(mainUrl);
}

function sendDataOtherOne(url) {
    // "All%20Websites%20Links/Alina Becker/Alina%20Becker%20uAvg%20-%20Avg/index.html#Rias%20Gremory%20-%20Highschool%20Dxd";
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