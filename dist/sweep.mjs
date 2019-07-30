/*!
 * sweep-analytics-js v0.0.1
 * Copyright (c) 2019-2019 Fabian Bentz & Jonas Regner
 * License: MIT
 */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
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

var cookie =
function () {
  function cookie() {
    _classCallCheck(this, cookie);
  }
  _createClass(cookie, [{
    key: "set",
    value: function set(name, value) {
      var date = new Date();
      date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
      var expires = "; expires=" + date.toUTCString();
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }
  }, {
    key: "get",
    value: function get(name) {
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
  }]);
  return cookie;
}();

var Sweep =
function () {
  function Sweep(apiKey) {
    _classCallCheck(this, Sweep);
    this.clientId = apiKey;
    this.trackEventMutation = function () {
      return "mutation trackEvent($name: String!, $client: String!, $meta: JSON) {\n          trackEvent(input: { name: $name, client: $client, meta: $meta }) { \n            name,\n            client,\n            meta\n          }\n        }";
    };
  }
  _createClass(Sweep, [{
    key: "trackPageViews",
    value: function trackPageViews() {
      if (!cookie.get('s_a_js_uid')) {
        cookie.set('s_a_js_uid', v4_1());
      }
      var url = document.location.pathname;
      var referrer = document.referrer;
      var language = navigator.language;
      var platform = navigator.platform;
      var screen = "".concat(screen.width, "x").concat(screen.height);
      var meta = {
        url: url,
        referrer: referrer,
        anonymousId: cookie.get('s_a_js_uid'),
        language: language,
        platform: platform,
        screen: screen
      };
      var options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operationName: 'trackEvent',
          query: this.trackEventMutation(),
          variables: {
            name: 'userSession',
            client: this.clientId,
            meta: meta
          }
        })
      };
      fetch("https://api.sweep-analytics.com/graphql", options).then(function (res) {
        console.log(res.json());
      }).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: "trackEvent",
    value: function trackEvent(event) {
      var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (!cookie.get('s_a_js_uid')) {
        cookie.set('s_a_js_uid', v4_1());
      }
      meta.path = document.location.pathname;
      var options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          operationName: 'trackEvent',
          query: this.trackEventMutation(),
          variables: {
            name: event,
            client: this.clientId,
            meta: meta
          }
        })
      };
      fetch('https://api.sweep-analytics.com/graphql', options).then(function (res) {
        console.log(res.json());
      }).catch(function (error) {
        console.log(error);
      });
    }
  }]);
  return Sweep;
}();

export default Sweep;
