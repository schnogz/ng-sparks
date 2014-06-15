angular.module("jsSparks",["ngRoute", "colorpicker.module"]).config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "sparksCanvas.html",
        controller: "mainController"
    }).otherwise({
        redirectTo: "/"
    });
}]);


angular.module("jsSparks").controller("mainController", ["$scope", function($scope) {

    var that = this;

    // private canvas configurations
    this.display = document.getElementById('sparkCanvas');
    this.ctx = this.display.getContext('2d');
    this.particles = [];
    this.width = this.display.width = window.innerWidth;
    this.height = this.display.height = window.innerHeight;
    this.origin = {
        // offset x to account for side menu
        x: (this.width * 0.5) - (this.width *.08),
        y: this.height * 0.5
    };

    // scope defaults
    $scope.sparkColor = "";
    $scope.bgColor = "#000000";
    $scope.randomColors = true;
    $scope.sparkCount = 200;
    $scope.sparkWidth = 2;

    // utility functions
    $scope.getRandomColor = function() {
        return "#" +(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    };

    $scope.getRandomCount = function() {
        return Math.floor((Math.random() * 2500) + 1);;
    };

    $scope.getRandomWidth = function() {
        return Math.floor((Math.random() * 5) + 1);;
    };

    // app events
    $scope.randomizeAll = function() {
        // clear old canvas
        that.particles = [];
        // randomly select to use one color or each different
        if (Math.floor((Math.random() * 10)) % 2) {
            $scope.sparkColor = "";
            $scope.randomColors = true;
        }
        else {
            $scope.sparkColor = $scope.getRandomColor();
            $scope.randomColors = false;
        }

        $scope.bgColor = $scope.getRandomColor();
        $scope.sparkCount = $scope.getRandomCount();
        $scope.sparkWidth = $scope.getRandomWidth();

        // redraw
        $scope.draw();
    };

    $scope.randomizeBgColor = function() {
        $scope.bgColor = $scope.getRandomColor();
    };

    $scope.randomizeSparkSize = function() {
        $scope.sparkWidth = $scope.getRandomCount();
    };

    $scope.randomizeSparkCount = function() {
        // clear old canvas
        that.particles = [];
        $scope.sparkCount = $scope.getRandomCount();
        // redraw
        $scope.draw();
    };

    $scope.randomizeSparkColor = function() {
        // clear old canvas
        that.particles = [];
        $scope.sparkColor = $scope.getRandomColor();
        // redraw
        $scope.draw();
    };

    // app bootstrap
    $scope.draw = function() {
        that.particles = [];

        for (var i = 0; i < $scope.sparkCount; i++) {
            that.particles[i] = new Particle(Math.random() * that.width, Math.random() * that.height);
        };

        requestAnimationFrame(frame);
        function frame() {
            requestAnimationFrame(frame);
            that.ctx.clearRect(0, 0, that.width, that.height);
            for (var i = 0; i < Math.random() * 20; i++) {
                // recycle old particles
                that.particles.shift()
                // create new particles
                that.particles.push(new Particle(Math.random() * that.width, Math.random() * that.height));
            };
            for (var i = 0; i < that.particles.length; i++) {
                that.particles[i].attract(that.origin.x, that.origin.y);
                that.particles[i].integrate();
                that.particles[i].draw();
            }
        };

        // particle class definitions
        function Particle(x, y) {
            this.x = this.oldX = x;
            this.y = this.oldY = y;

            if ($scope.randomColors) {
                this.color = $scope.getRandomColor();
            }
            else {
                this.color = $scope.sparkColor;
            }
        };

        Particle.prototype.integrate = function() {
            var velocityX = (this.x - this.oldX);
            var velocityY = (this.y - this.oldY);
            this.oldX = this.x;
            this.oldY = this.y;
            this.x += velocityX;
            this.y += velocityY;

        };

        Particle.prototype.attract = function(x, y) {
            var dx = x - this.x;
            var dy = y - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy) * Math.random();
            this.x += dx / distance + Math.random() * .1;
            this.y += dy / distance + Math.random() * .1;
        };

        Particle.prototype.draw = function() {
            that.ctx.strokeStyle = this.color;
            that.ctx.lineWidth = $scope.sparkWidth;
            that.ctx.beginPath();
            that.ctx.moveTo(this.oldX, this.oldY);
            that.ctx.lineTo(this.x, this.y);
            that.ctx.stroke();
        };

    };

    // initial app load
    $scope.draw();
}]);