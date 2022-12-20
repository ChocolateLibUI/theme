import { touch } from "../../../src"

touch.set = true;
await new Promise((a) => { setTimeout(a, 1000) });

document.body.appendChild(document.createElement('div')).innerHTML = 'Test99'
document.body.appendChild(document.createElement('div')).innerHTML = 'Test994'