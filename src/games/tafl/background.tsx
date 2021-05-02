import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";

import { BackgroundSkin, SquareContentsProps } from "../../core/background";



export const taflBackgroundSkin: BackgroundSkin = {
  firstColor: "white",
  secondColor: "rgb(90, 90, 135)",
  SquareContents: ({ size, row, col, width, height }: SquareContentsProps) => {
    const lineHeight: number = size - 15;
    const lineWidth: number = 4;

    const lineStyle: StyleProp<ViewStyle> = {
      width: lineWidth,
      height: lineHeight,
      backgroundColor: "black",
      position: "absolute",
      left: size / 2 - lineWidth / 2,
      top: (size - lineHeight) / 2,
      opacity: 0.5,
      borderRadius: lineWidth / 2
    };

    return (
      <React.Fragment>{
        (
          (row === Math.floor(height / 2) && col === Math.floor(width / 2)) ||
          (row === 0 && col === 0) ||
          (row === 0 && col === width - 1) ||
          (row === height - 1 && col === 0) ||
          (row === height - 1 && col === width - 1)
        ) ? 
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
      }</React.Fragment>
    )
  }
}
