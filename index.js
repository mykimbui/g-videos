var Aside = ( function() {
  var settings = {
    scaleFactor: 0.1,
    size: 350,
    scrollSpeed: 2
  }

  var selector = {
    toggle: '[data-aside-role="toggle"]',
    aside: '[data-aside-role="aside"]'
  }

  var elements = {}

  var state = {
    scaleFactor: 0.1,
    winHeight: window.innerHeight,
    isScaled: false,
    mousewheeling: false
  }

  var timer = undefined;

  var init = function() {
    elements.aside = $( selector.aside );

    onResize();
    onTick();

    bindEvents();
  }

  var bindEvents = function() {
    $( window )
    .on( 'resize', _.debounce(
      function() {
        onResize();
      },
      1000
      )
    );

    $( document )
    .on( 'nav/show', function() {
      show();
    } )
    .on( 'nav/hide', function() {
      hide();
    } )

    .on( 'wheel mousewheel', selector.aside, function() {
      te.mousewheeling = true;
    } )
    .on( 'wheel mousewheel', selector.aside, _.debounce(
      function() {
        ate.mousewheeling = false;
      },
      500
      ) )
    .on( 'mouseenter', selector.aside, function() {
      if( !$( 'html' ).hasClass( 'visible--nav' ) ) {
        show();
      }
    } )
    .on( 'mouseleave', selector.aside, function() {
      if( !$( 'html' ).hasClass( 'visible--nav' ) ) {
        hide();
      }
    } );

    elements.aside
    .on( 'scroll', _.throttle(  function() {
      var threshold = ( !state.isScaled ) ? ( elements.aside[0].scrollHeight - ( state.winHeight / state.scaleFactor ) - 100 ) : ( elements.aside[0].scrollHeight - ( state.winHeight / 1 ) - 100 );

      if( elements.aside.scrollTop() >= threshold ) {
       elements.aside.scrollTop( 0 );
     }
   },
   ( 1000 / 60 )
   )
    );
  }

  var onTick = function() {
    if( !state.mousewheeling ) {
      var scrollTop = elements.aside.scrollTop();
      var scrollSpeed = ( !state.isScaled ) ? settings.scrollSpeed : settings.scrollSpeed / 4;
      elements.aside.scrollTop( scrollTop + scrollSpeed );
    }

    requestAnimationFrame( function() {
      onTick();
    } );
  }

  var onResize = function() {
    state.scaleFactor = settings.size / $( window ).width() * 2;
    state.winHeight = window.innerHeight;


    setScaleFactor( state.scaleFactor );
  }

  var show = function() {
   timer = setTimeout( function() {
    state.isScaled = true;
    elements.aside
    .addClass( 'scaled-up' );
  }, 350 );

   $( 'html' ).addClass( 'active--aside' );
 }

 var hide = function() {
   state.isScaled = false;

   if( timer ) {
    clearTimeout( timer );
  }

  elements.aside
  .removeClass( 'scaled-up' );

  $( 'html' ).removeClass( 'active--aside' );
}


var setScaleFactor = function() {
  elements.aside
  .css( {
    'height': ( 100 / state.scaleFactor ) + 'vh',
    'transform': 'scale(' + state.scaleFactor + ')'
  } );
}

return {
  init: function() { init();  },
  state: state
}
} )();


/**
 * NAVIGATION module
 *
 */
 var Nav = ( function() {
  var settings = {}

  var selector = {
    toggle: '[data-nav-role="toggle"]',
    nav: '[data-nav-role="nav"]'
  }

  var elements = {}

  var state = {}


  var init = function() {
    bindEvents();
  }

  var bindEvents = function() {
    $( document )
    .on( 'click', selector.toggle, function( event ) {
      event.preventDefault();

      if( $( 'html' ).hasClass( 'visible--nav' ) ) {
        $( document ).trigger( 'nav/hide' );
        $('.contact-button').removeClass('white')
      } else {
        $( document ).trigger( 'nav/show' );
        $('.contact-button').addClass('white')
        $( selector.nav ).scrollTop( 0 );
      }

      $( 'html' ).toggleClass( 'visible--nav' );
    } );
  }

  return {
    init: function() { init();  },
  }
} )();



$( document ).ready( function() {
  Aside.init();
  Nav.init();
} );
