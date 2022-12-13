import "./index.css";
import { autoTheme, autoTouch, AutoTouchMode, registerVariable, scale, theme, themes, touch } from "../src"

registerVariable('test', 'blue', 'black');
registerVariable('test2', 'test', 'asdf');

document.body.style.backgroundColor = 'var(--test)';

let autoOff = document.body.appendChild(document.createElement('button'));
autoOff.innerHTML = 'Turn Auto Theme Off';
autoOff.addEventListener('click', () => { autoTheme.set = false; });
let autoON = document.body.appendChild(document.createElement('button'));
autoON.innerHTML = 'Turn Auto Theme On';
autoON.addEventListener('click', () => { autoTheme.set = true; });

(async () => {
    let themesArray = await themes.get;
    for (let i = 0; i < themesArray.length; i++) {
        let test = document.body.appendChild(document.createElement('button'));
        test.innerHTML = themesArray[i].name;
        test.addEventListener('click', () => {
            theme.set = themesArray[i].name;
        })
    }
})()

let toggleTouch = document.body.appendChild(document.createElement('button'));
toggleTouch.innerHTML = 'Toggle Touch';
toggleTouch.addEventListener('click', async () => {
    touch.set = !await touch.get;
});

let autoTouchSel = document.body.appendChild(document.createElement('select'));
Object.values(AutoTouchMode).forEach((key) => {
    let option = autoTouchSel.appendChild(document.createElement('option'));
    option.innerHTML = key;
})
autoTouchSel.addEventListener('change', async (e) => {
    autoTouch.set = <AutoTouchMode>(<HTMLSelectElement>e.currentTarget).selectedOptions[0].innerHTML;
});
(async () => {
    autoTouchSel.value = await autoTouch.get;
})()

let scaleDown = document.body.appendChild(document.createElement('button'));
scaleDown.innerHTML = 'Scale Down';
scaleDown.addEventListener('click', async () => { scale.set = await scale.get - 0.2; });
let scaleUp = document.body.appendChild(document.createElement('button'));
scaleUp.innerHTML = 'Scale Up';
scaleUp.addEventListener('click', async () => { scale.set = await scale.get + 0.2; });
