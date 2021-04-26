import React from "react";
import { View, Dimensions } from "react-native";

import { Board } from "./src/core/board";
import { Player } from "./src/core/engine"

/// Brandubh
import { Brandubh } from "./src/games/brandubh/engine";
import { BrandubhSkin } from "./src/games/brandubh/skin";



export default function App () {
  return (
    <View style={{
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "rgb(36, 35, 32)",
    }}>
      <Board
        width={Dimensions.get("window").width}
        engine={new Brandubh()}
        Skin={BrandubhSkin}
        onWin={(player: Player): void => alert(`Player ${player} won`)}
      />
    </View>
  );
}
