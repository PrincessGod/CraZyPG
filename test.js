class TestShader extends CZPG.RawShader {

    constructor() {

        super( 'vs', 'fs' );

    }

}

class TestMaterial extends CZPG.Material {

    constructor( opts ) {

        super( TestShader, opts );

    }

}


const renderer = new CZPG.WebGL2Renderer( 'glpaper' ).setSize( '100%', '100%' );
const scene = new CZPG.Scene( renderer );
const baseTexture = new CZPG.Texture2D( { src: './resource/UV_Grid_Lrg.jpg' } );
const normalTexture = new CZPG.Texture2D( { src: './resource/normal.png' } );
const bumpTexture = new CZPG.Texture2D( { src: './resource/bump.jpg' } );
const displacementTexture = new CZPG.Texture2D( {
    src: [
        100, 0, 0, 255,
        150, 0, 0, 255,
        200, 0, 0, 255,
        250, 0, 0, 255,
    ],
    minMag: 9728,
} );
const envTexture = new CZPG.TextureCubeMap( {
    src: [
        './resource/grimmnight_right.png',
        './resource/grimmnight_left.png',
        './resource/grimmnight_top.png',
        './resource/grimmnight_bottom.png',
        './resource/grimmnight_back.png',
        './resource/grimmnight_front.png',
    ],
} );
const camera = new CZPG.PerspectiveCamera( 45, renderer.canvas.width / renderer.canvas.height );

scene.fog = new CZPG.Fog( [ 1, 0, 0 ], 1, 50 );
scene.fog = new CZPG.FogEXP2( [ 0, 0, 0 ], 0.02 );

const cameraControler = new CZPG.OrbitControls( camera, renderer.canvas, scene.controler );
cameraControler.enableDamping = true;
camera.position = [ 0, 4, 10 ];

const ambientLight = new CZPG.AmbientLight( [ 0.1, 0.1, 0.1 ], 1 );
const directLight = new CZPG.DirectionalLight( [ 1, 1, 1 ], 0.1 );
const pointLight = new CZPG.PointLight( [ 1, 0, 1 ], 0.5, 2 );
const spotLight = new CZPG.SpotLight( [ 1, 1, 0 ], 0.5, 20, Math.PI / 10, 0.3 ); spotLight.position = [ 0, 5, 0 ]; spotLight.rotation = [ Math.PI / 2 - 0.5, 0, 0 ];
scene.add( ambientLight, directLight, pointLight, spotLight );

const testMaterial = new TestMaterial( { uniformObj: { u_texture: envTexture } } );
const basicMaterial = new CZPG.BasicModelMaterial( {
    baseTexture,
    envTexture,
    envBlend: CZPG.EnvTexture.ADD,
    // reflectivity: 0.2,
    // envMode: CZPG.EnvTexture.REFRACTION,
    // refractionRation: 0.9,
    // alphaTexture: baseTexture,
    // blend: true,
    // alphaMask: 0.5,
    // lightTexture: baseTexture,
    // lightTextureIntensity: 1,
    // aoTexture: baseTexture,
    // aoTextureIntensity: 2.0,
    // specularTexture: baseTexture,
} );
const lambertMaterial = new CZPG.LambertModelMaterial( {
    baseColor: [ 1, 1, 1, 1 ],
    baseTexture: bumpTexture,
    cull: false,
    // alphaTexture: bumpTexture,
    // blend: true,
    // blendFuncSeparate: [ CZPG.BlendFactor.SRC_ALPHA, CZPG.BlendFactor.SRC_ALPHA, CZPG.BlendFactor.ONE_MINUS_SRC_ALPHA, CZPG.BlendFactor.ONE_MINUS_SRC_ALPHA ],
    // alphaMask: 0.5,
    // aoTexture: bumpTexture,
    // aoTextureIntensity: 0.5,
    // envTexture,
    // reflectivity: 0.2,
    // refractionRation: 0.9,
    // envMode: CZPG.EnvTexture.REFRACTION,
    // envBlend: CZPG.EnvTexture.ADD,
    // specularTexture: bumpTexture,
    // lightTexture: bumpTexture,
    // lightTextureIntensity: 1,
} );
const normalMaterial = new CZPG.NormalModelMaterial( { cull: false, bumpTexture } );
const phongMaterial = new CZPG.PhongModelMaterial( {
    cull: false,
    baseTexture: displacementTexture,
    shininess: 10,
    specular: [ 0.5, 0.5, 0.5 ],
    dither: true,
    displacementTexture,
    displacementScale: 2,
    displacementBias: 0.1,
} );
const toonMaterial = new CZPG.ToonModelMaterial( {
    cull: false, baseTexture, shininess: 10, specular: [ 0.5, 0.5, 0.5 ], dither: true,
} );
const quad = new CZPG.Model( new CZPG.Quad( { offset: 0, size: 8 } ), phongMaterial );
quad.rotation = [ - Math.PI / 2, 0, 0 ];
// scene.add( quad );

const cube = new CZPG.Model( new CZPG.Cube( { offset: 0 } ), phongMaterial );
// cube.position = [ 1, 0.5, 0 ];
scene.add( cube );

const sphere = new CZPG.Model( new CZPG.Sphere(), toonMaterial );
// scene.add( sphere );

const pointLightMaterial = new CZPG.BasicModelMaterial( { baseColor: [ 0.5, 0, 0.5, 1 ] } );
const pointLightObj = new CZPG.Model( new CZPG.Sphere( {
    radius: 0.05, offset: 3, subdivAixs: 40, subdivHeight: 20,
} ), pointLightMaterial );
// scene.add( pointLightObj );

const spotLightMaterial = new CZPG.BasicModelMaterial( { baseColor: [ 0.5, 0.5, 0, 1 ] } );
const spotLightObj = new CZPG.Model( new CZPG.Sphere( {
    radius: 0.05, offset: 3, subdivAixs: 40, subdivHeight: 20,
} ), spotLightMaterial );
// scene.add( spotLightObj );

const gridMaterial = new CZPG.BasicLineMaterial();
const grid = new CZPG.Model( new CZPG.GridAxis( { size: 3, div: 1, offset: 2 } ), gridMaterial );
scene.add( grid );

scene.currentCamera = camera;

const loop = new CZPG.Render( ( ( timespan ) => {

    if ( renderer.fixCanvasToDisplay( devicePixelRatio ) )
        camera.updateProjMatrix( renderer.canvas.width / renderer.canvas.height );
    cameraControler.update();

    // model.primitive.offset = 3 - 3 * Math.ceil( Math.sin( loop.lastTime * 0.003 ) );
    // cube.primitive.offset = 3 - 3 * Math.ceil( Math.sin( loop.lastTime * 0.003 ) );
    grid.primitive.offset = 2 - 2 * Math.ceil( Math.sin( loop.lastTime * 0.006 ) );

    pointLight.position = [ 1.2 * Math.sin( loop.lastTime * 0.0003 ) + 1, 1.2 * Math.cos( loop.lastTime * 0.0003 ), 1.2 * Math.sin( loop.lastTime * 0.0003 ) ];
    spotLight.position = [ 0.8 * Math.sin( loop.lastTime * 0.0003 ), 1.2 * Math.cos( loop.lastTime * 0.0003 ) + 5, 0.6 * Math.cos( loop.lastTime * 0.0003 ) - 3 ];
    pointLightObj.position = pointLight.position;
    spotLightObj.position = spotLight.position;
    scene.render();

} ) ).start();
