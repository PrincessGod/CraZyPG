import { Transform } from './Transform';
import { createVertexArray } from '../renderer/vertexArray';
import { createBufferInfoFromArrays } from '../renderer/attributes';
import * as Constant from '../renderer/constant';

function Model( mesh ) {

    this.mesh = mesh;
    this.transform = new Transform();
    this.normMat = this.transform.normMat;
    this.matrix = this.transform.matrix.raw;
    this.positionInfo = this.mesh.attribArrays[ Constant.ATTRIB_POSITION_NAME ];
    this.uvInfo = this.mesh.attribArrays[ Constant.ATTRIB_UV_NAME ];
    this.normalInfo = this.mesh.attribArrays[ Constant.ATTRIB_NORMAL_NAME ];

}

Object.assign( Model.prototype, {

    isModel: true,

    setScale( x, y, z ) {

        this.transform.scale.set( x, y, z );
        return this;

    },

    setPosition( x, y, z ) {

        this.transform.position.set( x, y, z );
        return this;

    },

    setRotation( x, y, z ) {

        this.transform.rotation.set( x, y, z );
        return this;

    },

    addScale( x, y, z ) {

        this.transform.scale.x += x;
        this.transform.scale.y += y;
        this.transform.scale.z += z;
        return this;

    },

    addPosition( x, y, z ) {

        this.transform.position.x += x;
        this.transform.position.y += y;
        this.transform.position.z += z;
        return this;

    },

    addRotation( x, y, z ) {

        this.transform.rotation.x += x;
        this.transform.rotation.y += y;
        this.transform.rotation.z += z;
        return this;

    },

    preRender() {

        this.transform.updateMatrix();
        return this;

    },

    createVAO( gl, program, attribSetters ) {

        this.mesh.vao = createVertexArray( gl, this.mesh.bufferInfo, program, attribSetters );

    },

    createBufferInfo( gl ) {

        this.mesh.bufferInfo = createBufferInfoFromArrays( gl, this.mesh.attribArrays );
        this.bufferInfo = this.mesh.bufferInfo;

    },

} );

export { Model };
