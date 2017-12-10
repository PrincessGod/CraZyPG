var meshs = {};

var VTX_ATTR_POSITION_NAME = 'a_position';
var VTX_ATTR_POSITION_LOC = 0;
var VTX_ATTR_NORMAL_NAME = 'a_normal';
var VTX_ATTR_NORMAL_LOC = 1;
var VTX_ATTR_UV_NAME = 'a_uv';
var VTX_ATTR_UV_LOC = 2;

function getContext(canvasId) {
    var canvas = document.getElementById(canvasId);
    var gl = canvas.getContext('webgl2', { antialias: true });
    if (!gl) {
        console.error('Please use a decent browser, this browser not support Webgl2Context.');
        return null;
    }
    this.gl = gl;
    return this;
}

function clear() {
    var gl = this.gl;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return this;
}

function setSize(width, height, mutiplier) {
    var gl = this.gl;
    mutiplier = mutiplier || 1.0;
    mutiplier = Math.max(0, mutiplier);
    gl.canvas.style.width = width;
    gl.canvas.style.height = height;
    gl.canvas.width = gl.canvas.clientWidth * mutiplier;
    gl.canvas.height = gl.canvas.clientHeight * mutiplier;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    return this;
}

function createArrayBuffer(array) {
    var isStatic = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    var gl = this.gl;
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, array, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return buffer;
}

