function Polygon(verts, x, y, z, rot, col) {
  this.verts = verts;
  this.gravCenterX = null;
  this.gravCenterY = null;
  this.posX = x || 0;
  this.posY = y || 0;
  this.posZ = z || 0;
  this.prevPosX = this.posX;
  this.prevPosY = this.posY;
  this.prevPosZ = this.posZ;
  this.velX = 0;
  this.velY = 0;
  this.velZ = 0;
  this.rot = rot || 0;
  this.prevRot = this.rot;
  this.bodyCol = col || "#ff00ff";
  this.outlineCol = Color.lighten(this.bodyCol, 2);
  this.shadow = true;
  this.outline = true;
  this.zendex = 0;
}

Polygon.prototype.setPosition = function(x, y, z) {
  this.posX = x;
  this.posY = y;
  if (z) this.posZ = z;
};

Polygon.prototype.computeMassCenter = function() {
  var off = this.verts[0];
  var twicearea = 0;
  var x = 0;
  var y = 0;
  var p1, p2;
  var f;
  for (var i = 0, j = this.verts.length - 1; i < this.verts.length; j = i++) {
    p1 = this.verts[i];
    p2 = this.verts[j];
    f = (p1[0] - off[0]) * (p2[1] - off[1]) - (p2[0] - off[0]) * (p1[1] - off[1]);
    twicearea += f;
    x += (p1[0] + p2[0] - 2 * off[0]) * f;
    y += (p1[1] + p2[1] - 2 * off[1]) * f;
  }

  f = twicearea * 3;

  this.gravCenterX = x / f + off[0];
  this.gravCenterY = y / f + off[1];
};

Polygon.prototype.rotate = function(angle, pivotX=this.gravCenterX, pivotY=this.gravCenterY) {
  var radians = angle * Math.PI / 180;
  for (var i = 0; i < this.verts.length; i++) {
    var rx = Math.cos(radians) * (this.verts[i][0] - pivotX) - Math.sin(radians) * (this.verts[i][1] - pivotY) + pivotX;
    var ry = Math.sin(radians) * (this.verts[i][0] - pivotX) + Math.cos(radians) * (this.verts[i][1] - pivotY) + pivotY;
    this.verts[i][0] = rx;
    this.verts[i][1] = ry;
  }
};

Polygon.prototype.move = function(velX, velY) {
  this.velX = velX;
  this.velY = velY;
};

Polygon.prototype.update = function() {
  this.prevPosX = this.posX;
  this.prevPosY = this.posY;
  this.prevRot = this.rot;

  this.posX += this.velX;
  this.posY += this.velY;

  this.velX *= 0.54;
  this.velY *= 0.54;
  if (Math.abs(this.velX) < 0.001) this.velX = 0;
  if (Math.abs(this.velY) < 0.001) this.velY = 0;
};

Polygon.prototype.drawShadow = function(ctx, interp) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(this.verts[0][0], this.verts[0][1]);
  for (var i = 0; i < this.verts.length; i++) {
    ctx.lineTo(this.verts[i][0], this.verts[i][1]);
  }
  ctx.lineTo(this.verts[0][0], this.verts[0][1]);
  ctx.closePath();
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fill();
  ctx.restore();
};

Polygon.prototype.drawOutline = function(ctx, interp) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(this.verts[0][0], this.verts[0][1]);
  for (var i = 0; i < this.verts.length; i++) {
    ctx.lineTo(this.verts[i][0], this.verts[i][1]);
  }
  ctx.lineTo(this.verts[0][0], this.verts[0][1]);
  ctx.closePath();
  ctx.strokeStyle = this.outlineCol;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
};

Polygon.prototype.drawBody = function(ctx, interp) {
  ctx.save();
  ctx.translate(0, -this.posZ);
  ctx.beginPath();
  ctx.moveTo(this.verts[0][0], this.verts[0][1]);
  for (var i = 0; i < this.verts.length; i++) {
    ctx.lineTo(this.verts[i][0], this.verts[i][1]);
  }
  ctx.lineTo(this.verts[0][0], this.verts[0][1]);
  ctx.closePath();
  ctx.fillStyle = this.bodyCol;
  ctx.fill();
  if (this.outline) this.drawOutline(ctx, interp);
  ctx.restore();
};

Polygon.prototype.draw = function(ctx, interp) {
  ctx.save();
  ctx.rotate((this.prevRot + (this.rot - this.prevRot) * interp) * Math.PI / 180);
  ctx.translate(this.prevPosX - this.gravCenterX + (this.posX - this.prevPosX) * interp, this.prevPosY - this.gravCenterY + (this.posY - this.prevPosY) * interp);
  if (this.posZ > 0 && this.shadow) this.drawShadow(ctx, interp);
  this.drawBody(ctx, interp);
  ctx.restore();
};
