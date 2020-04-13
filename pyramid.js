export function getPoints(counts, options) {
    if (counts.length === 1) {
        return [
            [
                { x: 0, y: options.top },
                { x: 0, y: options.top },
                { x: +options.width / 2, y: options.top + options.height },
                { x: -options.width / 2, y: options.top + options.height }
            ]
        ];
    }

    let slices = [];

    let i = 0;
    let localWidth = options.width;
    let localHeight = options.height;
    let twoPartPoints;

    while (i < counts.length - 1) {
        const bottomCount = counts[i];
        const topCount = sum(counts.slice(i + 1, counts.length));
        const localOptions = {
            top: options.top,
            width: localWidth,
            height: localHeight
        };
        twoPartPoints = getPointsForTwoParts(bottomCount, topCount, localOptions);

        const localBottomSlice = twoPartPoints[0];
        slices.push(localBottomSlice);

        localHeight -= (localBottomSlice[2].y - localBottomSlice[1].y);
        localWidth = (localBottomSlice[1].x - localBottomSlice[0].x);

        i++;
    }

    const topMostSlice = twoPartPoints[1];
    slices.push(topMostSlice);

    return slices;
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

let sum = arr => arr.reduce((a, b) => a + b, 0);
