import React from "react";
import { View } from "react-native";

import { Player } from "../../core/engine";
import { PieceSkinProps } from "../../core/piece";
import { BrandubhFigureType } from "./engine";



export const BrandubhSkin = ({ size, figure }: PieceSkinProps<BrandubhFigureType>) => {
  const figureSize: number = figure.type === BrandubhFigureType.king ? size - 5 : size - 15;

  return (
    <View style={{
      backgroundColor: figure.player === Player.black ? "rgb(100, 0, 0)" : "rgb(255, 255, 255)",
      width: figureSize,
      height: figureSize,
      borderWidth: 2,
      borderColor: figure.type === BrandubhFigureType.king ? "rgb(212, 175, 55)" : "rgb(0, 0, 0)",
      borderRadius: 10000,
      margin: (size - figureSize) / 2
    }}>{
      figure.type === BrandubhFigureType.king ?
      <React.Fragment>
        <View style={{
          backgroundColor: "rgb(212, 175, 55)",
          width: 5,
          height: size - 30,
          borderRadius: 10000,
          marginLeft: -2 + figureSize / 2 - 5 / 2,
          marginTop: -2 + figureSize / 2 - (size - 30) / 2
        }}></View>
        <View style={{
          backgroundColor: "rgb(212, 175, 55)",
          width: size - 30,
          height: 5,
          borderRadius: 10000,
          marginLeft: -2 + figureSize / 2 - (size - 30) / 2,
          marginTop: - (size - 30) / 2 - 5 / 2
        }}></View>
      </React.Fragment> :
      null
    }</View>
  );
};
