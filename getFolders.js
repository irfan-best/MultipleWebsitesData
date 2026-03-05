const fs = require('fs');
const path = require('path');

function getFolderNames(directoryPath) {
    try {
        // Read all files and folders in the directory
        const items = fs.readdirSync(directoryPath, { withFileTypes: true });

        // Filter only directories
        const folders = items
            .filter((item) => item.isDirectory())
            .map((folder) => folder.name);

        return folders;
    } catch (err) {
        console.error('Error reading directory:', err);
        return [];
    }
}

// Example usage
// const directoryPath = 'C:/Users/besti/Downloads/All in one Data/Websites/Ani List Folder copy 2/Images';
// const folderNames = getFolderNames(directoryPath);
// console.log('Folders:', folderNames);
