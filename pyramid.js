export function getPoints(topCount, bottomCount) {
    const f = Math.sqrt(topCount / (topCount + bottomCount));
    const b = 400;
    const h = 400;

    const n = h * f;
    const c = b * f;

    return [
        [
            { x: 0, y: 50 },
            { x: -c / 2, y: 50 + n },
            { x: +c / 2, y: 50 + n }
        ],
        [
            { x: -c / 2, y: 50 + n },
            { x: +c / 2, y: 50 + n },
            { x: +200, y: 450 },
            { x: -200, y: 450 }
        ]
    ];
}
