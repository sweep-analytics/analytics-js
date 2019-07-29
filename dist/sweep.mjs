/*!
 * sweep-analytics-js v0.0.1
 * Copyright (c) 2019-2019 Fabian Bentz & Jonas Regner
 * License: MIT
 */
var debug = require('debug')('cookie');
module.exports = function (name, value, options) {
  switch (arguments.length) {
    case 3:
    case 2:
      return set(name, value, options);
    case 1:
      return get(name);
    default:
      return all();
  }
};
function set(name, value, options) {
  options = options || {};
  var str = encode(name) + '=' + encode(value);
  if (null == value) options.maxage = -1;
  if (options.maxage) {
    options.expires = new Date(+new Date() + options.maxage);
  }
  if (options.path) str += '; path=' + options.path;
  if (options.domain) str += '; domain=' + options.domain;
  if (options.expires) str += '; expires=' + options.expires.toUTCString();
  if (options.secure) str += '; secure';
  document.cookie = str;
}
function all() {
  var str;
  try {
    str = document.cookie;
  } catch (err) {
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(err.stack || err);
    }
    return {};
  }
  return parse(str);
}
function get(name) {
  return all()[name];
}
function parse(str) {
  var obj = {};
  var pairs = str.split(/ *; */);
  var pair;
  if ('' == pairs[0]) return obj;
  for (var i = 0; i < pairs.length; ++i) {
    pair = pairs[i].split('=');
    obj[decode(pair[0])] = decode(pair[1]);
  }
  return obj;
}
function encode(value) {
  try {
    return encodeURIComponent(value);
  } catch (e) {
    debug('error `encode(%o)` - %o', value, e);
  }
}
function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch (e) {
    debug('error `decode(%o)` - %o', value, e);
  }
}

var rng = require('./lib/rng');
var bytesToUuid = require('./lib/bytesToUuid');
function v4(options, buf, offset) {
  var i = buf && offset || 0;
  if (typeof options == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }
  return buf || bytesToUuid(rnds);
}
module.exports = v4;

function sweep() {
  var apiKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var clientId = apiKey;
  if (!clientId) {
    throw new Error('No api key provided');
  }
}

export default sweep;
