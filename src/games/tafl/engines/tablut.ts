import { Player, Figure } from "../../../core/engine";
import { TaflFigureType, TaflEngine } from "./main";
import {
  directions,
  distanceLInf,
  distanceLp,
  product,
  sum,
  distanceRook,
  Vector
} from "../../../utils/vector";



export class TablutEngine extends TaflEngine {
  constructor () {
    super(
      9, /// Board size
      { moveDistance: 9 }, /// Warriors settings
      { moveDistance: 9, canCapture: true, canReturnToThrone: false }, /// King settings
      (vec: Vector): Figure<TaflFigureType> | null => {
        const center: Vector = { x: 4, y: 4 };

        if (distanceLp(vec, center, 1) === 0)
          return { type: TaflFigureType.king, player: Player.white };

        else if (
          directions
            .map((dir: Vector): Vector => sum(center, product(4, dir)))
            .some((attractor: Vector): boolean => distanceLp(attractor, vec, 1) <= 1)
        )
          return { type: TaflFigureType.warrior, player: Player.black };

        else if (distanceRook(vec, center) > 0)
          return { type: TaflFigureType.warrior, player: Player.white };

        else
          return null;
      }
    );
  }

  public get name (): string { return "Tablut"; }
}
