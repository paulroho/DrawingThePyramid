const fc = require('fast-check');
const esmRequire = require('esm')(module)
const pyramid = esmRequire('../pyramid.js')
const { getPoints } = pyramid

describe('The triangle on top', () => {
    it('should have a horizontal base line', () => {
        fc.assert(
            fc.property(
                fc.integer(), fc.integer(), (n1, n2) => {
                    const points = getPoints(n1, n2);
                    const trianglePoints = points[0];
                    const pA = trianglePoints[1];
                    const pB = trianglePoints[2];
                    return pA.y == pB.y;
                }
            )
        )
    });
});

describe('The polygon at the base', () => {
    describe('should be a trapezoid', () => {
        it('should have a horizontal top line', () => {
            fc.assert(
                fc.property(
                    fc.integer(), fc.integer(), (n1, n2) => {
                        const points = getPoints(n1, n2);
                        const polygonPoints = points[1];
                        const pA = polygonPoints[0];
                        const pB = polygonPoints[1];
                        return pA.y == pB.y;
                    }
                )
            )
        });
        it('should have a horizontal bottom line', () => {
            fc.assert(
                fc.property(
                    fc.integer(), fc.integer(), (n1, n2) => {
                        const points = getPoints(n1, n2);
                        const polygonPoints = points[1];
                        const pC = polygonPoints[2];
                        const pD = polygonPoints[3];
                        return pC.y == pD.y;
                    }
                )
            )
        });
    });
});
