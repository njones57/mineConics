var canvas;
var graph;
var points;
var lines;
var circles;
var ellipses;

var clicking = false;
var startX;
var startY;

function canvasHandler()
{
	this.$canvas = $('#canvas');
	this.context = $('canvas')[0].getContext('2d');

	// resize the canvas to take advantage of extra viewport space
	this.$canvas.attr('height', ($(window).height() - $('#header').outerHeight(true) - $('#heading').height()));
	this.$canvas.attr('width', ($(window).width() - $('#controlPane').outerWidth(true) - $('#heading').height()));

	this.height = this.$canvas.height();
	this.width = this.$canvas.width();
}

canvasHandler.prototype.offsetLeft = function()
{
	return this.$canvas.offset().left;
}

canvasHandler.prototype.offsetTop = function()
{
	return this.$canvas.offset().top;
}

canvasHandler.prototype.getX = function(x)
{
	return x - this.offsetLeft();
}

canvasHandler.prototype.getY = function(y)
{
	return y - this.offsetTop();
}

canvasHandler.prototype.clear = function()
{
	this.context.clearRect(0,0,this.width,this.height);
}

function colorControl()
{
	var $colorDiv = $('<div/>');
	$colorDiv.addClass('colorSelector');

	var $blueLabel = $('<label/>');
	var $blueInput = $('<input/>');
	$blueInput.addClass('color');
	$blueInput.attr('type','radio');
	$blueInput.attr('name','color');
	$blueInput.attr('value','rgba(32,32,128,1)');
	$blueLabel.append($blueInput);
	$blueLabel.append('blue');

	var $greenLabel = $('<label/>');
	var $greenInput = $('<input/>');
	$greenInput.addClass('color');
	$greenInput.attr('type','radio');
	$greenInput.attr('name','color');
	$greenInput.attr('value','rgba(32,128,32,1)');
	$greenInput.attr('checked','checked');
	$greenLabel.append($greenInput);
	$greenLabel.append('green');

	var $redLabel = $('<label/>');
	var $redInput = $('<input/>');
	$redInput.addClass('color');
	$redInput.attr('type','radio');
	$redInput.attr('name','color');
	$redInput.attr('value','rgba(128,32,32,1)');
	$redLabel.append($redInput);
	$redLabel.append('red');

	$colorDiv.append($blueLabel);
	$colorDiv.append($greenLabel);
	$colorDiv.append($redLabel);

	return $colorDiv;
}

function graphControl()
{
	var $graphDiv = $('<div/>');
	$graphDiv.addClass('control');

	var $locationDiv = $('<div/>');
	$locationDiv.attr('id','location');
	$locationDiv.text('location');

	var $graphForm = $('<form/>');
	$graphForm.addClass('graph');

	var $sizeInput = $('<input/>');
	$sizeInput.addClass('graph');
	$sizeInput.addClass('size');
	$sizeInput.attr('type','text');
	$sizeInput.attr('name','size');

	var $graphSubmit = $('<input/>');
	$graphSubmit.addClass('graph');
	$graphSubmit.attr('type','submit');
	$graphSubmit.attr('value','update');

//	$graphForm.text('size');
// 	$graphForm.append($sizeInput);
// 	$graphForm.append($graphSubmit);
	$graphDiv.append($locationDiv);
	$graphDiv.append($graphForm);

	return $graphDiv;
}

function newConicControl()
{
	var $newConicDiv = $('<div/>');
	$newConicDiv.addClass('control');

	var $newConicForm = $('<form/>');
	$newConicForm.addClass('newConic');

	var $newCircleButton = $('<input/>');
	$newCircleButton.addClass('newCircle');
	$newCircleButton.attr('type','button');
	$newCircleButton.attr('value','add cirlce');

	var $newEllipseButton = $('<input/>');
	$newEllipseButton.addClass('newEllipse');
	$newEllipseButton.attr('type','button');
	$newEllipseButton.attr('value','add ellipse');

	$newConicForm.append($newCircleButton);
	$newConicForm.append($newEllipseButton);
	$newConicDiv.append($newConicForm);

	return $newConicDiv;
}

