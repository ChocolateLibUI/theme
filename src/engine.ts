
import { initSettings } from "@chocolatelibui/settings"
import DocumentHandler from "@chocolatelibui/document";
import { EnumList, ValueLimitedNumber, ValueLimitedString } from "@chocolatelib/value";
import { name } from "../package.json"
import { bottomGroups, DefaultThemes, engines } from "./shared";
import { EListener } from "@chocolatelib/events";
import { material_hardware_mouse_rounded, material_image_edit_rounded, material_action_touch_app_rounded, material_device_light_mode_rounded, material_device_dark_mode_rounded } from "@chocolatelibui/icons";

let settings = initSettings(name, 'Theme/UI', 'Settings for UI elements and and color themes');

export const enum ScrollbarMode {
    THIN = 'thin',
    MEDIUM = 'medium',
    WIDE = 'wide',
}

let scrollbarMode: EnumList = {
    [ScrollbarMode.THIN]: { name: 'Thin', description: "Thin modern scrollbar" },
    [ScrollbarMode.MEDIUM]: { name: 'Medium', description: "Normal scrollbar" },
    [ScrollbarMode.WIDE]: { name: 'Wide', description: "Large touch friendly scrollbar" },
}

export const enum AnimationMode {
    ALL = 'all',
    MOST = 'most',
    SOME = 'some',
    NONE = 'none',
}

let animationMode: EnumList = {
    [AnimationMode.ALL]: { name: 'All', description: "All animations" },
    [AnimationMode.MOST]: { name: 'Most', description: "All but the heaviest animations" },
    [AnimationMode.SOME]: { name: 'Some', description: "Only the lightest animations" },
    [AnimationMode.NONE]: { name: 'None', description: "No animations" },
}

export const enum AutoThemeMode {
    Off = 'off',
    OS = 'os',
}

let autoThemeMode: EnumList = {
    [AutoThemeMode.Off]: { name: 'Off', description: "Mouse input" },
    [AutoThemeMode.OS]: { name: 'OS Linked', description: "Pen input" },
}
let themes: EnumList = {
    [DefaultThemes.Light]: { name: 'Light', description: "Don't set touch mode automatically", icon: material_device_light_mode_rounded() },
    [DefaultThemes.Dark]: { name: 'Dark', description: "Change touch mode on first ui interaction", icon: material_device_dark_mode_rounded() },
}

export const enum InputMode {
    MOUSE = 'mouse',
    PEN = 'pen',
    TOUCH = 'touch'
}
let inputMode: EnumList = {
    [InputMode.MOUSE]: { name: 'Mouse', description: "Mouse input", icon: material_hardware_mouse_rounded() },
    [InputMode.PEN]: { name: 'Pen', description: "Pen input", icon: material_image_edit_rounded() },
    [InputMode.TOUCH]: { name: 'Touch', description: "Touch input", icon: material_action_touch_app_rounded() }
}

export const enum AutoInputMode {
    OFF = 'off',
    FIRST = 'first',
    EVERY = 'every'
}
let autoInputMode: EnumList = {
    [AutoInputMode.OFF]: { name: 'Off', description: "Don't set touch mode automatically" },
    [AutoInputMode.FIRST]: { name: 'First Interaction', description: "Change touch mode on first ui interaction" },
    [AutoInputMode.EVERY]: { name: 'Every Interaction', description: "Change touch mode on every ui interaction" }
}

export class Engine {
    /**Reference to document handler*/
    private _handler: DocumentHandler;
    private _listener: EListener<"added", DocumentHandler, Document>;

    readonly scrollbar: ValueLimitedString;

    readonly animations: ValueLimitedString;

    readonly theme: ValueLimitedString;
    readonly autoThemeMode: ValueLimitedString;

