import { Quaternion } from '../math/Quaternion';

function weightLinearLerp( out, v1, v2, t ) {

    for ( let i = 0; i < v1.length; i ++ )
        out[ i ] = v1[ i ] + t * ( v2[ i ] - v1[ i ] ); // eslint-disable-line

    return out;

}

function quaternionLinearSlerp( out, v1, v2, t ) {

    Quaternion.slerp( out, v1, v2, t );

}

function Animator( rawData ) {

    this.raw = rawData;
    this._parseRawData( rawData );
    this._playList = [];

}

Object.assign( Animator.prototype, {

    _parseRawData( raw ) {

        this.animations = Animator.types[ raw.type ]( raw );

    },

    playAnimation( name ) {

        this.animations.forEach( ( animation ) => {

            if ( animation.name === name )
                this._playList = [ animation ];

        } );

        return this;

    },

    playAll() {

        this._playList = [];
        this.animations.forEach( animation => this._playList.push( animation ) );

        return this;

    },

    update( dtime ) {

        for ( let i = 0; i < this._playList.length; i ++ ) {

            const clips = this._playList[ i ].clips;
            for ( let j = 0; j < clips.length; j ++ ) {

                const clip = clips[ j ];
                let {
                    sumTime, currentIdx, currentTime,
                } = clip;
                const {
                    minTime, maxTime, times, values, lerpFun, setTarget,
                } = clip;

                sumTime += dtime;
                currentTime += dtime;
                if ( currentTime > maxTime ) {

                    currentTime %= maxTime;
                    currentIdx = 0;

                }

                clip.sumTime = sumTime;
                clip.currentTime = currentTime;
                if ( currentTime < minTime ) continue;

                for ( let t = currentIdx; t < times.length; t ++ )
                    if ( currentTime < times[ t ] ) {

                        currentIdx = t - 1;
                        break;

                    }
                clip.currentIdx = currentIdx;

                const timePercent = ( currentTime - times[ currentIdx ] ) / ( times[ currentIdx + 1 ] - times[ currentIdx ] );
                lerpFun( clip.currentValue, values[ currentIdx ], values[ currentIdx + 1 ], timePercent );
                setTarget( clip.currentValue );

            }

        }

    },

} );

Object.assign( Animator, {
    types: {

        gltf( raw ) {

            const { animations, rootNode } = raw;
            const result = [];
            for ( let i = 0; i < animations.length; i ++ ) {

                const animation = animations[ i ];
                const { name, clips } = animation;
                const clipsRes = [];
                for ( let j = 0; j < clips.length; j ++ ) {

                    const clip = clips[ j ];
                    const {
                        findFlag, findValue, targetProp, times, values, extras, // method,
                    } = clip;

                    const node = rootNode.findInChildren( findFlag, findValue );

                    let lerpFun;
                    let setTarget = function ( v ) {

                        node[ targetProp ] = v;

                    };
                    switch ( targetProp ) {

                    case 'quaternion':
                        lerpFun = quaternionLinearSlerp;
                        break;
                    case 'weights':
                        lerpFun = weightLinearLerp;
                        setTarget = function ( v ) {

                            const uniformobj = {};
                            uniformobj[ extras.uniformName ] = v;
                            node.model.setUniformObj( uniformobj );

                        };
                        break;
                    case 'position':
                    case 'scale':
                        lerpFun = weightLinearLerp;
                        break;
                    default:
                        break;

                    }

                    if ( ! lerpFun ) continue;

                    const clipRes = {
                        setTarget,
                        times,
                        values,
                        lerpFun,
                        minTime: times[ 0 ],
                        maxTime: times[ times.length - 1 ],
                        sumTime: 0,
                        currentIdx: 0,
                        currentTime: 0,
                        currentValue: values[ 0 ].slice ? values[ 0 ].slice() : values[ 0 ],
                    };

                    clipsRes.push( clipRes );

                }

                result.push( { name, clips: clipsRes } );

            }

            return result;

        },

    },
} );

export { Animator };
