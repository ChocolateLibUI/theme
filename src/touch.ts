import { EnumList } from "@chocolatelib/value";
import { settings } from "./shared";
import { events, forDocuments } from "@chocolatelibui/document"

/**Possible modes for auto touch mode*/
export const enum AutoTouchMode {
    /** No automatic touch mode change*/
    Off = 'off',
    /** Touch mode is updated on the first document pointer interaction*/
    First = 'first',
    /** Touch mode is updated on every document pointer interaction*/
    Every = 'every'
}

let autoTouchMode: EnumList = {
    [AutoTouchMode.Off]: { name: 'Off', description: "Don't set touch mode automatically" },
    [AutoTouchMode.First]: { name: 'First Interaction', description: "Change touch mode on first ui interaction" },
    [AutoTouchMode.Every]: { name: 'Every Interaction', description: "Change touch mode on every ui interaction" }
}

/**State of touch mode*/
export let touch = settings.makeBooleanSetting('touch', 'Touch Mode', 'Toggle between touch friendly or mouse friendly UI', false);
/**State of automatic touch mode change*/
export let autoTouch = settings.makeStringSetting('autoTouch', 'Automatic Touch Mode', 'Mode for automatically changing touch mode', AutoTouchMode.Every, autoTouchMode)

//Updates all registered documents of touch mode change
touch.addListener((val) => {
    forDocuments((doc) => {
        applyTouch(doc, val);
    });
});
//Updates documents auto mode
autoTouch.addListener((val) => {
    forDocuments((doc) => {
        applyAuto(doc, <AutoTouchMode>val);
    });
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
    forDocuments((doc) => {
        doc.documentElement.removeEventListener('pointerdown', autoTouchOnce);
    });
}
let applyAuto = (docu: Document, auto: AutoTouchMode) => {
    docu.documentElement.removeEventListener('pointerdown', autoTouchOnce);
    docu.documentElement.removeEventListener('pointerdown', autoTouchListener);
    switch (auto) {
        case AutoTouchMode.First:
            docu.documentElement.addEventListener('pointerdown', autoTouchOnce, { passive: true });
            break;
        case AutoTouchMode.Every:
            docu.documentElement.addEventListener('pointerdown', autoTouchListener, { passive: true });
            break;
    }
}

events.on('documentAdded', (e) => {
    applyTouch(e.data, <boolean>touch.get);
    applyAuto(e.data, <AutoTouchMode>autoTouch.get);
})
forDocuments((doc) => {
    applyTouch(doc, <boolean>touch.get);
    applyAuto(doc, <AutoTouchMode>autoTouch.get);
});