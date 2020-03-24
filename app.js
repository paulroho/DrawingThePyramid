import * as pyramid from "./pyramid.js";

export function startup() {
    wire();
    redraw();
}

const n1Text = document.getElementById('n1');
const n2Text = document.getElementById('n2');

const topPart = document.getElementById('part-top');
const topCountText = topPart.getElementsByClassName('test-count')[0];
const topShape = topPart.getElementsByTagName('polygon')[0];
const bottomPart = document.getElementById('part-bottom');
const bottomCountText = bottomPart.getElementsByClassName('test-count')[0];
const bottomShape = bottomPart.getElementsByTagName('polygon')[0];

function wire() {
    n1Text.onchange = redraw;
    n2Text.onchange = redraw;
}

function redraw() {
    const topCount = parseInt(n1Text.value);
    const bottomCount = parseInt(n2Text.value);

    updatePyramid(topCount, bottomCount);
}

function updatePyramid(topCount, bottomCount) {
    topCountText.textContent = topCount;
    bottomCountText.textContent = bottomCount;

    const points = pyramid.getPoints(topCount, bottomCount);

    setPoints(topShape, points[0]);
    setPoints(bottomShape, points[1]);
}

function setPoints(polygon, points) {
    polygon.setAttribute('points', points.map(p => p.x + ',' + p.y).join(' '));
}