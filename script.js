/*
 *  Modified work Copyright 2016 Daniel McKnight
 *  Original work Copyright 2010 Hrishikesh Bakshi
 *  
 *  Responsive-Reddit-Sidebar
 *  Responsively or manually hide Reddit's sidebar.
 */

var showSidebarText = "Show Sidebar";
var hideSidebarText = "Hide Sidebar";
var lockSidebarText   = "Lock Sidebar";
var unlockSidebarText = "Unlock Sidebar";
var breakpoint = 768;
var show = '<span class="separator">|</span>'+
    '<span id="hideSpan" class="showlink">'+
    '<a id="lockLink" href=""></a></span>'+
    '<span class="separator">|</span>'+
    '<a id="hslink" href=""></a></span>';

function hideSidebar() {
    /* 1) change text, 2) hide, 3) set status */
    $("a#hslink").text(showSidebarText);
    $('div.side').hide();
    chrome.storage.local.set({'sidebarStatus': 'hide'});
}
function showSidebar() {
    $("a#hslink").text(hideSidebarText);
    $('div.side').show();
    chrome.storage.local.set({'sidebarStatus': 'show'});
}
function lockSidebar() {
    $("a#lockLink").text(unlockSidebarText);
    chrome.storage.local.set({'lockStatus': 'locked'});
}
function unlockSidebar() {
    $("a#lockLink").text(lockSidebarText);
    chrome.storage.local.set({'lockStatus': 'unlocked'});
}
function respond() {
    if ($( window ).width() < breakpoint) {
        hideSidebar();
    } else {
        showSidebar();
    }
}

/*
* We do two (3) main tasks when the page is loaded:
* 1) Read the localStorage to resume state, if any
* 2) Initialize the "on-page / in-tab storage"
*    (a.k.a. the toggle links for 'show/hide' etc.)
* 3) Hide the listing-chooser when away from Front-Page
*/
$( document ).ready(function() {
	// Setup the area wher the toggles will go.
    $("div#header-bottom-right").append(show);
    
    chrome.storage.local.get('lockStatus', function(lockStatus) {
    	console.log("On ready lockStatus:" + lockStatus['lockStatus']);
	    // First check localStorage to resume last state
	    if (lockStatus['lockStatus'] == 'locked') {
	    	// If it's locked the give user link to unlock.   	
	    	$('#lockLink').text(unlockSidebarText);

	    	/*
	    	* If the sidebar is locked, then we know this
	    	* is not the first time this extension has 
	    	* been loaded, and we will apply the previous
	    	* status of the sidebar:
	    	*/
	    	chrome.storage.local.get('sidebarStatus', function(sidebarStatus) {
		        if (sidebarStatus['sidebarStatus'] == "hide") {
		        	// If locked in 'hide' position, then hide:
		            $('#hslink').text(showSidebarText);
		            hideSidebar();
		        } else {
		        	// If locked in 'show' position, then show:
		            $('#hslink').text(hideSidebarText);
		            showSidebar();
		        }
	    	});
	    } else {
	    	/*
	    	* If sidebar isn't locked then it may be the
	    	* first load, or it may be unlocked. Either way
	    	* let's be "responsive".
	    	*/
	    	$('#lockLink').text(lockSidebarText);
	        respond();
	    }

	});


    /*
    * It's annoying when the multi-reddit chooser - or
    * as Reddit calls it - the "listing-chooser" stays
    * open even after you've clicked an listing/multi
    * and have navigated away from the Front Page.
    * For this reason, we detect whether the we're on
    * the front page, and hide the listing-chooser if
    * we are on a different page.
    */
	var parser = document.createElement('a');
	parser.href = window.location.pathname;
	if(parser.pathname != '/') {
		$('body').addClass('listing-chooser-collapsed');
	}
});

/*
* If sidebar isn't locked, then the sidebar should 
* respond when window is resized.
*/
$( window ).resize(function() {
	chrome.storage.local.get('lockStatus', function(lockStatus) {
	    if (lockStatus['lockStatus'] == 'unlocked') {
	        respond();
    	}
	});
});

/* -- Show/Hide Sidebar -- */
$('body').on('click', 'a#hslink', function() {
    /* Read whether the clicked-text says to hide */
    var text = $(this).text();
    if(text == hideSidebarText) { hideSidebar(); }
        else { showSidebar(); }
    return false;
});

/* -- Lock/Unlock Sidebar -- */
$('body').on('click', 'a#lockLink', function() {
    /* Read whether the clicked-text says to lock */
    var text = $(this).text();
    if(text == lockSidebarText) {
    	lockSidebar();
    } else {
       	unlockSidebar();
       	respond();
    }
    return false;
});
