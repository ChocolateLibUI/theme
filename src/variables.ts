import { EnumList } from "@chocolatelib/value"
import { documents } from "./document";
import { settings } from "./shared";

/**Default themes*/
enum DefaultThemes {
    light = 'light',
    dark = 'dark'
}

/**Default themes info */
let themes: EnumList = {
    [DefaultThemes.light]: { name: 'Light', description: "Don't set touch mode automatically" },
    [DefaultThemes.dark]: { name: 'Dark', description: "Change touch mode on first ui interaction" },
}

//Package exports
/**State of themes*/
export let theme = settings.makeStringSetting('theme', 'Theme', 'Color theme of UI', (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? DefaultThemes.dark : DefaultThemes.light), themes);
/**State of automatic theme change*/
export let autoTheme = settings.makeBooleanSetting('autoTheme', 'Automatic Theme Change', 'Toggle for automatically changing theme', true);

/**This lets one add an variable to the theme engine
 * variable are added to the document root CSS ass --variables
 * @param name name of variable
 * @param light default value in day mode
 * @param dark defult value in night mode*/
export let registerVariable = async (name: string, light: ThemeValue, dark: ThemeValue) => {
    if (name in themeStorage[DefaultThemes.light]) {
        console.warn('Theme variable already registered ' + name);
    } else {
        themeStorage[DefaultThemes.light][name] = light;
        themeStorage[DefaultThemes.dark][name] = dark;
        for (let i = 0; i < documents.length; i++) {
            documents[i].documentElement.style.setProperty('--' + name, themeStorage[await theme.get][name]);
        }
    }
}

//Internal Exports
/**This applies the current theme to a document*/
export let applyTheme = (docu: Document, theme: string) => {
    let style = docu.documentElement.style;
    let them = themeStorage[theme];
    for (let key in them) {
        style.setProperty('--' + key, them[key]);
    }
}

/**Listener for theme change*/
theme.addListener((value) => {
    for (let i = 0; i < documents.length; i++) {
        applyTheme(documents[i], value);
    }
});

type ThemeValue = string;

interface Theme {
    [k: string]: ThemeValue
}

interface Themes {
    [k: string]: Theme
}

/**Storage of themes*/
let themeStorage: Themes = {
    [DefaultThemes.light]: {},
    [DefaultThemes.dark]: {},
};

//Sets up automatic theme change based on operating system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (autoTheme.get) {
        theme.set = (e.matches ? DefaultThemes.dark : DefaultThemes.light);
    }
});