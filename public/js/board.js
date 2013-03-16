//
// Implementation of the Board ADT 
// Contains all the game logic
//
var Board = function (boardDimension) {
	var PLAYER_1 = {}, PLAYER_2 = {}, NONE = {};
	PLAYER_1.other = PLAYER_2;
	PLAYER_1.cssClass = "player1";
	PLAYER_1.imageHTML = '<img src="images/alien-skull.png" />';
	PLAYER_1.turnHTML = '<img src="images/alien-skull.png" />';
	PLAYER_1.score = 2;
	PLAYER_1.scoreLabelId = "alienScore"

	PLAYER_2.other = PLAYER_1;
	PLAYER_2.cssClass = "player2";
	PLAYER_2.imageHTML = '<img src="images/ninja-mask.png" />';
	PLAYER_2.turnHTML = '<img Src="images/ninja-mask.png" />';
	PLAYER_2.score = 2;
	PLAYER_2.scoreLabelId = "ninjaScore"

	var DIRECTIONS = {'NORTH': new VerticalNorth(), 'SOUTH': new VerticalSouth,
		'EAST': new HorizontalEast,'WEST': new HorizontalWest,
		'NORTHEAST': new DiagonalNorthEast,'NORTHWEST': new DiagonalNorthWest,
		'SOUTHEAST': new DiagonalSouthEast, 'SOUTHWEST': new DiagonalSouthWest};

	// var DIRECTIONS = [new VerticalNorth(), new VerticalSouth,
	// 	new HorizontalEast, new HorizontalWest,
	// 	new DiagonalNorthEast, new DiagonalNorthWest,
	// 	new DiagonalSouthEast, new DiagonalSouthWest];
	
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

		var ends = move.getEnds();
		var e1 = move.getClickedEnd();
		var r1 = e1.getRow();
		var c1 = e1.getColumn();
		board[r1][c1] = NONE;
		that.getCurrentPlayer().other.score -= 1;

		updateLine(e1, ends, true);
		
		updateCurrentPlayerId();
		return move;

	};

	var updateLine = function  (e1, ends, undoing) {
		var player = that.getCurrentPlayer();
		for (dName in ends) {
	 		if (dName in DIRECTIONS) {
	 			var r1 = e1.getRow();
				var c1 = e1.getColumn();
	 			var direction = DIRECTIONS[dName];
	 			var e2 = ends[dName];
	 			if (undoing) {
					r1 = direction.rStep(r1);
					c1 = direction.cStep(c1);
	 			}
				while (direction.inBetweenEnds(r1,c1,e2)) {
					updateScore(r1, c1, player);
					board[r1][c1] = player;
					r1 = direction.rStep(r1);
					c1 = direction.cStep(c1);
				}
			}
		}

	};

	this.redo = function  () {
		var move = redoQueue.pop();
		if (move == undefined) return undefined;
		that.play(move.getClickedEnd(), move.getEnds(), true);
		return move;
	}

	var updateScore = function  (r1, c1, player) {
		oldName = board[r1][c1];
		if (oldName == NONE) player.score +=1;
		if (player == oldName.other) {
			oldName.score -= 1;
			player.score += 1;
		};

	};

	// mutate board by playing player in position
	// if the move is valid
	this.play = function (e1, ends, reDoing) {
		//you're clicking.  remove
		if (!reDoing) {
			redoQueue = [];
		};

		var player = that.getCurrentPlayer();
		moveStack.push(new Move(e1,ends));
 

		updateLine(e1, ends, false);

		updateCurrentPlayerId();
		
	};

	//return list of compatible ends
	this.verifyMove = function (row, column) {
		var ends = {};
		if (board[row][column] != NONE) return ends;

		for (d in DIRECTIONS) {
			var e = getEnd(row, column, DIRECTIONS[d]);
			if (e != undefined) {
				ends[d] = e;
			}
		}

		return ends;
	};

	var getEnd = function(row, column, direction) {
		var end;
		//move two over
		var r = direction.rStepTwice(row);
		var c = direction.cStepTwice(column);
		var player = that.getCurrentPlayer();

		while (direction.onBoard(boardDimension, r,c)) {
			if (board[r][c] == player) {
				end = new Coordinate(r,c);
				break;
			}
			r = direction.rStep(r);
			c = direction.cStep(c);
		}

		if (end == undefined) return end;

		r = direction.rStep(row);
		c = direction.cStep(column);

		while (direction.inBetweenEnds(r, c, end)) {
			if (board[r][c] != player.other) {
				end = undefined;
				break;
			}
			r = direction.rStep(r);
			c = direction.cStep(c);
		}

		return end;

	};

	this.isGameOver = function() {

		console.log("isGAMEOVER");
		for (var row = 0; row < board.length; row ++) {
			for (var col = 0; col < board.length; col ++) {
				console.log("r: "+row);
				console.log("c: "+col);
				var ends = that.verifyMove(row, col);
				console.log("ends");
				console.log(ends);
				console.log(!Object.keys(ends).isEmpty());
				if (!Object.keys(ends).isEmpty()) {
					return false;
				}
			}
		}

		return true;
		
	};

};