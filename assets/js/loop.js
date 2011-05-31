// JavaScript Document
var Loop = function(){
	var needRedraw = true, runLoop = 0;
	var loopElements = Array();
	var redraw = function(){
		needRedraw = true;
	}
	var start = function(){
		setInterval(run, 50);
	}
	var run = function(){
		for (var i = 0; i < loopElements.length; i++)
		{
			if (loopElements[i].loop())
				needRedraw = true;
		}
		if (needRedraw)
		{
			//console.log('draw')
			needRedraw = false;
			GRID.draw();
		}
		runLoop++;
		if (runLoop == 100) runLoop = 0;
	};
	var addLoopElement = function(element){
		loopElements.push(element);
	};
	var removeLoopElement = function(element){
		for (var i = 0; i < loopElements.length; i++)
		{
			if (element.toString() == loopElements[i].toString())
			{
				loopElements.remove(i);
				return true;
			}
		}
		return false;
	};
	return {
		start: start,
		redraw: redraw,
		addLoopElement: addLoopElement,
		removeLoopElement: removeLoopElement
	};
};