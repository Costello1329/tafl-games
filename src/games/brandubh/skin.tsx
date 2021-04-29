import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

import { Player } from "../../core/engine";
import { PieceSkinProps } from "../../core/piece";
import { BrandubhFigureType } from "./engine";



export const BrandubhSkin = ({ size, figure }: PieceSkinProps<BrandubhFigureType>) => {
  const figureSize: number = figure.type === BrandubhFigureType.king ? size - 10 : size - 20;
  const figureBorder: number = 2;
  const black: string = "rgb(100, 0, 0)";
  const white: string = "rgb(255, 255, 255)";
  const gold: string = "rgb(212, 175, 55)";

  const lineWidth: number = 5;
  const lineHeight: number = size - 30;

  const lineStyle: StyleProp<ViewStyle> = {
    backgroundColor: gold,
    width: lineWidth,
    height: lineHeight,
    borderRadius: lineHeight / 2,
    position: "absolute",
    left: (figureSize - 2 * figureBorder - lineWidth) / 2,
    top: (figureSize - 2 * figureBorder - lineHeight) / 2
  };

  return (
    <View style={{
      backgroundColor: figure.player === Player.black ? black : white,
      width: figureSize,
      height: figureSize,
      borderWidth: figureBorder,
      borderColor: figure.type === BrandubhFigureType.king ? gold : "black",
      borderRadius: figureSize / 3,
      margin: (size - figureSize) / 2
    }}>{
      figure.type === BrandubhFigureType.king ?
      <React.Fragment>
        <View style={{ ... lineStyle }}></View>
        <View style={{ ... lineStyle, transform: [{ rotate: "90deg" }] }}></View>
      </React.Fragment> :
      null
    }</View>
  );
};
