// JavaScript Document
window.CELLSIZE = 1000;
window.SUBCELL_COUNT = 20;
window.SUBCELL_DIAM = CELLSIZE / SUBCELL_COUNT;

var Grid = function(c){
	var context = c, cells = {};
	var cWidth = 0, cHeight = 0, xOffset = 0, yOffset = 0;
	var addCell = function(cell){
		var loc = cell.getLocation();
		if (typeof cells[loc.x] == 'undefined')
			cells[loc.x] = {};
		cells[loc.x][loc.y] = cell;
		cell.onload(function(){
			LOOP.redraw();
		});
	};
	var logGrid = function(){
		for (var x in cells)
		{
			for (var y in cells[x])
			{
				console.log('('+x+', '+y+') ' + cells[x][y].isReady());
			}
		}
	};
	var screenToGrid = function(xClick, yClick){
		var playerLoc = PLAYER.getDisplayLocation();
		var x = Math.floor(((xClick + playerLoc.subX * SUBCELL_DIAM + (playerLoc.pixelX + SUBCELL_DIAM/2) - xOffset)/CELLSIZE) + playerLoc.x);
		var y = Math.floor(((yClick + playerLoc.subY * SUBCELL_DIAM + (playerLoc.pixelY + SUBCELL_DIAM/2) - yOffset)/CELLSIZE) + playerLoc.y);
		var vLoc = gridToScreen(x, y);
		var subLocX = (xClick - vLoc.x);
		var subLocY = (yClick - vLoc.y);
		var pixelX = (subLocX % SUBCELL_DIAM);
		var pixelY = (subLocY % SUBCELL_DIAM);
		subLocX = (subLocX - pixelX) / SUBCELL_DIAM;
		subLocY = (subLocY - pixelY) / SUBCELL_DIAM;
		return new Location(x, y, subLocX, subLocY);
	};
	var gridToScreen = function(x, y){
		var playerLoc = PLAYER.getDisplayLocation();
		var xLoc = Math.floor(xOffset + (x - playerLoc.x) * CELLSIZE - (playerLoc.pixelX + SUBCELL_DIAM/2) - playerLoc.subX * SUBCELL_DIAM);
		var yLoc = Math.floor(yOffset + (y - playerLoc.y) * CELLSIZE - (playerLoc.pixelY + SUBCELL_DIAM/2) - playerLoc.subY * SUBCELL_DIAM);
		return new Location(xLoc, yLoc);
	}
	var draw = function(){
		// Draw background (preDraw)
		var appendHtml = '', notifyArr = [];
		for (var x in cells)
		{
			for (var y in cells[x])
			{
				var html = cells[x][y].setDisplayLocation(gridToScreen(x, y));
				if (html)
				{
					appendHtml += html;
					notifyArr.push({
						x: x,
						y: y
					})
				}
			}
		}
		if (appendHtml.length > 0)
		{
			FRAME.prepend(appendHtml);
			//console.log(FRAME.html());
			var elements = $('*', FRAME);
			for (var i = 0; i < notifyArr.length; i++)
			{
				var lastUsed = cells[notifyArr[i].x][notifyArr[i].y].setJQObj(elements)
				elements = elements.slice(lastUsed);
			}
		}
		// Draw environment
		//	--- TODO ---
		// Draw "Me"
		//	--- TODO ---
		//  temp below:
		
		// Draw foreground (postDraw)
		
	};
	var getLocation = function(xClick, yClick){
		var loc = screenToGrid(xClick, yClick)
		if (cells[loc.x] && cells[loc.x][loc.y])
		{
			return loc;
		}
		return false;
	};
	var resize = function(width, height){
		xOffset = (width - width % 2) / 2;
		yOffset = (height - height % 2) / 2;
		cWidth = width;
		cHeight = height;
	};
	var findNearestUnrestrictedLocation = function(goalLoc, startLoc){
		if (!isRestrictedLocation(goalLoc)) return goalLoc;
		var closedset = {}, distanceset = {};
		var openset = Array();
		openset.push(goalLoc);
		distanceset[goalLoc] = distance(startLoc, goalLoc);
		while (openset.length)
		{
			var x = openset[0], index = 0;
			for (var loc = 1; loc < openset.length; loc++)
			{
				if (distanceset[openset[loc]] < distanceset[x])
				{
					x = openset[loc];
					index = loc;
				}
			}
			closedset[x] = x;
			if (isRestrictedLocation(x))
			{
				openset.remove(index);
				var potential_moves = getNearby(goalLoc, false, true);
				for (move in potential_moves)
				{
					var y = potential_moves[move];
					if (openset.indexOf(y) < 0 && !closedset[y])
					{
						openset.push(y);
						distanceset[y] = distance(startLoc, y);
					}
				}
				console.log(openset);
			}
			else
			{
				console.log('Restricted location. Using ' + x + ' instead.');
				return x;
			}
		}
	};
	var Astar = function(startLoc, goalLoc, cb){
		goalLoc = findNearestUnrestrictedLocation(goalLoc, startLoc);
		//The set of nodes already evaluated.
		var closedset = {};
		// The set of tentative nodes to be evaluated.
		var openset = Array();
		openset.push(startLoc);
		// The map of navigated nodes.
		var came_from = {};
		var g_score = {}, h_score = {}, f_score = {}; 
		// Distance from start along optimal path.
		g_score[startLoc] = 0;
		h_score[startLoc] = distance(startLoc, goalLoc),
		// Estimated total distance from start to goal through y.
		f_score[startLoc] = h_score[startLoc];
		var max_run = isRestrictedLocation(goalLoc) ? 300 : 900, start_cycles = max_run
		var lowest_h_score = openset[0];
		var AstarRecur = function()
		{
			if (openset.length > 0 && max_run > 0)
			{
				max_run--;
				//console.log('loop')
				var x = openset[0];
				var index = 0;
				for (var loc = 1; loc < openset.length; loc++)
				{
					if (f_score[openset[loc]] < f_score[x])
					{
						x = openset[loc]; 
						index = loc;
					}
				}
				if (h_score[x] < h_score[lowest_h_score])
					lowest_h_score = x;
				//console.log(x);
				// x is the node in openset having the lowest f_score
				//console.log(count);
				//console.log(openset);
				if (x.equals(goalLoc))
				{
					var path = Array();
					//console.log(came_from);
					var current_node = goalLoc;
					path.push(current_node);
					while (typeof came_from[current_node] != 'undefined')
					{
						current_node = came_from[current_node]
						path.push(current_node);
					}
					console.log('completed in '+ (start_cycles - max_run) +' cycles');
					cb(path);
				}
				else
				{
					openset.remove(index);
					closedset[x] = x;
					var potential_moves_pre = getNearby(x);
					var potential_moves = [];
					var direction = DirectionFullWord[x.directionTo(goalLoc)];
					for (move in potential_moves_pre)
					{
						if (move == direction)
							potential_moves.unshift(potential_moves_pre[move]);
						else
							potential_moves.push(potential_moves_pre[move]);
					}
					for (var move = 0; move < potential_moves.length; move++)
					{
						var y = potential_moves[move];
						if (typeof closedset[y] != 'undefined')
							continue;
						var tentative_g_score = g_score[x] + distance(x, y);
						var tentative_is_better = false;
						if (openset.indexOf(y) == -1)
						{
							openset.push(y);
							length++;
							tentative_is_better = true;
						}
						else if (tentative_g_score < g_score[y])
						{
							tentative_is_better = true;
						}
						if (tentative_is_better)
						{
							//console.log('better')
							came_from[y] = x;
							g_score[y] = tentative_g_score;
							h_score[y] = distance(y, goalLoc);
							f_score[y] = g_score[y] + h_score[y];
						}
					}
					//console.log(f_score);
					AstarRecur();
				}
			}
			else
			{
				if (!isRestrictedLocation(goalLoc))
				{
					console.log('ERROR: A* has timed out in finding a valid location');
				}
				else
				{
					console.log('WARNING: A* cannot go to a blocked location');
				}
				console.log('	Reverting to ' + lowest_h_score + ' instead.');
				//failure
				var path = Array();
				//console.log(came_from);
				var current_node = lowest_h_score;
				path.push(current_node);
				while (typeof came_from[current_node] != 'undefined')
				{
					current_node = came_from[current_node]
					path.push(current_node);
				}
				cb(path);
			}
		}
		AstarRecur();
	};
	var getNearby = function(loc, disableDiagnals, noDiagnalRestrict, noRestrict){
		var moves = {};
		//North
		if (loc.subY == 0) // go to cell above
		{
			if (typeof cells[loc.x][loc.y - 1] != 'undefined')
			{
				moves.north = new Location(loc.x, loc.y - 1, loc.subX, SUBCELL_COUNT - 1);
			}
		}
		else // stay in cell
		{
			moves.north = new Location(loc.x, loc.y, loc.subX, loc.subY - 1);
		}
		if (moves.north && !noRestrict && isRestrictedLocation(moves.north))
			delete moves.north;
		//South
		if (loc.subY == SUBCELL_COUNT - 1) // go to cell below
		{
			if (typeof cells[loc.x][loc.y + 1] != 'undefined')
			{
				moves.south = new Location(loc.x, loc.y + 1, loc.subX, 0);
			}
		}
		else // stay in cell
		{
			moves.south = new Location(loc.x, loc.y, loc.subX, loc.subY + 1);
		}
		if (moves.south && !noRestrict && isRestrictedLocation(moves.south))
			delete moves.south;
		//East
		if (loc.subX == SUBCELL_COUNT - 1) // go to cell right
		{
			if (typeof cells[loc.x + 1] != 'undefined' && 
				typeof cells[loc.x + 1][loc.y] != 'undefined')
			{
				moves.east = new Location(loc.x + 1, loc.y, 0, loc.subY);
			}
		}
		else // stay in cell
		{
			moves.east = new Location(loc.x, loc.y, loc.subX + 1, loc.subY);
		}
		if (moves.east && !noRestrict && isRestrictedLocation(moves.east))
			delete moves.east;
		//West
		if (loc.subX == 0) // go to cell left
		{
			if (typeof cells[loc.x - 1] != 'undefined' && 
				typeof cells[loc.x - 1][loc.y] != 'undefined')
			{
				moves.west = new Location(loc.x - 1, loc.y, SUBCELL_COUNT - 1, loc.subY);
			}
		}
		else // stay in cell
		{
			moves.west = new Location(loc.x, loc.y, loc.subX - 1, loc.subY);
		}
		if (moves.west && !noRestrict && isRestrictedLocation(moves.west))
			delete moves.west;
		if (!disableDiagnals)
		{
			//NorthEast
			if (noDiagnalRestrict || (moves.north && moves.east))
			{
				//if cell is north and east
				if (loc.subX == SUBCELL_COUNT - 1 && loc.subY == 0)
				{
					if (typeof cells[loc.x][loc.y - 1] != 'undefined' &&
						typeof cells[loc.x + 1] != 'undefined' && 
						typeof cells[loc.x + 1][loc.y] != 'undefined')
					{
						moves.northeast = new Location(loc.x + 1, loc.y - 1, 0, SUBCELL_COUNT - 1);
					}
				}
				//else if cell is north
				else if (loc.subY == 0)
				{
					if (typeof cells[loc.x][loc.y - 1] != 'undefined')
					{
						moves.northeast = new Location(loc.x, loc.y - 1, loc.subX + 1, SUBCELL_COUNT - 1)
					}
				}
				//else if cell is east
				else if (loc.subX == SUBCELL_COUNT - 1)
				{
					if (typeof cells[loc.x + 1] != 'undefined' && 
						typeof cells[loc.x + 1][loc.y] != 'undefined')
					{
						moves.northeast = new Location(loc.x + 1, loc.y, 0, loc.subY - 1); 
					}
				}
				//else same cell
				else
				{
					moves.northeast = new Location(loc.x, loc.y, loc.subX + 1, loc.subY - 1);
				}
			}
			if (moves.northeast && !noRestrict && isRestrictedLocation(moves.northeast))
				delete moves.northeast;
			//NorthWest
			if (noDiagnalRestrict || (moves.north && moves.west))
			{
				//if cell is north and west
				if (loc.subX == 0 && loc.subY == 0)
				{
					if (typeof cells[loc.x][loc.y - 1] != 'undefined' &&
						typeof cells[loc.x - 1] != 'undefined' && 
						typeof cells[loc.x - 1][loc.y] != 'undefined')
					{
						moves.northwest = new Location(loc.x - 1, loc.y - 1, SUBCELL_COUNT - 1, SUBCELL_COUNT - 1);
					}
				}
				//else if cell is north
				else if (loc.subY == 0)
				{
					if (typeof cells[loc.x][loc.y - 1] != 'undefined')
					{
						moves.northwest = new Location(loc.x, loc.y - 1, loc.subX - 1, SUBCELL_COUNT - 1)
					}
				}
				//else if cell is west
				else if (loc.subX == 0)
				{
					if (typeof cells[loc.x - 1] != 'undefined' && 
						typeof cells[loc.x - 1][loc.y] != 'undefined')
					{
						moves.northwest = new Location(loc.x - 1, loc.y, SUBCELL_COUNT - 1, loc.subY - 1); 
					}
				}
				//else same cell
				else
				{
					moves.northwest = new Location(loc.x, loc.y, loc.subX - 1, loc.subY - 1);
				}
			}
			if (moves.northwest && !noRestrict && isRestrictedLocation(moves.northwest))
				delete moves.northwest;
			//SouthEast
			if (noDiagnalRestrict || (moves.south && moves.east))
			{
				//if cell is south and east
				if (loc.subX == SUBCELL_COUNT - 1 && loc.subY == SUBCELL_COUNT - 1)
				{
					if (typeof cells[loc.x][loc.y + 1] != 'undefined' &&
						typeof cells[loc.x + 1] != 'undefined' && 
						typeof cells[loc.x + 1][loc.y] != 'undefined')
					{
						moves.southeast = new Location(loc.x + 1, loc.y + 1, 0, 0);
					}
				}
				//else if cell is south
				else if (loc.subY == SUBCELL_COUNT - 1)
				{
					if (typeof cells[loc.x][loc.y + 1] != 'undefined')
					{
						moves.southeast = new Location(loc.x, loc.y + 1, loc.subX + 1, 0);
					}
				}
				//else if cell is east
				else if (loc.subX == SUBCELL_COUNT - 1)
				{
					if (typeof cells[loc.x + 1] != 'undefined' && 
						typeof cells[loc.x + 1][loc.y] != 'undefined')
					{
						moves.southeast = new Location(loc.x + 1, loc.y, 0, loc.subY + 1); 
					}
				}
				//else same cell
				else
				{
					moves.southeast = new Location(loc.x, loc.y, loc.subX + 1, loc.subY + 1);
				}
			}
			if (moves.southeast && !noRestrict && isRestrictedLocation(moves.southeast))
				delete moves.southeast;
			//SouthWest
			if (noDiagnalRestrict || (moves.south && moves.west))
			{
				//if cell is south and west
				if (loc.subX == 0 && loc.subY == SUBCELL_COUNT - 1)
				{
					if (typeof cells[loc.x][loc.y + 1] != 'undefined' &&
						typeof cells[loc.x - 1] != 'undefined' && 
						typeof cells[loc.x - 1][loc.y] != 'undefined')
					{
						moves.southwest = new Location(loc.x - 1, loc.y + 1, 0, SUBCELL_COUNT - 1);
					}
				}
				//else if cell is south
				else if (loc.subY == SUBCELL_COUNT - 1)
				{
					if (typeof cells[loc.x][loc.y + 1] != 'undefined')
					{
						moves.southwest = new Location(loc.x, loc.y + 1, loc.subX - 1, 0)
					}
				}
				//else if cell is west
				else if (loc.subX == 0)
				{
					if (typeof cells[loc.x - 1] != 'undefined' && 
						typeof cells[loc.x - 1][loc.y] != 'undefined')
					{
						moves.southwest = new Location(loc.x - 1, loc.y, SUBCELL_COUNT - 1, loc.subY + 1); 
					}
				}
				//else same cell
				else
				{
					moves.southwest = new Location(loc.x, loc.y, loc.subX - 1, loc.subY + 1);
				}
			}
			if (moves.southwest && !noRestrict && isRestrictedLocation(moves.southwest))
				delete moves.southwest;
		}
		return moves;
	};
	var distance = function(startLoc, goalLoc){
		var startX = startLoc.x * SUBCELL_COUNT + startLoc.subX;
		var startY = startLoc.y * SUBCELL_COUNT + startLoc.subY;
		var goalX = goalLoc.x * SUBCELL_COUNT + goalLoc.subX;
		var goalY = goalLoc.y * SUBCELL_COUNT + goalLoc.subY;
		//console.log(startX +','+ startY +' -> '+ goalX +','+ goalY)
		return Math.sqrt(Math.pow(goalX - startX, 2) + Math.pow(goalY - startY, 2));
	};
	var isRestrictedLocation = function(loc){
		return cells[loc.x][loc.y].isRestrictedLocation(loc);
	};
	return {
		addCell: addCell,
		log: logGrid,
		draw: draw,
		resize: resize,
		getLocation: getLocation,
		pathFind: Astar,
		distance: distance,
		getNearby: getNearby
	};
};