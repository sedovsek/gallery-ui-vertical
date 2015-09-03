(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

Tracker = module.exports = {
  init: function() {
    var visEvtname, visProp;
    this.sessionId = this.getUniqueSessionsId();
    this.trackingPixel = new Image();
    // this.trackingPixel.src = 'http://' + Config.trackerHost + ':' + Config.trackerPort + '/' + 'pixel.gif?event=';
    // this.trackingPixel.src = 'http://uitracker-sedovsek.rhcloud.com:80/pixel.gif?event=';
    this.trackingPixel.src = 'http://localhost:4000/pixel.gif?event=';
    // this.trackingPixel.src = 'http://192.168.1.105:4000/pixel.gif?event=';
    this.deviceWidth = self.innerWidth;
    this.deviceHeight = self.innerHeight;
    this.storeSessionMetaData();
    var hammertime = new Hammer(document, {
      drag_lock_to_axis: true
    });

    hammertime.on('tap doubletap swipeleft swiperight', (function(_this) {
      return function(ev) {
        return _this.handleTouchEvent(ev);
      };
    })(this));
    hammertime.on('dragleft dragright dragstart dragend', (function(_this) {
      return function(ev) {
        return _this.handleDragEvent(ev);
      };
    })(this));
    visProp = this._getHiddenProp();
    if (visProp) {
      visEvtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange';
      return hammertime.on(visEvtname, (function(_this) {
        return function() {
          return _this.handleVisibilityChange();
        };
      })(this));
    }
  },
  getUniqueSessionsId: function() {
    return Math.floor(Math.random() * 100000) + '_' + new Date().getTime();
  },
  storeSessionMetaData: function() {
    return this.trackEvent({
      'sessionStart': this.sessionId,
      'userAgent': navigator.userAgent,
      'deviceWidth': this.deviceWidth,
      'deviceHeight': this.deviceHeight
    });
  },
  handleTouchEvent: function(ev) {
    var position;
    position = this.calculateInteractionPosition({
      x: ev.gesture.center.pageX,
      y: ev.gesture.center.pageY
    });

    trackingObject = {
      'faultyGesture' : ev.type,
      'position'      : position
    }

    if (selectedNotice && selectedNotice['has-icons']) {
      if (document.elementFromPoint(ev.gesture.startEvent.center.pageX, ev.gesture.startEvent.center.pageY).closest('.icon--up')
       || document.elementFromPoint(ev.gesture.startEvent.center.pageX, ev.gesture.startEvent.center.pageY).closest('.icon--down')) {
        trackingObject['iconTouched'] = true;
      } else {
        trackingObject['iconTouched'] = false;
      }
    }

    return this.trackEvent(trackingObject);
  },
  handleDragEvent: function(ev) {
    var dragLasted;
    if (!this.drags) {
      this.drags = [];
    }
    if (!(ev.type === 'dragstart' || ev.type === 'dragend')) {
      if (ev.type !== this.lastDragDirection) {
        this.lastDragDirection = ev.type;
        this.drags.push(ev.type);
      }
    }
    if (ev.type === 'dragstart') {
      this.dragStarted = new Date().getTime();
    }
    if (ev.type === 'dragend') {
      dragLasted = new Date().getTime() - this.dragStarted;

      if (this.drags.length > 0) {
        this.trackEvent({
          'faultyGesture': this.drags,
          'duration': dragLasted
        });
      }

      delete this.drags;
      delete this.dragStarted;
      return delete this.lastDragDirection;
    }
  },
  handleVisibilityChange: function() {
    var _isHidden;
    _isHidden = (function(_this) {
      return function() {
        var prop;
        prop = _this._getHiddenProp();
        if (prop) {
          return document[prop];
        } else {
          return false;
        }
      };
    })(this);
    if (_isHidden()) {
      return this.trackEvent({
        'visibilityHidden': false
      });
    } else {
      return this.trackEvent({
        'visibilityHidden': true
      });
    }
  },
  trackEvent: function(eventData) {
    var req;
    eventData.sessionId = this.sessionId;
    eventData.timestamp = new Date;
    req = new XMLHttpRequest();
    req.open('GET', this.trackingPixel.src.split('=')[0] + '=' + JSON.stringify(eventData, true));
    return req.send();
  },
  trackSelectedUi: function(ui) {
    return this.trackEvent({
      'user-interface': ui
    });
  },
  trackSelectedNotice: function(noticeId) {
    return this.trackEvent({
      'notice': noticeId
    });
  },
  trackFailedAttempt: function() {
    return this.trackEvent({
      'device': 'desktop',
      'stopSession': true
    });
  },
  calculateInteractionPosition: function(coordinates) {
    var pos;
    pos = {};
    pos.vertical = coordinates.y <= this.deviceHeight / 2 ? 'top' : 'bottom';
    pos.horizontal = coordinates.x <= this.deviceWidth / 2 ? 'left' : 'right';
    return pos;
  },
  _getHiddenProp: function() {
    var i, len, prefix, ref;
    if ('hidden' in document) {
      return 'hidden';
    }
    ref = ['webkit', 'moz', 'ms', 'o'];
    for (i = 0, len = ref.length; i < len; i++) {
      prefix = ref[i];
      if ((prefix + 'Hidden') in document) {
        return prefix + 'Hidden';
      }
    }
    return false;
  }
};

// ---
// generated by coffee-script 1.9.2
},{}]},{},[1]);
