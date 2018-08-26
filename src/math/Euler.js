import { PMath } from './Math';
import { Vector3 } from './Vector3';
import { Matrix4 } from './Matrix4';

// X Y Z order only
export class Eular extends Vector3 {

    static setFromMatrix4( v, m ) {

        const te = m.raw || m;
        const m11 = te[ 0 ];
        const m12 = te[ 4 ];
        const m13 = te[ 8 ];
        const m22 = te[ 5 ];
        const m23 = te[ 9 ];
        const m32 = te[ 6 ];
        const m33 = te[ 10 ];

        v.y = Math.asin( PMath.clamp( m13, - 1, 1 ) );

        if ( Math.abs( m13 ) < 0.99999 ) {

            v.x = Math.atan2( - m23, m33 );
            v.z = Math.atan2( - m12, m11 );

        } else {

            v.x = Math.atan2( m32, m22 );
            v.z = 0;

        }

        return v;

    }

    setFromMatrix4( m ) {

        return Eular.setFromMatrix4( this, m );

    }

    static setFromQuaternion( e, q ) {

        e.setFromMatrix4( Matrix4.cache.identity().applyQuat( q ) );
        return e;

    }

    setFromQuaternion( q ) {

        return Eular.setFromQuaternion( this, q );

    }

}
