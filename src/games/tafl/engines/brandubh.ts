import { Player, Figure } from "../../../core/engine";
import { TaflFigureType, TaflEngine } from "./main";
import { Vector, distanceLp, directions, sum, equal, product } from "../../../utils/vector";



export class BrandubhEngine extends TaflEngine {
  constructor () {
    super(
      7, /// Board size
      { moveDistance: 7 },
      { moveDistance: 7, canCapture: false, canReturnToThrone: false },
      (vec: Vector): Figure<TaflFigureType> | null => {
        const center: Vector = { x: 3, y: 3 };

        if (Math.floor(distanceLp(vec, center, 1)) === 0)
          return { type: TaflFigureType.king, player: Player.white };

        else if (Math.floor(distanceLp(vec, center, 1)) === 1)
          return { type: TaflFigureType.warrior, player: Player.white };

        else if ([
          ...directions.map((dir: Vector): Vector => sum(center, product(2, dir))),
          ...directions.map((dir: Vector): Vector => sum(center, product(3, dir)))
        ].find((correct: Vector) => equal(correct, vec)))
          return { type: TaflFigureType.warrior, player: Player.black };

        else
          return null;
      }
    );
  }

  public get name (): string { return "Brandubh"; }
}
