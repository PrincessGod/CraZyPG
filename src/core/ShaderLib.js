import { Shader } from './Shader.js';

class GridAxisShader extends Shader{
    constructor (gl, projMat) {
        let vs = '#version 300 es\n'+
            'in vec3 a_Position;\n'+
            'layout(location=4) in float a_Color;\n'+
            '\n'+
            'uniform mat4 u_world;\n'+
            'uniform mat4 u_view;\n'+
            'uniform mat4 u_proj;\n'+
            'uniform vec3 u_colors[4];\n'+
            '\n'+
            'out vec3 v_color;\n'+
            '\n'+
            'void main() {\n'+
            '    v_color = u_colors[int(a_Color)];\n'+
            '    gl_Position = u_proj * u_view * u_world * vec4(a_Position, 1.0);\n'+
            '}';

        let fs = '#version 300 es\n'+
            'precision mediump float;\n'+
            '\n'+
            'in vec3 v_color;\n'+
            'out vec4 finalColor;\n'+
            '\n'+
            'void main() {\n'+
            '    finalColor = vec4(v_color, 1.0);\n'+
            '}';

        super(gl, vs, fs);

        this.setPerspective(projMat);

        var uColor = gl.getUniformLocation(this.program, 'u_colors');
        gl.uniform3fv(uColor, [0.5,0.5,0.5, 1,0,0, 0,1,0, 0,0,1]);

        gl.useProgram(null);
    }
}

export { GridAxisShader };
