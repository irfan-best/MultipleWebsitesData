console.log("0 set index.js loaded:",fileNames);

var blackHeader = document.querySelector(".black-header");
var blackHeader1 = document.querySelector(".black-header1");

// home is fixed, so it is not in the fileNames array

// no need to set this since it is always same not dynamic
// add li item for home as per this comment
// <li><a onclick="changeList('home')" href="#home">Home(<span id="data0"></span>)</a></li>
// var homeLi = document.createElement("li");
// var homeA = document.createElement("a");
// homeA.setAttribute("onclick", "changeList('home')");
// homeA.setAttribute("href", "#home");
// homeA.textContent = "Home";
// var homeSpan = document.createElement("span");
// homeSpan.setAttribute("id", "data0");
// homeA.appendChild(homeSpan);
// homeLi.appendChild(homeA);
// blackHeader.appendChild(homeLi);

// add li items for each file name in the fileNames array
// <li><a onclick="changeList('Hype')" href="#Hype">Hype(<span id="data-Hype"></span>)</a></li>
// <li><a onclick="changeList('Relaxing')" href="#Relaxing">Relaxing(<span id="data-Relaxing"></span>)</a></li>
// <li><a onclick="changeList('Almost Harem')" href="#Almost%20Harem">Almost Harem(<span id="data-Almost%20Harem"></span>)</a></li>
// <li><a onclick="changeList('Harem')" href="#Harem">Harem(<span id="data-Harem"></span>)</a></li>
// <li><a onclick="changeList('Multiple Love Stories')" href="#Multiple%20Love%20Stories">Multiple Love Stories(<span id="data-Multiple%20Love%20Stories"></span>)</a></li>
// <li><a onclick="changeList('Rom-Com')" href="#Rom-Com">Rom-Com(<span id="data-Rom-Com"></span>)</a></li>
fileNames.forEach(function(fileName, index) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("onclick", "changeList('" + fileName + "')");
    a.setAttribute("href", "#" + fileName.replace(/ /g, "%20"));
    a.textContent = fileName + '(';
    var span = document.createElement("span");
    span.setAttribute("id", "data-" + fileName.replace(/ /g, "%20"));
    a.appendChild(span);
    a.innerHTML += ')';
    li.appendChild(a);
    blackHeader.appendChild(li);
});


// no need to set this since it is always same not dynamic
// <li><a onclick="changeList('home')" href="#home">Home(<span id="data1"></span>)</a></li>
// var homeLi = document.createElement("li");
// var homeA = document.createElement("a");
// homeA.setAttribute("onclick", "changeList('home')");
// homeA.setAttribute("href", "#home");
// homeA.textContent = "Home";
// var homeSpan = document.createElement("span");
// homeSpan.setAttribute("id", "data1");
// homeA.appendChild(homeSpan);
// homeLi.appendChild(homeA);
// blackHeader1.appendChild(homeLi);

// <li><a onclick="changeList('Hype')" href="#Hype">Hype(<span id="data1-Hype"></span>)</a></li>
// <li><a onclick="changeList('Relaxing')" href="#Relaxing">Relaxing(<span id="data1-Relaxing"></span>)</a></li>
// <li><a onclick="changeList('Almost Harem')" href="#Almost%20Harem">Almost Harem(<span id="data1-Almost%20Harem"></span>)</a></li>
// <li><a onclick="changeList('Harem')" href="#Harem">Harem(<span id="data1-Harem"></span>)</a></li>
// <li><a onclick="changeList('Multiple Love Stories')" href="#Multiple%20Love%20Stories">Multiple Love Stories(<span id="data1-Multiple%20Love%20Stories"></span>)</a></li>
// <li><a onclick="changeList('Rom-Com')" href="#Rom-Com">Rom-Com(<span id="data1-Rom-Com"></span>)</a></li>
fileNames.forEach(function(fileName, index) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.setAttribute("onclick", "changeList('" + fileName + "')");
    a.setAttribute("href", "#" + fileName.replace(/ /g, "%20"));
    a.textContent = fileName + '(';
    var span = document.createElement("span");
    span.setAttribute("id", "data1-" + fileName.replace(/ /g, "%20"));
    a.appendChild(span);
    a.innerHTML += ')';
    li.appendChild(a);
    blackHeader1.appendChild(li);
});
