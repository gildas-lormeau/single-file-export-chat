function download(pageData) {
    const link = document.createElement("a");
    link.download = pageData.filename;
    link.href = URL.createObjectURL(new Blob([pageData.content], { type: "text/html" }));
    link.dispatchEvent(new MouseEvent("click"));
    URL.revokeObjectURL(link.href);
}