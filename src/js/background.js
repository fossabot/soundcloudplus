(function () {
    if (!localStorage.color) {
        chrome.tabs.create({url: "options.html"});
    }

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
        if (request.action === "getLocalStorage") {
          sendResponse(localStorage);
        } else {
          sendResponse({});
        }
    });
}());
