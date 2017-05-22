import easing from './src/easing.js'
import util from './src/util.js'
import draw from './src/draw.js'
// to be done
// 适配

window.Canimation = function (canvas, width, height) {
	this.w = canvas.width = width + '';
	this.h = canvas.height = height + '';
	this.ctx = canvas.getContext('2d');
	this.t = 0;
	this.cacheCanvas = document.createElement('canvas');
	this.cacheCtx = this.cacheCanvas.getContext('2d');
	this.cacheCanvas.width = this.w + '';
	this.cacheCanvas.height = this.h + '';
}

Canimation.prototype.now = window.performance.now ? 
	window.performance.now.bind(window.performance) 
	: 
	function () {
		return new Date().getTime();
	}

Canimation.prototype.aSin = function (x, y, cx, cy) {
	var r = Math.pow((y - cy) * (y - cy) + (x - cx) * (x - cx), .5);
	if (x - cx >= 0) {
		return (Math.asin((y - cy) / r));
	} else {
		return Math.PI - Math.asin((y - cy) / r);
	}
}

Canimation.prototype.createAnimation = function (option, loop) {
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
				let rad = from.rad || this.aSin(from.x, from.y, cx, cy) / Math.PI;
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

	loop = loop || false;

	this.animate(maxDuration, loop);
};

Canimation.prototype.animate = function (maxDuration, loop) {
	var start = this.now();
	var _this = this;

	if (window.requestAnimationFrame) {
		var animate = function () {
			if (_this.t > maxDuration) {
				if (loop === true) {
					start = _this.now();
					_this.t = 0;
				} else {
					return;
				}
			}

			render();
			requestAnimationFrame(animate)
		}

		animate();
	} else {
		var id = setInterval(function () {
			if (_this.t > maxDuration) {
				clearInterval(id);
				return;
			}

			render();
		}, 19)
	}

	function render () {
		_this.ctx.clearRect(0, 0, _this.w, _this.h);
		_this.cacheCtx.clearRect(0, 0, _this.w, _this.h);

		// 绘制图形到离屏canvas
		for (var i = 0, len = _this.iterator.length; i < len; i++) {
			if (_this.t < _this.iterator[i].dur) {
				_this.draw[_this.iterator[i].name](_this.iterator[i], _this.cacheCtx);
			}
		}

		// 绘制到canvas
		_this.ctx.drawImage(_this.cacheCanvas, 0, 0);

		// 更新时间参数
		_this.t = _this.now() - start;
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

Canimation.prototype.draw = draw;

Canimation.prototype.easing = easing;

Canimation.prototype.util = util;