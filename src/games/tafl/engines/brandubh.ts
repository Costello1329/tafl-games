import { Player, Figure } from "../../../core/engine";
import { TaflFigureType, TaflEngine } from "./main";
import { Vector, distanceLp, distanceRook, directions, sum, product } from "../../../utils/vector";



export class BrandubhEngine extends TaflEngine {
  constructor () {
    super(
      7, /// Board size
      { moveDistance: 7 }, /// Warriors settings
      { moveDistance: 7, canCapture: true, canReturnToThrone: false }, /// King settings
      (vec: Vector): Figure<TaflFigureType> | null => {
        const center: Vector = { x: 3, y: 3 };
        const d = distanceRook(vec, center);

        if (distanceLp(vec, center, 1) === 0)
          return { type: TaflFigureType.king, player: Player.white };

        else if (d === 1)
          return { type: TaflFigureType.warrior, player: Player.white };

        else if (d >= 2)
          return { type: TaflFigureType.warrior, player: Player.black };

        else
          return null;
      }
    );
  }

  public get name (): string { return "Brandubh"; }
}
