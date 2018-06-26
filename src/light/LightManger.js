import { Matrix4 } from '../math/Matrix4';
import { AmbientLight } from './AmbientLight';
import { DirectionalLight } from './DirectionalLight';
import { PointLight } from './PointLight';
import { SpotLight } from './SpotLight';

function LightManager() {

    this.amibientLight = null;
    this.directionalLights = [];
    this.pointLights = [];
    this.spotLights = [];

    this._uniformObj = {};

}

Object.assign( LightManager.prototype, {

    add( ...lights ) {

        lights.forEach( ( light ) => {

            if ( Array.isArray( light ) ) return this.addLight( ...light );

            if ( light instanceof AmbientLight )
                this.amibientLight = light;
            else if ( light instanceof DirectionalLight && this.directionalLights.indexOf( light ) < 0 )
                this.directionalLights.push( light );
            else if ( light instanceof PointLight && this.pointLights.indexOf( light ) < 0 )
                this.pointLights.push( light );
            else if ( light instanceof SpotLight && this.spotLights.indexOf( light ) < 0 )
                this.spotLights.push( light );

        } );

        this._uniformObj = {};
        return this;

    },

    remove( ...lights ) {

        let idx = - 1;

        lights.forEach( ( light ) => {

            if ( Array.isArray( light ) ) return this.remove( ...light );


            if ( light instanceof AmbientLight ) {

                if ( this.amibientLight === light )
                    this.amibientLight = null;

            } else if ( light instanceof DirectionalLight ) {

                idx = this.directionalLights.indexOf( light );
                if ( idx > - 1 )
                    this.directionalLights.splice( idx, 1 );

            } else if ( light instanceof PointLight ) {

                idx = this.pointLights.indexOf( light );
                if ( idx > - 1 )
                    this.pointLights.splice( idx, 1 );

            } else if ( light instanceof SpotLight ) {

                idx = this.spotLights.indexOf( light );
                if ( idx > - 1 )
                    this.spotLights.splice( idx, 1 );

            }

        } );

        this._uniformObj = {};
        return this;

    },

    updateUniformObj( viewMat ) {

        const uniformObj = this._uniformObj;

        if ( this.amibientLight )
            uniformObj.u_ambientLightColor = [ this.amibientLight.color[ 0 ] * this.amibientLight.intensity, this.amibientLight.color[ 1 ] * this.amibientLight.intensity, this.amibientLight.color[ 2 ] * this.amibientLight.intensity ];

        if ( this.directionalLights )
            for ( let i = 0; i < this.directionalLights.length; i ++ ) {

                uniformObj[ `u_directionalLights[${i}].color` ] = [ this.directionalLights[ i ].color[ 0 ] * this.directionalLights[ i ].intensity, this.directionalLights[ i ].color[ 1 ] * this.directionalLights[ i ].intensity, this.directionalLights[ i ].color[ 2 ] * this.directionalLights[ i ].intensity ];
                uniformObj[ `u_directionalLights[${i}].direction` ] = this.directionalLights[ i ].transform.forward.slice( 0, 3 );

            }

        if ( this.pointLights )
            for ( let i = 0; i < this.pointLights.length; i ++ ) {

                const pointLight = this.pointLights[ i ];

                uniformObj[ `u_pointLights[${i}].color` ] = [ pointLight.color[ 0 ] * pointLight.intensity, pointLight.color[ 1 ] * pointLight.intensity, pointLight.color[ 2 ] * pointLight.intensity ];
                uniformObj[ `u_pointLights[${i}].position` ] = pointLight.position;
                uniformObj[ `u_pointLights[${i}].distance` ] = pointLight.distance;
                uniformObj[ `u_pointLights[${i}].decay` ] = ( pointLight.distance === 0 ) ? 0 : pointLight.decay;

            }

        if ( this.spotLights )
            for ( let i = 0; i < this.spotLights.length; i ++ ) {

                const spotLight = this.spotLights[ i ];
                const lightPoistion = [ 0, 0, 0, 1 ];
                Matrix4.transformVec4( lightPoistion, spotLight.transform.matrix.raw, lightPoistion );
                Matrix4.transformVec4( lightPoistion, viewMat, lightPoistion );

                uniformObj[ `u_spotLights[${i}].color` ] = [ spotLight.color[ 0 ] * spotLight.intensity, spotLight.color[ 1 ] * spotLight.intensity, spotLight.color[ 2 ] * spotLight.intensity ];
                uniformObj[ `u_spotLights[${i}].position` ] = lightPoistion.slice( 0, 3 );
                uniformObj[ `u_spotLights[${i}].direction` ] = spotLight.transform.forward.slice( 0, 3 );
                uniformObj[ `u_spotLights[${i}].distance` ] = spotLight.distance;
                uniformObj[ `u_spotLights[${i}].coneCos` ] = spotLight.angle;
                uniformObj[ `u_spotLights[${i}].penumbraCos` ] = Math.cos( spotLight.angle * ( 1 - spotLight.penumbra ) );
                uniformObj[ `u_spotLights[${i}].decay` ] = ( spotLight.distance === 0 ) ? 0 : spotLight.decay;

            }

        return this._uniformObj;

    },

} );

Object.defineProperties( LightManager.prototype, {

    uniformObj: {

        get() {

            return this._uniformObj;

        },

    },

} );

export { LightManager };
