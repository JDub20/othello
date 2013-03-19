//
// Othello
//


//
// Initialization after the page is loaded
//
$(document).ready(function () {
	
  // $("#boardContainer").css("display", "none");
  // $("#gameInfoContainer").css("display", "none");


  var boardDimension = 8;
	
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


	var updateTurnLabel = function(player) {
		$("#turn").html("");
    var imageSrc = 'images/' + player.toString() + '.png';
    var image = $('<img>').attr('src', imageSrc);

		$("#turn").prepend(image);
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

  var renderPiece = function(player, row, col) {
    elements[row][col].html("");
    var imageSrc = 'images/' + player.toString() + '.png';
    var image = $('<img>').attr('src', imageSrc);
    elements[row][col].prepend(image);
  };

  renderPiece(board.getPlayer(0), 3, 3);
  renderPiece(board.getPlayer(1), 3, 4);
  renderPiece(board.getPlayer(1), 4, 3);
  renderPiece(board.getPlayer(0), 4, 4);

	updateTurnLabel(board.getCurrentPlayer());
	updateScoreLabel();


	$('#undoButton').click(function() {
		var move = board.undo();
		if (move == undefined) return;
		var player = board.getCurrentPlayer().other;
		renderLines(player, move, true);
		updateScoreLabel();

	});

	$('#redoButton').click(function() {
		var move = board.redo();
		if (move == undefined || move.noMoves()) return;
		var player = board.getCurrentPlayer().other;
		renderLines(player, move, false);
		updateScoreLabel();
	});

	// attach renderGuess methods to elements
	elements.forEach(function(cells, row) {
		cells.forEach(function(cell, col) {
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
		cells.forEach(function(cell, col) {
			cell.render = function (player, deRendering) {
				if (!deRendering) {
					cell.renderGuess(false);
					renderPiece(player, row, col);
				} else {
					cell.html("");
				}

			};	
		});
	});

	//attach hover method
	elements.forEach(function(cells, row) {
		cells.forEach(function(cell, col) {
			 cell.hover(
			 	function() {
			 		var move = board.verifyMove(new Coordinate(row, col));
	 				if (!move.noMoves()) {
	 					cell.renderGuess(true);
	 				}
			 	},
			 	function() {
			 		cell.renderGuess(false);
			 });
		});
	});

	//colors a line, updates score and turnlabel
	var renderLines = function(player, move, undoing) {
    move.getFlips().forEach(function (flip, index, array) {
      var step = flip.getNewDisk();
      var r1 = step.getRow();
      var c1 = step.getColumn();
      var direction = flip.getDirection();
      var anchor = flip.getAnchor();

      if (undoing) {
        getElementAt(step).render(player, true);
        step = direction.step(step);
      }

      while (direction.inBetween(step,anchor)) {
        getElementAt(step).render(player, false);
        step = direction.step(step);
      }

    });

		updateTurnLabel(player);
		
	};

  var getElementAt = function (coordinate) {
    return elements[coordinate.getRow()][coordinate.getColumn()];
  };


	elements.forEach(function(cells, row, elements) {
		cells.forEach(function(cell, col) {
			 cell.click(function() {
        coordinate = new Coordinate(row,col);
		 		var move = board.verifyMove(new Coordinate(row,col));
        if (move.noMoves()) return;
		 		var player = board.getCurrentPlayer();
		 		renderLines(player, move, false);
				board.play(move, false);
				updateScoreLabel();
				updateTurnLabel(board.getCurrentPlayer());

				if (board.isGameOver()) gameOver();

		 	});
		});
	});

  var gameOver = function () {
      $("undoButton").prop("disabled", true);
      $("redoButton").prop("disabled", true);
      var player  = board.getCurrentPlayer();
      var other = player.other;
      var winner;
      if (player.score > other.score) {
        winner = player;
        $("#outcome").html("Winner: " + winner.toString());
        updateTurnLabel(winner);
      } else if (player.score < other.score) {
        winner = other;
        $("#outcome").html("Winner: " + winner.toString());
        updateTurnLabel(winner);
      } else {
        $("#turn").html("");
        $("#outcome").html("Tie");
      }
  }

});