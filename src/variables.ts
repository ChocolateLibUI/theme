import { EnumList } from "@chocolatelib/value"
import { settings } from "./shared";
import { events, forDocuments } from "@chocolatelibui/document"

let bottomGroups: { [key: string]: VariableGroup } = {};

/**Default themes*/
const enum DefaultThemes {
    Light = 'light',
    Dark = 'dark'
}

/**Default themes info */
let themes: EnumList = {
    [DefaultThemes.Light]: { name: 'Light', description: "Don't set touch mode automatically" },
    [DefaultThemes.Dark]: { name: 'Dark', description: "Change touch mode on first ui interaction" },
}

/**State of themes*/
export let theme = settings.makeStringSetting('theme', 'Theme', 'Color theme of UI', (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? DefaultThemes.Dark : DefaultThemes.Light), themes);
/**State of automatic theme change*/
export let autoTheme = settings.makeBooleanSetting('autoTheme', 'Automatic Theme Change', 'Toggle for automatically changing theme', true);

/**Initialises the settings for the package
 * @param packageName use import {name} from ("../package.json")
 * @param name name of group formatted for user reading
 * @param description a description of what the setting group is about*/
export let initVariableRoot = (packageName: string, name: string, description: string) => {
    // @ts-expect-error 
    bottomGroups[packageName] = new VariableGroup(packageName, name, description);
    return bottomGroups[packageName];
}

/**Group of settings should never be instantiated manually use initSettings*/
export class VariableGroup {
    private pathID: string;
    private variables: { [key: string]: { name: string, desc: string, vars: { [key: string]: string } } } = {};
    private subGroups: { [key: string]: VariableGroup } = {};
    readonly name: string;
    readonly description: string;

    private constructor(path: string, name: string, description: string) {
        this.pathID = path;
        this.name = name;
        this.description = description;
    }

    /**Makes a variable subgroup for this group
     * @param id unique identifier for this subgroup in the parent group
     * @param name name of group formatted for user reading
     * @param description a description of what the setting group is about formatted for user reading*/
    makeSubGroup(id: string, name: string, description: string) {
        if (id in this.subGroups) {
            throw new Error('Sub group already registered ' + id);
        } else {
            return this.subGroups[id] = new VariableGroup(this.pathID + '/' + id, name, description);
        }
    }

    /**Makes a variable
     * @param id unique identifier for this variable in the group
     * @param name name of variable formatted for user reading
     * @param description a description of what the variable is about formatted for user reading
     * @param light value for light mode
     * @param dark value for dark mode
     * @param type type of variable for editing*/
    makeVariable<K extends keyof VariableType>(id: string, name: string, description: string, light: string, dark: string, type: K, typeParams: VariableType[K]) {
        if (id in this.variables) {
            throw new Error('Settings already registered ' + id);
        }
        type;
        typeParams;
        let key = '--' + this.pathID + '/' + id;
        let variable = this.variables[key] = { name, desc: description, vars: { [DefaultThemes.Light]: light, [DefaultThemes.Dark]: dark } }
        forDocuments((doc) => {
            // @ts-expect-error 
            doc.documentElement.style.setProperty(key, variable.vars[(<string>theme.get)]);
        });
        return;
    }

    /**Applies the groups 
     * @param style unique identifier for this variable in the group
     * @param theme name of variable formatted for user reading*/
    applyThemes(style: CSSStyleDeclaration, theme: string) {
        for (const key in this.variables) {
            style.setProperty(key, this.variables[key].vars[theme]);
        }
        for (const key in this.subGroups) {
            this.subGroups[key].applyThemes(style, theme);
        }
    }
}

/**Defines the parameters for a variable type */
interface VariableType {
    /**Text variable,  */
    String: undefined,
    /**Color variable */
    Color: undefined,
    /**Time variable */
    Time: {
        /**Minimum time in milliseconds */
        min: number,
        /**Maximum time in milliseconds */
        max: number
    } | undefined,
    /**Angle variable */
    Angle: { min: number, max: number } | undefined,
    /**Length variable*/
    Length: { min: number, max: number } | undefined,
    /**Number variable*/
    Number: { min: number, max: number } | undefined,
    /**Ratio*/
    Ratio: { width: { min: number, max: number }, height: { min: number, max: number } } | number | undefined,
}

/**This applies the current theme to a document*/
let applyTheme = (docu: Document, theme: string) => {
    for (const key in bottomGroups) {
        bottomGroups[key].applyThemes(docu.documentElement.style, theme)
    }
}

/**Listener for theme change*/
theme.addListener((value) => {
    forDocuments((doc) => {
        applyTheme(doc, value);
    });
});

//Sets up automatic theme change based on operating system
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (autoTheme.get) {
        theme.set = (e.matches ? DefaultThemes.Dark : DefaultThemes.Light);
    }
});

events.on('documentAdded', (e) => {
    applyTheme(e.data, <string>theme.get);
})
forDocuments((doc) => {
    applyTheme(doc, <string>theme.get);
});