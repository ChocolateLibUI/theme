import "./index.scss";
import DocumentHandler from "@chocolatelibui/document";
import { name } from "../package.json";
import { initVariableRoot, ThemeEngine } from "../src";
import {
  animationLevel,
  AnimationLevels,
  animationLevels,
  inputMode,
  InputModes,
  inputModes,
  scale,
  scrollBarMode,
  ScrollbarModes,
  scrollbarModes,
  theme,
  Themes,
  themes,
} from "../src/settings";

let documentHandler = new DocumentHandler(document);
let themeEngine = new ThemeEngine(documentHandler);

let varGroup = initVariableRoot(name, "TestVars", "TestDescription");
varGroup.makeVariable(
  "test",
  "Test Name",
  "Test Description",
  "lightblue",
  "black",
  "Angle",
  undefined
);
varGroup.makeVariable(
  "testText",
  "Test Name",
  "Test Description",
  "black",
  "white",
  "Angle",
  undefined
);
varGroup.makeVariable(
  "test2",
  "Test 2 Name",
  "Test 2 Description",
  "test",
  "asdf",
  "Number",
  { min: 0, max: 1 }
);

let setup = async (doc: Document) => {
  //Scrollbar
  let scrollSel = doc.body.appendChild(document.createElement("select"));
  for (const key in (await scrollbarModes).unwrap) {
    let option = scrollSel.appendChild(document.createElement("option"));
    option.innerHTML = key;
  }
  scrollSel.addEventListener("change", (e) => {
    scrollBarMode.write(
      (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
        .innerHTML as ScrollbarModes
    );
  });
  scrollSel.value = (await scrollBarMode).unwrap;
  scrollBarMode.subscribe((val) => {
    scrollSel.value = val.unwrap;
  });

  //Animations
  let animAutoSel = doc.body.appendChild(document.createElement("select"));
  for (const key in (await animationLevels).unwrap) {
    let option = animAutoSel.appendChild(document.createElement("option"));
    option.innerHTML = key;
  }
  animAutoSel.addEventListener("change", async (e) => {
    animationLevel.write(
      (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
        .innerHTML as AnimationLevels
    );
  });
  animAutoSel.value = (await animationLevel).unwrap;
  animationLevel.subscribe((val) => {
    animAutoSel.value = val.unwrap;
  });

  //Theme
  let themeAutoSel = doc.body.appendChild(document.createElement("select"));
  for (const key in (await themes).unwrap) {
    let option = themeAutoSel.appendChild(document.createElement("option"));
    option.innerHTML = key;
  }
  themeAutoSel.addEventListener("change", async (e) => {
    theme.write(
      (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
        .innerHTML as Themes
    );
  });
  themeAutoSel.value = (await theme).unwrap;
  theme.subscribe((val) => {
    themeAutoSel.value = val.unwrap;
  });

  for (const key in (await themes).unwrap) {
    let test = doc.body.appendChild(document.createElement("button"));
    test.innerHTML = key;
    test.addEventListener("click", () => {
      theme.write(key as Themes);
    });
  }

  //Scale
  let scaleIn = doc.body.appendChild(document.createElement("input"));
  scaleIn.type = "number";
  scaleIn.addEventListener("change", async () => {
    scale.write(scaleIn.valueAsNumber);
    scaleIn.valueAsNumber = (await scale).unwrap;
  });
  scaleIn.valueAsNumber = (await scale).unwrap;
  scale.subscribe((val) => {
    scaleIn.valueAsNumber = val.unwrap;
  });

  //InputMode
  let inputModeSel = doc.body.appendChild(document.createElement("select"));
  for (const key in (await inputModes).unwrap) {
    let option = inputModeSel.appendChild(document.createElement("option"));
    option.innerHTML = key;
  }
  inputModeSel.addEventListener("change", async (e) => {
    inputMode.write(
      (<HTMLSelectElement>e.currentTarget).selectedOptions[0]
        .innerHTML as InputModes
    );
  });
  inputModeSel.value = (await inputMode).unwrap;

  inputMode.subscribe((val) => {
    inputModeSel.value = val.unwrap;
  });

  doc.body.appendChild(document.createElement("div")).innerHTML =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum volutpat tortor non tempor viverra. Cras ullamcorper ligula massa, fringilla ornare sapien imperdiet ac. Nam sapien diam, lacinia eget ex sed, varius commodo lacus. Aliquam pharetra metus tortor, non congue metus viverra vel. Donec semper malesuada arcu, eget lobortis eros scelerisque.";
};

setup(document);

let testButt = document.body.appendChild(document.createElement("button"));

testButt.innerHTML = "Open Window";

testButt.onclick = () => {
  let wind = window.open("", "", "popup");
  documentHandler.registerDocument(wind!.document, true);
  wind?.addEventListener("unload", () => {
    documentHandler.deregisterDocument(wind!.document);
  });
  setup(wind!.document);
};
