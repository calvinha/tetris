
var ROWS = 20;
var COLUMNS = 10;
var ROW_OFFSET = 4;

var COLORS = ["red", "blue", "green", "plum", "purple", "skyblue", "springgreen"];

function Point(x, y){
    
    this.x = x || 0;
    this.y = y || 0;
    
    Point.prototype.x = null;
    Point.prototype.y = null;
    
    Point.prototype.add = function(v){
        return new Point(this.x + v.x, this.y + v.y);
    };

    Point.prototype.subtract = function(v){
        return new Point(this.x - v.x, this.y - v.y);
    };
    
    Point.prototype.equals = function(toCompare){
        return this.x == toCompare.getX() && this.y == toCompare.getY();
    };
    
    Point.prototype.toString = function(){
        return "(x=" + this.x + ", y=" + this.y + ")";
    };

    Point.prototype.clone = function(){
        return new Point(this.x, this.y);
    };

    Point.prototype.getX = function(){
        return this.x;  
    };
    
    Point.prototype.getY = function(){
        return this.y;  
    };
    Point.prototype.addY = function(){
        this.y += 1;
    };
    Point.prototype.subtractY = function(){
        this.y -= 1;
    };
    Point.prototype.addX = function(){
        this.x += 1;
    };
    Point.prototype.addRight = function(amount){
        this.y += amount;
    };
    
    Point.prototype.addDown = function(amount){
        this.x += amount;
    };
        
    Point.prototype.stop = function(){
        this.x = ROWS + ROW_OFFSET -1;
    };

    Point.prototype.setX = function(value){
        this.x = value;
    };

};



