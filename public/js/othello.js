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

  var getGameMode = function() {
    return $('input[name=mode]:checked', '#gameMode').val();
  }

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
		var newDisk = move.getNewDisk();
		getElementAt(newDisk).deRender();
		renderLine(move.getFlippedDisks(), move.getPlayer().other);
		updateScoreLabel();

	});

	$('#redoButton').click(function() {
		var move = board.redo();
		if (move == undefined) return;
		renderLine(move.getAllUpdatedCoordinates(), move.getPlayer());
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
			cell.render = function (player) {
        cell.renderGuess(false);
        renderPiece(player, row, col);
			};	
		});
	});

  // attach deRender methods to elements
  elements.forEach(function(cells, row) {
    cells.forEach(function(cell, col) {
      cell.deRender = function () {
        cell.html("");
      };  
    });
  });

	//attach hover method
	elements.forEach(function(cells, row) {
		cells.forEach(function(cell, col) {
			 cell.hover(
			 	function() {
	 				if (board.verifyMove(new Coordinate(row, col))) {
	 					cell.renderGuess(true);
	 				}
			 	},
			 	function() {
			 		cell.renderGuess(false);
			 });
		});
	});


  var getElementAt = function (coordinate) {
    return elements[coordinate.getRow()][coordinate.getColumn()];
  };


  elements.forEach(function(cells, row, elements) {
    cells.forEach(function(cell, col) {
      cell.click(function() {
        var coordinate = new Coordinate(row,col);
        if (getElementAt(coordinate).hasClass("guess")) {
          var move = board.play(coordinate);
          renderLine(move.getAllUpdatedCoordinates(), move.getPlayer());
          updateTurnLabel(board.getCurrentPlayer());
          updateScoreLabel();
          if (board.isGameOver()) {
            gameOver();
            return;
          }

          if (getGameMode() =="hvc") {
            move = board.play(board.bestMove());
            renderLine(move.getAllUpdatedCoordinates(), move.getPlayer());
            updateTurnLabel(board.getCurrentPlayer());
            updateScoreLabel();
            if (board.isGameOver()) gameOver();
          }

        };
      });
    });
  });

  //takes a list of coordinates and what player to render
  var renderLine = function (coordinates, player) {
    coordinates.forEach( function (coordinate, index, coordinates) {
      getElementAt(coordinate).render(player);
    })
  };

  var gameOver = function () {
      $("undoButton").prop("disabled", true);
      $("redoButton").prop("disabled", true);
      var winner = board.getWinner();
      $("#outcome").html("Winner: " + winner.toString());
      updateTurnLabel(winner);
  }

});