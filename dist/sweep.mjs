/*!
 * sweep-analytics-js v0.0.1
 * Copyright (c) 2019-2019 Fabian Bentz & Jonas Regner
 * License: MIT
 */
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

function sweep() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var clientId = apiKey;
  console.log(clientId);
  if (!clientId) {
    throw new Error('No api key provided');
  }
}

export default sweep;
