// Hammer
!function(t,e){"use strict";function n(){i.READY||(i.event.determineEventTypes(),i.utils.each(i.gestures,function(t){i.detection.register(t)}),i.event.onTouch(i.DOCUMENT,i.EVENT_MOVE,i.detection.detect),i.event.onTouch(i.DOCUMENT,i.EVENT_END,i.detection.detect),i.READY=!0)}var i=function(t,e){return new i.Instance(t,e||{})};i.defaults={stop_browser_behavior:{userSelect:"none",touchAction:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}},i.HAS_POINTEREVENTS=t.navigator.pointerEnabled||t.navigator.msPointerEnabled,i.HAS_TOUCHEVENTS="ontouchstart"in t,i.MOBILE_REGEX=/mobile|tablet|ip(ad|hone|od)|android|silk/i,i.NO_MOUSEEVENTS=i.HAS_TOUCHEVENTS&&t.navigator.userAgent.match(i.MOBILE_REGEX),i.EVENT_TYPES={},i.DIRECTION_DOWN="down",i.DIRECTION_LEFT="left",i.DIRECTION_UP="up",i.DIRECTION_RIGHT="right",i.POINTER_MOUSE="mouse",i.POINTER_TOUCH="touch",i.POINTER_PEN="pen",i.EVENT_START="start",i.EVENT_MOVE="move",i.EVENT_END="end",i.DOCUMENT=t.document,i.plugins=i.plugins||{},i.gestures=i.gestures||{},i.READY=!1,i.utils={extend:function(t,n,i){for(var r in n)t[r]!==e&&i||(t[r]=n[r]);return t},each:function(t,n,i){var r,o;if("forEach"in t)t.forEach(n,i);else if(t.length!==e){for(r=0,o=t.length;o>r;r++)if(n.call(i,t[r],r,t)===!1)return}else for(r in t)if(t.hasOwnProperty(r)&&n.call(i,t[r],r,t)===!1)return},hasParent:function(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1},getCenter:function(t){var e=[],n=[];return i.utils.each(t,function(t){e.push("undefined"!=typeof t.clientX?t.clientX:t.pageX),n.push("undefined"!=typeof t.clientY?t.clientY:t.pageY)}),{pageX:(Math.min.apply(Math,e)+Math.max.apply(Math,e))/2,pageY:(Math.min.apply(Math,n)+Math.max.apply(Math,n))/2}},getVelocity:function(t,e,n){return{x:Math.abs(e/t)||0,y:Math.abs(n/t)||0}},getAngle:function(t,e){var n=e.pageY-t.pageY,i=e.pageX-t.pageX;return 180*Math.atan2(n,i)/Math.PI},getDirection:function(t,e){var n=Math.abs(t.pageX-e.pageX),r=Math.abs(t.pageY-e.pageY);return n>=r?t.pageX-e.pageX>0?i.DIRECTION_LEFT:i.DIRECTION_RIGHT:t.pageY-e.pageY>0?i.DIRECTION_UP:i.DIRECTION_DOWN},getDistance:function(t,e){var n=e.pageX-t.pageX,i=e.pageY-t.pageY;return Math.sqrt(n*n+i*i)},getScale:function(t,e){return t.length>=2&&e.length>=2?this.getDistance(e[0],e[1])/this.getDistance(t[0],t[1]):1},getRotation:function(t,e){return t.length>=2&&e.length>=2?this.getAngle(e[1],e[0])-this.getAngle(t[1],t[0]):0},isVertical:function(t){return t==i.DIRECTION_UP||t==i.DIRECTION_DOWN},stopDefaultBrowserBehavior:function(t,e){e&&t&&t.style&&(i.utils.each(["webkit","khtml","moz","Moz","ms","o",""],function(n){i.utils.each(e,function(e){n&&(e=n+e.substring(0,1).toUpperCase()+e.substring(1)),e in t.style&&(t.style[e]=e)})}),"none"==e.userSelect&&(t.onselectstart=function(){return!1}),"none"==e.userDrag&&(t.ondragstart=function(){return!1}))}},i.Instance=function(t,e){var r=this;return n(),this.element=t,this.enabled=!0,this.options=i.utils.extend(i.utils.extend({},i.defaults),e||{}),this.options.stop_browser_behavior&&i.utils.stopDefaultBrowserBehavior(this.element,this.options.stop_browser_behavior),i.event.onTouch(t,i.EVENT_START,function(t){r.enabled&&i.detection.startDetect(r,t)}),this},i.Instance.prototype={on:function(t,e){var n=t.split(" ");return i.utils.each(n,function(t){this.element.addEventListener(t,e,!1)},this),this},off:function(t,e){var n=t.split(" ");return i.utils.each(n,function(t){this.element.removeEventListener(t,e,!1)},this),this},trigger:function(t,e){e||(e={});var n=i.DOCUMENT.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e;var r=this.element;return i.utils.hasParent(e.target,r)&&(r=e.target),r.dispatchEvent(n),this},enable:function(t){return this.enabled=t,this}};var r=null,o=!1,s=!1;i.event={bindDom:function(t,e,n){var r=e.split(" ");i.utils.each(r,function(e){t.addEventListener(e,n,!1)})},onTouch:function(t,e,n){var a=this;this.bindDom(t,i.EVENT_TYPES[e],function(c){var u=c.type.toLowerCase();if(!u.match(/mouse/)||!s){u.match(/touch/)||u.match(/pointerdown/)||u.match(/mouse/)&&1===c.which?o=!0:u.match(/mouse/)&&!c.which&&(o=!1),u.match(/touch|pointer/)&&(s=!0);var h=0;o&&(i.HAS_POINTEREVENTS&&e!=i.EVENT_END?h=i.PointerEvent.updatePointer(e,c):u.match(/touch/)?h=c.touches.length:s||(h=u.match(/up/)?0:1),h>0&&e==i.EVENT_END?e=i.EVENT_MOVE:h||(e=i.EVENT_END),(h||null===r)&&(r=c),n.call(i.detection,a.collectEventData(t,e,a.getTouchList(r,e),c)),i.HAS_POINTEREVENTS&&e==i.EVENT_END&&(h=i.PointerEvent.updatePointer(e,c))),h||(r=null,o=!1,s=!1,i.PointerEvent.reset())}})},determineEventTypes:function(){var t;t=i.HAS_POINTEREVENTS?i.PointerEvent.getEvents():i.NO_MOUSEEVENTS?["touchstart","touchmove","touchend touchcancel"]:["touchstart mousedown","touchmove mousemove","touchend touchcancel mouseup"],i.EVENT_TYPES[i.EVENT_START]=t[0],i.EVENT_TYPES[i.EVENT_MOVE]=t[1],i.EVENT_TYPES[i.EVENT_END]=t[2]},getTouchList:function(t){return i.HAS_POINTEREVENTS?i.PointerEvent.getTouchList():t.touches?t.touches:(t.identifier=1,[t])},collectEventData:function(t,e,n,r){var o=i.POINTER_TOUCH;return(r.type.match(/mouse/)||i.PointerEvent.matchType(i.POINTER_MOUSE,r))&&(o=i.POINTER_MOUSE),{center:i.utils.getCenter(n),timeStamp:(new Date).getTime(),target:r.target,touches:n,eventType:e,pointerType:o,srcEvent:r,preventDefault:function(){this.srcEvent.preventManipulation&&this.srcEvent.preventManipulation(),this.srcEvent.preventDefault&&this.srcEvent.preventDefault()},stopPropagation:function(){this.srcEvent.stopPropagation()},stopDetect:function(){return i.detection.stopDetect()}}}},i.PointerEvent={pointers:{},getTouchList:function(){var t=this,e=[];return i.utils.each(t.pointers,function(t){e.push(t)}),e},updatePointer:function(t,e){return t==i.EVENT_END?this.pointers={}:(e.identifier=e.pointerId,this.pointers[e.pointerId]=e),Object.keys(this.pointers).length},matchType:function(t,e){if(!e.pointerType)return!1;var n=e.pointerType,r={};return r[i.POINTER_MOUSE]=n===e.MSPOINTER_TYPE_MOUSE||n===i.POINTER_MOUSE,r[i.POINTER_TOUCH]=n===e.MSPOINTER_TYPE_TOUCH||n===i.POINTER_TOUCH,r[i.POINTER_PEN]=n===e.MSPOINTER_TYPE_PEN||n===i.POINTER_PEN,r[t]},getEvents:function(){return["pointerdown MSPointerDown","pointermove MSPointerMove","pointerup pointercancel MSPointerUp MSPointerCancel"]},reset:function(){this.pointers={}}},i.detection={gestures:[],current:null,previous:null,stopped:!1,startDetect:function(t,e){this.current||(this.stopped=!1,this.current={inst:t,startEvent:i.utils.extend({},e),lastEvent:!1,name:""},this.detect(e))},detect:function(t){if(this.current&&!this.stopped){t=this.extendEventData(t);var e=this.current.inst.options;return i.utils.each(this.gestures,function(n){return this.stopped||e[n.name]===!1||n.handler.call(n,t,this.current.inst)!==!1?void 0:(this.stopDetect(),!1)},this),this.current&&(this.current.lastEvent=t),t.eventType==i.EVENT_END&&!t.touches.length-1&&this.stopDetect(),t}},stopDetect:function(){this.previous=i.utils.extend({},this.current),this.current=null,this.stopped=!0},extendEventData:function(t){var e=this.current.startEvent;!e||t.touches.length==e.touches.length&&t.touches!==e.touches||(e.touches=[],i.utils.each(t.touches,function(t){e.touches.push(i.utils.extend({},t))}));var n,r,o=t.timeStamp-e.timeStamp,s=t.center.pageX-e.center.pageX,a=t.center.pageY-e.center.pageY,c=i.utils.getVelocity(o,s,a);return"end"===t.eventType?(n=this.current.lastEvent&&this.current.lastEvent.interimAngle,r=this.current.lastEvent&&this.current.lastEvent.interimDirection):(n=this.current.lastEvent&&i.utils.getAngle(this.current.lastEvent.center,t.center),r=this.current.lastEvent&&i.utils.getDirection(this.current.lastEvent.center,t.center)),i.utils.extend(t,{deltaTime:o,deltaX:s,deltaY:a,velocityX:c.x,velocityY:c.y,distance:i.utils.getDistance(e.center,t.center),angle:i.utils.getAngle(e.center,t.center),interimAngle:n,direction:i.utils.getDirection(e.center,t.center),interimDirection:r,scale:i.utils.getScale(e.touches,t.touches),rotation:i.utils.getRotation(e.touches,t.touches),startEvent:e}),t},register:function(t){var n=t.defaults||{};return n[t.name]===e&&(n[t.name]=!0),i.utils.extend(i.defaults,n,!0),t.index=t.index||1e3,this.gestures.push(t),this.gestures.sort(function(t,e){return t.index<e.index?-1:t.index>e.index?1:0}),this.gestures}},i.gestures.Drag={name:"drag",index:50,defaults:{drag_min_distance:10,correct_for_drag_min_distance:!0,drag_max_touches:1,drag_block_horizontal:!1,drag_block_vertical:!1,drag_lock_to_axis:!1,drag_lock_min_distance:25},triggered:!1,handler:function(t,e){if(i.detection.current.name!=this.name&&this.triggered)return e.trigger(this.name+"end",t),void(this.triggered=!1);if(!(e.options.drag_max_touches>0&&t.touches.length>e.options.drag_max_touches))switch(t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:if(t.distance<e.options.drag_min_distance&&i.detection.current.name!=this.name)return;if(i.detection.current.name!=this.name&&(i.detection.current.name=this.name,e.options.correct_for_drag_min_distance&&t.distance>0)){var n=Math.abs(e.options.drag_min_distance/t.distance);i.detection.current.startEvent.center.pageX+=t.deltaX*n,i.detection.current.startEvent.center.pageY+=t.deltaY*n,t=i.detection.extendEventData(t)}(i.detection.current.lastEvent.drag_locked_to_axis||e.options.drag_lock_to_axis&&e.options.drag_lock_min_distance<=t.distance)&&(t.drag_locked_to_axis=!0);var r=i.detection.current.lastEvent.direction;t.drag_locked_to_axis&&r!==t.direction&&(t.direction=i.utils.isVertical(r)?t.deltaY<0?i.DIRECTION_UP:i.DIRECTION_DOWN:t.deltaX<0?i.DIRECTION_LEFT:i.DIRECTION_RIGHT),this.triggered||(e.trigger(this.name+"start",t),this.triggered=!0),e.trigger(this.name,t),e.trigger(this.name+t.direction,t),(e.options.drag_block_vertical&&i.utils.isVertical(t.direction)||e.options.drag_block_horizontal&&!i.utils.isVertical(t.direction))&&t.preventDefault();break;case i.EVENT_END:this.triggered&&e.trigger(this.name+"end",t),this.triggered=!1}}},i.gestures.Hold={name:"hold",index:10,defaults:{hold_timeout:500,hold_threshold:1},timer:null,handler:function(t,e){switch(t.eventType){case i.EVENT_START:clearTimeout(this.timer),i.detection.current.name=this.name,this.timer=setTimeout(function(){"hold"==i.detection.current.name&&e.trigger("hold",t)},e.options.hold_timeout);break;case i.EVENT_MOVE:t.distance>e.options.hold_threshold&&clearTimeout(this.timer);break;case i.EVENT_END:clearTimeout(this.timer)}}},i.gestures.Release={name:"release",index:1/0,handler:function(t,e){t.eventType==i.EVENT_END&&e.trigger(this.name,t)}},i.gestures.Swipe={name:"swipe",index:40,defaults:{swipe_min_touches:1,swipe_max_touches:1,swipe_velocity:.7},handler:function(t,e){if(t.eventType==i.EVENT_END){if(e.options.swipe_max_touches>0&&t.touches.length<e.options.swipe_min_touches&&t.touches.length>e.options.swipe_max_touches)return;(t.velocityX>e.options.swipe_velocity||t.velocityY>e.options.swipe_velocity)&&(e.trigger(this.name,t),e.trigger(this.name+t.direction,t))}}},i.gestures.Tap={name:"tap",index:100,defaults:{tap_max_touchtime:250,tap_max_distance:10,tap_always:!0,doubletap_distance:20,doubletap_interval:300},handler:function(t,e){if(t.eventType==i.EVENT_END&&"touchcancel"!=t.srcEvent.type){var n=i.detection.previous,r=!1;if(t.deltaTime>e.options.tap_max_touchtime||t.distance>e.options.tap_max_distance)return;n&&"tap"==n.name&&t.timeStamp-n.lastEvent.timeStamp<e.options.doubletap_interval&&t.distance<e.options.doubletap_distance&&(e.trigger("doubletap",t),r=!0),(!r||e.options.tap_always)&&(i.detection.current.name="tap",e.trigger(i.detection.current.name,t))}}},i.gestures.Touch={name:"touch",index:-1/0,defaults:{prevent_default:!1,prevent_mouseevents:!1},handler:function(t,e){return e.options.prevent_mouseevents&&t.pointerType==i.POINTER_MOUSE?void t.stopDetect():(e.options.prevent_default&&t.preventDefault(),void(t.eventType==i.EVENT_START&&e.trigger(this.name,t)))}},i.gestures.Transform={name:"transform",index:45,defaults:{transform_min_scale:.01,transform_min_rotation:1,transform_always_block:!1},triggered:!1,handler:function(t,e){if(i.detection.current.name!=this.name&&this.triggered)return e.trigger(this.name+"end",t),void(this.triggered=!1);if(!(t.touches.length<2))switch(e.options.transform_always_block&&t.preventDefault(),t.eventType){case i.EVENT_START:this.triggered=!1;break;case i.EVENT_MOVE:var n=Math.abs(1-t.scale),r=Math.abs(t.rotation);if(n<e.options.transform_min_scale&&r<e.options.transform_min_rotation)return;i.detection.current.name=this.name,this.triggered||(e.trigger(this.name+"start",t),this.triggered=!0),e.trigger(this.name,t),r>e.options.transform_min_rotation&&e.trigger("rotate",t),n>e.options.transform_min_scale&&(e.trigger("pinch",t),e.trigger("pinch"+(t.scale<1?"in":"out"),t));break;case i.EVENT_END:this.triggered&&e.trigger(this.name+"end",t),this.triggered=!1}}},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return i}):"object"==typeof module&&"object"==typeof module.exports?module.exports=i:t.Hammer=i}(window);

