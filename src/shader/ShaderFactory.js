import { ShaderSlices } from './ShaderSlices';

const ShaderFactory = {};

Object.assign( ShaderFactory, {

    parseVersion( v ) {

        return `#version ${v}\n`;

    },

    parseShaderName( name ) {

        return `#define SHADER_NAME ${name}`;

    },

    parseDefines( defines ) {

        return Object.keys( defines ).map( key => `#define ${key} ${defines[ key ]}` ).join( '\n' );

    },

    parsePercision( p ) {

        return `precision ${p} float;\n
                precision ${p} int;\n`;

    },

    parseIncludes( src ) {

        const pattern = /^[ \t]*#include +<([\w\d.]+)>/gm;

        function replace( match, include ) {

            const slice = ShaderSlices[ include ];

            if ( slice === undefined )

                throw new TypeError( `can not find shader slice #include <${include}>` );

            return ShaderFactory.parseIncludes( replace );

        }

        return src.replace( pattern, replace );

    },

} );
