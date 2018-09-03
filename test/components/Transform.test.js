import test from 'ava';
import { SceneObject, Transform, Vector3, Euler, Quaternion, Matrix4, Matrix3 } from '../../';

const so1 = new SceneObject();
const t1 = so1.addComponent( Transform );

test( '#constructor set defult value', t => {

    t.true( t1.position.equals( new Vector3() ) && t1.rotation.equals( new Euler() ) && t1.quaternion.equals( new Quaternion() ) &&
            t1.scale.equals( new Vector3( 1, 1, 1 ) ) && t1.matrix.equals( new Matrix4() ) && t1.right.equals( new Vector3( 1, 0, 0 ) ) &&
            t1.normMat.equals( new Matrix3() ) && t1.up.equals( new Vector3( 0, 1, 0 ) ) && t1.forward.equals( new Vector3( 0, 0, 1 ) ) && t1.needUpdateMatrix === false );

} );

test( '#setPosition return Transform and set position', t => {

    const o = Transform.setPosition( so1, 1, 2, 3 );
    t.true( o === Transform && t1.position.equals( new Vector3( 1, 2, 3 ) ) );

    Transform.setPosition( so1, new Vector3( 3, 2, 1 ) );
    t.true( t1.position.equals( new Vector3( 3, 2, 1 ) ) );

    Transform.setPosition( so1, new Float32Array( [ 2, 1, 3 ] ) );
    t.true( t1.position.equals( new Vector3( 3, 2, 1 ) ) );

    Transform.setPosition( so1, [ 2, 1, 3 ] );
    t.true( t1.position.equals( new Vector3( 3, 2, 1 ) ) );

    Transform.setPosition( so1, [ 2, 1, 3, 4 ] );
    t.true( t1.position.equals( new Vector3( 3, 2, 1 ) ) );

} );

test( '#setRotation returen Transform and set value', t => {

    const o = Transform.setRotation( so1, 1, 2, 3 );
    t.true( o === Transform && t1.rotation.equals( new Euler( 1, 2, 3 ) ) );

    Transform.setRotation( so1, new Euler( 3, 2, 1 ) );
    t.true( t1.rotation.equals( new Euler( 3, 2, 1 ) ) );

    Transform.setRotation( so1, new Float32Array( [ 1, 2, 3 ] ) );
    t.true( t1.rotation.equals( new Euler( 3, 2, 1 ) ) );

    Transform.setRotation( so1, [ 1, 2, 3 ] );
    t.true( t1.rotation.equals( new Euler( 3, 2, 1 ) ) );

    const e = new Euler( Math.random(), Math.random(), Math.random() );
    const q = new Quaternion().setFromEuler( e );
    Transform.setRotation( so1, e );
    t.true( t1.quaternion.equals( q ) );

} );

test( '#setQuaternion return Transform and set value', t =>{

    const o = Transform.setQuaternion( so1, 1, 2, 3, 4 );
    t.true( o === Transform && t1.quaternion.equals( new Quaternion( 1, 2, 3, 4 ) ) );

    Transform.setQuaternion( so1, new Quaternion( 1, 3, 2, 4 ) );
    t.true( t1.quaternion.equals( new Quaternion( 1, 3, 2, 4 ) ) );

    Transform.setQuaternion( so1, new Float32Array( [ 1, 2, 3, 4 ] ) );
    t.true( t1.quaternion.equals( new Quaternion( 1, 3, 2, 4 ) ) );

    Transform.setQuaternion( so1, [ 1, 2, 3, 4 ] );
    t.true( t1.quaternion.equals( new Quaternion( 1, 3, 2, 4 ) ) );

    const e = new Euler( Math.random(), Math.random(), Math.random() );
    const q = new Quaternion().setFromEuler( e );
    Transform.setQuaternion( so1, q );
    t.true( t1.rotation.equals( e ) );

} );

test( '#setScale return Transform and set value', t => {

    const o = Transform.setScale( so1, 1, 2, 3 );
    t.true( o === Transform && t1.scale.equals( new Vector3( 1, 2, 3 ) ) );

    Transform.setScale( so1, new Vector3( 3, 2, 1 ) );
    t.true( t1.scale.equals( new Vector3( 3, 2, 1 ) ) );

    Transform.setScale( so1, new Float32Array( [ 1, 3, 2 ] ) );
    t.true( t1.scale.equals( new Vector3( 3, 2, 1 ) ) );

    Transform.setScale( so1, [ 1, 3, 2 ] );
    t.true( t1.scale.equals( new Vector3( 3, 2, 1 ) ) );

} );
