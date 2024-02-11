import { name, version } from "../package.json";
import {
  StateEnumHelper,
  StateEnumHelperList,
  StateEnumHelperType,
  StateNumberHelper,
  StateWrite,
} from "@chocolatelib/state";
import { settingsInit } from "@chocolatelibui/settings";
import {
  material_hardware_mouse_rounded,
  material_image_edit_rounded,
  material_action_touch_app_rounded,
  material_device_light_mode_rounded,
  material_device_dark_mode_rounded,
} from "@chocolatelibui/icons";
import { engines } from "./shared";

const settings = settingsInit(
  name,
  version,
  "Theme/UI",
  "Settings for UI elements and and color themes"
);

//Theme
export const enum Themes {
  Light = "light",
  Dark = "dark",
}
const themesInternal = {
  [Themes.Light]: {
    name: "Light",
    description: "Theme optimized for daylight",
    icon: material_device_light_mode_rounded,
  },
  [Themes.Dark]: {
    name: "Dark",
    description: "Theme optimized for night time",
    icon: material_device_dark_mode_rounded,
  },
} satisfies StateEnumHelperList;

const themeInternal = settings.addSetting(
  "theme",
  "Theme",
  "Theme to use for the UI",
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Themes.Dark
    : Themes.Light,
  true,
  new StateEnumHelper(themesInternal)
);
themeInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyTheme(val.unwrap);
  });
});

export const theme = themeInternal as StateWrite<
  Themes,
  Themes,
  StateEnumHelperType<typeof themesInternal>
>;

//Sets up automatic theme change based on operating system
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    themeInternal.write(e.matches ? Themes.Dark : Themes.Light);
  });

//Scale
let scaleValue = 1;
const scaleInternal = settings.addSetting(
  "scale",
  "Scale",
  "UI scale",
  100,
  true,
  new StateNumberHelper(50, 400, "%", 0, 1)
);
scaleInternal.subscribe((val) => {
  scaleValue = val.unwrap / 100;
  engines.forEach((engine) => {
    engine.applyScale(scaleValue);
  });
});
export const scale = scaleInternal as StateWrite<number>;

/**Converts the given rems to pixels */
export const remToPx = (rem: number) => {
  return rem * scaleValue;
};
/**Converts the given pixels to rems */
export const pxToRem = (px: number) => {
  return px / scaleValue;
};

//Scrollbar
export const enum ScrollbarModes {
  THIN = "thin",
  MEDIUM = "medium",
  WIDE = "wide",
}
const scrollbarModesInternal = {
  [ScrollbarModes.THIN]: {
    name: "Thin",
    description: "Thin modern scrollbar",
  },
  [ScrollbarModes.MEDIUM]: { name: "Medium", description: "Normal scrollbar" },
  [ScrollbarModes.WIDE]: {
    name: "Wide",
    description: "Large touch friendly scrollbar",
  },
} satisfies StateEnumHelperList;

const scrollBarModeInternal = settings.addSetting(
  "scrollbar",
  "Scrollbar Mode",
  "Size of the scrollbar to use",
  ScrollbarModes.THIN,
  true,
  new StateEnumHelper(scrollbarModesInternal)
);
scrollBarModeInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyScrollbar(val.unwrap);
  });
});
export const scrollBarMode = scrollBarModeInternal as StateWrite<
  ScrollbarModes,
  ScrollbarModes,
  StateEnumHelperType<typeof scrollbarModesInternal>
>;

//Input Mode
export const enum InputModes {
  MOUSE = "mouse",
  PEN = "pen",
  TOUCH = "touch",
}
const inputModesInternal = {
  [InputModes.MOUSE]: {
    name: "Mouse",
    description: "Mouse input",
    icon: material_hardware_mouse_rounded,
  },
  [InputModes.PEN]: {
    name: "Pen",
    description: "Pen input",
    icon: material_image_edit_rounded,
  },
  [InputModes.TOUCH]: {
    name: "Touch",
    description: "Touch input",
    icon: material_action_touch_app_rounded,
  },
} satisfies StateEnumHelperList;
const inputModeInternal = settings.addSetting(
  "input",
  "Input Mode",
  "Setting for preffered input mode, changes UI elements to be more optimized for the selected input mode",
  InputModes.TOUCH,
  true,
  new StateEnumHelper(inputModesInternal)
);
inputModeInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyInput(val.unwrap);
  });
});
export const inputMode = inputModeInternal as StateWrite<
  InputModes,
  InputModes,
  StateEnumHelperType<typeof inputModesInternal>
>;

//Animation Level
export const enum AnimationLevels {
  ALL = "all",
  MOST = "most",
  SOME = "some",
  NONE = "none",
}
const animationLevelsInternal = {
  [AnimationLevels.ALL]: { name: "All", description: "All animations" },
  [AnimationLevels.MOST]: {
    name: "Most",
    description: "All but the heaviest animations",
  },
  [AnimationLevels.SOME]: {
    name: "Some",
    description: "Only the lightest animations",
  },
  [AnimationLevels.NONE]: { name: "None", description: "No animations" },
} satisfies StateEnumHelperList;

const animationLevelInternal = settings.addSetting(
  "animation",
  "Animation Level",
  "Setting for animation level, changes the amount of animations used in the UI",
  AnimationLevels.ALL,
  true,
  new StateEnumHelper(animationLevelsInternal)
);
animationLevelInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyAnimation(val.unwrap);
  });
});

export const animationLevel = animationLevelInternal as StateWrite<
  AnimationLevels,
  AnimationLevels,
  StateEnumHelperType<typeof animationLevelsInternal>
>;
