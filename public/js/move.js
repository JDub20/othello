//flips list of flip
//size of flip
//only nonEmpty moves are made
var Move = function (player, newDisk, flipGenerator) {
  var that = this;
  var player = player;
  var flips = flipGenerator(newDisk);
  var deltaScore = {};
  var flippedDisks = [];
  var newDisk = newDisk;

  flips = flipGenerator(newDisk);

  flips.forEach(function (flip, index, flips) {
    flip.getFlippedDisks().forEach(function (cell, i, line) {
      flippedDisks.push(cell)
    });
  });

  deltaScore[player] = 1 + flippedDisks.length;
  deltaScore[player.other] = -flippedDisks.length;

  this.getAllUpdatedCoordinates = function () {
    return [newDisk].concat(flippedDisks);
  };

  this.getFlippedDisks = function () {
    return flippedDisks;
  };

  this.getDeltaScorePlayer = function (player) {
    return deltaScore[player];
  }

  this.getNewDisk = function () {
    return newDisk;
  };

  this.getPlayer = function () {
    return player;
  };

};

//a flip is meant to represent the line flipped
//it is defined by the newDisk coordinate, the 
//direction of the flip, and the anchor, which 
//is the end opposite where the new piece was placed

var Flip = function (direction, newDisk, flippedDisks, anchor) {
  //where a new disk has been placed
  var newDisk = newDisk;
  //direction from: newDisk to: anchor
  var direction = direction;
  //the anchor piece that belongs to the same player
  var anchor = anchor;
  //the pieced flipped in between newDisk and Anchor
  var flippedDisks = flippedDisks;

  this.getNewDisk = function () {
    return newDisk;
  };

  this.getDirection = function () {
    return direction;
  };

  this.getAnchor = function () {
    return anchor;
  };

  this.getFlippedDisks =function() {
    return flippedDisks;
  };

}
