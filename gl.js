const CZPG = {};
function getContext(canvasId) {
    let canvas = document.getElementById(canvasId);
    var gl = canvas.getContext('webgl2');
    if(!gl) {
        console.error("Please use a decent browser, this browser not support Webgl2Context.");
        return null;
    }
    console.log(gl);
    CZPG.gl = gl;
    return CZPG;
}

function clear() {
    let gl = this.gl;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return CZPG;
}

function setSize(width, height) {
    let gl = this.gl;
    gl.canvas.style.width = width;
    gl.canvas.style.height = height;
    gl.canvas.width = gl.canvas.clientWidth;
    gl.canvas.height = gl.canvas.clientHeight;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    return CZPG;
}

Object.assign(CZPG, {getContext, clear, setSize});
