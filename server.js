import express from 'express';
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser';
// const fs = require('fs').promises;
import { promises as fs } from 'fs';
import trash from 'trash';
import fs1 from 'fs';
import { get } from 'http';
import path from 'path';

// new changes
// Note we are using ES6 modules, so we need to use import instead of require
// and we have add in package.json ->  "type": "module" (so that we can use import)
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function space_to_Percentile20(text){
    var updatedText = text.replaceAll(' ','%20');
    return updatedText;
}

var BASE_URL = 'E:/All in One/Websites/Get Files for All Folders/public/All Websites Links/';
// E:\All in One\Websites\Get Files for All Folders\public\All Websites Links
const app = express();
const port = 3001;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static('public'));
// const path = require('path');
app.use(express.static(path.join(__dirname, 'public'))); 

// Example usage
// get folder names:
// const fs1 = require('fs');
// const { get } = require('http');

// function getFolderNames(directoryPath) {
//     try {
//         // Read all files and folders in the directory
//         const items = fs1.readdirSync(directoryPath, { withFileTypes: true });

//         // Filter only directories
//         const folders = items
//             .filter((item) => item.isDirectory())
//             .map((folder) => folder.name);

//         return folders;
//     } catch (err) {
//         console.error('Error reading directory:', err);
//         return [];
//     }
// }

