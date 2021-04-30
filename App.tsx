import React, { useState } from "react";
import { View, ScrollView, SafeAreaView, Dimensions, Text, TouchableOpacity } from "react-native";

import { Board } from "./src/core/board";

/// Brandubh
import { Brandubh } from "./src/games/brandubh/engine";
import { BrandubhSkin } from "./src/games/brandubh/skin";
import { getBrandubhSquareType } from "./src/games/brandubh/background";



const windowWidth = Dimensions.get("window").width;

const games = [{
  engine: new Brandubh(),
  Skin: BrandubhSkin,
  getSquareType: getBrandubhSquareType
}];


export default function App () {
  const [game, setState] = useState<null | number>(null);

  return (
    <View style={{
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      backgroundColor: "rgb(35, 35, 35)",
    }}>{
      game === null ?
      <SafeAreaView style={{ width: windowWidth }}>
        <ScrollView style={{ width: windowWidth }}>
          <View>
            <Text style={{
              color: "white",
              fontSize: 48,
              textAlign: "center",
              textAlignVertical: "center",
              marginVertical: 40
            }}>Tafl games</Text>
          </View>
          <View style={{
            alignItems: "center"
          }}>{
            games.map(({ engine }, game: number) =>
              <TouchableOpacity
                key={`select-game-button ${game}`}
                style={{
                  width: windowWidth - 100,
                  backgroundColor: "rgb(75, 75, 75)",
                  marginVertical: 5,
                  borderRadius: 5
                }}
                onPress={(): void => setState(game)}
              >
                <Text style={{
                  color: "white",
                  textAlign: "center",
                  textAlignVertical: "center",
                  fontSize: 28,
                  paddingVertical: 10,
                }}>{engine.name}</Text>
              </TouchableOpacity>)
          }</View>
        </ScrollView>
      </SafeAreaView> :
      <Board
        {... games[game]}
        width={windowWidth}
        goToMenu={() => {
          games[game].engine.restart();
          setState(null);
        }}
      />
    }</View>
  );
}
