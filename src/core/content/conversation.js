globalThis.exportConversation = (() => {

    return async function() {
        const conversationContentElement = document.querySelector("virtual-repeat");
        if (conversationContentElement && !extension.processing) {
            const wrapperElement = document.querySelector(".ts-main-flex");
            if (wrapperElement) {
                try {
                    extension.processing = true;
                    expandDocSize();
                    await scrollRecursively(conversationContentElement);
                    expandCollapsedBlocks();
                    const { content, filename } = await extension.getPageData(SINGLE_FILE_OPTIONS);
                    const doc = getDocument(content);
                    resetOverflow(doc);
                    resetDocSize(doc);
                    download({
                        filename,
                        content: "<!DOCTYPE html> " + doc.documentElement.outerHTML
                    });
                } finally {
                    extension.processing = false;
                    resetDocSize(document);
                }
            }
        }
    }

    function expandDocSize() {
        const MAX_HEIGHT = "2147483647px";
        document.documentElement.style.setProperty("height", MAX_HEIGHT);
    }

    function resetDocSize(doc) {
        doc.documentElement.style.removeProperty("height");
    }

    function resetOverflow(doc) {
        doc.documentElement.style.setProperty("overflow", "auto");
        doc.body.style.setProperty("overflow", "auto");
    }

    async function scrollRecursively(conversationContentElement) {
        scrollToTop(conversationContentElement);
        const elementsLoaded = await waitSubTreeLoaded(conversationContentElement);
        if (elementsLoaded) {
            await scrollRecursively(conversationContentElement);
        }
    }

    function getDocument(content) {
        const doc = new DOMParser().parseFromString(content, "text/html");
        const conversationContentElement = doc.querySelector("virtual-repeat")
        doc.body.innerHTML = "";
        doc.body.appendChild(conversationContentElement);
        return doc;
    }

    function scrollToTop(conversationContentElement) {
        conversationContentElement.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 36, bubbles: true }));
    }

    function waitSubTreeLoaded(target) {
        const WAIT_DELAY = 500;
        let timeoutResolve;
        let itemsLength = target.querySelectorAll(".item-wrap").length;
        return new Promise(resolve => {
            timeoutResolve = setTimeout(() => resolvePromise(), WAIT_DELAY);
            let elementsLoaded;

            function resolvePromise() {
                const finished = itemsLength == target.querySelectorAll(".item-wrap").length;
                if (finished) {
                    resolve(elementsLoaded);
                } else {
                    elementsLoaded = true;
                    itemsLength = target.querySelectorAll(".item-wrap").length;
                    clearTimeout(timeoutResolve);
                    timeoutResolve = setTimeout(() => resolvePromise(), WAIT_DELAY);
                }
            }
        });
    }

    function expandCollapsedBlocks() {
        document.querySelectorAll(".expand-collapse").forEach(link => link.click());
        document.querySelectorAll(".ts-see-more-button.ts-see-more-fold").forEach(link => link.click());
    }

})();