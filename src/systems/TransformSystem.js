import { System } from 'czpg-ecs';

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

                const { matrix, position, quaternion, scale } = transform;
                matrix.setFromTRS( position, quaternion, scale );
                transform.needUpdateMatrix = false;

            }

        } );

    }

}
