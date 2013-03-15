var Move = function (clickedEnd, ends) {
	var clickedEnd = clickedEnd;
	var ends = ends

	this.getClickedEnd = function() {
		return clickedEnd;
	};	

	this.getEnds = function  () {
		return ends;
	};

};