function createMeshVAO(name, indexArray, vtxArray, normalArray, uvArray) {
    var gl = this.gl;
    var mesh = { darwMode: gl.TRIANGLES };

    mesh.vao = gl.createVertexArray();
    gl.bindVertexArray(mesh.vao);

    if (indexArray !== undefined && indexArray !== null) {
        mesh.indexBuffer = gl.createBuffer();
        mesh.indexCount = indexArray.length;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    if (vtxArray !== undefined && vtxArray !== null) {
        mesh.vtxBuffer = gl.createBuffer();
        mesh.vtxComponents = 3;
        mesh.vtxCount = vtxArray.length / mesh.vtxComponents;

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vtxBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtxArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(VTX_ATTR_POSITION_LOC);
        gl.vertexAttribPointer(VTX_ATTR_POSITION_LOC, 3, gl.FLOAT, false, 0, 0);
    }

    if (normalArray !== undefined && normalArray !== null) {
        mesh.normalBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(VTX_ATTR_NORMAL_LOC);
        gl.vertexAttribPointer(VTX_ATTR_NORMAL_LOC, 3, gl.FLOAT, false, 0, 0);
    }

    if (uvArray !== undefined && uvArray !== null) {
        mesh.uvBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvArray), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(VTX_ATTR_UV_LOC);
        gl.vertexAttribPointer(VTX_ATTR_UV_LOC, 2, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    this.meshs[name] = mesh;
    return mesh;
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Vector3 = function () {
    function Vector3(x, y, z) {
        classCallCheck(this, Vector3);
        this.x = x || 0.0;this.y = y || 0.0;this.z = z || 0.0;
    }

    createClass(Vector3, [{
        key: "magnitude",
        value: function magnitude(v) {
            //Only get the magnitude of this vector
            if (v === undefined) return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

            //Get magnitude based on another vector
            var x = v.x - this.x,
                y = v.y - this.y,
                z = v.y - this.z;

            return Math.sqrt(x * x + y * y + z * z);
        }
    }, {
        key: "normalize",
        value: function normalize() {
            var mag = this.magnitude();this.x /= mag;this.y /= mag;this.z /= mag;return this;
        }
    }, {
        key: "set",
        value: function set$$1(x, y, z) {
            this.x = x;this.y = y;this.z = z;return this;
        }
    }, {
        key: "multiScalar",
        value: function multiScalar(v) {
            this.x *= v;this.y *= v;this.z *= v;return this;
        }
    }, {
        key: "getArray",
        value: function getArray() {
            return [this.x, this.y, this.z];
        }
    }, {
        key: "getFloatArray",
        value: function getFloatArray() {
            return new Float32Array([this.x, this.y, this.z]);
        }
    }, {
        key: "clone",
        value: function clone() {
            return new Vector3(this.x, this.y, this.z);
        }
    }]);
    return Vector3;
}();

//###########################################################################################
var Matrix4 = function () {
    function Matrix4() {
        classCallCheck(this, Matrix4);
        this.raw = Matrix4.identity();
    }

    //....................................................................
    //Transformations Methods


    createClass(Matrix4, [{
        key: "vtranslate",
        value: function vtranslate(v) {
            Matrix4.translate(this.raw, v.x, v.y, v.z);return this;
        }
    }, {
        key: "translate",
        value: function translate(x, y, z) {
            Matrix4.translate(this.raw, x, y, z);return this;
        }
    }, {
        key: "rotateY",
        value: function rotateY(rad) {
            Matrix4.rotateY(this.raw, rad);return this;
        }
    }, {
        key: "rotateX",
        value: function rotateX(rad) {
            Matrix4.rotateX(this.raw, rad);return this;
        }
    }, {
        key: "rotateZ",
        value: function rotateZ(rad) {
            Matrix4.rotateZ(this.raw, rad);return this;
        }
    }, {
        key: "vscale",
        value: function vscale(vec3) {
            Matrix4.scale(this.raw, vec3.x, vec3.y, vec3.z);return this;
        }
    }, {
        key: "scale",
        value: function scale(x, y, z) {
            Matrix4.scale(this.raw, x, y, z);return this;
        }
    }, {
        key: "invert",
        value: function invert() {
            Matrix4.invert(this.raw);return this;
        }

        //....................................................................
        //Methods
        //Bring is back to identity without changing the transform values.

    }, {
        key: "resetRotation",
        value: function resetRotation() {
            for (var i = 0; i < this.raw.length; i++) {
                if (i >= 12 && i <= 14) continue;
                this.raw[i] = i % 5 == 0 ? 1 : 0; //only positions 0,5,10,15 need to be 1 else 0.
            }

            return this;
        }

        //reset data back to identity.

    }, {
        key: "reset",
        value: function reset() {
            for (var i = 0; i < this.raw.length; i++) {
                this.raw[i] = i % 5 == 0 ? 1 : 0;
            } //only positions 0,5,10,15 need to be 1 else 0.
            return this;
        }

        //....................................................................
        //Static Data Methods

    }], [{
        key: "identity",
        value: function identity() {
            var a = new Float32Array(16);
            a[0] = a[5] = a[10] = a[15] = 1;
            return a;
        }

        //from glMatrix

    }, {
        key: "perspective",
        value: function perspective(out, fovy, aspect, near, far) {
            var f = 1.0 / Math.tan(fovy / 2),
                nf = 1 / (near - far);
            out[0] = f / aspect;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = f;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = (far + near) * nf;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = 2 * far * near * nf;
            out[15] = 0;
        }
    }, {
        key: "ortho",
        value: function ortho(out, left, right, bottom, top, near, far) {
            var lr = 1 / (left - right),
                bt = 1 / (bottom - top),
                nf = 1 / (near - far);
            out[0] = -2 * lr;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = -2 * bt;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = 2 * nf;
            out[11] = 0;
            out[12] = (left + right) * lr;
            out[13] = (top + bottom) * bt;
            out[14] = (far + near) * nf;
            out[15] = 1;
        }

        //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js
        //make the rows into the columns

    }, {
        key: "transpose",
        value: function transpose(out, a) {
            //If we are transposing ourselves we can skip a few steps but have to cache some values
            if (out === a) {
                var a01 = a[1],
                    a02 = a[2],
                    a03 = a[3],
                    a12 = a[6],
                    a13 = a[7],
                    a23 = a[11];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a01;
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a02;
                out[9] = a12;
                out[11] = a[14];
                out[12] = a03;
                out[13] = a13;
                out[14] = a23;
            } else {
                out[0] = a[0];
                out[1] = a[4];
                out[2] = a[8];
                out[3] = a[12];
                out[4] = a[1];
                out[5] = a[5];
                out[6] = a[9];
                out[7] = a[13];
                out[8] = a[2];
                out[9] = a[6];
                out[10] = a[10];
                out[11] = a[14];
                out[12] = a[3];
                out[13] = a[7];
                out[14] = a[11];
                out[15] = a[15];
            }

            return out;
        }

        //Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix

    }, {
        key: "normalMat3",
        value: function normalMat3(out, a) {
            var a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3],
                a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7],
                a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11],
                a30 = a[12],
                a31 = a[13],
                a32 = a[14],
                a33 = a[15],
                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32,


            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

            if (!det) return null;

            det = 1.0 / det;

            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

            out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

            out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            return out;
        }

        //....................................................................
        //Static Operation

        //https://github.com/gregtatum/mdn-model-view-projection/blob/master/shared/matrices.js

    }, {
        key: "multiplyVector",
        value: function multiplyVector(mat4, v) {
            var x = v[0],
                y = v[1],
                z = v[2],
                w = v[3];
            var c1r1 = mat4[0],
                c2r1 = mat4[1],
                c3r1 = mat4[2],
                c4r1 = mat4[3],
                c1r2 = mat4[4],
                c2r2 = mat4[5],
                c3r2 = mat4[6],
                c4r2 = mat4[7],
                c1r3 = mat4[8],
                c2r3 = mat4[9],
                c3r3 = mat4[10],
                c4r3 = mat4[11],
                c1r4 = mat4[12],
                c2r4 = mat4[13],
                c3r4 = mat4[14],
                c4r4 = mat4[15];

            return [x * c1r1 + y * c1r2 + z * c1r3 + w * c1r4, x * c2r1 + y * c2r2 + z * c2r3 + w * c2r4, x * c3r1 + y * c3r2 + z * c3r3 + w * c3r4, x * c4r1 + y * c4r2 + z * c4r3 + w * c4r4];
        }

        //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/vec4.js, vec4.transformMat4

    }, {
        key: "transformVec4",
        value: function transformVec4(out, v, m) {
            out[0] = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3];
            out[1] = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3];
            out[2] = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3];
            out[3] = m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3];
            return out;
        }

        //From glMatrix
        //Multiple two mat4 together

    }, {
        key: "mult",
        value: function mult(out, a, b) {
            var a00 = a[0],
                a01 = a[1],
                a02 = a[2],
                a03 = a[3],
                a10 = a[4],
                a11 = a[5],
                a12 = a[6],
                a13 = a[7],
                a20 = a[8],
                a21 = a[9],
                a22 = a[10],
                a23 = a[11],
                a30 = a[12],
                a31 = a[13],
                a32 = a[14],
                a33 = a[15];

            // Cache only the current line of the second matrix
            var b0 = b[0],
                b1 = b[1],
                b2 = b[2],
                b3 = b[3];
            out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b[4];b1 = b[5];b2 = b[6];b3 = b[7];
            out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b[8];b1 = b[9];b2 = b[10];b3 = b[11];
            out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = b[12];b1 = b[13];b2 = b[14];b3 = b[15];
            out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
            return out;
        }

        //....................................................................
        //Static Transformation

    }, {
        key: "scale",
        value: function scale(out, x, y, z) {
            out[0] *= x;
            out[1] *= x;
            out[2] *= x;
            out[3] *= x;
            out[4] *= y;
            out[5] *= y;
            out[6] *= y;
            out[7] *= y;
            out[8] *= z;
            out[9] *= z;
            out[10] *= z;
            out[11] *= z;
            return out;
        }
    }, {
        key: "rotateY",
        value: function rotateY(out, rad) {
            var s = Math.sin(rad),
                c = Math.cos(rad),
                a00 = out[0],
                a01 = out[1],
                a02 = out[2],
                a03 = out[3],
                a20 = out[8],
                a21 = out[9],
                a22 = out[10],
                a23 = out[11];

            // Perform axis-specific matrix multiplication
            out[0] = a00 * c - a20 * s;
            out[1] = a01 * c - a21 * s;
            out[2] = a02 * c - a22 * s;
            out[3] = a03 * c - a23 * s;
            out[8] = a00 * s + a20 * c;
            out[9] = a01 * s + a21 * c;
            out[10] = a02 * s + a22 * c;
            out[11] = a03 * s + a23 * c;
            return out;
        }
    }, {
        key: "rotateX",
        value: function rotateX(out, rad) {
            var s = Math.sin(rad),
                c = Math.cos(rad),
                a10 = out[4],
                a11 = out[5],
                a12 = out[6],
                a13 = out[7],
                a20 = out[8],
                a21 = out[9],
                a22 = out[10],
                a23 = out[11];

            // Perform axis-specific matrix multiplication
            out[4] = a10 * c + a20 * s;
            out[5] = a11 * c + a21 * s;
            out[6] = a12 * c + a22 * s;
            out[7] = a13 * c + a23 * s;
            out[8] = a20 * c - a10 * s;
            out[9] = a21 * c - a11 * s;
            out[10] = a22 * c - a12 * s;
            out[11] = a23 * c - a13 * s;
            return out;
        }
    }, {
        key: "rotateZ",
        value: function rotateZ(out, rad) {
            var s = Math.sin(rad),
                c = Math.cos(rad),
                a00 = out[0],
                a01 = out[1],
                a02 = out[2],
                a03 = out[3],
                a10 = out[4],
                a11 = out[5],
                a12 = out[6],
                a13 = out[7];

            // Perform axis-specific matrix multiplication
            out[0] = a00 * c + a10 * s;
            out[1] = a01 * c + a11 * s;
            out[2] = a02 * c + a12 * s;
            out[3] = a03 * c + a13 * s;
            out[4] = a10 * c - a00 * s;
            out[5] = a11 * c - a01 * s;
            out[6] = a12 * c - a02 * s;
            out[7] = a13 * c - a03 * s;
            return out;
        }
    }, {
        key: "rotate",
        value: function rotate(out, rad, axis) {
            var x = axis[0],
                y = axis[1],
                z = axis[2],
                len = Math.sqrt(x * x + y * y + z * z),
                s,
                c,
                t,
                a00,
                a01,
                a02,
                a03,
                a10,
                a11,
                a12,
                a13,
                a20,
                a21,
                a22,
                a23,
                b00,
                b01,
                b02,
                b10,
                b11,
                b12,
                b20,
                b21,
                b22;

            if (Math.abs(len) < 0.000001) {
                return null;
            }

            len = 1 / len;
            x *= len;
            y *= len;
            z *= len;

            s = Math.sin(rad);
            c = Math.cos(rad);
            t = 1 - c;

            a00 = out[0];a01 = out[1];a02 = out[2];a03 = out[3];
            a10 = out[4];a11 = out[5];a12 = out[6];a13 = out[7];
            a20 = out[8];a21 = out[9];a22 = out[10];a23 = out[11];

            // Construct the elements of the rotation matrix
            b00 = x * x * t + c;b01 = y * x * t + z * s;b02 = z * x * t - y * s;
            b10 = x * y * t - z * s;b11 = y * y * t + c;b12 = z * y * t + x * s;
            b20 = x * z * t + y * s;b21 = y * z * t - x * s;b22 = z * z * t + c;

            // Perform rotation-specific matrix multiplication
            out[0] = a00 * b00 + a10 * b01 + a20 * b02;
            out[1] = a01 * b00 + a11 * b01 + a21 * b02;
            out[2] = a02 * b00 + a12 * b01 + a22 * b02;
            out[3] = a03 * b00 + a13 * b01 + a23 * b02;
            out[4] = a00 * b10 + a10 * b11 + a20 * b12;
            out[5] = a01 * b10 + a11 * b11 + a21 * b12;
            out[6] = a02 * b10 + a12 * b11 + a22 * b12;
            out[7] = a03 * b10 + a13 * b11 + a23 * b12;
            out[8] = a00 * b20 + a10 * b21 + a20 * b22;
            out[9] = a01 * b20 + a11 * b21 + a21 * b22;
            out[10] = a02 * b20 + a12 * b21 + a22 * b22;
            out[11] = a03 * b20 + a13 * b21 + a23 * b22;
        }
    }, {
        key: "invert",
        value: function invert(out, mat) {
            if (mat === undefined) mat = out; //If input isn't sent, then output is also input

            var a00 = mat[0],
                a01 = mat[1],
                a02 = mat[2],
                a03 = mat[3],
                a10 = mat[4],
                a11 = mat[5],
                a12 = mat[6],
                a13 = mat[7],
                a20 = mat[8],
                a21 = mat[9],
                a22 = mat[10],
                a23 = mat[11],
                a30 = mat[12],
                a31 = mat[13],
                a32 = mat[14],
                a33 = mat[15],
                b00 = a00 * a11 - a01 * a10,
                b01 = a00 * a12 - a02 * a10,
                b02 = a00 * a13 - a03 * a10,
                b03 = a01 * a12 - a02 * a11,
                b04 = a01 * a13 - a03 * a11,
                b05 = a02 * a13 - a03 * a12,
                b06 = a20 * a31 - a21 * a30,
                b07 = a20 * a32 - a22 * a30,
                b08 = a20 * a33 - a23 * a30,
                b09 = a21 * a32 - a22 * a31,
                b10 = a21 * a33 - a23 * a31,
                b11 = a22 * a33 - a23 * a32,


            // Calculate the determinant
            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

            if (!det) return false;
            det = 1.0 / det;

            out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
            out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
            out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
            out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
            out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
            out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
            out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
            out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
            out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
            out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
            out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
            out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
            out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
            out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
            out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
            out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

            return true;
        }

        //https://github.com/toji/gl-matrix/blob/master/src/gl-matrix/mat4.js  mat4.scalar.translate = function (out, a, v) {

    }, {
        key: "translate",
        value: function translate(out, x, y, z) {
            out[12] = out[0] * x + out[4] * y + out[8] * z + out[12];
            out[13] = out[1] * x + out[5] * y + out[9] * z + out[13];
            out[14] = out[2] * x + out[6] * y + out[10] * z + out[14];
            out[15] = out[3] * x + out[7] * y + out[11] * z + out[15];
        }
    }]);
    return Matrix4;
}();

