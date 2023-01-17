import "./index.css";
import { name } from "../package.json"
import { autoTheme, autoTouch, AutoTouchMode, initVariableRoot, scale, theme, touch } from "../src"
import { deregisterDocument, registerDocument } from "@chocolatelibui/document";

let varGroup = initVariableRoot(name, 'TestVars', 'TestDescription');
varGroup.makeVariable('test', 'Test Name', 'Test Description', 'blue', 'black', 'Angle', undefined)
varGroup.makeVariable('test2', 'Test 2 Name', 'Test 2 Description', 'test', 'asdf', 'Number', { min: 0, max: 1 })

let setup = (doc: Document) => {

    let autoOff = doc.body.appendChild(document.createElement('button'));
    autoOff.innerHTML = 'Turn Auto Theme Off';
    autoOff.addEventListener('click', () => { autoTheme.set = false; });
    let autoON = doc.body.appendChild(document.createElement('button'));
    autoON.innerHTML = 'Turn Auto Theme On';
    autoON.addEventListener('click', () => { autoTheme.set = true; });


    let themes = theme.enums;
    for (const key in themes) {
        let test = doc.body.appendChild(document.createElement('button'));
        test.innerHTML = key;
        test.addEventListener('click', () => {
            theme.set = key;
        })
    }

    let toggleTouch = doc.body.appendChild(document.createElement('button'));
    toggleTouch.innerHTML = 'Toggle Touch';
    toggleTouch.addEventListener('click', async () => {
        touch.set = !await touch.get;
    });

    let autoTouchSel = doc.body.appendChild(document.createElement('select'));
    for (const key in autoTouch.enums) {
        let option = autoTouchSel.appendChild(document.createElement('option'));
        option.innerHTML = key;
    }
    autoTouchSel.addEventListener('change', async (e) => {
        autoTouch.set = <AutoTouchMode>(<HTMLSelectElement>e.currentTarget).selectedOptions[0].innerHTML;
    });
    (async () => {
        autoTouchSel.value = await autoTouch.get;
    })()

    let scaleDown = doc.body.appendChild(document.createElement('button'));
    scaleDown.innerHTML = 'Scale Down';
    scaleDown.addEventListener('click', async () => { scale.set = await scale.get - 0.2; });
    let scaleUp = doc.body.appendChild(document.createElement('button'));
    scaleUp.innerHTML = 'Scale Up';
    scaleUp.addEventListener('click', async () => { scale.set = await scale.get + 0.2; });

}

setup(document);

let testButt = document.body.appendChild(document.createElement('button'))

testButt.innerHTML = 'Open Window'

testButt.onclick = () => {
    let wind = window.open('', '', "popup")
    registerDocument(wind!.document, true);
    wind?.addEventListener('unload', () => {
        deregisterDocument(wind!.document);
    })
    setup(wind!.document);
}
