export const pick = ( obj, keys ) =>
    Object.keys( obj )
        .filter( i => keys.includes( i ) )
        .reduce( ( acc, key ) => {

            acc[ key ] = obj[ key ];
            return acc;

        }, {} );

export function objEqual( obj1, obj2 ) {

    const obj1keys = Object.keys( obj1 );
    const obj2Keys = Object.keys( obj2 );

    if ( obj1keys.length !== obj2Keys.length )
        return false;

    if ( obj1keys.filter( k => obj2Keys.indexOf( k ) < 0 ).length > 0 )
        return false;

    return obj1keys.filter( k => obj1[ k ] !== obj2[ k ] ).length === 0;

}
