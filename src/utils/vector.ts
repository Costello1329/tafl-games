export type Vector = { x: number, y: number };

export const makeVector = (x: number, y: number) => ({ x, y });

export const equal =
  (first: Vector, second: Vector): boolean =>
    first.x === second.x && first.y === second.y;

export const sum =
  (first: Vector, second: Vector): Vector =>
    ({ x: first.x + second.x, y: first.y + second.y });

export const product =
  (num: number, vec: Vector): Vector =>
    ({ x: num * vec.x, y: num * vec.y });

export const directions: Vector[] =
  [
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ];

export const distanceLInf =
  (first: Vector, second: Vector) =>
    Math.max(Math.abs(first.x - second.x), Math.abs(first.y - second.y));

export const distanceLp =
  (first: Vector, second: Vector, p: number) => {
    let res = Math.pow(
      Math.abs(Math.pow(first.x - second.x, p)) +
        Math.abs(Math.pow(first.y - second.y, p)),
      1 / p
    );

    if (p === 1)
      res = Math.floor(res);

    return res;
  }
  
export const distanceRook =
  (first: Vector, second: Vector) =>
    (first.x === second.x || first.y === second.y) ? distanceLp(first, second, 1) : 0;