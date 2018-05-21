
function _h( f, c ) {

    return function ( ...args ) {

        let res;
        if ( ! c.apply( this, args ) )
            res = f.apply( this, args );
        return res;

    };

}

const cache = {

    pixelStorei: {},

};

function States( gl ) {

    const pixelStorei = _h( gl.pixelStorei, ( pname, param ) => {

        const cached = ( cache.pixelStorei[ pname ] === param );
        cache.pixelStorei[ pname ] = param;
        return cached;

    } ).bind( gl );

    return {
        pixelStorei,
    };

}

export { States };
