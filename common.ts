interface ICell{
    readonly row: number;
    readonly column: number;
    getSign(): string;
    setSign(value: string);
}

interface IBoard{
    readonly rows: number;
    readonly columns: number;
    readonly cells: ICell[][];
    print();
}

interface IPlayer{
    readonly name: string;
    readonly sign: string;
}

enum GameStatus{InProgress, Completed}

interface IGame{
    status: GameStatus;
    readonly board: IBoard;
    addPlayer(player: IPlayer);
    nextMove(row: number, column: number): boolean;
    printSummary();
}

export {GameStatus, ICell, IBoard, IPlayer, IGame};