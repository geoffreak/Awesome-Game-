// JavaScript Document
var TILE_HEIGHT = 72, TILE_WIDTH = 96, rows = 5, columns = 5;
var xoffset = $(window).width() / 2 - TILE_HEIGHT;
var yoffset = 0//$(window).height() / 2; 
$(function(){
	var frame = $('#frame')
	var src = 'images/iso-grass.png';
	var grid = [], html = '';
	var mapSize = Math.sqrt(rows^2 + columns^2);
	for (var r=0; r<=rows-1; r++) {
		if (!grid[r]) grid[r] = [];
		for (var c=0; c<=columns-1; c++) {
			var loc = mapToScreen(r, c);
			//if (Math.random() >= 0.1)
			html += '<div style="background-image: url('+src+'); ' +
					'height: ' + TILE_HEIGHT + 'px; width: ' + TILE_WIDTH + 'px;'+
					'position: absolute; left: '+loc.x+'px;' +
					'top: '+loc.y+'px;">' +
					'<div style="margin-left: 20px; margin-top: 30px;">r: ' + r + ', c: ' + c + '</div>' +
					'</div>';
		}
	} 
	frame.html(html+'<div class="cursor"></div>');
	getImage(src, function(img){
		var arr = makeClickMap(img);
	});
	
	frame.click(function(e){
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		var loc = screenToMap(mouseX, mouseY);
		console.log('r: ' + Math.floor(loc.r) + ', c: ' + Math.floor(loc.c));
	});
	frame.mousemove(function(e){
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		var loc = screenToMap(mouseX, mouseY);
		loc = mapToScreen(loc.r, loc.c);
		$('.cursor').css('left', loc.x);
		$('.cursor').css('top', loc.y);
		//console.log('r: ' + Math.floor(loc.r) + ', c: ' + Math.floor(loc.c));
	});
});

function screenToMap(x, y){
	x -= xoffset;
	y -= yoffset;
	return {
		r: Math.round((((y - (TILE_HEIGHT / 2)) / TILE_HEIGHT) + ((x - (TILE_WIDTH / 2)) / TILE_WIDTH))),
		c: Math.round((((y - (TILE_HEIGHT / 2)) / TILE_HEIGHT) - ((x - (TILE_WIDTH / 2)) / TILE_WIDTH)))
	};
}
function mapToScreen(r, c){
	return{
		x: xoffset + (((r - c) * TILE_WIDTH / 2)),
		y: yoffset + (((r + c) * TILE_HEIGHT / 2))
	}
}

function getImage(src, cb){
	var img = new Image();
	img.onload = function(){
		cb(img)
	}
	img.src = src;
}

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
function makeClickMap(img){
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
	var imageData = ctx.getImageData(0,0, img.width, img.height).data;
	var clickMap = [];
	for (var i = 0, n = imageData.length; i < n; i += 4)
	{
		var row = Math.floor((i / 4) / canvas.width);
		var col = (i / 4) - (row * canvas.width);
		if (!clickMap[row]) clickMap[row] = [];
		clickMap[row][col] = imageData[i+3] == 0 ? 0 : 1;
	}
	return clickMap;
}