function addCircleControl($controlPane)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');
	$conicDiv.addClass('circle');

	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');
	$conicForm.addClass('circle');

	var $radiusDiv = $('<div/>');
	var $radiusInput = $('<input/>');
	$radiusInput.addClass('radius');
	$radiusInput.attr('type','text');
	$radiusInput.attr('name','radius');

	$radiusDiv.text('radius');
	$radiusDiv.append($radiusInput);
	$conicForm.append($radiusDiv);
	$conicForm.append(colorControl());
	$conicDiv.append($conicForm);
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();
}

function addEllipseControl($controlPane)
{
	var $conicDiv = $('<div/>');
	$conicDiv.addClass('conic');
	$conicDiv.addClass('ellipse');

	var $conicForm = $('<form/>');
	$conicForm.addClass('conic');
	$conicForm.addClass('ellipse');

	var $radiusXDiv = $('<div/>');
	var $radiusXInput = $('<input/>');
	$radiusXInput.addClass('radiusX');
	$radiusXInput.attr('type','text');
	$radiusXInput.attr('name','radiusX');

	var $radiusYDiv = $('<div/>');
	var $radiusYInput = $('<input/>');
	$radiusYInput.addClass('radiusY');
	$radiusYInput.attr('type','text');
	$radiusYInput.attr('name','radiusY');

	$radiusXDiv.text('Radius X');
	$radiusXDiv.append($radiusXInput);
	$radiusYDiv.text('Radius Y');
	$radiusYDiv.append($radiusYInput);
	$conicForm.append($radiusXDiv);
	$conicForm.append($radiusYDiv);
	$conicForm.append(colorControl());
	$conicDiv.append($conicForm);
	$conicDiv.hide();

	$controlPane.append($conicDiv);
	$conicDiv.slideDown();
}

function cartesianPlane()
{
	this.scale = 25;
	this.color = "rgba(1,1,1,0.1)";
	this.highlight = "rgba(1,1,1,0.2)";
	this.originX = canvas.width / 2; // distance in pixels from upper left corner to 0,0
	this.originY = canvas.height / 2; // distance in pixels from upper left corner to 0,0
	this.interval = 2; // how often a marker is drawn along the axes
}

cartesianPlane.prototype.getOriginX = function()
{
	return Math.floor(this.originX);
}

cartesianPlane.prototype.getOriginY = function()
{
	return Math.floor(this.originY);
}

cartesianPlane.prototype.moveOriginX = function(delta)
{
	this.originX = Math.floor((this.originX*1000) + (delta*1000)) / 1000;
}

cartesianPlane.prototype.moveOriginY = function(delta)
{
	this.originY = Math.floor((this.originY*1000) + (delta*1000)) / 1000;
}

cartesianPlane.prototype.getX = function(x)
{
	return (Math.floor(x/this.scale)) - (Math.floor(canvas.width/(2*this.scale)));
}

cartesianPlane.prototype.getY = function(y)
{
	return (Math.floor(canvas.height/(2*this.scale))) - (Math.floor(y/this.scale));
}

cartesianPlane.prototype.fill = function(row,col,color)
{
	var width = canvas.width;
	var height = canvas.height;
	var scale = this.scale;

	var cols = Math.floor(width / scale);
	var rows = Math.floor(height / scale);

	var xOffset = ((this.getOriginX() - (scale/2)) % scale);
	var yOffset = ((this.getOriginY() - (scale/2)) % scale);

	canvas.context.beginPath();
	canvas.context.fillStyle = color;
	canvas.context.rect(col*scale+xOffset,row*scale+yOffset,scale-1,scale-1);
	canvas.context.closePath();
	canvas.context.fill();
}

cartesianPlane.prototype.plot = function(x,y,color)
{
	var upperLeftX = -parseInt((this.getOriginX() - (this.scale/2)) / this.scale);
	var upperLeftY = parseInt((this.getOriginY() - (this.scale/2)) / this.scale);

	this.fill(upperLeftY-y,x-upperLeftX,color);
}

