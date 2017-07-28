export default {
  linear: function (t, b, c, d) {
    return c * t/d + b;
  },
  // 二次曲线
  easeIn: function (t, b, c, d) {
    t /= d;
    return c * t * t + b;
  },
  easeOut: function (t, b, c, d) {
    t /= d;
    return c * t * (2 - t) + b;
  },
  easeInOut: function (t, b, c, d) {
    t /= d;
    if ((t *= 2) < 1) {
      return c * 0.5 * t * t + b;
    }
    return - 0.5 * c * (--t * (t - 2) - 1) + b;
  },

  // 三次曲线
  cubicIn: function (t, b, c, d) {
    t /= d;
    return t * t * t * c + b;
  },
  cubicOut: function (t, b, c, d) {
    t /= d;
    return (--t * t * t + 1) * c + b;
  },
  cubicInOut: function (t, b, c, d) {
    t /= d;
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t * c + b;
    }
    return 0.5 * ((t -= 2) * t * t + 2) * c + b;
  },

  // 四次曲线
  QuarticIn: function (t, b, c, d) {
    t /= d
    return t * t * t * t * c + b;
  },
  QuarticOut: function (t, b, c, d) {
    t /= d
    return (1 - (--t * t * t * t)) * c + b;
  },
  QuarticInOut: function (t, b, c, d) {
    t /= d
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t * t * c + b;
    }
    return (- 0.5 * ((t -= 2) * t * t * t - 2)) * c + b;
  },

  ExponentialIn: function (t, b, c, d) {
    t /= d
    return t === 0 ? 0 : Math.pow(1024, t - 1) * c + b;
  },
  ExponentialOut: function (t, b, c, d) {
    t /= d
    return t === 1 ? c + b : (1 - Math.pow(2, - 10 * t)) * c + b;
  },
  ExponentialInOut: function (t, b, c, d) {
    t /= d
    if (t === 0) {
      return 0;
    }
    if (t === 1) {
      return 1;
    }
    if ((t *= 2) < 1) {
      return 0.5 * Math.pow(1024, t - 1) * c + b;
    }
    return 0.5 * (- Math.pow(2, - 10 * (t - 1)) + 2) * c + b;
  },

  CircularIn: function (t, b, c, d) {
    t /= d
    return (1 - Math.sqrt(1 - t * t)) * c + b;
  },
  CircularOut: function (t, b, c, d) {
    t /= d
    return Math.sqrt(1 - (--t * t)) * c + b;
  },
  CircularInOut: function (t, b, c, d) {
    t /= d
    if ((t *= 2) < 1) {
      return (- 0.5 * (Math.sqrt(1 - t * t) - 1)) * c + b;
    }
    return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1) * c + b;
  }
}