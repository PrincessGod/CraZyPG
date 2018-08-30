import { System } from 'czpg-ecs';
import { Matrix4 } from '../math';
import { TransformSystem } from './TransformSystem';

export class HierarchyTransformSystem extends System {

    constructor( priority = 1, enable = true ) {

        super( priority, enable );
        this._searchString = 'Transform&Hierarchy';

    }

    onAddToContext( scene ) {

        const transformSystems = [];

        for ( let i = 0; scene.systems.length; i ++ ) {

            const system = scene.systems[ i ];
            if ( system instanceof TransformSystem )
                if ( transformSystems.indexOf( system ) < 0 )
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

                const pMatrix = e.com.Hierarchy.parent.com.Transform.matrix;
                const { matrix, position, quaternion, scale } = transform;
                matrix.copy( pMatrix ).mult( Matrix4.cache.setFromTRS( position, quaternion, scale ) );
                transform.needUpdateMatrix = false;

            }

        } );

    }

}
