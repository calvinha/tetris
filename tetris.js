



//http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
// var canvas = document.getElementById("myCanvas");
// var ctx = canvas.getContext('2d');

// var WIDTH = canvas.width;
// var HEIGHT = canvas.height;

// var GAMESPEED_INCREMENT = 45;
// var LINES_PER_LEVEL = 1;



// var nextPieceCanvas = document.getElementById("nextPiece");
// var nextCtx = nextPieceCanvas.getContext("2d");
// var PIECE_SIZE = nextPieceCanvas.width;
// var BLOCKS_PER_ROW = 6; 
// var BLOCKS_PER_COLUMN = 5;
// var SPACEBAR_CODE = "&#160;" ;
// var AMOUNT_OF_START_SPACES = 5;




// var PIECES = [ new I_PIECE(), new Z_PIECE(),  new I_PIECE(), new S_PIECE(), new T_PIECE(), new J_PIECE(), new L_PIECE(), new O_PIECE(), new DOT_PIECE()];


//var blockLines = true;
var shift = false;

// var level = 1;
// var score = 0;


function BoardView(model, canvasWidth, canvasHeight){
    
    this.model = model;
    this.boxSizeX = canvasWidth/COLUMNS;
    this.boxSizeY = canvasHeight/ROWS;

    this.blockLines = true;

    
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
        if(this.blockLines){
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


                
// /*Looks for user arrow key inputs*/

function keyListener(keyevent){


    var model = tetrisgame.getModel();
    var piece = tetrisgame.getPiece();
    var view = tetrisgame.getView();
    var ctx = tetrisgame.getCTX();
    
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
    //http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
    //To disable browser scrolling which interferes with keyboard arrow keys 
    keyevent.preventDefault();
    model.positionPiece(piece);

    view.displayBoard(ROW_OFFSET, model.getBoard(), ctx);
};


// var gameStepTime = 450;
// var cumulatedTime = 0;
// var frameTime = 0;
// var lastFrameTime = Date.now();

// var count = 0;
// var cleared = false;
// var linesCleared = 0;

// var totalLinesCleared = 0;
// var lines = 0;
// var row;
// //http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
// function render(){
           
//     requestAnimationFrame(render);
    
//     var time = Date.now();
//     frameTime = time - lastFrameTime;
//     lastFrameTime = time;
//     cumulatedTime += frameTime;    


//     while(cumulatedTime > gameStepTime ){

//         updatePiece(piece);
        
//         if(shift || piece.detectBottomBound(model.getBoard())){
//             row = model.checkRows();
//             if(row >= ROW_OFFSET){// && (count % 2 == 0 && count != 0)){
//                 model.eliminateLines(row); //cleared the rows first
//                 cleared = true;
//             }
            
//             boardView.displayBoard(ROW_OFFSET, model.getBoard(), ctx);
            
//             if(model.isGameOver()){
//                 console.log("gameover");
//             }
//             else if(shift ||  (count % 2 == 0 && count != 0) || cleared){
//                 updateGameSpeed();
//                 swapPieces();
//                 cleared = false; //reset clear for better sliding pieces
//             }
//             if(!shift)
//                 count++;
//             shift = false;
//         }

//         cumulatedTime -= gameStepTime;
//     }
//     boardView.displayBoard(ROW_OFFSET, model.getBoard(), ctx);      
// };



// function swapPieces(){

    
//     piece = nextPiece;
//     model.erasePath(nextPiece, false);
//     nextPiece = getNewPiece();
//     setUpPiece(piece, nextPiece);
//     boardView.displayBoard(0, model.getMiniBoard(), nextCtx);
// };

// function updatePiece(piece){
//     model.erasePath(piece, true);
//     piece.move("down", model.getBoard());
//     model.positionPiece(piece);
// };

// function updateGameSpeed(){

//     if(linesCleared >= LINES_PER_LEVEL){
//         level++;
//         document.getElementById("level").innerHTML = "Level:"+addSpaces(level) + level;
//     }
    
//     while(linesCleared >= LINES_PER_LEVEL){
//         totalLinesCleared += linesCleared;
//         gameStepTime -= GAMESPEED_INCREMENT;
//         //alert(gameStepTime);
//         linesCleared -= LINES_PER_LEVEL;
//     }
// };

// function getNewPiece(){
//     return PIECES[Math.floor(Math.random()*PIECES.length)];
// };

// function setUpPiece(piece, nextPiece){
//     piece.resetPiece();
//     nextPiece.resetPiece();
//     nextPiece.setDisplayPiece(model.getMiniBoard());
//     piece.setStartPosition(ROW_OFFSET);
//     model.positionPiece(piece);
//     boardView.displayBoard(ROW_OFFSET, model.getBoard(), ctx);
// };


// function addSpaces(amount){
//     var digits = getDigits(amount);
//     var amount = AMOUNT_OF_START_SPACES - digits + 1;


//     var space = "";
        
//     for(var i = 0; i < amount; i++){ //adds one more "space" 
//         space += SPACEBAR_CODE;
//     }

//     return space;
// };


// /* Returns the amount of digits in a number */
// function getDigits(value){
//     if(value < 10){
//         return 1;
//     }
//     return getDigits(value / 10) + 1;
// };



function TetrisGame(){
    this.gameCanvas = document.getElementById("gameCanvas");
    this.gameContext = this.gameCanvas.getContext("2d");
    this.WIDTH = this.gameCanvas.width;
    this.HEIGHT = this.gameCanvas.height;
    this.GAMESPEED_INCREMENT = 45;
    this.LINES_PER_LEVEL = 2;
    this.AMOUNT_OF_START_SPACES = 5;
    this.SPACEBAR_CODE = "&#160;" ;


    //To calculate the gametime to update the score, amount of lines cleared and 
    //http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1
    this.gameStepTime = 450;
    this.cumulatedTime = 0;
    this.frameTime = 0;
    this.lastFrameTime = Date.now();

    this.count = 0;
    this.cleared = false;
    this.row;
    this.totalLinesCleared = 0;
    this.linesCleared = 0;
    this.lines = 0;

    // The level and scores for the tetris game
    this.level = 1;
    this.score = 0; 

    this.PIECES = [ new I_PIECE(), new Z_PIECE(),  new I_PIECE(), new S_PIECE(), new T_PIECE(), new J_PIECE(), new L_PIECE(), new O_PIECE(), new DOT_PIECE()];

    //For the tetris preview piece 
    this.nextPieceCanvas = document.getElementById("nextPiece");
    this.nextCtx = this.nextPieceCanvas.getContext("2d");
    this.PIECE_SIZE = this.nextPieceCanvas.width;

    
    this.model = new TetrisBoard();
    this.view = new BoardView(this.model, this.WIDTH, this.HEIGHT);
    this.piece = this.PIECES[Math.floor(Math.random()*this.PIECES.length)];
    this.nextPiece = this.PIECES[Math.floor(Math.random()*this.PIECES.length)];
    

    TetrisGame.prototype.setUpPiece = function(piece, nextPiece){
        piece.resetPiece();
        nextPiece.resetPiece();
        nextPiece.setDisplayPiece(this.model.getMiniBoard());
        piece.setStartPosition(ROW_OFFSET);
        this.model.positionPiece(piece);
        this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), this.gameContext);

    };
    
    this.setUpPiece(this.piece, this.nextPiece);
    this.view.displayBoard(0, this.model.getMiniBoard(), this.nextCtx);

    


    TetrisGame.prototype.getCanvasWidth = function(){
        return this.WIDTH;
    };


    TetrisGame.prototype.getCanvasHeight = function(){
        return this.HEIGHT;
    };
    
    TetrisGame.prototype.getNewPiece = function(){
        return this.PIECES[Math.floor(Math.random()*this.PIECES.length)];
    };


    // //ALERT Be cafeful right here
    // TetrisGame.prototype.setUpPiece = function(piece, nextPiece){
    //     piece.resetPiece();
    //     nextPiece.resetPiece();
    //     nextPiece.setDisplayPiece(this.model.getMiniBoard());
    //     piece.setStartPosition(ROW_OFFSET);
    //     model.positionPiece(piece);
    //     this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), this.gameContext);

    // };


    TetrisGame.prototype.swapPieces = function(){
        this.piece = this.nextPiece;
        this.model.erasePath(this.nextPiece, false);
        this.nextPiece = this.getNewPiece();
        this.setUpPiece(this.piece, this.nextPiece);
        this.view.displayBoard(0, this.model.getMiniBoard(), this.nextCtx); //FIX NEXTCTX
    };


    TetrisGame.prototype.updatePiece = function(piece){
        this.model.erasePath(piece, true);
        piece.move("down", this.model.getBoard());
        this.model.positionPiece(piece);
    };

    
    TetrisGame.prototype.updateGameSpeed = function() {
        var count = 0;
        var tempLines = this.linesCleared;
        if(this.linesCleared >= this.LINES_PER_LEVEL || this.totalLinesCleared % this.LINES_PER_LEVEL == 0){
            // this.level++;
            // document.getElementById("level").innerHTML = "Level:"+this.addSpaces(this.level) + this.level;

            this.totalLinesCleared += this.linesCleared;
            while(this.linesCleared >= this.LINES_PER_LEVEL){
                count++;
            //this.totalLinesCleared += this.linesCleared;
            this.gameStepTime -= this.GAMESPEED_INCREMENT;
            //alert(gameStepTime);
            this.linesCleared -= this.LINES_PER_LEVEL;
            
            }

            //Thursday, January 15, 2015
            // NEED TO UPDATE DISPLAYING TOTAL LINES CLEARED        
            this.level+=count;           
            document.getElementById("level").innerHTML = "Level:"+this.addSpaces(this.level) + this.level;
            alert(this.totalLinesCleared);

            document.getElementById("lines").innerHTML = "Lines:"+this.addSpaces(this.totalLinesCleared) + this.totalLinesCleared;
            if(this.score == 0)
                this.score = 1;
            this.score = this.score + this.score*tempLines;
            document.getElementById("score").innerHTML = "Score:" + this.addSpaces(this.score)+this.score;
            
        }
    };

    TetrisGame.prototype.getDigits = function(value){
        if(value < 10){
            return 1;
        }
        return this.getDigits(value / 10) + 1;
    };

    TetrisGame.prototype.addSpaces = function(amount){
        var digits = this.getDigits(amount);
        var amount = this.AMOUNT_OF_START_SPACES - digits + 1;


        var space = "";
        
        for(var i = 0; i < amount; i++){ //adds one more "space" 
            space += this.SPACEBAR_CODE;
        }

        return space;
    };

    TetrisGame.prototype.updateKeys = function(){
        
        var self = this;
        document.onkeydown = function(keyevent){
            self.model.erasePath(self.piece, true);
            var board = self.model.getBoard();

            switch(keyevent.keyCode){
            case self.LEFT:
                self.piece.move("left", board); break;
            case self.RIGHT:
                self.piece.move("right", board); break;
            case self.UP:
                self.piece.rotateCounterClock(board); break;       
            case self.DOWN:   
                self.piece.move("down", board); break;
            case self.SHIFT:
                self.piece.dropPiece(board); shift = true; break;
            }
            //http://stackoverflow.com/questions/8916620/disable-arrow-key-scrolling-in-users-browser
            //To disable browser scrolling which interferes with keyboard arrow keys 
            keyevent.preventDefault();
        }
        this.model.positionPiece(this.piece);

        this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), this.gameContext);
    };

    TetrisGame.prototype.run = function(){
        
        requestAnimationFrame(this.run.bind(this));
        var time = Date.now();
        this.frameTime = time - this.lastFrameTime;
        this.lastFrameTime = time;
        this.cumulatedTime += this.frameTime;

        while(this.cumulatedTime > this.gameStepTime ){

            this.updatePiece(this.piece);
            
            if(shift || this.piece.detectBottomBound(this.model.getBoard())){
                this.row = this.model.checkRows();
                if(this.row >= ROW_OFFSET){// && (count % 2 == 0 && count != 0)){
                    //Where linesCleared to UPDATE SCORE Thursday, January 15, 2015
                    this.linesCleared = this.model.eliminateLines(this.row, this.linesCleared); //cleared the rows first
                    //alert(this.linesCleared);
                    this.cleared = true;
                }
                
                this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), this.gameContext);
                
                if(this.model.isGameOver()){
                    console.log("gameover");
                }
                else if(shift ||  (this.count % 2 == 0 && this.count != 0) || this.cleared){
                    //Thursday, January 15, 2015
                    // NEED TO UPDATE DISPLAYING TOTAL LINES CLEARED
                    this.updateGameSpeed();
                    this.swapPieces();
                    this.cleared = false; //reset clear for better sliding pieces
                }
                if(!shift)
                    this.count++;
                shift = false;
            }

            this.cumulatedTime -= this.gameStepTime;
        }
        this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), this.gameContext);      
        
    };
    

    TetrisGame.prototype.getLines = function(){
        return this.lines;
    };

    TetrisGame.prototype.getScore = function(){
        return this.score;
    };

    TetrisGame.prototype.getLevel = function(){
        return this.level;
    };

    TetrisGame.prototype.getModel = function(){
        return this.model;
    };

    TetrisGame.prototype.getView = function(){
        return this.view;
    };

    TetrisGame.prototype.getPiece = function(){
        return this.piece;
    };
    

    TetrisGame.prototype.getCTX = function(){
        return this.gameContext;
    };
    
}; //End of TetrisGame class 






// var model = new TetrisBoard();
// var piece = getNewPiece();
// var boardView = new BoardView(model);
// var nextPiece = getNewPiece();
// setUpPiece(piece, nextPiece);
// boardView.displayBoard(0, model.getMiniBoard(), nextCtx);
// document.addEventListener('keydown', keyListener);




// document.getElementById("level").innerHTML = "Level:"+addSpaces(level) + level;
// document.getElementById("score").innerHTML = "Score:"+addSpaces(score) + score;
// document.getElementById("lines").innerHTML = "Lines:"+ addSpaces(lines) + lines;

// render();



var tetrisgame = new TetrisGame();
//document.addEventListener('keydown', tetrisgame.updateKeys());
document.addEventListener('keydown', keyListener);
document.getElementById("level").innerHTML = "Level:"+tetrisgame.addSpaces(tetrisgame.getLevel()) + tetrisgame.getLevel()
document.getElementById("score").innerHTML = "Score:"+tetrisgame.addSpaces(tetrisgame.getScore()) + tetrisgame.getScore()
document.getElementById("lines").innerHTML = "Lines:"+ tetrisgame.addSpaces(tetrisgame.getLines()) +
    tetrisgame.getLines();
tetrisgame.run();




