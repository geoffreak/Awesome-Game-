// JavaScript Document
var Location = function(x, y, subX, subY, pixelX, pixelY){
	this.x = x; 
	this.y = y;
	this.subX = (typeof subX == 'undefined') ? 0 : subX; 
	this.subY = (typeof subY == 'undefined') ? 0 : subY;
	this.pixelX = (typeof pixelX == 'undefined') ? 0 : pixelX;
	this.pixelY = (typeof pixelX == 'undefined') ? 0 : pixelY;
}
Location.prototype.clone = function(){
	return new Location(this.x,this.y,this.subX,this.subY,this.pixelX,this.pixelY);
}
Location.prototype.toString = function(addPixels){
	var str = this.x + 'x,' + this.y + 'y';
	str += ',' + this.subX + 'subX,' + this.subY + 'subY';
	if (addPixels) 
		str += ',' + this.pixelX + 'pixelX,' + this.pixelY + 'pixelY';
	return str;
}
Location.prototype.equals = function(otherLoc){
	return this.toString() == otherLoc.toString();
};
Location.prototype.directionTo = function(otherLoc){
	var startX = this.x * SUBCELL_COUNT + this.subX;
	var startY = this.y * SUBCELL_COUNT + this.subY;
	var goalX = otherLoc.x * SUBCELL_COUNT + otherLoc.subX;
	var goalY = otherLoc.y * SUBCELL_COUNT + otherLoc.subY;
	var deltaX = goalX - startX;
	var deltaY = goalY - startY;
	var slope = deltaY / deltaX;
	if (-4 <= slope && slope < -1/4)
	{
		if (deltaY < 0)
			return Direction.NORTHEAST;
		else
			return Direction.SOUTHWEST;
	}
	else if (1/4 <= slope && slope < 4)
	{
		if (deltaY < 0)
			return Direction.NORTHWEST;
		else
			return Direction.SOUTHEAST;
	}
	else if (4 <= slope || slope < -4)
	{
		if (deltaY < 0)
			return Direction.NORTH;
		else
			return Direction.SOUTH;
	}
	else if (-1/4 <= slope && slope < 1/4)
	{
		if (deltaX < 0)
			return Direction.WEST;
		else
			return Direction.EAST;
	}
}
var Direction = {
	NORTH: 'n',
	NORTHEAST: 'ne',
	EAST: 'e',
	SOUTHEAST: 'se',
	SOUTH: 's',
	SOUTHWEST: 'sw',
	WEST: 'w',
	NORTHWEST: 'nw'
};
var DirectionFullWord = {
	'n': 'north',
	'ne': 'northeast',
	'e': 'east',
	'se': 'southeast',
	's': 'south',
	'sw': 'southwest',
	'w': 'west',
	'nw': 'northwest'
};