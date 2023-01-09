(() => {

    exportConversation();

    async function exportConversation() {
        const conversationContentElement = document.querySelector(".list-wrap");
        if (conversationContentElement && !extension.processing) {
            const wrapperElement = document.querySelector(".ts-main-flex");
            if (wrapperElement) {
                try {
                    extension.processing = true;
                    // await unzoom(wrapperElement, conversationContentElement);
                    // const pageData = await extension.getPageData(SINGLE_FILE_OPTIONS);
                    // resetZoom();
                    // download(pageData);
                } finally {
                    extension.processing = false;
                }
            }
        }
    }

    async function unzoom(wrapperElement, conversationContentElement) {
        const zoomFactor = wrapperElement.offsetHeight / conversationContentElement.offsetHeight;
        const docStyle = document.documentElement.style;
        docStyle.setProperty("transform", "scale(" + zoomFactor + ")");
        docStyle.setProperty("transform-origin", "top");
        docStyle.setProperty("min-height", (100 / zoomFactor) + "vh");
        await conversationLoaded();
        expandCollapsedBlocks();
        adjustZoomLevel();
        await conversationLoaded();

        async function conversationLoaded() {
            return new Promise(resolve => {
                const fallbackTimeout = setTimeout(resolvePromise, 2000);
                const observer = new MutationObserver((mutations) => {
                    if (!mutations.length) {
                        resolvePromise();
                    }
                });
                observer.observe(wrapperElement, { subtree: true, childList: true });

                function resolvePromise() {
                    clearTimeout(fallbackTimeout);
                    observer.disconnect();
                    resolve();
                }
            });
        }

        function expandCollapsedBlocks() {
            document.querySelectorAll(".expand-collapse").forEach(link => link.click());
            document.querySelectorAll(".ts-see-more-button.ts-see-more-fold").forEach(link => link.click());
        }

        function adjustZoomLevel() {
            const zoomFactor = wrapperElement.offsetHeight / conversationContentElement.offsetHeight;
            docStyle.setProperty("transform", "scale(" + zoomFactor + ")");
            docStyle.setProperty("min-height", (100 / zoomFactor) + "vh");
        }
    }

    function resetZoom() {
        const docStyle = document.documentElement.style;
        docStyle.removeProperty("transform");
        docStyle.removeProperty("transform-origin");
        docStyle.setProperty("overflow", "auto");
    }

})();