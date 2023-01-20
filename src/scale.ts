import { settings } from "./shared";
import { events, forDocuments } from "@chocolatelibui/document"

//Package exports
/** Ui scale */
export let scale = settings.makeNumberSetting('scale', 'UI Scale', 'The scale of the UI', 1, 0.2, 4);

//Adds listener for scale change
let actualScale = 16;
scale.addListener((val) => {
    actualScale = val * 16;
    forDocuments((doc) => {
        doc.documentElement.style.fontSize = actualScale + 'px';
    });
});
events.on('documentAdded', (e) => {
    e.data.documentElement.style.fontSize = actualScale + 'px';
});
forDocuments((doc) => {
    doc.documentElement.style.fontSize = actualScale + 'px';
});

/**Converts the given rems to pixels */
export let remToPx = (rem: number) => {
    return rem * actualScale;
}
/**Converts the given pixels to rems */
export let pxToRem = (px: number) => {
    return px / actualScale;
}