globalThis.exportChat = (() => {

    return async function() {
        const frameDoc = frames[0].document;
        const chatContentElement = frameDoc.querySelector(".ui-box.ap");
        if (chatContentElement && !extension.processing) {
            const wrapperElement = chatContentElement.parentElement;
            const listElement = chatContentElement.querySelector(".ms-FocusZone");
            if (wrapperElement && listElement) {
                try {
                    extension.processing = true;
                    expandFrameSize(frameDoc);
                    await waitSubTreeLoaded(listElement);
                    const { content, filename } = await extension.getPageData(SINGLE_FILE_OPTIONS);
                    const doc = getFrameDocument(content);
                    resetOverflow(doc);
                    moveChatContent(doc);
                    download({
                        filename,
                        content: "<!DOCTYPE html> " + doc.documentElement.outerHTML
                    });
                } finally {
                    resetFrameSize(frameDoc);
                    extension.processing = false;
                }
            }
        }
    }

    function expandFrameSize(frameDoc) {
        const MAX_HEIGHT = "2147483647px";
        frameDoc.body.style.setProperty("height", MAX_HEIGHT);
    }

    function resetFrameSize(frameDoc) {
        frameDoc.body.style.removeProperty("height");
    }

    function waitSubTreeLoaded(target) {
        const WAIT_DELAY = 3000;
        let timeoutResolve;
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                clearTimeout(timeoutResolve);
                timeoutResolve = setTimeout(resolvePromise, WAIT_DELAY);
            });
            observer.observe(target, { subtree: true, childList: true });
            timeoutResolve = setTimeout(resolvePromise, WAIT_DELAY);

            function resolvePromise() {
                observer.disconnect();
                resolve();
            }
        });
    }

    function resetOverflow(doc) {
        doc.documentElement.style.setProperty("position", "static");
        const docBodyStyle = doc.body.style;
        docBodyStyle.setProperty("height", "auto");
        docBodyStyle.setProperty("overflow", "auto");
    }

    function getFrameDocument(content) {
        const doc = new DOMParser().parseFromString(content, "text/html");
        return new DOMParser().parseFromString(doc.querySelector("iframe").srcdoc, "text/html");
    }

    function moveChatContent(doc) {
        const chatContent = doc.querySelector("ul");
        doc.body.innerHTML = "";
        doc.body.appendChild(chatContent);
    }

})();