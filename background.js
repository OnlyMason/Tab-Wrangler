browser.contextMenus.create({
  id: "url",
  type: "normal",
  title: "Sort by URL",
  contexts: ["all", "tab"]
});

browser.contextMenus.create({
  id: "title",
  type: "normal",
  title: "Sort by Title",
  contexts: ["all", "tab"]
});

browser.contextMenus.create({
  id: "merge",
  type: "normal",
  title: "Merge Tabs to One Window",
  contexts: ["all", "tab"]
});

var windowId;

browser.contextMenus.onClicked.addListener(function(info, tab) {
	switch (info.menuItemId) {		
		case "url":	
			var query = getTabs();
			query.then(sortByURL, onError);
			break;
		case "title":
			var query = getTabs();
			query.then(sortByTitle, onError);
			break;
		case "merge":			
			var windowQuery = getWindow();	
			windowQuery.then(getWindowId, onError);
			var tabQuery = getAllTabs();
			tabQuery.then(mergeTabs, onError);
			break;	
	}
});

function getTabs() {
	return browser.tabs.query({currentWindow: true});
}

function getAllTabs() {
	return browser.tabs.query({});
}

function getWindow() {
	return browser.windows.getCurrent();
}

function getWindowId(window) {
	windowId = window.id;
}

function sortByURL(tabs) {
	for (var i = 1; i < tabs.length; i++) {
		var moves = 0;
		for (var j = i - 1; j >= 0; j--) {
			if (tabs[j].url.toLowerCase() > tabs[i].url.toLowerCase())
				moves = moves + 1;
		}
		browser.tabs.move(tabs[i].id, {index: i - moves});
	}
}

function sortByTitle(tabs) {
	for (var i = 1; i < tabs.length; i++) {
		var moves = 0;
		for (var j = i - 1; j >= 0; j--) {
			if (tabs[j].title.toLowerCase() > tabs[i].title.toLowerCase())
				moves = moves + 1;
		}
		browser.tabs.move(tabs[i].id, {index: i - moves});
	}
}

function mergeTabs(tabs) {
	for (var i = 0; i < tabs.length; i++) {
		browser.tabs.move(tabs[i].id, {windowId: windowId, index: -1});
	}
}

function onError() {
	console.log("Error");
}