const fc = require('fast-check');
const should = require('chai').should();
const esmRequire = require('esm')(module)
const pyramid = esmRequire('../pyramid.js')
const { getPoints } = pyramid

describe('getPoints', () => {
    it('should return the same number of elements as counts provided', () => {
        assertEachSlice((counts, slices) => {
            slices.should.have.lengthOf(counts.length);
        });
    });
});

describe('Each slice', () => {
    it('should have 4 vertices', () => {
        assertEachSlice((counts, slices) => {
            slices.forEach(slice => {
                slice.should.have.lengthOf(4);
            });
        });
    });
    it('should have a horizontal top line', () => {
        assertEachSlice((counts, slices) => {
            slices.forEach(slice => {
                const topLeft = slice[0];
                const topRight = slice[1];

                return topLeft.y == topRight.y;
            });
        });
    });
    it('should have a horizontal base line', () => {
        assertEachSlice((counts, slices) => {
            slices.forEach(slice => {
                const bottomRight = slice[2];
                const bottomLeft = slice[3];

                return bottomRight.y == bottomLeft.y;
            });
        });
    });
    it('should be isosceles', () => {
        assertEachSlice((counts, slices) => {
            slices.forEach(slice => {
                const topLeft = slice[0];
                const topRight = slice[1];
                const bottomRight = slice[2];
                const bottomLeft = slice[3];

                const leftBase = topLeft.x - bottomLeft.x;
                const rightBase = bottomRight.x - topRight.x;

                leftBase.should.be.closeTo(rightBase, 1e-6);
            });
        });
    });
});

describe('The trapezoid on top', () => {
    it('should form a triangle', () => {
        assertTrianglePoints(trianglePoints => {
            const topLeft = trianglePoints[0];
            const topRight = trianglePoints[1];

            pointsAreEqual(topLeft, topRight).should.be.true;
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
    it('should have a base with a width according to option "width"', () => {
        assertTrapezoidPoints((trapezoidPoints, inputs) => {
            const bottomRight = trapezoidPoints[2];
            const bottomLeft = trapezoidPoints[3];

            const width = bottomRight.x - bottomLeft.x;

            width.should.be.equal(inputs.width);
        });
    });
});

describe('The two trapezoids', () => {
    it('FORALL SLICES (TODO): should be perfectly stacked', () => {
        assertPyramidPoints(points => {
            const trianglePoints = points[1];
            const triangleBottomRight = trianglePoints[2];
            const triangleBottomLeft = trianglePoints[3];

            const trapezoidPoints = points[0];
            const trapezoidTopLeft = trapezoidPoints[0];
            const trapezoidTopRight = trapezoidPoints[1];

            return pointsAreEqual(triangleBottomLeft, trapezoidTopLeft) &&
                pointsAreEqual(triangleBottomRight, trapezoidTopRight);
        });
    });
    it('FORALL SLICES (TODO): should have the same slant', () => {
        assertPyramidPoints(points => {
            const trianglePoints = points[1];
            const triangleTip = trianglePoints[0];
            const triangleBottomRight = trianglePoints[2];
            const triangleHeight = triangleBottomRight.y - triangleTip.y;
            const triangleDeltaX = triangleBottomRight.x - triangleTip.x;

            const trapezoidPoints = points[0];
            const trapezoidTopRight = trapezoidPoints[1];
            const trapezoidBottomRight = trapezoidPoints[2];
            const trapezoidHeight = trapezoidBottomRight.y - trapezoidTopRight.y;
            const trapezoidDeltaX = trapezoidBottomRight.x - trapezoidTopRight.x;

            if (triangleHeight > 0) {
                const triangleSlant = triangleHeight / triangleDeltaX;
                const trapezoidSlant = trapezoidHeight / trapezoidDeltaX;
                trapezoidSlant.should.be.closeTo(triangleSlant, 2e-4);
            }
        });
    });
    it('FORALL SLICES (TODO): should have areas reflecting the two numbers given', () => {
        assertPyramidPoints((points, inputs) => {
            const trianglePoints = points[1];
            const triangleArea = calculatePolygonArea(trianglePoints);

            const trapezoidPoints = points[0];
            const trapezoidArea = calculatePolygonArea(trapezoidPoints);

            const numberRatio = inputs.n1 / inputs.n0;
            const areaRatio = triangleArea / trapezoidArea;

            if (numberRatio === 0) {
                areaRatio.should.be.equal(0);
            }
            else {
                (areaRatio / numberRatio).should.be.closeTo(1, 1e-4);
            }
        });
    });
    it('should have a total vertical extent according to option "height"', () => {
        assertPyramidPoints((points, inputs) => {
            const trianglePoints = points[1];
            const tip = trianglePoints[0];

            const trapezoidPoints = points[0];
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
    return assertPyramidPoints((points, inputs) => assertion(points[1], inputs));
};

const assertTrapezoidPoints = assertion => {
    return assertPyramidPoints((points, inputs) => assertion(points[0], inputs));
};

const assertPyramidPoints = assertion => {
    return fc.assert(
        fc.property(
            fc.nat().map(n => n + 1),
            fc.nat(),
            fc.integer(0, 400),
            fc.integer(1, 400),
            fc.integer(1, 400),
            (n0, n1, top, height, width) => {
                const options = { top, height, width };
                const points = getPoints([n0, n1], options);

                const inputs = { n0, n1, top, height, width };
                return assertion(points, inputs);
            }
        )
        //, { seed: 600009183, path: "4:0:0:0:0", endOnFailure: true }
        // ,{verbose: true}
    );
};

const assertEachSlice = assertion => {
    return fc.assert(
        fc.property(
            fc.array(fc.nat().map(i => i + 1), 1, 5), (counts) => {
                const someConfig = { top: 0, width: 100, height: 100 };
                const points = pyramid.getPoints(counts, someConfig);
                assertion(counts, points);
            }
        )
        , { seed: -962072222, path: "2:1:1:2:2", endOnFailure: true }
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