function TetrisPiece (colorIndex,  x , y){
    this.colorIndex = colorIndex;
    
    if(x != undefined && y != undefined){
        this.pivot = new Point(x, y);
        this.x = x;
        this.y = y;
    }
    else{
        this.pivot = undefined; //for the O_Piece
    }
    
    this.pointsArray = [];
    this.displayArray = [];
    this.counterClockArray = [[0, 1],[-1, 0]];
    this.setDisplay = false;
    this.filled = false;
    

    //To move the tetris piece
    //This function also checks if the move is valid
    TetrisPiece.prototype.move = function(direction, board){

        var tempArray = [];
        var changedPivot = false;
        var tempPivot;
        
        
        for(var i = 0; i < this.pointsArray.length; i++){
            var tempPoint = this.pointsArray[i].clone(); //deep copy 
            var pastPoint = tempPoint.clone(); 

            switch (direction){
            case "left":
                tempPoint.subtractY(); break;
            case "right":
                tempPoint.addY(); break;
            default:
                tempPoint.addX();
            }
            
            
            //If the piece is out of bounds, don't update the points 
            if(!this.isInBounds(tempPoint) ){ 
                return;
            }
            
            var position = board[tempPoint.getX()][tempPoint.getY()];
            //the position has a piece at that location on the board so the point is invalid
            if(position >= 0)
                return;
            
            tempArray.push(tempPoint);

            //To store the correct pivot for change at the end 
            if(this.pivot != undefined && pastPoint.equals(this.pivot) && !changedPivot){
                changedPivot = true;
                tempPivot = tempPoint;
            }
        }

        //update all the points for the tetris piece because all the points are in a vaild location 
        this.updatePoints(tempArray);
        this.pivot = tempPivot; //change the pivot        
    }

    
    TetrisPiece.prototype.rotateCounterClock = function(board){
        var matrix = this.counterClockArray;

        if(this.pivot == undefined){
            return;
        }
        

        var tempArray = [];

        //Loop to check if the points after the rotation are valid
        for(var i = 0; i < this.pointsArray.length; i++){
            var tempPoint = this.pointsArray[i].clone(); //deep copy
            if(!tempPoint.equals(this.pivot)){
                var pointResult = this.pivot.subtract(tempPoint);

                var x = matrix[0][0]*pointResult.getX() + matrix[0][1]*pointResult.getY();
                var y = matrix[1][0]*pointResult.getX() + matrix[1][1]*pointResult.getY();
                var pointTransformed = new Point(x, y);
                var newPoint = this.pivot.add(pointTransformed);

                if(!this.isInBounds(newPoint)){
                    return;
                }
                
                var position = board[newPoint.getX()][newPoint.getY()];
                //the position has a piece at that location on the board so the point is invalid
                if(position >= 0){
                    return;
                }
                
                tempArray.push(newPoint);
            }
        }


        //All the points are vaild, so update the points to the pointsArray
        var pointsArrayIndex = 0;

        for(var i = 0; i < tempArray.length; i++){
            var point = this.pointsArray[pointsArrayIndex];
            var otherPoint = tempArray[i];
            if(!point.equals(this.pivot)){
                this.pointsArray[pointsArrayIndex] = otherPoint;
            }
            else{//post-increment to skip the pivot but still update the next point
                this.pointsArray[++pointsArrayIndex] = otherPoint;
            }
            pointsArrayIndex++;              
        }
    };

    TetrisPiece.prototype.dropPiece = function(board){
        var amount = ROWS+ROW_OFFSET; //set to the max value 
        var temp = ROWS+ROW_OFFSET;
        
        for(var i = 0; i < this.pointsArray.length; i++){
            
            var point = this.pointsArray[i]; //shallow copy
            var x = point.getX() + 1; //To get the next point
            var y = point.getY(); 
            var boardPoint = board[x][y];
            
            while( (x < (ROWS + ROW_OFFSET - 1)) && (boardPoint < 0)){                
                x++;
                boardPoint = board[x][y];
                temp = x;
            }
            if(temp == ROWS+ROW_OFFSET-1 && board[temp][y] < 0)//very important
               temp++;
            temp = temp - point.getX();
            if(temp <= amount){
                amount = temp - 1;                          
            }
        }

        for(var i = 0; i < this.pointsArray.length; i++){
            var point = this.pointsArray[i];
            point.addDown(amount);

        }
    };

    TetrisPiece.prototype.updatePoints = function(array){
        for(var i = 0; i < array.length; i++){
            this.pointsArray[i] = array[i];
        }
    };

    TetrisPiece.prototype.isInBounds = function(point){
        var widthBounds = point.getY() >= 0 && point.getY() < COLUMNS;
        var heightBounds = point.getX() < (ROWS+ROW_OFFSET) && point.getX() >= 0;
        return heightBounds && widthBounds;
    };

    //To detect if the piece in motion has hit the top of another piece
    TetrisPiece.prototype.detectBottomBound = function(board){

        for(var i = 0; i < this.pointsArray.length; i++){
            var point = this.pointsArray[i];

            var isAtBottom = point.getX() >= (ROWS + ROW_OFFSET) - 1; //boolean
            if(isAtBottom){
                return true;
            }
            var tempPoint = new Point(point.getX() + 1, point.getY());
            //If the tempPoint is not part of the tetris piece 
            if(!this.checkPoint(tempPoint)){
                var pointPosition = board[(point.getX() + 1)][point.getY()];
                //if the position of tempPoint is an actual piece
                if(pointPosition >= 0){
                    return true;                
                }
            }            
        }
        return false;
    };
    
    TetrisPiece.prototype.addPoint = function(point){
        this.pointsArray.push(point);
    };

    TetrisPiece.prototype.getPivot = function(){
        return this.pivot;
    };


    TetrisPiece.prototype.getColorIndex = function(){
        return this.colorIndex;
    };

    TetrisPiece.prototype.getPointsArray = function(){
        return this.pointsArray;
    }

    TetrisPiece.prototype.getCounterClock = function(){
        return this.counterClockArray;
    };

    
    //Add all the points to the pointsArray for movement later
    TetrisPiece.prototype.addAllPoints = function(){
        
        for(var i = 0; i < this.piece.length; i++){
            for(var j = 0; j < this.piece[0].length; j++){
                var temp = new Point(i, j);
                var isValidPoint = this.piece[i][j] == 1; //boolean
                
                if( isValidPoint){                
                    this.addPoint(temp);
                    this.displayArray.push(new Point(i, j));
                }                
            }
        }
    };

    //Sets the start position for any tetris piece so it starts in the "middle"
    TetrisPiece.prototype.setStartPosition = function(offset){

        var columnLength = this.piece[0].length;
        
        if(columnLength == undefined){
            columnLength = this.piece.length;
        }
        
        var shiftRight = Math.floor( (Math.abs ( (COLUMNS) - columnLength) /2) );
        
        if(this.toString() == "I Piece"){
            offset = 1;
        }
        
        for (var i = 0; i < this.pointsArray.length; i++){
            var point = this.pointsArray[i]; //shallow copy;
            point.addRight(shiftRight);
            point.addDown(offset);
        }
        if(this.pivot != undefined){ // the O_Piece does not have a pivot
            this.pivot.addRight(shiftRight);
            this.pivot.addDown(offset);
        }
    };

    TetrisPiece.prototype.getStructure = function(){
        return this.piece;
    };

    TetrisPiece.prototype.printAllPoints = function(){
        for(var i = 0; i < this.pointsArray.length; i++){
            document.write(this.pointsArray[i] + " ");
        }
    };

    //empties the array to remove shallow cloning for the next similar tetris piece
    TetrisPiece.prototype.emptyArray = function(){
        for(var i = this.pointsArray.length-1 ; i >= 0; i--){
            this.pointsArray.splice(i, 1);
            this.displayArray.splice(i, 1);
        }
    };

    TetrisPiece.prototype.setPivot = function(){
        if(this.pivot != undefined)
            this.pivot = new Point(this.x, this.y);
    };

    //Remember to call this function to reset the tetris piece to avoid
    //shallow cloning and also to add the pieces' points to it's points array
    TetrisPiece.prototype.resetPiece = function() {
        this.emptyArray();
        this.addAllPoints();
        this.setPivot();
    };

    //Checks if the point is in the array 
    TetrisPiece.prototype.checkPoint = function(point){
        for(var j = 0; j < this.pointsArray.length; j++){
            var otherPoint = this.pointsArray[j];
            if(point.equals(otherPoint)){
                return true;
            }
        }
        return false;
    };

    TetrisPiece.prototype.setDisplayPiece = function(board){
        //Columns and row length for the piece
        var columnLength = this.piece[0].length;
        var rowLength = this.piece.length;
        
        if(columnLength == undefined){
            columnLength = rowLength;
        }
            
        var shiftRight = Math.floor( (Math.abs ( (BLOCKS_PER_COLUMN) - columnLength) /2) );
        var shiftDown = Math.floor( (Math.abs ( (BLOCKS_PER_ROW) - rowLength) /2) );

            for(var i = 0; i < this.displayArray.length; i++){
                var point = this.displayArray[i]; //shallow copy
                point.addDown(shiftDown);
                point.addRight(shiftRight);
                board[point.getX()][point.getY()] = this.colorIndex;
            }
    };

    TetrisPiece.prototype.getDisplayArray = function(){
        return this.displayArray;
    };


};






