import { Vector3 } from './Vector3';
import { PMath } from './Math';

// https://github.com/mourner/simplify-js/blob/3d/simplify.js

function getSquareDistance( p1, p2 ) {

    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;

    return dx * dx + dy * dy + dz * dz;

}

function getSquareSegmentDistance( p, p1, p2 ) {

    let x = p1.x;
    let y = p1.y;
    let z = p1.z;

    let dx = p2.x - x;
    let dy = p2.y - y;
    let dz = p2.z - z;

    if ( dx !== 0 || dy !== 0 || dz !== 0 ) {

        const t = ( ( p.x - x ) * dx + ( p.y - y ) * dy + ( p.z - z ) * dz ) /
                ( dx * dx + dy * dy + dz * dz );

        if ( t > 1 ) {

            x = p2.x;
            y = p2.y;
            z = p2.z;

        } else if ( t > 0 ) {

            x += dx * t;
            y += dy * t;
            z += dz * t;

        }

    }

    dx = p.x - x;
    dy = p.y - y;
    dz = p.z - z;

    return dx * dx + dy * dy + dz * dz;

}

function simplifyRadialDistance( points, sqTolerance ) {

    let prevPoint = points[ 0 ];
    const newPoints = [ prevPoint ];
    let point;

    for ( let i = 1, len = points.length; i < len; i ++ ) {

        point = points[ i ];

        if ( getSquareDistance( point, prevPoint ) > sqTolerance ) {

            newPoints.push( point );
            prevPoint = point;

        }

    }

    if ( prevPoint !== point )
        newPoints.push( point );


    return newPoints;

}

function simplifyDouglasPeucker( points, sqTolerance ) {

    const len = points.length;
    const MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
    const markers = new MarkerArray( len );

    let first = 0;
    let last = len - 1;

    const stack = [];
    const newPoints = [];

    let i;
    let maxSqDist;
    let sqDist;
    let index;

    markers[ first ] = markers[ last ] = 1; // eslint-disable-line

    while ( last ) {

        maxSqDist = 0;

        for ( i = first + 1; i < last; i ++ ) {

            sqDist = getSquareSegmentDistance( points[ i ], points[ first ], points[ last ] );

            if ( sqDist > maxSqDist ) {

                index = i;
                maxSqDist = sqDist;

            }

        }

        if ( maxSqDist > sqTolerance ) {

            markers[ index ] = 1;
            stack.push( first, index, index, last );

        }

        last = stack.pop();
        first = stack.pop();

    }

    for ( i = 0; i < len; i ++ )
        if ( markers[ i ] )
            newPoints.push( points[ i ] );

    return newPoints;

}

function simplify( points, tolerance, highestQuality ) {

    const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDistance( points, sqTolerance ); // eslint-disable-line
    points = simplifyDouglasPeucker( points, sqTolerance ); // eslint-disable-line

    return points;

}

const BezierCurve = {

    getPoint( p0, p1, p2, p3, t, out = new Vector3() ) {

        t = PMath.clamp( t, 0, 1 ); // eslint-disable-line
        const invt = 1 - t;

        out.x = invt * invt * invt * p0.x + // eslint-disable-line
                3 * invt * invt * t * p1.x +
                3 * invt * t * t * p2.x +
                t * t * t * p3.x;

        out.y = invt * invt * invt * p0.y + // eslint-disable-line
                3 * invt * invt * t * p1.y +
                3 * invt * t * t * p2.y +
                t * t * t * p3.y;

        out.z = invt * invt * invt * p0.z + // eslint-disable-line
                3 * invt * invt * t * p1.z +
                3 * invt * t * t * p2.z +
                t * t * t * p3.z;

        return out;

    },

    getPoints( p0, p1, p2, p3, tolerance, numPoints = 100, highlyMinify = true ) {

        const points = [];
        for ( let i = 0; i < numPoints; i ++ ) {

            const t = i / ( numPoints - 1 );
            points.push( BezierCurve.getPoint( p0, p1, p2, p3, t ) );

        }

        return tolerance ? simplify( points, tolerance, highlyMinify ) : points;

    },

    simplify,

};

export { BezierCurve };