var Transform = function () {
    function Transform() {
        classCallCheck(this, Transform);

        this.position = new Vector3(0, 0, 0);
        this.scale = new Vector3(1, 1, 1);
        this.rotation = new Vector3(0, 0, 0);
        this.matLocal = new Matrix4();
        this.matNormal = new Matrix4();

        this.forward = new Float32Array(4);
        this.up = new Float32Array(4);
        this.right = new Float32Array(4);
    }

    createClass(Transform, [{
        key: 'updateMatrix',
        value: function updateMatrix() {
            this.matLocal.reset().vtranslate(this.position).rotateZ(this.rotation.z * Transform.deg2Rad).rotateX(this.rotation.x * Transform.deg2Rad).rotateY(this.rotation.y * Transform.deg2Rad).vscale(this.scale);

            Matrix4.normalMat3(this.matNormal, this.matLocal.raw);

            Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matLocal.raw);
            Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matLocal.raw);
            Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matLocal.raw);

            return this.matLocal.raw;
        }
    }, {
        key: 'updateDirection',
        value: function updateDirection() {
            Matrix4.transformVec4(this.forward, [0, 0, 1, 0], this.matLocal.raw);
            Matrix4.transformVec4(this.up, [0, 1, 0, 0], this.matLocal.raw);
            Matrix4.transformVec4(this.right, [1, 0, 0, 0], this.matLocal.raw);
            return this;
        }
    }, {
        key: 'getMatrix',
        value: function getMatrix() {
            return this.matLocal.raw;
        }
    }, {
        key: 'getNormalMatrix',
        value: function getNormalMatrix() {
            return this.matNormal;
        }
    }, {
        key: 'reset',
        value: function reset() {
            this.position.set(0, 0, 0);
            this.scale.set(1, 1, 1);
            this.rotation.set(0, 0, 0);
        }
    }]);
    return Transform;
}();

