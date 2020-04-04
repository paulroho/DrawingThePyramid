import * as pyramid from "./pyramid.js";

export function startup() {
    wire();
    redraw();
}

// Form controls
const count1Input = document.getElementById('number-1');
const count2Input = document.getElementById('number-2');
const classification1Input = document.getElementById('classification-1');
const classification2Input = document.getElementById('classification-2');

const optionTopInput = document.getElementById('option-top');
const optionHeightInput = document.getElementById('option-height');
const optionWidthInput = document.getElementById('option-width');

const countInputs = [count1Input, count2Input];
const classificationInputs = [classification1Input, classification2Input];

// Graphics elements
const topPart = document.getElementById('part-top');
const topCountText = topPart.getElementsByClassName('test-count')[0];
const topClassificationText = topPart.getElementsByClassName('test-classification')[0];
const topShape = topPart.getElementsByTagName('polygon')[0];

const bottomPart = document.getElementById('part-bottom');
const bottomCountText = bottomPart.getElementsByClassName('test-count')[0];
const bottomClassificationText = bottomPart.getElementsByClassName('test-classification')[0];
const bottomShape = bottomPart.getElementsByTagName('polygon')[0];

const polygons = [topShape, bottomShape];
const countTexts = [topCountText, bottomCountText];
const classificationTexts = [topClassificationText, bottomClassificationText];

function wire() {
    classificationInputs[0].oninput = updateCaptions;
    classificationInputs[1].oninput = updateCaptions;

    countInputs[0].onchange = redraw;
    countInputs[1].onchange = redraw;

    optionTopInput.onchange = redraw;
    optionHeightInput.onchange = redraw;
    optionWidthInput.onchange = redraw;
}

function updateCaptions() {
    classificationTexts[0].textContent = classificationInputs[0].value;
    classificationTexts[1].textContent = classificationInputs[1].value;
}

function redraw() {
    const count1 = parseInt(countInputs[0].value);
    const count2 = parseInt(countInputs[1].value);

    const top = parseInt(optionTopInput.value);
    const height = parseInt(optionHeightInput.value);
    const width = parseInt(optionWidthInput.value);

    countTexts[0].textContent = count1;
    countTexts[1].textContent = count2;

    updatePyramid(count1, count2, {top, height, width});
}

function updatePyramid(count1, count2, options) {
    const points = pyramid.getPoints([count1, count2], options);

    updateShape(points, 0, .8);
    updateShape(points, 1, .5);
}

function updateShape(points, idx, heightFactor) {
    const shapePoints = points[idx];
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
    polygon.setAttribute('points', points.map(p => p.x + ',' + p.y).join(' '));
}