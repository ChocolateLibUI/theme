/**List of registered documents*/
export let documents: Document[] = []

/**Registers a document with the theme engine, which will be updated with */
export let registerDocument = async (doc: Document) => {
    if (documents.includes(doc)) {
        console.warn('Document registered with theme engine twice');
    } else {
        documents.push(doc);
        (await import("./variables")).applyTheme(doc, await (await import("./variables")).theme.get);
        (await import("./touch")).initTouch(doc);
        (await import("./scale")).initScale(doc);
    }
}

/**Registers a document with the theme engine, which will be updated with */
export let deregisterDocument = async (doc: Document) => {
    let index = documents.indexOf(doc);
    if (index != -1) {
        documents.splice(index, 1);
    } else {
        console.warn('Document not registered with theme engine twice');
    }
}

//Registers the main document
registerDocument(document);
