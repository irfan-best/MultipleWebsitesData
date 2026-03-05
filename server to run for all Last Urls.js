const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());

function isNumber(str) {
    return !isNaN(str) && str.trim() !== '';
}

function removeStartingNumber(str1){
    const list1 = str1.split(" ");
    if(isNumber(list1[0])) return str1.substring(2);
    return str1;
}

var BASE_URL = 'E:/All in One/Websites/All Created Websites/All Websites Links/';

// ----------------------------- Anime Related Data -------------------------------------------------------------
// var LAST_URL = "Main/Ani List/";
// var LAST_URL = "Main/0 Characters/";
var LAST_URL = "Main/Ani List Fanservice/";
// var LAST_URL = "Main/Waifus/";

// var LAST_URL = "Main/Hentai/";
// var LAST_URL = "Main/Hentai List/";
// var LAST_URL = "Main/Ecchi List/";

// var LAST_URL = "Categories/1 Hype/";
// var LAST_URL = "Categories/1 Relaxing/";
// var LAST_URL = "Categories/1 Romance Fanservice Heavy/";
// var LAST_URL = "Categories/1 Romance Fanservice Light/";
// var LAST_URL = "Categories/1 Tier1/";
// var LAST_URL = "Categories/2 Romance and Tier2/";
// var LAST_URL = "Categories/7 Started/";
// var LAST_URL = "Categories/Ecchi/";
// var LAST_URL = "Categories/Fanservice Only/";
// var LAST_URL = "Categories/No Fanservice/";

// --------------------------------- Animes -----------------------------------------------------------------------
// var LAST_URL = "Animes/100 Gfs/";
// var LAST_URL = "Animes/2.5 D Seduction/";
// var LAST_URL = "Animes/Black Clover/";
// var LAST_URL = "Animes/Bleach/";
// var LAST_URL = "Animes/Chained Solider/";
// var LAST_URL = "Animes/Chainsaw Man/";
// var LAST_URL = "Animes/Demon Slayer/";
// var LAST_URL = "Animes/Dragon Ball/";
// var LAST_URL = "Animes/Fairy Tale/";
// var LAST_URL = "Animes/High School DxD/";
// var LAST_URL = "Animes/Naruto/";
// var LAST_URL = "Animes/One Piece/";
// var LAST_URL = "Animes/The Seven Heavenly Virtues/";
// var LAST_URL = "Animes/Worlds End Harem/";

// ------------------------------- Characters ----------------------------------------------------------------------
// var LAST_URL = "Characters/Akeno Himejima/";
// var LAST_URL = "Characters/Erza/";
// var LAST_URL = "Characters/Lucy/";
// var LAST_URL = "Characters/Nobara/";
// var LAST_URL = "Characters/Rangiku/";
// var LAST_URL = "Characters/Rias Gremory/";
// var LAST_URL = "Characters/Yor Forger/";

// ------------------------------- Pics Data ------------------------------------------------------------------
// var LAST_URL = "Pics Data/Pics Data/";
// var LAST_URL = "Pics Data/0 Heriones/";

// var LAST_URL = "Pics Data/Alina Becker/";
var LAST_URL = "Pics Data/Alina Becker List/";
// var LAST_URL = "Pics Data/Alina Becker Best/";
// var LAST_URL = "Pics Data/Alina Becker Good/";
// var LAST_URL = "Pics Data/Alina Becker zAvg/";

// var LAST_URL = "Pics Data/Alina Becker Best - Avg/";

// var LAST_URL = "Pics Data/Alina Becker Fapello/";
// var LAST_URL = "Pics Data/Alina Becker 000 Fapello.su/";

// var LAST_URL = "Pics Data/Byoru/";
// var LAST_URL = "Pics Data/Byoru List/";
// var LAST_URL = "Pics Data/Byoru Best/";
// var LAST_URL = "Pics Data/Byoru Good/";
// var LAST_URL = "Pics Data/Byoru zAvg/";
// var LAST_URL = "Pics Data/Byoru Code/";

// var LAST_URL = "Pics Data/lady melamori/";
// var LAST_URL = "Pics Data/Todo Pokie/";
// var LAST_URL = "Pics Data/Victoria Xams/";

// ------------------------------- Stars Data ---------------------------------------------------------------