async function getFolderNames(directoryPath) {
    try {
        const items = await fs.readdir(directoryPath, { withFileTypes: true });

        const folders = items
            .filter((item) => item.isDirectory())
            .map((folder) => folder.name);

        return folders;
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}

// ----------------------------- Anime Related Data -------------------------------------------------------------


function isNumber(str) {
    return !isNaN(str) && str.trim() !== '';
}

// var folderNames = ['1 fav', '1.1 tier2', '2 watched', '4 dropped', '5 started'];

app.post('/submit', async (req, res) => {
    console.log('submit url');

    // const fieldNames = ['favAnime','tier2Anime','watchedAnime','droppedAnime','startedAnime'];
    // const baseDir = 'C:/Users/besti/Downloads/All in one Data/Websites/Ani List Folder copy 2/Images/';
    const baseDir = mainURL + 'Images/';
    const outputDir = mainURL + 'List Data/';
    let filesResult = {};

    try {
        // Iterate through folder names
        for (let i = 0; i < folderNames.length; i++) {
            const directoryPath = path.join(baseDir, folderNames[i]);

            // Read directory contents
            const files = await fs.readdir(directoryPath);
            console.log('Files in folder:', folderNames[i], files.slice(0, 5));

            // Save the file data to a .js file
            
            const content = 'mainList['+ i +'] ' + ' = ' + JSON.stringify(files, null, 2);
            const tempFilePath = path.join(outputDir, folderNames[i] + '.js');
            await fs.writeFile(tempFilePath, content);

            // Store the files in the result object
            filesResult[folderNames[i]] = files;
        }

        // Send a single response after processing all folders
        res.json({
            message: 'Folders processed successfully.',
            data: filesResult,
        });
    } catch (error) {
        console.error('Error processing folders:', error);
        res.status(500).json({
            message: 'An error occurred while processing folders.',
            error: error.message,
        });
    }
});

function getIndexFileContent(folderNames) {
    var linksText = ""; var scriptsText = ""; var linksText1 = "";
    for(var i=0;i<folderNames.length;i++){
        linksText   += `            <li><a onclick="changeList('${folderNames[i].replaceAll(/'/g, "\\'")}')" href="#${space_to_Percentile20(folderNames[i])}">${folderNames[i]}(<span id="data-${space_to_Percentile20(folderNames[i])}"></span>)</a></li>\n`;
        linksText1  += `            <li><a onclick="changeList('${folderNames[i].replaceAll(/'/g, "\\'")}')" href="#${space_to_Percentile20(folderNames[i])}">${folderNames[i]}(<span id="data1-${space_to_Percentile20(folderNames[i])}"></span>)</a></li>\n`;
        scriptsText += `        <script src="List Data/${folderNames[i]}.js"></script>\n`;
    }

    var fileContent = `<!DOCTYPE html>
<html>
    
    <head>
        <link rel="stylesheet" href="../../main-styles.css">
        <link rel="stylesheet" href="../../serverRelatedButton.css">
    </head>

    <body>

        <ul class='black-header'>
            <li><a onclick="changeList('home')" href="#home">Home(<span id="data0"></span>)</a></li>
`
    +
    linksText
    +
`       </ul>
`
    +
            `
        <ul class='black-header1'>
            <li><a onclick="changeList('home')" href="#home">Home(<span id="data1"></span>)</a></li>
`
            +linksText1 
    +
`       </ul>
            
        <div class="copy-container">
            <button id="no-folders" class='copy-button'>No.of Folders</button>
            <button id="show-website-name" class='copy-button'>Website Name</button>
            <img src="../../M Swith On.png"  class='m-switch-button' id="m-switch-on" style='display:none'/>
            <img src="../../M Swith Off.png" class='m-switch-button' id="m-switch-off"  />
        </div>

        <div class="imgs-container" id="imgs-container">
        </div>

        <div class="picklist-container">
            <div class="remove-button">X</div>
            <label for="categorySelect">Select Website Category:</label>
            <select id="categorySelect">
                <option value="">-- Select Website Category --</option>
            </select>

            <label for="websiteSelect">Select Website:</label>
            <select id="websiteSelect" disabled>
                <option value="">-- Select Website --</option>
            </select>

            <label for="folderSelect">Select Folder:</label>
            <select id="folderSelect" disabled>
                <option value="">-- Select Folder --</option>
            </select>

            <label for="newFolder" class="new-folder-label">New Folder Name:</label>
            <input class="new-folder" type="text">

            <button class="submit-button submit-button-for-website-selection">Submit</button>
        </div>

        <input type="text" class="search-box" />

        <script src="List Data/0 Files.js"></script>
`
    +
    scriptsText
    +`
        <script src="../../boolean and conditional variables.js"></script>
        <script src="../../c set and toogle methods.js"></script>
        <script src="../../general methods.js"></script>
        <script src="../../imagesfunc.js"></script>
        <script src="../../increase.js"></script>
        <script src="../../keyEnteredFunctions.js"></script>
        <script src="../../serverRelatedButtons.js"></script>
        <script src="../../serverCaller.js"></script>
        <script src="../../listSites.js"></script>
        <script src="../../open file name matching folder.js"></script>
    </body>

</html>`

    return fileContent;
}

function getFiles0Content(folderNames) {
    return `
    var fileNames = `
        +
        JSON.stringify(folderNames,null,2)
        +
    `;\nvar mainList = [];`;
}

async function createFiles(mainURL, fileContent, files0Content) {    
    await fs.writeFile(mainURL + 'index.html', fileContent);
    await fs.writeFile(mainURL + 'List Data/0 Files.js', files0Content);
}

app.post('/allFolders', async (req, res) => {
    console.log('req data:' + req.body.url);

    var LAST_URL = req.body.url;
    var mainURL = BASE_URL + LAST_URL;

    console.log('mainURL:', mainURL);

    const directoryPath = mainURL + 'Images';
    console.log('Directory Path:', directoryPath);
    var folderNames = await getFolderNames(directoryPath);
    // console.log('Folder Names:', folderNames);
    // console.log('Folder Names:', folderNames);
    
    var fileContent = getIndexFileContent(folderNames);
    var files0Content = getFiles0Content(folderNames);
    createFiles(mainURL, fileContent, files0Content);

    // console.log('index and 0 Files created successfully.');

    const baseDir = mainURL + 'Images/';
    const outputDir = mainURL + 'List Data/';
    let filesResult = {};

    try {
        // Iterate through folder names
        for (let i = 0; i < folderNames.length; i++) {
            const directoryPath = path.join(baseDir, folderNames[i]);
            // console.log('Processing folder:', directoryPath);

            // Read directory contents
            const files = await fs.readdir(directoryPath);
            // console.log('Files in folder:', folderNames[i], files.slice(0, 5));

            // Save the file data to a .js file
            
            const content = 'mainList['+ i +'] ' + ' = ' + JSON.stringify(files, null, 2);
            const tempFilePath = path.join(outputDir, folderNames[i] + '.js');
            await fs.writeFile(tempFilePath, content);

            // Store the files in the result object
            filesResult[folderNames[i]] = files;
        }

        // Send a single response after processing all folders
        res.json({
            message: 'Folders processed successfully.',
            data: filesResult,
        });
    } catch (error) {
        console.error('Error processing folders:', error);
        res.status(500).json({
            message: 'An error occurred while processing folders.',
            error: error.message,
        });
    }
});


// Serve the static HTML file (optional step if you want to serve the HTML file)

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// New Server Codes:


app.post('/delete-img', async (req, res) => {
    var url = req.body.imgPath;
    console.log('imgPath:', url);

    // url = 'http://localhost:3001/All%20Website%20Links/Main/Naruto%202/Images/hanabi/03ec47b32ce8f86f36b14d1dfc914e35.jpeg';
    var urlSplit = url.split('/');
    // console.log('urlSplit:', urlSplit);
    var websiteName = urlSplit[5].replaceAll('%20'," "); // 'Naruto 2'
    var websiteCategory = urlSplit[4].replaceAll('%20'," "); // 'Main'
    var FolderName = urlSplit[urlSplit.length - 2].replaceAll('%20'," "); // 'Hanabi'
    var fileName = urlSplit[urlSplit.length - 1].replaceAll('%20'," "); // '03ec47b32ce8f86f36b14d1dfc914e35.jpeg'

    console.log('websiteName:', websiteName);
    console.log('websiteCategory:', websiteCategory);
    console.log('FolderName:', FolderName);
    console.log('fileName:', fileName);

    const filePath = path.join(__dirname, 'public','All Websites Links',websiteCategory,websiteName,'Images',FolderName, fileName);
    console.log('File Path:', filePath);

    await deleteToRecycleBin(filePath);
    // /submit
});

async function deleteToRecycleBin(filename) {
  try {
    await trash([filename]); // absolute or relative path
    console.log('Moved to Recycle Bin/Trash');
  } catch (err) {
    console.error('Error moving to trash:', err);
  }
}


app.post('/rename', async (req, res) => {
    var currentImgUrl = req.body.currentImgUrl;
    var newImageName = req.body.newImageName;

    var splitData = currentImgUrl.split('/');
    var oldImageName = splitData[splitData.length-1];
    console.log('in Server: currentImgUrl:'+currentImgUrl);
    console.log('in Server: newImageName:'+newImageName);
    console.log('in Server: oldImageName:'+oldImageName);

    var imgPath = currentImgUrl.slice(0,currentImgUrl.lastIndexOf('/')+1);
    console.log('imgPath:'+imgPath);


    
    // const uploadDir = path.join(__dirname, 'public', 'uploads');
    var oldPath = path.join(__dirname, 'public','All%20Websites%20Links',splitData[splitData.length-5],splitData[splitData.length-4],'Images',splitData[splitData.length-2], oldImageName);
    var newPath = path.join(__dirname, 'public','All%20Websites%20Links',splitData[splitData.length-5],splitData[splitData.length-4],'Images',splitData[splitData.length-2], newImageName);

    oldPath = oldPath.replaceAll('%20'," ");
    newPath = newPath.replaceAll('%20'," ");
    // const oldPath = imgPath + oldImageName;
    // const newPath = imgPath + newImageName;
    console.log('oldPath:'+oldPath);

    try {
        await fs.rename(oldPath, newPath);
        res.json({ success: true, message: 'File renamed successfully' });
    } catch (err) {
        console.error('Rename error:', err);
        res.status(500).json({ success: false, message: 'Rename failed' });
    }
});

app.post('/getAllWebistes',async (req,res) => {
    // var mainURL = BASE_URL + LAST_URL;
    // const directoryPath = mainURL + 'Images';
    console.log('get all websites');
    console.log('baseUrl:',BASE_URL);
    var folderNames = await getFolderNames(BASE_URL);
    // console.log('Folder Names:', folderNames);

    var categoriesOfWebistes = []
    for(var i=1;i<folderNames.length;i++)
        categoriesOfWebistes.push(folderNames[i]);
    // console.log('categoriesOfWebistes',categoriesOfWebistes);

    var categoriesOfWebistesMap = new Map();
    for(var i=0;i<categoriesOfWebistes.length;i++){
        categoriesOfWebistesMap.set(categoriesOfWebistes[i],[]);
    }

    // console.log('categoriesOfWebistesMap',categoriesOfWebistesMap);

    var listOfWebsites = [];
    var mapOfWebsiteAndFolder = new Map();

    for(var i=0;i<categoriesOfWebistes.length;i++){
        var subPath = BASE_URL + categoriesOfWebistes[i] + "/";
        var websites = await getFolderNames(subPath);
        // console.log('websites for category:',categoriesOfWebistes[i],websites);
        listOfWebsites = [...listOfWebsites,...websites];
        categoriesOfWebistesMap.set(categoriesOfWebistes[i],websites);

        for(var j=0;j<websites.length;j++){
            var webSitePath = BASE_URL + categoriesOfWebistes[i] + "/" + websites[j] + '/Images/'
            var folders = await getFolderNames(webSitePath);
            // console.log('webiste[]',j,websites[j]);
            // console.log('folders:',folders)
            mapOfWebsiteAndFolder.set(websites[j],folders);
        }
    }

    // console.log('categoriesOfWebistesMap test',categoriesOfWebistesMap);

    const categoriesOfWebistesObject = Object.fromEntries(categoriesOfWebistesMap);
    // console.log('categoriesOfWebistesObject',categoriesOfWebistesObject);

    // console.log('listOfWebsites:',listOfWebsites);
    // console.log('mapOfWebsiteAndFolder',mapOfWebsiteAndFolder)

    const mapOfWebsiteAndFolderObject = Object.fromEntries(mapOfWebsiteAndFolder);

    res.json({categoriesOfWebistesObject: categoriesOfWebistesObject, categoriesOfWebistes: categoriesOfWebistes,
        listOfWebsites: listOfWebsites, mapOfWebsiteAndFolderObject: mapOfWebsiteAndFolderObject
    });
})

app.post('/deleteSelectedImages',async (req,res) => {
    console.log('deleteSelectedImages',req.body);

    var selectedImagesList = req.body.selectedImagesList;
    console.log('selectedImagesList:', selectedImagesList);

    for(var i=0;i<selectedImagesList.length;i++){
        var url = selectedImagesList[i];
            // url = 'http://localhost:3001/All%20Website%20Links/Main/Naruto%202/Images/hanabi/03ec47b32ce8f86f36b14d1dfc914e35.jpeg';
        var urlSplit = url.split('/');
        // console.log('urlSplit:', urlSplit);
        var websiteName = urlSplit[5].replaceAll('%20'," "); // 'Naruto 2'
        var websiteCategory = urlSplit[4].replaceAll('%20'," "); // 'Main'
        var FolderName = urlSplit[urlSplit.length - 2].replaceAll('%20'," "); // 'Hanabi'
        var fileName = urlSplit[urlSplit.length - 1].replaceAll('%20'," "); // '03ec47b32ce8f86f36b14d1dfc914e35.jpeg'

        console.log('websiteName:', websiteName);
        console.log('websiteCategory:', websiteCategory);
        console.log('FolderName:', FolderName);
        console.log('fileName:', fileName);

        const filePath = path.join(__dirname, 'public','All Websites Links',websiteCategory,websiteName,'Images',FolderName, fileName);
        console.log('File Path:', filePath);

        await deleteToRecycleBin(filePath);
    }


})

// new vala easy way
// 'C:/Users/YourName/Desktop/SourceFolder' -> Oldpath
// 'C:/Users/YourName/Desktop/DestinationFolder' -> Newpath
async function moveFolderNewVala(oldPath, newPath) {
    try {
        // Ensure the destination directory exists (optional but recommended)
        // await fs.mkdir(path.dirname(newPath), { recursive: true });

        await fs.rename(oldPath, newPath);
        console.log('Folder moved successfully!');
    } catch (err) {
        if (err.code === 'EXDEV') {
            // This error happens if you move across different drives/partitions
            console.error('Cannot move across partitions using rename. Use a copy-then-delete approach.');
        } else {
            console.error('Error moving folder:', err);
        }
    }
}

app.post('/moveSelectedImages',async (req,res) => {
    console.log('moveSelectedImages',req.body);
    var firstImageUrl = req.body.selectedImagesList[0];
    var splitData = firstImageUrl.split('/');
    const from = 'public/All Websites Links/'+ splitData[4].replaceAll('%20',' ') + "/" + splitData[5].replaceAll('%20',' ') +"/Images/" + splitData[7].replaceAll('%20',' ');
    const to = 'public/All Websites Links/'+ req.body.categorySelected + "/" + req.body.websiteSelected +"/Images/"+ req.body.folderSelected;

    for(var i=0;i<req.body.selectedImagesList.length;i++){
        var filename = req.body.selectedImagesList[i].substring(req.body.selectedImagesList[i].lastIndexOf('/')+1);     
        filename = filename.replaceAll('%20',' ');
        await moveImageFile(filename, from, to);
    }
    var websiteSelected = req.body.websiteSelected;
    // Alina Becker, Byoru, Lady Melamori, Zhu Ke Er
    if(websiteSelected === 'Alina Becker List' || websiteSelected === 'Byoru List' || websiteSelected === 'Lady Melamori List' || websiteSelected === 'Zhu Ke Er List'){
        var starName = req.body.categorySelected;
        var fromFolderName = splitData[7].replaceAll('%20',' ');
        var toFolderName = req.body.folderSelected;
        console.log('starName:',starName);
        console.log('fromFolderName:',fromFolderName); 
        console.log('toFolderName:',toFolderName);
        
        var selectedImagesList = req.body.selectedImagesList;
        var folderName = [];
        for(var i=0;i<selectedImagesList.length;i++){
            var url = selectedImagesList[i];
            var urlSplit = url.split('/');
            var fileName = urlSplit[urlSplit.length - 1].replaceAll('%20'," ");
            // remove last part i.e .jpg or .png, remove after last . part
            fileName = fileName.substring(0,fileName.lastIndexOf('.'));
            folderName.push(fileName);
        }
        
        console.log('folderName lsit in move:',folderName);

        for(var i=0;i<folderName.length;i++){
            // example moving "Blue Color" and "Red Color" img from 
            // "List 2" to "List 1" for "Zhu Ke Er 0 List" website
            // then move "Blue Color" folder from "Zhu Ke Er List 2" website to 
            // "Zhu Ke Er List 1" website and same for "Red Color" folder
            var fromPath = path.join(__dirname, 'public','All Websites Links',starName,starName + " " + fromFolderName,'Images', folderName[i]);
            var toPath = path.join(__dirname, 'public','All Websites Links',starName,starName + " " + toFolderName,'Images', folderName[i]);
            console.log('fromPath1:',fromPath);
            console.log('toPath1:',toPath);
            await moveFolderNewVala(fromPath, toPath);

            var fromPath = path.join(__dirname, 'public','All Websites Links',starName,starName + " " + fromFolderName + " - Avg",'Images', folderName[i]);
            var toPath = path.join(__dirname, 'public','All Websites Links',starName,starName + " " + toFolderName + " - Avg",'Images', folderName[i]);
            console.log('fromPath2:',fromPath);
            console.log('toPath2:',toPath);
            await moveFolderNewVala(fromPath, toPath);

        }
    }
})

async function moveImageFile(filename, sourceFolder, destinationFolder) {

  console.log('move Image File Called');
  const sourcePath = path.join(__dirname, sourceFolder, filename);
  const destinationPath = path.join(__dirname, destinationFolder, filename);

  console.log('sourcePath:',sourcePath);
  console.log('destinationPath:',destinationPath);

  try {
    // Ensure the destination folder exists
    await fs.mkdir(path.join(__dirname, destinationFolder), { recursive: true });

    // Copy the file
    await fs.copyFile(sourcePath, destinationPath);

    // Delete the original file
    await fs.unlink(sourcePath);

    console.log(`✅ Successfully moved '${filename}' from '${sourceFolder}' to '${destinationFolder}'`);
  } catch (error) {
    console.error(`❌ Failed to move '${filename}':`, error.message);
  }
}

app.post('/copySelectedImages',async (req,res) => {
    console.log('copySelectedImages',req.body);
    var firstImageUrl = req.body.selectedImagesList[0];
    var splitData = firstImageUrl.split('/');
    const from = 'public/All Websites Links/'+ splitData[4].replaceAll('%20',' ') + "/" + splitData[5].replaceAll('%20',' ') +"/Images/" + splitData[7].replaceAll('%20',' ');
    const to = 'public/All Websites Links/'+ req.body.categorySelected + "/" + req.body.websiteSelected +"/Images/"+ req.body.folderSelected;

    for(var i=0;i<req.body.selectedImagesList.length;i++){
        var filename = req.body.selectedImagesList[i].substring(req.body.selectedImagesList[i].lastIndexOf('/')+1);     
        filename = filename.replaceAll('%20',' ');
        await copyImageFile(filename, from, to);
    }

})

async function copyImageFile(filename, sourceFolder, destinationFolder) {

  console.log('move Image File Called');
  const sourcePath = path.join(__dirname, sourceFolder, filename);
  const destinationPath = path.join(__dirname, destinationFolder, filename);

  console.log('sourcePath:',sourcePath);
  console.log('destinationPath:',destinationPath);

  try {
    // Ensure the destination folder exists
    await fs.mkdir(path.join(__dirname, destinationFolder), { recursive: true });

    // Copy the file
    await fs.copyFile(sourcePath, destinationPath);

    // Delete the original file
    // await fs.unlink(sourcePath);

    console.log(`✅ Successfully moved '${filename}' from '${sourceFolder}' to '${destinationFolder}'`);
  } catch (error) {
    console.error(`❌ Failed to move '${filename}':`, error.message);
  }
}

app.post('/moveFolder',async (req,res) => {

    console.log('moveFolder', req.body);
    var firstImageUrl = req.body.selectedImagesList[0];
    var splitData = firstImageUrl.split('/');
    const from = 'public/All Websites Links/' + splitData[4].replaceAll('%20', ' ') + "/" + splitData[5].replaceAll('%20', ' ') + "/Images/" + splitData[7].replaceAll('%20', ' ');
    const to = 'public/All Websites Links/' + req.body.categorySelected + "/" + req.body.websiteSelected + "/Images/" + req.body.folderSelected;

    let allCopied = true;
    for (var i = 0; i < req.body.selectedImagesList.length; i++) {
        var filename = req.body.selectedImagesList[i].substring(req.body.selectedImagesList[i].lastIndexOf('/') + 1);
        filename = filename.replaceAll('%20', ' ');
        try {
            await copyImageFile(filename, from, to);
        } catch (err) {
            allCopied = false;
            console.error(`Failed to copy ${filename}:`, err);
        }
    }

    if (allCopied) {
        const folderPathDel = path.join(__dirname, 'public', 'All Websites Links', splitData[4].replaceAll('%20', ' '), splitData[5].replaceAll('%20', ' '), 'Images', splitData[7].replaceAll('%20', ' '));
        await deleteFolder(folderPathDel);
    }
})

async function deleteFolder(folderPath) {
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`Folder deleted: ${folderPath}`);
  } catch (err) {
    console.error(`Error deleting folder: ${err}`);
  }
}

