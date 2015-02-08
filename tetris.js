/*
  @author Calvin Ha 

*/

//I used this source for gamesteptime speed and  increment functions to
//calculate when to increase the drop speed of a tetris piece
//http://www.smashinglabs.pl/3d-tetris-with-three-js-tutorial-part-1

var shift = false;
var definedCreatePiece = false;
var gameCanvas = document.getElementById("gameCanvas");
var gameContext = this.gameCanvas.getContext("2d");
var CANVAS_WIDTH = gameCanvas.width;
var CANVAS_HEIGHT = gameCanvas.height;


function BoardView(model, canvasWidth, canvasHeight){
    
    this.model = model;
    this.boxSizeX = canvasWidth/COLUMNS;
    this.boxSizeY = canvasHeight/ROWS;
    this.blockLines = false;

    
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






function TetrisGame(){
    this.GAMESPEED_INCREMENT = 45;
    this.LINES_PER_LEVEL = 3;
    this.AMOUNT_OF_START_SPACES = 5;
    this.SPACEBAR_CODE = "&#160;" ;
    this.DEFAULT_PIECE_SIZE = 4;


    //To calculate the gametime to update the score, amount of lines cleared and 
    this.gameStepTime = 450;
    this.cumulatedTime = 0;
    this.frameTime = 0;
    this.lastFrameTime = Date.now();

    this.gameover = false;
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
    this.view = new BoardView(this.model, CANVAS_WIDTH, CANVAS_HEIGHT);
    

    TetrisGame.prototype.setUpPiece = function(piece, nextPiece){
        piece.resetPiece();
        nextPiece.resetPiece();
        nextPiece.setDisplayPiece(this.model.getMiniBoard());
        piece.setStartPosition(ROW_OFFSET);
        this.model.positionPiece(piece);
        this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), gameContext);

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
    //     this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), gameContext);

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

    TetrisGame.prototype.updateGameSpeed = function() {
        
        var count = 0;
        
        while(this.lines >= this.LINES_PER_LEVEL){
            count++;
            this.gameStepTime -= this.GAMESPEED_INCREMENT;
            this.lines -= this.LINES_PER_LEVEL;            
        }
        
        this.level += count;
        this.updateHTMLLevel(this.level);

    };

    TetrisGame.prototype.run = function(){
        if(!this.gameover)
            requestAnimationFrame(this.run.bind(this));
        var time = Date.now();
        this.frameTime = time - this.lastFrameTime;
        this.lastFrameTime = time;
        this.cumulatedTime += this.frameTime;

        while(this.cumulatedTime > this.gameStepTime ){

            this.updatePiece(this.piece);
            
            if(shift || this.piece.detectBottomBound(this.model.getBoard())){
                this.row = this.model.checkRows();
                if(this.row >= ROW_OFFSET){
                    this.linesCleared = this.model.eliminateLines(this.row); //cleared the rows first
                    this.lines += this.linesCleared;
                    this.totalLinesCleared += this.linesCleared;
                    this.updateHTMLLines(this.totalLinesCleared);                   
                    this.cleared = true;
                }                               
                this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), gameContext);
                
                if(this.model.isGameOver()){
                    this.gameover=true;
                    break;
                }
                else if(shift ||  (this.count % 2 == 0 && this.count != 0) || this.cleared){
                    this.updateGameSpeed();
                    this.swapPieces();
                    this.cleared = false; //reset clear for better sliding pieces
                }
                this.updateHTMLScore(this.linesCleared);
                this.linesCleared = 0;
               
                if(!shift)
                    this.count++;
                shift = false;
            }

            this.cumulatedTime -= this.gameStepTime;
            
        }
        this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), gameContext);      
        
    };
    

    TetrisGame.prototype.updateHTMLLines = function(totalLinesCleared){
        document.getElementById("lines").innerHTML = "Lines:"+this.addSpaces(totalLinesCleared) + totalLinesCleared;
    };

    TetrisGame.prototype.updateHTMLLevel = function(level){
        document.getElementById("level").innerHTML = "Level:"+this.addSpaces(level) + level;
    };

    TetrisGame.prototype.updateHTMLScore = function(tempLines){        
        this.score = this.score + COLUMNS*tempLines + this.piece.getTotalPoints();
        document.getElementById("score").innerHTML = "Score:" + this.addSpaces(this.score)+this.score;  
    };
    

    TetrisGame.prototype.draw = function(){
        this.view.displayBoard(ROW_OFFSET, this.model.getBoard(), gameContext);      
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
    


    TetrisGame.prototype.setScoreBoard = function(){
        document.getElementById("level").innerHTML = "Level:"+this.addSpaces(this.level) + this.level;
        document.getElementById("score").innerHTML = "Score:"+this.addSpaces(this.score) + this.score;
        document.getElementById("lines").innerHTML = "Lines:"+ this.addSpaces(this.totalLinesCleared) + this.totalLinesCleared;
    };

    TetrisGame.prototype.addUserPiece = function(userpiece){
        this.PIECES.push(userpiece);
    };

    TetrisGame.prototype.startGame = function(){
        gameContext.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);

        //baddd
        if(definedCreatePiece){
            var user_piece = createUserPiece();
            this.PIECES.push(user_piece)
            this.piece = user_piece;
        }
        else{
            this.piece = this.getNewPiece();
        }
        this.nextPiece = this.getNewPiece();        
        this.setUpPiece(this.piece, this.nextPiece);
        this.view.displayBoard(0, this.model.getMiniBoard(), this.nextCtx);
        this.run();
    }
    
}; //End of TetrisGame class 


