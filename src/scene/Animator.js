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

    resetAll() {

        this.animations.forEach( ( animate ) => {

            animate.clips.forEach( ( clip ) => {

                clip.currentTime = 0; // eslint-disable-line
                clip.currentIdx = 0; // eslint-disable-line
                clip.sumTime = 0; // eslint-disable-line

            } );

        } );

        return this;

    },

    playAnimation( name ) {

        this._playList = [];
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
                    minTime, maxTime, times, values, lerpFun, setTarget, animateMaxTime, animateMinTime,
                } = clip;

                sumTime += dtime;
                currentTime += dtime;
                if ( currentTime > animateMaxTime ) {

                    currentTime %= animateMaxTime;
                    currentIdx = 0;

                }

                clip.sumTime = sumTime;
                clip.currentTime = currentTime;
                if ( currentTime < animateMinTime || currentTime < minTime || currentTime > maxTime ) continue;

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
                let animateMaxTime = Number.NEGATIVE_INFINITY;
                let animateMinTime = Number.POSITIVE_INFINITY;
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

                    animateMinTime = animateMinTime < times[ 0 ] ? animateMinTime : times[ 0 ];
                    animateMaxTime = animateMaxTime > times[ times.length - 1 ] ? animateMaxTime : times[ times.length - 1 ];
                    const clipRes = {
                        setTarget,
                        times,
                        values,
                        lerpFun,
                        sumTime: 0,
                        minTime: times[ 0 ],
                        maxTime: times[ times.length - 1 ],
                        currentIdx: 0,
                        currentTime: 0,
                        currentValue: values[ 0 ].slice ? values[ 0 ].slice() : values[ 0 ],
                    };

                    clipsRes.push( clipRes );

                }

                clipsRes.forEach( ( clip ) => {

                    clip.animateMaxTime = animateMaxTime; // eslint-disable-line
                    clip.animateMinTime = animateMinTime; // eslint-disable-line

                } );

                result.push( { name, clips: clipsRes } );

            }

            return result;

        },

    },
} );

export { Animator };