var pathValueTemp = '';
// Example usage:
app.post('/matchingFolderPath',async (req,res) => {
    pathValueTemp = '';
    console.log('matchingFolderPath',req.body);
    var folderName = req.body.folderName;
    console.log('folderName:',folderName);

    // Search in D:/ drive
    var drive = ['D:/Hentai/'];
    await searchForFolderName(drive, folderName);
    console.log('pathValueTemp1:'+pathValueTemp+"-"+pathValueTemp.length);
    // console.log('pathValueTemp1:'+pathValueTemp+"-");
    if(pathValueTemp === ''){
        drive = ['E:/All in One/Websites/Get Files for All Folders/public/All Websites Links/'];
        await searchForFolderName(drive, folderName);
        console.log('pathValueTemp2:',pathValueTemp+"-"+pathValueTemp.length);
        // console.log('pathValueTemp2:',pathValueTemp+"-");
        if(pathValueTemp !== ''){
            pathValueTemp = pathValueTemp.substring(0,pathValueTemp.length-1);
            console.log('pics data case:'+pathValueTemp);
            var splitData = pathValueTemp.split('/');
            var lastSplit = splitData[splitData.length-1];
            console.log('lastSplit:',lastSplit);
            var tempText = '';
            if(isNumber(lastSplit.split(" ")[0])){
                // 0 best -> should be converted to best
                console.log('is number case');  
                var splittedTemp = lastSplit.split(" ");
                for(var i=1;i<splittedTemp.length;i++){
                    if(i === splittedTemp.length-1) tempText += splittedTemp[i];
                    else tempText += splittedTemp[i] + ' ';
                }

            }

            if(tempText === '') tempText = lastSplit;
            console.log('tempText:',tempText);
            pathValueTemp = 'http://localhost:3001/All%20Websites%20Links/' + splitData[6] + '/' + splitData.slice(7,splitData.length-2).join('/') + '/index.html#' + tempText;
            pathValueTemp = pathValueTemp.replaceAll(' ','%20');
            console.log('Final pathValueTemp:',pathValueTemp);
        }
    }
    // exec(`start "" "${pathValueTemp}"`);
    res.json({pathValueTemp: pathValueTemp});
});