function Button( x, y, w, h, radius, text, xCoord, yCoord){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.arrayPosition = new Point(xCoord, yCoord);
    this.radius = radius;
    this.text = text;
    this.clicked = false;
    this.DEFAULT_COLOR = "#E8E8E8"
    this.HOVER_COLOR = "#008DFF"
    this.isHovering = false;
    this.font = "32px Tahoma";
    this.TEXT_X_OFFSET = 54;
    this.TEXT_Y_OFFSET = 50;
    
    
    Button.prototype.draw = function(){

        var r = this.x + this.w;
        var b = this.y + this.h;
        
        gameContext.beginPath();
        gameContext.strokeStyle="black";
        gameContext.lineWidth="3"; //3
        gameContext.moveTo(this.x+radius, this.y);
        gameContext.lineTo(r - this.radius, this.y);
        gameContext.quadraticCurveTo(r, this.y, r, this.y + this.radius);
        gameContext.lineTo(r, this.y + this.h - this.radius);
        gameContext.quadraticCurveTo(r, b, r - this.radius, b);
        gameContext.lineTo(this.x + this.radius, b);
        gameContext.quadraticCurveTo(this.x, b, this.x, b - this.radius);
        gameContext.lineTo(this.x, this.y + this.radius);
        gameContext.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
        gameContext.stroke();

        if(this.clicked)
            gameContext.fillStyle = this.HOVER_COLOR;
        else if(this.isHovering)
            gameContext.fillStyle=this.HOVER_COLOR;
        else
            gameContext.fillStyle=this.DEFAULT_COLOR;
        gameContext.fill();
        

        //Draw the text
        gameContext.fillStyle = "black";
        gameContext.font=this.font;
        var fontWidth = gameContext.measureText(this.text).width;
        var textX = (this.w-fontWidth)/2;
        gameContext.fillText(this.text, textX+this.TEXT_X_OFFSET, this.y + this.TEXT_Y_OFFSET);
    };

    

    Button.prototype.containsMousePoint = function(pointX,pointY){        
        return  (this.x <= pointX) && (this.x + this.w >= pointX) &&
            (this.y <= pointY) && (this.y + this.h >= pointY);
    };

    Button.prototype.getLocation = function(){
        return "x: " + this.x + " || y: "+ this.y + "|| w: "+this.w + "|| h: "+this.h;
    };

    Button.prototype.isHover = function(){
        return this.isHovering;
    };

    Button.prototype.changeHover = function(hover){
        // if(this.clicked){
        //     this.isHovering = !this.isHovering;
        // }
        // else
        this.isHovering = hover;
        
    };

    Button.prototype.isStartButton = function(){
        return this.text == "Start Game";
    }

    Button.prototype.isCreatePieceButton = function(){
        return this.text == "Create Piece";
    };

    Button.prototype.getText = function(){
        return this.text;
    };


    Button.prototype.isClicked = function(){
        return this.clicked;
    };

    Button.prototype.changeClick = function(){
        this.clicked = !this.clicked;
        this.changeHover(this.clicked);

    };

    Button.prototype.getPosition = function(){
        return this.arrayPosition;
    };

    Button.prototype.changeY = function(newY){
        this.y = newY;
    };
};


