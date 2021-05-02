import { Vector, directions, product, distanceLp, makeVector, sum } from "../../../utils/vector";
import { ObjectHelper } from "../../../utils/deepCopy";
import {
  Player,
  Figure,
  Move,
  Engine,
  otherPlayer,
  FigurePlacer
} from "../../../core/engine";



export enum TaflFigureType {
  warrior = "warrior",
  king = "king"
}

export interface KingSetup {
  moveDistance: number,
  canCapture: boolean,
  canReturnToThrone: boolean
};

export interface WarriorSetup {
  moveDistance: number,
};

export abstract class TaflEngine extends Engine<TaflFigureType> {
  constructor (
    size: number,
    warriorSetup: WarriorSetup,
    kingSetup: KingSetup,
    figurePlacer: FigurePlacer<TaflFigureType>
  ) {
    super(size, size, Player.black, figurePlacer);
    this._warriorSetup = warriorSetup;
    this._kingSetup = kingSetup;
    this._size = size;
  }

  public get moves (): Move[] {
    let moves: Move[] = [];

    if (this.winner === null)
      this.board.forEach((_, i) => _.forEach((figure, j) => {
        if (figure !== null && figure.player === this.player)
          directions.forEach((dir: Vector) => {
            for (
              let pos: Vector = sum(makeVector(j, i), dir);
              Math.round(distanceLp(pos, makeVector(j, i), 1)) <= (
                figure.type === TaflFigureType.king ?
                this._kingSetup :
                this._warriorSetup
              ).moveDistance &&
              this._isValidPosition(pos) &&
              this._figureAt(pos) == null && (
                /// Corner pieces must be accessible only for the king
                figure.type === TaflFigureType.king ||
                !this._isCornerPosition(pos)
              );
              pos = sum(pos, dir)
            )
              if (
                pos.x !== Math.floor(this._size / 2) ||
                pos.y !== Math.floor(this._size / 2) ||
                (figure.type === TaflFigureType.king && this._kingSetup.canReturnToThrone)
              )
                moves.push({
                  from: makeVector(j, i),
                  to: ObjectHelper.deepCopy(pos)
                });
          });
      }));

    return moves;
  }

  public readonly move = ({ from, to }: Move): void => {
    this._supportUndoRedo();

    const figure: Figure<TaflFigureType> = this._figureAt(from)!;
    this.board[to.y][to.x] = figure;
    this.board[from.y][from.x] = null;

    /// Remove captured warriors:
    if (figure.type !== TaflFigureType.king || this._kingSetup.canCapture)
      directions.forEach((dir: Vector) => {
        const candidate: Vector = sum(to, dir);
        const oposing: Vector = sum(to, product(2, dir));

        if (
          /// Candidate should be a warrior of the other player:
          this._checkFigure(
            candidate,
            TaflFigureType.warrior,
            otherPlayer(figure.player)
          ) && (
            /// Oposing piece should be either a warrior, king (if he can capture) or a corner:
            this._checkFigure(oposing, TaflFigureType.warrior, figure.player) || (
              this._checkFigure(oposing, TaflFigureType.king, figure.player) &&
              this._kingSetup.canCapture
            ) || this._isCornerPosition(oposing)
          )
        )
          this.board[candidate.y][candidate.x] = null;
      });

    const king: Vector =
      this.board
        .map(_ => _.findIndex(figure => figure?.type === TaflFigureType.king))
        .map((x: number, y: number): Vector => ({ x, y }))
        .filter((vec: Vector) => this._isValidPosition(vec))[0];

    /// White wins, king reached the corner
    if (figure.type === TaflFigureType.king && this._isCornerPosition(to))
      this._setWinner(Player.white);

    /// Black wins, king captured
    else if (
      directions
        .map((dir: Vector): Vector => sum(king, dir))
        .every((candidate: Vector): boolean =>
          !this._isValidPosition(candidate) ||
          this._checkFigure(candidate, TaflFigureType.warrior, Player.black)
        )
    )
      this._setWinner(Player.black);

    this._nextPlayer();

    /// No moves after this move => currentPlayer wins
    if (this.winner === null && this.moves.length === 0)
      this._setWinner(otherPlayer(this.player))
  }

  private readonly _isValidPosition =
    (position: Vector): boolean =>
      position.y >= 0 && position.y < this.height &&
      position.x >= 0 && position.x < this.width;

  private readonly _isCornerPosition =
    (position: Vector): boolean =>
      (position.x === 0 && position.y === 0) ||
      (position.x === 0 && position.y === this.height - 1) ||
      (position.x === this.width - 1 && position.y === 0) ||
      (position.x === this.width - 1 && position.y === this.height - 1);

  private readonly _figureAt =
    (position: Vector): Figure<TaflFigureType> | null =>
      this.board[position.y][position.x];

  private readonly _checkFigure =
    (position: Vector, type: TaflFigureType, player: Player): boolean => {
      if (!this._isValidPosition(position))
        return false;
      
      const figure: Figure<TaflFigureType> | null = this._figureAt(position);
  
      return (
        figure !== null &&
        figure.type === type &&
        figure.player === player
      );
    }

  private readonly _size: number;
  private readonly _warriorSetup: WarriorSetup;
  private readonly _kingSetup: KingSetup;
}
