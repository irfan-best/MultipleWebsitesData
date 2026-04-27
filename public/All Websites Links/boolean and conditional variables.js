var consoleLevel = 0; // 0: no logs, 1: important logs, 2: all logs

var nrmlURL = 'file:///E:/All in One/Websites/Get Files for All Folders/public/';
var localHostURL = 'http://localhost:3001/';
var folderInsidePublic = 'All Websites Links/';

var focusElement = 0;
var no_Of_Imgs_Per_Row = 4; // intially gets value from localStorage('numData');
// if no LocalStorage value, then defaulted to 4.
// this value will only get update when we click on 1 to 0 number to change img size
// no where else it will get updated

var initialImgWidthPercent = 100; // when we click on '-' this will reduce by 1 and img width will reduce by 1%
    // when we click on '=' then it will increase by 1 - only used in that method

var sortingOrder = 'asc'; // asc or desc or random, only used in homeListGenerator and imgListGenerator methods
// when we enter 'r' this will become 'random',
// when we enter 'R' this will become 'asc',
// when we enter 't' this will become 'desc'

var noOfSelectedImgs = document.getElementById("no-of-selected-images");

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- List Values --------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

var starNamesList = ['Alina Becker','Byoru','Lady Melamori','Zhu Ke Er'];
// as of now only used for ctrl+Enter feature

var videoFileExtensions = ['.mp4','.webm','.avi','.mkv'];
// only used in imgItemCreator, to make videos files as yellow colored

var NumKeysList = ['0','1','2','3','4','5','6','7','8','9'];
// only used to check condition for (ctrl+1 case), multipleElementsSelectionMode and 1 enter case
// not running custom functionality when in ifAnyOfWriteModeIsTrue() = true
// when we click on 0 to 9 any button to change img width

var WrittableSpecialKeyList = ['+','=','-','/',';'];
// used to not run custom logic when ifAnyOfWriteModeIsTrue() = true

var upDownKeys = ['ArrowDown','ArrowUp']; // prevent default behavior for all cases
// when fileNameChangeMode  or M_Mode our custom function should still run

var leftRightKeys = ['ArrowLeft','ArrowRight']; 
// to prevent default behavior of ArrowLeft & ArrowRight always except when we ifAnyOfWriteModeIsTrue() = true
// when M_Mode our custom functions should still ron

var navigationKeys = ['w','W','z','/']; 

var selectedImagesList = []; // when multipleElementsSelectionMode is enabled then img names are saved in this list
// it has data like - ['http://localhost:3001/All%20Websites%20Links/1%20M…20november/By%20the%20Grace%20of%20the%20Gods.jpg', 
// 'http://localhost:3001/All%20Websites%20Links/1%20M…my%20List/Images/4th%20november/Beast%20Tamer.jpg']

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- all booleans -------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

var includeAnimeOrNot = false; // enter 's' to toogle, using in imgItemCreator, when we are doing search 
var showImgExetension = false; // enter 'e' to toogle img-name extension

var Initial_ScrollValue = true;
var scroll_To_Top_OR_Bottom_Of_Img = Initial_ScrollValue; // true means 'Top', false means 'Bottom'
// when 'z' or '/' is clicked this value will get toggled
// used in navigateToImgNumber(index);

var specialScrollCase = false;
// For 2 imgs + full screen more, when img height is more than 900px then we will first scroll to top of img and then on next scroll we will scroll to bottom of img, this variable is used to track that condition    

var isFullScreen = false; 
// f to toogle FullScreen (toogleFullScreen), 
// Esc to exit FullScreen - this is default broswer behavior
// If we are in FullScreen mode, when click on anchor element, we will get navigated to first img element
// document.fullscreenchange event using this method we are updating the variable update

// when enable, when we go to another folder page, will go focusElement(0),
// so we will be getting scrolled down and will be below header - so viewing experiene would be better
// only showing imgs (note: header would still be there but it be top of img we need to scroll to top)

var headToogle = true; // when true then black-header will be should
// when false then black-header1 will be should
// when off, copy-container and both black-headers wont be shown
// enter 'H' will make headToogle from to "Off" or true
// entering h will toogle headToogle value from true to false or false to true,
    // but when headToogle = "Off" this wont work. we need to click on H to make headToolge = true

var showImgNames = true; 
var showFolderNames = false;
var localHost_on = false; 
// intially this variable would be set to true if current url starting with localHostURL
// when we click '`' then we are utilizing localHost_on for condition check

var includeFileExtensions = false; // this is for edit img name i guess

var specialFunctionsOnImgClickEnabled = false;
var imgSortedByWatchedDate = false; // false means asc order, true means desc order
// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- all Modes ----------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
// --> note down from here
var multipleElementsSelectionMode = false;
var M_Mode = false;

var searchMode = false; // when we click on "space" then we enter search mode,
// when we click "Escape" then we exit search mode, in search mode we can type text to search for any img

var fileNameChangeMode = false; // when we click on 'x' this mode will get enabled, to change file name
// fileNameChangeMode is not writtable mode

var fileNameChangeFocusMode = false; // when we enter focus on an edit box, then fileNameChangeFocusMode = true,
    // when we exit the focus of the element, then fileNameChangeFocusMode = false;
    // fileNameChangeFocusMode is writtable mode

var imgRankingchangeMode = false;
var showPickListContainer = false;
var folderNameEditingMode = false;

var folderMoveMode = false; // F to toogle the mode

// ----------------------------------------------------------------------------------------------------------
// ------------------------------------------- new ones -----------------------------------------------------
// ----------------------------------------------------------------------------------------------------------


var count2Or1Toogle = false;
var url = window.location.href;