Z_PIECE.prototype = new TetrisPiece(5, 0 ,1);

function Z_PIECE (){
    this.piece =  [[1,1,0],
                   [0,1,1]];    
    Z_PIECE.prototype.toString = function(){
        return "Z Piece";
    };

    
};

I_PIECE.prototype = new TetrisPiece(5, 1, 0);

function I_PIECE(){
    this.piece = [[1],
                  [1],
                  [1],
                  [1]];
    I_PIECE.prototype.toString = function(){
        return "I Piece";
    };

    /*The bottom function is for when the I piece starts out as a horizontal piece*/
    // I_PIECE.prototype.addAllPoints = function(){
    //     for(var i = 0; i < this.piece.length; i++){
            
    //         this.addPoint(new Point(0, i));
    //         this.displayArray.push(new Point(0, i));
    //     }
    // };
};

DOT_PIECE.prototype = new TetrisPiece(5, undefined, undefined);

function DOT_PIECE(){
    this.piece = [1];
    
    DOT_PIECE.prototype.addAllPoints = function(){
        for(var i = 0; i < this.piece.length; i++){
            this.addPoint(new Point(0, i));
            this.displayArray.push(new Point(0, i));
        }
    };
};

S_PIECE.prototype = new TetrisPiece(5, 0, 1);

