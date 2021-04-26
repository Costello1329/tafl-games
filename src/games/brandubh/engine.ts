import { Player, Figure, Position, Move, Engine } from "../../core/engine";



export enum BrandubhFigureType {
  warrior = "warrior",
  king = "king"
}

export class Brandubh extends Engine<BrandubhFigureType> {
  constructor () {
    super(
      7, 7, Player.black,
      (row: number, col: number): Figure<BrandubhFigureType> | null => {
        if (row !== 3 && col !== 3)
          return null;
        
        else if (row === 3 && col === 3)
          return { type: BrandubhFigureType.king, player: Player.white };
        
        const d: number = Math.abs((col === 3 ? row : col) - 3);
        
        if (d === 1)
          return { type: BrandubhFigureType.warrior, player: Player.white };

        else
          return { type: BrandubhFigureType.warrior, player: Player.black };
      }
    );
  }

  public readonly moves = (): Move[] => {
    let moves: Move[] = [];

    if (this._winner === null)
      this._board.forEach((_, i) => _.forEach((figure, j) => {
        if (figure !== null && figure.player === this._player)
          Brandubh._kDirections.forEach(({ dx, dy }) => {
            for (
              let pos: Position = { row: i + dy, col: j + dx };
              Brandubh._isValidPosition(pos) &&
              this._figureAt(pos) == null && (
                /// Corner pieces must be accessible only for the king
                figure.type === BrandubhFigureType.king ||
                !Brandubh._isCornerPosition(pos)
              );
              pos.row += dy, pos.col += dx
            )
              moves.push({
                from: { row: i, col: j },
                to: { row: pos.row, col: pos.col }
              });
          });
      }));

    return moves;
  }

  /// Move should be validated before passing to the method.
  public readonly move = ({ from, to }: Move): void => {
    const figure: Figure<BrandubhFigureType> = this._figureAt(from)!;
    this._board[to.row][to.col] = figure;
    this._board[from.row][from.col] = null;

    /// Remove captured warriors:
    if (figure.type !== BrandubhFigureType.king) /// King can't capture
      Brandubh._kDirections.forEach(({ dx, dy }) => {
        const candidate: Position = { row: to.row + dy, col: to.col + dx };
        const oposing: Position = { row: to.row + 2 * dy, col: to.col + 2 * dx };

        if (
          /// Candidate should be a warrior of the other player:
          this._checkFigure(
            candidate,
            BrandubhFigureType.warrior,
            Brandubh._otherPlayer(figure.player)
          ) && (
            /// Oposing piece should be either a warrior of the same player or a corner:
            this._checkFigure(oposing, BrandubhFigureType.warrior, figure.player) ||
            Brandubh._isCornerPosition(oposing)
          )
        )
          this._board[candidate.row][candidate.col] = null;
      });

    const king: Position =
      this._board
        .map(_ => _.findIndex(figure => figure?.type === BrandubhFigureType.king))
        .map((col: number, row: number): Position => ({ row, col }))
        .filter(pos => Brandubh._isValidPosition(pos))[0];

    /// White wins
    if (
      /// king reached the corner
      (figure.type === BrandubhFigureType.king && Brandubh._isCornerPosition(to)) ||
      /// all black figures are death
      !this._board.some(_ => _.some(figure => figure?.player === Player.black))
    )
      this._winner = Player.white;

    /// Black wins
    else if (
      Brandubh._kDirections
        .map(({ dx, dy }): Position => ({ row: king.row + dy, col: king.col + dx }))
        .every((candidate: Position): boolean =>
          !Brandubh._isValidPosition(candidate) ||
          this._checkFigure(candidate, BrandubhFigureType.warrior, Player.black)
        )
    )
      this._winner = Player.black;
  
    this._player = Brandubh._otherPlayer(this._player);
  }

  private static readonly _isValidPosition =
    (position: Position): boolean =>
      position.row >= 0 && position.row < 7 &&
      position.col >= 0 && position.col < 7;

  private static readonly _isCornerPosition =
    (position: Position): boolean =>
      (position.col === 0 && position.row === 0) ||
      (position.col === 0 && position.row === 6) ||
      (position.col === 6 && position.row === 0) ||
      (position.col === 6 && position.row === 6);

  private readonly _figureAt =
    (position: Position): Figure<BrandubhFigureType> | null =>
      this._board[position.row][position.col];

  private readonly _checkFigure =
    (position: Position, type: BrandubhFigureType, player: Player): boolean => {
      if (!Brandubh._isValidPosition(position))
        return false;
      
      const figure: Figure<BrandubhFigureType> | null = this._figureAt(position);
  
      return (
        figure !== null &&
        figure.type === type &&
        figure.player === player
      );
    }

  private static readonly _otherPlayer =
    (player: Player) =>
      player === Player.white ? Player.black : Player.white;
  
  private static readonly _kDirections: { dx: number, dy: number }[] =
    [
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 }
    ];
}
