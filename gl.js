const CZPG = {};
function getContext(canvasId) {
    let canvas = document.getElementById(canvasId);
    let gl = canvas.getContext('webgl2');
    if(!gl) {
        console.error("Please use a decent browser, this browser not support Webgl2Context.");
        return null;
    }
    CZPG.gl = gl;
    return CZPG;
}

function clear() {
    let gl = this.gl;
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return CZPG;
}

function setSize(width, height, mutiplier) {
    let gl = this.gl;
    mutiplier = mutiplier || 1.0;
    mutiplier = Math.max(0, mutiplier);
    gl.canvas.style.width = width;
    gl.canvas.style.height = height;
    gl.canvas.width = gl.canvas.clientWidth * mutiplier;
    gl.canvas.height = gl.canvas.clientHeight * mutiplier;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    return CZPG;
}

Object.assign(CZPG, {getContext, clear, setSize});
