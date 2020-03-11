export function getPoints(topCount, bottomCount) {
    // TODO Implement here
    return [
        [
            { x: 250 + (Math.random()*200-100), y: 50 },
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