    readonly scale: ValueLimitedNumber;
    private _scale: number;
    readonly scaleMouse: ValueLimitedNumber;
    readonly scalePen: ValueLimitedNumber;
    readonly scaleTouch: ValueLimitedNumber;
    readonly inputMode: ValueLimitedString;
    readonly autoInputMode: ValueLimitedString;
    private _autoInputListenerEvery = (event: PointerEvent) => {
        switch (event.pointerType) {
            case 'mouse': this.inputMode.set = InputMode.MOUSE; break;
            case 'pen': this.inputMode.set = InputMode.PEN; break;
            default:
            case 'touch': this.inputMode.set = InputMode.TOUCH; break;
        }
    }

    readonly textScale: ValueLimitedNumber;
    readonly textScaleMouse: ValueLimitedNumber;
    readonly textScalePen: ValueLimitedNumber;
    readonly textScaleTouch: ValueLimitedNumber;

    constructor(documentHandler: DocumentHandler, namespace: string = '') {
        if (namespace)
            namespace += '-'

        this.scrollbar = settings.makeStringSetting(namespace + 'scrollbar', 'Scrollbar', 'Size of scrollbar', ScrollbarMode.THIN, scrollbarMode);
        this.scrollbar.addListener(async (val) => { this.applyScrollbar(<ScrollbarMode>val); })

        this.animations = settings.makeStringSetting(namespace + 'animations', 'Animations', 'Amount of animations in the ui', AnimationMode.ALL, animationMode);
        this.animations.addListener(async (val) => { this.applyAnimation(<AnimationMode>val); })

        this.theme = settings.makeStringSetting(namespace + 'theme', 'Theme', 'Color theme of UI', (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? DefaultThemes.Dark : DefaultThemes.Light), themes);
        this.theme.addListener((val) => { this.applyTheme(val); });

        this.autoThemeMode = settings.makeStringSetting(namespace + 'autoTheme', 'Automatic Theme Change', 'Toggle for automatically changing theme', AutoThemeMode.OS, autoThemeMode);

        this.inputMode = settings.makeStringSetting(namespace + 'inputMode', 'Input Mode', 'Toggle between input modes', InputMode.MOUSE, inputMode);
        this.inputMode.addListener(async (val) => {
            switch (val) {
                case InputMode.MOUSE: this.scale.set = await this.scaleMouse.get; break;
                case InputMode.PEN: this.scale.set = await this.scalePen.get; break;
                case InputMode.TOUCH: this.scale.set = await this.scaleTouch.get; break;
            }
            this.applyInput(<InputMode>val);
        })

        this.autoInputMode = settings.makeStringSetting(namespace + 'autoTouch', 'Automatic Touch Mode', 'Mode for automatically changing touch mode', AutoInputMode.EVERY, autoInputMode)
        this.autoInputMode.addListener((val) => { this.applyAutoInput(<AutoInputMode>val); })

        this.scaleMouse = settings.makeNumberSetting(namespace + 'scaleMouse', 'UI Scale Mouse', 'The scale of the UI for mouse usage', 1, 0.5, 4, 0.1);
        this.scaleMouse.addListener((val) => { if (this.inputMode.get === InputMode.MOUSE) { this.scale.set = val; } });
        this.scalePen = settings.makeNumberSetting(namespace + 'scalePen', 'UI Scale Pen', 'The scale of the UI for pen usage', 1.2, 0.5, 4, 0.1);
        this.scalePen.addListener((val) => { if (this.inputMode.get === InputMode.PEN) { this.scale.set = val; } });
        this.scaleTouch = settings.makeNumberSetting(namespace + 'scaleTouch', 'UI Scale Touch', 'The scale of the UI for touch usage', 1.6, 0.5, 4, 0.1);
        this.scaleTouch.addListener((val) => { if (this.inputMode.get === InputMode.TOUCH) { this.scale.set = val; } });

        this.scale = new ValueLimitedNumber(1, 0.5, 4, 0.1);
        this.scale.addListener((val) => {
            this._scale = val * 16;
            this.applyScale(val);
            switch (this.inputMode.get) {
                case InputMode.MOUSE: this.scaleMouse.set = val; break;
                case InputMode.PEN: this.scalePen.set = val; break;
                case InputMode.TOUCH: this.scaleTouch.set = val; break;
            }
        });
        this._scale = <number>this.scale.get * 16;

        this.textScaleMouse = settings.makeNumberSetting(namespace + 'textScaleMouse', 'UI Text Scale Mouse Mode', 'The scale of the UI text for mouse usage', 1, 0.5, 2, 0.1);
        this.textScaleMouse.addListener((val) => { if (this.inputMode.get === InputMode.MOUSE) { this.textScale.set = val; } });
        this.textScalePen = settings.makeNumberSetting(namespace + 'textScalePen', 'UI Text Scale Pen Mode', 'The scale of the UI text for pen usage', 1.2, 0.5, 2, 0.1);
        this.textScalePen.addListener((val) => { if (this.inputMode.get === InputMode.PEN) { this.textScale.set = val; } });
        this.textScaleTouch = settings.makeNumberSetting(namespace + 'textScaleTouch', 'UI Text Scale Touch Mode', 'The scale of the UI text for touch usage', 1.6, 0.5, 2, 0.1);
        this.textScaleTouch.addListener((val) => { if (this.inputMode.get === InputMode.TOUCH) { this.textScale.set = val; } });

        this.textScale = new ValueLimitedNumber(1, 0.5, 2, 0.1);
        this.textScale.addListener((val) => {
            this.applyTextScale(val);
            switch (this.inputMode.get) {
                case InputMode.MOUSE: this.textScaleMouse.set = val; break;
                case InputMode.PEN: this.textScalePen.set = val; break;
                case InputMode.TOUCH: this.textScaleTouch.set = val; break;
            }
        });

        engines.push(this);
        this._handler = documentHandler;
        this._listener = this._handler.events.on('added', (e) => { this.applyAllToDoc(e.data); })
        documentHandler.forDocuments((doc) => { this.applyAllToDoc(doc); })
    }

