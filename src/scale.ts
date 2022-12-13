import { ValueLimited } from "@chocolatelib/value";
import { documents } from "./document";

/** Minimum ui scale */
export const minScale = 0.2;
/** Maximum ui scale */
export const maxScale = 4;

let actualScale = 16;
/** Ui scale */
export let scale = new ValueLimited(1, (val) => {
    return Math.min(Math.max(val, minScale), maxScale);
})
//Adds listener for scale change
scale.addListener((val) => {
    actualScale = val * 16;
    for (let i = 0; i < documents.length; i++) {
        applyScale(documents[i]);
    }
})

/**This applies the current scale to a document*/
let applyScale = (docu: Document) => {
    docu.documentElement.style.fontSize = actualScale + 'px';
}

/**This applies the current touch state to a document*/
export let initScale = async (docu: Document) => {
    applyScale(docu);
}