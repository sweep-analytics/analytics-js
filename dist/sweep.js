/*!
 * @sweep/analytics-js v0.1.1
 * Copyright (c) 2019-2019 Sweep Analytics
 * License: MIT
 */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }
  var rngBrowser = createCommonjsModule(function (module) {
    var getRandomValues = typeof crypto != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto);
    if (getRandomValues) {
      var rnds8 = new Uint8Array(16);
      module.exports = function whatwgRNG() {
        getRandomValues(rnds8);
        return rnds8;
      };
    } else {
      var rnds = new Array(16);
      module.exports = function mathRNG() {
        for (var i = 0, r; i < 16; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
          rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
        }
        return rnds;
      };
    }
  });
  var byteToHex = [];
  for (var i = 0; i < 256; ++i) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
  }
  function bytesToUuid(buf, offset) {
    var i = offset || 0;
    var bth = byteToHex;
    return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
  }
  var bytesToUuid_1 = bytesToUuid;
  function v4(options, buf, offset) {
    var i = buf && offset || 0;
    if (typeof options == 'string') {
      buf = options === 'binary' ? new Array(16) : null;
      options = null;
    }
    options = options || {};
    var rnds = options.random || (options.rng || rngBrowser)();
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80;
    if (buf) {
      for (var ii = 0; ii < 16; ++ii) {
        buf[i + ii] = rnds[ii];
      }
    }
    return buf || bytesToUuid_1(rnds);
  }
  var v4_1 = v4;

  function cookieSet(name, value) {
    var date = new Date();
    date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }
  function cookieGet(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  var Sweep = function Sweep(apiKey, logs, noCookie) {
    _classCallCheck(this, Sweep);
    window.sweep = {
      sweepApiKey: apiKey,
      sweepLogs: logs,
      sweepNoCookie: noCookie
    };
  }
  ;
  var trackEventMutation = function trackEventMutation() {
    return "mutation trackEvent($type: EventType!, $name: String!, $client: String!, $meta: JSON) {\n  trackEvent(type: $type, input: { name: $name, client: $client, meta: $meta }) { \n    name,\n    client,\n    meta\n  }\n}";
  };
  function trackPageViews() {
    var noCookie = window.sweep.sweepNoCookie;
    if ('true' !== noCookie && !cookieGet('s_a_js_uid')) {
      cookieSet('s_a_js_uid', v4_1());
    }
    try {
      var clientId = window.sweep.sweepApiKey;
      if (!clientId) {
        throw new Error('No api key provided');
      }
      var nav = window.navigator;
      var loc = window.location;
      var userAgent = nav.userAgent;
      if (userAgent.search(/(bot|spider|crawl)/ig) > -1) {
        throw new Error('bot… not tracked');
      }
      var previousUrl = '';
      var url;
      if (!loc.hash) {
        url = loc.protocol + '//' + loc.hostname + loc.pathname;
      } else {
        url = loc.protocol + '//' + loc.hostname + loc.pathname + loc.hash;
      }
      var referrer = document.referrer;
      var language = navigator.language;
      var platform = navigator.platform;
      var size = "".concat(window.screen.width, "x").concat(window.screen.height);
      var meta = {
        url: url,
        referrer: referrer,
        language: language,
        platform: platform,
        userAgent: userAgent,
        screen: size
      };
      if ('true' !== noCookie) {
        meta.anonymousId = cookieGet('s_a_js_uid');
      }
      var options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operationName: 'trackEvent',
          query: trackEventMutation(),
          variables: {
            type: 'ANALYSIS',
            name: 'userSession',
            client: clientId,
            meta: meta
          }
        })
      };
      if (previousUrl === url) {
        return;
      }
      ;
      previousUrl = url;
      fetch("https://api.sweep-analytics.com/public", options).then(function () {
        console.log('send');
      }).catch(function (err) {
        throw new Error(err);
      });
    } catch (e) {
      console.error(e);
    }
  }
  function trackEvents(event) {
    var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    try {
      var clientId = window.sweep.sweepApiKey;
      if (!clientId) {
        throw new Error('No api key provided');
      }
      var nav = window.navigator;
      var loc = window.location;
      var userAgent = nav.userAgent;
      if (userAgent.search(/(bot|spider|crawl)/ig) > -1) {
        throw new Error('bot… not tracked');
      }
      meta.path = loc.pathname;
      var options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operationName: 'trackEvent',
          query: trackEventMutation(),
          variables: {
            type: 'ANALYSIS',
            name: event,
            client: clientId,
            meta: meta
          }
        })
      };
      fetch('https://api.sweep-analytics.com/public', options).then(function () {
        console.log('send event');
      }).catch(function (error) {
        throw new Error(error);
      });
    } catch (e) {
      console.error(e);
    }
  }
  function trackErrors() {
    try {
      var enableLogs = window.sweep.logs;
      if ('true' !== enableLogs || !enableLogs) {
        return;
      }
      var clientId = window.sweep.sweepApiKey;
      if (!clientId) {
        throw new Error('No api key provided');
      }
      var nav = window.navigator;
      var loc = window.location;
      var userAgent = nav.userAgent;
      if (userAgent.search(/(bot|spider|crawl)/ig) > -1) {
        throw new Error('bot… not tracked');
      }
      var previousUrl = '';
      var url;
      if (!loc.hash) {
        url = loc.protocol + '//' + loc.hostname + loc.pathname;
      } else {
        url = loc.protocol + '//' + loc.hostname + loc.pathname + loc.hash;
      }
      var referrer = document.referrer;
      var language = navigator.language;
      var platform = navigator.platform;
      var size = "".concat(window.screen.width, "x").concat(window.screen.height);
      var meta = {
        url: url,
        referrer: referrer,
        language: language,
        platform: platform,
        userAgent: userAgent,
        screen: size
      };
      window.addEventListener('error', function (event) {
        var log = {
          line: event.lineno,
          filename: event.filename,
          message: event.message,
          error: event.error
        };
        meta.log = log;
        var options = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            operationName: 'trackEvent',
            query: trackEventMutation(),
            variables: {
              type: 'LOG',
              name: event,
              client: clientId,
              meta: meta
            }
          })
        };
        fetch('https://api.sweep-analytics.com/public', options).then(function () {
          console.log('send event');
        }).catch(function (error) {
          throw new Error(error);
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  var api = getSyncScriptParams();
  document.addEventListener("DOMContentLoaded", function () {
    var sweepInit = new Sweep(api.key, api.logs, api.noCookie);
    trackPageView();
    var clickEvents = [].slice.call(document.querySelectorAll('[data-sweep-click]'));
    clickEvents.forEach(function (clickEvent) {
      clickEvent.addEventListener('click', function (el) {
        var eventData = el.target.getAttribute('data-sweep-click');
        trackEvent('click', _objectSpread2({}, eventData.split(",")));
      });
    });
    if ('true' === api.logs) {
      trackLogs();
    }
  });
  var trackEvent = function trackEvent(name, data) {
    trackEvents(name, data);
  };
  var trackPageView = function trackPageView() {
    trackPageViews();
  };
  var trackLogs = function trackLogs() {
    trackErrors();
  };
  function getSyncScriptParams() {
    var scripts = document.currentScript;
    return {
      key: scripts.getAttribute('key'),
      logs: scripts.getAttribute('logs'),
      noCookie: scripts.getAttribute('noCookie')
    };
  }

}));