// var LAST_URL = "Stars Data/Stars/";
// var LAST_URL = "Stars Data/Juicy/";
// var LAST_URL = "Stars Data/Pale/";
// var LAST_URL = "Stars Data/Ass/";
// var LAST_URL = "Stars Data/Japanese/";

runForLastUrls(LAST_URL);
function runForLastUrls(LAST_URL) {

    var mainURL = BASE_URL + LAST_URL;
    
    app.post('/submit', async (req, res) => {
        console.log('submit url');

        const baseDir = mainURL + 'Images/';
        const outputDir = mainURL + 'List Data/';
        let filesResult = {};

        try {
            // Iterate through folder names
            for (let i = 0; i < folderNames.length; i++) {
                const directoryPath = path.join(baseDir, folderNames[i]);

                // Read directory contents
                const files = await fs.readdir(directoryPath);

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
    app.use(express.static('public'));

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    // New code for img sav
    const path = require('path');

    // Example usage
    // get folder names:
    const fs1 = require('fs');

    function getFolderNames(directoryPath) {
        try {
            // Read all files and folders in the directory
            const items = fs1.readdirSync(directoryPath, { withFileTypes: true });

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

    const directoryPath = mainURL + 'Images';
    var folderNames = getFolderNames(directoryPath);
    console.log('Folders:', folderNames);

    linksText = ""; scriptsText = ""; linksText1 = "";
    for(var i=0;i<folderNames.length;i++){
        linksText   += `          <li><a onclick="changeList('${removeStartingNumber(folderNames[i])}')" href="#${removeStartingNumber(folderNames[i])}">${folderNames[i]}(<span id="data-${removeStartingNumber(folderNames[i])}"></span>)</a></li>\n`;
        linksText1  += `          <li><a onclick="changeList('${removeStartingNumber(folderNames[i])}')" href="#${removeStartingNumber(folderNames[i])}">${folderNames[i]}(<span id="data1-${removeStartingNumber(folderNames[i])}"></span>)</a></li>\n`;
        scriptsText += `        <script src="List Data/${folderNames[i]}.js"></script>\n`;
    }
    console.log('linsText')
    console.log(linksText);
    console.log('scriptText')
    console.log(scriptsText);
    `
                <li><a onclick="changeList('fav')" href="#fav">Fav Animes(<span id="data-fav"></span>)</a></li>
                <li><a onclick="changeList('tier2')" href="#tier2">Tier 2(<span id="data-tier2"></span>)</a></li>
                <li><a onclick="changeList('watched')" href="#watched">Watched(<span id="data-watched"></span>)</a></li>
                <li><a onclick="changeList('dropped')" href="#dropped">Dropped(<span id="data-dropped"></span>)</a></li>
                <li><a onclick="changeList('started')" href="#started">Started(<span id="data-started"></span>)</a></li>
    `;

    `
            <script src="List Data/1 fav.js"></script>
            <script src="List Data/1.1 tier2.js"></script>
            <script src="List Data/2 watched.js"></script>
            <script src="List Data/4 dropped.js"></script>
            <script src="List Data/5 started.js"></script>
    `;

    fileContent = `
    <!DOCTYPE html>
    <html>
        <head>
            <link rel="stylesheet" href="../../main-styles.css">
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>

            <ul class='black-header'>
                <li><a onclick="changeList('home')" href="#home">Home(<span id="data0"></span>)</a></li>
    `
    +
    linksText
    +
    `
            </ul>`
    +
            `<ul class='black-header1'>
                <li><a onclick="changeList('home')" href="#home">Home(<span id="data1"></span>)</a></li>`
            +linksText1 
    +
    `
            </ul>
            <div class="imgs-container" id="imgs-container">
            </div>

            <!-- dir /B -->
            <!-- use this command to get all file names in a folder -->
            <script src="List Data/0 Files.js"></script>
    `
    +
    scriptsText
    +`
            <script src="../../imagesfunc.js"></script>
            <script src="../../increase.js"></script>
            // <script src="imagesfunc.js"></script>
        </body>

    </html>
    `

    files0Content = `
    var fileNames = `
        +
        JSON.stringify(folderNames,null,2)
        +
    `;\nvar mainList = [];`
    console.log('fiels0content');
    console.log(files0Content);

    async function createFiles(){
        await fs.writeFile(mainURL + 'index.html', fileContent);
        await fs.writeFile(mainURL + 'List Data/0 Files.js', files0Content);
        
    }
    createFiles();

}