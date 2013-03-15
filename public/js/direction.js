var VerticalSouth = function() {
	
	this.other = function () {
		return new VerticalNorth();
	};

	this.toString = "SOUTH";
	
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

	this.onBoard = function(boardDimension, r, c) {
		return r < boardDimension;	
	};

	this.inBetweenEnds = function(r, c, end) {
		return r < end.getRow();
	};

};

var HorizontalEast = function() {
	this.toString = "EAST";
	
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

	this.onBoard = function(boardDimension, r, c) {
		return c < boardDimension;	
	};

	this.inBetweenEnds = function(r, c, end) {
		return c < end.getColumn();
	};
};

var VerticalNorth = function() {

	this.other = function() { 
		return new VerticalSouth();
	};

	this.toString = "NORTH";
	
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

	this.onBoard = function(boardDimension, r, c) {
		return r >= 0;	
	};

	this.inBetweenEnds = function(r, c, end) {
		return r > end.getRow();
	};
};

var HorizontalWest = function() {

	this.other = function() {
		return new HorizontalEast();
	};

	this.toString = "WEST";

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

	this.onBoard = function(boardDimension, r, c) {
		return c >= 0;
	};

	this.inBetweenEnds = function(r, c, end) {
		return c > end.getColumn();
	};
};

var DiagonalNorthEast = function() {

	this.other = function() {
		return new DiagonalSouthWest();
	};

	this.toString = "NORTHEAST";

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

	this.onBoard = function(boardDimension, r, c) {
		return r >= 0 && c < boardDimension;
	};

	this.inBetweenEnds = function(r, c, end) {
		return r > end.getRow() && c < end.getColumn();
	};
};

var DiagonalNorthWest = function() {

	this.other = function() {
		return new DiagonalSouthEast();
	};

	this.toString = "NORTHWESTT";

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

	this.onBoard = function(boardDimension, r, c) {
		return r >= 0 && c >= 0;
	};

	this.inBetweenEnds = function(r, c, end) {
		return r > end.getRow() && c > end.getColumn();
	};
};

var DiagonalSouthEast = function() {

	this.other = function() {
		return new DiagonalNorthWest();
	};

	this.toString = "SOUTHEAST";

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

	this.onBoard = function(boardDimension, r, c) {
		return r < boardDimension && c < boardDimension;
	};

	this.inBetweenEnds = function(r, c, end) {
		return r < end.getRow() && c < end.getColumn();
	};
};

var DiagonalSouthWest = function() {

	this.other = function() {
		return new DiagonalNorthEast();
	};
	
	this.toString = "SOUTHWEST";

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

	this.onBoard = function(boardDimension, r, c) {
		return r < boardDimension && c >= 0;
	};

	this.inBetweenEnds = function(r, c, end) {
		return r < end.getRow() && c > end.getColumn();
	};
};