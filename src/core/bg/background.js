browser.browserAction.onClicked.addListener(async tab => {
    try {
        await browser.tabs.executeScript(tab.id, { file: "/src/core/content/content.js" });
    } catch (error) {
        // ignored
    }
});