;(function(body, canvas, context, undefined){
    var Point = function(x, y){
	this.x = x;
	this.y = y;
    };
    Point.prototype.translate = function(dx, dy){
	this.x += dx;
	this.y += dy;
    };

    var Observable = function(){
	this.observers = {};
    };
    Observable.prototype.on = function(event, observer){
	(this.observers[event] = this.observers[event] || []).push(observer);
    };
    Observable.prototype.emit = function(event){
	var args = Array.prototype.slice.call(arguments, 1);
	(this.observers[event] || []).forEach(function(observer){
	    observer.apply(undefined, args);
	});
    };

    var Train = function(startPosition){
	Observable.call(this);
	this.position =  startPosition || new Point(0, 0);
    };
    Train.prototype = Object.create(Observable.prototype);
    Train.prototype.move = function(){
	this.position.translate(1, 1);
	this.emit('moved');
    }

    var TrainView = function(model, canvas, context){
	this.model = model;
	this.context = context;
	this.model.on('moved', this.update.bind(this));
	this.update();
    };
    TrainView.prototype.update = function(){
	this.context.fillRect(this.model.position.x, this.model.position.y, 5, 5);
    };

    var train = new Train(new Point(50, 50));
    new TrainView(train, canvas, context);

    function animate(){
	train.move();
	requestAnimationFrame(animate);
    }
    animate();
})(window.b, window.a, window.c);
