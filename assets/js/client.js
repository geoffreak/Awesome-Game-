// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
$(function(){
	window.FRAME = $('#frame');
	var canvas = $('canvas')[0];
	if (canvas && canvas.getContext)
	{
		window.PLAYER = new Player();
		window.LOOP = new Loop();
		window.GRID = new Grid(canvas.getContext('2d'));
		for (var x = -1; x <= 0; x++)
		{
			for (var y = -1; y <= 0; y++)
			{
				GRID.addCell(new Cell(new Location(x, y), 'bg.png'));
			}
		}
		LOOP.addLoopElement(PLAYER);
		LOOP.start();
		FRAME.click(function(e){
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;
			var newLoc = GRID.getLocation(x, y)
			if (newLoc) 
			{
				var playerLoc = PLAYER.getLocation();
				GRID.pathFind(playerLoc, newLoc, function(path){
					PLAYER.moveTo(path);
				});
				//console.log(newLoc);
				//console.log(GRID.distance(PLAYER.getLocation(), newLoc))
				//PLAYER.setLocation(newLoc);
				//console.log(GRID.getNearby(newLoc));
				//LOOP.redraw();
			}
			//GRID.move(x, y);
		});
		var runonce = false;
		$(window).resize(function(){
			var w = $(window).width();
			var h = $(window).height();
			if (w % 2 == 1) w++;
			if (h % 2 == 1) h++;
			$('.player').css('left', Math.floor(w/2) - 12).css('top', Math.floor(h/2) - 20);
			//FRAME.attr('width', w).attr('height', h);
			GRID.resize(w, h);
			if (!runonce) runonce = true;
			else LOOP.redraw();
		}).resize();
	}
	else
	{
		alert('Need canvas support in browser or no canvas present');	
	}
});