import { createFramebufferInfo, bindFramebufferInfo, resizeFramebufferInfo } from '../renderer/framebuffer';
import { Quad2Unit } from '../model/Primatives';
import { ScreenQuadShader } from '../shader/ScreenQuadShader';
import { BufferPicker } from '../controls/BufferPicker';

function Scene( renderer ) {

    this.models = [];
    this.shaders = [];
    this.shadersMap = [];
    this.helpers = [];
    this.helpersMap = [];

    this.renderer = renderer;
    this.gl = this.renderer.context;
    this.quad2UnitModel = Quad2Unit.createModel();
    this.ScreenQuadShader = new ScreenQuadShader( this.gl ).setDefines( 'FXAA' ).setUniformObj( { u_resolution: [ this.gl.canvas.width, this.gl.canvas.height ] } );

    const defaultAttachment = [
        {
            format: this.gl.RGBA, type: this.gl.UNSIGNED_BYTE, minMag: this.gl.LINEAR, wrap: this.gl.CLAMP_TO_EDGE,
        },
        {
            format: this.gl.RGBA, type: this.gl.UNSIGNED_BYTE, minMag: this.gl.LINEAR, wrap: this.gl.CLAMP_TO_EDGE,
        },
        { format: this.gl.DEPTH_STENCIL },
    ];

    this.attachments = defaultAttachment;
    this.framebufferInfo = createFramebufferInfo( this.gl, this.attachments );
    this.bufferPicker = new BufferPicker( this.gl, this.models, this.framebufferInfo, 1 );

    this.setPick( false );

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

                const shaderObj = { shader: this.enablePick ? shader.setDefines( 'ColorPick' ) : shader, models: [ model ] };
                this.shaders.push( shaderObj );
                this.shadersMap.push( shader );

            }

            modelIdx = this.models.indexOf( model );
            if ( modelIdx < 0 ) {

                this.models.push( model );
                if ( this.enablePick )
                    model.setUniformObj( { u_colorId: this.bufferPicker.id2Color( this.models.length ) } );

            }

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

    render2Buffer( resize ) {

        if ( resize ) {

            resizeFramebufferInfo( this.gl, this.framebufferInfo, this.attachments );
            this.ScreenQuadShader.setUniformObj( { u_resolution: [ this.gl.canvas.width, this.gl.canvas.height ] } );

        }
        bindFramebufferInfo( this.gl, this.framebufferInfo );
        this.renderer.clear();
        this.render();
        bindFramebufferInfo( this.gl, null );
        return this;

    },

    render2Screen( attachment = 0 ) {

        this.ScreenQuadShader.setTexture( this.framebufferInfo.attachments[ attachment ] ).renderModel( this.quad2UnitModel );
        return this;

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

    setPick( enable ) {

        if ( !! enable === this.enablePick ) return this;

        if ( enable ) {

            this.shadersMap.forEach( shader => shader.setDefines( 'ColorPick' ) );
            this.models.forEach( ( m, idx ) => m.setUniformObj( { u_colorId: this.bufferPicker.id2Color( idx + 1 ) } ) );

        }

        if ( ! enable )
            this.shadersMap.forEach( shader => shader.setDefines() );

        this.enablePick = !! enable;
        this.bufferPicker.setActivate( this.enablePick );
        return this;

    },

} );

export { Scene };
