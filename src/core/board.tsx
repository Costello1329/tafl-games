import React, { useState, useCallback } from "react"
import { View, Button, Alert, Text, TouchableOpacity } from "react-native"

import { Background, GetSquareType } from "./background";
import { Piece, PieceSkin } from "./piece";
import { Engine } from "./engine";



interface BottomBoardButton {
  title: string,
  enabled: boolean,
  action: () => void
}

interface BoardProps<FigureType> {
  width: number,
  engine: Engine<FigureType>,
  Skin: PieceSkin<FigureType>,
  getSquareType: GetSquareType
}

export function Board<FigureType> (
  { width, engine, Skin, getSquareType } : BoardProps<FigureType>
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
          onPress: () => alert("MENU")
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
        <Text style={{
          textAlign: "center",
          fontSize: 32,
          color: "white",
          marginBottom: 15
        }}>{engine.name}</Text>
        <View style={{ width: width, height: width / boardWidth * boardHeight }}>
          <Background
            squareSize={width / boardWidth}
            width={boardWidth}
            height={boardHeight}
            getSquareType={getSquareType}
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
                  Skin={Skin}
                /> :
                null
              )
            )
          }
        </View>
        <View style={{
          marginTop: 10,
          flexDirection: "row"
        }}>{buttons.map((button: BottomBoardButton, i: number): JSX.Element => 
          <View style={{ flex: 1 }} key={`bottom-board-button-${i}`}>
            <TouchableOpacity onPress={button.action} disabled={!button.enabled}>
              <Text style={{
                color: button.enabled ? "white" : "gray",
                fontSize: 20,
                textAlign: "center",
                textAlignVertical: "center"
              }}>
                {button.title}
              </Text>
            </TouchableOpacity>
          </View>
        )}</View>
      </React.Fragment>
    );
  };