function S_PIECE(){
    this.piece = [[0,1,1],
                  [1,1,0]];

    S_PIECE.prototype.toString = function(){
        return "S Piece";
    };
};

T_PIECE.prototype = new TetrisPiece(5, 1, 1);


function T_PIECE(){
    this.piece = [[0,1,0],
                  [1,1,1]];  

    T_PIECE.prototype.toString = function(){
        return "T Piece";
    };

    
};

J_PIECE.prototype = new TetrisPiece(5, 1, 1);

function J_PIECE(){
    this.piece = [[1,0,0],
                  [1,1,1]];
    
    
    J_PIECE.prototype.toString = function(){
        return "J Piece";
    };
    
};

L_PIECE.prototype = new TetrisPiece(5, 1, 1);

function L_PIECE(){
    this.piece = [[0,0,1],
                  [1,1,1]];
    

    L_PIECE.prototype.toString = function(){
        return "L Piece";
    };
};

O_PIECE.prototype = new TetrisPiece(5, undefined, undefined );

function O_PIECE(){
    this.piece = [[1,1],
                  [1,1]];

    O_PIECE.prototype.toString = function(){
        return "O Piece";
    };
};

U_PIECE.prototype = new TetrisPiece(6, 0, 2);

function U_PIECE(){
    this.piece = [[1,1,1],
                  [1,0,1],
                  [1,1,0]];
};






