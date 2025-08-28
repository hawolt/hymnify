var userid;
browser.storage.sync.get('hymnify_id').then(function (items) {
    userid = items.hymnify_id;
    if (!userid) {
        userid = getRandomToken();
        browser.storage.sync.set({ hymnify_id: userid });
    }
});

browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "hymnify-version") {
        sendResponse({ version: chrome.runtime.getManifest().version });
    } else if (message.action === "hymnify-id") {
        sendResponse({ id: userid });
    } else if (message.action === "hymnify-xhr-tracker") {
        let origin = message.origin;
        let available = origin in tracked;
        let associated = available ? tracked[origin] : "nil";
        sendResponse({ available: available, url: associated });
    }
});

const tracker = {
    "https://youtube-playlist-randomizer.bitbucket.io/": "https://www.youtube.com/ptracking",
};

const tracked = {};

browser.webRequest.onCompleted.addListener(
    function (details) {
        if (details.method === "GET" && details.type === "xmlhttprequest") {
            browser.tabs.get(details.tabId, function (tab) {
                for (const websiteUrl in tracker) {
                    if (tab.url.startsWith(websiteUrl)) {
                        const trackingUrl = tracker[websiteUrl];
                        if (details.url.startsWith(trackingUrl)) {
                            tracked[websiteUrl] = details.url;
                            break;
                        }
                    }
                }
            });
        }
    },
    { urls: ["<all_urls>"] }
);

function debounce(func, wait, immediate) {
    var timeout;

    return function executedFunction() {
        var context = this;
        var args = arguments;

        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
}

function query() {
    browser.tabs.query({}).then(tabs => {
        let anyTabAudible = false;
        tabs.forEach(tab => {
            checkTabForAudio(tab.id);
            if (tab.audible) {
                anyTabAudible = true;
            }
        });
    });
}

var check = debounce(query, 500);

function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}

function checkTabForAudio(tabId) {
    browser.tabs.get(tabId).then(tab => {
        if (tab.audible) {
            browser.tabs.sendMessage(tabId, { action: "audio-detected", url: tab.url });
        }
    });
}

browser.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        if (key === 'active') {
            var active = changes[key].newValue;
            if (active) {
                check();
            }
        }
    }
});

browser.tabs.onCreated.addListener(function (tab) {
    check();
});

browser.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    check();
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.audible) {
        checkTabForAudio(tabId);
    }
    if (!changeInfo.audible) {
        check();
    }
});

check();