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
  id: "separator1",
  type: "separator",
  contexts: ["all", "tab"]
});

browser.contextMenus.create({
  id: "wrangle",
  type: "normal",
  title: "Wrangle Tabs to This Window",
  contexts: ["all", "tab"]
});

browser.contextMenus.create({
  id: "separator2",
  type: "separator",
  contexts: ["all", "tab"]
});

browser.contextMenus.create({
  id: "removeDuplicates",
  type: "normal",
  title: "Close Duplicate Tabs in This Window",
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
		case "wrangle":			
			var windowQuery = getWindow();	
			windowQuery.then(getWindowId, onError);
			var tabQuery = getAllTabs();
			tabQuery.then(wrangleTabs, onError);
			break;	
		case "removeDuplicates":
			var windowQuery = getWindowWithTabs();	
			windowQuery.then(removeDuplicates, onError);
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

function getWindowWithTabs() {
	return browser.windows.getCurrent({populate: true});
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

function wrangleTabs(tabs) {
	for (var i = 0; i < tabs.length; i++) {
		browser.tabs.move(tabs[i].id, {windowId: windowId, index: 0});
	}
}

function removeDuplicates(window) {
	var tabSet = new Set();
	var toDelete = [];
	for (var i = 0; i < window.tabs.length; i++) {
		if (!tabSet.has(window.tabs[i].url))
			tabSet.add(window.tabs[i].url);
		else
			toDelete.push(window.tabs[i].id);
	}

	for (var i = 0; i < toDelete.length; i++) {
		browser.tabs.remove(toDelete[i]);
	}
}

function onError() {
	console.log("Error");
}