cartesianPlane.prototype.draw = function()
{
	var width = canvas.width;
	var height = canvas.height;
	var scale = this.scale;

	// fill with background color
	canvas.context.beginPath();
	canvas.context.fillStyle = this.color;
	canvas.context.rect(0,0,width,height);
	canvas.context.closePath();
	canvas.context.fill();

	var cols = Math.floor(width / scale);
	var xOffset = ((this.getOriginX() - (scale/2)) % scale);

	for (var col=0; col<=cols; col++)
	{
		canvas.context.beginPath();
		canvas.context.fillStyle = "rgba(255,255,255,1)";
		canvas.context.rect((col * scale) + xOffset, 0, 1, height);
		canvas.context.closePath();
		canvas.context.fill();

		// draw marks along the X axis
		var x = col - parseInt((this.getOriginX() + (scale/2)) / scale);
		if ((x % this.interval) == 0)
			this.plot(x,0,this.highlight);
		else if ((col == cols) && (((x+1) % this.interval) == 0))
			this.plot(x+1,0,this.highlight); // slight hack for small slivers at the edge
	}

	var rows = Math.floor(height / scale);
	var yOffset = ((this.getOriginY() - (scale/2)) % scale);

	for (var row=0; row<=rows; row++)
	{
		canvas.context.beginPath();
		canvas.context.fillStyle = "rgba(255,255,255,1)";
		canvas.context.rect(0, (row * scale) + yOffset, width, 1);
		canvas.context.closePath();
		canvas.context.fill();

		// draw marks along the Y axis
		var y = parseInt((this.getOriginY() - (scale/2)) / scale) - row;
		if ((y % this.interval) == 0)
			this.plot(0,y,this.highlight);
		else if ((row == 0) && (((y+1) % this.interval) == 0))
			this.plot(0,y+1,this.highlight); // slight hack for small slivers at the edge
	}
}

function point(x,y,color)
{
	this.x = x;
	this.y = y;
	this.color = color;
}

function points()
{
	this.pointList = [];
}

points.prototype.addPoint = function(x,y,color)
{
	this.pointList = this.pointList.concat(new point(x,y,color));
}

points.prototype.draw = function()
{
	$.each(this.pointList,function(index,point)
	{
		graph.plot(point.x,point.y,point.color);
	});
}

function line(x0,y0,x1,y1,color)
{
	this.x0 = x0;
	this.y0 = y0;
	this.x1 = x1;
	this.y1 = y1;
	this.color = color;
}

// Bresenham's line algorithm
line.prototype.draw = function()
{
	var x0 = this.x0;
	var x1 = this.x1;
	var y0 = this.y0;
	var y1 = this.y1;

	var steep = false;
	if (Math.abs(y1-y0) > Math.abs(x1-x0))
		steep = true;

	if (steep)
	{
		var temp = x0;
		x0 = y0;
		y0 = temp;

		temp = x1;
		x1 = y1;
		y1 = temp;
	}

	if (x0 > x1)
	{
		var temp = x0;
		x0 = x1;
		x1 = temp;

		temp = y0;
		y0 = y1;
		y1 = temp;
	}

	var deltaX = x1 - x0;
	var deltaY = Math.abs(y1 - y0);
	var error = deltaX / 2;
	var y = y0;

	var yStep;
	if (y0 < y1)
		yStep = 1;
	else
		yStep = -1;

	for (var x=x0; x<=x1; x++)
	{
		if (steep)
			graph.plot(y,x,this.color);
		else
			graph.plot(x,y,this.color);

		error -= deltaY;
		if (error < 0)
		{
			y += yStep;
			error += deltaX;
		}
	}
}

function lines()
{
	this.lineList = [];
}

lines.prototype.addLine = function(x0,y0,x1,y1,color)
{
	this.lineList = this.lineList.concat(new line(x0,y0,x1,y1,color));
}

lines.prototype.draw = function()
{
	$.each(this.lineList,function(index,line)
	{
		line.draw();
	});
}

function circle(centerX,centerY,radius,color)
{
	this.centerX = centerX;
	this.centerY = centerY;
	this.radius = radius;
	this.color = color;
}

