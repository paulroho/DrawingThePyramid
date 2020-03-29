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
    it('should have its tip at the provided option "top"', () => {
        assertTrianglePoints((trianglePoints, inputs) => {
            const tip = trianglePoints[0];

            return tip.y === inputs.top;
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
    it('should have a base with a width according to option "width"', () => {
        assertTrapezoidPoints((trapezoidPoints, inputs) => {
            const bottomRight = trapezoidPoints[2];
            const bottomLeft = trapezoidPoints[3];

            const width = bottomRight.x - bottomLeft.x;

            width.should.be.equal(inputs.width);
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

            const trapezoidPoints = points[1];
            const trapezoidTopRight = trapezoidPoints[1];
            const trapezoidBottomRight = trapezoidPoints[2];
            const trapezoidHeight = trapezoidBottomRight.y - trapezoidTopRight.y;
            const trapezoidDeltaX = trapezoidBottomRight.x - trapezoidTopRight.x;

            if (trapezoidHeight > 0) {
                const triangleSlant = triangleHeight / triangleDeltaX;
                const trapezoidSlant = trapezoidHeight / trapezoidDeltaX;
                trapezoidSlant.should.be.closeTo(triangleSlant, 2e-4);
            }
        });
    });
    it('should have areas reflecting the two numbers given', () => {
        assertPyramidPoints((points, inputs) => {
            const trianglePoints = points[0];
            const triangleArea = calculatePolygonArea(trianglePoints);

            const trapezoidPoints = points[1];
            const trapezoidArea = calculatePolygonArea(trapezoidPoints);

            const numberRatio = inputs.n2 / inputs.n1;
            const areaRatio = trapezoidArea / triangleArea; 

            if (numberRatio === 0) {
                areaRatio.should.be.equal(0);
            }
            else {
                (areaRatio/numberRatio).should.be.closeTo(1, 1e-4);
            }
        });
    });
    it('should have a total vertical extent according to option "height"', () => {
        assertPyramidPoints((points, inputs) => {
            const trianglePoints = points[0];
            const tip = trianglePoints[0];

            const trapezoidPoints = points[1];
            const bottom = trapezoidPoints[3];

            const height = bottom.y - tip.y;
            
            height.should.be.equal(inputs.height);
        });
    });
});

const pointsAreEqual = (p1, p2) => {
    return p1.x === p2.x && p1.y === p2.y;
};

const assertTrianglePoints = assertion => {
    return assertPyramidPoints((points, inputs) => assertion(points[0], inputs));
};

const assertTrapezoidPoints = assertion => {
    return assertPyramidPoints((points, inputs) => assertion(points[1], inputs));
};

const assertPyramidPoints = assertion => {
    return fc.assert(
        fc.property(
            fc.nat().map(n => n + 1), 
            fc.nat(), 
            fc.integer(0, 400),
            fc.integer(1, 400),
            fc.integer(1, 400),
            (n1, n2, top, height, width) => {
                const options = { top, height, width };
                const points = getPoints(n1, n2, options);

                const inputs = { n1, n2, top, height, width };
                return assertion(points, inputs);
            }
        )
        ,{verbose: true}
    );
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
