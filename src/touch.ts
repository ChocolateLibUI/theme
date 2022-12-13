import { Value } from "@chocolatelib/value";
import { documents } from "./document";

/**State of touch mode*/
export let touch = new Value<boolean>(false);
touch.addListener((val) => {
    for (let i = 0; i < documents.length; i++) {
        applyTouch(documents[i], val);
    }
})

/**Possible modes for auto touch mode*/
export enum AutoTouchMode {
    /** No automatic touch mode change*/
    off = 'off',
    /** Touch mode is updated on the first document pointer interaction*/
    first = 'first',
    /** Touch mode is updated on every document pointer interaction*/
    every = 'every'
}

/**State of automatic touch mode change*/
export let autoTouch = new Value(AutoTouchMode.every);

/**This applies the current touch state to a document*/
export let initTouch = async (docu: Document) => {
    applyTouch(docu, await touch.get);
    applyAuto(docu, await autoTouch.get);
}

/**This applies the current touch state to a document*/
let applyTouch = (docu: Document, touch: boolean) => {
    if (touch) {
        docu.documentElement.classList.add('touch');
    } else {
        docu.documentElement.classList.remove('touch');
    }
}

/**Function to detect touch mode change */
let autoTouchListener = (event: PointerEvent) => {
    switch (event.pointerType) {
        case 'touch':
            touch.set = true;
            break;
        case 'mouse':
        case 'pen':
        default:
            touch.set = false;
            break;
    }
}
let autoTouchOnce = (ev: PointerEvent) => {
    autoTouchListener(ev);
    for (let i = 0; i < documents.length; i++) {
        documents[i].documentElement.removeEventListener('pointerdown', autoTouchOnce);
    }
}
let applyAuto = (docu: Document, auto: AutoTouchMode) => {
    docu.documentElement.removeEventListener('pointerdown', autoTouchOnce);
    docu.documentElement.removeEventListener('pointerdown', autoTouchListener);
    switch (auto) {
        case AutoTouchMode.first:
            docu.documentElement.addEventListener('pointerdown', autoTouchOnce, { passive: true });
            break;
        case AutoTouchMode.every:
            docu.documentElement.addEventListener('pointerdown', autoTouchListener, { passive: true });
            break;
    }
}
autoTouch.addListener((val) => {
    for (let i = 0; i < documents.length; i++) {
        applyAuto(documents[i], val);
    }
})