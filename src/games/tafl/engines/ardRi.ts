import { Player, Figure } from "../../../core/engine";
import { TaflFigureType, TaflEngine } from "./main";
import {
  directions,
  distanceLInf,
  distanceLp,
  product,
  sum,
  Vector
} from "../../../utils/vector";



export class ArdRiEngine extends TaflEngine {
  constructor () {
    super(
      7, /// Board size
      { moveDistance: 1 }, /// Warriors settings
      { moveDistance: 1, canCapture: true, canReturnToThrone: true }, /// King settings
      (vec: Vector): Figure<TaflFigureType> | null => {
        const center: Vector = { x: 3, y: 3 };

        if (distanceLInf(vec, center) === 0)
          return { type: TaflFigureType.king, player: Player.white };

        else if (distanceLInf(vec, center) === 1)
          return { type: TaflFigureType.warrior, player: Player.white };

        else if (
          directions
            .map((dir: Vector): Vector => sum(center, product(3, dir)))
            .map((attractor: Vector): number => distanceLp(attractor, vec, 1))
            .map((distanceToAttractor: number): boolean => Math.round(distanceToAttractor) <= 1)
            .some((matched: boolean): boolean => matched)
        )
          return { type: TaflFigureType.warrior, player: Player.black };

        else
          return null;
      }
    );
  }

  public get name (): string { return "ArdRí"; }
}
