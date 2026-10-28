"use client";

import { Stage, Layer } from "react-konva";
import { useState } from "react";
import { BoardGrid } from "./BoardGrid";
import { Piece } from "./Piece";
import { PieceState } from "./types";
import { BOARD_SIZE } from "./boardLayout";

const INITIAL_PIECES: PieceState[] = [
  { id: "r1", player: "red", x: 100, y: 100 },
  { id: "b1", player: "blue", x: 500, y: 500 },
];

export function ParquesBoard() {
  const [pieces, setPieces] = useState<PieceState[]>(INITIAL_PIECES);

  const handlePieceDragEnd = (id: string, x: number, y: number) => {
    // Aquí luego se llamará al backend en Python para validar y devolver posiciones correctas.
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, x, y } : p)));
  };

  return (
    <Stage width={BOARD_SIZE} height={BOARD_SIZE}>
      <BoardGrid />
      <Layer>
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            piece={piece}
            onDragEnd={handlePieceDragEnd}
          />
        ))}
      </Layer>
    </Stage>
  );
}
