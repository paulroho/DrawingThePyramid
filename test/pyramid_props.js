const fc = require('fast-check');
const should = require('chai').should();
const esmRequire = require('esm')(module)
const pyramid = esmRequire('../pyramid.js')
const { getPoints } = pyramid

describe('getPoints', () => {
    it('should return the same number of elements as counts provided', () => {
        assertEachSlice((slices, inputs) => {
            slices.should.have.lengthOf(inputs.counts.length);
        });
    });
});

describe('Each slice', () => {
    it('should have 4 vertices', () => {
        assertEachSlice(slices => {
            slices.forEach(slice => {
                slice.should.have.lengthOf(4);
            });
        });
    });
    it('should have a horizontal top line', () => {
        assertEachSlice(slices => {
            slices.forEach(slice => {
                const topLeft = slice[0];
                const topRight = slice[1];

                return topLeft.y == topRight.y;
            });
        });
    });
    it('should have a horizontal base line', () => {
        assertEachSlice(slices => {
            slices.forEach(slice => {
                const bottomRight = slice[2];
                const bottomLeft = slice[3];

                return bottomRight.y == bottomLeft.y;
            });
        });
    });
    it('should be isosceles', () => {
        assertEachSlice(slices => {
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

describe('The top trapezoid', () => {
    it('should form a triangle', () => {
        assertTopTrapezoid(trianglePoints => {
            const topLeft = trianglePoints[0];
            const topRight = trianglePoints[1];

            pointsAreEqual(topLeft, topRight).should.be.true;
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

            const n0 = inputs.counts[0];
            const n1 = inputs.counts[1];
            const numberRatio = n1 / n0;
            const areaRatio = triangleArea / trapezoidArea;

            if (numberRatio === 0) {
                areaRatio.should.be.equal(0);
            }
            else {
                (areaRatio / numberRatio).should.be.closeTo(1, 1e-4);
            }
        });
    });
});

describe('The final pyramid respects the provided options and therefore', () => {
    it('should have its tip at the option "top"', () => {
        assertTopTrapezoid((trianglePoints, inputs) => {
            const tip = trianglePoints[0];

            return tip.y === inputs.top;
        });
    });
    it('should have a total vertical extent according to option "height"', () => {
        assertPyramidPoints((points, inputs) => {
            const topIndex = inputs.counts.length - 1;
            const topSlicePoints = points[topIndex];
            const tip = topSlicePoints[0];

            const bottomSlicePoints = points[0];
            const bottom = bottomSlicePoints[3];

            const height = bottom.y - tip.y;

            height.should.be.equal(inputs.height);
        });
    });
    it('should have a base with a width according to option "width"', () => {
        assertBottomTrapezoid((trapezoidPoints, inputs) => {
            const bottomRight = trapezoidPoints[2];
            const bottomLeft = trapezoidPoints[3];

            const width = bottomRight.x - bottomLeft.x;

            width.should.be.equal(inputs.width);
        });
    });
});

const pointsAreEqual = (p1, p2) => {
    return p1.x === p2.x && p1.y === p2.y;
};

const assertTopTrapezoid = assertion => {
    return assertPyramidPoints((points, inputs) => {
        const topIndex = inputs.counts.length - 1;
        return assertion(points[topIndex], inputs);
    });
};

const assertBottomTrapezoid = assertion => {
    return assertPyramidPoints((points, inputs) => assertion(points[0], inputs));
};

const assertPyramidPoints = assertion => {
    return assertEachSlice(assertion);
};

const assertEachSlice = assertion => {
    return fc.assert(
        fc.property(
            fc.array(fc.nat(), 2, 2),
            fc.integer(0, 400),
            fc.integer(1, 400),
            fc.integer(1, 400),
            (counts, top, height, width) => {
                const options = { top, height, width };
                if (counts[0] === 0) {  // TODO: Just ensure that at least one of the elements is !== 0
                    counts[0] = 1;
                }
                const points = getPoints(counts, options);

                const inputs = { counts, top, height, width };
                return assertion(points, inputs);
            }
        )
        //, { seed: 600009183, path: "4:0:0:0:0", endOnFailure: true }
        // ,{verbose: true}
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
