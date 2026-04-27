import express from 'express';
import bodyParser from 'body-parser';
import { promises as fs } from 'fs';
import trash from 'trash';
import fs1 from 'fs';
import path from 'path';

// new changes
// Note we are using ES6 modules, so we need to use import instead of require
// and we have add in package.json ->  "type": "module" (so that we can use import)
import { fileURLToPath } from 'url';
import { dirname } from 'path';

var nrmlURL = 'file:///E:/All in One/Websites/Get Files for All Folders/public/';
var localHostURL = 'http://localhost:3001/';
var folderInsidePublic = 'All Websites Links/';

function removeStartFileText(url){
    return url.replaceAll("file:///","");
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 15th march
var consoleLevel = 1;
var nrmlURL = 'file:///E:/All in One/Websites/Get Files for All Folders/public/';
var localHostURL = 'http://localhost:3001/';

function space_to_Percentile20(text){
    var updatedText = text.replaceAll(' ','%20');
    return updatedText;
}

function getMonthName(monthIndex){
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
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

// below this are rechecked
//////////////////////////////////////
// folderPath -> path where file are present
// imgList -> array of img names along with extensions
// this is for "Updating Ranking" button
// rename files that are send in order to temp_0001, temp_0002 ...
// and then renames then again to 0001, 0002 ...
// we are not chaning file extensions - what ever original file name had extension
// same will be there even after 2 renames
async function renameImagesInOrder(folderPath, imgList) {
    try {
        // Step 1: Rename to Temp names to avoid collisions
        // Example: '0 0 0.webp' -> 'temp_0001.webp'
        for (let i = 0; i < imgList.length; i++) {
            const oldName = imgList[i];
            const extension = path.extname(oldName);
            const tempName = `temp_${(i + 1).toString().padStart(4, '0')}${extension}`;
            
            await fs.rename(
                path.join(folderPath, oldName),
                path.join(folderPath, tempName)
            );

            console.log('1st Renamed from to:',oldName, tempName);
            
            // Update the list with temp names for the second pass
            imgList[i] = tempName;
        }
        // console.log('first update imgList:',imgList);

        // Step 2: Rename to Final Rank names
        // Example: 'temp_0001.webp' -> 'Rank 0001.webp'
        for (let i = 0; i < imgList.length; i++) {
            const tempName = imgList[i];
            const extension = path.extname(tempName);
            const finalName = `${(i + 1).toString().padStart(4, '0')}${extension}`;

            await fs.rename(
                path.join(folderPath, tempName),
                path.join(folderPath, finalName)
            );
        }
        // console.log('2nd update imgList:',imgList);

        return { success: true };
    } catch (error) {
        console.error("Renaming Error:", error);
        throw error;
    }
}

app.post('/update-img-ranking', async (req, res) => {
    var { folderPath, imgNamesWithExtension } = req.body;
    console.log('update-img-ranking folderPath:',folderPath);
    var imgList = JSON.parse(imgNamesWithExtension);

    // Basic Validation
    if (!folderPath || !imgList || !Array.isArray(imgList)) {
        return res.status(400).json({ error: "Missing folderPath or imgList" });
    }

    try {
        await renameImagesInOrder(folderPath, imgList);
        res.status(200).json({ message: "Images re-ranked successfully!" });
    } catch (err) {
        res.status(500).json({ 
            error: "Failed to rename files", 
            details: err.message 
        });
    }
});

// we change file name and click on submit for one img then this route will get called
app.post('/rename-single-file', async (req, res) => {
    var {folderPath, currentImgName, newImageName} = req.body;

    console.log('rename-single-file route: folderPath:'+folderPath);
    console.log('rename-single-file route: currentImgName:'+currentImgName);
    console.log('rename-single-file route: newImageName:'+newImageName);

    try{
        await fs.rename(
            path.join(folderPath, currentImgName),
            path.join(folderPath, newImageName)
        );
        res.json({ success: true, message: 'File renamed successfully' });
    }
    catch (err){
        console.error('Rename error:', err);
        res.status(500).json({ success: false, message: 'Rename failed' });
    }
});

// used to set setCategoryNWebsites
app.post('/get-categories-webistes-foldernames',async (req,res) => {
    console.log('get-categories-webistes-foldernames route');
    var folderNames = await getFolderNames(BASE_URL);
    // console.log('categories List:',folderNames);
    var categoriesList = [];

    for(var i=1;i<folderNames.length;i++)
        categoriesList.push(folderNames[i]);
    // we are not adding first folder, since first folder is "0 Sample" folder

    // console.log('categoriesList',categoriesList);

    var categoriesToWebistesMap = new Map();
    var websiteToFolderMap = new Map();
    
    for(var i=0;i<categoriesList.length;i++){
        var subPath = removeStartFileText(nrmlURL) + folderInsidePublic + categoriesList[i] + "/";
        // console.log('subPath:',subPath);
        var websites = await getFolderNames(subPath);

        // console.log('websites for category:',categoriesList[i]);
        // console.log('websites:',websites);
        categoriesToWebistesMap.set(categoriesList[i],websites);

        for(var j=0;j<websites.length;j++){
            var webSitePath = BASE_URL + categoriesList[i] + "/" + websites[j] + '/Images/'
            var folders = await getFolderNames(webSitePath);
            websiteToFolderMap.set(websites[j],folders);
        }
    }

    // converting Map into javascript object - since JSON.stringify doesn't support Map
    const categoriesToWebistesMapObject = Object.fromEntries(categoriesToWebistesMap);
    const websiteToFolderMapObject = Object.fromEntries(websiteToFolderMap);

    // console.log('categoriesToWebistesMap:',categoriesToWebistesMap);
    // console.log('websiteToFolderMap:',websiteToFolderMap);

    res.json(JSON.stringify(
        {
            categoriesToWebistesMapObject: categoriesToWebistesMapObject, 
            websiteToFolderMapObject: websiteToFolderMapObject,
            categoriesList: categoriesList
        }
    ));
})

// new 15th march
// when we click on 'x' for an img, then this route will be executed
// deleted img would be present in recycle bin
// input = 'http://localhost:3001/All%20Website%20Links/Main/Naruto%202/Images/hanabi/03ec47b32ce8f86f36b14d1dfc914e35.jpeg';
// output = 'E:\All in One\Websites\Get Files for All Folders\public\All Websites Links\2 Animes\Naruto 2\Images\ew ones\ff.jpeg
app.post('/delete-img', async (req, res) => {
    var url = req.body.imgPath;
    
    var updatedUrlPath = url.replaceAll('%20',' ').replaceAll(localHostURL,nrmlURL).replaceAll('/','\\').replace('file:\\\\\\','');
    
    if(consoleLevel >= 1){
        console.log('delete-img server: imgPath:', url);
        console.log('updatedUrlPath:', updatedUrlPath);
    }
    
    await deleteToRecycleBin(updatedUrlPath);
});

async function deleteToRecycleBin(filename) {
  try {
    await trash([filename]); // absolute or relative path
    if(consoleLevel >= 1)
        console.log('deleteToRecycleBin: Moved to Recycle Bin/Trash');
  } catch (err) {
        if(consoleLevel >= 1)
            console.error('deleteToRecycleBin: Error moving to trash:', err);
  }
}

app.post('/move-folder',async (req,res) => {

    console.log('move-folder route:', req.body);
    var {oldFolderPath,newFolderPath,renameFolder,url,newFolderName,oldFolderName} = req.body;

    console.log('oldFolderPath:', oldFolderPath);
    console.log('newFolderPath:', newFolderPath);
    // newFolderPath = E:\\All in One\\Websites\\Get Files for All Folders\\public\\All Websites Links\\1 Main\\Not Completed List\\Images\\6 dropped\\

    var parentOfNewFolderPath = newFolderPath.slice(0,newFolderPath.lastIndexOf('\\')); // removes last slash
    parentOfNewFolderPath = parentOfNewFolderPath.slice(0,parentOfNewFolderPath.lastIndexOf('\\')+1); // removes folder name
    console.log('parentOfNewFolderPath:', parentOfNewFolderPath);

    var folderNamesInParentOfNewFolderPath = await getFolderNames(parentOfNewFolderPath);
    console.log('folderNamesInParentOfNewFolderPath:', folderNamesInParentOfNewFolderPath);

    var newFolerName = newFolderPath.slice(0,newFolderPath.length-1); // remove last slash
    newFolerName = newFolerName.slice(newFolerName.lastIndexOf('\\')+1); // removes everything except folder name
    console.log('newFolerName:', newFolerName);

    // check if new path already has folder with same name, if yes then add current date time to new folder name
    if(folderNamesInParentOfNewFolderPath.includes(newFolerName)){
        var newFolderPathWithDateTime = parentOfNewFolderPath + newFolerName + ' _' + new Date().toISOString().replaceAll(':','-') + '\\';
        newFolderPath = newFolderPathWithDateTime;
    }

    console.log('final newFolderPath:', newFolderPath);

    try{
        await fs.rename(oldFolderPath, newFolderPath);

        if(renameFolder)
            await replaceNameInFolderOrderFile(url, newFolderName, oldFolderName);

        res.json({ success: true, message: 'moved folder successfully' });
    }
    catch(error){
        console.log('error moving folder:',error);
        res.status(500).json({ success: false, message: 'moving folder failed' });
    }
})

async function replaceNameInFolderOrderFile(url, newFolderName, oldFolderName){
    console.log('replaceNameInFolderOrderFile called with url:', url);
    var fileExplorerPath = removeStartFileText(nrmlURL) + folderInsidePublic + url;
    const orderFilePath = path.join(fileExplorerPath, 'List Data/0 Folders Order.js');
    // read orderFilePath and replace oldFolderName with newFolderName and then write it back
    try{
        var data = await fs.readFile(orderFilePath, 'utf-8');
        var updatedData = data.replaceAll('"' + oldFolderName + '"', '"' + newFolderName + '"');
        await fs.writeFile(orderFilePath, updatedData, 'utf-8');
        console.log('Folder name updated in order file successfully');
        console.log('updatedData:', updatedData);
    }
    catch(error){
        console.log('Error updating folder name in order file:', error);
    }
}

app.post('/copy-folder',async (req,res) => {

    console.log('copy-folder route:', req.body);
    var {oldFolderPath,newFolderPath} = req.body;

    console.log('oldFolderPath:', oldFolderPath);
    console.log('newFolderPath:', newFolderPath);
    // newFolderPath = E:\\All in One\\Websites\\Get Files for All Folders\\public\\All Websites Links\\1 Main\\Not Completed List\\Images\\6 dropped\\

    var parentOfNewFolderPath = newFolderPath.slice(0,newFolderPath.lastIndexOf('\\')); // removes last slash
    parentOfNewFolderPath = parentOfNewFolderPath.slice(0,parentOfNewFolderPath.lastIndexOf('\\')+1); // removes folder name
    console.log('parentOfNewFolderPath:', parentOfNewFolderPath);

    var folderNamesInParentOfNewFolderPath = await getFolderNames(parentOfNewFolderPath);
    console.log('folderNamesInParentOfNewFolderPath:', folderNamesInParentOfNewFolderPath);

    var newFolerName = newFolderPath.slice(0,newFolderPath.length-1); // remove last slash
    newFolerName = newFolerName.slice(newFolerName.lastIndexOf('\\')+1); // removes everything except folder name
    console.log('newFolerName:', newFolerName);

    // check if new path already has folder with same name, if yes then add current date time to new folder name
    if(folderNamesInParentOfNewFolderPath.includes(newFolerName)){
        var newFolderPathWithDateTime = parentOfNewFolderPath + newFolerName + ' _' + new Date().toISOString().replaceAll(':','-') + '\\';
        newFolderPath = newFolderPathWithDateTime;
    }
    
    console.log('final newFolderPath:', newFolderPath);

    try{
        await fs.cp(oldFolderPath, newFolderPath, { recursive: true });
        res.json({ success: true, message: 'copy folder successfully' });
    }
    catch(error){
        console.log('error moving folder:',error);
        res.status(500).json({ success: false, message: 'copy folder failed' });
    }
})

app.post('/delete-folder',async (req,res) => {

    console.log('delete-folder route:', req.body);
    var {folderPath,newFolderPath} = req.body;

    console.log('folderPath:', folderPath);
    
    try {
        // recursive: true - deletes folder and all contents
        // force: true - ignores errors if the folder doesn't exist
        await fs.rm(folderPath, { recursive: true, force: true });
        res.json({ success: true, message: 'Folder deleted successfully' });
    } 
    catch (error) {
        console.error('Del Folder error:', error);
        res.status(500).json({ success: false, message: 'Failed to Del Folder' });
    }
})

/**
 * Creates a new folder at a specific base path.
 * @param {string} basePath - e.g., "E:/All in One/Websites/Get Files for All Folders/"
 * @param {string} folderName - e.g., "first folder"
 */
async function createNewFolder(basePath, folderName) {
    // path.join handles slashes correctly regardless of OS
    const fullPath = path.join(basePath, folderName);

    try {
        await fs.mkdir(fullPath, { recursive: true });
        console.log(`Directory created successfully at: ${fullPath}`);
        return fullPath;
    } catch (err) {
        console.error(`Error creating directory: ${err.message}`);
        throw err;
    }
}

// need to update data part getting added to file name
app.post('/move-selected-images',async (req,res) => {
    console.log('move-selected-images route',req.body);
    
    var {oldFolderPath,newFolderPath,selectImgNamesList} = req.body;
    console.log('oldFolderPath:', oldFolderPath);
    console.log('newFolderPath:', newFolderPath);
    console.log('selectImgNamesList:', selectImgNamesList);

    try{
        var newFolderName = newFolderPath.slice(newFolderPath.lastIndexOf('/')+1);
        var pathToCreateNewFolder = newFolderPath.slice(0,newFolderPath.lastIndexOf('/')+1); 
        await createNewFolder(pathToCreateNewFolder, newFolderName );

        // get file names in new folder path
        // new folder path = pathToCreateNewFolder + newFolderName
        var fileNames = await getFileFullNames(path.join(pathToCreateNewFolder, newFolderName));
        console.log('fileNames in new folder path:', fileNames);

        var updatedImgNamesList = selectImgNamesList.map(imgName => {   
            const lastDotIndex = imgName.lastIndexOf('.');
            const nameWithoutExt = imgName.slice(0, lastDotIndex);
            const extension = imgName.slice(lastDotIndex);

            if(fileNames.includes(imgName))
                return (nameWithoutExt + ' _' + new Date().toISOString() + extension).replaceAll(':','-');
            else return imgName;
        });
        console.log('updatedImgNamesList:', updatedImgNamesList);

        for(var i=0;i<selectImgNamesList.length;i++){
            await fs.rename(
                path.join(oldFolderPath, selectImgNamesList[i]),
                path.join(newFolderPath, updatedImgNamesList[i])
            );
        }
        
        res.json({ success: true, message: 'moved selected images successfully' });
    }
    catch(error){
        console.log('error moving selected images:',error);
        res.status(500).json({ success: false, message: 'moving selected images failed' });
    }
    
    // recheck
    var {websiteSelected, starName, fromFolderName, toFolderName} = req.body;
    console.log('websiteSelected:', websiteSelected);
    console.log('starName:', starName);
    console.log('fromFolderName:', fromFolderName);
    console.log('toFolderName:', toFolderName);

    // Alina Becker, Byoru, Lady Melamori, Zhu Ke Er
    if(websiteSelected === 'Alina Becker List' || websiteSelected === 'Byoru List' || websiteSelected === 'Lady Melamori List' || websiteSelected === 'Zhu Ke Er List'){

        var oldFolderPath;
        var newFolderPath;
                
        try{
            for(var i=0;i<selectImgNamesList.length;i++){
                var imgNameWithoutExtension = selectImgNamesList[i];
                imgNameWithoutExtension = imgNameWithoutExtension.slice(0,imgNameWithoutExtension.lastIndexOf('.'));

                oldFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + starName + '/' + 
                    (starName + " " + fromFolderName) + '/' + 'Images/' + imgNameWithoutExtension + '/';

                oldFolderPath = oldFolderPath.replaceAll('/','\\');
                
                newFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + starName + '/' + 
                    (starName + " " + toFolderName) + '/' + 'Images/' + imgNameWithoutExtension + '/';

                newFolderPath = newFolderPath.replaceAll('/','\\');

                console.log('In loop oldFolderPath:', oldFolderPath);
                console.log('In loop newFolderPath:', newFolderPath);

                await fs.rename(oldFolderPath, newFolderPath);

                // for - avg websites moving folder

                oldFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + starName + '/' + 
                    (starName + " " + fromFolderName + " - Avg") + '/' + 'Images/' + imgNameWithoutExtension + '/';

                oldFolderPath = oldFolderPath.replaceAll('/','\\');
                
                newFolderPath = removeStartFileText(nrmlURL) + folderInsidePublic + starName + '/' + 
                    (starName + " " + toFolderName + " - Avg") + '/' + 'Images/' + imgNameWithoutExtension + '/';

                newFolderPath = newFolderPath.replaceAll('/','\\');

                console.log('In loop oldFolderPath for avg:', oldFolderPath);
                console.log('In loop newFolderPath for avg:', newFolderPath);

                await fs.rename(oldFolderPath, newFolderPath);
            }            

            
        }
        catch(error){
            console.log('error moving folder for stars list:',error);
        }
        
    }
})

// need to update data part getting added to file name
app.post('/copy-selected-images',async (req,res) => {
    console.log('copy-selected-images route',req.body);
    
    var {oldFolderPath,newFolderPath,selectImgNamesList} = req.body;
    console.log('oldFolderPath:', oldFolderPath);
    console.log('newFolderPath:', newFolderPath);
    console.log('selectImgNamesList:', selectImgNamesList);

    try{
        var newFolderName = newFolderPath.slice(newFolderPath.lastIndexOf('/')+1);
        var pathToCreateNewFolder = newFolderPath.slice(0,newFolderPath.lastIndexOf('/')+1); 
        await createNewFolder(pathToCreateNewFolder, newFolderName );

        // get file names in new folder path
        // new folder path = pathToCreateNewFolder + newFolderName
        var fileNames = await getFileFullNames(path.join(pathToCreateNewFolder, newFolderName));
        console.log('fileNames in new folder path:', fileNames);

        var updatedImgNamesList = selectImgNamesList.map(imgName => {   
            const lastDotIndex = imgName.lastIndexOf('.');
            const nameWithoutExt = imgName.slice(0, lastDotIndex);
            const extension = imgName.slice(lastDotIndex);

            if(fileNames.includes(imgName))
                return (nameWithoutExt + ' _' + new Date().toISOString() + extension).replaceAll(':','-');
            else return imgName;
        });
        console.log('updatedImgNamesList:', updatedImgNamesList);

        for(var i=0;i<selectImgNamesList.length;i++){
            await fs.copyFile(
                path.join(oldFolderPath, selectImgNamesList[i]),
                path.join(newFolderPath, updatedImgNamesList[i])
            );
        }
        
        res.json({ success: true, message: 'moved selected images successfully' });
    }
    catch(error){
        console.log('error moving selected images:',error);
        res.status(500).json({ success: false, message: 'moving selected images failed' });
    }
})

// need to update data part getting added to file name
app.post('/update-folder-order',async (req,res) => {
    console.log('update-folder-order route',req.body);
    
    var {folderOrderData,websitePath,starsWebsiteCase} = req.body;
    
    try{
        var fileExplorerPath = removeStartFileText(nrmlURL) + folderInsidePublic + websitePath;

        const orderFilePath = path.join(fileExplorerPath, 'List Data/0 Folders Order.js');

        const content = 'var foldersOrder = ' + JSON.stringify(folderOrderData, null, 2) + ';';

        console.log('Updated folder order content:', content);
        console.log('orderFilePath:', orderFilePath);
        await fs.writeFile(orderFilePath, content);
        console.log('Folders order updated with new folder names.');

        if(starsWebsiteCase){
            if(fileExplorerPath.toLowerCase().includes('- avg')){
                var newFileExplorerPath = fileExplorerPath.replaceAll(' - Avg','');
                var newOrderFilePath = path.join(newFileExplorerPath, 'List Data/0 Folders Order.js');
                console.log('newFileExplorerPath for not avg case:', newFileExplorerPath);
                console.log('newOrderFilePath for avg case:', newOrderFilePath);
                await fs.writeFile(newOrderFilePath, content);
                console.log('Also updated folder order for non avg case:', newOrderFilePath);
            }
            else{

                var newFileExplorerPath = fileExplorerPath.slice(0,fileExplorerPath.length-1) + ' - Avg';
                var newOrderFilePath = path.join(newFileExplorerPath, 'List Data/0 Folders Order.js');
                console.log('newFileExplorerPath for avg case:', newFileExplorerPath);
                console.log('newOrderFilePath for avg case:', newOrderFilePath);
                await fs.writeFile(newOrderFilePath, content);
                console.log('Also updated folder order for avg case:', newOrderFilePath);
            }
        }
        
        res.json({ success: true, message: 'folder order updated successfully' });
    }
    catch(error){
        console.log('error moving selected images:',error);
        res.status(500).json({ success: false, message: 'error: folder order updation' });
    }
})

// recheck
// url -> 1 Main/Ani List/
// update url website (updates only 1 website)
app.post('/allFolders', async (req, res) => {
    console.log('allFolders route:' + req.body.url);
    var url = req.body.url;

    var fileExplorerPath = removeStartFileText(nrmlURL) + folderInsidePublic + req.body.url;
    const imagesFolderPath = fileExplorerPath + 'Images';

    console.log('fileExplorerPath:', fileExplorerPath);
    console.log('Directory Path:', imagesFolderPath);

    var folderNames = await getFolderNames(imagesFolderPath);
    // list of all folder names present in "Images" directory 
    
    
    var folderOrderList = await createFoldersOrderFiles(fileExplorerPath);
    
    var fileContent = getIndexFileContent(folderOrderList); // index.html content
    var files0Content = getFiles0Content(folderOrderList); // List Data/0 Files.js content
    createFiles(fileExplorerPath, fileContent, files0Content);

    // console.log('successfully created index.html and 0 Files.js');
    const listDataPath = fileExplorerPath + 'List Data/';

    try {
        const tempFilePath = path.join(listDataPath, "0 Imgs in Folder.js");

        var getOldContent = '';
        getOldContent = await fs.readFile(tempFilePath, 'utf-8');
        // console.log('Old content of 0 Imgs in Folder.js:', getOldContent);

        // 1. Find each full block: mainList[x] = [ ... ];
        const blockRegex = /mainList\[\d+\]\s*=\s*\[([\s\S]*?)\];/g;
        let match;

        // var i = 0;
        // while ((match = blockRegex.exec(getOldContent)) !== null) {
        //     // match[1] contains everything inside the [ ]
        //     const insideBrackets = match[1];

        //     // 2. Extract filenames: look for text inside double quotes
        //     // This removes the quotes, commas, and newlines
        //     const animeList = insideBrackets
        //         .match(/"([^"]+)"/g)         // Find all "string" matches
        //         .map(s => s.replace(/"/g, '')); // Remove the quotes

        //     // animeList = list of file names in one folder
        // }

        var fullContent = '';
        
        for(var i=0;i<folderOrderList.length;i++){
            const eachImageFolderPath = path.join(imagesFolderPath, folderOrderList[i]);
            const files = await fs.readdir(eachImageFolderPath);


            // console.log('Files in eachImageFolderPath:', folderNames[i], files.slice(0, 5));

            // Save the file data to an ".js" file            
            const content = 'mainList['+ i +'] ' + ' = ' + JSON.stringify(files, null, 2);
            fullContent += content + ";\n\n";

        }

        // // Iterate through folder names
        // for (let i = 0; i < folderNames.length; i++) {
        //     const eachImageFolderPath = path.join(imagesFolderPath, folderNames[i]);
        //     // console.log('eachImageFolderPath:', eachImageFolderPath);

        //     // Read directory contents
        //     const files = await fs.readdir(eachImageFolderPath);
        //     // console.log('Files in eachImageFolderPath:', folderNames[i], files.slice(0, 5));

        //     // Save the file data to an ".js" file            
        //     const content = 'mainList['+ i +'] ' + ' = ' + JSON.stringify(files, null, 2);
        //     fullContent += content + ";\n\n";
        // }

        await fs.writeFile(tempFilePath, fullContent);


        if(url === '1 Main/Ani List/'){
            // Update 0 Watched Dates.js with new images not present in the file
            const watchedDatesFilePath = 'E:/All in One/Websites/Get Files for All Folders/public/All Websites Links/0 Watched Dates.js';
            
            // Read existing watched dates file
            let watchedDatesContent = await fs.readFile(watchedDatesFilePath, 'utf8');
            console.log('Read 0 Watched Dates.js content successfully:', watchedDatesContent.slice(0, 200)); // Log first 200 characters
            
            // Extract the animeToWatchedDateMap object from the file
            const mapMatch = watchedDatesContent.match(/var animeToWatchedDateMap = \{([\s\S]*?)\n\}/);
            if (!mapMatch) {
                console.log('Could not find animeToWatchedDateMap in file');
            } else {
                const mapContent = mapMatch[1];
                // Parse existing anime names
                const existingAnimeNames = [];
                const keyValueRegex = /"([^"]+)"\s*:\s*"([^"]+)"/g;
                let match;
                while ((match = keyValueRegex.exec(mapContent)) !== null) {
                    existingAnimeNames.push(match[1]);
                }
                
                // Get all images from all folders in Ani List
                const aniListBasePath = 'E:/All in One/Websites/Get Files for All Folders/public/All Websites Links/1 Main/Ani List/Images/';
                const allFolders = await getFolderNames(aniListBasePath);

                console.log('allFolders in Ani List:', allFolders);
                
                const notPresentOnes = [];
                
                // Iterate through each folder
                for (const folderName of allFolders) {
                    const folderPath = path.join(aniListBasePath, folderName);
                    
                    try {
                        const files = await getFileFullNames(folderPath);
                        console.log(`Checking folder: ${folderName}, files count: ${files.length}`);
                        console.log('files:', files.slice(0, 5)); // Log first 5 files in the folder
                        
                        // Check each image file
                        for (const fileName of files) {
                            // Skip non-image files
                            const ext = path.extname(fileName).toLowerCase();
                            
                            const imageName = path.basename(fileName, ext);
                            
                            // Check if image name is NOT in existing list
                            if (!existingAnimeNames.includes(imageName)) {
                                // Get image creation date
                                const imagePath = path.join(folderPath, fileName);
                                const stats = await fs.stat(imagePath);
                                const createdDate = stats.birthtime;
                                
                                // Format date as "DD MMM YYYY, HH:mm:ss"
                                const formattedDate = `${String(createdDate.getDate()).padStart(2, '0')} ${getMonthName(createdDate.getMonth())} ${createdDate.getFullYear()}, ${String(createdDate.getHours()).padStart(2, '0')}:${String(createdDate.getMinutes()).padStart(2, '0')}:${String(createdDate.getSeconds()).padStart(2, '0')}`;
                                
                                notPresentOnes.push({ name: imageName, date: formattedDate });
                            }
                        }
                    } catch (err) {
                        console.log(`Error processing folder ${folderName}:`, err.message);
                    }
                }
                
                console.log('Not present ones count:', notPresentOnes.length);
                console.log('Not present ones:', notPresentOnes);
                
                // Append not present ones to the map
                if (notPresentOnes.length > 0) {
                    let newEntries = '';
                    for (const item of notPresentOnes) {
                        newEntries += `    "${item.name}" : "${item.date}",\n`;
                    }
                    
                    // Insert new entries before the closing brace
                    watchedDatesContent = watchedDatesContent.replace(
                        /\n\}/,
                        '\n' + newEntries + '}'
                    );
                    
                    // Write back to file
                    await fs.writeFile(watchedDatesFilePath, watchedDatesContent);
                    console.log('Updated 0 Watched Dates.js with', notPresentOnes.length, 'new entries');
                }
            }
        }

        // Send a single response after processing all folders
        res.json({
            message: 'Folders processed successfully.',
            data: 'website updated successfully',
        });
    } 
    catch (error) {
        console.error('Error updating website:', error);
        res.status(500).json({
            message: 'An error occurred while updating website.',
            error: error.message,
        });
    }
});

// example directoryPath = E:/All in One/Websites/Get Files for All Folders/public/All Websites Links/
// returns list of folderNames in the given path's folder
async function getFolderNames(directoryPath) {
    // console.log('getFolderNames called directoryPath:',directoryPath);
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

// returns list of file names (including extensions) in the given directory path
async function getFileFullNames(directoryPath) {
    console.log('getFileFullNames called directoryPath:', directoryPath);
    try {
        const items = await fs.readdir(directoryPath, { withFileTypes: true });

        const files = items
            .filter((item) => item.isFile())
            .map((file) => file.name);

        return files;
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}

function getIndexFileContent(folderNames) {
    var linksText = ""; var linksText1 = "";
    for(var i=0;i<folderNames.length;i++){
        linksText   += `            <li><a onclick="changeList('${folderNames[i].replaceAll(/'/g, "\\'")}')" href="#${space_to_Percentile20(folderNames[i])}">${folderNames[i]}(<span id="data-${space_to_Percentile20(folderNames[i])}"></span>)</a></li>\n`;
        linksText1  += `            <li><a onclick="changeList('${folderNames[i].replaceAll(/'/g, "\\'")}')" href="#${space_to_Percentile20(folderNames[i])}">${folderNames[i]}(<span id="data1-${space_to_Percentile20(folderNames[i])}"></span>)</a></li>\n`;
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
        <button id="no-of-selected-images" class='copy-button'>0 selected imgs</button>
        <button id="no-of-folders" class='copy-button'>No.of Folders</button>
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

        <script src="../../0 Watched Dates.js"></script>
        <script src="List Data/0 Files.js"></script>
        <script src="List Data/0 Imgs in Folder.js"></script>
        <script src="../../boolean and conditional variables.js"></script>
        <script src="../../c set and toogle methods.js"></script>
        <script src="../../general methods.js"></script>
        <script src="../../keyEnteredFunctions.js"></script>
        <script src="../../imagesfunc.js"></script>
        <script src="../../increase.js"></script>
        <script src="../../serverCaller.js"></script>
        <script src="../../serverRelatedButtons.js"></script>
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

async function createFiles(fileExplorerPath, fileContent, files0Content) {    
    await fs.writeFile(fileExplorerPath + 'index.html', fileContent);
    await fs.writeFile(fileExplorerPath + 'List Data/0 Files.js', files0Content);
}

function parseFoldersOrderContent(content) {
    const match = content.match(/var\s+foldersOrder\s*=\s*(\[[\s\S]*?\])\s*;/);
    if (!match) return null;

    const arrayText = match[1];
    try {
        return JSON.parse(arrayText);
    } catch (err) {
        try {
            return Function(`"use strict"; return (${arrayText});`)();
        } catch (err2) {
            console.error('Error parsing folders order content:', err2);
            return null;
        }
    }
}

async function createFoldersOrderFiles(fileExplorerPath) {
    const orderFilePath = path.join(fileExplorerPath, 'List Data/0 Folders Order.js');

    try {
        await fs.access(orderFilePath);
        const getFoldersOrderContent = await fs.readFile(orderFilePath, 'utf-8');
        const foldersOrderList = parseFoldersOrderContent(getFoldersOrderContent);

        if (!Array.isArray(foldersOrderList)) {
            const folderNames = await getFolderNames(path.join(fileExplorerPath, 'Images'));
            const content = 'var foldersOrder = ' + JSON.stringify(folderNames, null, 2) + ';';
            console.log('Invalid folders order content. Recreating with current folder names.');
            // await fs.writeFile(orderFilePath, content);
        }
        console.log('Existing folders order is valid. No update needed.:', foldersOrderList);

        const folderNames = await getFolderNames(path.join(fileExplorerPath, 'Images'));
        // if folderName is not present in foldersOrderList then add that folderName at end of foldersOrderList and update file
        let updated = false;
        for (const folderName of folderNames) {
            if (!foldersOrderList.includes(folderName)) {
                foldersOrderList.push(folderName);
                updated = true;
            }
        }

        // if any folder is present in foldersOrderList but not present in folderNames, then remove that folder from foldersOrderList and update file
        for (let i = foldersOrderList.length - 1; i >= 0; i--) {
            const folderName = foldersOrderList[i];
            if (!folderNames.includes(folderName)) {
                foldersOrderList.splice(i, 1);
                updated = true;
            }
        }
        
        if (updated) {
            const content = 'var foldersOrder = ' + JSON.stringify(foldersOrderList, null, 2) + ';';
            await fs.writeFile(orderFilePath, content);
            console.log('Folders order updated with new folder names.');
        } else {
            console.log('Folders order is already up to date. No changes made.');
        }

        return foldersOrderList;

    } catch (err) {
        const folderNames = await getFolderNames(path.join(fileExplorerPath, 'Images'));
        const content = 'var foldersOrder = ' + JSON.stringify(folderNames, null, 2) + ';';
        await fs.writeFile(orderFilePath, content);

        return folderNames;
    }
}
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// this method is used to update hash in anchor tag of index.html file of website, when we change folder name of a folder which is present in that website, since hash is same as folder name, so we need to update hash as well, otherwise when we click on that anchor tag, it will not take us to that folder since hash is not updated
async function updateAnchorHash(filePath, targetFolder, newHash) {
    try {
        // 1. Read the HTML file
        let content = await fs.readFile(filePath, 'utf8');

        // 2. Encode the new hash (turns spaces into %20)
        const encodedHash = encodeURIComponent(newHash);

        /**
         * 3. Regex Breakdown:
         * href="All Websites Links/ -> Look for this start
         * (${targetFolder}/index.html) -> Match your specific target folder path
         * #[^"]* -> Match the existing hash (everything after # until the closing quote)
         */
        const regex = new RegExp(`(href="All Websites Links\/${targetFolder}\/index\.html)#([^"]*)"`, 'g');

        // 4. Replace with the same base path but the new hash
        const updatedContent = content.replace(regex, `$1#${encodedHash}"`);

        // 5. Save the file back
        await fs.writeFile(filePath, updatedContent, 'utf8');

        console.log('File updated successfully!');
    } catch (err) {
        console.error('Error updating file:', err);
    }
}

// need to update data part getting added to file name
app.post('/update-index-file',async (req,res) => {
    console.log('update-index-file',req.body);
    
    var {folderName,websitePath} = req.body;

    // remove last slash from websitePath
    if(websitePath.endsWith('/'))
        websitePath = websitePath.slice(0, -1);

    try{
        const htmlFilePath = path.join(__dirname, 'public','index.html');
        console.log('htmlFilePath:', htmlFilePath);

        updateAnchorHash(htmlFilePath, websitePath, folderName);
        res.json({ success: true, message: 'index file updated successfully' });
    }
    catch(error){
        console.log('error moving selected images:',error);
        res.status(500).json({ success: false, message: 'error index file updation' });
    }
})