Transform.deg2Rad = Math.PI / 180;

var Modal = function () {
    function Modal(mesh) {
        classCallCheck(this, Modal);

        this.mesh = mesh;
        this.transform = new Transform();
    }

    createClass(Modal, [{
        key: 'setScale',
        value: function setScale(x, y, z) {
            this.transform.scale.set(x, y, z);
            return this;
        }
    }, {
        key: 'setPosition',
        value: function setPosition(x, y, z) {
            this.transform.position.set(x, y, z);
            return this;
        }
    }, {
        key: 'setRotation',
        value: function setRotation(x, y, z) {
            this.transform.rotation.set(x, y, z);
            return this;
        }
    }, {
        key: 'addScale',
        value: function addScale(x, y, z) {
            this.transform.scale.x += x;
            this.transform.scale.y += y;
            this.transform.scale.z += z;
            return this;
        }
    }, {
        key: 'addPosition',
        value: function addPosition(x, y, z) {
            this.transform.position.x += x;
            this.transform.position.y += y;
            this.transform.position.z += z;
            return this;
        }
    }, {
        key: 'addRotation',
        value: function addRotation(x, y, z) {
            this.transform.rotation.x += x;
            this.transform.rotation.y += y;
            this.transform.rotation.z += z;
            return this;
        }
    }, {
        key: 'preRender',
        value: function preRender() {
            this.transform.updateMatrix();
            return this;
        }
    }]);
    return Modal;
}();

