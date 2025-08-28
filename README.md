[discord-invite]: https://discord.gg/n5eejXjCQz

[discord-shield]: https://discordapp.com/api/guilds/1130517263280246907/widget.png?style=shield

![Header](https://raw.githubusercontent.com/hawolt/hymnify/main/logo-github.png)

![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.hymnify.org%2Fuser&labelColor=green) ![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.hymnify.org%2Fcounter&labelColor=orange) ![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fapi.hymnify.org%2Fserves&labelColor=yellow)

# **Hymnify Extension**
Hymnify serves to monitor active audio playback across browser tabs, automatically forwarding the URL of any tab streaming audio content to a designated server.

# Disclaimer
Do not share the link provided by the extension in public. The link can be used to update data associated with your extension. In the instance that your link is compromised, please reinstall the extension to obtain a new link.

## Features:
 1. **Seamless Audio Tracking:**
 Tracks active audio playback across browser tabs in real-time.
 2. **Automatic URL Forwarding:**
 Automatically forwards the URL of tabs with audio playback to a designated server.
 3. **Privacy Assurance:** 
 No logging or history of forwarded URLs is maintained, and user data remains anonymous.
 4. **Browser Compatibility:**
 Currently compatible with Chromium based Browsers and Mozilla Firefox.

## Installation

- [Google Chrome](https://chromewebstore.google.com/detail/hymnify/jgalnhgccekkgfglcimenmghbbneelck)
- [Mozilla Firefox](https://addons.mozilla.org/firefox/addon/hymnify)
- [Opera GX](https://chromewebstore.google.com/detail/hymnify/jgalnhgccekkgfglcimenmghbbneelck)
- [Microsoft Edge](https://chromewebstore.google.com/detail/hymnify/jgalnhgccekkgfglcimenmghbbneelck)

## Setup using Hymnify

1. Navigate to the [Hymnify Dashboard](https://hymnify.org/dashboard/)
2. Login with Twitch when prompted
3. Wait for the redirect to take you to the Dashboard
4. Click the Join button to make Hymnify join your Twitch Chat
5. Promote Hymnify to moderator `/mod Hymnify`
6. Add the website that you are using to the whitelist, for example `youtube.com`
7. Refresh the tab playing music to make sure Hymnify is properly loaded
8. Enable the extension by turning it on, click on the red indicator (green: on, red: off)
9. Use the command !song in your Chat, the cooldown is 15 seconds.

*something not working? join my [discord](https://discord.hawolt.com) and ask ahead!*

## Operating the Extension

While simple in design, Hymnify offers essential functionality to enhance your browsing experience:

1.  **Clipboard Button**:
By clicking the Clipboard Button, the URL associated with your current playback is copied directly to your clipboard.
    
2.  **Toggle Button**:
Positioned on the top right-hand side, the Toggle Button serves as the primary control mechanism for the extension. When activated (indicated by a green hue), the extension is enabled, allowing it to function. Conversely, deactivating the Toggle Button (indicated by a red hue) disables the extension, pausing its operations.

3. **Whitelist**:
In the heart of the extension window lies the Whitelist feature, designed for easy customization of your preferred URLs. Simply type the URL or keyword into the text field provided, then click the adjacent button to add it to your whitelist. Below, each entry is neatly displayed with a trash icon on the right, allowing you to effortlessly remove any unwanted items from the list.

4. **Update Delay**:
Positioned at the bottom of the popup window, the Update Delay ensures synchronization with your activity. This numeric spinner allows you to set the delay (in seconds) before forwarding the URL, to ensure it aligns seamlessly with the timing of your activity. Adjust the value as needed to maintain perfect harmony between your browsing experience and the ongoing activity.

## Manual Installation Guide

### Chromium Browser (Chrome, Opera, Edge), Persistent Installation

1. Download the extension files from this GitHub repository. Once downloaded, unzip the file.
2. Open Google Chrome browser and type `chrome://extensions/` in the address bar, then press Enter.
3. Locate and enable "Developer mode" by toggling the switch.
4. Next, click on the "Load unpacked" button of the Extensions page.
5. A file dialog will open. Navigate to the folder where you unzipped the extension files and select the folder that corresponds to your Browser. Then, click "Select Folder" to load the extension into your Browser.
6. Once the extension is loaded, you should see its icon appear among your browser extensions, usually located to the right of the address bar; otherwise click on the Icon resembling a puzzle piece.
7. To use the extension, click on "Hymnify" and then click on the clipboard icon next to it. This action copies a URL to your clipboard, allowing you to easily share the audio content you are currently listening to.

### Gecko (Firefox), Temporary Installation

*Please note that this installation is not permanent. To install Hymnify persistently, please use the Mozilla Web Store.*

1. Download the extension files from this GitHub repository. Once downloaded, unzip the file.
2. Open Mozilla Firefox browser and type `about:debugging#/runtime/this-firefox` in the address bar, then press Enter.
3. In the top right corner of the Debugging page, click on the "Load Temporary Add-On..." button.
5. A file dialog will open. Navigate to the folder where you unzipped the extension files and select the folder that corresponds to your Browser. Then, select "manifest.json" to load the extension into Mozilla Firefox.
6. Once the extension is loaded, you should see its icon appear among your browser extensions.
7. To use the extension, click on "Hymnify" and then click on the clipboard icon next to it. This action copies a URL to your clipboard, allowing you to easily share the audio content you are currently listening to.

