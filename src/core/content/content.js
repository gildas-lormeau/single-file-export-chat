if (location.href.startsWith("https://teams.microsoft.com/")) {
    exportChat();
}

async function exportChat() {
    const SINGLE_FILE_OPTIONS = {
        removeHiddenElements: true,
        removeUnusedStyles: true,
        removeUnusedFonts: true,
        compressHTML: true,
        loadDeferredImages: true,
        loadDeferredImagesMaxIdleTime: 1500,
        filenameTemplate: "{page-title} ({date-locale} {time-locale}).html",
        infobarTemplate: "",
        filenameMaxLength: 192,
        filenameMaxLengthUnit: "bytes",
        filenameReplacedCharacters: ["~", "+", "\\\\", "?", "%", "*", ":", "|", "\"", "<", ">", "\x00-\x1f", "\x7F"],
        filenameReplacementCharacter: "_",
        removeAlternativeFonts: true,
        removeAlternativeMedias: true,
        removeAlternativeImages: true,
        groupDuplicateImages: true,
        maxSizeDuplicateImages: 512 * 1024,
        saveFavicon: true,
        insertMetaCSP: true,
        insertSingleFileComment: true,
        acceptHeaders: {
            font: "application/font-woff2;q=1.0,application/font-woff;q=0.9,*/*;q=0.8",
            image: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            stylesheet: "text/css,*/*;q=0.1",
            script: "*/*",
            document: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            video: "video/webm,video/ogg,video/*;q=0.9,application/ogg;q=0.7,audio/*;q=0.6,*/*;q=0.5",
            audio: "audio/webm,audio/ogg,audio/wav,audio/*;q=0.9,application/ogg;q=0.7,video/*;q=0.6,*/*;q=0.5"
        },
        blockScripts: true,
        blockVideos: true,
        blockAudios: true
    };
    const chatContentElement = frames[0].document.querySelector(".ui-box.ap");
    if (chatContentElement && !extension.processing) {
        const wrapperElement = chatContentElement.parentElement;
        if (wrapperElement) {
            try {
                extension.processing = true;
                await scrollToTheTop(wrapperElement);
                await unzoom(wrapperElement, chatContentElement);
                const { content, filename } = await extension.getPageData(SINGLE_FILE_OPTIONS);
                resetZoom();
                const doc = getFrameDocument(content);
                resetChatContentZoom(doc);
                moveChatContentToTheTop(doc);
                download({
                    filename,
                    content: "<!DOCTYPE html> " + doc.documentElement.outerHTML
                });
            } finally {
                extension.processing = false;
            }
        }
    }
}

function scrollToTheTop(wrapperElement) {
    const SCROLL_DELAY = 500;
    const SCROLL_MIN_OFFSET = 100;
    let resolveScrolltoTop;
    stepScroll();
    return new Promise(resolve => resolveScrolltoTop = resolve);

    function stepScroll() {
        if (wrapperElement.scrollTop > SCROLL_MIN_OFFSET) {
            wrapperElement.scrollTop = SCROLL_MIN_OFFSET;
            setTimeout(stepScroll, SCROLL_DELAY);
        } else {
            wrapperElement.scrollTop = 0;
            setTimeout(resolveScrolltoTop, SCROLL_DELAY);
        }
    }
}

async function unzoom(wrapperElement, chatContentElement) {
    const mainFrameStyle = document.querySelector("iframe").style;
    const zoomFactor = wrapperElement.clientHeight / chatContentElement.clientHeight;
    const docStyle = document.documentElement.style;
    docStyle.setProperty("transform", "scale(" + zoomFactor + ")");
    docStyle.setProperty("transform-origin", "top");
    docStyle.setProperty("height", ((1 / zoomFactor) * 100) + "vh");
    mainFrameStyle.setProperty("height", (((1 / zoomFactor) * 100) - 1) + "vh");
    return new Promise(resolve => {
        setTimeout(() => {
            mainFrameStyle.setProperty("height", ((1 / zoomFactor) * 100) + "vh");
            resolve();
        }, 500);
    });
}

function resetZoom() {
    const docElement = document.documentElement;
    const docStyle = docElement.style;
    docStyle.removeProperty("transform");
    docStyle.removeProperty("transform-origin");
    docElement.querySelector("iframe").style.removeProperty("height");
}

function resetChatContentZoom(doc) {
    doc.documentElement.style.setProperty("position", "static");
    const docBodyStyle = doc.body.style;
    docBodyStyle.setProperty("height", "auto");
    docBodyStyle.setProperty("overflow", "auto");
}

function getFrameDocument(content) {
    const doc = new DOMParser().parseFromString(content, "text/html");
    return new DOMParser().parseFromString(doc.querySelector("iframe").srcdoc, "text/html");
}

function moveChatContentToTheTop(doc) {
    const chatContent = doc.querySelector("ul");
    doc.body.innerHTML = "";
    doc.body.appendChild(chatContent);
}

function download(pageData) {
    const link = document.createElement("a");
    link.download = pageData.filename;
    link.href = URL.createObjectURL(new Blob([pageData.content], { type: "text/html" }));
    link.dispatchEvent(new MouseEvent("click"));
    URL.revokeObjectURL(link.href);
}