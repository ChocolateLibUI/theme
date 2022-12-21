import { documents } from "./document";
import { settings } from "./shared";

//Package exports
/** Ui scale */
export let scale = settings.makeNumberSetting('scale', 'UI Scale', 'The scale of the UI', 1, 0.2, 4);

//Internal exports
/**This applies the current touch state to a document*/
export let initScale = async (docu: Document) => {
    applyScale(docu);
}

//Adds listener for scale change
let actualScale = 16;
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