async function searchForFolderName(drive, folderName) {
    // console.log('searchForFolderName called:',drive);
    for(var i=0;i<drive.length;i++){
        var allFolders = await getFolderNames(drive[i]);
        // console.log('allFolders:',allFolders);
        for(var j=0;j<allFolders.length;j++){
            if (allFolders[j].toLowerCase() === folderName.toLowerCase()) {
                // console.log('Found matching folder:', drive[i] + allFolders[j]);
                pathValueTemp = drive[i] + allFolders[j] + '/';
                var splits = pathValueTemp.split('/');
                console.log('splits:',splits,splits.length);
                if(splits.length !== 11 && splits[1] !== 'Hentai'){
                    pathValueTemp = '';
                }
                else return;
            }
        }
        var folderPaths = allFolders.map(f => drive[i] + f + '/');
        await searchForFolderName(folderPaths, folderName);
    }
}

app.post('/matchingFolderPathForStars',async (req,res) => {
    pathValueTemp = '';
    console.log('matchingFolderPathForStars',req.body);
    var folderName = req.body.folderName;
    var websiteName = req.body.websiteName;
    console.log('folderName:',folderName);
    console.log('websiteName:',websiteName);

    // search in - E:\All in One\Websites\Get Files for All Folders\public\All Websites Links
    // \websiteName
    
    // replace "\" with "/"
    pathValueTemp = '';
    var drive = ['E:/All in One/Websites/Get Files for All Folders/public/All Websites Links/' + websiteName + '/'];
    await searchForAllFolderName(drive, folderName);
    console.log('pathValueTemp after all:',pathValueTemp);
    res.json({pathValueTemp: pathValueTemp});
});

