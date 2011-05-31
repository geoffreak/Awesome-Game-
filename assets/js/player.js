// JavaScript Document
window.PLAYER_LOOP_MAX = 6;
window.NEXT_PLAYER_ID = 0;

var Player = function(location){
	var displayLoc = currentLoc = (location) ? location: new Location(0,0,0,0,0,0);
	var movePath = Array(), playerLoop = 0, nextLoc = false;
	var playerID = NEXT_PLAYER_ID++, direction = Direction.SOUTH;
	var lastClass, moveLoop = 0;
	/*setInterval(function(){
		//console.log(Math.floor(counter / 4) % 4);
		$('.player').toggleClass(lastClass);
	}, 250) */
	var loop = function(){
		if (nextLoc)
		{
			var nextClass;
			//console.log('next loc');
			if (playerLoop == 0)
			{
				nextClass = 'player1_'+direction+'_stand';
				nextLoc.pixelX = 0; nextLoc.pixelY = 0;
				currentLoc = nextLoc;
				displayLoc = nextLoc
				if (movePath.length > 0)
				{
					nextLoc = movePath.pop();
					direction = currentLoc.directionTo(nextLoc);
				}
				else
					nextLoc = false;
			}
			else
			{
				switch (moveLoop % 4)
				{
					case 0:
					case 2:
						nextClass = 'player1_'+direction+'_stand';
						break;
					case 1:
						nextClass = 'player1_'+direction+'_right';
						break;
					case 3:
						nextClass = 'player1_'+direction+'_left';
						break;
				}
				var move_dist = SUBCELL_DIAM;
				move_dist *= playerLoop / PLAYER_LOOP_MAX;
				if (move_dist > SUBCELL_DIAM / 2)
				{
					displayLoc = nextLoc.clone();
					if (direction == Direction.EAST || direction == Direction.NORTHEAST || direction == Direction.SOUTHEAST)
						displayLoc.pixelX = move_dist - SUBCELL_DIAM;
					else if (direction == Direction.WEST || direction == Direction.NORTHWEST || direction == Direction.SOUTHWEST)
						displayLoc.pixelX = SUBCELL_DIAM - move_dist;
					if (direction == Direction.NORTH || direction == Direction.NORTHEAST || direction == Direction.NORTHWEST)
						displayLoc.pixelY = SUBCELL_DIAM - move_dist;
					else if (direction == Direction.SOUTH || direction == Direction.SOUTHEAST || direction == Direction.SOUTHWEST)
						displayLoc.pixelY = move_dist - SUBCELL_DIAM;
				}
				else
				{
					displayLoc = currentLoc.clone();
					if (direction == Direction.EAST || direction == Direction.NORTHEAST || direction == Direction.SOUTHEAST)
						displayLoc.pixelX = move_dist;
					else if (direction == Direction.WEST || direction == Direction.NORTHWEST || direction == Direction.SOUTHWEST)
						displayLoc.pixelX = -move_dist;
					if (direction == Direction.NORTH || direction == Direction.NORTHEAST || direction == Direction.NORTHWEST)
						displayLoc.pixelY = -move_dist;
					else if (direction == Direction.SOUTH || direction == Direction.SOUTHEAST || direction == Direction.SOUTHWEST)
						displayLoc.pixelY = move_dist;
				}
			}
			if (nextClass != lastClass)
			{
				if (lastClass) $('.player').toggleClass(lastClass);
				$('.player').toggleClass(nextClass);
				lastClass = nextClass;
			}
			playerLoop++;
			if (playerLoop % 3 == 0) moveLoop++;
			if (playerLoop == PLAYER_LOOP_MAX) playerLoop = 0;
			if (moveLoop == 4) moveLoop = 0;
			return true;
		}
		return false;
	};
	var moveTo = function(path){
		if (typeof path == 'undefined') return;
		var loc = path.pop();
		if (path.length > 0)
		{
			if (movePath.length == 0)
			{
				nextLoc = path.pop();
				direction = loc.directionTo(nextLoc);
				playerLoop = 1;
			}
			else
			{
				path.push(loc);
			}
			movePath = path;
		}
	};
	var getLocation = function(){
		return currentLoc;
	};
	var getDisplayLocation = function(){
		return displayLoc;
	};
	var setLocation = function(location){
		currentLoc = location;
	};
	var toString = function(){
		return 'PlayerID' + playerID;
	};
	return {
		getLocation: getLocation,
		setLocation: setLocation,
		getDisplayLocation: getDisplayLocation,
		moveTo: moveTo,
		loop: loop,
		toString: toString
	}
}