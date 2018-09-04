import { System } from 'czpg-ecs';
import { Vector4, Matrix4 } from '../math';

const rightDir = new Vector4( 1, 0, 0, 0 );
const upDir = new Vector4( 0, 1, 0, 0 );
const forwardDir = new Vector4( 0, 0, 1, 0 );

export class TransformSystem extends System {

    constructor( priority = 1, enable = true ) {

        super( priority, enable );
        this._searchString = 'Transform';

    }

    update( scene ) {

        const group = scene.getGroup( this._searchString );
        const entities = group.entities;
        entities.forEach( e => {

            const transform = e.com.Transform;
            if ( transform.needUpdateMatrix ) {

                const { matrix, normMat, position, quaternion, scale, right, up, forward } = transform;

                matrix.setFromTRS( position, quaternion, scale );
                normMat.setFromMatrix4( Matrix4.cache.copy( matrix ).invert().transpose() );

                Vector4.transfromMatrix4( Vector4.cache, rightDir, matrix );
                right.copy( Vector4.cache ).normalize();
                Vector4.transfromMatrix4( Vector4.cache, upDir, matrix );
                up.copy( Vector4.cache ).normalize();
                Vector4.transfromMatrix4( Vector4.cache, forwardDir, matrix );
                forward.copy( Vector4.cache ).normalize();

                transform.needUpdateMatrix = false;

            }

        } );

    }

}
