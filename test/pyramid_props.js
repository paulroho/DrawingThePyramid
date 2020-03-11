const fc = require('fast-check');
const esmRequire = require('esm')(module)
const pyramid = esmRequire('../pyramid.js')
const { getPoints } = pyramid

describe('The triangle on top', () => {
    it('should have 3 vertices', () => {
        assertTrianglePoints(trianglePoints => {
            return trianglePoints.length === 3;
        });
    });
    it('should have a horizontal base line', () => {
        assertTrianglePoints(trianglePoints => {
            const bottomLeft = trianglePoints[1];
            const bottomRight = trianglePoints[2];
            return bottomLeft.y === bottomRight.y;
        });
    });
    it('should be isosceles', () => {
        assertTrianglePoints(trianglePoints => {
            const tip = trianglePoints[0];
            const bottomLeft = trianglePoints[1];
            const bottomRight = trianglePoints[2];
            return tip.x - bottomLeft.x === bottomRight.x - tip.x;
        });
    })
});

describe('The trapezoid at the base', () => {
    it('should have 4 vertices', () => {
        assertTrapezoidPoints(trapezoidPoints => {
            return trapezoidPoints.length === 4;
        });
    });
    it('should have a horizontal top line', () => {
        assertTrapezoidPoints(trapezoidPoints => {
            const topLeft = trapezoidPoints[0];
            const topRight = trapezoidPoints[1];
            return topLeft.y == topRight.y;
        });
    });
    it('should have a horizontal bottom line', () => {
        assertTrapezoidPoints(trapezoidPoints => {
            const bottomRight = trapezoidPoints[2];
            const bottomLeft = trapezoidPoints[3];
            return bottomRight.y == bottomLeft.y;
        });
    });
    it('should be isosceles', () => {
        assertTrapezoidPoints(trapezoidPoints => {
            const topLeft = trapezoidPoints[0];
            const topRight = trapezoidPoints[1];
            const bottomRight = trapezoidPoints[2];
            const bottomLeft = trapezoidPoints[3];
            return topLeft.x - bottomLeft.x == bottomRight.x - topRight.x;
        });
    });
});

describe('The triangle and the trapezoid', () => {
    it('should be perfectly stacked', () => {
        assertPyramidPoints(points => {
            const trianglePoints = points[0];
            const triangleBottomLeft = trianglePoints[1];
            const triangleBottomRight = trianglePoints[2];

            const trapezoidPoints = points[1];
            const trapezoidTopLeft = trapezoidPoints[0];
            const trapezoidTopRight = trapezoidPoints[1];

            return pointsAreEqual(triangleBottomLeft, trapezoidTopLeft) &&
                pointsAreEqual(triangleBottomRight, trapezoidTopRight);
        });
    });
    it('should have the same slant', () => {
        assertPyramidPoints(points => {
            const trianglePoints = points[0];
            const triangleTip = trianglePoints[0];
            const triangleBottomRight = trianglePoints[2];
            const triangleHeight = triangleBottomRight.y - triangleTip.y;
            const triangleDeltaX = triangleBottomRight.x - triangleTip.x;
            // console.log('Triangle: ' + triangleHeight + ', ' + triangleDeltaX + ': ' + triangleHeight/triangleDeltaX);

            const trapezoidPoints = points[1];
            const trapezoidTopRight = trapezoidPoints[1];
            const trapezoidBottomRight = trapezoidPoints[2];
            const trapezoidHeight = trapezoidBottomRight.y - trapezoidTopRight.y;
            const trapezoidDeltaX = trapezoidBottomRight.x - trapezoidTopRight.x;
            // console.log('Trapezoid: ' + trapezoidHeight + ', ' + trapezoidDeltaX + ': ' + trapezoidHeight/trapezoidDeltaX);

            return triangleHeight * trapezoidDeltaX === trapezoidHeight * triangleDeltaX;
            // return triangleHeight/triangleDeltaX === trapezoidHeight/trapezoidDeltaX;
        });
    });
});

const pointsAreEqual = (p1, p2) => {
    return p1.x === p2.x && p1.y === p2.y;
};

const assertPyramidPoints = (assertion) => {
    return fc.assert(
        fc.property(
            fc.integer(), fc.integer(), (n1, n2) => {
                const points = getPoints(n1, n2);
                return assertion(points);
            }
        )
    );
};

const assertTrianglePoints = (assertion) => {
    return assertPyramidPoints(points => {
        return assertion(points[0]);
    });
};

const assertTrapezoidPoints = (assertion) => {
    return assertPyramidPoints(points => {
        return assertion(points[1]);
    });
};
