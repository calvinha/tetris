
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var WIDTH = canvas.width
var HEIGHT = canvas.height

var RunGame = (function(){

    function runGame(){
        
    };

    runGame.prototype = {
        constructor: runGame  
    };

    runGame.prototype.render = function(){
        var thisObject = this;
        requestAnimationFrame(function() {thisObject.render();});
        boardView.displayBoard();
    };

    return {
        runGame:runGame
    };
   
    
}());

function BoardView(model){
    this.model = model;
    this.boxSize = WIDTH/COLUMNS;



    BoardView.prototype.toString = function(){
        return "Board View";
    };

    
    BoardView.prototype.displayBoard = function(){
        var board = this.model.getBoard();
        var x = 0;
        var y = 0;
        
        
        for(var i = 0; i < board.length; i++){
            for(var j = 0; j < board[0].length; j++){
                var value = board[i][j];
                if(value >= 0){
                    this.drawSquare(x,y,value);
                }
                else{
                    ctx.fillStyle = "FFFFFF";
                    ctx.fillRect(x, y, this.boxSize, this.boxSize);
                }
                x += this.boxSize;
            }
            y += this.boxSize;
            x = 0;
        }
    };

    BoardView.prototype.drawSquare = function(x, y, colorIndex){
        // ctx.beginPath();
        // ctx.rect(x, y, this.boxSize, this.boxSize);
        // ctx.fillStyle = COLORS[colorIndex];
        // ctx.fill();
        // ctx.lineWidth = 2;
        // ctx.strokeStyle = 'black';
        // ctx.stroke();
        ctx.fillStyle = COLORS[colorIndex];
        ctx.fillRect(x, y, this.boxSize, this.boxSize);
    };
    
};

function render(){
    setTimeout(function(){
        requestAnimationFrame(render);
        board.erasePath(piece);
        piece.move("down");
        piece.rotateCounterClock();
        board.positionPiece(piece);
        boardView.displayBoard();
    }, 10000/60);
    
};


var game = new RunGame.runGame();
//game.render();
var board = new TetrisBoard();
var piece = new T_PIECE();
var boardView = new BoardView(board);

render();


// piece.getPointsArray();
// board.printBoard();
// document.write("<br>");
// piece.printAllPoints();
// document.write("<br>");
// board.erasePath(piece);
// board.positionPiece(piece);
// document.write("<br>");
// board.printBoard();
// boardView.displayBoard();




// board.erasePath(piece);
// piece.move("right");
// document.write("right <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();
// boardView.displayBoard();

// board.erasePath(piece);
// piece.move("right");
// document.write("right <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();
// boardView.displayBoard();


// board.erasePath(piece);
// piece.move("down");
// document.write("down <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();

// board.erasePath(piece);
// piece.move("down");
// document.write("down <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();

// board.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();

// board.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();

// board.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();

// board.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
// board.positionPiece(piece);
// board.printBoard();
