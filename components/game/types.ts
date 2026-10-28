export type LoginData = {
  username: string;
  color: string;
};

export type BackendToken = {
  id: number;
  x: number | null;
  y: number | null;
  steps: number;
  in_jail: boolean;
  in_goal: boolean;
};

export type BackendPlayer = {
  name: string;
  color: string;
  tokens: BackendToken[];
};

export type BackendState = {
  players: BackendPlayer[];
  turn: string | null;
  last_roll: number[] | null;
  winner: string | null;
};

export type BackendGameState = {
  game_id: string;
  status: string;
  host?: string;
  state: BackendState;
};

export type Player = {
  nombre: string;
  color: string;
  colorName: string;
  icon: string;
  estado: "Jugando" | "En espera" | "Esperando inicio" | "Finalizado" | "Pendiente";
};

export type FichaInfo = {
  id: number;
  color: string;
  colorName: string;
  jugadorNombre: string;
};
