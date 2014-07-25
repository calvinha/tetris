

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

var PIECES = [new I_PIECE(), new Z_PIECE(),  new I_PIECE(), new S_PIECE, new T_PIECE, new J_PIECE, new L_PIECE, new O_PIECE];

var lines = true;
var leftRight = false;

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
        if(lines){
            ctx.beginPath();
            ctx.rect(x, y, this.boxSizeY, this.boxSizeY);
            ctx.fillStyle = COLORS[colorIndex];
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
        else{
            
            ctx.fillStyle = COLORS[colorIndex];
            ctx.fillRect(x, y, this.boxSizeY, this.boxSizeY);
        }
    };
    
};


                
/*Looks for user arrow key inputs*/
               
function keyListener(keyevent){
    
    model.erasePath(piece);
    var board = model.getBoard();   

    switch(keyevent.keyCode){
    case LEFT:
        piece.move("left", board); break;
    case RIGHT:
        piece.move("right", board); break;
    case UP:
        piece.rotateCounterClock(); break;       
    case DOWN:
        piece.move("down", board); break;
    }
    
    model.positionPiece(piece);
};


var gameStepTime = 500;
var cumulatedTime = 0;
var frameTime = 0;
var lastFrameTime = Date.now();

var evenPiece = true;
var count = 0;
var previousCount = 0;
//http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
function render(){
    

    requestAnimationFrame(render);
    var time = Date.now();    
    frameTime = time - lastFrameTime;
    lastFrameTime = time;
    cumulatedTime += frameTime;


    while(cumulatedTime > gameStepTime ){
        updatePiece(piece);
        if(piece.detectBottomBound(model.getBoard())){            
            var cleared = model.checkBoard();
            if(count % 2 == 0 || cleared){
                piece = getNewPiece();
                setUpPiece(piece);
            }
            count++;
        }
        cumulatedTime -= gameStepTime;
    }
    boardView.displayBoard();      
};



function updatePiece(piece){
    model.erasePath(piece);
    piece.move("down", model.getBoard());
    model.positionPiece(piece);
};

function getNewPiece(){
    return PIECES[Math.floor(Math.random()*PIECES.length)];
};

function setUpPiece(piece){
    piece.resetPiece();
    piece.setStartPosition();
    model.positionPiece(piece);
    boardView.displayBoard();
};

var model = new TetrisBoard();
var piece = getNewPiece();
var boardView = new BoardView(model);

setUpPiece(piece);
document.addEventListener('keydown', keyListener);
render();

// setTimeout(func, 1000);
// function func() {
//     alert('Do stuff here');
// }



// model.printBoard();
// model.checkBoard();






// piece.setStartPosition();
//model.positionPiece(piece);
//model.printBoard();


//model.erasePath(piece);
// piece.move("right");


// for(var i = 0; i < 18; i++){
//    model.erasePath(piece);
//     piece.move("down");
//    model.positionPiece(piece);
// }
// document.write("<br>");
//model.printBoard();

// piece = new O_PIECE();
// document.write("<br>");
// piece.setStartPosition();
//model.positionPiece(piece);
//model.printBoard();











// piece.getPointsArray();
//model.printBoard();
// document.write("<br>");
// piece.printAllPoints();
// document.write("<br>");
//model.erasePath(piece);
//model.positionPiece(piece);
// document.write("<br>");
//model.printBoard();
//modelView.displayBoard();




//model.erasePath(piece);
// piece.move("right");
// document.write("right <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();
//modelView.displayBoard();

//model.erasePath(piece);
// piece.move("right");
// document.write("right <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();
//modelView.displayBoard();


//model.erasePath(piece);
// piece.move("down");
// document.write("down <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();

//model.erasePath(piece);
// piece.move("down");
// document.write("down <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();

//model.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();

//model.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();

//model.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();

//model.erasePath(piece);
// piece.rotateCounterClock();
// document.write("rotate <br>");
// piece.printAllPoints();
// document.write("<br>");
//model.positionPiece(piece);
//model.printBoard();
