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
    it('should have an area proportional to the share of its count', () => {
        assertEachSlice((slices, inputs) => {
            const totalCount = sum(inputs.counts);
            const totalArea = inputs.width * inputs.height / 2;

            for (let i=0; i<slices.length; i++) {
                const slice = slices[i];
                const count = inputs.counts[i];
                const sliceArea = calculatePolygonArea(slice);

                const countRatio = count/totalCount;
                const areaRatio = sliceArea/totalArea;

                if (countRatio === 0) {
                    areaRatio.should.be.equal(0);
                }
                else {
                    (areaRatio / countRatio).should.be.closeTo(1, 1e-4);
                }
            }
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

describe('Neighbouring slices', () => {
    it('should be perfectly stacked', () => {
        const eps = 1e-13;
        assertNeighbouringSlices((bottomNghbPoints, topNghbPoints) => {
            const topNghbBottomRight = topNghbPoints[2];
            const topNghbBottomLeft = topNghbPoints[3];

            const bottomNghbTopLeft = bottomNghbPoints[0];
            const bottomNghbTopRight = bottomNghbPoints[1];

            return pointsAreEqual(topNghbBottomLeft, bottomNghbTopLeft, eps) &&
                   pointsAreEqual(topNghbBottomRight, bottomNghbTopRight, eps);
        });
    });
    it('should have the same slant', () => {
        assertNeighbouringSlices((bottomNghbPoints, topNghbPoints) => {
            const topNghbTopRight = topNghbPoints[1];
            const topNghbBottomRight = topNghbPoints[2];
            const topNghbDeltaX = topNghbBottomRight.x - topNghbTopRight.x;
            const topNghbHeight = topNghbBottomRight.y - topNghbTopRight.y;

            const bottomNghbTopRight = bottomNghbPoints[1];
            const bottomNghbBottomRight = bottomNghbPoints[2];
            const bottomNghbDeltaX = bottomNghbBottomRight.x - bottomNghbTopRight.x;
            const bottomNghbHeight = bottomNghbBottomRight.y - bottomNghbTopRight.y;

            if (topNghbHeight > 0) {
                const topNghbSlant = topNghbHeight / topNghbDeltaX;
                const bottomNghbSlant = bottomNghbHeight / bottomNghbDeltaX;
                bottomNghbSlant.should.be.closeTo(topNghbSlant, 2e-4);
            }
        });
    });
});

describe('The final pyramid (respects the provided options and therefore)', () => {
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

const pointsAreEqual = (p1, p2, eps) => {
    if (typeof(eps) === 'undefined') {
        eps = 0;
    }

    const xEq = Math.abs(p1.x - p2.x) <= eps;
    const yEq = Math.abs(p1.y - p2.y) <= eps;

    return xEq && yEq;
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
            fc.array(fc.nat(), 1, 2),
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
        // , { seed: 1632958045, path: "0:1:0:0:0:0", endOnFailure: true }
        // ,{verbose: true}
    );
};

const assertNeighbouringSlices = assertion => {
    return fc.assert(
        fc.property(
            fc.array(fc.nat(), 1, 2),
            fc.integer(0, 400),
            fc.integer(1, 400),
            fc.integer(1, 400),
            (counts, top, height, width) => {
                const options = { top, height, width };
                if (counts[0] === 0) {  // TODO: Just ensure that at least one of the elements is !== 0
                    counts[0] = 1;
                }
                const points = getPoints(counts, options);

                let assertionIsOk = true;
                for (let i=0; i<counts.length-1; i++) {
                    const bottomNghbPoints = points[i];
                    const topNghbPoints = points[i+1];
                    const bottomCount = counts[i];
                    const topCount = counts[i+1];

                    const isOk = assertion(bottomNghbPoints, topNghbPoints, bottomCount, topCount);
                    assertionIsOk = assertionIsOk && isOk;
                }

                return assertionIsOk;
            }
        )
        // , { seed: -797397304, path: "6:2:0:0:0:1:0:0:0:0:0:0:0:0:0:0:0:0:0:0:1:0:0:0:1:6:2:3:6:4:6:9:5:2:5:3:10:18", endOnFailure: true }
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

let sum = arr => arr.reduce((a, b) => a + b, 0);
