export function getPoints(topCount, bottomCount) {
    const f = Math.sqrt(topCount / (topCount + bottomCount));
    const b = 400;
    const h = 400;
    const mid = 250;

    const n = h * f;
    const c = b * f;

    // TODO Implement here
    return [
        [
            { x: mid, y: 50 },
            { x: mid - c / 2, y: 50 + n },
            { x: mid + c / 2, y: 50 + n }
        ],
        [
            { x: mid - c / 2, y: 50 + n },
            { x: mid + c / 2, y: 50 + n },
            { x: mid + 200, y: 450 },
            { x: mid - 200, y: 450 }
        ]
    ];
}
