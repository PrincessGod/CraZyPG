function Scene() {

    this.models = [];
    this.shaders = [];
    this.shadersMap = [];
    this.helpers = [];
    this.helpersMap = [];

}

Object.assign( Scene.prototype, {

    add( ...objs ) {

        for ( let i = 0; i < objs.length; i ++ )
            if ( Array.isArray( objs[ i ] ) )
                this.add( ...objs[ i ] );
            else {

                if ( objs[ i ].shader )
                    this.addModelToShader( objs[ i ].shader, objs[ i ].model );
                if ( objs[ i ].helper )
                    this.addDataToHelper( objs[ i ].helper, objs[ i ].data );

            }

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

    addDataToHelper( helper, data ) {

        if ( Array.isArray( data ) )
            data.forEach( d => this.addDataToHelper( helper, d ) );
        else {

            const helperIdx = this.helpersMap.indexOf( helper );
            if ( helperIdx > - 1 )
                this.helpers[ helperIdx ].datas.push( data );
            else {

                const helperObj = { helper, datas: [ data ] };
                this.helpers.push( helperObj );
                this.helpersMap.push( helper );

            }

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

        for ( let i = 0; i < this.helpers.length; i ++ ) {

            curShaderObj = this.helpers[ i ];
            curShader = curShaderObj.helper;
            for ( let j = 0; j < curShaderObj.datas.length; j ++ ) {

                curModel = curShaderObj.datas[ j ];
                if ( curModel.data ) {

                    curShader.setData( curModel.data );

                    if ( curModel.transform )
                        curShader.model.setTransform( curModel.transform );

                    if ( curModel.position )
                        curShader.model.setPosition( curModel.position );

                    if ( curModel.rotation )
                        curShader.model.setRotation( curModel.rotation );

                    if ( curModel.scale )
                        curShader.model.setScale( curModel.scale );

                    curShader.render();

                }

            }


        }

    },

} );

export { Scene };
