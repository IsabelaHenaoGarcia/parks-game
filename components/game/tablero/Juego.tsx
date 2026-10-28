import type { BackendGameState } from "../types";
import { Tablero } from "./Tablero";

type JuegoProps = {
  nombres: string[];
  turno: number;
  gameState: BackendGameState | null;
  onFichaSeleccionada: (index: number) => void;
};

// Colores canónicos del tablero
type CanonicalColor = "green" | "blue" | "yellow" | "red";

// Normaliza los nombres que vienen del backend ("azul"/"blue", etc.)
const normalizeColor = (name?: string): CanonicalColor => {
  const n = (name || "").toLowerCase();
  if (n === "verde" || n === "green") return "green";
  if (n === "azul" || n === "blue") return "blue";
  if (n === "amarillo" || n === "yellow") return "yellow";
  if (n === "rojo" || n === "red") return "red";
  return "green";
};

// Hex por color lógico
const colorHex: Record<CanonicalColor, string> = {
  green: "#50C878",
  blue: "#4682B4",
  yellow: "#FFFF00",
  red: "#FF0000",
};

// Índice de fila lógica según backend (COLORS: verde=0, azul=1, amarillo=2, rojo=3)
const colorIndex: Record<CanonicalColor, number> = {
  green: 0,
  blue: 1,
  yellow: 2,
  red: 3,
};

// Coordenadas centrales de las cárceles dentro de cada cuadrante de color
const prisiones: Record<CanonicalColor, { x: number; y: number }[]> = {
  green: [
    { x: 180, y: 540 },
    { x: 225, y: 540 },
    { x: 180, y: 585 },
    { x: 225, y: 585 },
  ],
  blue: [
    { x: 180, y: 180 },
    { x: 225, y: 180 },
    { x: 180, y: 225 },
    { x: 225, y: 225 },
  ],
  yellow: [
    { x: 540, y: 540 },
    { x: 585, y: 540 },
    { x: 540, y: 585 },
    { x: 585, y: 585 },
  ],
  red: [
    { x: 540, y: 180 },
    { x: 585, y: 180 },
    { x: 540, y: 225 },
    { x: 585, y: 225 },
  ],
};

// Mapea fila/columna lógica (fila=color 0..3, col=0..23) a coordenadas SVG usando
// las mismas medidas que Tablero.tsx. El tablero del backend es una banda lineal
// de 24 casillas por color; aquí proyectamos esa banda sobre la línea central de
// cada camino coloreado.
const mapToCoords = (fila: number, columna: number) => {
  const TRACKS: Record<number, { x: number; y: number; width: number; height: number; rows: number; cols: number }> = {
    // Misma geometría declarada en Tablero.tsx
    1: { x: 290, y: 150, width: 220, height: 140, rows: 7, cols: 3 }, // azul
    0: { x: 150, y: 290, width: 140, height: 220, rows: 3, cols: 7 }, // verde
    3: { x: 510, y: 290, width: 140, height: 220, rows: 3, cols: 7 }, // rojo
    2: { x: 290, y: 510, width: 220, height: 140, rows: 7, cols: 3 }, // amarillo
  };

  const track = TRACKS[fila];
  if (!track) return { x: 0, y: 0 };

  const isHorizontal = track.width >= track.height;
  const steps = 24; // columnas del backend

  if (isHorizontal) {
    const stepX = track.width / steps;
    const cellHeight = track.height / track.rows;
    const midRow = Math.floor(track.rows / 2);
    const y = track.y + midRow * cellHeight + cellHeight / 2;
    return { x: track.x + columna * stepX + stepX / 2, y };
  }

  const stepY = track.height / steps;
  const cellWidth = track.width / track.cols;
  const midCol = Math.floor(track.cols / 2);
  const x = track.x + midCol * cellWidth + cellWidth / 2;
  return { x, y: track.y + columna * stepY + stepY / 2 };
};

export function Juego({ nombres, turno, gameState, onFichaSeleccionada }: JuegoProps) {
  const fichas: { x: number; y: number; color: string }[] = [];

  if (gameState?.state?.players?.length) {
    gameState.state.players.forEach((p, pIdx) => {
      const colorKey = normalizeColor(p.color);
      const color = colorHex[colorKey];
      const jailSlots = prisiones[colorKey];

      p.tokens.forEach((t) => {
        const index = pIdx * 4 + t.id;

        if (t.in_goal) {
          // Fichas en la meta
          fichas[index] = {
            x: 380 + pIdx * 8,
            y: 380 + t.id * 8,
            color,
          };
        } else if (t.in_jail) {
          // Fichas en la cárcel
          const pos = jailSlots?.[t.id];
          fichas[index] = {
            x: pos?.x ?? 50,
            y: pos?.y ?? 50,
            color,
          };
        } else if (t.x !== null && t.y !== null) {
          // Backend: x = fila(color 0..3), y = columna (0..23)
          const pos = mapToCoords(t.x, t.y);
          fichas[index] = { x: pos.x, y: pos.y, color };
        } else {
          // Ficha ya salió pero no tiene coords aún: mostrarla en su salida
          const fila = colorIndex[colorKey];
          const columnaSalida = 4; // ajusta por color si quieres afinar
          const pos = mapToCoords(fila, columnaSalida);
          fichas[index] = { x: pos.x, y: pos.y, color };
        }
      });
    });
  }

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-gray-600 font-semibold mb-2">
        Turno: {nombres[turno]} (Jugador {turno + 1})
      </p>
      <Tablero fichas={fichas} onFichaClick={onFichaSeleccionada} />
    </div>
  );
}
