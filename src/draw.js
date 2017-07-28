export default {
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