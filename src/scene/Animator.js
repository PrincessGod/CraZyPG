import { Quaternion } from '../math/Quaternion';

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
                while ( currentTime > maxTime )
                    currentTime -= maxTime;

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
                Quaternion.normalize( clip.currentValue, clip.currentValue );
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
                        findFlag, findValue, targetProp, times, values, // method,
                    } = clip;

                    const node = rootNode.findInChildren( findFlag, findValue );
                    if ( ! node || ! node[ targetProp ] ) continue;

                    let lerpFun;

                    switch ( targetProp ) {

                    case 'quaternion':
                        lerpFun = Quaternion.slerp;
                        break;
                    default:
                        break;

                    }

                    if ( ! lerpFun ) continue;

                    const clipRes = {
                        setTarget( v ) {

                            node[ targetProp ] = v;

                        },
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
