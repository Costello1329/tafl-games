import { ObjectHelper } from "../utils/deepCopy";



export enum Player {
  white = "white",
  black = "black",
}

export interface Figure<FigureType> {
  type: FigureType
  player: Player;
}

export const otherPlayer =
  (player: Player): Player =>
    player === Player.white ? Player.black : Player.white;

type FieldCell<FigureType> = Figure<FigureType> | null;
type FieldRow<FigureType> = FieldCell<FigureType>[];
export type Field<FigureType> = FieldRow<FigureType>[];

export type FigurePlacer<FigureType> =
  (row: number, col: number) => FieldCell<FigureType>;


export interface Position {
  row: number,
  col: number
}

export interface Move {
  from: Position;
  to: Position;
}


interface BoardState<FigureType> {
  _winner: Player | null;
  _player: Player;
  _board: Field<FigureType>;
}


export abstract class Engine<FigureType> {
  constructor (
    width: number,
    height: number,
    initialPlayer: Player,
    placeFigure: FigurePlacer<FigureType>
  ) {
    this._width = width;
    this._height = height;

    this._initialState = {
      _winner: null,
      _player: initialPlayer,
      _board: Array(height).fill(0).map(_ => new Array(width).fill(null))
    };

    for (let i = 0; i < this._height; i ++)
      for (let j = 0; j < this._width; j ++)
        this._initialState._board[i][j] = placeFigure(i, j);

    /// Deep copy in order to copy the board
    this._state = ObjectHelper.deepCopy<BoardState<FigureType>>(this._initialState);

    this._undoStack = [];
    this._redoStack = [];
  }
  
  public abstract get name (): string;

  public abstract get moves (): Move[];
  public abstract readonly move: (_: Move) => void;
  
  public get board (): Field<FigureType> { return this._state._board; }
  public get player (): Player { return this._state._player; }
  public get winner (): Player | null { return this._state._winner; }
  
  public get width (): number { return this._width; }
  public get height (): number { return this._height; }

  public readonly restart = () => {
    /// Deep copy in order to copy the board
    this._state = ObjectHelper.deepCopy<BoardState<FigureType>>(this._initialState);
    this._undoStack = [];
    this._redoStack = [];
  };

  public get canUndo (): boolean { return this._undoStack.length > 0; }
  public get canRedo (): boolean { return this._redoStack.length > 0; }

  public readonly undo = (): void => this._shiftStacks(this._redoStack, this._undoStack);
  public readonly redo = (): void => this._shiftStacks(this._undoStack, this._redoStack);

  protected readonly _setWinner = (winner: Player) => this._state._winner = winner;
  protected readonly _nextPlayer = () => this._state._player = otherPlayer(this._state._player);

  /// IMPORTANT: you must call this method inside the move() method of the child
  protected readonly _supportUndoRedo = (): void => {
    this._redoStack = [];
    this._undoStack.push(ObjectHelper.deepCopy<BoardState<FigureType>>(this._state));
  };

  private readonly _shiftStacks = (
    toPush: Array<BoardState<FigureType>>,
    toPop: Array<BoardState<FigureType>>
  ): void => {
    if (toPop.length !== 0) {
      toPush.push(this._state);
      this._state = toPop.pop()!;
    }
  };

  private _width: number;
  private _height: number;

  private _initialState: BoardState<FigureType>
  private _state: BoardState<FigureType>;

  private _undoStack: Array<BoardState<FigureType>>;
  private _redoStack: Array<BoardState<FigureType>>;
}