var Primatives = {};
Primatives.GridAxis = function () {
    function _class() {
        classCallCheck(this, _class);
    }

    createClass(_class, null, [{
        key: 'createMesh',
        value: function createMesh(gl) {
            var vertices = [];
            var size = 2;
            var div = 10.0;
            var step = size / div;
            var half = size / 2;

            var p = void 0;
            for (var i = 0; i <= div; i++) {
                p = -half + i * step;
                vertices.push(p);
                vertices.push(0);
                vertices.push(half);
                vertices.push(0);

                vertices.push(p);
                vertices.push(0);
                vertices.push(-half);
                vertices.push(0);

                vertices.push(-half);
                vertices.push(0);
                vertices.push(p);
                vertices.push(0);

                vertices.push(half);
                vertices.push(0);
                vertices.push(p);
                vertices.push(0);
            }

            vertices.push(-half);
            vertices.push(0);
            vertices.push(0);
            vertices.push(1);

            vertices.push(half);
            vertices.push(0);
            vertices.push(0);
            vertices.push(1);

            vertices.push(0);
            vertices.push(-half);
            vertices.push(0);
            vertices.push(2);

            vertices.push(0);
            vertices.push(half);
            vertices.push(0);
            vertices.push(2);

            vertices.push(0);
            vertices.push(0);
            vertices.push(-half);
            vertices.push(3);

            vertices.push(0);
            vertices.push(0);
            vertices.push(half);
            vertices.push(3);

            var attrColorLoc = 4;
            var strideLen = void 0;
            var mesh = {
                drawMode: gl.LINES,
                vao: gl.createVertexArray()
            };

            mesh.vtxComponents = 4;
            mesh.vtxCount = vertices.length / mesh.vtxComponents;
            strideLen = Float32Array.BYTES_PER_ELEMENT * mesh.vtxComponents;

            mesh.vtxBuffer = gl.createBuffer();
            gl.bindVertexArray(mesh.vao);
            gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vtxBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(VTX_ATTR_POSITION_LOC);
            gl.enableVertexAttribArray(attrColorLoc);

            gl.vertexAttribPointer(VTX_ATTR_POSITION_LOC, 3, gl.FLOAT, false, strideLen, 0);

            gl.vertexAttribPointer(attrColorLoc, 1, gl.FLOAT, false, strideLen, Float32Array.BYTES_PER_ELEMENT * 3);

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindVertexArray(null);
            meshs['gridAxis'] = mesh;
            return mesh;
        }
    }]);
    return _class;
}();

