//flips list of flip
//size of flip
var Move = function (flips) {
	var flips = flips;

	this.getFlips = function() {
		return flips;
	};

  this.noMoves = function () {
    return flips.length == 0;
  };

  this.getNewDisk = function () {
    if (flips.length > 0) {
      return flips[0].getNewDisk();
    };
    return ;
  }

};

//a flip is meant to represent the line flipped
//it is defined by the newDisk coordinate, the 
//direction of the flip, and the anchor, which 
//is the end opposite where the new piece was placed

var Flip = function (newDisk, direction, anchor) {
  var newDisk = newDisk;
  var direction = direction;
  var anchor = anchor;

  this.getNewDisk = function () {
    return newDisk;
  };

  this.getDirection = function () {
    return direction;
  };

  this.getAnchor = function () {
    return anchor;
  };

}
