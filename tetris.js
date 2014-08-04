


//http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext('2d');

var WIDTH = canvas.width;
var HEIGHT = canvas.height;

var GAMESPEED_INCREMENT = 45;
var LINES_PER_LEVEL = 10;


var nextPieceCanvas = document.getElementById("nextPiece");
var nextCtx = nextPieceCanvas.getContext("2d");
var PIECE_SIZE = nextPieceCanvas.width;
var BLOCKS_PER_ROW = 6; //6
var BLOCKS_PER_COLUMN = 5; //6

//Javascript char keyCodes for keyboard input 
var LEFT = 37;
var RIGHT = 39;
var DOWN = 40;
var UP = 38;
var SHIFT = 16;


var PIECES = [ new I_PIECE(), new Z_PIECE(),  new I_PIECE(), new S_PIECE, new T_PIECE, new J_PIECE, new L_PIECE, new O_PIECE, new DOT_PIECE()];


var blockLines = true;
var shift = false;               

function BoardView(model){
    
    this.model = model;
    this.boxSizeX = WIDTH/COLUMNS;
    this.boxSizeY = HEIGHT/ROWS;

    BoardView.prototype.toString = function(){
        return "Board View";
    };
    
    BoardView.prototype.displayBoard = function(start, board, context ){
        
        var x = 0;
        var y = 0;

        
        for(var i = start; i < board.length; i++){
            for(var j = 0; j < board[0].length; j++){             
                var value = board[i][j];
                if(value >= 0){
                    this.drawSquare(x,y,value, context);
                }
                else{
                   context.fillStyle = "#FFFFFF";
                   //context.fillStyle = "black";
                    context.fillRect(x, y, this.boxSizeY, this.boxSizeY );
                }
                x += this.boxSizeY;
            }
            y += this.boxSizeY;
            x = 0;
        }
        //Drows a border for the miniDisplay for visual debugging purposes
        // if(context == nextCtx ){
        //     context.rect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
        //     context.stroke();
        // }
    };

    BoardView.prototype.drawSquare = function(x, y, colorIndex, context){
        if(blockLines){
            context.beginPath();
            context.rect(x, y, this.boxSizeY, this.boxSizeY);
            context.fillStyle = COLORS[colorIndex];
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = 'black';
            context.stroke();
        }
        else{
            
            context.fillStyle = COLORS[colorIndex];
            context.fillRect(x, y, this.boxSizeY, this.boxSizeY);
        }
    };
    
};


                
/*Looks for user arrow key inputs*/

function keyListener(keyevent){
    
    model.erasePath(piece, true);
    var board = model.getBoard();

    switch(keyevent.keyCode){
    case LEFT:
        piece.move("left", board); break;
    case RIGHT:
        piece.move("right", board); break;
    case UP:
        piece.rotateCounterClock(board); break;       
    case DOWN:   
        piece.move("down", board); break;
    case SHIFT:
        piece.dropPiece(board); shift = true; break;
    }
    model.positionPiece(piece);
 //http://forums.asp.net/t/1455027.aspx?how+to+disable+scroll+bar+moving+when+arrow+key+press+down
    keyevent.returnValue = false; //for safari
    boardView.displayBoard(ROW_OFFSET, model.getBoard(), ctx);
};


var gameStepTime = 450;
var cumulatedTime = 0;
var frameTime = 0;
var lastFrameTime = Date.now();

var count = 0;
var cleared = false;
var linesCleared = 0;
var row;
//http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
function render(){
           
    requestAnimationFrame(render);
    
    var time = Date.now();
    frameTime = time - lastFrameTime;
    lastFrameTime = time;
    cumulatedTime += frameTime;    


    while(cumulatedTime > gameStepTime ){

        updatePiece(piece);
        
        if(shift || piece.detectBottomBound(model.getBoard())){
            row = model.checkRows();
            if(row >= ROW_OFFSET){// && (count % 2 == 0 && count != 0)){
                model.eliminateLines(row); //cleared the rows first
                cleared = true;
            }
            
            boardView.displayBoard(ROW_OFFSET, model.getBoard(), ctx);
            
            if(model.isGameOver()){
                console.log("gameover");
            }
            else if(shift ||  (count % 2 == 0 && count != 0) || cleared){
                updateGameSpeed();
                swapPieces();
                cleared = false; //reset clear for better sliding pieces
            }
            if(!shift)
                count++;
            shift = false;
        }

        cumulatedTime -= gameStepTime;
    }
    boardView.displayBoard(ROW_OFFSET, model.getBoard(), ctx);      
};



function swapPieces(){

    
    piece = nextPiece;
    model.erasePath(nextPiece, false);
    nextPiece = getNewPiece();
    setUpPiece(piece, nextPiece);
    boardView.displayBoard(0, model.getMiniBoard(), nextCtx);
};

function updatePiece(piece){
    model.erasePath(piece, true);
    piece.move("down", model.getBoard());
    model.positionPiece(piece);
};

function updateGameSpeed(){

    while(linesCleared >= LINES_PER_LEVEL){
        gameStepTime -= GAMESPEED_INCREMENT;
        //alert(gameStepTime);
        linesCleared -= LINES_PER_LEVEL;
    }

};

function getNewPiece(){
    return PIECES[Math.floor(Math.random()*PIECES.length)];
};

function setUpPiece(piece, nextPiece){
    piece.resetPiece();
    nextPiece.resetPiece();
    nextPiece.setDisplayPiece(model.getMiniBoard());
    piece.setStartPosition(ROW_OFFSET);
    model.positionPiece(piece);
    boardView.displayBoard(ROW_OFFSET, model.getBoard(), ctx);
};



var model = new TetrisBoard();
var piece = new I_PIECE();//getNewPiece();
var boardView = new BoardView(model);
var nextPiece = new T_PIECE();//getNewPiece();
setUpPiece(piece, nextPiece);

boardView.displayBoard(0, model.getMiniBoard(), nextCtx);
document.addEventListener('keydown', keyListener);
render();








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




// nextCtx.fillStyle = "red";
// nextCtx.fillRect(0, 0, 20, 20 );
    
    
    




