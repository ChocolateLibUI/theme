
import DocumentHandler from "@chocolatelibui/document";
import ThemeEngine from "../../../src";
import "./index.css";

let documentHandler = new DocumentHandler(document);
let themeEngine = new ThemeEngine(documentHandler);

//@ts-ignore
document.body.themeEngine = themeEngine;

let scaleBox = document.body.appendChild(document.createElement('div'));
scaleBox.id = scaleBox.innerHTML = 'ScaleBox'