// helper for midpoint circle algorithm
circle.prototype.plotFourPoints = function(x,y)
{
	graph.plot(this.centerX+x,this.centerY+y,this.color);

	if (x != 0)
		graph.plot(this.centerX-x,this.centerY+y,this.color);

	if (y != 0)
		graph.plot(this.centerX+x,this.centerY-y,this.color);

	if ((x != 0) && (y != 0))
		graph.plot(this.centerX-x,this.centerY-y,this.color);
}

// helper for midpoint circle algorithm
circle.prototype.plotEightPoints = function(x,y)
{
	this.plotFourPoints(x,y);

	if (x != y)
		this.plotFourPoints(y,x);
}

// midpoint circle algorithm
circle.prototype.draw = function()
{
	var x = this.radius;
	var y = 0;
	var error = -x;

	while (x >= y)
	{
		this.plotEightPoints(x,y);
		
		error += (2 * y) + 1;
		y++;

		if (error >= 0)
		{
			x--;
			error -= 2 * x;
		}
	}
}

function circles()
{
	this.circleList = [];
}

circles.prototype.clear = function()
{
	this.circleList.splice(0,this.circleList.length);
}

circles.prototype.addCircle = function(radius,color)
{
	this.circleList = this.circleList.concat(new circle(0,0,radius,color));
}

circles.prototype.draw = function()
{
	$.each(this.circleList,function(index,circle)
	{
		circle.draw();
	});
}

function ellipse(centerX,centerY,radiusX,radiusY,color)
{
	this.centerX = centerX;
	this.centerY = centerY;
	this.radiusX = radiusX;
	this.radiusY = radiusY;
	this.color = color;
}

// helper for midpoint ellipse algorithm
ellipse.prototype.plotFourPoints = function(x,y)
{
	graph.plot(this.centerX+x,this.centerY+y,this.color);
	graph.plot(this.centerX-x,this.centerY+y,this.color);
	graph.plot(this.centerX-x,this.centerY-y,this.color);
	graph.plot(this.centerX+x,this.centerY-y,this.color);
}

// midpoint ellipse algorithm
ellipse.prototype.draw = function()
{
	var x = this.radiusX;
	var y = 0;
	var twoASquare = 2 * this.radiusX * this.radiusX;
	var twoBSquare = 2 * this.radiusY * this.radiusY;
	var changeX = this.radiusY * this.radiusY * (1 - (2 * this.radiusX));
	var changeY = this.radiusX * this.radiusX;
	var stoppingX = twoBSquare * this.radiusX;
	var stoppingY = 0;
	var error = 0;

	while (stoppingX >= stoppingY)
	{
		this.plotFourPoints(x,y);

		y++;
		stoppingY += twoASquare;
		error += changeY;
		changeY += twoASquare;

		if (((2 * error) + changeX) > 0)
		{
			x--;
			stoppingX -= twoBSquare;
			error += changeX;
			changeX += twoBSquare;
		}
	}

	x = 0;
	y = this.radiusY;
	changeX = this.radiusY * this.radiusY;
	changeY = this.radiusX * this.radiusX * (1 - (2 * this.radiusY));
	stoppingX = 0;
	stoppingY = twoASquare * this.radiusY;
	error = 0;

	while (stoppingX <= stoppingY)
	{
		this.plotFourPoints(x,y);

		x++;
		stoppingX += twoBSquare;
		error += changeX;
		changeX += twoBSquare;

		if (((2 * error) + changeY) > 0)
		{
			y--;
			stoppingY -= twoASquare;
			error += changeY;
			changeY += twoASquare;
		}
	}
}

function ellipses()
{
	this.ellipseList = [];
}

ellipses.prototype.clear = function()
{
	this.ellipseList.splice(0,this.ellipseList.length);
}

ellipses.prototype.addEllipse = function(radiusX,radiusY,color)
{
	this.ellipseList = this.ellipseList.concat(new ellipse(0,0,radiusX,radiusY,color));
}

ellipses.prototype.draw = function()
{
	$.each(this.ellipseList,function(index,ellipse)
	{
		ellipse.draw();
	});
}

