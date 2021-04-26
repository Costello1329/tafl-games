import React, { useState, useRef, useCallback } from "react"
import { View } from "react-native"

import { Background } from "./background";
import { Piece, PieceSkin } from "./piece";
import { Engine, Player } from "./engine";



interface BoardProps<FigureType> {
  width: number,
  engine: Engine<FigureType>,
  Skin: PieceSkin<FigureType>,
  onWin: (player: Player) => void
}

export function Board<FigureType> ({ width, engine, Skin, onWin } : BoardProps<FigureType>) {
    const [state, setState] = useState({
      board: engine.board(),
      player: engine.player(),
      winner: engine.winner()
    });

    const onTurn = useCallback(() => {
      setState({
        player: engine.player(),
        board: engine.board(),
        winner: engine.winner()
      });
    }, [engine]);

    const boardWidth: number = Math.max.apply(null, engine.board().map(_ => _.length));
    const boardHeight: number = engine.board().length;

    const winner = engine.winner();

    if (winner !== null)
      onWin(winner);

    return (
      <View style={{ width: width, height: width / boardWidth * boardHeight }}>
        <Background
          width={boardWidth}
          height={boardHeight}
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
    );
  };
