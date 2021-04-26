import React, { useCallback } from "react";
import { View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Vector } from "react-native-redash";

import { Engine, Position, Figure, Move } from "./engine";



const getToTranslation = (size: number) =>
  (to: Position) => {
    "worklet";
    return { x: to.col * size, y: to.row * size };
  };

const getToPosition = (size: number) =>
  ({ x, y }: Vector): Position => {
    "worklet";
    return { col: Math.round(x / size), row: Math.round(y / size) };
  };


export type PieceSkinProps<FigureType> = { figure: Figure<FigureType>, size: number };
export type PieceSkin<FigureType> = React.FunctionComponent<PieceSkinProps<FigureType>>;

interface PieceProps<FigureType> {
  size: number;
  width: number;
  height: number;
  position: Vector;
  engine: Engine<FigureType>;
  onTurn: () => void;
  enabled: boolean;
  figure: Figure<FigureType>;
  Skin: PieceSkin<FigureType>;
}

export function Piece<FigureType> ({
  size,
  width,
  height,
  position,
  engine,
  onTurn,
  enabled,
  figure,
  Skin
}: PieceProps<FigureType>) {
  const toTranslation = getToTranslation(size);
  const toPosition = getToPosition(size);
  const isGestureActive = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const translateX = useSharedValue(position.x * size);
  const translateY = useSharedValue(position.y * size);
  
  const movePiece = useCallback(
    (to: Position) => {
      const moves = engine.moves();
      const from = toPosition({ x: offsetX.value, y: offsetY.value });
      
      const move: Move | undefined = moves.find(move =>
        move.from.col === from.col &&
        move.from.row === from.row &&
        move.to.col === to.col &&
        move.to.row === to.row
      );

      const { x, y } = toTranslation(move !== undefined ? move.to : from);
      
      translateX.value = withTiming(x, {}, () => (
        offsetX.value = translateX.value
      ));
      
      translateY.value = withTiming(y, {}, () => {
        offsetY.value = translateY.value;
        isGestureActive.value = false;
      });
      
      if (move !== undefined) {
        engine.move(move);
        onTurn();
      }
    }, [engine, isGestureActive, offsetX, offsetY, onTurn, translateX, translateY]
  );
  
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
      isGestureActive.value = true;
    },
    onActive: ({ translationX, translationY }) => {
      translateX.value = offsetX.value + translationX;
      translateY.value = offsetY.value + translationY;
    },
    onEnd: () =>
      runOnJS(movePiece)(toPosition({ x: translateX.value, y: translateY.value }))
  });

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    zIndex: isGestureActive.value ? 100 : 10,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ]
  }));

  const original = useAnimatedStyle(() => {
    return {
      position: "absolute",
      width: size,
      height: size,
      zIndex: 0,
      backgroundColor: isGestureActive.value
        ? "rgba(255, 255, 0, 0.5)"
        : "transparent",
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }]
    };
  });

  const underlay = useAnimatedStyle(() => {
    const position = toPosition({ x: translateX.value, y: translateY.value });
    const translation = toTranslation(position);
    return {
      position: "absolute",
      width: size,
      height: size,
      zIndex: 0,
      backgroundColor: isGestureActive.value
        ? "rgba(255, 255, 0, 0.5)"
        : "transparent",
      transform: [{ translateX: translation.x }, { translateY: translation.y }],
      opacity: (
        position.col >= 0 &&
        position.row >= 0 &&
        position.col < width &&
        position.row < height
      ) ? 1 : 0
    };
  });

  return (
    <React.Fragment>
      <Animated.View style={original} />
      <Animated.View style={underlay} />
      <PanGestureHandler onGestureEvent={onGestureEvent} enabled={enabled}>
        <Animated.View style={style}>
          <Skin size={size} figure={figure}/>
        </Animated.View>
      </PanGestureHandler>
    </React.Fragment>
  );
};
