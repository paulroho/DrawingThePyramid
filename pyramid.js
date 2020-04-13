export function getPoints(counts, options) {
    if (counts.length === 1) {
        return [
            [
                { x: 0,                y: options.top },
                { x: 0,                y: options.top },
                { x: +options.width/2, y: options.top + options.height },
                { x: -options.width/2, y: options.top + options.height }
            ]
        ];
    }

    const originalLength = counts.length;

    const twoPartPoints = getPointsForTwoParts(counts[0], counts[1], options);

    while (twoPartPoints.length > originalLength) {
        twoPartPoints.pop();
    }
    while (twoPartPoints.length < originalLength) {
        twoPartPoints.push(twoPartPoints[0]);
    }
    return twoPartPoints;
}

function getPointsForTwoParts(bottomCount, topCount, options) {
    const f = Math.sqrt(topCount / (topCount + bottomCount));

    const top = options.top;
    const width = options.width;
    const height = options.height;

    const n = height * f;
    const c = width * f;

    return [
        [
            { x: -c / 2, y: top + n },
            { x: +c / 2, y: top + n },
            { x: +width / 2, y: top + height },
            { x: -width / 2, y: top + height }
        ],
        [
            { x: 0, y: top },
            { x: 0, y: top },
            { x: +c / 2, y: top + n },
            { x: -c / 2, y: top + n }
        ]
    ];
}
