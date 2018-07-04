function FogEXP2( color = [ 1, 1, 1 ], density = 0.00025 ) {

    this.color = color;
    this.density = density;
    this._uniformObj = {
        u_fogColor: this.color,
        u_fogDensity: this.density,
    };

}

Object.defineProperties( FogEXP2.prototype, {

    uniformObj: {

        get() {

            return this._uniformObj;

        },

    },

} );

FogEXP2.prototype.isFogEXP2 = true;

export { FogEXP2 };
