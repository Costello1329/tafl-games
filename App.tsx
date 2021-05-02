import React, { useState } from "react";
import { View, ScrollView, SafeAreaView, Dimensions, Text, TouchableOpacity } from "react-native";

import { Board } from "./src/core/board";

import { BrandubhEngine } from "./src/games/tafl/engines/brandubh";
import { ArdRiEngine } from "./src/games/tafl/engines/ardRi";
import { TablutEngine } from "./src/games/tafl/engines/tablut";

import { taflPieceSkin } from "./src/games/tafl/skin";
import { taflBackgroundSkin } from "./src/games/tafl/background";



const windowWidth = Dimensions.get("window").width;

const games = [{
  engine: new BrandubhEngine(),
  pieceSkin: taflPieceSkin,
  backgroundSkin: taflBackgroundSkin
}, {
  engine: new ArdRiEngine(),
  pieceSkin: taflPieceSkin,
  backgroundSkin: taflBackgroundSkin
}, {
  engine: new TablutEngine(),
  pieceSkin: taflPieceSkin,
  backgroundSkin: taflBackgroundSkin
}];


export default function App () {
  const [game, setState] = useState<null | number>(null);

  return (
    <View style={{
      flexDirection: "column",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgb(35, 35, 35)"
    }}>{
      game === null ?
      <SafeAreaView>
        <View>
          <Text style={{
            color: "white",
            fontSize: 48,
            textAlign: "center",
            paddingVertical: 40
          }}>Tafl games</Text>
        <ScrollView contentContainerStyle={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1
        }}>
          <View>{
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
        </View>
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
