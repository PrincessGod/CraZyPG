import { System } from 'czpg-ecs';
import { Matrix4, Vector4 } from '../math';
import { TransformSystem } from './TransformSystem';

const rightDir = new Vector4( 1, 0, 0, 0 );
const upDir = new Vector4( 0, 1, 0, 0 );
const forwardDir = new Vector4( 0, 0, 1, 0 );

export class HierarchyTransformSystem extends System {

    constructor( priority = 1, enable = true ) {

        super( priority, enable );
        this._searchString = 'Transform&Hierarchy';

    }

    onAddToContext( scene ) {

        const transformSystems = [];

        for ( let i = 0; i < scene.systems.length; i ++ ) {

            const system = scene.systems[ i ];
            if ( system instanceof TransformSystem )
                transformSystems.push( system );

        }

        transformSystems.forEach( s => scene.removeSystem( s ) );

    }

    update( scene ) {

        const group = scene.getGroup( this._searchString );
        const entities = group.entities.sort( ( a, b ) => a.com.Hierarchy.level - b.com.Hierarchy.level );

        entities.forEach( e => {

            const hierarchy = e.com.Hierarchy;
            const transform = e.com.Transform;
            if ( transform.needUpdateMatrix )
                hierarchy.children.forEach( c => c.com.Transform.needUpdateMatrix = true );

        } );

        entities.forEach( e => {

            const transform = e.com.Transform;
            if ( transform.needUpdateMatrix ) {

                const parent = e.com.Hierarchy.parent;
                const { matrix, normMat, position, quaternion, scale, right, up, forward } = transform;

                if ( parent )
                    matrix.copy( parent.com.Transform.matrix ).mult( Matrix4.cache.setFromTRS( position, quaternion, scale ) );
                else
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
