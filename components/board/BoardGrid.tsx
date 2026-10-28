"use client";

import { Layer, Rect } from "react-konva";
import { BOARD_SIZE, baseCells } from "./boardLayout";

export function BoardGrid() {
  return (
    <Layer>
      <Rect x={0} y={0} width={BOARD_SIZE} height={BOARD_SIZE} fill="#f5f5dc" />
      {baseCells.map((cell) => (
        <Rect
          key={cell.id}
          x={cell.x}
          y={cell.y}
          width={cell.width}
          height={cell.height}
          stroke="#000"
          strokeWidth={1}
          fill={cell.color ?? "#ffffff"}
        />
      ))}
    </Layer>
  );
}