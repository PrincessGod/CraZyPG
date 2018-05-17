function addFunction( func ) {

    if ( typeof func === 'function' )
        this.push( func );
    else
        console.warn( `listenerOptions.listener( ${func} ) is not a function.` );

}

function removeFunction( func ) {

    const idx = this.indexOf( func );
    if ( idx > - 1 )
        this.splice( idx, 1 );

}

function addFunctionsToArrays( array ) {

    array.forEach( ary => Object.assign( ary, {
        addFunction: addFunction.bind( ary ),
        removeFunction: removeFunction.bind( ary ),
    } ) );

}

const BUTTONS = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };

function createEventListener( funcs, bindpoint ) {

    const functions = funcs;
    return function ( e ) {

        if ( this.enable === false ) return;

        functions.forEach( ( listener ) => {

            listener( e );

        } );

    }.bind( bindpoint );

}

function Controler( element ) {

    this.element = element;

    this.enable = true;

    this.mouseDownListeners = [];
    this.mouseMoveListeners = [];
    this.mouseUpListeners = [];

    this.mouseWheelListeners = [];

    this.keydownListeners = [];
    this.keyupListeners = [];

    this.touchStartListeners = [];
    this.touchMoveListeners = [];
    this.touchEndListeners = [];

    this.mouseClickListeners = [];
    this.mouseLeftClickListeners = [];
    this.mouseMiddleClickListeners = [];
    this.mouseRightClickListeners = [];

    addFunctionsToArrays( [

        this.mouseDownListeners,
        this.mouseMoveListeners,
        this.mouseUpListeners,

        this.mouseWheelListeners,

        this.keydownListeners,
        this.keyupListeners,

        this.touchStartListeners,
        this.touchMoveListeners,
        this.touchEndListeners,

        this.mouseClickListeners,
        this.mouseLeftClickListeners,
        this.mouseMiddleClickListeners,
        this.mouseRightClickListeners,

    ] );

    this.oncontext = function ( e ) {

        if ( this.enable === false ) return;
        e.preventDefault();

    }.bind( this );

    this.element.addEventListener( 'contextmenu', this.oncontext, false );

    this.onmousedown = createEventListener( this.mouseDownListeners, this );
    this.element.addEventListener( 'mousedown', this.onmousedown, false );
    this.onmousemove = createEventListener( this.mouseMoveListeners, this );
    this.element.addEventListener( 'mousemove', this.onmousemove, false );
    this.onmouseup = createEventListener( this.mouseUpListeners, this );
    document.addEventListener( 'mouseup', this.onmouseup, false );

    this.onwheel = createEventListener( this.mouseWheelListeners, this );
    this.element.addEventListener( 'wheel', this.onwheel, false );

    this.onkeydown = createEventListener( this.keydownListeners, this );
    window.addEventListener( 'keydown', this.onkeydown, false );
    this.onkeyup = createEventListener( this.keyupListeners, this );
    window.addEventListener( 'keyup', this.onkeyup, false );

    this.ontouchstart = createEventListener( this.touchStartListeners, this );
    this.element.addEventListener( 'touchstart', this.ontouchstart, false );
    this.ontouchmove = createEventListener( this.touchMoveListeners, this );
    this.element.addEventListener( 'touchmove', this.ontouchmove, false );
    this.ontouchend = createEventListener( this.touchEndListeners, this );
    this.element.addEventListener( 'touchend', this.ontouchend, false );

    this.onmouseclick = createEventListener( this.mouseClickListeners, this );
    this.onmouseleftclick = createEventListener( this.mouseLeftClickListeners, this );
    this.onmousemiddleclick = createEventListener( this.mouseMiddleClickListeners, this );
    this.onmouserightclick = createEventListener( this.mouseRightClickListeners, this );

    this._flag = 0;
    const self = this;
    this.addListeners( [
        {
            type: 'mousedown',
            listener() {

                self._flag = 0;

            },
        },
        {
            type: 'mousemove',
            listener() {

                self._flag = 1;

            },
        },
        {
            type: 'mouseup',
            listener( e ) {

                if ( self.enable === false ) return;
                if ( self._flag === 0 ) {

                    self.onmouseclick( e );
                    switch ( e.button ) {

                    case BUTTONS.LEFT:
                        self.onmouseleftclick( e );
                        break;

                    case BUTTONS.MIDDLE:
                        self.onmousemiddleclick( e );
                        break;

                    case BUTTONS.RIGHT:
                        self.onmouserightclick( e );
                        break;

                    default:
                        break;

                    }

                }

            },
        },
    ] );

}

