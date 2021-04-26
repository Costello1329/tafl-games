export enum Player {
  white = "white",
  black = "black",
}

export interface Figure<FigureType> {
  type: FigureType
  player: Player;
}

type FieldCell<FigureType> = Figure<FigureType> | null;
type FieldRow<FigureType> = FieldCell<FigureType>[];
export type Field<FigureType> = FieldRow<FigureType>[];

export interface Position {
  row: number,
  col: number
}

export interface Move {
  from: Position;
  to: Position;
}

export abstract class Engine<FigureType> {
  constructor (
    width: number,
    height: number,
    initialPlayer: Player,
    placeFigure: (row: number, col: number) => FieldCell<FigureType>
  ) {
    this._player = initialPlayer;
    this._winner = null;

    this._board = Array(height).fill(0).map(_ => new Array(width).fill(null));

    for (let i = 0; i < height; i ++)
      for (let j = 0; j < width; j ++)
        this._board[i][j] = placeFigure(i, j)
  }

  public abstract readonly moves: () => Move[];
  public abstract readonly move: (_: Move) => void;
  
  public readonly board = (): Field<FigureType> => this._board;
  public readonly player = (): Player => this._player;
  public readonly winner = (): Player | null => this._winner;

  protected _winner: Player | null;
  protected _player: Player;
  protected _board: Field<FigureType>;
}
