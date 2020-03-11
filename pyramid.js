'use strict';

(function (doc) {
    const n1Text = doc.getElementById('n1');
    const n2Text = doc.getElementById('n2');

    const topPart = doc.getElementById('part-top');
    const topCountText = topPart.getElementsByClassName('test-count')[0];
    const topShape = topPart.getElementsByTagName('polygon')[0];
    const bottomPart = doc.getElementById('part-bottom');
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

        function updatePyramid(topCount, bottomCount) {
            topCountText.textContent = topCount;
            bottomCountText.textContent = bottomCount;

            const points = getPoints(topCount, bottomCount);

            topShape.setAttribute('points', toPointsAttribute(points[0]));
            bottomShape.setAttribute('points', toPointsAttribute(points[1]));
        }
    }

    function toPointsAttribute( points) {
        return points.map(p => p.x + ',' + p.y).join(' ');
    };

    function getPoints(topCount, bottomCount) {
        // TODO Implement here
        return [
            [
                { x: 250, y: 50 },
                { x: 150, y: 250 },
                { x: 350, y: 250 }
            ],
            [
                { x: 150, y: 250 },
                { x: 350, y: 250 },
                { x: 450, y: 450 },
                { x: 50, y: 450 }
            ]
        ];
    }
    
    wire();
    redraw();
})(document);
