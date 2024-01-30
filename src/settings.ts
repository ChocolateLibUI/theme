import { name, version } from "../package.json";
import {
  State,
  StateEnumLimits,
  StateEnumList,
  StateEnumRelated,
  StateNumberLimits,
  StateNumberRelated,
  StateRead,
  StateWrite,
} from "@chocolatelib/state";
import { initSettings } from "@chocolatelibui/settings";
import {
  material_hardware_mouse_rounded,
  material_image_edit_rounded,
  material_action_touch_app_rounded,
  material_device_light_mode_rounded,
  material_device_dark_mode_rounded,
} from "@chocolatelibui/icons";
import { Ok, Some } from "@chocolatelib/result";
import { engines } from "./shared";

const settings = initSettings(
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
const themesInternal: StateEnumList = {
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
};
export const themes = new State(Ok(themesInternal)) as StateRead<StateEnumList>;
const themesLimiter = new StateEnumLimits<Themes>(themesInternal);

const themeInternal = settings.addSetting<Themes, Themes, StateEnumRelated>(
  "theme",
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? Themes.Dark
    : Themes.Light,
  "Theme",
  "Theme to use for the UI",
  true,
  themesLimiter,
  () => {
    return Some({ list: themes });
  }
);
themeInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyTheme(val.unwrap);
  });
});

export const theme = themeInternal as StateWrite<Themes>;

//Sets up automatic theme change based on operating system
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    themeInternal.write(e.matches ? Themes.Dark : Themes.Light);
  });

//Scale
const scaleMax = new State(Ok(400));
const scaleMin = new State(Ok(50));
const scaleDecimals = new State(Ok(0));
const scaleUnit = new State(Ok("%"));
const scaleLimiter = new StateNumberLimits(50, 400);
let scaleValue = 1;

const scaleInternal = settings.addSetting<number, number, StateNumberRelated>(
  "scale",
  100,
  "Scale",
  "UI scale",
  true,
  scaleLimiter,
  () => {
    return Some({
      min: scaleMin,
      max: scaleMax,
      unit: scaleUnit,
      decimals: scaleDecimals,
    });
  }
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
} as StateEnumList;

export const scrollbarModes = new State(
  Ok(scrollbarModesInternal)
) as StateRead<StateEnumList>;
const scrollbarModesLimiter = new StateEnumLimits<ScrollbarModes>(
  scrollbarModesInternal
);

const scrollBarModeInternal = settings.addSetting<
  ScrollbarModes,
  ScrollbarModes,
  StateEnumRelated
>(
  "scrollbar",
  ScrollbarModes.THIN,
  "Scrollbar Mode",
  "Size of the scrollbar to use",
  true,
  scrollbarModesLimiter,
  () => {
    return Some({ list: scrollbarModes });
  }
);
scrollBarModeInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyScrollbar(val.unwrap);
  });
});
export const scrollBarMode =
  scrollBarModeInternal as StateWrite<ScrollbarModes>;

//Input Mode
export const enum InputModes {
  MOUSE = "mouse",
  PEN = "pen",
  TOUCH = "touch",
}
const inputModesInternal: StateEnumList = {
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
};
export const inputModes = new State(
  Ok(inputModesInternal)
) as StateRead<StateEnumList>;
const inputModeLimiter = new StateEnumLimits<InputModes>(inputModesInternal);

const inputModeInternal = settings.addSetting<
  InputModes,
  InputModes,
  StateEnumRelated
>(
  "input",
  InputModes.TOUCH,
  "Input Mode",
  "Setting for preffered input mode, changes UI elements to be more optimized for the selected input mode",
  true,
  inputModeLimiter,
  () => {
    return Some({ list: inputModes });
  }
);
inputModeInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyInput(val.unwrap);
  });
});
export const inputMode = inputModeInternal as StateWrite<InputModes>;

//Animation Level
export const enum AnimationLevels {
  ALL = "all",
  MOST = "most",
  SOME = "some",
  NONE = "none",
}
const animationLevelsInternal: StateEnumList = {
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
};
export const animationLevels = new State(
  Ok(animationLevelsInternal)
) as StateRead<StateEnumList>;
const animationLevelsLimiter = new StateEnumLimits<AnimationLevels>(
  animationLevelsInternal
);

const animationLevelInternal = settings.addSetting<
  AnimationLevels,
  AnimationLevels,
  StateEnumRelated
>(
  "animation",
  AnimationLevels.ALL,
  "Animation Level",
  "Setting for animation level, changes the amount of animations used in the UI",
  true,
  animationLevelsLimiter,
  () => {
    return Some({ list: animationLevels });
  }
);
animationLevelInternal.subscribe((val) => {
  engines.forEach((engine) => {
    engine.applyAnimation(val.unwrap);
  });
});

export const animationLevel =
  animationLevelInternal as StateWrite<AnimationLevels>;
