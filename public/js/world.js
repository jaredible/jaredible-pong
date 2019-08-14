var World = {
  polygons: [],
  drawLayers: [],
  player: null,
  updateCounter: 0
};

World.addPolygon = function(polygon) {
  this.polygons.push(polygon);
  this.polygons.sort(function(p1, p2) {
    if (p2.posZ < p1.posZ) return 1;
    if (p2.posZ > p1.posZ) return -1;
    if (p2.zendex < p1.zendex) return 1;
    if (p2.zendex > p1.zendex) return -1;
    return 0;
  });
};

World.removePolygon = function(polygon) {
  this.polygons.splice(this.polygons.indexOf(polygon), 1);
}

World.update = function() {
  for (var i = 0; i < this.polygons.length; i++) {
    this.polygons[i].update();
  }
  this.updateCounter++;
  this.player.rotate(1);
};

World.drawBackground = function(ctx, interp) {
};

World.drawPolygons = function(ctx, interp) {
  // TODO: drawLayers for shadows
  for (i = 0; i < this.polygons.length; i++) {
    this.polygons[i].draw(ctx, interp);
  }
};

World.draw = function(ctx, interp) {
  this.drawBackground(ctx, interp);
  this.drawPolygons(ctx, interp);
};
