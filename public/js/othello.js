//
// Othello
//


//
// Initialization after the page is loaded
//
$(document).ready(function () {
	var boardDimension = 8;
	var outcome = { "draw":"It's a draw!", "win":"I win!", "lose":"You beat me"};
	var DIRECTIONS = {'NORTH': new VerticalNorth(), 'SOUTH': new VerticalSouth(),
		'EAST': new HorizontalEast(),'WEST': new HorizontalWest(),
		'NORTHEAST': new DiagonalNorthEast(),'NORTHWEST': new DiagonalNorthWest(),
		'SOUTHEAST': new DiagonalSouthEast(), 'SOUTHWEST': new DiagonalSouthWest()};
	// create elements

	var elements = [];

	// create a new board
	var board = new Board(boardDimension);

	for (var row = 0; row < boardDimension; row++) {
		elements.push(Array.dim(boardDimension).map(function () {
			var box = $("<div>");
			box.addClass("box");
			$("#board").append(box);
			return box;
		}));
	};


	var updateTurnLabel = function() {
		var player = board.getCurrentPlayer();
		$("#turn").html("");
		$("#turn").prepend(player.turnHTML);
	};

	var updateScoreLabel = function() {
		var player = board.getCurrentPlayer();
		var scoreLabelId = player.scoreLabelId;
		var score = player.score;
		var playerString = player.toString();
		$("#" + scoreLabelId).html(playerString + " " + score);
		scoreLabelId = player.other.scoreLabelId;
		score = player.other.score;
		playerString = player.other.toString();
		$("#" + scoreLabelId).html(playerString + " " + score);
	};


	elements[3][3].prepend(board.getPlayer(0).imageHTML);
	elements[3][4].prepend(board.getPlayer(1).imageHTML);
	elements[4][3].prepend(board.getPlayer(1).imageHTML);
	elements[4][4].prepend(board.getPlayer(0).imageHTML);
	updateTurnLabel();
	updateScoreLabel();


	$('#undoButton').click(function() {
		var move = board.undo();
		if (move == undefined) return;
		var ends = move.getEnds();
		var e1 = move.getClickedEnd();
		var player = board.getCurrentPlayer().other;
		renderLines(player, e1, ends, true);
		updateScoreLabel();

	});

	$('#redoButton').click(function() {
		var move = board.redo();
		if (move == undefined) return;
		var ends = move.getEnds();
		var e1 = move.getClickedEnd();
		var player = board.getCurrentPlayer().other;
		renderLines(player, e1, ends, false);
		updateScoreLabel();
	});

	// attach renderGuess methods to elements
	elements.forEach(function(cells, row) {
		cells.forEach(function(cell, column) {
			cell.renderGuess = function (switchOn) {
				if (switchOn) {
					cell.addClass("guess");
				} else {
					cell.removeClass("guess");
				}
			};	
		});
	});

	// attach render methods to elements
	elements.forEach(function(cells, row) {
		cells.forEach(function(cell, column) {
			cell.render = function (player, deRendering) {
				if (!deRendering) {
					cell.renderGuess(false);
					cell.html("");
					cell.prepend(player.imageHTML);
				} else {
					cell.html("");
				}

			};	
		});
	});

	//attach hover method
	elements.forEach(function(cells, row) {
		cells.forEach(function(cell, column) {
			 cell.hover(
			 	function() {
			 		var ends = board.verifyMove(row, column);
	 				if (!Object.keys(ends).isEmpty()) {
	 					cell.renderGuess(true);
	 				}
			 	},
			 	function() {
			 		cell.renderGuess(false);
			 });
		});
	});

	//colors a line, updates score and turnlabel
	var renderLines = function(player, e1, ends, undoing) {
		for (dName in ends) {
			if (dName in DIRECTIONS) {
				var direction = DIRECTIONS[dName];
				var r1 = e1.getRow();
				var c1 = e1.getColumn();
				var e2 = ends[dName];
				if (undoing) {
					elements[r1][c1].render(player, true);
					r1 = direction.rStep(r1);
					c1 = direction.cStep(c1);
				}

				while (direction.inBetweenEnds(r1,c1,e2)) {
					elements[r1][c1].render(player, false);
					r1 = direction.rStep(r1);
					c1 = direction.cStep(c1);
				}
			}
		}
		updateTurnLabel();
		
	};


	elements.forEach(function(cells, row, elements) {
		cells.forEach(function(cell, column) {
			 cell.click(function() {
		 		var ends = board.verifyMove(row, column);
		 		if (Object.keys(ends).isEmpty()) return;
		 		var e = new Coordinate(row,column);
		 		var player = board.getCurrentPlayer();
		 		renderLines(player, e ,ends, false);
				board.play(e, ends, false);
				updateScoreLabel();
				updateTurnLabel();

				if (board.isGameOver()) {
					updateTurnLabel();
					$("#outcome").html("Winner: " + board.getCurrentPlayer().toString());
				}


		 	});
		});
	});


});