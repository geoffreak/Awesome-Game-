// JavaScript Document
var Cell = function(location, img){
	this.loc = location, this.displayLoc, this.image = new Image(), this.ready = false;
	this.contents = {}, this.DOM, this.loadCallback;
	for (var x = 0; x < CELLSIZE / SUBCELL_DIAM; x++)
	{
		this.contents[x] = {};
		for (var y = 0; y < CELLSIZE / SUBCELL_DIAM; y++)
		{
			//set 1 when occupied, 0 when free
			this.contents[x][y] = Math.random() <= 0.1;
		}
	}
	var temp = this;
	this.image.onload = function(){
		temp.ready = true;
		if (temp.loadCallback) temp.loadCallback();
		//console.log(image.src + ' is loaded');
		//context.drawImage(image, x, y);
	};
	this.image.src = img;
};
Cell.prototype.onload = function(cb){
	if (this.ready)
		cb();
	else
		this.loadCallback = cb;
};
Cell.prototype.isReady = function(){
	return this.ready;
};
Cell.prototype.getLocation = function(){
	return this.loc;
};
// change physical location on screen
Cell.prototype.setDisplayLocation = function(loc){
	if (!this.displayLoc || !this.displayLoc.equals(loc))
	{
		this.displayLoc = loc;
		return this.draw();
	}
	return false;
};
// create the cell or update the this cell's location
Cell.prototype.draw = function(){
	if (!this.DOM) 
	{
		var html = '<div class="cell" style="left: '+this.displayLoc.x+'px;';
		html += 'top: '+this.displayLoc.y+'px;">';
		this.objCount = 1;
		for (var x in this.contents)
		{
			for (var y in this.contents[x])
			{
				if (this.contents[x][y]){
				html += '<div class="subcell" style="left: '+(x * SUBCELL_DIAM)+'px;';
				html += 'top: '+(y * SUBCELL_DIAM)+'px; background-color: black';
				html += ';"></div>';
				this.objCount++;
				}
			}
		}
		html += '</div>';
		
		return html;
	}
	else
	{
		$(this.DOM[0]).css('left', this.displayLoc.x).css('top', this.displayLoc.y);
		return false;
	}
};
Cell.prototype.setJQObj = function(objArr){
	this.DOM = objArr.slice(0, this.objCount);
	return this.objCount;
}
Cell.prototype.isRestrictedLocation = function(loc){
	return this.contents[loc.subX][loc.subY];
};
	/*return {
		isReady: isReady,
		getLocation: getLocation,
		setDisplayLocation: setDisplayLocation,
		setJQObj: setJQObj,
		onload: onload,
		preDraw: draw,
		isRestrictedLocation: isRestrictedLocation
	}*/
