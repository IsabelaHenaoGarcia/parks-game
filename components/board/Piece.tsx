"use client";

import { Circle } from "react-konva";
import { PieceState } from "./types";

interface PieceProps {
  piece: PieceState;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

const colorMap: Record<string, string> = {
  red: "#ff0000",
  blue: "#0000ff",
  yellow: "#ffff00",
  green: "#00aa00",
};

export function Piece({ piece, onDragEnd }: PieceProps) {
  return (
    <Circle
      x={piece.x}
      y={piece.y}
      radius={10}
      fill={colorMap[piece.player]}
      stroke="#000"
      strokeWidth={1}
      draggable
      onDragEnd={(e) => {
        const { x, y } = e.target.position();
        onDragEnd?.(piece.id, x, y);
      }}
    />
  );
}
