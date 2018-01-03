import { Shader } from './Shader';

function PointlightShader( gl, projMat, texture ) {

    Shader.call( this, gl, PointlightShader.vs, PointlightShader.fs );

    this.setProjMatrix( projMat );
    this.texture = texture;

    gl.useProgram( null );

}

PointlightShader.prototype = Object.assign( Object.create( Shader.prototype ), {

    constructor: PointlightShader,

    setTexture( tex ) {

        this.texture = tex;
        return this;

    },

    preRender() {

        this.setUniforms( { u_texture: this.texture } );
        return this;

    },

} );

Object.assign( PointlightShader, {

    vs: '#version 300 es\n' +
        'in vec3 a_position;\n' +
        'in vec2 a_uv;\n' +
        'in vec3 a_norm;\n' +
        '\n' +
        'uniform mat4 u_world;\n' +
        'uniform mat4 u_view;\n' +
        'uniform mat4 u_proj;\n' +
        'uniform mat4 u_norm;\n' +
        'uniform mat4 u_viewInvert;\n' +
        '\n' +
        'out highp vec2 v_uv;\n' +
        'out vec3 v_pos;\n' +
        'out vec3 v_norm;\n' +
        'out vec3 v_camPos;\n' +
        '\n' +
        'void main() {\n' +
            'v_uv = a_uv;\n' +
            'v_pos = (u_world * vec4(a_position.xyz, 1.0)).xyz;\n' +
            'v_norm = u_norm * a_norm;\n' +
            'v_camPos = u_viewInvert[3].xyz;\n' +
            'gl_Position = u_proj * u_view * vec4(v_pos.xyz, 1.0);\n' +
        '}',

    fs: '#version 300 es\n' +
        'precision mediump float;\n' +
        '\n' +
        'in highp vec2 v_uv;\n' +
        'in vec3 v_pos;\n' +
        'in vec3 v_norm;\n' +
        'in vec3 v_camPos;\n' +
        '\n' +
        'uniform sampler2D u_texture;\n' +
        'unifrom vec3 u_lightPos;\n' +
        '\n' +
        'out vec4 finalColor;\n' +
        '\n' +
        'void main() {\n' +
            'vec4 baseColor = texture(u_texture, v_uv);\n' +
            'vec3 lightColor = vec3(1.0, 1.0, 1.0);\n' +
            '\n' +
            'float ambientStrength = 0.15;\n' +
            'vec3 ambientColor = lightColor * ambientStrength;\n' +
            '\n' +
            'vec3 surfaceToLight = normalize(u_lightPos - v_pos);\n' +
            'float diffuseStrength = 0.5;\n' +
            'float diffAngle = max(dot(v_norm, surfaceToLight), 0.0);\n' +
            'vec3 diffuseColor = lightColor * diffAngle * diffuseStrength;\n' +
            '\n' +
            'vec3 surfaceToCam = normalize(v_camPos - v_pos);\n' +
            'float specularStrength = 0.2;\n' +
            'float specularShininess = 200.0;\n' +
            'vec3 reflectDir = reflect(-surfaceToLight, v_norm);\n' +
            'float rate = pow(max(dot(reflectDir, surfaceToCam), 0.0), specularShininess);\n' +
            'vec3 specularColor = lightColor * rate * specularStrength;\n' +
            '\n' +
            'finalColor = vec4((ambientColor + diffuseColor + specularColor) * baseColor.rgb, 1.0);\n' +
        '}',

} );

export { PointlightShader };
