;(function(body, canvas, context){
    var Point = function(x, y){
	this.x = x;
	this.y = y;
    };

    var Train = function(startPosition){
	this.position =  startPosition || new Point(0, 0);
    };

    var TrainView = function(model, canvas, context){
	this.model = model;
	this.context = context;
	this.update();
    };
    TrainView.prototype.update = function(){
	this.context.fillRect(this.model.position.x, this.model.position.y, 5, 5);
    };

    var train = new Train(new Point(50, 50));
    new TrainView(train, canvas, context);
})(window.b, window.a, window.c);