Object.assign( Controler.prototype, {

    addListeners( ...listenersOpts ) {

        for ( let i = 0; i < listenersOpts.length; i ++ )
            if ( Array.isArray( listenersOpts[ i ] ) )
                this.addListeners( ...listenersOpts[ i ] );
            else {

                const listenerOptions = listenersOpts[ i ];
                switch ( listenerOptions.type ) {

                case 'mousedown':
                    this.mouseDownListeners.addFunction( listenerOptions.listener );
                    break;

                case 'mousemove':
                    this.mouseMoveListeners.addFunction( listenerOptions.listener );
                    break;

                case 'mouseup':
                    this.mouseUpListeners.addFunction( listenerOptions.listener );
                    break;

                case 'wheel':
                    this.mouseWheelListeners.addFunction( listenerOptions.listener );
                    break;

                case 'keydown':
                    this.keydownListeners.addFunction( listenerOptions.listener );
                    break;

                case 'keyup':
                    this.keyupListeners.addFunction( listenerOptions.listener );
                    break;

                case 'touchstart':
                    this.touchStartListeners.addFunction( listenerOptions.listener );
                    break;

                case 'touchend':
                    this.touchEndListeners.addFunction( listenerOptions.listener );
                    break;

                case 'touchmove':
                    this.touchMoveListeners.addFunction( listenerOptions.listener );
                    break;

                case 'mouseclick':
                    this.mouseClickListeners.addFunction( listenerOptions.listener );
                    break;

                case 'mouseleftclick':
                    this.mouseLeftClickListeners.addFunction( listenerOptions.listener );
                    break;

                case 'mousemiddleclick':
                    this.mouseMiddleClickListeners.addFunction( listenerOptions.listener );
                    break;

                case 'mouserightclick':
                    this.mouseRightClickListeners.addFunction( listenerOptions.listener );
                    break;

                default:
                    break;

                }

            }

        return this;

    },

    removeListeners( ...listenersOpts ) {

        for ( let i = 0; i < listenersOpts.length; i ++ )
            if ( Array.isArray( listenersOpts[ i ] ) )
                this.removeListeners( ...listenersOpts[ i ] );
            else {

                const listenerOptions = listenersOpts[ i ];
                switch ( listenerOptions.type ) {

                case 'mousedown':
                    this.mouseDownListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'mousemove':
                    this.mouseMoveListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'mouseup':
                    this.mouseUpListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'wheel':
                    this.mouseWheelListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'keydown':
                    this.keydownListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'keyup':
                    this.keyupListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'touchstart':
                    this.touchStartListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'touchend':
                    this.touchEndListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'touchmove':
                    this.touchMoveListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'mouseclick':
                    this.mouseClickListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'mouseleftclick':
                    this.mouseLeftClickListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'mousemiddleclick':
                    this.mouseMiddleClickListeners.removeFunction( listenerOptions.listener );
                    break;

                case 'mouserightclick':
                    this.mouseRightClickListeners.removeFunction( listenerOptions.listener );
                    break;

                default:
                    break;

                }

            }

        return this;

    },

    dispose() {

        this.element.removeEventListener( 'contextmenu', this.oncontext, false );

        this.element.removeEventListener( 'mousedown', this.onmousedown, false );
        this.element.removeEventListener( 'mousemove', this.onmousemove, false );
        this.element.removeEventListener( 'mouseup', this.onmouseup, false );

        this.element.removeEventListener( 'wheel', this.onwheel, false );

        this.element.removeEventListener( 'keydown', this.onkeydown, false );
        this.element.removeEventListener( 'keyup', this.onkeyup, false );

        this.element.removeEventListener( 'touchstart', this.ontouchstart, false );
        this.element.removeEventListener( 'touchmove', this.ontouchmove, false );
        this.element.removeEventListener( 'touchend', this.ontouchend, false );

        return this;

    },

} );

export { Controler };