// search for folder name in the drive
    // it should return folder path for all folders with that name in the drive, it should return list
    // we need to create new function
    // dont use existing function
async function searchForAllFolderName(drive, folderName) {
    // console.log('searchForFolderName called:',drive);
    for(var i=0;i<drive.length;i++){
        var allFolders = await getFolderNames(drive[i]);
        // console.log('allFolders:',allFolders);
        for(var j=0;j<allFolders.length;j++){
            if (allFolders[j].toLowerCase() === folderName.toLowerCase()) {
                // console.log('Found matching folder:', drive[i] + allFolders[j]);
                pathValueTemp += drive[i] + allFolders[j] + '/;';
                console.log(pathValueTemp);
            }
        }
        var folderPaths = allFolders.map(f => drive[i] + f + '/');
        await searchForAllFolderName(folderPaths, folderName);
    };
}
function createdDate (file) {  
  const { birthtime } = fs1.statSync(file)

  return birthtime
}

app.post('/getImgsCreatedDates',async (req,res) => {
    // console.log('getImgsCreatedDates',req.body);
    var imgPaths = req.body.imgPaths;
    // console.log('imgPaths:',imgPaths);
    var newImgPaths = [];
    for(var i=0;i<imgPaths.length;i++){
        var splitData = imgPaths[i].split('/');
        var filePath = path.join(__dirname, 'public','All Websites Links',splitData[4].replaceAll('%20',' '),splitData[5].replaceAll('%20',' '),'Images',splitData[7].replaceAll('%20',' '), splitData[8].replaceAll('%20',' '));
        console.log('filePath:',filePath);
        var cDate = createdDate(filePath);
        console.log('cDate:',cDate);
        newImgPaths.push({imgPath: imgPaths[i], createdDate: cDate});
    }
    newImgPaths.sort((a, b) => {
            if(a.createdDate === b.createdDate) return b.imgPath.localeCompare(a.imgPath);
            return b.createdDate - a.createdDate;
        }
    );
    // console.log('newImgPaths:',newImgPaths);
    return res.json({newImgPaths: newImgPaths});
});