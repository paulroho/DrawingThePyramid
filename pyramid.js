export function getPoints(counts, options) {
    const slices = [];
    let i = 0;

    let remainderDimensions = {
        top: options.top,
        width: options.width,
        height: options.height
    };

    while (i < counts.length - 1) {
        const sliceCount = counts[i];
        const remainderCount = sum(counts.slice(i + 1, counts.length));

        const sliceInfo = calculateSlice(sliceCount, remainderCount, remainderDimensions);

        slices.push(sliceInfo.points);
        remainderDimensions = sliceInfo.remainderDimensions;

        i++;
    }

    const topMostSlice = [
        { x: 0, y: options.top },
        { x: 0, y: options.top },
        { x: +remainderDimensions.width / 2, y: options.top + remainderDimensions.height },
        { x: -remainderDimensions.width / 2, y: options.top + remainderDimensions.height }
    ];
    slices.push(topMostSlice);

    return slices;
}

function calculateSlice(sliceCount, remainderCount, dimensions) {
    let f = 1.0;
    if (remainderCount + sliceCount > 0) {
        f = Math.sqrt(remainderCount / (remainderCount + sliceCount));
    }

    const top = dimensions.top;
    const width = dimensions.width;
    const height = dimensions.height;

    const remainingHeight = height * f;
    const remainingWidth = width * f;

    return {
        points: [
            { x: -remainingWidth / 2, y: top + remainingHeight },
            { x: +remainingWidth / 2, y: top + remainingHeight },
            { x: +width / 2,          y: top + height },
            { x: -width / 2,          y: top + height }
        ],
        remainderDimensions: {
            width: remainingWidth,
            top: top,
            height: remainingHeight
        }
    };
}

let sum = arr => arr.reduce((a, b) => a + b, 0);
