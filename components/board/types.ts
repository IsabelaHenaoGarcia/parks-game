export type PlayerColor = "red" | "blue" | "yellow" | "green";

export interface BoardCell {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  isSafe?: boolean;
  isStart?: boolean;
  isHome?: boolean;
}

export interface PieceState {
  id: string;
  player: PlayerColor;
  x: number;
  y: number;
}