var OrbitCamera = function () {
    function OrbitCamera(fov, ratio, near, far) {
        classCallCheck(this, OrbitCamera);

        this.perspectionMatrix = new Float32Array(16);
        Matrix4.perspective(this.perspectionMatrix, fov, ratio, near, far);

        this.transform = new Transform();
        this.viewMatrix = new Float32Array(16);

        this.mode = OrbitCamera.MODE_ORBIT;
    }

    createClass(OrbitCamera, [{
        key: 'panX',
        value: function panX(v) {
            if (this.mode === OrbitCamera.MODE_ORBIT) {
                return;
            }
            this.updateViewMatrix();
            this.transform.position.x += this.transform.right[0] * v;
            this.transform.position.y += this.transform.right[1] * v;
            this.transform.position.z += this.transform.right[2] * v;
        }
    }, {
        key: 'panY',
        value: function panY(v) {
            this.updateViewMatrix();
            this.transform.position.y += this.transform.up[1] * v;
            if (this.mode === OrbitCamera.MODE_ORBIT) {
                return;
            }
            this.transform.position.x += this.transform.up[0] * v;
            this.transform.position.z += this.transform.up[2] * v;
        }
    }, {
        key: 'panZ',
        value: function panZ(v) {
            this.updateViewMatrix();
            if (this.mode === OrbitCamera.MODE_ORBIT) {
                this.transform.position.z += v;
            } else {
                this.transform.position.x += this.transform.forward[0] * v;
                this.transform.position.y += this.transform.forward[1] * v;
                this.transform.position.z += this.transform.forward[2] * v;
            }
        }
    }, {
        key: 'updateViewMatrix',
        value: function updateViewMatrix() {
            if (this.mode === OrbitCamera.MODE_FREE) {
                this.transform.matLocal.reset().vtranslate(this.transform.position).rotateY(this.transform.rotation.y * Transform.deg2Rad).rotateX(this.transform.rotation.x * Transform.deg2Rad);
            } else {
                this.transform.matLocal.reset().rotateY(this.transform.rotation.y * Transform.deg2Rad).rotateX(this.transform.rotation.x * Transform.deg2Rad).vtranslate(this.transform.position);
            }

            this.transform.updateDirection();

            Matrix4.invert(this.viewMatrix, this.transform.matLocal.raw);
            return this.viewMatrix;
        }
    }]);
    return OrbitCamera;
}();

OrbitCamera.MODE_FREE = 0;
OrbitCamera.MODE_ORBIT = 1;

