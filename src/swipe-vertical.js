/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
 * modified for simplicity and performance by Robert Sedovšek
 *
*/

function Swipe(container, options) {

  "use strict";

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution

  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // raf
  var requestAnimationFrame =
    window.requestAnimationFrame ||       // According to the standard
    window.mozRequestAnimationFrame ||    // For mozilla
    window.webkitRequestAnimationFrame || // For webkit
    window.msRequestAnimationFrame ||     // For ie
    function (f) { window.setTimeout(function () { f(Date.now()); }, 1000/60); }; // If everthing else fails

  var cancelAnimationFrame =
    window.cancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.msCancelAnimationFrame;

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, height, length;
  options = options || {};
  var index = 0;
  var speed = options.speed || 300;

  function setup() {

    // cache slides
    slides = element.children;
    length = slides.length;

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine height of each slide
    width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

    element.style.height = height + 'px'; // height of a container

    // stack elements
    var pos = slides.length;
    while(pos--) {

      var slide = slides[pos];

      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        move(pos, index > pos ? -height : (index < pos ? height : 0), 0);
      }

    }

    // reposition elements before and after index
    move(circle(index-1), -height, 0);
    move(circle(index+1), height, 0);

    if (!browser.transitions) element.style.top = (index * -height) + 'px';

    container.style.visibility = 'visible';

  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function translate(index, dist, speed) {

    if (typeof index === 'object') {
      var slide = noticeElement;
      var style = slide && slide.style;
    } else {
      var slide = slides[index];
      var style = slide && slide.style;
    }

    var xAdjust = 0;
    var yAdjust = 0;

    if (!style) return;

    // center horizontally if image width is smaller than screen width
    if (slide.clientWidth !== 0 && slide.clientWidth < width) {
      xAdjust = (width - slide.clientWidth)/2;
    }

    // center vertically if image width is smaller than screen width
    if (slide.clientHeight !== 0 && slide.clientHeight < height) {
      yAdjust = (height - slide.clientHeight)/2;
    }

    style.webkitTransitionDuration =
    style.MozTransitionDuration =
    style.msTransitionDuration =
    style.OTransitionDuration =
    style.transitionDuration = speed + 'ms';

    dist = dist + yAdjust;
    style.webkitTransform =
    style.transform = 'translate('+ xAdjust + 'px,' + dist + 'px)' + 'translateZ(0)';
    style.msTransform =
    style.MozTransform =
    style.OTransform = 'translateY(' + dist + 'px)';

  }

  // setup auto slideshow
  var interval;

  function stop() {

    cancelAnimationFrame(interval);

  }


  // setup initial vars
  var start = {};
  var delta = {};
  var isScrollingHorizontally;

  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case 'touchstart': this.start(event); break;
        case 'touchmove': this.move(event); break;
        case 'touchend': offloadFn(this.end(event)); break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'resize': offloadFn(setup); break;
        case 'orientationchange': offloadFn(setup); break;
      }

      // event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {
        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date
      };

      // used for testing first move event
      isScrollingHorizontally = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      document.addEventListener('touchmove', this, false);
      document.addEventListener('touchend', this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if (event.touches.length > 1 || event.scale && event.scale !== 1) return

      event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if (typeof isScrollingHorizontally == 'undefined') {
        isScrollingHorizontally = !!(isScrollingHorizontally || Math.abs(delta.x) > Math.abs(delta.y));
        // TODO
        // delta.x > 0 -- swipe right
        // delta.x < 0 -- swipe left
      }

      // if user is not trying to scroll horizontally
      if (!isScrollingHorizontally) {
        // prevent native scrolling
        event.preventDefault();

        if (selectedNotice && selectedNotice.id === 'interstitial') {

          translate(selectedNotice, delta.y, 350);

        } else {

          // stop slideshow
          stop();

          // increase resistance if first or last slide
          // we don't add resistance at the end
          translate(circle(index-1), delta.y + slidePos[circle(index-1)], 0);
          translate(index, delta.y + slidePos[index], 0);
          translate(circle(index+1), delta.y + slidePos[circle(index+1)], 0);
        }
      }

    },
    end: function(event) {

      // measure duration
      var duration = +new Date - start.time;

      // determine whether it was swipe or just a tap
      // TODO: Research articles to determine what is swipe and what is not
      var isSlide = 
            Number(duration) < 300     // if slide duration is less than 300ms
            && Math.abs(delta.y) > 10; // and if slide amt is greater than 10px

      // determine if slide attempt triggers next/prev slide
      var isValidSlide = isSlide && Math.abs(delta.y) > height/5;   // or if slide amt is greater than one fifth the height

      // determine direction of swipe (true: up, false: down)
      var direction = delta.y < 0;

      // if not scrolling vertically
      if (!isScrollingHorizontally) {

        if (isValidSlide) {

          if (direction) {

            options.swipeUp.call(this, index);

            // we need to get the next in this direction in place
            move(circle(index-1), -height, 0);
            move(circle(index+2), height, 0);

            move(index, slidePos[index]-height, speed);
            move(circle(index+1), slidePos[circle(index+1)]-height, speed);
            index = circle(index+1);

          } else {

            options.swipeDown.call(this, index);

            // we need to get the next in this direction in place
            move(circle(index+1), height, 0);
            move(circle(index-2), -height, 0);

            move(index, slidePos[index]+height, speed);
            move(circle(index-1), slidePos[circle(index-1)]+height, speed);
            index = circle(index-1);

          }

        } else {

          if (selectedNotice && selectedNotice.id === 'interstitial') {

            translate(selectedNotice, 0, speed);

          } else {
          
            move(circle(index-1), -height, speed);
            move(index, 0, speed);
            move(circle(index+1), height, speed);

          }
          
          if (isSlide)  options.insufficientSwipe && options.insufficientSwipe.call(event, index);

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      document.removeEventListener('touchmove', events, false)
      document.removeEventListener('touchend', events, false)

    }
  }

  // trigger setup
  setup();

  // add event listeners
  if (browser.addEventListener) {

    // set touchstart event on element
    if (browser.touch) document.addEventListener('touchstart', events, false);

    if (browser.transitions) {
      document.addEventListener('webkitTransitionEnd', events, false);
      document.addEventListener('msTransitionEnd', events, false);
      document.addEventListener('oTransitionEnd', events, false);
      document.addEventListener('otransitionend', events, false);
      document.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);

  } else {

    window.onresize = function () { setup() }; // to play nice with old IE

  }

}