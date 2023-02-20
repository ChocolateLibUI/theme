
import { initSettings } from "@chocolatelibui/settings"
import DocumentHandler from "@chocolatelibui/document";
import { EnumList, Value, ValueLimitedNumber, ValueLimitedString } from "@chocolatelib/value";
import { name } from "../package.json"
import { bottomGroups, DefaultThemes, engines } from "./shared";
import { EListener } from "@chocolatelib/events";
import { material_hardware_mouse_rounded, material_image_edit_rounded, material_action_touch_app_rounded, material_device_light_mode_rounded, material_device_dark_mode_rounded } from "@chocolatelibui/icons";

let settings = initSettings(name, 'Theme/UI', 'Settings for UI elements and and color themes');

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
    Mouse = 'mouse',
    Pen = 'pen',
    Touch = 'touch'
}
let inputMode: EnumList = {
    [InputMode.Mouse]: { name: 'Mouse', description: "Mouse input", icon: material_hardware_mouse_rounded() },
    [InputMode.Pen]: { name: 'Pen', description: "Pen input", icon: material_image_edit_rounded() },
    [InputMode.Touch]: { name: 'Touch', description: "Touch input", icon: material_action_touch_app_rounded() }
}

export const enum AutoInputMode {
    Off = 'off',
    First = 'first',
    Every = 'every'
}
let autoInputMode: EnumList = {
    [AutoInputMode.Off]: { name: 'Off', description: "Don't set touch mode automatically" },
    [AutoInputMode.First]: { name: 'First Interaction', description: "Change touch mode on first ui interaction" },
    [AutoInputMode.Every]: { name: 'Every Interaction', description: "Change touch mode on every ui interaction" }
}

export class Engine {
    /**Reference to document handler*/
    private _handler: DocumentHandler;
    private _listener: EListener<"added", DocumentHandler, Document>;

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
            case 'mouse': this.inputMode.set = InputMode.Mouse; break;
            case 'pen': this.inputMode.set = InputMode.Pen; break;
            default:
            case 'touch': this.inputMode.set = InputMode.Touch; break;
        }
    }

    constructor(documentHandler: DocumentHandler, namespace: string = '') {
        if (namespace)
            namespace += '-'
        this.theme = settings.makeStringSetting(namespace + 'theme', 'Theme', 'Color theme of UI', (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? DefaultThemes.Dark : DefaultThemes.Light), themes);
        this.theme.addListener((val) => { this.applyTheme(val); });
        this.autoThemeMode = settings.makeStringSetting(namespace + 'autoTheme', 'Automatic Theme Change', 'Toggle for automatically changing theme', AutoThemeMode.OS, autoThemeMode);

        this.inputMode = settings.makeStringSetting(namespace + 'inputMode', 'Input Mode', 'Toggle between input modes', InputMode.Mouse, inputMode);
        this.inputMode.addListener(async (val) => {
            switch (val) {
                case InputMode.Mouse: this.scale.set = await this.scaleMouse.get; break;
                case InputMode.Pen: this.scale.set = await this.scalePen.get; break;
                case InputMode.Touch: this.scale.set = await this.scaleTouch.get; break;
            }
            this.applyInput(<InputMode>val);
        })

        this.autoInputMode = settings.makeStringSetting(namespace + 'autoTouch', 'Automatic Touch Mode', 'Mode for automatically changing touch mode', AutoInputMode.Every, autoInputMode)
        this.autoInputMode.addListener((val) => { this.applyAutoInput(<AutoInputMode>val); })

        this.scaleMouse = settings.makeNumberSetting(namespace + 'scaleMouse', 'UI Scale Mouse', 'The scale of the UI for mouse usage', 1, 0.5, 4, 0.1);
        this.scaleMouse.addListener((val) => { if (this.inputMode.get === InputMode.Mouse) { this.scale.set = val; } });
        this.scalePen = settings.makeNumberSetting(namespace + 'scalePen', 'UI Scale Pen', 'The scale of the UI for pen usage', 1, 0.5, 4, 0.1);
        this.scalePen.addListener((val) => { if (this.inputMode.get === InputMode.Pen) { this.scale.set = val; } });
        this.scaleTouch = settings.makeNumberSetting(namespace + 'scaleTouch', 'UI Scale Touch', 'The scale of the UI for touch usage', 1, 0.5, 4, 0.1);
        this.scaleTouch.addListener((val) => { if (this.inputMode.get === InputMode.Touch) { this.scale.set = val; } });

        this.scale = new ValueLimitedNumber(1, 0.5, 4, 0.1);
        this.scale.addListener((val) => {
            this._scale = val * 16;
            this.applyScale(val);
            switch (this.inputMode.get) {
                case InputMode.Mouse: this.scaleMouse.set = val; break;
                case InputMode.Pen: this.scalePen.set = val; break;
                case InputMode.Touch: this.scaleTouch.set = val; break;
            }
        });
        this._scale = <number>this.scale.get * 16;

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
        this.applyThemeToDoc(doc, await this.theme.get);
        this.applyScaleToDoc(doc, await this.scale.get);
        this.applyAutoInputToDoc(doc, <AutoInputMode>await this.autoInputMode.get);
        this.applyInputToDoc(doc, <InputMode>await this.inputMode.get);
    }

    /**This applies the current theme to a document*/
    private applyTheme(theme: string) { this._handler.forDocuments((doc) => { this.applyThemeToDoc(doc, theme); }); }
    private applyThemeToDoc(doc: Document, theme: string) { for (const key in bottomGroups) bottomGroups[key].applyThemes(doc.documentElement.style, theme) }

    /**This applies the current scale to a document*/
    private applyScale(scale: number) { this._handler.forDocuments((doc) => { this.applyScaleToDoc(doc, scale); }); }
    private applyScaleToDoc(doc: Document, scale: number) { doc.documentElement.style.fontSize = scale * 16 + 'px'; }

    /**Auto Input Mode */
    private applyInput(mode: InputMode) { this._handler.forDocuments((doc) => { this.applyInputToDoc(doc, mode); }); }
    private applyInputToDoc(doc: Document, mode: InputMode) {
        let style = doc.documentElement.style;
        style.setProperty('--mouse', '0');
        style.setProperty('--pen', '0');
        style.setProperty('--touch', '0');
        switch (mode) {
            case InputMode.Mouse: style.setProperty('--mouse', '1'); break;
            case InputMode.Pen: style.setProperty('--pen', '1'); break;
            case InputMode.Touch: style.setProperty('--touch', '1'); break;
        }
    }

    /**Auto Input Mode */
    private applyAutoInput(mode: AutoInputMode) { this._handler.forDocuments((doc) => { this.applyAutoInputToDoc(doc, mode); }); }
    private applyAutoInputToDoc(doc: Document, mode: AutoInputMode) {
        doc.documentElement.removeEventListener('pointerdown', this._autoInputListenerEvery, { capture: true });
        switch (mode) {
            case AutoInputMode.First:
                doc.documentElement.addEventListener('pointerdown', this._autoInputListenerEvery, { capture: true, once: true });
                break;
            case AutoInputMode.Every:
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



