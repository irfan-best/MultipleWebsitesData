var consoleLevel = 1; // 0: no logs, 1: important logs, 2: all logs

var nrmlURL = 'file:///E:/All in One/Websites/Get Files for All Folders/public/';
var localHostURL = 'http://localhost:3001/';
var folderInsidePublic = 'All Websites Links/';

var focusElement = 0;
var no_Of_Imgs_Per_Row = 4;
var rowLevel = 0; 
// when we click on down arrow, row level will increase by 1, and it will show below row imgs
// when we click on up   arrow, row level will decrease by 1, and it will show upper row imgs
// when row level is 0 and no_Of_Imgs_Per_Row is 4
// 0 to 3 will be at top of the page
// when row level is 1, then 4 to 7 will be at top of the page and so on

var rowHeights = [];
// it will store max height of img-boxes in an row for each row, 
// Example, when no_Of_Imgs_Per_Row is 4, then it will calculate max height for each 4 img-boxes and push it to 
// rowHeights array, so rowHeights[0] will have max height of first 4 img-boxes, 
// rowHeights[1] will have max height of next 4 img-boxes and so on.

var initialImgWidthPercent = 100; // when we click on '-' this will reduce by 1 and img width will reduce by 1%
    // when we click on '=' then it will increase by 1

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- List Values --------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

var starNamesList = ['Alina Becker','Byoru','Lady Melamori','Zhu Ke Er'];
var videoFileExtensions = ['.mp4','.webm','.avi','.mkv'];
var directionalKeys = ['ArrowLeft', 'ArrowRight','ArrowUp','ArrowDown'];
var upDownKeys = ['ArrowDown',"ArrowUp"];

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- all booleans -------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
var includeAnimeOrNot = false;
var showImgExetension = false;

var scroll_To_Top_OR_Bottom_Of_Img = false; // true means 'Top', false means 'Bottom'
// when 'z' or '/' is clicked this value will get toggled

var isFullScreen = false; // when enable, when we go to another folder page, will go focusElement,
// so we will be getting scrolled down will be below header - so viewing experiene would be better
// only showing imgs (note: header would still be there but it be top of img we need to scroll to top)

var headToogle = true; // when true then black-header will be should
// when false then black-header1 will be should

var showImgNames = true; 
var showFolderNames = false;

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- all Modes ----------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
var multipleElementsSelectionMode = false;
var M_Mode = false;

var searchMode = false; // when we click on "space" then we enter search mode,
// when we click "esc" then we exit search mode, in search mode we can type text to search for any img

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- new ones -----------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

var blackHeader1 = document.getElementsByClassName('black-header1')[0];
blackHeader1.style.display = 'none';

var fileNameChangeMode = false;
var count2Or1Toogle = false;

var smoothMoment = false;

// used key, h,j,J,t,T,r,R,s,S,a,A
// 1,2,3,4,5,6,7,8,9,0

var elementToScroll;

var url = window.location.href;