    /**Run to clean up references to and from this engine*/
    destructor() {
        this._handler.events.off('added', this._listener);
        let index = engines.indexOf(this);
        if (index == -1)
            return console.warn('Theme engine already destructed');
        engines.splice(index, 1);
    }

    /**This applies the current theme to a document*/
    private async applyAllToDoc(doc: Document) {
        this.applyScrollbarToDoc(doc, <ScrollbarMode>await this.scrollbar.get);
        this.applyAnimationToDoc(doc, <AnimationMode>await this.animations.get);
        this.applyThemeToDoc(doc, await this.theme.get);
        this.applyAutoInputToDoc(doc, <AutoInputMode>await this.autoInputMode.get);
        this.applyInputToDoc(doc, <InputMode>await this.inputMode.get);
        switch (<InputMode>await this.inputMode.get) {
            case InputMode.MOUSE: this.scale.set = await this.scaleMouse.get; break;
            case InputMode.PEN: this.scale.set = await this.scalePen.get; break;
            case InputMode.TOUCH: this.scale.set = await this.scaleTouch.get; break;
        }
        this.applyScaleToDoc(doc, await this.scale.get);
        this.applyTextScaleToDoc(doc, await this.textScale.get);
    }

    /**This applies the current theme to a document*/
    private applyScrollbar(scroll: ScrollbarMode) { this._handler.forDocuments((doc) => { this.applyScrollbarToDoc(doc, scroll); }); }
    private applyScrollbarToDoc(doc: Document, scroll: ScrollbarMode) {
        doc.documentElement.style.setProperty('--scrollbar', { [ScrollbarMode.THIN]: '0.4rem', [ScrollbarMode.MEDIUM]: '1rem', [ScrollbarMode.WIDE]: '1.875rem' }[scroll]);
    }

