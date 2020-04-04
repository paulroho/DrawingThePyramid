export function getPoints(counts, options) {
    return getPointsForTwoParts(counts[0], counts[1], options);
}

function getPointsForTwoParts(topCount, bottomCount, options) {
    const f = Math.sqrt(topCount / (topCount + bottomCount));

    const top = options.top;
    const width = options.width;
    const height = options.height;

    const n = height * f;
    const c = width * f;

    return [
        [
            { x: 0,      y: top },
            { x: -c / 2, y: top + n },
            { x: +c / 2, y: top + n }
        ],
        [
            { x: -c / 2,     y: top + n },
            { x: +c / 2,     y: top + n },
            { x: +width / 2, y: top + height },
            { x: -width / 2, y: top + height }
        ]
    ];
}
