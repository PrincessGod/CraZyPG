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

            switch ( light ) {

            case light instanceof AmbientLight:
                this.amibientLight = light;
                break;
            case light instanceof DirectionalLight:
                if ( this.directionalLights.indexOf( light ) < 0 )
                    this.directionalLights.push( light );
                break;
            case light instanceof PointLight:
                if ( this.pointLights.indexOf( light ) < 0 )
                    this.pointLights.push( light );
                break;
            case light instanceof SpotLight:
                if ( this.spotLights.indexOf( light ) < 0 )
                    this.spotLights.push( light );
                break;
            default:
                break;

            }

        } );

        this._uniformObj = {};
        return this;

    },

    remove( ...lights ) {

        let idx = - 1;

        lights.forEach( ( light ) => {

            if ( Array.isArray( light ) ) return this.remove( ...light );

            switch ( light ) {

            case light instanceof AmbientLight:
                if ( this.amibientLight === light )
                    this.amibientLight = null;
                break;
            case light instanceof DirectionalLight:
                idx = this.directionalLights.indexOf( light );
                if ( idx > - 1 )
                    this.directionalLights.splice( idx, 1 );
                break;
            case light instanceof PointLight:
                idx = this.pointLights.indexOf( light );
                if ( idx > - 1 )
                    this.pointLights.splice( idx, 1 );
                break;
            case light instanceof SpotLight:
                idx = this.spotLights.indexOf( light );
                if ( idx > - 1 )
                    this.spotLights.splice( idx, 1 );
                break;
            default:
                break;

            }

        } );

        this._uniformObj = {};
        return this;

    },

    getUniformObj( viewMat ) {

        const uniformObj = this._uniformObj;

        if ( this.amibientLight )
            uniformObj.u_ambientLightColor = [ this.amibientLight.color[ 0 ] * this.amibientLight.intensity, this.amibientLight.color[ 1 ] * this.amibientLight.intensity, this.amibientLight.color[ 2 ] * this.amibientLight.intensity ];

        if ( this.directionalLights )
            for ( let i = 0; i < this.directionalLights.length; i ++ ) {

                uniformObj[ `u_directionalLights[${i}].color` ] = [ this.directionalLights[ i ].color[ 0 ] * this.directionalLights[ i ].intensity, this.directionalLights[ i ].color[ 1 ] * this.directionalLights[ i ].intensity, this.directionalLights[ i ].color[ 2 ] * this.directionalLights[ i ].intensity ];
                uniformObj[ `u_directionalLights[${i}].direction` ] = this.directionalLights[ i ].transform.forward;

            }

        if ( this.pointLights )
            for ( let i = 0; i < this.pointLights.length; i ++ ) {

                const pointLight = this.pointLights[ i ];
                const lightPoistion = [ 0, 0, 0, 0 ];
                Matrix4.transformVec4( lightPoistion, pointLight.transform.matrix.raw, lightPoistion );
                Matrix4.transformVec4( lightPoistion, viewMat, lightPoistion );

                uniformObj[ `u_pointLights[${i}].color` ] = [ pointLight[ i ].color[ 0 ] * pointLight[ i ].intensity, pointLight[ i ].color[ 1 ] * pointLight[ i ].intensity, pointLight[ i ].color[ 2 ] * pointLight[ i ].intensity ];
                uniformObj[ `u_pointLights[${i}].position` ] = lightPoistion;
                uniformObj[ `u_pointLights[${i}].distance` ] = pointLight.distance;
                uniformObj[ `u_pointLights[${i}].decay` ] = ( pointLight.distance === 0 ) ? 0 : pointLight.decay;

            }

        if ( this.spotLights )
            for ( let i = 0; i < this.spotLights.length; i ++ ) {

                const spotLight = this.spotLights[ i ];
                const lightPoistion = [ 0, 0, 0, 0 ];
                Matrix4.transformVec4( lightPoistion, spotLight.transform.matrix.raw, lightPoistion );
                Matrix4.transformVec4( lightPoistion, viewMat, lightPoistion );

                uniformObj[ `u_spotLights[${i}].color` ] = [ spotLight[ i ].color[ 0 ] * spotLight[ i ].intensity, spotLight[ i ].color[ 1 ] * spotLight[ i ].intensity, spotLight[ i ].color[ 2 ] * spotLight[ i ].intensity ];
                uniformObj[ `u_spotLights[${i}].position` ] = lightPoistion;
                uniformObj[ `u_spotLights[${i}].direction` ] = spotLight.transform.forward;
                uniformObj[ `u_spotLights[${i}].distance` ] = spotLight.distance;
                uniformObj[ `u_spotLights[${i}].coneCos` ] = spotLight.angle;
                uniformObj[ `u_spotLights[${i}].penumbraCos` ] = Math.cos( spotLight.angle * ( 1 - spotLight.penumbra ) );
                uniformObj[ `u_spotLights[${i}].decay` ] = ( spotLight.distance === 0 ) ? 0 : spotLight.decay;

            }

        return this._uniformObj;

    },

} );

export { LightManager };
