import * as pyramid from "./pyramid.js";

export function startup() {
    wire();
    redraw();
}

// Form controls
const count2Input = document.getElementById('number-2');
const count1Input = document.getElementById('number-1');
const count0Input = document.getElementById('number-0');
const classification2Input = document.getElementById('classification-2');
const classification1Input = document.getElementById('classification-1');
const classification0Input = document.getElementById('classification-0');

const optionTopInput = document.getElementById('option-top');
const optionHeightInput = document.getElementById('option-height');
const optionWidthInput = document.getElementById('option-width');

const countInputs = [count0Input, count1Input, count2Input];
const classificationInputs = [classification0Input, classification1Input, classification2Input];

// Graphics elements
const shape2 = document.getElementById('shape-2');
const countText2 = shape2.getElementsByClassName('test-count')[0];
const classificationText2 = shape2.getElementsByClassName('test-classification')[0];
const polygon2 = shape2.getElementsByTagName('polygon')[0];

const shape1 = document.getElementById('shape-1');
const countText1 = shape1.getElementsByClassName('test-count')[0];
const classificationText1 = shape1.getElementsByClassName('test-classification')[0];
const polygon1 = shape1.getElementsByTagName('polygon')[0];

const shape0 = document.getElementById('shape-0');
const countText0 = shape0.getElementsByClassName('test-count')[0];
const classificationText0 = shape0.getElementsByClassName('test-classification')[0];
const polygon0 = shape0.getElementsByTagName('polygon')[0];

const polygons = [polygon0, polygon1, polygon2];
const countTexts = [countText0, countText1, countText2];
const classificationTexts = [classificationText0, classificationText1, classificationText2];

function wire() {
    classificationInputs[2].oninput = updateCaptions;
    classificationInputs[1].oninput = updateCaptions;
    classificationInputs[0].oninput = updateCaptions;

    countInputs[2].onchange = redraw;
    countInputs[1].onchange = redraw;
    countInputs[0].onchange = redraw;

    optionTopInput.onchange = redraw;
    optionHeightInput.onchange = redraw;
    optionWidthInput.onchange = redraw;
}

function updateCaptions() {
    classificationTexts[2].textContent = classificationInputs[2].value;
    classificationTexts[1].textContent = classificationInputs[1].value;
    classificationTexts[0].textContent = classificationInputs[0].value;
}

function redraw() {
    const count2 = parseInt(countInputs[2].value);
    const count1 = parseInt(countInputs[1].value);
    const count0 = parseInt(countInputs[0].value);

    const top = parseInt(optionTopInput.value);
    const height = parseInt(optionHeightInput.value);
    const width = parseInt(optionWidthInput.value);

    countTexts[2].textContent = count2;
    countTexts[1].textContent = count1;
    countTexts[0].textContent = count0;

    updatePyramid([count0, count1, count2], {top, height, width});
}

function updatePyramid(counts, options) {
    const slices = pyramid.getSlices(counts, options);

    updateSlices(slices, 2, .8);
    updateSlices(slices, 1, .8);
    updateSlices(slices, 0, .5);
}

function updateSlices(slices, idx, heightFactor) {
    const shapePoints = slices[idx];
    setPoints(polygons[idx], shapePoints);
    const positions = getTextPositions(shapePoints[0].y, shapePoints[2].y, heightFactor);
    countTexts[idx].setAttribute('y', positions.countY);
    classificationTexts[idx].setAttribute('y', positions.classificationY);
}

function getTextPositions(top, bottom, factor) {
    const countHeight = 60;
    const classificationHeight = 15;
    const height = bottom - top;
    const countRange = height - 40 - countHeight;
    return { 
        countY:          top + countHeight + factor * countRange,
        classificationY: bottom - classificationHeight
    };
}

function setPoints(polygon, points) {
    console.log(points);
    polygon.setAttribute('points', points.map(p => p.x + ',' + p.y).join(' '));
}