function TetrisMenuScreen (){
    this.BUTTON_WIDTH_PERCENTAGE = 0.65;
    this.BUTTON_HEIGHT= 75;
    this.BUTTON_SPACING = 25;
    this.TOTAL_BUTTONS = 2;
    this.BUTTON_TOTAL_HEIGHT_PERCENTAGE = 0.90;
    this.TOTAL_CREATE_PIECES = 9;
    this.PIECES_OFFSET = 10; 
    this.FONT = "28px Tahoma";
    this.startButton;
    this.createPieceButton;
    this.menuButtons = [];
    this.pieceButtons = [];
   


    TetrisMenuScreen.prototype.drawMenuScreen = function(){
        //gameContext.globalAlpha=0.3;
        gameContext.fillStyle="#CACACA";
        gameContext.fillRect(0, 0,CANVAS_WIDTH, CANVAS_HEIGHT);
        //gameContext.globalAlpha=0.0;
    };

    TetrisMenuScreen.prototype.createMenuButtons = function(y, radius, text, startPiece){
        //http://www.scriptol.com/html5/canvas/rounded-rectangle.php
        var w = CANVAS_WIDTH*this.BUTTON_WIDTH_PERCENTAGE;
        var h = this.BUTTON_HEIGHT;

        var x = (CANVAS_WIDTH - w)/2;
        var r = x + w;
        var b = y + h;
        if(startPiece){
            this.startButton = new Button(x,y,w,h, radius, text, -1, -1);
        }       
        else{
            this.createPieceButton = new Button(x,y,w,h, radius, text, -1, -1);
        }

    };

    TetrisMenuScreen.prototype.defineButtons = function(){

        var totalHeight = this.TOTAL_BUTTONS*this.BUTTON_HEIGHT+(this.TOTAL_BUTTONS-1)*this.BUTTON_SPACING;
        var startY = (CANVAS_HEIGHT - totalHeight)/2;
        
        for(var i = 0; i < this.TOTAL_BUTTONS; i++){

            if(i % 2 == 0){
                this.createMenuButtons(startY, 10, "Start Game", true);
            }
            else{
                this.createMenuButtons(startY, 10, "Create Piece", false);
            }
            startY = startY + this.BUTTON_HEIGHT + this.BUTTON_SPACING;

        }
    };

    TetrisMenuScreen.prototype.getStartButton = function(){
        return this.startButton;
    };

    TetrisMenuScreen.prototype.getCreatePieceButton = function(){
        return this.createPieceButton;
    };

    TetrisMenuScreen.prototype.getMenuButtons = function(){
        return this.menuButtons
    };

    TetrisMenuScreen.prototype.createPieces = function(){
        
        var rowsColumns = Math.sqrt(this.TOTAL_CREATE_PIECES);
        var w = CANVAS_WIDTH*0.20;
        var h = w;
        var totalWidth = rowsColumns*w + this.PIECES_OFFSET*(rowsColumns-1);;
        var x  = (CANVAS_WIDTH - totalWidth)/2;
        var startX = x ;
        var y  = (CANVAS_HEIGHT - totalWidth)/2;

        var debug = 10;
        for(var i = 0; i < rowsColumns; i++){
            for(var j = 0; j < rowsColumns; j++){
                var button = new Button(x, y, w, h, 3, "", i, j);
                this.pieceButtons.push(button);
                button.draw();
                x = x + w + this.PIECES_OFFSET;
                debug += 1;
            }
            x = startX;
            y = y + h + this.PIECES_OFFSET;
        }
        
        this.startButton.changeY(y + h);
        this.startButton.draw();
        this.pieceButtons.push(this.startButton);
        
    };

    TetrisMenuScreen.prototype.getPieceButtons = function(){
        return this.pieceButtons;
    }
    


    this.defineButtons();
    this.startButton.draw();
    this.createPieceButton.draw();
    this.menuButtons.push(this.startButton, this.createPieceButton);
};

