!function(){"use strict";browser.browserAction.onClicked.addListener((async t=>{try{await browser.tabs.executeScript(t.id,{file:"/src/core/content/content.js"})}catch(t){}}))}();