// Tracker
!function t(e,n,i){function r(a,o){if(!n[a]){if(!e[a]){var c="function"==typeof require&&require;if(!o&&c)return c(a,!0);if(s)return s(a,!0);var d=new Error("Cannot find module '"+a+"'");throw d.code="MODULE_NOT_FOUND",d}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return r(n?n:t)},u,u.exports,t,e,n,i)}return n[a].exports}for(var s="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(t,e){Tracker=e.exports={init:function(){var t,e;this.sessionId=this.getUniqueSessionsId(),this.trackingPixel=new Image,this.trackingPixel.src="http://uitracker-sedovsek.rhcloud.com:80/pixel.gif?event=",this.deviceWidth=self.innerWidth,this.deviceHeight=self.innerHeight,this.storeSessionMetaData();var n=new Hammer(document,{drag_lock_to_axis:!0});return n.on("tap doubletap swipeleft swiperight",function(t){return function(e){return t.handleTouchEvent(e)}}(this)),n.on("dragleft dragright dragstart dragend",function(t){return function(e){return t.handleDragEvent(e)}}(this)),e=this._getHiddenProp(),e?(t=e.replace(/[H|h]idden/,"")+"visibilitychange",n.on(t,function(t){return function(){return t.handleVisibilityChange()}}(this))):void 0},getUniqueSessionsId:function(){return Math.floor(1e5*Math.random())+"_"+(new Date).getTime()},storeSessionMetaData:function(){return this.trackEvent({sessionStart:this.sessionId,userAgent:navigator.userAgent,deviceWidth:this.deviceWidth,deviceHeight:this.deviceHeight})},handleTouchEvent:function(t){var e;return e=this.calculateInteractionPosition({x:t.gesture.center.pageX,y:t.gesture.center.pageY}),trackingObject={faultyGesture:t.type,position:e},selectedNotice&&selectedNotice["has-icons"]&&(trackingObject.iconTouched=document.elementFromPoint(t.gesture.startEvent.center.pageX,t.gesture.startEvent.center.pageY).closest(".icon--up")||document.elementFromPoint(t.gesture.startEvent.center.pageX,t.gesture.startEvent.center.pageY).closest(".icon--down")?!0:!1),this.trackEvent(trackingObject)},handleDragEvent:function(t){var e;return this.drags||(this.drags=[]),"dragstart"!==t.type&&"dragend"!==t.type&&t.type!==this.lastDragDirection&&(this.lastDragDirection=t.type,this.drags.push(t.type)),"dragstart"===t.type&&(this.dragStarted=(new Date).getTime()),"dragend"===t.type?(e=(new Date).getTime()-this.dragStarted,this.drags.length>0&&this.trackEvent({faultyGesture:this.drags,duration:e}),delete this.drags,delete this.dragStarted,delete this.lastDragDirection):void 0},handleVisibilityChange:function(){var t;return t=function(t){return function(){var e;return e=t._getHiddenProp(),e?document[e]:!1}}(this),this.trackEvent(t()?{visibilityHidden:!1}:{visibilityHidden:!0})},trackEvent:function(t){var e;return t.sessionId=this.sessionId,t.timestamp=new Date,e=new XMLHttpRequest,e.open("GET",this.trackingPixel.src.split("=")[0]+"="+JSON.stringify(t,!0)),e.send()},trackSelectedUi:function(t){return this.trackEvent({"user-interface":t})},trackSelectedNotice:function(t){return this.trackEvent({notice:t})},trackFailedAttempt:function(){return this.trackEvent({device:"desktop",stopSession:!0})},calculateInteractionPosition:function(t){var e;return e={},e.vertical=t.y<=this.deviceHeight/2?"top":"bottom",e.horizontal=t.x<=this.deviceWidth/2?"left":"right",e},_getHiddenProp:function(){var t,e,n,i;if("hidden"in document)return"hidden";for(i=["webkit","moz","ms","o"],t=0,e=i.length;e>t;t++)if(n=i[t],n+"Hidden"in document)return n+"Hidden";return!1}}},{}]},{},[1]);

// swipe-vertical.js
function Swipe(e,t){"use strict";function n(){m=f.children,v=m.length,w=new Array(m.length),h=window.innerWidth>0?window.innerWidth:screen.width,l=window.innerHeight>0?window.innerHeight:screen.height,f.style.height=l+"px";for(var t=m.length;t--;){var n=m[t];n.setAttribute("data-index",t),d.transitions&&o(t,E>t?-l:t>E?l:0,0)}o(i(E-1),-l,0),o(i(E+1),l,0),d.transitions||(f.style.top=E*-l+"px"),e.style.visibility="visible"}function i(e){return(m.length+e%m.length)%m.length}function o(e,t,n){a(e,t,n),w[e]=t}function a(e,t,n){if("object"==typeof e)var i=noticeElement,o=i&&i.style;else var i=m[e],o=i&&i.style;var a=0,s=0;o&&(0!==i.clientWidth&&i.clientWidth<h&&(a=(h-i.clientWidth)/2),0!==i.clientHeight&&i.clientHeight<l&&(s=(l-i.clientHeight)/2),o.webkitTransitionDuration=o.MozTransitionDuration=o.msTransitionDuration=o.OTransitionDuration=o.transitionDuration=n+"ms",t+=s,o.webkitTransform=o.transform="translate("+a+"px,"+t+"px)translateZ(0)",o.msTransform=o.MozTransform=o.OTransform="translateY("+t+"px)")}function s(){u(p)}var r=function(){},c=function(e){setTimeout(e||r,0)},d={addEventListener:!!window.addEventListener,touch:"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,transitions:function(e){var t=["transitionProperty","WebkitTransition","MozTransition","OTransition","msTransition"];for(var n in t)if(void 0!==e.style[t[n]])return!0;return!1}(document.createElement("swipe"))},u=(window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(function(){e(Date.now())},1e3/60)},window.cancelAnimationFrame||window.mozCancelAnimationFrame||window.webkitCancelAnimationFrame||window.msCancelAnimationFrame);if(e){var m,w,h,l,v,f=e.children[0];t=t||{};var p,y,E=0,T=t.speed||300,b={},g={},L={handleEvent:function(e){switch(e.type){case"touchstart":this.start(e);break;case"touchmove":this.move(e);break;case"touchend":c(this.end(e));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"resize":c(n);break;case"orientationchange":c(n)}},start:function(e){var t=e.touches[0];b={x:t.pageX,y:t.pageY,time:+new Date},y=void 0,g={},document.addEventListener("touchmove",this,!1),document.addEventListener("touchend",this,!1)},move:function(e){if(!(e.touches.length>1||e.scale&&1!==e.scale)){e.preventDefault();var t=e.touches[0];g={x:t.pageX-b.x,y:t.pageY-b.y},"undefined"==typeof y&&(y=!!(y||Math.abs(g.x)>Math.abs(g.y))),y||(e.preventDefault(),selectedNotice&&"interstitial"===selectedNotice.id?a(selectedNotice,g.y,350):(s(),a(i(E-1),g.y+w[i(E-1)],0),a(E,g.y+w[E],0),a(i(E+1),g.y+w[i(E+1)],0)))}},end:function(e){var n=+new Date-b.time,s=Number(n)<300&&Math.abs(g.y)>10,r=s&&Math.abs(g.y)>l/5,c=g.y<0;y||(r?c?(t.swipeUp.call(this,E),o(i(E-1),-l,0),o(i(E+2),l,0),o(E,w[E]-l,T),o(i(E+1),w[i(E+1)]-l,T),E=i(E+1)):(t.swipeDown.call(this,E),o(i(E+1),l,0),o(i(E-2),-l,0),o(E,w[E]+l,T),o(i(E-1),w[i(E-1)]+l,T),E=i(E-1)):(selectedNotice&&"interstitial"===selectedNotice.id?a(selectedNotice,0,T):(o(i(E-1),-l,T),o(E,0,T),o(i(E+1),l,T)),s&&t.insufficientSwipe&&t.insufficientSwipe.call(e,E))),document.removeEventListener("touchmove",L,!1),document.removeEventListener("touchend",L,!1)}};n(),d.addEventListener?(d.touch&&document.addEventListener("touchstart",L,!1),d.transitions&&(document.addEventListener("webkitTransitionEnd",L,!1),document.addEventListener("msTransitionEnd",L,!1),document.addEventListener("oTransitionEnd",L,!1),document.addEventListener("otransitionend",L,!1),document.addEventListener("transitionend",L,!1)),window.addEventListener("resize",L,!1)):window.onresize=function(){n()}}}

// script.js
"use strict";function loadDependencies(){loadTracker(),deviceTest.isMobile()?(loadGallery(),showNotice()):document.querySelector("body").innerHTML="<h1>Hey!</h1><p>Sorry, but this is a scientific research and it's mobile-only."}function loadTracker(){Tracker.init()}function loadGallery(){Swipe(document.getElementById("gallery"),{swipeUp:function(e){handleSwipeUp(e)},swipeDown:function(e){handleSwipeDown(e)},insufficientSwipe:function(e){handleInsufficientSwipe(e)}})}function handleSwipeUp(e){handleSwipeEvent("imageUp",e)}function handleSwipeDown(e){handleSwipeEvent("imageDown",e)}function handleSwipeEvent(e,t){if(selectedNotice){var i=selectedNotice.id;selectedNotice.closable&&removeNotice()}if(i&&"interstitial"===i)throw i=void 0,Tracker.trackEvent({interstitialNoticeClosed:!0}),new Error("All good, just stopping JS execution!");var n={};n[e]=t,Tracker.trackEvent(n)}function handleInsufficientSwipe(e){Tracker.trackEvent({insufficientSwipe:e})}var deviceTest={isMobile:function(){return this.isIOS()||this.isAndroid()},isAndroid:function(){return navigator.userAgent.match(/Android/)},isIOS:function(){return navigator.userAgent.match(/(iPhone|iPod|iPad)/)}};this.Element&&function(e){e.matches=e.matches||e.matchesSelector||e.webkitMatchesSelector||e.msMatchesSelector||function(e){for(var t=this,i=(t.parentNode||t.document).querySelectorAll(e),n=-1;i[++n]&&i[n]!=t;);return!!i[n]}}(Element.prototype),this.Element&&function(e){e.closest=e.closest||function(e){for(var t=this;t.matches&&!t.matches(e);)t=t.parentNode;return t.matches?t:null}}(Element.prototype),window.addEventListener("load",loadDependencies);var selectedNotice,noticeElement,showNotice=function(){var e=[];e[0]={id:"interstitial","blurred-bg":!0,closable:!0,"has-icons":!1},e[1]={id:"alwaysPresent","blurred-bg":!1,closable:!1,"has-icons":!1},e[2]={id:"icon","blurred-bg":!1,closable:!0,"has-icons":!0},e[3]={id:"animation","blurred-bg":!1,closable:!0,"has-icons":!0},selectedNotice=e[Math.floor(Math.random()*e.length)],noticeElement=document.getElementById("notice-"+selectedNotice.id),Tracker.trackSelectedNotice(selectedNotice.id),selectedNotice["blurred-bg"]&&addBlur(),noticeElement.classList.remove("is-hidden")},removeNotice=function(){selectedNotice&&selectedNotice["blurred-bg"]&&removeBlur(),noticeElement.classList.add("fadeOut"),selectedNotice=void 0},addBlur=function(){document.querySelector(".swipe-wrap").classList.add("is-blurred")},removeBlur=function(){document.querySelector(".swipe-wrap").classList.remove("is-blurred")};