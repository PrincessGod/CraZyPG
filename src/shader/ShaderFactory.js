import { EnvTexture, ShaderParams } from '../core/constant';
import { ShaderSlices } from './ShaderSlices';

const attribDefinesMap = {};
attribDefinesMap[ ShaderParams.ATTRIB_UV_NAME ] = 'HAS_UV';
attribDefinesMap[ ShaderParams.ATTRIB_NORMAL_NAME ] = 'HAS_NORMAL';
attribDefinesMap[ ShaderParams.ATTRIB_JOINT_0_NAME ] = 'HAS_SKIN';
attribDefinesMap[ ShaderParams.ATTRIB_COLOR_NAME ] = 'HAS_COLOR';

const ShaderFactory = {};

Object.assign( ShaderFactory, {

    parseVersion( v ) {

        return `#version ${v}\n`;

    },

    parseShaderName( name ) {

        return `#define SHADER_NAME ${name}\n`;

    },

    parseDefineObjFromPrimitive( primitive ) {

        const attributes = Object.keys( primitive.bufferInfo.attribs );
        const attributesInfluence = Object.keys( attribDefinesMap );
        return attributes.filter( a => attributesInfluence.indexOf( a ) > - 1 ).reduce( ( o, a ) => {

            o[ attribDefinesMap[ a ] ] = ''; // eslint-disable-line
            return o;

        }, {} );

    },

    parseDefineObjFromMaterial( material ) {

        const defineObj = {
            VERTEX_PRECISION: material.vertexPrecision,
            FRAGMENT_PRECISION: material.fragmentPrecision,
        };

        if ( material.baseTexture )
            defineObj.HAS_BASETEXTURE = '';
        if ( ! material.cull )
            defineObj.DOUBLE_SIDE = '';
        if ( material.normalTexture )
            defineObj.HAS_NORMALTEXTURE = '';
        if ( material.bumpTexture )
            defineObj.HAS_BUMPTEXTURE = '';
        if ( material.emissiveTexture )
            defineObj.HAS_EMISSIVETEXTURE = '';
        if ( material.specularTexture )
            defineObj.HAS_SPECULARTEXTURE = '';
        if ( material.aoTexture )
            defineObj.HAS_AOTEXTURE = '';
        if ( material.envTexture ) {

            defineObj.HAS_ENVTEXTURE = '';
            switch ( material.envMode ) {

            case EnvTexture.REFLECTION:
                defineObj.ENVTEXTURE_REFLECTION = '';
                break;
            case EnvTexture.REFRACTION:
                break;
            default:
                console.error( `unknown envMode ${material.envMode}` );
                break;

            }

            switch ( material.envType ) {

            case EnvTexture.CUBE:
                defineObj.ENVTEXTURE_CUBE = '';
                break;
            default:
                console.error( `unknown envType ${material.envType}` );
                break;

            }

            switch ( material.envBlend ) {

            case EnvTexture.MULTIPLY:
                defineObj.ENVTEXTURE_MULTIPLY = '';
                break;
            case EnvTexture.MIX:
                defineObj.ENVTEXTURE_MIX = '';
                break;
            case EnvTexture.ADD:
                defineObj.ENVTEXTURE_ADD = '';
                break;
            default:
                console.error( `unknown envBlend ${material.envBlend}` );
                break;

            }

        }
        if ( material.blend )
            defineObj.ALPHA_BLEND = '';
        if ( material.alphaTexture )
            defineObj.HAS_ALPHATEXTURE = '';
        if ( material.dither )
            defineObj.DITHER = '';
        if ( material.lightTexture )
            defineObj.HAS_LIGHTTEXTURE = '';
        if ( material.alphaMask !== undefined )
            defineObj.ALPHA_MASK = material.alphaMask;
        if ( material.displacementTexture )
            defineObj.HAS_DISPLACEMENTTEXTURE = '';
        if ( material.metalnessTexture )
            defineObj.HAS_METALNESSTEXTURE = '';
        if ( material.roughnessTexture )
            defineObj.HAS_ROUGHNESSTEXTURE = '';

        Object.assign( defineObj, material.customDefine );

        return defineObj;

    },

    parseDefineObjFromLightManager( lightManager ) {

        const defineObj = {};

        if ( lightManager.directionalLights.length > 0 )
            defineObj.DIR_LIGHT_NUM = lightManager.directionalLights.length;
        if ( lightManager.pointLights.length > 0 )
            defineObj.POINT_LIGHT_NUM = lightManager.pointLights.length;
        if ( lightManager.spotLights.length > 0 )
            defineObj.SPOT_LIGHT_NUM = lightManager.spotLights.length;

        return defineObj;

    },

    parseDefineObjFromFog( fog ) {

        const defineObj = {};

        if ( fog && ( fog.isFog || fog.isFogEXP2 ) ) {

            defineObj.HAS_FOG = '';

            if ( fog.isFogEXP2 )
                defineObj.FOG_EXP2 = '';

        }

        return defineObj;

    },

    parseDefineObjFromRenderer( renderer ) {

        const defineObj = {};

        if ( renderer.logDepth )
            defineObj.LOGDEPTH = '';

        return defineObj;

    },

    parseDefineObj( defines ) {

        return `${Object.keys( defines ).map( key => `#define ${key} ${defines[ key ]}` ).join( '\n' )}\n`;

    },

    parsePrecision( p ) {

        return `precision ${p} float;\n` +
               `precision ${p} int;\n`;

    },

    parseIncludes( src ) {

        const pattern = /^[ \t]*#include +<([\w\d.]+)>/gm;

        function replace( match, include ) {

            const slice = ShaderSlices[ include ];

            if ( slice === undefined )

                throw new TypeError( `can not find shader slice #include <${include}>` );

            return ShaderFactory.parseIncludes( slice );

        }

        return src.replace( pattern, replace );

    },

} );

export { ShaderFactory };
