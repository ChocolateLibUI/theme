
import "./index.css";
import { touch, scale } from "../../../src"

let touchBox = document.body.appendChild(document.createElement('div'));
touchBox.id = touchBox.innerHTML = 'TouchBox'
touchBox.onclick = () => {
    touch.set = true;
}

let scaleBox = document.body.appendChild(document.createElement('div'));
scaleBox.id = scaleBox.innerHTML = 'ScaleBox'
scaleBox.onclick = () => {
    scale.set = 2;
}