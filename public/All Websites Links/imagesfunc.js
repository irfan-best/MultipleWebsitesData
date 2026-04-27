document.querySelectorAll(".black-header a, .black-header1 a").forEach(function(anchor) {
    anchor.addEventListener("click", function(event) {
        if(consoleLevel >= 1){
            console.log('anchor clicked href:',event.target.href);
        }

        focusElement = 0;

        var folderName_With_Percentile20 = event.target.href.split('#')[1]; 
        highLightTheCorrectHeader(folderName_With_Percentile20);

        disableSearchMode();
        clearSearchValue();
        balanceRowLevel();

        multipleElementsSelectionMode = false;
        fileNameChangeFocusMode = false;
        fileNameChangeMode = false;

        if(isFullScreen){
            if(consoleLevel >= 1){
                console.log('isFullScreen is true, navigating to img number 0');
            }
            setTimeout(function() {
                balanceRowLevel();
            }, 50);
        }

        // from serverRelatedButtons.js
        multipleElementsSelectionMode = false;
        imgRankingchangeMode = false;
        selectedImagesList = [];
        setSelectedImgsNumberInUI();
        specialScrollCase = false;
        scroll_To_Top_OR_Bottom_Of_Img = Initial_ScrollValue;

        setFolderName(); // from serverRelatedButtons.js
    });
});

var searchBox = document.querySelector('.search-box');
searchBox.addEventListener('input', (event) => {
    var searchValue = event.target.value;
    if(consoleLevel === 2){
        console.log('Search Box Value changed:',searchValue);
    }
    
    var itemItems = document.getElementsByClassName('img-item');
    var imgNameToCopy = '';
    for(var i=0;i<itemItems.length;i++){
        var imgName = itemItems[i].getElementsByClassName('img-name')[0];
        if(imgName.innerText.toLowerCase().includes(searchValue.toLowerCase())){
            itemItems[i].style.display = 'block';
            if(imgNameToCopy === '') imgNameToCopy = imgName.innerText;
        }
        else{
            itemItems[i].style.display = 'none';
        }
    }

    navigator.clipboard.writeText(imgNameToCopy + (!includeAnimeOrNot ? "" : " Anime"));
});

searchBox.addEventListener('keydown', (event)=>{
    if(event.key === 'Escape'){
        if(consoleLevel >= 1){
            console.log('Disabling SearchMode since Shift is entered');
        }
        disableSearchMode();
    }
})

document.addEventListener('fullscreenchange', () => {
    if(isFullScreen && searchMode){ 
        // if we are in full screen mode and in search Mode, when we click on esc
        // then only we should exit search Mode, wihtout exiting full screen;

        setTimeout(() => {
            disableSearchMode();
            toogleFullScreen();
            console.log('fullScreenMode Entered back when SearchMode was on');
            // toogleFullScreen();

        }, 100); // Delay to allow the deleteFile function to complete
       
    }

    isFullScreen = !isFullScreen;
    
    if(consoleLevel >= 1){
        console.log('isFullScreen updated to:',isFullScreen);
    }
});

var websiteName = getWebsiteNameFromUrl();
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

if(websiteName === 'Ani List'){

    // year and month filter for watched dates
    // year filter should have options from 2020 to current year
    var currentYear = new Date().getFullYear();
    var yearOptions = '<option value="">All Years</option>';
    var yearFilter = document.createElement('select');
    yearFilter.id = 'yearFilter';
    for(var year = 2020; year <= currentYear; year++){
        yearOptions += '<option value="' + year + '">' + year + '</option>';
    }


    // month filter should have options from "January" to "December"
    var monthFilter = document.createElement('select');
    monthFilter.id = 'monthFilter';
    var monthOptions = '<option value="">All Months</option>';
    for(var month = 1; month <= 12; month++){
        monthOptions += '<option value="' + month + '">' + monthNames[month - 1] + '</option>';
    }
    yearFilter.innerHTML = yearOptions;
    monthFilter.innerHTML = monthOptions;

    var filterContainer = document.querySelector('.filter-container') || document.body;
    filterContainer.appendChild(yearFilter);
    filterContainer.appendChild(monthFilter);
    yearFilter.addEventListener('change', filterByYearAndMonth);
    monthFilter.addEventListener('change', filterByYearAndMonth);

    var copyContainer = document.querySelector('.copy-container') || document.body;
    // add month and year filter to copy container
    copyContainer.appendChild(yearFilter);
    copyContainer.appendChild(monthFilter);
}

function filterByYearAndMonth() {

    var selectedYear = yearFilter.value;
    var selectedMonth = monthFilter.value;
    if(selectedMonth !== ''){
        selectedMonth = monthNames[Number(monthFilter.value)-1];
    }

    console.log('Selected Year:', selectedYear);
    console.log('Selected Month:', selectedMonth);

    var itemItems = document.getElementsByClassName('img-item');
    for(var i=0;i<itemItems.length;i++){
        var imgName = itemItems[i].getElementsByClassName('img-name')[0];

        if(imgName.innerText === 'Classroom of the Elite'){
            console.log('imgName.innerText:', imgName.innerText);
            console.log('watchedDate:', animeToWatchedDateMap[imgName.innerText]);
        }
        var watchedDate = animeToWatchedDateMap[imgName.innerText];
        var year = watchedDate.slice(6,10);
        var month = watchedDate.slice(3,5);
        month = monthNames[Number(month)-1];
        
        if((selectedYear === '' || year == selectedYear) && (selectedMonth === '' || month == selectedMonth)){
            itemItems[i].style.display = 'block';
        }
        else{
            itemItems[i].style.display = 'none';
        }
    }
}