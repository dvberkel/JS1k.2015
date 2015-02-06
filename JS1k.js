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

    var Train = function(position, target){
	    Observable.call(this);
	    this.position =  position || new Point(0, 0);
        this._target = target || new Point(0, 0);
    };
    Train.prototype = Object.create(Observable.prototype);
    Train.prototype.move = function(){
        var x = this.position.x;
        var y = this.position.y;
        var dx = this._target.x - x;
        var dy = this._target.y - y;
	    this.position.translate(dx/100, dy/100);
	    this.emit('moved', x, y);
    }
    Train.prototype.target = function(x, y){
        this._target = new Point(x, y);
    }

    function imageData(width, height, scale, color, data){
        scale = scale || 1;
        var canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(0, 0);
        data.map(function(d){
            return { x: d[0] * scale, y: d[1] * scale }
        }).forEach(function(point){
            context.lineTo(point.x, point.y);
        });
        context.closePath();
        context.fillStyle = color;
        context.fill();
        return context.getImageData(0, 0, canvas.width, canvas.height);
    }


    function backgroundData(scale){
        return imageData(8, 6, scale, 'white', [
            [8, 0],
            [8, 6],
            [0, 6]
        ]);
    }

    function trainData(scale){
        return imageData(8, 6, scale, 'black', [
            [4, 0],
            [4, 3],
            [6, 3],
            [6, 1],
            [7, 1],
            [7, 3],
            [8, 3],
            [8, 6],
            [7, 6],
            [7, 5],
            [6, 5],
            [6, 6],
            [5, 6],
            [5, 5],
            [4, 5],
            [4, 6],
            [3, 6],
            [3, 5],
            [2, 5],
            [2, 6],
            [1, 6],
            [1, 1],
            [0, 1]
        ]);
    }

    var TrainView = function(model, canvas, context){
	    this.model = model;
	    this.context = context;
	    this.model.on('moved', this.update.bind(this));
        this.backgroundData = backgroundData(10);
        this.trainData = trainData(10);
	    this.update();
    };
    TrainView.prototype.update = function(x, y){
        x = x || 0;
        y = y || 0;
        this.context.putImageData(this.backgroundData, x, y);
        this.context.putImageData(this.trainData, this.model.position.x, this.model.position.y);
    };

    var train = new Train(new Point(50, 50), new Point(150, 100));
    new TrainView(train, canvas, context);

    function animate(){
	    train.move();
	    requestAnimationFrame(animate);
    }
    animate();

    canvas.addEventListener('mousemove', function(e){
        train.target(e.clientX, e.clientY);
    });
})(window.b, window.a, window.c);
