
//http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var WIDTH = canvas.width
var HEIGHT = canvas.height
var fps = 30;
var LEFT = 37;
var RIGHT = 39;
var DOWN = 40;
var UP = 38;


function BoardView(model){
    this.model = model;
    this.boxSizeX = WIDTH/COLUMNS;
    this.boxSizeY = HEIGHT/ROWS;



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
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(x, y, this.boxSizeY, this.boxSizeY );
                }
                x += this.boxSizeY;
            }
            y += this.boxSizeY;
            x = 0;
        }
    };

    BoardView.prototype.drawSquare = function(x, y, colorIndex){
        ctx.beginPath();
        ctx.rect(x, y, this.boxSizeY, this.boxSizeY);
        ctx.fillStyle = COLORS[colorIndex];
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        // ctx.fillStyle = COLORS[colorIndex];
        // ctx.fillRect(x, y, this.boxSizeY, this.boxSizeY);
    };
    
};

/*Looks for user arrow key inputs*/
function keyListener(keyevent){
    board.erasePath(piece);
    switch(keyevent.keyCode){
    case LEFT:
        piece.move("left");break;
    case RIGHT:
        piece.move("right"); break;
    case UP:
        piece.rotateCounterClock(); break;       
    case DOWN:
       piece.move("down");break;
    }
    board.positionPiece(piece);
};


var gameStepTime = 500;
var cumulatedTime = 0;
var frameTime = 0;
var lastFrameTime = Date.now();

//http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
function render(){
    

        requestAnimationFrame(render);
        var time = Date.now();    
        frameTime = time - lastFrameTime;
        lastFrameTime = time;
        cumulatedTime += frameTime;

        while(cumulatedTime > gameStepTime ){
            updatePiece();
            cumulatedTime -= gameStepTime;
        }
        boardView.displayBoard();      
};


function updatePiece(){
    board.erasePath(piece);
    piece.move("down");
    board.positionPiece(piece);
}

var board = new TetrisBoard();
var piece = new L_PIECE();
var boardView = new BoardView(board);

piece.setStartPosition();
board.positionPiece(piece);
boardView.displayBoard();
document.addEventListener('keydown', keyListener);
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
