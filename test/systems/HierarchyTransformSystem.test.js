import test from 'ava';
import { Scene, SceneObject, HierarchyTransformSystem, Hierarchy, Transform, TransformSystem, Matrix4, Vector3 } from '../../';

const scene = new Scene();
const so1 = new SceneObject();
const so2 = new SceneObject();
const system = new HierarchyTransformSystem();
const h1 = so1.addComponent( Hierarchy );
const h2 = so2.addComponent( Hierarchy );
const t1 = so1.addComponent( Transform );
const t2 = so2.addComponent( Transform );

scene.addSystem( system )
    .addSceneObject( so1 )
    .addSceneObject( so2 );

test( '#constructor set default value', t => {

    t.true( system.priority === 1 && system.enable === true && system._searchString === 'Transform&Hierarchy' );

} );

test( '#onAddToContext remove existed Transform system', t => {

    const transformSystem = new TransformSystem();
    scene.removeSystem( system ).addSystem( transformSystem ).addSystem( transformSystem ).addSystem( system );
    t.true( scene.systems.length === 1 && scene.systems[ 0 ] === system );

} );

test( '#update update position and scale', t => {

    Hierarchy.addChildren( so1, so2 );
    Transform.setPosition( so1, 1, 2, 3 ).setScale( so1, 2, 2, 2 );

    scene.update();

    t.true( t1.matrix.equals( t2.matrix ) && t1.matrix.equals( new Matrix4(
        2, 0, 0, 0,
        0, 2, 0, 0,
        0, 0, 2, 0,
        1, 2, 3, 1
    ) ) && t2.right.equals( new Vector3( 1, 0, 0 ) ) && t2.up.equals( new Vector3( 0, 1, 0 ) ) && t2.forward.equals( new Vector3( 0, 0, 1 ) ) );

} );
