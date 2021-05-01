import React, { useState, useCallback } from "react"
import { View, Alert, Text, TouchableOpacity, Button } from "react-native"

import { Background, BackgroundSkin } from "./background";
import { Piece, PieceSkin } from "./piece";
import { Engine } from "./engine";



interface BottomBoardButton {
  title: string,
  enabled: boolean,
  action: () => void
}

export interface BoardProps<FigureType> {
  width: number,
  engine: Engine<FigureType>,
  goToMenu: () => void,
  pieceSkin: PieceSkin<FigureType>,
  backgroundSkin: BackgroundSkin
}

export function Board<FigureType> (
  { width, engine, goToMenu, pieceSkin, backgroundSkin } : BoardProps<FigureType>
) {
    const [state, setState] = useState({
      board: engine.board,
      player: engine.player,
      winner: engine.winner
    });

    const onTurn = useCallback(() => {
      setState({
        player: engine.player,
        board: engine.board,
        winner: engine.winner
      });
    }, [engine]);

    const boardWidth: number = Math.max.apply(null, engine.board.map(_ => _.length));
    const boardHeight: number = engine.board.length;

    const winner = engine.winner;

    if (winner !== null) {
      Alert.alert(
        `${winner} player won`,
        "",
        [{
          text: "Restart",
          onPress: () => {
            engine.restart();
            onTurn();
          }
        }, {
          text: "Go to menu",
          onPress: goToMenu
        }]
      )
    }

    const restartAction = () =>
      Alert.alert(
        "Are you sure",
        "Are you sure you want to restart the game?",
        [{
          text: "Yes",
          onPress: () => {
            engine.restart();
            onTurn();
          },
          style: "destructive"
        }, {
          text: "No"
        }]
      );

    const buttons: BottomBoardButton[] =
      [{
        title: "Undo",
        enabled: engine.canUndo,
        action: () => {
          engine.undo();
          onTurn();
        }
      }, {
        title: "Restart",
        enabled: true,
        action: restartAction
      }, {
        title: "Redo",
        enabled: engine.canRedo,
        action: () => {
          engine.redo();
          onTurn();
        }
      }];

    return (
      <React.Fragment>
        <View style={{ flexDirection: "row" }}>
          <View style={{ position: "absolute", top: 4, zIndex: 1 }}>
            <Button
              title={"Menu"}
              color={"white"}
              onPress={() => {
                Alert.alert(
                  "Go to menu?",
                  "Are you sure that you want to return back to the menu? " +
                  "Current game won't be saved then.",
                  [{
                    text: "Yes",
                    style: "destructive",
                    onPress: goToMenu
                  }, {
                    text: "No"
                  }]
                );
              }}
            />
          </View>
          <Text style={{
            textAlign: "center",
            fontSize: 32,
            color: "white",
            marginBottom: 15,
            flex: 1,
          }}>{engine.name}</Text>
        </View>
        <View style={{
          width: width,
          height: width / boardWidth * boardHeight
        }}>
          <Background
            size={width / boardWidth}
            width={boardWidth}
            height={boardHeight}
            firstColor={backgroundSkin.firstColor}
            secondColor={backgroundSkin.secondColor}
            SquareContents={backgroundSkin.SquareContents}
          />
          {
            state.board.map((row, y) =>
              row.map((piece, x) =>
                (piece !== null) ?
                <Piece
                  key={`PIECE-${x}-${y}`}
                  size={width / boardWidth}
                  width={boardWidth}
                  height={boardHeight}
                  position={{ x, y }}
                  engine={engine}
                  onTurn={onTurn}
                  enabled={state.player === piece.player && state.winner === null}
                  figure={{ ... piece }}
                  Skin={pieceSkin}
                /> :
                null
              )
            )
          }
        </View>
        <View style={{flexDirection: "row"}}>{
          buttons.map((button: BottomBoardButton, i: number): JSX.Element => 
            <View style={{
              flex: 1,
              borderLeftWidth: i !== 0 ? 1 : 0,
              borderRightWidth: i !== buttons.length - 1 ? 1 : 0,
              borderBottomWidth: 2,
              borderColor: "grey",
              borderBottomColor: "black",
              borderLeftColor: "black",
              borderRightColor: "black",
              backgroundColor: "rgb(32, 42, 56)",
              paddingVertical: 10,
              borderBottomRightRadius: 10,
              borderBottomLeftRadius: 10,
              borderTopColor: "black"
            }} key={`bottom-board-button-${i}`}>
              <TouchableOpacity onPress={button.action} disabled={!button.enabled}>
                <Text style={{
                  textAlign: "center",
                  textAlignVertical: "center",
                  color: button.enabled ? "white" : "gray",
                  fontSize: 20
                }}>{button.title}</Text>
              </TouchableOpacity>
            </View>)
        }</View>
      </React.Fragment>
    );
  };