var menuscreen = new TetrisMenuScreen();
//var buttonsArray = menuscreen.getMenuButtons();
var isMenu = true;



function updateListeners(identifier){
    
    //Switch back to the default cursor
    document.body.style.cursor = "default";

    //To remove the "invisible" button, so users can no longer see the cursor changes
    gameCanvas.removeEventListener("mousemove", checkMousePosition,  false);

    //To disable the mouse click on the "invisible" button
    if(identifier == "Start Game")
        gameCanvas.removeEventListener("click", setupGame, false);
    else if(identifier = "Create Piece")
        gameCanvas.removeEventListener("click", setUpPiece, false);
    else
        gameCanvas.removeEventListener("click", checkPieces, false);
    
    //Clear the screen
    gameContext.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function getStartingButtonRowIndex(buttonArray){
    
    for(var i = 0; i < buttonArray.length; i++ ){
        for (var j = 0; j < buttonArray[0].length; j++){
            var button = buttonArray[i][j];
            if(button.isClicked())
                return i;
        }
    }  
    return 0;
}

function createUserPiece(){
    
    var pieceArray =  [[0,0,0],
                       [0,0,0],
                       [0,0,0]
                      ];
    
    
    var userPieceArray = menuscreen.getPieceButtons();
    var buttonArray = [];

    var k = 0;
    
    //makes the buttonArray a 2D array for better readability 
    for(var i = 0; i < pieceArray.length; i++ ){
        var rowButton = [];
        for (var j = 0; j < pieceArray[0].length; j++){
            rowButton.push(userPieceArray[k]);
            k++;
        }
        buttonArray.push(rowButton);
    } 

    var rowStart = getStartingButtonRowIndex(buttonArray);
    var end = rowStart;
    
    for(var i = 0; i < buttonArray.length - end; i++){
        for(var j = 0; j < buttonArray[0].length; j++){
            pieceArray[i][j] = buttonArray[rowStart][j].isClicked() ? 1 : 0;
        }
        rowStart++;
    }

    userPivot = generatePivot(pieceArray);    
    
    function USER_PIECE(){

        this.piece = [[0,0,0],
                      [0,0,0],
                      [0,0,0]
                     ];

        //No shallow copying 
        for(var i = 0; i < pieceArray.length; i++ ){
            for (var j = 0; j < pieceArray[0].length; j++){
                this.piece[i][j] = pieceArray[i][j];
            }
        }
    };   
    USER_PIECE.prototype = new TetrisPiece(6, userPivot.getX(), userPivot.getY());
    return new USER_PIECE();        
};

//Finds a suitable pivot for the user Tetris piece
function generatePivot(buttonArray){

    var value = buttonArray.length;
    var centerIndex = Math.floor(value/2); //1
    
    var centerPoint = buttonArray[centerIndex][centerIndex];
    var leftMiddle = buttonArray[centerIndex][0];
    var topMiddle = buttonArray[0][centerIndex];
    var rightMiddle = buttonArray[centerIndex][value-1];
    var bottomMiddle = buttonArray[value-1][centerIndex];

    var leftTdiagonal = buttonArray[0][0];
    var rightTdiagonal = buttonArray[0][value-1];
    var rightBdiagonal = buttonArray[value-1][value-1];
    var leftBdiagonal = buttonArray[value-1][0];

    //Sets the pivot to be the center
    if(centerPoint == 1)
        return new Point(centerIndex, centerIndex);
    else if(leftMiddle == 1){
        return new Point(centerIndex, 0);
    }
    else if(topMiddle  == 1){
        return new Point(0, centerIndex);
    }
    else if(rightMiddle  == 1){
        return new Point(centerIndex, value - 1);
    }
    else if(bottomMiddle  == 1){
        return new Point(value -1, centerIndex);
    }
    else if(leftTdiagonal  == 1){
        return new Point(0, 0);
    }
    else if(rightTdiagonal  == 1){
        return new Point(0, value-1);
    }
    else if(rightBdiagonal  == 1){
        return new Point(value-1, value -1);
    }
    else
        return new Point(value - 1, 0);
}

function setupGame(){
    
    updateListeners("Start Game");
    
    var tg = new TetrisGame();
    tg.setScoreBoard();
//    tg.addUserPiece(createUserPiece());
    tg.startGame();
    
    /*Looks for user arrow key inputs*/
    
    function keyListener(keyevent){

        var model = tg.getModel();
        var piece = tg.getPiece();
        var view =  tg.getView();      
        
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
        view.displayBoard(ROW_OFFSET, model.getBoard(), gameContext);
    };

    //Add the keyListener for keyboard input
    document.addEventListener('keydown', keyListener);
    //tg.run();
};


function setUpPiece(){
    definedCreatePiece = true;
    updateListeners("Create Piece");
    menuscreen.createPieces();
    isMenu = false;
    gameCanvas.addEventListener("mousemove", checkMousePosition, false);
    
};



function checkMousePosition(e){
    var rect = gameCanvas.getBoundingClientRect();
    
    //http://stackoverflow.com/questions/17130395/canvas-html5-real-mouse-position
    //Get the x and y positions of the mouse on the Canvas with the offset to webpage
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    
    var buttonsArray;
    var cursorIsIn = false;
    
    if(isMenu)
        buttonsArray  = menuscreen.getMenuButtons();
    else
        buttonsArray = menuscreen.getPieceButtons();
    
        
    for(var i = 0; i < buttonsArray.length; i++){
        var myButton = buttonsArray[i];        
        if(myButton.containsMousePoint(x,y)){
            if(!myButton.isClicked())
                myButton.changeHover(true);            
            if(myButton.isStartButton())
                gameCanvas.addEventListener("click", setupGame, false);
            else if(myButton.isCreatePieceButton() ){
                gameCanvas.addEventListener("click", setUpPiece, false);
            }
            cursorIsIn = true;
        }
        else{
            if(myButton.isStartButton()){
                gameCanvas.removeEventListener("click", setupGame, false);
            }
            else if(myButton.isCreatePieceButton()){
               gameCanvas.removeEventListener("click", setUpPiece, false);
            }
            myButton.changeHover(false);    
        }
        myButton.draw();
    }
    
    if(cursorIsIn)
        document.body.style.cursor = "pointer";
    else
        document.body.style.cursor = "default"
    
};

function checkMouseClick(e){
    var rect = gameCanvas.getBoundingClientRect();            
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;    
    var buttonsArray = menuscreen.getPieceButtons();;
    
    for(var i = 0; i < buttonsArray.length; i++){
        var myButton = buttonsArray[i];
        
        if(myButton.containsMousePoint(x,y)){
         //   console.log(myButton.getXCoord() + " " + myButton.getYCoord());
            myButton.changeClick();
           // console.log(myButton.isClicked());
        }
        myButton.draw();
    }   
};

                
gameCanvas.addEventListener("mousemove", checkMousePosition, false);
gameCanvas.addEventListener("click", checkMouseClick, false);