function TetrisBoard (){

    //To initialize the board with rows
    this.board = [ROWS + ROW_OFFSET];
    //Initialize the board with columns
    for(var i = 0; i < ROWS+ROW_OFFSET; i++){
        this.board[i] = [COLUMNS];
    }

    //Zero out the board
    for(var i = 0; i < ROWS + ROW_OFFSET; i++){
        for(var j = 0; j < COLUMNS; j++){
            this.board[i][j] = -1;
        }
    }

    //For
    this.miniBoard = [BLOCKS_PER_ROW];
    
    for(var i = 0; i < BLOCKS_PER_ROW; i++){
        this.miniBoard[i] = [BLOCKS_PER_COLUMN];
    }

    for(var i = 0; i < BLOCKS_PER_ROW; i++){
        for(var j = 0; j < BLOCKS_PER_COLUMN; j++){
            this.miniBoard[i][j] = -1;
        }
    }


    // for(var i = 0; i < COLUMNS; i++){
    //     var row = ROWS+ROW_OFFSET;
    //     if(i != 8){
    //         this.board[row-1][i] = 5;
    //         this.board[row-2][i] = 5;
    //         //this.board[ROWS-3][i] = 1;
    //         this.board[row-4][i] = 5;
    //     }
    // }

    // this.board[ROWS+ROW_OFFSET-3][3] = 5;
    // this.board[ROWS+ROW_OFFSET-3][2] = 5;
    // this.board[ROWS+ROW_OFFSET-3][1] = 5;
    //     this.board[ROWS+ROW_OFFSET-3][4] = 5;

    
    /*Print the board*/
    TetrisBoard.prototype.printBoard = function(){
        for(var i = 0 + ROW_OFFSET; i < ROWS + ROW_OFFSET; i++){
            for(var j = 0; j < COLUMNS; j++){
                value = this.board[i][j];
                if(value == -1)
                    document.write(""+ value + " ");
                else
                    document.write("-"+value + " ");
            }
            document.write("<br>");
        }
    };

    TetrisBoard.prototype.positionPiece = function(piece){

        var pointsList = piece.getPointsArray();        

        for(var i = 0; i < pointsList.length; i++){
            var tempPoint = pointsList[i];    
            var x = tempPoint.getX();

            var y = tempPoint.getY();
            this.board[x][y] = piece.getColorIndex();
        }
        
    };

    

    TetrisBoard.prototype.erasePath = function(piece, mainBoard){
        var pointsList;
        if(mainBoard)
            pointsList = piece.getPointsArray();
        else
            pointsList = piece.getDisplayArray();

        for(var i = 0; i < pointsList.length; i++){
            var point = pointsList[i];
            var x = point.getX();
            var y = point.getY();
            if(mainBoard)
                this.board[x][y] = -1;
            else
                this.miniBoard[x][y] = -1;
        }
    };

    TetrisBoard.prototype.getBoard = function(){
        return this.board;
    };

    TetrisBoard.prototype.checkRows = function(){

        for(var i = (ROWS + ROW_OFFSET - 1); i >= ROW_OFFSET; i--){
            if(this.isRowFull(i)){
                return i;
            }
        }
        return -1;
    };

    TetrisBoard.prototype.eliminateLines = function(start){
        //loop through the board starting at the bottom

        var clearedLines = false;
        var rowArray = [];
        
        for(var i = start; i >= (0 + ROW_OFFSET); i--){
            if(this.isRowFull(i)){
                rowArray.push(i);
            }
            else if(rowArray.length > 0){ //If there are some lines that need to be cleared
                this.clearLines(rowArray);
                linesCleared = linesCleared + rowArray.length; 
                rowArray = [];
                clearedLines = true;
                i = ROWS + ROW_OFFSET; //reset to start at the bottom again
            }
        }

        return clearedLines;
    };

    TetrisBoard.prototype.clearLines = function(rowArray){
        var firstFilledRow = rowArray[0];
        var lastFilledRow = rowArray[rowArray.length-1];

        var linesToClear = (firstFilledRow- lastFilledRow) + 1;
        var startRow = lastFilledRow - 1;        
        var targetRow = firstFilledRow;
        
        if(startRow < 0 + ROW_OFFSET){
            this.clearLinesNoShift(firstFilledRow, lastFilledRow);
        }
        
        for(var i = startRow; i >= (0 + ROW_OFFSET); i--){
            for(var j = 0; j < COLUMNS; j++){
                this.board[targetRow][j] = this.board[startRow][j];                
            }
            targetRow--;
            startRow--;
            if(startRow < (0 + ROW_OFFSET) ){
                this.clearLinesNoShift(targetRow, lastFilledRow);
            }
        }

        
    };

    TetrisBoard.prototype.clearLinesNoShift = function(firstFilledRow, lastFilledRow){
        for(var i = firstFilledRow; i >= lastFilledRow; i--){
            for(var j = 0; j < COLUMNS; j++){
                this.board[i][j] = -1;
            }
        }
    };

    TetrisBoard.prototype.isRowFull = function(row){
        for(var j = 0; j < COLUMNS; j++){
            if(this.board[row][j] < 0){
                return false;
            }
        }
        return true;
    };

    TetrisBoard.prototype.isGameOver = function(){


        for(var i = 0; i <= ROW_OFFSET; i++){
            for(var j = 0; j < COLUMNS; j++){
                if(this.board[i][j] >= 0){
                    return true;
                }
            }
        }
        return false;
    };

    TetrisBoard.prototype.getMiniBoard = function(){
        return this.miniBoard;
    };
};
