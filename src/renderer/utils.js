function isWebGL2( gl ) {

    return !! gl.texStorage2D;

}

const glEnumToString = ( function () {

    const haveEnumsForType = {};
    const enums = {};

    function addEnums( gl ) {

        const type = gl.constructor.name;
        if ( ! haveEnumsForType[ type ] ) {

            /* eslint-disable */
            for ( const key in gl )
                if ( typeof gl[ key ] === 'number' ) { 

                    const existing = enums[ gl[ key ] ];
                    enums[ gl[ key ] ] = existing ? `${existing} | ${key}` : key;

                }
            /* eslint-enable */
            haveEnumsForType[ type ] = true;

        }

    }

    return function ( gl, value ) {

        addEnums( gl );
        return enums[ value ] || ( `0x${value.toString( 16 )}` );

    };

}() );

export { isWebGL2, glEnumToString };
