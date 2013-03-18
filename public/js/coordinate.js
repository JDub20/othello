var Coordinate = function (row, column) {
	var row = row;
	var column = column;

	this.getRow = function() {
		return row;
	}

	this.getColumn = function() {
		return column;
	}

}