var CameraController = function () {
    function CameraController(gl, camera) {
        classCallCheck(this, CameraController);

        var self = this;
        var box = gl.canvas.getBoundingClientRect();
        this.canvas = gl.canvas;
        this.camera = camera;

        this.rotateRate = -300;
        this.panRate = 5;
        this.zoomRate = 200;

        this.offsetX = box.left;
        this.offsetY = box.top;

        this.initX = 0;
        this.initY = 0;
        this.prevX = 0;
        this.prevY = 0;

        this.onUpHandler = function (e) {
            self.onMouseUp(e);
        };
        this.onMoveHandler = function (e) {
            self.onMouseMove(e);
        };

        this.canvas.addEventListener('mousedown', function (e) {
            self.onMouseDown(e);
        });
        this.canvas.addEventListener('mousewheel', function (e) {
            self.onMouseWheel(e);
        });
    }

    createClass(CameraController, [{
        key: 'getMouseVec2',
        value: function getMouseVec2(e) {
            return {
                x: e.pageX - this.offsetX,
                y: e.pageY - this.offsetY
            };
        }
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e) {
            this.initX = this.prevX = e.pageX - this.offsetX;
            this.initY = this.prevY = e.pageY - this.offsetY;

            this.canvas.addEventListener('mouseup', this.onUpHandler);
            this.canvas.addEventListener('mousemove', this.onMoveHandler);
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp() {
            this.canvas.removeEventListener('mouseup', this.onMouseUp);
            this.canvas.removeEventListener('mousemove', this.onMoveHandler);
        }
    }, {
        key: 'onMouseWheel',
        value: function onMouseWheel(e) {
            var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
            this.camera.panZ(delta * (this.zoomRate / this.canvas.height));
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(e) {
            var x = e.pageX - this.offsetX;
            var y = e.pageY - this.offsetY;
            var dx = x - this.prevX;
            var dy = y - this.prevY;

            if (!e.shiftKey) {
                this.camera.transform.rotation.y += dx * (this.rotateRate / this.canvas.width);
                this.camera.transform.rotation.x += dy * (this.rotateRate / this.canvas.height);
            } else {
                this.camera.panX(-dx * (this.panRate / this.canvas.width));
                this.camera.panY(dy * (this.panRate / this.canvas.height));
            }

            this.prevX = x;
            this.prevY = y;
        }
    }]);
    return CameraController;
}();

var Render = function () {
    function Render(callback, fps) {
        classCallCheck(this, Render);

        var self = this;
        this.lastTime = null;
        this.callback = callback;
        this.isActive = false;
        this.fps = 0;

        if (typeof fps === 'number' && fps > 0) {
            this.frameTimeLimit = 1 / fps;

            this.run = function () {
                var currentTime = performance.now();
                var timespan = (currentTime - self.lastTime) / 1000;

                if (timespan >= self.frameTimeLimit) {
                    self.fps = Math.floor(1 / timespan);
                    self.lastTime = currentTime;
                    self.callback(timespan);
                }

                if (self.isActive) {
                    window.requestAnimationFrame(self.run);
                }
            };
        } else {
            this.run = function () {
                var currentTime = performance.now();
                var timespan = (currentTime - self.lastTime) / 1000;

                self.fps = Math.floor(1 / timespan);
                self.lastTime = currentTime;

                self.callback(timespan);
                if (self.isActive) {
                    window.requestAnimationFrame(self.run);
                }
            };
        }
    }

    createClass(Render, [{
        key: 'start',
        value: function start() {
            this.isActive = true;
            this.lastTime = performance.now();
            window.requestAnimationFrame(this.run);
            return this;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.isActive = false;
        }
    }]);
    return Render;
}();

var ShaderUtil = function () {
    function ShaderUtil() {
        classCallCheck(this, ShaderUtil);
    }

    createClass(ShaderUtil, null, [{
        key: 'getDomSrc',
        value: function getDomSrc(id) {
            var ele = document.getElementById(id);
            if (!ele || ele.textContent == '') {
                console.error(id + ' shader element not have text.');
                return null;
            }
            return ele.textContent;
        }
    }, {
        key: 'createShader',
        value: function createShader(gl, src, type) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Error compiling shader: ' + src, gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        }
    }, {
        key: 'createProgram',
        value: function createProgram(gl, vs, fs) {
            var doValidate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

            if (!(vs instanceof WebGLShader) && vs.length < 20) {
                var src = this.getDomSrc(vs);
                if (!src) {
                    return null;
                }
                vs = this.createShader(gl, src, gl.VERTEX_SHADER);
                if (!vs) {
                    return null;
                }
            } else if (!(vs instanceof WebGLShader)) {
                vs = this.createShader(gl, vs, gl.VERTEX_SHADER);
                if (!vs) {
                    return null;
                }
            }
            if (!(fs instanceof WebGLShader) && fs.length < 20) {
                var _src = this.getDomSrc(fs);
                if (!_src) {
                    return null;
                }
                fs = this.createShader(gl, _src, gl.FRAGMENT_SHADER);
                if (!fs) {
                    return null;
                }
            } else if (!(fs instanceof WebGLShader)) {
                fs = this.createShader(gl, fs, gl.FRAGMENT_SHADER);
                if (!fs) {
                    return null;
                }
            }

            var prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);

            gl.bindAttribLocation(prog, VTX_ATTR_POSITION_LOC, VTX_ATTR_POSITION_NAME);
            gl.bindAttribLocation(prog, VTX_ATTR_NORMAL_LOC, VTX_ATTR_NORMAL_NAME);
            gl.bindAttribLocation(prog, VTX_ATTR_UV_LOC, VTX_ATTR_UV_NAME);

            gl.linkProgram(prog);

            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.error('Error createing shader program.', gl.getProgramInfoLog(prog));
                gl.deleteProgram(prog);
                return null;
            }

            if (doValidate) {
                gl.validateProgram(prog);
                if (!gl.getProgramParameter(prog, gl.VALIDATE_STATUS)) {
                    console.error('Error validating shader program.', gl.getProgramInfoLog(prog));
                    gl.deleteProgram(prog);
                    return null;
                }
            }

            gl.detachShader(prog, vs);
            gl.detachShader(prog, fs);
            gl.deleteShader(vs);
            gl.deleteShader(fs);

            return prog;
        }
    }, {
        key: 'getDefaultAttribLocation',
        value: function getDefaultAttribLocation(gl, program) {
            return {
                position: gl.getAttribLocation(program, VTX_ATTR_POSITION_NAME),
                normal: gl.getAttribLocation(program, VTX_ATTR_NORMAL_NAME),
                uv: gl.getAttribLocation(program, VTX_ATTR_UV_NAME)
            };
        }
    }, {
        key: 'getDefaultUnifomLocation',
        value: function getDefaultUnifomLocation(gl, program) {
            return {
                perspective: gl.getUniformLocation(program, 'u_proj'),
                view: gl.getUniformLocation(program, 'u_view'),
                world: gl.getUniformLocation(program, 'u_world')
            };
        }
    }]);
    return ShaderUtil;
}();

