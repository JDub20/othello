var Coordinate = function (row, column) {
	var row = row;
	var column = column;

	this.getRow = function() {
		return row;
	}

	var setRow = function(row) {
		this.row = row;
	}

	this.getColumn = function() {
		return column;
	}

	var setColumn = function(column) {
		this.column = column;
	}
}