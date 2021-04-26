import React from "react";
import { View, Text, ColorValue } from "react-native";



interface SquareProps extends RowProps {
  col: number;
}

const Square: React.FunctionComponent<SquareProps> =
  ({ width, height, row, col }: SquareProps) => {
    const white: ColorValue = "rgb(100, 133, 68)";
    const black: ColorValue = "rgb(230, 233, 198)";

    return (
      <View style={{
        flex: 1,
        backgroundColor: (col + row) % 2 ? white : black,
        padding: 4,
        justifyContent: "space-between"
      }}>
        <Text style={{
          color: (col + row) % 2 ? black : white,
          fontWeight: "500",
          opacity: col === 0 ? 1 : 0
        }}>
          {height - row}
        </Text>
        <Text style={{
          color: (col + row) % 2 ? black : white,
          fontWeight: "500",
          alignSelf: "flex-end",
          opacity: row === height ? 1 : 0
        }}>
          {String.fromCharCode("a".charCodeAt(0) + col)}
        </Text>
      </View>
    );
  };


interface RowProps extends BackgroundProps {
  row: number;
}

const Row: React.FunctionComponent<RowProps> =
  ({ width, height, row }: RowProps): JSX.Element => 
    <View style={{ flex: 1, flexDirection: "row" }}>{
      new Array<number>(width).fill(0).map((_, i) =>
        <Square
          width={width}
          height={height}
          key={`SQUARE-${row}-${i}`}
          row={row} col={i}
        />)
    }</View>;


interface BackgroundProps {
  width: number,
  height: number
}

export const Background: React.FunctionComponent<BackgroundProps> =
  ({ width, height } : BackgroundProps) =>
    <View style={{ flex: 1 }}>{
      new Array<number>(height).fill(0).map((_, i) =>
        <Row
          width={width}
          height={height}
          key={`ROW-${i}`}
          row={i}
        />
      )
    }</View>;
