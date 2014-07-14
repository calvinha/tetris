
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
    };

    return {
        runGame:runGame
    };
   
    
}());

// function BoardView(model){
//     this.model = model;
//     this.boxSize = WIDTH/COLUMNS;
    
//     BoardView.prototype.displayBoard = function(){
//         var x = 0;
//         var y = 0;
        
//         for(var i = 0; i < this.model.length; i++){
//             for(var j = 0; j < this.model[0].length; j++){
//                 if(this.model[i][j] >= 0){
//                     ctx.fillStyle = COLORS[this.model[i][j]];
//                     ctx.fillRect(x, y, this.boxSize, this.boxSize);
//                 }
//                 x += boxSize;
//             }
//             y+= boxSize;
//         }
//     };
// }


var game = new RunGame.runGame();
game.render();
var board = new TetrisBoard();
var piece = new T_PIECE();

piece.getPointsArray();
board.printBoard();
document.write("<br>");
piece.printAllPoints();
document.write("<br>");
board.erasePath(piece);
board.positionPiece(piece);
document.write("<br>");
board.printBoard();

board.erasePath(piece);
piece.move("right");
document.write("right <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();

board.erasePath(piece);
piece.move("right");
document.write("right <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();



board.erasePath(piece);
piece.move("down");
document.write("down <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();

board.erasePath(piece);
piece.move("down");
document.write("down <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();

board.erasePath(piece);
piece.rotateCounterClock();
document.write("rotate <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();

board.erasePath(piece);
piece.rotateCounterClock();
document.write("rotate <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();

board.erasePath(piece);
piece.rotateCounterClock();
document.write("rotate <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();

board.erasePath(piece);
piece.rotateCounterClock();
document.write("rotate <br>");
piece.printAllPoints();
document.write("<br>");
board.positionPiece(piece);
board.printBoard();
