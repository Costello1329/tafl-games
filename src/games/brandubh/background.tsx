import { SquareType, GetSquareType } from "../../core/background";



export const getBrandubhSquareType: GetSquareType =
  (row: number, col: number): SquareType =>
    (
      (row === 3 && col === 3) ||
      (row === 0 && col === 0) ||
      (row === 0 && col === 6) ||
      (row === 6 && col === 0) ||
      (row === 6 && col === 6)
    ) ? SquareType.Cross : SquareType.Normal;
