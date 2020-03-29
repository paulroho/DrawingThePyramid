const fc = require('fast-check');
const should = require('chai').should();
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

            const leftBase = tip.x - bottomLeft.x;
            const rightBase = bottomRight.x - tip.x;

            leftBase.should.be.closeTo(rightBase, 1e-6);
        });
    });
    it('should have its tip at the provided top option', () => {
        assertTrianglePoints((trianglePoints, options) => {
            const tip = trianglePoints[0];

            return tip.y === options.top;
        });
    });
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

            const leftBase = topLeft.x - bottomLeft.x;
            const rightBase = bottomRight.x - topRight.x;

            leftBase.should.be.closeTo(rightBase, 1e-6);
        });
    });
});

describe('The triangle and the trapezoid', () => {
    it('should be perfectly stacked', () => {
        assertPyramidPoints((points, options) => {
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
        assertPyramidPoints((points, options) => {
            const trianglePoints = points[0];
            const triangleTip = trianglePoints[0];
            const triangleBottomRight = trianglePoints[2];
            const triangleHeight = triangleBottomRight.y - triangleTip.y;
            const triangleDeltaX = triangleBottomRight.x - triangleTip.x;

            const trapezoidPoints = points[1];
            const trapezoidTopRight = trapezoidPoints[1];
            const trapezoidBottomRight = trapezoidPoints[2];
            const trapezoidHeight = trapezoidBottomRight.y - trapezoidTopRight.y;
            const trapezoidDeltaX = trapezoidBottomRight.x - trapezoidTopRight.x;

            if (trapezoidHeight > 0) {
                const triangleSlant = triangleHeight / triangleDeltaX;
                const trapezoidSlant = trapezoidHeight / trapezoidDeltaX;
                trapezoidSlant.should.be.closeTo(triangleSlant, 1e-5);
            }
        });
    });
    it('should have areas reflecting the two numbers given', () => {
        return fc.assert(
            fc.property(
                fc.nat().map(n => n + 1), fc.nat(), fc.integer(0, 400), (n1, n2, top) => {
                    const options = {top};
                    const points = getPoints(n1, n2, options);

                    const trianglePoints = points[0];
                    const triangleArea = calculatePolygonArea(trianglePoints);

                    const trapezoidPoints = points[1];
                    const trapezoidArea = calculatePolygonArea(trapezoidPoints);

                    const numberRatio = n2 / n1;
                    const areaRatio = trapezoidArea / triangleArea; 

                    if (numberRatio === 0) {
                        areaRatio.should.be.equal(0);
                    }
                    else {
                        (areaRatio/numberRatio).should.be.closeTo(1, 1e-6);
                    }
                }
            )
        );
    });
});

const pointsAreEqual = (p1, p2) => {
    return p1.x === p2.x && p1.y === p2.y;
};

const assertPyramidPoints = assertion => {
    return fc.assert(
        fc.property(
            fc.nat().map(n => n + 1), 
            fc.nat(), 
            fc.integer(0, 400),
            (n1, n2, top) => {
                const options = { top: top};
                const points = getPoints(n1, n2, options);
                return assertion(points, options);
            }
        )
    );
};

const assertTrianglePoints = assertion => {
    return assertPyramidPoints((points, options) => assertion(points[0], options));
};

const assertTrapezoidPoints = assertion => {
    return assertPyramidPoints((points, options) => assertion(points[1], options));
};

const calculatePolygonArea = vertices => {
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
