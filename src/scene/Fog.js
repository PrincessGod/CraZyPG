function Fog( color = [ 1, 1, 1 ], near = 1, far = 1000 ) {

    this.color = color;
    this.near = near;
    this.far = far;
    this._uniformObj = {
        u_fogColor: this.color,
        u_fogNear: this.near,
        u_fogFar: this.far,
    };

}

Object.defineProperties( Fog.prototype, {

    uniformObj: {

        get() {

            return this._uniformObj;

        },

    },

} );

Fog.prototype.isFog = true;

export { Fog };