function draw()
{
	circles.clear();
	ellipses.clear();

	var $conics = $('div.conic');

	$($conics).each(function(index,$conic)
	{
		if ($($conic).is('.circle'))
		{
			var radius = parseInt($($conic).find('input.radius').val());

			if (radius)
				circles.addCircle(radius,$($conic).find('input.color:checked').val());
		}
		else if ($($conic).is('.ellipse'))
		{
			var radiusX = parseInt($($conic).find('input.radiusX').val());
			var radiusY = parseInt($($conic).find('input.radiusY').val());

			if (radiusX && radiusY)
				ellipses.addEllipse(radiusX,radiusY,$($conic).find('input.color:checked').val());
		}
	});

	canvas.clear();

	graph.draw();
	points.draw();
	lines.draw();
	circles.draw();
	ellipses.draw();
}

$(document).ready(function()
{
	canvas = new canvasHandler();
	graph = new cartesianPlane();
	points = new points();
	lines = new lines();
	circles = new circles();
	ellipses = new ellipses();
	
	// add conic form to config div
	var $controls = $('<div/>');
	$controls.addClass('controls');
	$controls.hide();

	$controls.append(graphControl());
	$controls.append(newConicControl());

	var $controlPane = $('#controlPane');
	$controlPane.append($controls);
	$controls.slideDown();

	var $location = $('div#location');
	$location.text('running');

	// display the initial graph
	setInterval(draw,100);

	$('input.newCircle').live('click',function(event)
	{
		addCircleControl($controlPane);
	});

	$('input.newEllipse').live('click',function(event)
	{
		addEllipseControl($controlPane);
	});

	$('#canvas').mousedown(function(event)
	{
		clicking = true;
// 		startX = graph.getX(canvas.getX(event.pageX));
// 		startY = graph.getY(canvas.getY(event.pageY));
		startX = canvas.getX(event.pageX);
		startY = canvas.getY(event.pageY);
	});

	$('#canvas').mousemove(function(event)
	{
		var mouseX = (canvas.getX(event.pageX)-graph.getOriginX());
		var mouseY = (canvas.getY(event.pageY)-graph.getOriginY());
		var graphX = graph.getX(mouseX);
		var graphY = graph.getY(mouseY);

		$location.text('(' + mouseX + ',' + mouseY + ')(' + graphX + ',' + graphY + '): ' + graph.scale);

		if (!clicking)
			return;

		var newX = canvas.getX(event.pageX);
		var newY = canvas.getY(event.pageY);

		graph.moveOriginX(newX - startX);
		graph.moveOriginY(newY - startY);

		startX = newX;
		startY = newY
	});

	$('#canvas').mouseout(function()
	{
		clicking = false;
	});

	$('#canvas').mouseup(function(event)
	{
// 		if (clicking)
// 			lines.addLine(startX,startY,graph.getX(canvas.getX(event.pageX)), graph.getY(canvas.getY(event.pageY)), "rgba(32,32,192,1)");

		clicking = false;
	});

	$('#canvas').mousewheel(function(event,delta)
	{
		var mouseX = canvas.getX(event.pageX)-graph.getOriginX();
		var mouseY = canvas.getY(event.pageY)-graph.getOriginY();
		var scaleTemp = graph.scale;

		graph.scale += delta;
		graph.scale = parseInt(graph.scale * 1000) / 1000;

		if (graph.scale < 3)
			graph.scale = 3;
		else if (graph.scale > 50)
			graph.scale = 50;
		else
		{
			var x0 = graph.getOriginX();
			var y0 = graph.getOriginY();

			graph.moveOriginX(-(mouseX / scaleTemp) * delta);
			graph.moveOriginY(-(mouseY / scaleTemp) * delta);

			var newX = -(mouseX / scaleTemp) * delta;
			var newY = -(mouseY / scaleTemp) * delta;
			$location.text('(' + mouseX + ',' + mouseY + ')' + graph.scale + ': (' + x0 + ',' + y0 + ')+(' + newX + ',' + newY + ')=(' + graph.getOriginX() + ',' + graph.getOriginY() + ')');
		}
	});
});
