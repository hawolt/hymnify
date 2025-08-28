var interval;
var href = "";

window.addEventListener('load', function () {
    if (window.location.href.startsWith("https://hymnify.org")) {
        chrome.runtime.sendMessage({ action: "hymnify-id" }, function (response) {
            window.postMessage({ type: 'hymnify-loaded', id: response.id }, '*');
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "audio-detected") {
        detect(message.url);
    }
});

function sendTabUrlToServer(url) {
    if (url === href) {
        console.log('[hymnify] prevent duplicate submission');
        return;
    } else {
        href = url;
    }
    chrome.storage.sync.get('active', function (items) {
        active = items.active || false;
        console.log('[hymnify] active: ' + active);
        if (active) {
            chrome.storage.sync.get('hymnify_whitelist', function (result) {
                var whitelist = (result.hymnify_whitelist || '').split(',').map(word => word.trim());
                console.log('[hymnify] whitelist: ' + whitelist);
                for (var i = 0; i < whitelist.length; i++) {
                    var word = whitelist[i];
                    if (word.length > 0 && url.includes(word)) {
                        console.log('[hymnify] whitelist match for: ' + word);
                        chrome.storage.sync.get('hymnify_delay', function (result) {
                            var delay = result.hymnify_delay || 0;
                            console.log('[hymnify] update delay: ' + delay);
                            setTimeout(function () {
                                chrome.storage.sync.get('hymnify_id', function (items) {
                                    console.log('[hymnify] forwarding url');
                                    var userid = items.hymnify_id;
                                    fetch('https://api.hymnify.org/update', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ url: url, token: userid }),
                                    })
                                        .then(response => response.text())
                                        .then(data => console.log(data))
                                        .catch(error => console.log(error));
                                });
                            }, delay * 1000);
                        });
                        break;
                    }
                }
            });
        }
    });
}

function detect(url) {
    if (url.startsWith("https://www.youtube.com")) {
        if (!url.endsWith('youtube.com/')) {
            sendTabUrlToServer(removeQueryParam(url, 't'));
        }
    } else if (url.startsWith('https://open.spotify.com')) {
        refresh(getSpotify);
    } else if (url.startsWith('https://soundcloud.com')) {
        refresh(getSoundcloud);
    } else if (url.startsWith('https://youtube-playlist-randomizer.bitbucket.io')) {
        refresh(getYoutubePlaylistRandomizer);
    } else {
        console.log('[hymnify] website not supported, forwarding possibly inaccurate link');
        sendTabUrlToServer(url);
    }
}

function refresh(call) {
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        call(process);
    }, 1000);
}

function process(url) {
    if (url) {
        chrome.storage.sync.get('active', function (items) {
            active = items.active || false;
            if (active) {
                const current = url;
                if (current !== null) {
                    sendTabUrlToServer(current);
                }
            }
        });
    }
}

function getSpotify(callback) {
    let href = "https://open.spotify.com" + document.querySelector('div[data-testid="now-playing-widget"] a').getAttribute('href');
    callback(href);
}

function getSoundcloud(callback) {
    let href = "https://soundcloud.com" + document
        .querySelector(
            "#app > div.playControls.g-z-index-control-bar.m-visible > section > div > div.playControls__elements > div.playControls__soundBadge > div > div.playbackSoundBadge__titleContextContainer > div > a"
        )
        .getAttribute("href");
    callback(href);
}

function getYoutubePlaylistRandomizer(callback) {
    chrome.runtime.sendMessage({
        action: "hymnify-xhr-tracker",
        origin: "https://youtube-playlist-randomizer.bitbucket.io/"
    }, function (response) {
        if (response.available) {
            let videoId = extractQueryParam(response.url, "video_id");
            callback("https://www.youtube.com/watch?v=" + videoId);
        } else {
            callback(null);
        }
    });
}

function removeQueryParam(url, paramToRemove) {
    var parts = url.split('?');
    if (parts.length < 2 || !paramToRemove) return url;
    var queryParams = parts[1].split('&');
    var newQueryString = queryParams.filter(param => param.split('=')[0] !== paramToRemove).join('&');
    return parts[0] + (newQueryString ? '?' + newQueryString : '');
}

function extractQueryParam(url, paramName) {
    const regex = new RegExp('[?&]' + paramName + '=([^&]+)');
    const match = regex.exec(url);
    if (match && match[1]) {
        return match[1];
    } else {
        return null;
    }
}