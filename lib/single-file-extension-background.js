!function(){"use strict";browser.browserAction.onClicked.addListener((async e=>{try{await browser.tabs.executeScript(e.id,{file:"/lib/single-file-extension-core.js"}),await browser.tabs.executeScript(e.id,{file:"/lib/single-file.js"}),await browser.tabs.executeScript(e.id,{file:"/src/core/content/content.js"})}catch(e){}}))}();