var Shader = function () {
    function Shader(gl, vs, fs) {
        classCallCheck(this, Shader);

        this.program = ShaderUtil.createProgram(gl, vs, fs);

        if (this.program !== null) {
            this.gl = gl;
            gl.useProgram(this.program);
            this.attribLoc = ShaderUtil.getDefaultAttribLocation(gl, this.program);
            this.uniformLoc = ShaderUtil.getDefaultUnifomLocation(gl, this.program);
        }
    }

    createClass(Shader, [{
        key: 'activate',
        value: function activate() {
            this.gl.useProgram(this.program);
            return this;
        }
    }, {
        key: 'deactivate',
        value: function deactivate() {
            this.gl.useProgram(null);
            return this;
        }
    }, {
        key: 'setPerspective',
        value: function setPerspective(mat4Array) {
            this.gl.uniformMatrix4fv(this.uniformLoc.perspective, false, mat4Array);
            return this;
        }
    }, {
        key: 'setViewMatrix',
        value: function setViewMatrix(mat4Array) {
            this.gl.uniformMatrix4fv(this.uniformLoc.view, false, mat4Array);
            return this;
        }
    }, {
        key: 'setWorldMatrix',
        value: function setWorldMatrix(mat4Array) {
            this.gl.uniformMatrix4fv(this.uniformLoc.world, false, mat4Array);
            return this;
        }
    }, {
        key: 'dispose',
        value: function dispose() {
            if (this.gl.getParameter(this.gl.CURRENT_PROGRAM) === this.program) {
                this.gl.useProgram(null);
            }
            this.gl.deleteProgram(this.program);
        }
    }, {
        key: 'preRender',
        value: function preRender() {}
    }, {
        key: 'renderModal',
        value: function renderModal(modal) {
            this.setWorldMatrix(modal.transform.getMatrix());
            this.gl.bindVertexArray(modal.mesh.vao);
            if (modal.mesh.indexCount) {
                this.gl.drawElements(modal.mesh.drawMode, modal.mesh.indexCount, this.gl.UNSIGNED_SHORT, 0);
            } else {
                this.gl.drawArrays(modal.mesh.drawMode, 0, modal.mesh.vtxCount);
            }
            this.gl.bindVertexArray(null);

            return this;
        }
    }]);
    return Shader;
}();

var GridAxisShader = function (_Shader) {
    inherits(GridAxisShader, _Shader);

    function GridAxisShader(gl, projMat) {
        classCallCheck(this, GridAxisShader);

        var vs = '#version 300 es\n' + 'in vec3 a_Position;\n' + 'layout(location=4) in float a_Color;\n' + '\n' + 'uniform mat4 u_world;\n' + 'uniform mat4 u_view;\n' + 'uniform mat4 u_proj;\n' + 'uniform vec3 u_colors[4];\n' + '\n' + 'out vec3 v_color;\n' + '\n' + 'void main() {\n' + '    v_color = u_colors[int(a_Color)];\n' + '    gl_Position = u_proj * u_view * u_world * vec4(a_Position, 1.0);\n' + '}';

        var fs = '#version 300 es\n' + 'precision mediump float;\n' + '\n' + 'in vec3 v_color;\n' + 'out vec4 finalColor;\n' + '\n' + 'void main() {\n' + '    finalColor = vec4(v_color, 1.0);\n' + '}';

        var _this = possibleConstructorReturn(this, (GridAxisShader.__proto__ || Object.getPrototypeOf(GridAxisShader)).call(this, gl, vs, fs));

        _this.setPerspective(projMat);

        var uColor = gl.getUniformLocation(_this.program, 'u_colors');
        gl.uniform3fv(uColor, [0.5, 0.5, 0.5, 1, 0, 0, 0, 1, 0, 0, 0, 1]);

        gl.useProgram(null);
        return _this;
    }

    return GridAxisShader;
}(Shader);

export { Transform, Modal, Primatives, OrbitCamera, CameraController, Render, ShaderUtil, Shader, GridAxisShader, meshs, VTX_ATTR_POSITION_NAME, VTX_ATTR_POSITION_LOC, VTX_ATTR_NORMAL_NAME, VTX_ATTR_NORMAL_LOC, VTX_ATTR_UV_NAME, VTX_ATTR_UV_LOC, getContext, clear, setSize, createArrayBuffer, createMeshVAO, Vector3, Matrix4 };
//# sourceMappingURL=czpg.module.js.map
