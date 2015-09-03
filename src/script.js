"use strict";

// Quit unless user is on a mobile device
var deviceTest = ({
  isMobile  : function() { return this.isIOS() || this.isAndroid(); },
  isAndroid : function() { return navigator.userAgent.match(/Android/); },
  isIOS     : function() { return navigator.userAgent.match(/(iPhone|iPod|iPad)/); }
});

// matches polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.matches = ElementPrototype.matches ||
    ElementPrototype.matchesSelector ||
    ElementPrototype.webkitMatchesSelector ||
    ElementPrototype.msMatchesSelector ||
    function(selector) {
        var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;
        while (nodes[++i] && nodes[i] != node);
        return !!nodes[i];
    }
}(Element.prototype);

// closest polyfill
this.Element && function(ElementPrototype) {
    ElementPrototype.closest = ElementPrototype.closest ||
    function(selector) {
        var el = this;
        while (el.matches && !el.matches(selector)) el = el.parentNode;
        return el.matches ? el : null;
    }
}(Element.prototype);

window.addEventListener('load', loadDependencies);
    
function loadDependencies() {
    loadTracker();

    if (deviceTest.isMobile()) {
        loadGallery();
        showNotice();
    } else {
        document.querySelector('body').innerHTML = "<h1>Hey!</h1><p>Sorry, but this is a scientific research and it's mobile-only.";
    }
}

function loadTracker() {
    Tracker.init();
}

function loadGallery() {
    Swipe(document.getElementById('gallery'), {
        swipeUp: function(index) { handleSwipeUp(index); },
        swipeDown: function(index) { handleSwipeDown(index); },
        insufficientSwipe: function(index) { handleInsufficientSwipe(index); }
    });
};

function handleSwipeUp(index)   { handleSwipeEvent('imageUp', index); }
function handleSwipeDown(index) { handleSwipeEvent('imageDown', index); }

function handleSwipeEvent(trackedEvent, index) {
    if (selectedNotice) {
        var noticeId = selectedNotice.id;

        if (selectedNotice['closable'])  removeNotice();
    }

    if (noticeId && noticeId === 'interstitial') {
        noticeId = undefined;
        Tracker.trackEvent({ 'interstitialNoticeClosed' : true });
        throw new Error("All good, just stopping JS execution!");
    } else {
        var trackingObject = {}
        trackingObject[trackedEvent] = index;

        Tracker.trackEvent(trackingObject);
    }
}

function handleInsufficientSwipe(index) {
    Tracker.trackEvent({ 'insufficientSwipe' : index });
}

var selectedNotice;
var noticeElement;

var showNotice = function() {
    var notices = [];
    notices[0] = { 'id' : 'interstitial',  'blurred-bg' : true,  'closable' : true,  'has-icons' : false };
    notices[1] = { 'id' : 'alwaysPresent', 'blurred-bg' : false, 'closable' : false, 'has-icons' : false };
    notices[2] = { 'id' : 'icon',          'blurred-bg' : false, 'closable' : true,  'has-icons' : true  };
    notices[3] = { 'id' : 'animation',     'blurred-bg' : false, 'closable' : true,  'has-icons' : true  };

    // pick a random notice
    selectedNotice = notices[Math.floor(Math.random() * notices.length)];
    noticeElement = document.getElementById('notice-' + selectedNotice.id);

    Tracker.trackSelectedNotice(selectedNotice.id);
    
    if (selectedNotice['blurred-bg']) addBlur();

    noticeElement.classList.remove('is-hidden'); // show notice
}

var removeNotice = function() {
    if (selectedNotice && selectedNotice['blurred-bg']) removeBlur();
    noticeElement.classList.add('fadeOut');

    selectedNotice = undefined;
}

var addBlur = function() {
    document.querySelector('.swipe-wrap').classList.add('is-blurred');
}

var removeBlur = function() {
    document.querySelector('.swipe-wrap').classList.remove('is-blurred');
}