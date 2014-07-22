
var ROWS = 20;
var COLUMNS = 10;
var COLORS = ["red", "blue", "green", "plum", "purple", "skyblue", "springgreen"];
function Point(x, y){
    this.x = x || 0;
    this.y = y || 0;
    this.moveDown = 1;
    
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
        this.x += this.moveDown;
    };
    Point.prototype.addRight = function(amount){
        this.y += amount;
    };
    Point.prototype.stop = function(){
        this.x = ROWS-1;
    }

};

function TetrisPiece (colorIndex, pivot){
    this.colorIndex = colorIndex;
    this.pivot = pivot
    this.pointsArray = [];
    this.counterClockArray = [[0, 1],[-1, 0]];

    
    //To move the tetris piece
    //This function also checks if the move is valid
    TetrisPiece.prototype.move = function(direction){

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
            
            //If the movement is invalid don't update the points 
            if(!this.isInBounds(tempPoint)){
                return;
            }
            
            tempArray.push(tempPoint);

            //To store the correct pivot for change at the end 
            if(this.pivot != undefined && pastPoint.equals(this.pivot) && !changedPivot){
                changedPivot = true;
                tempPivot = tempPoint;
            }
        }

        //update all the points for the tetris piece
        this.updatePoints(tempArray);
        this.pivot = tempPivot; //change the pivot        
    }
    
    TetrisPiece.prototype.rotateCounterClock = function(){
        var matrix = this.counterClockArray;

        if(this.pivot == undefined){
            return;
        }

        for(var i = 0; i < this.pointsArray.length; i++){
            var point = this.pointsArray[i]; //shallow copy
            if(!point.equals(this.pivot)){
                var pointResult = this.pivot.subtract(point);

                var x = matrix[0][0]*pointResult.getX() + matrix[0][1]*pointResult.getY();
                var y = matrix[1][0]*pointResult.getX() + matrix[1][1]*pointResult.getY();
                var pointTransformed = new Point(x, y);
                this.pointsArray[i] = this.pivot.add(pointTransformed);

            }
        }
    };

    TetrisPiece.prototype.updatePoints = function(array){
        for(var i = 0; i < array.length; i++){
            this.pointsArray[i] = array[i];
        }
    };

    TetrisPiece.prototype.isInBounds = function(point){
        return point.getY() >= 0 && point.getY() < COLUMNS && point.getX() < ROWS;
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
                }
            }
        } 
    };

    //Sets the start position for any tetris piece so it starts in the middle
    TetrisPiece.prototype.setStartPosition = function(){
        var amountToShift = (COLUMNS-this.pointsArray.length)/2
        for (var i = 0; i < this.pointsArray.length; i++){
            var point = this.pointsArray[i]; //shallow copy;
            point.addRight(amountToShift);
        }
        if(this.pivot != undefined){ // the O_Piece does not have a pivot
            this.pivot.addRight(amountToShift);
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


};
         





Z_PIECE.prototype = new TetrisPiece(0, new Point(0,1));

function Z_PIECE (){
    this.piece =  [[1,1,0],
                   [0,1,1]];
    this.addAllPoints();
   
   
    Z_PIECE.prototype.toString = function(){
        return "Z Piece";
    };

};

I_PIECE.prototype = new TetrisPiece(1 ,new Point(0,1));

function I_PIECE(){
    this.piece = [1,1,1,1];

    for(var i = 0; i < this.piece.length; i++){
        this.addPoint(new Point(0, i));
    }
    
    I_PIECE.prototype.toString = function(){
        return "I Piece";
    };
};


S_PIECE.prototype = new TetrisPiece(2, new Point(0,1));

function S_PIECE(){
    this.piece = [[0,1,1],
                  [1,1,0]];
    this.addAllPoints();

    S_PIECE.prototype.toString = function(){
        return "S Piece";
    };
};

T_PIECE.prototype = new TetrisPiece(3, new Point(1,1));


function T_PIECE(){
    this.piece = [[0,1,0],
                  [1,1,1]];
    this.addAllPoints();

    T_PIECE.prototype.toString = function(){
        return "T Piece";
    };
};

J_PIECE.prototype = new TetrisPiece(4, new Point(1,1));

function J_PIECE(){
    this.piece = [[1,0,0],
                  [1,1,1]];
    this.addAllPoints();
    
    J_PIECE.prototype.toString = function(){
        return "J Piece";
    };
    
};

L_PIECE.prototype = new TetrisPiece(5, new Point(1,1));

function L_PIECE(){
    this.piece = [[0,0,1],
                  [1,1,1]];
    this.addAllPoints();

    L_PIECE.prototype.toString = function(){
        return "L Piece";
    };
};

O_PIECE.prototype = new TetrisPiece(6, undefined);

function O_PIECE(){
    this.piece = [[1,1],
                  [1,1]];
    this.addAllPoints();

    O_PIECE.prototype.toString = function(){
        return "O Piece";
    };
};


function TetrisBoard (){

    //To initialize the board with rows
    this.board = [ROWS];
    //Initialize the board with columns
    for(var i = 0; i < ROWS; i++){
        this.board[i] = [COLUMNS];
    }

    //Zero out the board
    for(var i = 0; i < ROWS; i++){
        for(var j = 0; j < COLUMNS; j++){
            this.board[i][j] = -1;
        }
    }

    /*Print the board*/
    TetrisBoard.prototype.printBoard = function(){
        for(var i = 0; i < ROWS; i++){
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

    TetrisBoard.prototype.erasePath = function(piece){

        var pointsList = piece.getPointsArray();
        for(var i = 0; i < pointsList.length; i++){
            var point = pointsList[i];
            var x = point.getX();
            var y = point.getY();
            this.board[x][y] = -1;
        }
    };

    TetrisBoard.prototype.getBoard = function(){
        return this.board;
    };

    TetrisBoard.prototype.movePieceDown = function(){
        
    };
    
};
