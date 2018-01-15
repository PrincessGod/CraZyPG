function Scene() {

    this.models = [];
    this.shaders = [];
    this.shadersMap = [];

}

Object.assign( Scene.prototype, {

    add( ...objs ) {

        for ( let i = 0; i < objs.length; i ++ )
            if ( Array.isArray( objs[ i ] ) )
                this.add( ...objs[ i ] );
            else
                this.addModelToShader( objs[ i ].shader, objs[ i ].model );

    },

    addModelToShader( shader, model ) {

        if ( Array.isArray( model ) )
            model.forEach( m => this.addModelToShader( shader, m ) );
        else {

            const shaderIdx = this.shadersMap.indexOf( shader );
            let modelIdx = - 1;
            if ( shaderIdx > - 1 ) {

                modelIdx = this.shaders[ shaderIdx ].models.indexOf( model );
                if ( modelIdx < 0 )
                    this.shaders[ shaderIdx ].models.push( model );

            } else {

                const shaderObj = { shader, models: [ model ] };
                this.shaders.push( shaderObj );
                this.shadersMap.push( shader );

            }

            modelIdx = this.models.indexOf( model );
            if ( modelIdx < 0 )
                this.models.push( model );

        }

    },

    render() {

        let curShader;
        let curShaderObj;
        let curModel;
        for ( let i = 0; i < this.shaders.length; i ++ ) {

            curShaderObj = this.shaders[ i ];
            curShader = curShaderObj.shader;

            for ( let j = 0; j < curShaderObj.models.length; j ++ ) {

                curModel = curShaderObj.models[ j ];
                curShader.setUniformObj( curModel.uniformObj ).renderModel( curModel );

            }

            curShader.deactivate();

        }

    },

} );

export { Scene };
