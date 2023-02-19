import "./index.css";
import DocumentHandler from "@chocolatelibui/document";
import { name } from "../package.json"
import ThemeEngine, { AutoTouchMode, initVariableRoot } from "../src"
import { InputMode } from "../src/engine";

let documentHandler = new DocumentHandler(document);
let themeEngine = new ThemeEngine(documentHandler);

let varGroup = initVariableRoot(name, 'TestVars', 'TestDescription');
varGroup.makeVariable('test', 'Test Name', 'Test Description', 'blue', 'black', 'Angle', undefined)
varGroup.makeVariable('test2', 'Test 2 Name', 'Test 2 Description', 'test', 'asdf', 'Number', { min: 0, max: 1 })

let setup = (doc: Document) => {

    //Theme
    let themeAutoSel = doc.body.appendChild(document.createElement('select'));
    for (const key in themeEngine.autoThemeMode.enums) {
        let option = themeAutoSel.appendChild(document.createElement('option'));
        option.innerHTML = key;
    }
    themeAutoSel.addEventListener('change', async (e) => { themeEngine.autoThemeMode.set = <InputMode>(<HTMLSelectElement>e.currentTarget).selectedOptions[0].innerHTML; });
    (async () => { themeAutoSel.value = await themeEngine.autoThemeMode.get; })()
    themeEngine.autoThemeMode.addListener((val) => { themeAutoSel.value = val; })

    let themes = themeEngine.theme.enums;
    for (const key in themes) {
        let test = doc.body.appendChild(document.createElement('button'));
        test.innerHTML = key;
        test.addEventListener('click', () => {
            themeEngine.theme.set = key;
        })
    }

    //Scale
    let scaleIn = doc.body.appendChild(document.createElement('input'));
    scaleIn.type = 'number';
    scaleIn.addEventListener('change', async () => {
        themeEngine.scale.set = Number(scaleIn.value);
        scaleIn.value = String(await themeEngine.scale.get);
    });
    (async () => { scaleIn.value = String(await themeEngine.scale.get); })()
    themeEngine.scale.addListener((val) => { scaleIn.value = String(val); })

    //InputMode
    let inputModeSel = doc.body.appendChild(document.createElement('select'));
    for (const key in themeEngine.inputMode.enums) {
        let option = inputModeSel.appendChild(document.createElement('option'));
        option.innerHTML = key;
    }
    inputModeSel.addEventListener('change', async (e) => { themeEngine.inputMode.set = <InputMode>(<HTMLSelectElement>e.currentTarget).selectedOptions[0].innerHTML; });
    (async () => { inputModeSel.value = await themeEngine.inputMode.get; })()
    themeEngine.inputMode.addListener((val) => { inputModeSel.value = val; })

    let autoInputSel = doc.body.appendChild(document.createElement('select'));
    for (const key in themeEngine.autoInputMode.enums) {
        let option = autoInputSel.appendChild(document.createElement('option'));
        option.innerHTML = key;
    }
    autoInputSel.addEventListener('change', async (e) => { themeEngine.autoInputMode.set = <AutoTouchMode>(<HTMLSelectElement>e.currentTarget).selectedOptions[0].innerHTML; });
    (async () => { autoInputSel.value = await themeEngine.autoInputMode.get; })()
    themeEngine.autoInputMode.addListener((val) => { autoInputSel.value = val; })

    let scaleMouse = doc.body.appendChild(document.createElement('input'));
    scaleMouse.type = 'number';
    scaleMouse.addEventListener('change', async () => {
        themeEngine.scaleMouse.set = Number(scaleMouse.value);
        scaleMouse.value = String(await themeEngine.scaleMouse.get);
    });
    (async () => { scaleMouse.value = String(await themeEngine.scaleMouse.get); })()
    themeEngine.scaleMouse.addListener((val) => { scaleMouse.value = String(val); })

    let scalePen = doc.body.appendChild(document.createElement('input'));
    scalePen.type = 'number';
    scalePen.addEventListener('change', async () => {
        themeEngine.scalePen.set = Number(scalePen.value);
        scalePen.value = String(await themeEngine.scalePen.get);
    });
    (async () => { scalePen.value = String(await themeEngine.scalePen.get); })()
    themeEngine.scalePen.addListener((val) => { scalePen.value = String(val); })

    let scaleTouch = doc.body.appendChild(document.createElement('input'));
    scaleTouch.type = 'number';
    scaleTouch.addEventListener('change', async () => {
        themeEngine.scaleTouch.set = Number(scaleTouch.value);
        scaleTouch.value = String(await themeEngine.scaleTouch.get);
    });
    (async () => { scaleTouch.value = String(await themeEngine.scaleTouch.get); })()
    themeEngine.scaleTouch.addListener((val) => { scaleTouch.value = String(val); })

}

setup(document);

let testButt = document.body.appendChild(document.createElement('button'))

testButt.innerHTML = 'Open Window'

testButt.onclick = () => {
    let wind = window.open('', '', "popup")
    documentHandler.registerDocument(wind!.document, true);
    wind?.addEventListener('unload', () => {
        documentHandler.deregisterDocument(wind!.document);
    })
    setup(wind!.document);
}