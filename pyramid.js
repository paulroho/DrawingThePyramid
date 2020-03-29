export function getPoints(topCount, bottomCount, options) {
    const f = Math.sqrt(topCount / (topCount + bottomCount));
    const b = 400;
    const h = 400;

    const n = h * f;
    const c = b * f;

    return [
        [
            { x: 0,      y: options.top },
            { x: -c / 2, y: options.top + n },
            { x: +c / 2, y: options.top + n }
        ],
        [
            { x: -c / 2, y: options.top + n },
            { x: +c / 2, y: options.top + n },
            { x: +200,   y: options.top + 400 },
            { x: -200,   y: options.top + 400 }
        ]
    ];
}
