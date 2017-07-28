export default {
  isFunc: function (obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  },
  isArray: function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
  },
  isObject: function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  },
  isNum: function (num) {
    return Object.prototype.toString.call(num) === '[object Number]';
  },
  isStr: function (str) {
    return Object.prototype.toString.call(str) === '[object String]';
  }
}