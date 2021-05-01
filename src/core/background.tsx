import React from "react";
import { View, Text, ColorValue } from "react-native";



interface SquareProps extends RowProps {
  col: number
}

export type SquareContentsProps = Pick<SquareProps, "size" | "row" | "col" | "width" | "height">;

const getLetter = (col: number): string =>
  String.fromCharCode("a".charCodeAt(0) + (col % 26)) + (col > 26 ? Math.floor(col / 1) : "");

const Square: React.FunctionComponent<SquareProps> =
  ({ size, width, height, row, col, firstColor, secondColor, SquareContents }: SquareProps) => {

    const color = (col + row) % 2 === 0 ? firstColor : secondColor;
    const textColor = (col + row) % 2 === 0 ? secondColor : firstColor;

    return (
      <View style={{
        flex: 1,
        padding: 4,
        justifyContent: "space-between"
      }}>
        <View style={{
          backgroundColor: color,
          position: "absolute",
          width: size,
          height: size
        }}>
          <SquareContents size={size} row={row} col={col} width={width} height={height}/>
        </View>
        <React.Fragment>
          <Text style={{
            opacity: col === 0 ? 1 : 0,
            color: textColor,
            fontWeight: "500"
          }}>
            {height - row}
          </Text>
          <Text style={{
            opacity: row === height - 1 ? 1 : 0,
            color: textColor,
            fontWeight: "500",
            justifyContent: "flex-end"
          }}>
            {getLetter(col)}
          </Text>
        </React.Fragment>
      </View>
    );
  };


interface RowProps extends BackgroundProps {
  row: number;
}

const Row: React.FunctionComponent<RowProps> =
  ({ size, width, height, row, firstColor, secondColor, SquareContents }: RowProps): JSX.Element =>
    <View style={{ flex: 1, flexDirection: "row" }}>{
      new Array<number>(width).fill(0).map((_, i) =>
        <Square
          size={size}
          width={width}
          height={height}
          key={`SQUARE-${row}-${i}`}
          row={row}
          col={i}
          firstColor={firstColor}
          secondColor={secondColor}
          SquareContents={SquareContents}
        />)
    }</View>;


export interface BackgroundSkin {
  firstColor: ColorValue,
  secondColor: ColorValue,
  SquareContents: React.FunctionComponent<SquareContentsProps>
}

interface BackgroundProps extends BackgroundSkin {
  size: number,
  width: number,
  height: number
}

export const Background: React.FunctionComponent<BackgroundProps> =
  ({ size, width, height, SquareContents, firstColor, secondColor } : BackgroundProps) =>
    <View style={{ flex: 1 }}>{
      new Array<number>(height).fill(0).map((_, i) =>
        <Row
          key={`ROW-${i}`}
          size={size}
          width={width}
          height={height}
          SquareContents={SquareContents}
          firstColor={firstColor}
          secondColor={secondColor}
          row={i}
        />
      )
    }</View>;
