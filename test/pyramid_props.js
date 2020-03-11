const fc = require('fast-check');
const esmRequire = require('esm')(module)
const pyramid = esmRequire('../pyramid.js')
const { getPoints } = pyramid

describe('The triangle on top', () => {
    it('should have a horizontal base line', () => {
        assertTrianglePoints(trianglePoints => {
            const pA = trianglePoints[1];
            const pB = trianglePoints[2];
            return pA.y == pB.y;
        });
    });
});

describe('The polygon at the base', () => {
    describe('should be a trapezoid and therefore', () => {
        it('should have a horizontal top line', () => {
            assertTrapezoidPoints(polygonPoints => {
                const pA = polygonPoints[0];
                const pB = polygonPoints[1];
                return pA.y == pB.y;
            });
        });
        it('should have a horizontal bottom line', () => {
            assertTrapezoidPoints(polygonPoints => {
                const pC = polygonPoints[2];
                const pD = polygonPoints[3];
                return pC.y == pD.y;
            });
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
    })
})

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