    /**This applies the current theme to a document*/
    private applyAnimation(anim: AnimationMode) { this._handler.forDocuments((doc) => { this.applyAnimationToDoc(doc, anim); }); }
    private applyAnimationToDoc(doc: Document, anim: AnimationMode) {
        doc.documentElement.classList.remove('anim-all', 'anim-most', 'anim-some');
        switch (anim) {
            case AnimationMode.ALL: doc.documentElement.classList.add('anim-all');
            case AnimationMode.MOST: doc.documentElement.classList.add('anim-most');
            case AnimationMode.SOME: doc.documentElement.classList.add('anim-some'); break;
        }
    }

    /**This applies the current theme to a document*/
    private applyTheme(theme: string) { this._handler.forDocuments((doc) => { this.applyThemeToDoc(doc, theme); }); }
    private applyThemeToDoc(doc: Document, theme: string) { for (const key in bottomGroups) bottomGroups[key].applyThemes(doc.documentElement.style, theme) }

    /**This applies the current scale to a document*/
    private applyScale(scale: number) { this._handler.forDocuments((doc) => { this.applyScaleToDoc(doc, scale); }); }
    private applyScaleToDoc(doc: Document, scale: number) { doc.documentElement.style.fontSize = scale * 16 + 'px'; }

    /**This applies the current scale to a document*/
    private applyTextScale(scale: number) { this._handler.forDocuments((doc) => { this.applyTextScaleToDoc(doc, scale); }); }
    private applyTextScaleToDoc(doc: Document, scale: number) { doc.documentElement.style.setProperty('--textScale', String(scale)); }

    /**Auto Input Mode */
    private applyInput(mode: InputMode) { this._handler.forDocuments((doc) => { this.applyInputToDoc(doc, mode); }); }
    private applyInputToDoc(doc: Document, mode: InputMode) {
        let style = doc.documentElement.style;
        style.setProperty('--mouse', '0');
        style.setProperty('--pen', '0');
        style.setProperty('--touch', '0');
        doc.documentElement.classList.remove('mouse', 'pen', 'touch');
        switch (mode) {
            case InputMode.MOUSE:
                style.setProperty('--mouse', '1');
                doc.documentElement.classList.add('mouse');
                break;
            case InputMode.PEN:
                style.setProperty('--pen', '1');
                doc.documentElement.classList.add('pen');
                break;
            case InputMode.TOUCH:
                style.setProperty('--touch', '1');
                doc.documentElement.classList.add('touch');
                break;
        }
    }

    /**Auto Input Mode */
    private applyAutoInput(mode: AutoInputMode) { this._handler.forDocuments((doc) => { this.applyAutoInputToDoc(doc, mode); }); }
    private applyAutoInputToDoc(doc: Document, mode: AutoInputMode) {
        doc.documentElement.removeEventListener('pointerdown', this._autoInputListenerEvery, { capture: true });
        switch (mode) {
            case AutoInputMode.FIRST:
                doc.documentElement.addEventListener('pointerdown', this._autoInputListenerEvery, { capture: true, once: true });
                break;
            case AutoInputMode.EVERY:
                doc.documentElement.addEventListener('pointerdown', this._autoInputListenerEvery, { capture: true });
                break;
        }
    }

    private async applySingleProperty(key: string, variable: { [s: string]: string }) {
        let theme = await this.theme.get;
        this._handler.forDocuments((doc) => {
            doc.documentElement.style.setProperty(key, variable[theme]);
        });
    }

    /**Converts the given rems to pixels */
    remToPx(rem: number) {
        return rem * this._scale;
    }
    /**Converts the given pixels to rems */
    pxToRem(px: number) {
        return px / this._scale;
    }
}

//Sets up automatic theme change based on operating system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    for (let i = 0; i < engines.length; i++) {
        if (engines[i].autoThemeMode.get === AutoThemeMode.OS) {
            engines[i].theme.set = (e.matches ? DefaultThemes.Dark : DefaultThemes.Light);
        }
    }
});



