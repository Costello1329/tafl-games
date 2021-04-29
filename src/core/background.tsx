import React from "react";
import { View, Text, ColorValue, StyleProp, ViewStyle } from "react-native";



export enum SquareType {
  Normal = "normal",
  Cross = "cross"
}

export type GetSquareType = (row: number, col: number) => SquareType;


interface SquareProps extends RowProps {
  col: number;
}

const Square: React.FunctionComponent<SquareProps> =
  ({ squareSize, height, row, col, getSquareType }: SquareProps) => {
    const dark: ColorValue = "rgb(100, 133, 68)";
    const light: ColorValue = "rgb(230, 233, 198)";

    const lineHeight: number = squareSize - 10;
    const lineWidth: number = 4;

    const lineStyle: StyleProp<ViewStyle> = {
      width: lineWidth,
      height: lineHeight,
      backgroundColor: dark,
      position: "absolute",
      left: squareSize / 2 - lineWidth / 2,
      top: (squareSize - lineHeight) / 2,
      opacity: 0.5,
      borderRadius: lineWidth / 2
    };

    return (
      <View style={{
        flex: 1,
        backgroundColor: (col + row) % 2 ? dark : light,
        padding: 4,
        justifyContent: "space-between"
      }}>
        {
          getSquareType(row, col) === SquareType.Cross ?
          <React.Fragment>
            <View style={{
              ... lineStyle,
              transform: [{ rotate: "45deg" }]
            }}></View>
            <View style={{
              ... lineStyle,
              transform: [{ rotate: "-45deg" }]
            }}></View>
          </React.Fragment> :
          null
        }
        <Text style={{
          color: (col + row) % 2 ? light : dark,
          fontWeight: "500",
          opacity: col === 0 ? 1 : 0
        }}>
          {height - row}
        </Text>
        <Text style={{
          color: (col + row) % 2 ? light : dark,
          fontWeight: "500",
          alignSelf: "flex-end",
          opacity: row === height - 1 ? 1 : 0
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
  ({ squareSize, width, height, row, getSquareType }: RowProps): JSX.Element =>
    <View style={{ flex: 1, flexDirection: "row" }}>{
      new Array<number>(width).fill(0).map((_, i) =>
        <Square
          squareSize={squareSize}
          width={width}
          height={height}
          key={`SQUARE-${row}-${i}`}
          row={row}
          col={i}
          getSquareType={getSquareType}
        />)
    }</View>;


interface BackgroundProps {
  squareSize: number,
  width: number,
  height: number,
  getSquareType: (row: number, col: number) => SquareType
}

export const Background: React.FunctionComponent<BackgroundProps> =
  ({ squareSize, width, height, getSquareType } : BackgroundProps) =>
    <View style={{ flex: 1 }}>{
      new Array<number>(height).fill(0).map((_, i) =>
        <Row
          squareSize={squareSize}
          width={width}
          height={height}
          key={`ROW-${i}`}
          row={i}
          getSquareType={getSquareType}
        />
      )
    }</View>;
