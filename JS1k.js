;(function(body, canvas, context, undefined){
    var Point = function(x, y){
	    this.x = x;
	    this.y = y;
    };
    Point.prototype.tr = function(dx, dy){
	    this.x += dx;
	    this.y += dy;
    };

    var Observable = function(){
	    this.o = {};
    };
    Observable.prototype.on = function(event, observer){
	    (this.o[event] = this.o[event] || []).push(observer);
    };
    Observable.prototype.e = function(event){
	    var args = Array.prototype.slice.call(arguments, 1);
	    (this.o[event] || []).forEach(function(observer){
	        observer.apply(undefined, args);
	    });
    };

    var Train = function(position, target){
	    Observable.call(this);
	    this.p =  position || new Point(0, 0);
        this._t = target || new Point(0, 0);
    };
    Train.prototype = Object.create(Observable.prototype);
    Train.prototype.move = function(){
        var x = this.p.x;
        var y = this.p.y;
        var dx = this._t.x - x;
        var dy = this._t.y - y;
	    this.p.tr(dx/100, dy/100);
	    this.e('moved', x, y);
    }
    Train.prototype.target = function(x, y){
        this._t = new Point(x, y);
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
	    this.m = model;
	    this.c = context;
	    this.m.on('moved', this.update.bind(this));
        this.b = backgroundData(10);
        this.t = trainData(10);
	    this.update();
    };
    TrainView.prototype.update = function(x, y){
        x = x || 0;
        y = y || 0;
        this.c.putImageData(this.b, x, y);
        this.c.putImageData(this.t, this.m.p.x, this.m.p.y);
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
