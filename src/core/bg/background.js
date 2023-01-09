browser.browserAction.onClicked.addListener(async tab => {
    try {
        await browser.tabs.executeScript(tab.id, { file: "/lib/single-file-extension-core.js" });
        await browser.tabs.executeScript(tab.id, { file: "/lib/single-file.js" });
        await browser.tabs.executeScript(tab.id, { file: "/src/core/content/options.js" });
        await browser.tabs.executeScript(tab.id, { file: "/src/core/content/util.js" });
        await browser.tabs.executeScript(tab.id, { file: "/src/core/content/chat.js" });
        // await browser.tabs.executeScript(tab.id, { file: "/src/core/content/conversation.js" });
    } catch (error) {
        // ignored
    }
});