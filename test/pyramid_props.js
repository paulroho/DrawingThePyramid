const fc = require('fast-check');
const should = require('chai').should();
const esmRequire = require('esm')(module)
const pyramid = esmRequire('../pyramid.js')
const { getPoints } = pyramid

describe('The triangle on top', () => {
    // it('should have 3 vertices', () => {
    //     assertTrianglePoints(trianglePoints => {
    //         return trianglePoints.length === 3;
    //     });
    // });
    // it('should be isosceles', () => {
    //     assertTrianglePoints(trianglePoints => {
    //         const tip = trianglePoints[0];
    //         const bottomLeft = trianglePoints[1];
    //         const bottomRight = trianglePoints[2];

    //         const leftBase = tip.x - bottomLeft.x;
    //         const rightBase = bottomRight.x - tip.x;

    //         leftBase.should.be.closeTo(rightBase, 1e-6);
    //     });
    // })
});


const assertTrianglePoints = assertion => {
    return assertPyramidPoints(points => assertion(points[0]));
};

const assertPyramidPoints = assertion => {
    return fc.assert(
        fc.property(
            fc.nat().map(n => n + 1), fc.nat(), (n1, n2) => {
                const points = getPoints(n1, n2);
                return assertion(points);
            }
        )
    );
};
