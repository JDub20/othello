//
// Implementation of the Board ADT 
// Contains all the game logic
//
var Board = function (boardDimension) {
	var that = this;

  var PLAYER_1 = {}, PLAYER_2 = {}, NONE = {};
  PLAYER_1.other = PLAYER_2;
  PLAYER_1.score = 2;
  PLAYER_1.scoreLabelId = "alienScore"

  PLAYER_2.other = PLAYER_1;
  PLAYER_2.score = 2;
  PLAYER_2.scoreLabelId = "ninjaScore"

  // for debugging
  PLAYER_1.toString = function() {return "Alien";};
  PLAYER_2.toString = function() {return "Ninja";};
  NONE.toString = function() {return "-";};

  var compass = new Compass();

  var moveStack = [];
  var redoQueue = [];

  var board = [];
  var currentPlayerId = 0;

  var winner;

  for (var row = 0; row < boardDimension; row++) {
    board.push(Array.dim(boardDimension, NONE));
  };

  board[3][3] = PLAYER_1;
  board[3][4] = PLAYER_2;
  board[4][3] = PLAYER_2;
  board[4][4] = PLAYER_1;

	var updateCurrentPlayer = function() {
		currentPlayerId = (currentPlayerId + 1) % 2 ;
	};

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
      return;
    };

    var player = move.getPlayer();
		redoQueue.push(move);

    //remove new disk
    updateCell(move.getNewDisk(), NONE);
    //unflip flipped cells
    move.getFlippedDisks().forEach(function (cell, i, cells) {
      updateCell(cell, player.other);
    })

    //undo score update
    player.score -= move.getDeltaScorePlayer(player);
    player.other.score -= move.getDeltaScorePlayer(player.other);

    updateCurrentPlayer();
    return move;

	};

  var updateCell = function (coordinate, player) {
    var row = coordinate.getRow();
    var col = coordinate.getColumn();
    board[row][col] = player;
  };

	this.redo = function  () {
		var move = redoQueue.pop();
		if (move == undefined) return;

    moveStack.push(move);
    var player = move.getPlayer();
		

    //mutate board
    move.getAllUpdatedCoordinates().forEach(function (cell, i, cells) {
      updateCell(cell, player);
    })

    //update score
    player.score += move.getDeltaScorePlayer(player);
    player.other.score += move.getDeltaScorePlayer(player.other);

    updateCurrentPlayer();

    return move;
	}

	// mutate board by playing player in position
	// return move
  // should only be called for VALID COORDINATE
	this.play = function (newDisk) {
		redoQueue = [];

    var player = that.getCurrentPlayer();
    var flips = [];
    move = new Move(player, newDisk, flipGenerator);

		moveStack.push(move);

    var player = move.getPlayer();

    //mutate board
    move.getAllUpdatedCoordinates().forEach(function (cell, i, cells) {
      updateCell(cell, player);
    })

    //update score
    player.score += move.getDeltaScorePlayer(player);
    player.other.score += move.getDeltaScorePlayer(player.other);

    updateCurrentPlayer();
		return move;
	};

	//return if play a coordinate would be valid
	this.verifyMove = function (coordinate) {
    return flipGenerator(coordinate).length > 0;
	};

  var flipGenerator = function(coordinate) {
    var player = that.getCurrentPlayer();
    var coordinates = [];
    var flips =[];

    //for each direction
    compass.getDirections().forEach ( function (direction, index, array) {
      var coordinates = [];
      //should not have a disk
      if (playerAt(coordinate) != NONE) return ;
      var step =  direction.step(coordinate);
      while (direction.onBoard(boardDimension, step)) {
        if (playerAt(step) == NONE) {
          return;
        } else if (playerAt(step) == player) {
          //disks of opposite sign inbetween disks of same sign
          if (coordinates.length > 0 ){
            step = direction.step(step);
            flips.push(new Flip(direction, coordinate, coordinates, step));
            return;
          //not disks of opposite sign inbetween disks of same sign
          } else {
            return;
          }
        } else {
          coordinates.push(step);
          step =  direction.step(step);
        }
      }
    });

    return flips;
  };

  this.getFlipGenerator = function () {
    return flipGenerator;
  }


  var playerAt = function (coordinate) {
    return board[coordinate.getRow()][coordinate.getColumn()];
  }

	this.isGameOver = function() {

		for (var row = 0; row < board.length; row ++) {
			for (var col = 0; col < board.length; col ++) {
				if (that.verifyMove(new Coordinate(row, col))) {
					return false;
				}
			}
		}

    var player  = that.getCurrentPlayer();
    var other = player.other;
    if (player.score > other.score) {
      winner = player;
    } else if (player.score < other.score) {
      winner = other;
    } else {
      winner = NONE;
    }

		return true;
	};

  this.getWinner = function() {
    return winner;
  }

  this.bestMove = function () {
    var player = that.getCurrentPlayer();
    var moves = [];

    for (var row = 0; row < boardDimension; row ++) {
      for (var col = 0; col < boardDimension; col ++) {
        var newDisk = new Coordinate(row, col);
        if (that.verifyMove(newDisk)) {
          moves.push(new Move(player, newDisk, flipGenerator));
        }
      }
    }

    var max = 0;
    var best;
    moves.forEach(function (move, index, moves) {
      var score = move.getDeltaScorePlayer(player);
      if (score > max) {
        best = move;
        max = score;
      }
    });

    return best.getNewDisk();
  };

};