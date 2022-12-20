import { EnumList } from "@chocolatelib/value";
import { documents } from "./document";
import { settings } from "./shared";

/**Possible modes for auto touch mode*/
export enum AutoTouchMode {
    /** No automatic touch mode change*/
    off = 'off',
    /** Touch mode is updated on the first document pointer interaction*/
    first = 'first',
    /** Touch mode is updated on every document pointer interaction*/
    every = 'every'
}

let autoTouchMode: EnumList = {
    [AutoTouchMode.off]: { name: 'Off', description: "Don't set touch mode automatically" },
    [AutoTouchMode.first]: { name: 'First Interaction', description: "Change touch mode on first ui interaction" },
    [AutoTouchMode.every]: { name: 'Every Interaction', description: "Change touch mode on every ui interaction" }
}

//Package Exports
/**State of touch mode*/
export let touch = settings.makeBooleanSetting('touch', 'Touch Mode', 'Toggle between touch friendly or mouse friendly UI', false);
/**State of automatic touch mode change*/
export let autoTouch = settings.makeStringSetting('autoTouch', 'Automatic Touch Mode', 'Mode for automatically changing touch mode', AutoTouchMode.every, autoTouchMode)

//Internal exports
/**This applies the current touch state to a document*/
export let initTouch = (docu: Document) => {
    applyTouch(docu, <boolean>touch.get);
    applyAuto(docu, <AutoTouchMode>autoTouch.get);
}

//Updates all registered documents of touch mode change
touch.addListener((val) => {
    for (let i = 0; i < documents.length; i++) {
        applyTouch(documents[i], val);
    }
});
//Updates documents auto mode
autoTouch.addListener((val) => {
    for (let i = 0; i < documents.length; i++) {
        applyAuto(documents[i], <AutoTouchMode>val);
    }
})

/**This applies the current touch state to a document*/
let applyTouch = (docu: Document, touch: boolean) => {
    if (touch) {
        docu.documentElement.classList.add('touch');
    } else {
        docu.documentElement.classList.remove('touch');
    }
}

/**Function to detect touch mode change*/
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
