import * as entities from './common';

class Cell implements entities.ICell{
    private sign:string = null;
    
    readonly row: number;
    readonly column: number;

    constructor(row: number, column: number){
        this.row = row;
        this.column = column;
    }

    getSign(): string{
        return this.sign;
    }
    
    setSign(value: string){
        if(!this.sign){this.sign = value;}
    }
}

class Board implements entities.IBoard{
    readonly rows: number;
    readonly columns: number;
    readonly cells: entities.ICell[][];

    constructor(rows: number, columns: number){
        this.rows = rows;
        this.columns = columns;

        this.cells = new Array<Cell[]>(rows);
        for(let r = 0; r< this.cells.length; r++)
        {
            this.cells[r] = new Array<Cell>(columns);
            for(let c = 0; c < this.cells[r].length; c++)
            {
                this.cells[r][c] = new Cell(r, c);
            }
        }
        
    }

    print(){
        for(let r of this.cells)
        {
            let row: string = `|${r.map((c)=>{
                let sign: string = c.getSign();
                return sign ? `_${sign}_` : "___";
            }).join("|")}|`;
            
            console.log(`${row}`);
        }
    }
}

class Player implements entities.IPlayer{
    readonly name: string;
    readonly sign: string;
    constructor(name: string, sign: string){
        this.name = name;
        this.sign = sign;
    }
}

class Game implements entities.IGame{
    status : entities.GameStatus;
    readonly board: entities.IBoard;
    private gameStatus: entities.GameStatus;
    private readonly winCount: number;
    private readonly maxPlayers: number;
    private players: entities.IPlayer[] = new Array<entities.IPlayer>();
    private playerIndex?:number = null;
    private log : string[] = new Array<string>();

    constructor(rows: number, columns: number){
        this.board = new Board(rows, columns);
        this.winCount = Math.min(rows, columns);
        this.maxPlayers = 2;
        this.status = entities.GameStatus.InProgress;
    }

    addPlayer(player: entities.IPlayer){
        
        if(this.players.length < this.maxPlayers){
            this.players.push(player);
            if(!this.playerIndex){this.playerIndex = 0;}
        }
    }

    nextMove(row: number, column: number): boolean{
        
        let cell = this.board.cells[row][column];
        if(cell.getSign() || this.status === entities.GameStatus.Completed){
            return false;
        }

        cell.setSign(this.players[this.playerIndex].sign);
        this.log.push(`${this.players[this.playerIndex].name}(${this.players[this.playerIndex].sign}): row:${cell.row} ; column:${cell.column}`);

        if(this.chainFull(cell)){
            this.status = entities.GameStatus.Completed;
        }
        else{
            this.playerIndex = this.playerIndex < this.players.length - 1 ? this.playerIndex + 1 : 0;
        }

        return false;
    }
    
    printSummary(){
        
        if(this.status === entities.GameStatus.Completed){
            console.log(`${this.players[this.playerIndex].name} won!`);
        }
        else if(this.status === entities.GameStatus.InProgress){
            console.log("Game is in progress");
        }
        if(this.log.length > 0){
            console.log("+--History--------------------------------------+");
            for(let record of this.log){
                console.log(record);
            }
            console.log("+-----------------------------------------------+");
        }
    }

    private chainFull(cell: entities.ICell) : boolean{

        if(this.getColumnChain(cell) >= this.winCount){
            return true;
        }
        if(this.getRowChain(cell) >= this.winCount){
            return true;
        }
        if(this.getLeftTop2RightBottomDiagonalChain(cell) >= this.winCount){
            return true;
        }
        if(this.getRightTop2LeftBottomDiagonalChain(cell) >= this.winCount){
            return true;
        }

        return false;
    }

    private getRowChain(cell: entities.ICell) : number{

        let length = 1;
        let column = cell.column;

        if(column < this.board.columns){
            column++;
            while(column < this.board.columns && this.board.cells[cell.row][column].getSign() == cell.getSign()){
                length++;
                column++;
            }
        }

        column = cell.column;
        
        if(column > 0){
            column--;
            while(column >= 0 && this.board.cells[cell.row][column].getSign() == cell.getSign()){
                length++;
                column--;
            }
        }
        
        return length;
    }

    private getColumnChain(cell: entities.ICell) : number{
        
        let length = 1;
        let row = cell.row;
        
        if(row < this.board.rows){
            row++;
            while(row < this.board.rows && this.board.cells[row][cell.column].getSign() == cell.getSign()){
                length++;
                row++;
            }
        }

        row = cell.row;
        if(row > 0){
            row--;
            while(row >= 0 && this.board.cells[row][cell.column].getSign() == cell.getSign()){
                length++;
                row--;
            }
        }

        return length;
    }

    private getLeftTop2RightBottomDiagonalChain(cell: entities.ICell) : number{
        let length = 1;
        let column = cell.column;
        let row = cell.row;
        
        if(row > 0 && column > 0){
            
            column--;
            row--;
            
            while(row >= 0 && column >= 0 
                && this.board.cells[row][column].getSign() == cell.getSign()){
                length++;
                column--;
                row--;
            }
        }

        column = cell.column;
        row = cell.row;

        if(row < this.board.rows - 1 && column < this.board.columns - 1){
            column++;
            row++;

            while(row < this.board.rows && column < this.board.columns
                && this.board.cells[row][column].getSign() == cell.getSign()){
                length++;
                column++;
                row++;
            }
        }

        return length;
    }

    private getRightTop2LeftBottomDiagonalChain(cell: entities.ICell) : number{
        let length = 1;

        let column = cell.column;
        let row = cell.row;
        
        if(row >= 0 && column < this.board.columns - 1){
            
            column++;
            row--;
            
            while(row >= 0 && column < this.board.columns 
                && this.board.cells[row][column].getSign() == cell.getSign()){
                length++;
                column++;
                row--;
            }
        }

        column = cell.column;
        row = cell.row;

        if(row < this.board.rows - 1  && column > 0){
            column--;
            row++;

            while(row < this.board.rows && column >=0
                && this.board.cells[row][column].getSign() == cell.getSign()){
                length++;
                column--;
                row++;
            }
        }
        
        return length;
    }
}

export {Cell, Board, Player, Game};
