var Compass = function () {
	var directionNames = ['NORTH', 'SOUTH',	'EAST', 'WEST',
		'NORTHEAST','NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'];

	var directions = [ new VerticalNorth(), new VerticalSouth(),
				new HorizontalEast(), new HorizontalWest(),
				new DiagonalNorthEast(), new DiagonalNorthWest(),
				new DiagonalSouthEast(), new DiagonalSouthWest()];

	this.getDirections = function () {
		return directions;  
	};

	this.getDirectionNames = function () {
		return directionNames;
	}

	this.getDirectionByName = function (directionName) {
		var i = directionNames.indexOf(directionName);
		return directions[i];
	}

  directions.forEach(function (direction, index, array) {
    direction.__proto__.step = function (coordinate) {
      var newR = direction.rStep(coordinate.getRow());
      var newC = direction.cStep(coordinate.getColumn());
      return new Coordinate(newR,newC);
    };

    direction.__proto__.stepTwice = function (coordinate) {
      var newR = direction.rStepTwice(coordinate.getRow());
      var newC = direction.cStepTwice(coordinate.getColumn());
      return new Coordinate(newR,newC);
    };
  });


};

var VerticalSouth = function() {
	
	this.other = function () {
		return new VerticalNorth();
	};

	this.rStep = function(r) {
		return r + 1;
	};


	this.cStep = function(c) {
		return c;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getRow() < boardDimension;	
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getRow() < anchor.getRow();
	};

};

var HorizontalEast = function() {

	this.other = function() {
		return new HorizontalWest();
	};

	this.rStep = function(r) {
		return r;
	};

	this.cStep = function(c) {
		return c + 1;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getColumn() < boardDimension;	
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getColumn() < anchor.getColumn();
	};
};

var VerticalNorth = function() {
  this.step = function (coordinate) {
    var newR = this.rStep(coordinate.getRow());
    var newC = this.cStep(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };

  this.stepTwice = function (coordinate) {
    var newR = this.rStepTwice(coordinate.getRow());
    var newC = this.cStepTwice(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };
  
	this.other = function() { 
		return new VerticalSouth();
	};

	this.rStep = function(r) {
		return r - 1;
	};

	this.cStep = function(c) {
		return c;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getRow() >= 0;	
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getRow() > anchor.getRow();
	};
};

var HorizontalWest = function() {
  this.step = function (coordinate) {
    var newR = this.rStep(coordinate.getRow());
    var newC = this.cStep(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };

  this.stepTwice = function (coordinate) {
    var newR = this.rStepTwice(coordinate.getRow());
    var newC = this.cStepTwice(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };
  
	this.other = function() {
		return new HorizontalEast();
	};

	this.rStep = function(r) {
		return r;
	};

	this.cStep = function(c) {
		return c - 1;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getColumn() >= 0;
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getColumn() > anchor.getColumn();
	};
};

var DiagonalNorthEast = function() {
  this.step = function (coordinate) {
    var newR = this.rStep(coordinate.getRow());
    var newC = this.cStep(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };

  this.stepTwice = function (coordinate) {
    var newR = this.rStepTwice(coordinate.getRow());
    var newC = this.cStepTwice(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };
  
	this.other = function() {
		return new DiagonalSouthWest();
	};

	this.rStep = function(r) {
		return r - 1;
	};

	this.cStep = function(c) {
		return c + 1;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getRow() >= 0 &&
           coordinate.getColumn() < boardDimension;
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getRow() > anchor.getRow() && 
           coordinate.getColumn() < anchor.getColumn();
	};
};

var DiagonalNorthWest = function() {
  this.step = function (coordinate) {
    var newR = this.rStep(coordinate.getRow());
    var newC = this.cStep(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };

  this.stepTwice = function (coordinate) {
    var newR = this.rStepTwice(coordinate.getRow());
    var newC = this.cStepTwice(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };
  
	this.other = function() {
		return new DiagonalSouthEast();
	};

	this.rStep = function(r) {
		return r - 1;
	};

	this.cStep = function(c) {
		return c - 1;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getRow() >= 0 && 
           coordinate.getColumn() >= 0;
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getRow() > anchor.getRow() && 
           coordinate.getColumn() > anchor.getColumn();
	};
};

var DiagonalSouthEast = function() {
  this.step = function (coordinate) {
    var newR = this.rStep(coordinate.getRow());
    var newC = this.cStep(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };

  this.stepTwice = function (coordinate) {
    var newR = this.rStepTwice(coordinate.getRow());
    var newC = this.cStepTwice(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };
  
	this.other = function() {
		return new DiagonalNorthWest();
	};

	this.rStep = function(r) {
		return r + 1;
	};

	this.cStep = function(c) {
		return c + 1;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getRow() < boardDimension &&
           coordinate.getColumn() < boardDimension;
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getRow() < anchor.getRow() &&
           coordinate.getColumn() < anchor.getColumn();
	};
};

var DiagonalSouthWest = function() {
  this.step = function (coordinate) {
    var newR = this.rStep(coordinate.getRow());
    var newC = this.cStep(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };

  this.stepTwice = function (coordinate) {
    var newR = this.rStepTwice(coordinate.getRow());
    var newC = this.cStepTwice(coordinate.getColumn());
    return new Coordinate(newR,newC);
  };
  
	this.other = function() {
		return new DiagonalNorthEast();
	};
	
	this.rStep = function(r) {
		return r + 1;
	};

	this.cStep = function(c) {
		return c - 1;
	};

	this.rStepTwice= function(r) {
		return this.rStep(this.rStep(r));
	};

	this.cStepTwice= function(c) {
		return this.cStep(this.cStep(c));
	};

	this.onBoard = function(boardDimension, coordinate) {
		return coordinate.getRow() < boardDimension &&
           coordinate.getColumn() >= 0;
	};

	this.inBetween = function(coordinate, anchor) {
		return coordinate.getRow() < anchor.getRow() && 
           coordinate.getColumn() > anchor.getColumn();
	};
};