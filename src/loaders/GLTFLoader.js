function GLTFLoader() {

    this.currentSceneName = 'null';
    this.result = {
        nodes: [],
    };

}

Object.defineProperties( GLTFLoader, {

    version: {

        get() {

            if ( this.version )
                return this.version;
            else if ( this.json ) {

                if ( this.json.asset ) {

                    console.error( 'glTF should have asset property!' );
                    return null;

                }

                this.version = this.json.asset.version;
                if ( this.json.asset.minVersion )
                    this.version += `\r minVersion${this.json.asset.minVersion}`;

                return this.version;

            }

            console.warn( 'glTF not loaded.' );
            return null;

        },
    },

} );

Object.assign( GLTFLoader.prototype, {
    load( json, sceneId ) {

        this.gltf = json;

        if ( this.gltf.asset.version !== '2.0' ) {

            console.error( `GlTFLoader only support glTF 2.0 for now! Received glTF version: ${this.version}` );
            return;

        }

        this.parseScene( sceneId );

    },

    parseScene( sceneId ) {

        const loadScene = sceneId || this.gltf.scene || 0;
        const scene = this.gltf.scenes[ loadScene ];

        if ( typeof scene === 'undefined' ) {

            console.error( `glTF model have no scene on index ${loadScene}` );
            return;

        }

        this.currentSceneName = scene.name || 'No Name';

        const nodes = scene.nodes;

        this.result.name = this.currentSceneName;
        this.result.scene = scene;

        for ( let i = 0; i < nodes.length; i ++ ) {

            const node = this.parseNode( nodes[ i ] );
            if ( node )
                this.result.nodes.push( node );

        }

    },

    parseNode( nodeId ) {

        // TODO camera skin
        const node = this.gltf.nodes[ nodeId ];
        if ( ! node ) {

            console.error( `glTF not have node on index ${nodeId}` );
            return false;

        }

        if ( node.isParsed )
            return node;

        if ( node.mesh ) {

            const mesh = this.parseMesh( node.mesh );
            if ( mesh )
                node.dmesh = mesh;

        }

        if ( node.children ) {

            if ( ! node.dchildren )
                node.nchildren = [];

            for ( let i = 0; i < node.children.length; i ++ )
                node.nchildren.push( this.parseNode( node.children( i ) ) );

        }

        node.isParsed = true;

        return node;

    },

    parseMesh() {

    },
} );
