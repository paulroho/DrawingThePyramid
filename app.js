import * as pyramid from "./pyramid.js";

export function startup() {
    wire();
    redraw();
}

const count1Text = document.getElementById('number-1');
const count2Text = document.getElementById('number-2');
const classification1Text = document.getElementById('classification-1');
const classification2Text = document.getElementById('classification-2');

const optionTopText = document.getElementById('option-top');
const optionHeightText = document.getElementById('option-height');
const optionWidthText = document.getElementById('option-width');

const topPart = document.getElementById('part-top');
const topCountText = topPart.getElementsByClassName('test-count')[0];
const topClassificationText = topPart.getElementsByClassName('test-classification')[0];
const topShape = topPart.getElementsByTagName('polygon')[0];

const bottomPart = document.getElementById('part-bottom');
const bottomCountText = bottomPart.getElementsByClassName('test-count')[0];
const bottomClassificationText = bottomPart.getElementsByClassName('test-classification')[0];
const bottomShape = bottomPart.getElementsByTagName('polygon')[0];

function wire() {
    classification1Text.oninput = updateCaptions;
    classification2Text.oninput = updateCaptions;

    count1Text.onchange = redraw;
    count2Text.onchange = redraw;

    optionTopText.onchange = redraw;
    optionHeightText.onchange = redraw;
    optionWidthText.onchange = redraw;
}

function updateCaptions() {
    topClassificationText.textContent = classification1Text.value;
    bottomClassificationText.textContent = classification2Text.value;
}

function redraw() {
    const topCount = parseInt(count1Text.value);
    const bottomCount = parseInt(count2Text.value);

    const top = parseInt(optionTopText.value);
    const height = parseInt(optionHeightText.value);
    const width = parseInt(optionWidthText.value);

    topCountText.textContent = topCount;
    bottomCountText.textContent = bottomCount;

    updatePyramid(topCount, bottomCount, {top, height, width});
}

function updatePyramid(topCount, bottomCount, options) {
    const points = pyramid.getPoints(topCount, bottomCount, options);

    setPoints(topShape, points[0]);
    setPoints(bottomShape, points[1]);
}

function setPoints(polygon, points) {
    polygon.setAttribute('points', points.map(p => p.x + ',' + p.y).join(' '));
}