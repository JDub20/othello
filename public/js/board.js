//
// Implementation of the Board ADT 
// Contains all the game logic
//
var Board = function (boardDimension) {
	var PLAYER_1 = {}, PLAYER_2 = {}, NONE = {};
	PLAYER_1.other = PLAYER_2;
	PLAYER_1.cssClass = "player1";
	PLAYER_1.score = 2;
	PLAYER_1.scoreLabelId = "alienScore"

	PLAYER_2.other = PLAYER_1;
	PLAYER_2.cssClass = "player2";
	PLAYER_2.score = 2;
	PLAYER_2.scoreLabelId = "ninjaScore"

  var compass = new Compass();
	
	// for debugging
	PLAYER_1.toString = function() {return "Alien";};
	PLAYER_2.toString = function() {return "Ninja";};
	NONE.toString = function() {return "-";};

	var moveStack = [];
	var redoQueue = [];

	var board = [];
	var currentPlayerId = 0;
	var that = this;
	var updateCurrentPlayerId = function() {
		currentPlayerId = (currentPlayerId + 1) % 2 ;
	};

	for (var row = 0; row < boardDimension; row++) {
		board.push(Array.dim(boardDimension, NONE));
	};

	board[3][3] = PLAYER_1;
	board[3][4] = PLAYER_2;
	board[4][3] = PLAYER_2;
	board[4][4] = PLAYER_1;

	this.getPlayer = function (i) {
		var players = {0: PLAYER_1, 1: PLAYER_2};		
		return players[i];
	};	

	this.getCurrentPlayer = function() {
		return that.getPlayer(currentPlayerId);
	};

	this.undo = function () {
		var move = moveStack.pop();

		if (move == undefined) {
			return undefined;
		};

		redoQueue.push(move);

		var cell = move.getNewDisk();
		var row = cell.getRow();
		var col = cell.getColumn();


		board[row][col] = NONE;

		that.getCurrentPlayer().other.score -= 1;

		updateLine(move, true);
		
		updateCurrentPlayerId();
		return move;

	};

	var updateLine = function  (move, undoing) {
		var player = that.getCurrentPlayer();
    move.getFlips().forEach(function (flip, index, array) {
      var newDisk = flip.getNewDisk();
      var r1 = newDisk.getRow();
      var c1 = newDisk.getColumn();
      var step = new Coordinate(r1, c1);
      var direction = flip.getDirection();
      var anchor = flip.getAnchor();

      if (undoing) {
        step = direction.step(step);
      };

      while (direction.inBetween(step,anchor)) {
        updateScore(step, player);
        updateCell(step, player);
        step = direction.step(step);
      }


    });

	};

  var updateCell = function (coordinate, player) {
    var row = coordinate.getRow();
    var col = coordinate.getColumn();
    board[row][col] = player;
  };

	this.redo = function  () {
		var move = redoQueue.pop();
		if (move == undefined) return;
		that.play(move, true);
		return move;
	}

	var updateScore = function  (coordinate, player) {
    var row = coordinate.getRow();
    var col = coordinate.getColumn();

    //checking occupancy of cells
		oldName = board[row][col];
		if (oldName == NONE) player.score +=1;
		if (player == oldName.other) {
			oldName.score -= 1;
			player.score += 1;
		};

	};

	// mutate board by playing player in position
	// if the move is valid
	this.play = function (move, reDoing) {
		//you're clicking.  remove
		if (!reDoing) {
			redoQueue = [];
		};

		var player = that.getCurrentPlayer();

		moveStack.push(move);
 

		updateLine(move, false);

		updateCurrentPlayerId();
		
	};

	//return list of compatible ends
	this.verifyMove = function (coordinate) {
    var row = coordinate.getRow();
    var col = coordinate.getColumn();
    var flips = [];
		if (playerAt(coordinate) != NONE) return new Move(flips);
    
    compass.getDirections().forEach ( function (direction, index, array) {
      var anchor = getAnchor(coordinate, direction);
      if (anchor != undefined) {
        flips.push(new Flip(coordinate, direction, anchor));
      }
    });

		return new Move(flips);
	};

  // if a flip in direction is possible,
  // return the anchor opposite the (row, col)
  // in direction
	var getAnchor = function(coordinate, direction) {
		var anchor;
    var row = coordinate.getRow();
    var col = coordinate.getColumn();
		//move two over
    var step = new Coordinate(row,col);
    step = direction.stepTwice(step);
		var player = that.getCurrentPlayer();

    //look for potential anchor
    //if find disk of same kind at least two steps
    //ahead, then you've found potential anchor
		while (direction.onBoard(boardDimension, step)) {
			if (playerAt(step) == player) {
				anchor = new Coordinate(step.getRow(),step.getColumn());
				break;
			}
      step = direction.step(step);
		}

    //no anchor found
		if (anchor == undefined) return anchor;


		step = new Coordinate(row,col);
    step = direction.step(step);

    //if everything between (row,col) and anchor
    //are of opposite kind, then the anchor is
    //good
		while (direction.inBetween(step, anchor)) {
			if (playerAt(step) != player.other) {

				anchor = undefined;
				break;
			}
			step = direction.step(step);
		}

		return anchor;

	};

  var playerAt = function (coordinate) {
    return board[coordinate.getRow()][coordinate.getColumn()];
  }
	this.isGameOver = function() {

		for (var row = 0; row < board.length; row ++) {
			for (var col = 0; col < board.length; col ++) {
				var move = that.verifyMove(new Coordinate(row, col));
        //if there are moves, then game not over
				if (!move.noMoves()) {
					return false;
				}
			}
		}

		return true;
		
	};

};