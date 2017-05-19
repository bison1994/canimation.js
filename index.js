
// to be done
// 适配

window.Canimation = function (canvas, width, height) {
	this.w = canvas.width = width + '';
	this.h = canvas.height = height + '';
	this.ctx = canvas.getContext('2d');
	this.t = 0;
}

Canimation.prototype.now = window.performance.now ? 
	window.performance.now.bind(window.performance) 
	: 
	function () {
		return new Date().getTime();
	}

Canimation.prototype.createAnimation = function (option) {
	this.iterator = [];

	var maxDuration = 1000;
	var _this = this;

	for (var key in option) {
		var action = option[key];

		if (action.duration && action.duration > maxDuration) {
			maxDuration = action.duration;
		}

		// 将终点状态统一到 to 属性上
		if (action.arcTo) {
			action.to = action.arcTo;
			action.arcTo = true;
		}

		// 将对象包裹为数组形式
		if (this.util.isObject(action.from)) {
			action.from = [action.from];
		}
		if (this.util.isObject(action.to)) {
			action.to = [action.to];
		}

		// 处理数组中每个对象的属性，将需要改变的属性设为存取器属性
		for (var i = 0; i < action.from.length; i++) {
			let from = action.from[i];
			let to = action.to[i];
			let dur = action.duration || 1000;
			let easing = action.easing || 'linear';
			let obj = {
				name: key, 
				dur: dur,
				easing: easing
			};

			for (var prop in from) {
				if (!to[prop] || from[prop] === to[prop]) {
					obj[prop] = from[prop]
				} else {
					if (!this.util.isNum(from[prop]) || !this.util.isNum(to[prop])) {
						throw new Error('the variable param must be number')
					}

					let b = from[prop];
					let c = to[prop] - from[prop];

					Object.defineProperty(obj, prop, {
					  get: function () {
							return _this.easing[obj.easing](_this.t, b, c, obj.dur)
					  }
					});
				}
			}

			if (action.arcTo) {
 				let cx = to._x;
				let cy = to._y;
				let rad = Math.atan((from.y - cy) / (from.x - cx)) / Math.PI;
				let R = to._R;
				let r = to._r;
				let e = to._e || 2;

				Object.defineProperty(obj, 'x', {
					get: function () {
						var radian = _this.easing[obj.easing](_this.t, rad, e, obj.dur)
						return cx + R * Math.cos(Math.PI * radian)
					}
				})

				Object.defineProperty(obj, 'y', {
					get: function () {
						var radian = _this.easing[obj.easing](_this.t, rad, e, obj.dur)
						return cy + r * Math.sin(Math.PI * radian)
					}
				})
			}

			// 参数再加工
			obj = this.processParam[key](obj);

			this.iterator.push(obj);
		}
	}

	this.animate(maxDuration);
};

Canimation.prototype.draw = {
	circle: function (param, ctx) {
		ctx.beginPath();
		ctx.arc(param.x, param.y, param.r, 0, Math.PI * 2, true);
		ctx.fillStyle = param.fill;
		ctx.fill();
		ctx.closePath();
	},

	arc: function (param, ctx) {
		ctx.beginPath();
		ctx.arc(param.x, param.y, param.r, Math.PI * 2 * param.s, Math.PI * 2 * param.e, param.c);
		ctx.fillStyle = param.fill;
		ctx.strokeStyle = param.stroke;
		ctx.lineWidth = param.width;
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
	},

	text: function (param, ctx) {
		ctx.font = param.font;
		ctx.fillStyle = param.fill;
		ctx.fillText(Math.floor(param.text), param.x, param.y)
	}
}

Canimation.prototype.animate = function (maxDuration) {
	var start = this.now();
	var _this = this;

	if (window.requestAnimationFrame) {
		var animate = function () {
			if (_this.t > maxDuration) {
				return;
			}

			loop();
			requestAnimationFrame(animate)
		}

		animate();
	} else {
		var id = setInterval(function () {
			if (_this.t > maxDuration) {
				clearInterval(id);
				return;
			}

			loop();
		}, 19)
	}

	function loop () {
		_this.ctx.clearRect(0, 0, _this.w, _this.h);

		// 绘制图形
		for (var i = 0, len = _this.iterator.length; i < len; i++) {
			if (_this.t < _this.iterator[i].dur) {
				_this.draw[_this.iterator[i].name](_this.iterator[i], _this.ctx);
			}
		}

		// 更新时间参数
		_this.t = _this.now() - start;
	}
}

Canimation.prototype.easing = {
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

Canimation.prototype.util = {
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

Canimation.prototype.processParam = {
	circle: function (param) {
		param.fill = param.fill || '#000';

		return param
	},

	arc: function (param) {
		param.fill = param.fill || 'transparent';
		param.stroke = param.stroke || '#000';
		param.width = param.width || 2;

		return param
	},

	text: function (param) {
		param.font = param.font || '14px Arial';
		param.fill = param.fill || '#000';

		return param
	}
}
