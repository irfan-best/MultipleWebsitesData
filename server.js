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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
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
    var {oldFolderPath,newFolderPath} = req.body;

    console.log('oldFolderPath:', oldFolderPath);
    console.log('newFolderPath:', newFolderPath);
    
    try{
        await fs.rename(oldFolderPath, newFolderPath);
        res.json({ success: true, message: 'moved folder successfully' });
    }
    catch(error){
        console.log('error moving folder:',error);
        res.status(500).json({ success: false, message: 'moving folder failed' });
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

        for(var i=0;i<selectImgNamesList.length;i++){
            await fs.rename(
                path.join(oldFolderPath, selectImgNamesList[i]),
                path.join(newFolderPath, selectImgNamesList[i])
            );
        }
        
        res.json({ success: true, message: 'moved selected images successfully' });
    }
    catch(error){
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

// url -> 1 Main/Ani List/
app.post('/allFolders', async (req, res) => {
    console.log('allFolders route:' + req.body.url);

    var fileExplorerPath = removeStartFileText(nrmlURL) + folderInsidePublic + req.body.url;
    const imagesFolderPath = fileExplorerPath + 'Images';

    console.log('fileExplorerPath:', fileExplorerPath);
    console.log('Directory Path:', imagesFolderPath);

    var folderNames = await getFolderNames(imagesFolderPath);
    // list of all folder names present in "Images" directory 
    
    var fileContent = getIndexFileContent(folderNames); // index.html content
    var files0Content = getFiles0Content(folderNames); // List Data/0 Files.js content
    createFiles(fileExplorerPath, fileContent, files0Content);

    // console.log('successfully created index.html and 0 Files.js');
    const listDataPath = fileExplorerPath + 'List Data/';

    try {
        // Iterate through folder names
        for (let i = 0; i < folderNames.length; i++) {
            const eachImageFolderPath = path.join(imagesFolderPath, folderNames[i]);
            // console.log('eachImageFolderPath:', eachImageFolderPath);

            // Read directory contents
            const files = await fs.readdir(eachImageFolderPath);
            // console.log('Files in eachImageFolderPath:', folderNames[i], files.slice(0, 5));

            // Save the file data to an ".js" file            
            const content = 'mainList['+ i +'] ' + ' = ' + JSON.stringify(files, null, 2);
            const tempFilePath = path.join(listDataPath, folderNames[i] + '.js');
            // console.log('tempFilePath:',tempFilePath);
            // console.log('content:',content);
            await fs.writeFile(tempFilePath, content);
        }

        // Send a single response after processing all folders
        res.json({
            message: 'Folders processed successfully.',
            data: 'website updated successfully',
        });
    } catch (error) {
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
    console.log('getFolderNames called directoryPath:',directoryPath);
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

        <script src="List Data/0 Files.js"></script>
`
    +
    scriptsText
    +`
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
