const fc = require('fast-check');
const esmRequire = require('esm')(module)
const pyramid = esmRequire('../pyramid.js')
const { getPoints } = pyramid

fc.configureGlobal({ numRuns: 10 });

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
            return Math.abs((tip.x - bottomLeft.x) - (bottomRight.x - tip.x)) < 1e-6;
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
            return Math.abs((topLeft.x - bottomLeft.x) - (bottomRight.x - topRight.x)) < 1e-6;
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

            return Math.abs(triangleHeight * trapezoidDeltaX - trapezoidHeight * triangleDeltaX) < 1e-7;
            // return triangleHeight/triangleDeltaX === trapezoidHeight/trapezoidDeltaX;
        });
    });
    it('should have areas reflecting the two numbers given', () => {
        return fc.assert(
            fc.property(
                fc.nat(), fc.nat(), (n1, n2) => {
                    const points = getPoints(n1, n2);

                    const trianglePoints = points[0];
                    const triangleArea = calcPolygonArea(trianglePoints);

                    const trapezoidPoints = points[1];
                    const trapezoidArea = calcPolygonArea(trapezoidPoints);

                    console.log('----');
                    console.log(n2 / n1);
                    console.log(trapezoidArea / triangleArea);
                    return Math.abs(n2 / n1 - trapezoidArea / triangleArea) < 1e-7;
                }
            )
        );
    });
});

const pointsAreEqual = (p1, p2) => {
    return p1.x === p2.x && p1.y === p2.y;
};

const assertPyramidPoints = (assertion) => {
    return fc.assert(
        fc.property(
            fc.integer(1, 10000), fc.nat(), (n1, n2) => {
                console.log('n1: ' + n1 + ', n2: ' + n2);
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

const calcPolygonArea = (vertices) => {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
        var addX = vertices[i].x;
        var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
        var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
        var subY = vertices[i].y;

        total += (addX * addY * 0.5);
        total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
};