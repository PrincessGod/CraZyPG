import test from 'ava';
import { Scene, SceneObject, Transform, TransformSystem, Matrix4, Vector3 } from '../../';

const scene = new Scene();
const sceneObject = new SceneObject();
const transform = sceneObject.addComponent( Transform );
const system = new TransformSystem();

scene.addSystem( system ).addSceneObject( sceneObject );

test( '#constructor default value is right', t => {

    t.true( system.priority === 1 && system.enable === true && system._searchString === 'Transform' );

} );

test( '#update update the matrix and direction', t => {

    Transform.setPosition( sceneObject, 1, 2, 3 )
        .setScale( sceneObject, 2, 2, 2 );
    scene.update();

    t.true( transform.needUpdateMatrix === false && transform.matrix.equals( new Matrix4(
        2, 0, 0, 0,
        0, 2, 0, 0,
        0, 0, 2, 0,
        1, 2, 3, 1
    ) ) && transform.right.equals( new Vector3( 1, 0, 0 ) ) && transform.up.equals( new Vector3( 0, 1, 0 ) ) && transform.forward.equals( new Vector3( 0, 0, 1 ) ) );

    scene.update();

} );
