import { BoardCell } from "./types";

export const BOARD_SIZE = 600;
export const CELL_SIZE = 25;

// Bosquejo inicial para validar la integración de React-Konva.
// Reemplaza este arreglo con las 95 casillas reales cuando quieras el tablero fiel.
export const baseCells: BoardCell[] = [
  // Tramo rojo horizontal superior
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `red-main-${i}`,
    x: 200 + i * CELL_SIZE,
    y: 50,
    width: CELL_SIZE,
    height: CELL_SIZE,
    color: i === 0 ? "#ffcccc" : "#ffffff",
    isStart: i === 0,
  })),
  // Centro de referencia
  {
    id: "center",
    x: 225,
    y: 225,
    width: 150,
    height: 150,
    color: "#66e0ff",
  },
  // Aquí agregarás el resto: zonas amarillo/azul/verde, casillas seguras, home, cárceles, etc.
];
