document.addEventListener('DOMContentLoaded', function () {
    var textField = document.getElementById('textField');
    var toggleVisibilityButton = document.getElementById('toggleVisibilityButton');
    var eyeIcon = document.getElementById('eyeIcon');
    var copyToClipboardButton = document.getElementById('copyToClipboardButton');
    var toggleSettingButton = document.getElementById('toggleSettingButton');
    var settingIndicator = document.getElementById('settingIndicator');
    var isTextFieldVisible = false;
    var active = false;

    setupSourceValue(textField);
    setupSettingValue();

    var versionElement = document.getElementById('extensionVersion');
    browser.runtime.sendMessage({ action: "hymnify-version" }, function (response) {
        if (response && response.version) {
            versionElement.textContent = versionElement.textContent + response.version;
        } else {
            console.error("Failed to get extension version");
        }
    });

    toggleVisibilityButton.addEventListener('click', function () {
        isTextFieldVisible = !isTextFieldVisible;
        if (isTextFieldVisible) {
            textField.type = 'text';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        } else {
            textField.type = 'password';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        }
    });

    copyToClipboardButton.addEventListener('click', function () {
        if (isTextFieldVisible) {
            textField.select();
            document.execCommand('copy');
        } else {
            var textToCopy = textField.value;
            navigator.clipboard.writeText(textToCopy).then(function () {
                console.log('Text copied to clipboard: ' + textToCopy);
            }).catch(function (error) {
                console.error('Error copying text: ', error);
            });
        }
    });

    toggleSettingButton.addEventListener('click', function () {
        active = !active;
        browser.storage.sync.set({ 'active': active }, function () {
            updateSettingIndicator(active);
            browser.storage.sync.get('hymnify_id', function (items) {
                var userid = items.hymnify_id;
                fetch('https://api.hymnify.org/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: (active ? "extension active" : "extension currently not active"), token: userid }),
                })
                    .then(response => response.text())
                    .then(data => console.log(data))
                    .catch(error => console.log(error));
            });
        });
    });

    function setupSourceValue(textField) {
        browser.storage.sync.get('hymnify_id', function (items) {
            var userid = items.hymnify_id;
            if (userid) {
                textField.value = "https://api.hymnify.org/status/" + userid;
            }
        });
    }

    function setupSettingValue() {
        browser.storage.sync.get('active', function (items) {
            active = items.active || false;
            updateSettingIndicator(active);
        });
    }

    function updateSettingIndicator(settingValue) {
        if (settingValue) {
            settingIndicator.style.backgroundColor = '#33cc33';
        } else {
            settingIndicator.style.backgroundColor = 'red';
        }
        var indicatorColor = settingValue ? '#33cc33' : 'red';
        settingIndicator.style.boxShadow = '0 0 5px 2px ' + indicatorColor;
    }

    var addEntryButton = document.getElementById('addEntryButton');
    var entryInput = document.getElementById('newEntry');
    var entryList = document.getElementById('entryList');

    browser.storage.sync.get('hymnify_whitelist', function (result) {
        var whitelist = result.hymnify_whitelist || '';
        if (whitelist.length > 0) {
            var whitelistArray = whitelist.split(',').map(entry => entry.trim());
            whitelistArray.forEach(function (entry) {
                var entryItem = document.createElement('div');
                entryItem.classList.add('entryItem');

                var entryTextElement = document.createElement('span');
                entryTextElement.textContent = entry;

                var removeButton = document.createElement('button');
                var removeIcon = document.createElement('i');
                removeIcon.classList.add('far', 'fa-trash-alt');
                removeButton.appendChild(removeIcon);

                removeButton.addEventListener('click', function () {
                    entryItem.remove();
                    removeFromWhitelist(entry);
                    checkEmptyList();
                });

                entryItem.appendChild(entryTextElement);
                entryItem.appendChild(removeButton);
                entryList.appendChild(entryItem);
            });
        }

        checkEmptyList();
    });

    addEntryButton.addEventListener('click', function () {
        var entryText = entryInput.value.trim();
        if (entryText !== '') {
            var entryItem = document.createElement('div');
            entryItem.classList.add('entryItem');

            var entryTextElement = document.createElement('span');
            entryTextElement.textContent = entryText;

            var removeButton = document.createElement('button');
            var removeIcon = document.createElement('i');
            removeIcon.classList.add('far', 'fa-trash-alt');
            removeButton.appendChild(removeIcon);

            removeButton.addEventListener('click', function () {
                entryItem.remove();
                removeFromWhitelist(entryText);
                checkEmptyList();
            });

            entryItem.appendChild(entryTextElement);
            entryItem.appendChild(removeButton);

            entryList.appendChild(entryItem);

            entryInput.value = '';

            addToWhitelist(entryText);
            checkEmptyList();
        }
    });

    function addToWhitelist(value) {
        browser.storage.sync.get('hymnify_whitelist', function (result) {
            var currentWhitelist = result.hymnify_whitelist || '';
            currentWhitelist += (currentWhitelist ? ',' : '') + value;
            browser.storage.sync.set({ 'hymnify_whitelist': currentWhitelist });
        });
    }

    function removeFromWhitelist(value) {
        browser.storage.sync.get('hymnify_whitelist', function (result) {
            var currentWhitelist = result.hymnify_whitelist || '';
            var whitelistArray = currentWhitelist.split(',');
            var index = whitelistArray.indexOf(value);
            if (index !== -1) {
                whitelistArray.splice(index, 1);
            }
            var updatedWhitelist = whitelistArray.join(',');
            browser.storage.sync.set({ 'hymnify_whitelist': updatedWhitelist });
        });
    }

    function checkEmptyList() {
        var isEmpty = entryList.children.length === 0;
        if (isEmpty) {
            var emptyMessage = document.createElement('h3');
            emptyMessage.textContent = 'Whitelist currently empty';
            emptyMessage.classList.add('empty-message');
            entryList.appendChild(emptyMessage);
        } else {
            var emptyMessage = entryList.querySelector('.empty-message');
            if (emptyMessage) {
                emptyMessage.remove();
            }
        }
    }

    document.getElementById('open-dashboard').addEventListener('click', function() {
        window.open('https://hymnify.org/dashboard/', '_blank');
    });

    const customAlertButton = document.getElementById('addWhitelistHelp');
    const customAlertOverlay = document.getElementById('customAlertOverlay');
    const closeAlertButton = document.getElementById('closeAlertButton');

    customAlertButton.addEventListener('click', () => {
        configureCustomAlert('Whitelist', "Hymnify will only track a link if it contains text that is on the whitelist, to track YouTube for example simply add youtube to your whitelist")
        customAlertOverlay.style.display = 'flex';
    });

    closeAlertButton.addEventListener('click', () => {
        customAlertOverlay.style.display = 'none';
    });

    const popupHeadline = document.getElementById('popup-headline');
    const popupText = document.getElementById('popup-text');

    function configureCustomAlert(headline, text) {
        popupHeadline.innerText = headline;
        popupText.innerText = text;
    }

    var updateDelayInput = document.getElementById('updateDelay');

    function storeUpdateDelayValue() {
        var updateDelayValue = parseInt(updateDelayInput.value);
        browser.storage.sync.set({ 'hymnify_delay': updateDelayValue }, function () {
            console.log('Update Delay value stored:', updateDelayValue);
        });
    }

    browser.storage.sync.get('hymnify_delay', function (result) {
        var storedDelayValue = result.hymnify_delay;
        if (storedDelayValue !== undefined) {
            updateDelayInput.value = storedDelayValue;
        }
    });

    updateDelayInput.addEventListener('input', function () {
        storeUpdateDelayValue();
    });

    browser.storage.sync.get('hymnify_delay', function (result) {
        var delayInSeconds = result.hymnify_delay || 0;
        var delayInput = document.getElementById('updateDelay');
        delayInput.value = delayInSeconds;
    });
});
