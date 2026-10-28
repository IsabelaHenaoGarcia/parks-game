"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Controls } from "./Controls";
import { Dado } from "./Dado";
import { JugadoresPanel } from "./JugadoresPanel";
import { LoginCard } from "./LoginCard";
import { Juego } from "./tablero/Juego";
import { AlertModal } from "./modals/AlertModal";
import { ConfirmModal } from "./modals/ConfirmModal";
import { DiceModal } from "./modals/DiceModal";
import { ModalAviso } from "./modals/ModalAviso";
import { TurnModal } from "./modals/TurnModal";
import { TurnoCompletadoModal } from "./modals/TurnoCompletadoModal";
import { StartGameModal } from "./modals/StartGameModal";
import type { BackendGameState, FichaInfo, LoginData, Player } from "./types";
import { joinGame } from "@/lib/backend";

const colorMap = {
  azul: { hex: "#0000FF", label: "Azul", icon: "🔵" },
  rojo: { hex: "#FF0000", label: "Rojo", icon: "🔴" },
  verde: { hex: "#00AA00", label: "Verde", icon: "🟢" },
  amarillo: { hex: "#FFFF00", label: "Amarillo", icon: "🟡" },
  blue: { hex: "#0000FF", label: "Azul", icon: "🔵" },
  red: { hex: "#FF0000", label: "Rojo", icon: "🔴" },
  green: { hex: "#00AA00", label: "Verde", icon: "🟢" },
  yellow: { hex: "#FFFF00", label: "Amarillo", icon: "🟡" },
} as const;

const fallbackColors = Object.values(colorMap).slice(0, 4);

const mapColor = (name?: string) => {
  if (!name) return fallbackColors[0];
  const key = name.toLowerCase() as keyof typeof colorMap;
  return colorMap[key] || fallbackColors[0];
};

type ParquesAppProps = {
  initialLoginData?: LoginData | null;
};

export function ParquesApp({ initialLoginData = null }: ParquesAppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(initialLoginData));
  const [loginData, setLoginData] = useState<LoginData | null>(initialLoginData);
  const [dadoValores, setDadoValores] = useState<[number | null, number | null]>([1, 1]);
  const [diceModalOpen, setDiceModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [turnoCompletadoModalOpen, setTurnoCompletadoModalOpen] = useState(false);
  const [avisoModalOpen, setAvisoModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [preStartModal, setPreStartModal] = useState(false);
  const [turnModalPlayer, setTurnModalPlayer] = useState<Player | null>(null);
  const [turno, setTurno] = useState(0);
  const [fichaInfo, setFichaInfo] = useState<FichaInfo | null>(null);
  const [moveOptions, setMoveOptions] = useState<{ label: string; value?: number }[]>([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [consecutiveDoubles, setConsecutiveDoubles] = useState(0);
  const [attemptsInTurn, setAttemptsInTurn] = useState(0);
  const [rolledThisTurn, setRolledThisTurn] = useState(false);
  const lastTurnPlayerRef = useRef<string>("");
  const [avisoInfo] = useState<{
    tipo: "info" | "alerta" | "comida";
    titulo: string;
    mensaje: string;
    jugador: Player | null;
    fichaComida: { id: number } | null;
  }>({
    tipo: "info",
    titulo: "",
    mensaje: "",
    jugador: null,
    fichaComida: null,
  });
  const [gameState, setGameState] = useState<BackendGameState | null>(null);
  const lastRollRef = useRef<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState(false);
  const lastStatusRef = useRef<string>("");
  const isMyTurn = loginData && gameState?.state.turn === loginData.username && gameState?.status === "running";
  const isHost = Boolean(
    loginData &&
      (
        (gameState?.host && gameState.host === loginData.username) ||
        (!gameState?.host && gameState?.state.players?.[0]?.name === loginData.username) ||
        (!gameState && loginData)
      )
  );
  const jugadorActual = loginData
    ? gameState?.state.players.find((p) => p.name === loginData.username)
    : null;
  const allInJail = jugadorActual ? jugadorActual.tokens.every((t) => t.in_jail) : false;
  const attemptsLimitReached = allInJail && attemptsInTurn >= 3;
  // Permitimos relanzar si todas las fichas siguen en la cárcel; el backend valida turnos/reglas.
  const canRoll = isMyTurn && connected && gameState?.status === "running" && (!pendingMove || allInJail) && !attemptsLimitReached;

  const jugadores: Player[] = useMemo(() => {
    if (gameState?.state.players?.length) {
      const status = gameState.status;
      return gameState.state.players.map((p) => {
        const mapped = mapColor(p.color);
        let estado: "Jugando" | "En espera" | "Esperando inicio" | "Finalizado" | "Pendiente" = "Pendiente";
        if (status === "running") {
          estado = gameState.state.turn === p.name ? "Jugando" : "En espera";
        } else if (status === "waiting") {
          estado = "Esperando inicio";
        } else if (status === "finished") {
          estado = "Finalizado";
        }
        return {
          nombre: p.name,
          color: mapped.hex,
          colorName: mapped.label,
          icon: mapped.icon,
          estado,
        };
      });
    }
    return ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"].map((nombre, i) => ({
      nombre,
      color: fallbackColors[i]?.hex || "#000",
      colorName: fallbackColors[i]?.label || "Color",
      icon: fallbackColors[i]?.icon || "🎲",
      estado: "Jugando",
    }));
  }, [gameState]);
  const handleLogin = (data: LoginData) => {
    setLoginData(data);
    setIsLoggedIn(true);
    joinGame(data).catch((err) => {
      const message = err instanceof Error ? err.message : "No se pudo registrar el jugador";
      mostrarAlerta(message);
    });
    setTimeout(() => {
      mostrarAlerta(`¡Bienvenido ${data.username}! Esperando jugadores...`);
    }, 500);
  };

  const mostrarAlerta = (mensaje: string) => {
    setAlertMessage(mensaje);
    setAlertModalOpen(true);
  };

  const applyState = (state: BackendGameState, metaType?: string) => {
    const isMyTurnNow = Boolean(loginData && state.state.turn === loginData.username && state.status === "running");
    const currentPlayer = state.state.players.find((p) => p.name === state.state.turn);
    const currentPlayerAllInJail = currentPlayer?.tokens.every((t) => t.in_jail) ?? false;
    if (!isMyTurnNow) {
      setPendingMove(false);
    }
    setGameState(state);
    if (state.status !== lastStatusRef.current) {
      if (state.status === "running") {
        setStartModalOpen(true);
        setTimeout(() => setStartModalOpen(false), 1500);
      }
      lastStatusRef.current = state.status;
    }
    if (state.state.turn) {
      // Reset counters when cambia de jugador
      if (lastTurnPlayerRef.current !== state.state.turn) {
        lastTurnPlayerRef.current = state.state.turn;
        setConsecutiveDoubles(0);
        setAttemptsInTurn(0);
        setPendingMove(false);
        setRolledThisTurn(false);
        lastRollRef.current = "";
        if (state.status === "running") {
          const idx = state.state.players.findIndex((p) => p.name === state.state.turn);
          if (idx >= 0) {
            const p = state.state.players[idx];
            const mapped = mapColor(p.color);
            setTurnModalPlayer({
              nombre: p.name,
              color: mapped.hex,
              colorName: mapped.label,
              icon: mapped.icon,
              estado: "Jugando",
            });
            setTimeout(() => setTurnModalPlayer(null), 1400);
          }
        }
      }
      const idx = state.state.players.findIndex((p) => p.name === state.state.turn);
      setTurno(idx >= 0 ? idx : 0);
    }
    if (state.state.last_roll && state.state.last_roll.length === 2) {
      setDadoValores([state.state.last_roll[0], state.state.last_roll[1]]);
      const rollKey = state.state.last_roll.join("-");
      const rollSignature = `${state.state.turn || ""}-${rollKey}`;
      const isRollMessage = metaType === "rolled";
      if (isRollMessage && rollSignature !== lastRollRef.current) {
        lastRollRef.current = rollSignature;
        setRolledThisTurn(isMyTurnNow);
        // track doubles/attempts locally to ayudar en UI solo si es nueva tirada
        const isDouble = state.state.last_roll[0] === state.state.last_roll[1];
        setAttemptsInTurn((prev) => prev + 1);
        setConsecutiveDoubles((prev) => (isDouble ? prev + 1 : 0));
        if (isMyTurnNow) {
          setPendingMove(!currentPlayerAllInJail);
        }
        setDiceModalOpen(true);
        setTimeout(() => setDiceModalOpen(false), 800);
      }
    } else {
      setPendingMove(false);
    }
    // Si es mi turno pero no llegó un evento de tirada, habilita el botón para no quedar bloqueado.
    if (isMyTurnNow && metaType !== "rolled" && !state.state.last_roll) {
      setPendingMove(false);
      setRolledThisTurn(false);
    }
  };

  useEffect(() => {
    if (!loginData) return;
    const wsBase = process.env.NEXT_PUBLIC_WS_BASE || process.env.NEXT_PUBLIC_API_BASE?.replace("http", "ws") || "ws://127.0.0.1:8000";
    const url = `${wsBase}/ws/tcp?player=${encodeURIComponent(loginData.username)}&color=${encodeURIComponent(loginData.color)}`;
    let stopped = false;

    const connect = () => {
      if (stopped) return;
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => setConnected(true);
      ws.onclose = () => {
        setConnected(false);
        wsRef.current = null;
        if (!stopped) {
          setTimeout(connect, 800);
        }
      };
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const statePayload: BackendGameState | undefined = payload.state;
          if (payload.type === "state" && statePayload) {
            applyState(statePayload, payload.type);
          } else if (payload.type === "joined" && statePayload) {
            applyState(statePayload, payload.type);
          } else if (payload.type === "rolled" && statePayload) {
            applyState(statePayload, payload.type);
          } else if (payload.type === "error") {
            mostrarAlerta(payload.message || "Error de servidor");
          }
        } catch (err) {
          console.error("WS parse error", err);
        }
      };
    };

    connect();
    return () => {
      stopped = true;
      wsRef.current?.close();
    };
  }, [loginData]);

  const handleTirarDado = () => {
    if (!loginData) return;
    if (gameState?.status !== "running") {
      setPreStartModal(true);
      return;
    }
    if (!isMyTurn) {
      mostrarAlerta("No es tu turno aún. Espera a que el servidor te asigne el turno.");
      return;
    }
    if (attemptsLimitReached) {
      mostrarAlerta("Se acabaron tus intentos en la cárcel. Espera tu próximo turno.");
      return;
    }
    if (pendingMove && !allInJail) {
      mostrarAlerta("Ya tienes una tirada pendiente, mueve una ficha antes de volver a lanzar.");
      return;
    }
    setRolledThisTurn(false);
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({ type: "roll" }));
      if (isMyTurn) {
        setPendingMove(!allInJail);
      }
    }
  };

  const handleFichaSeleccionada = (index: number) => {
    if (!rolledThisTurn) {
      mostrarAlerta("Primero debes lanzar los dados en este turno.");
      return;
    }
    const jugadorIndex = Math.floor(index / 4);
    const jugador = jugadores[jugadorIndex];
    setFichaInfo({
      id: index,
      color: jugador.color,
      colorName: jugador.colorName,
      jugadorNombre: jugador.nombre,
    });
    if (gameState?.state.last_roll && gameState.state.last_roll.length === 2) {
      const [d1, d2] = gameState.state.last_roll;
      const opts = [
        { label: `Mover con dado 1 (${d1})`, value: d1 },
        { label: `Mover con dado 2 (${d2})`, value: d2 },
        { label: `Mover con ambos (${d1 + d2})`, value: d1 + d2 },
      ];
      setMoveOptions(opts);
    } else {
      setMoveOptions([]);
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmMovimiento = async (stepsOverride?: number) => {
    if (!loginData || !fichaInfo) return;
    if (!isMyTurn) {
      mostrarAlerta("Solo puedes mover durante tu turno");
      setConfirmModalOpen(false);
      return;
    }
    if (!rolledThisTurn) {
      mostrarAlerta("Primero debes lanzar los dados en este turno.");
      setConfirmModalOpen(false);
      return;
    }
    const steps = stepsOverride ?? gameState?.state.last_roll?.reduce((a, b) => a + b, 0);
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({ type: "move", token_id: fichaInfo.id % 4, steps }));
      setPendingMove(false);
      setRolledThisTurn(false);
    }
    setConfirmModalOpen(false);
  };

  const handleStartGame = () => {
    if (!isHost) {
      mostrarAlerta("Solo el anfitrión puede iniciar la partida");
      return;
    }
    if ((gameState?.state.players.length || 0) < 2) {
      mostrarAlerta("Se necesitan al menos 2 jugadores para iniciar");
      return;
    }
    if (!connected || !wsRef.current) {
      mostrarAlerta("No hay conexión con el servidor. Reintenta en unos segundos.");
      return;
    }
    wsRef.current.send(JSON.stringify({ type: "start" }));
  };

  const handleSiguienteJugador = () => {
    setTurnoCompletadoModalOpen(false);
    setAvisoModalOpen(false);
    setFichaInfo(null);
  };

  const handleCerrarTurnoCompletado = () => setTurnoCompletadoModalOpen(false);
  const handleCerrarAviso = () => setAvisoModalOpen(false);
  const handleCerrarAlerta = () => setAlertModalOpen(false);

  if (!isLoggedIn) {
    return <LoginCard onLogin={handleLogin} />;
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url(/fondo.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-pink-900/30 backdrop-blur-sm" />

      <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col lg:flex-row items-start justify-center p-8 gap-8 max-w-7xl border-2 border-purple-200 w-full">
        <div className="flex flex-col items-center w-full lg:max-w-4xl">
          <div className="w-full mb-6 p-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-2xl text-center shadow-lg">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-lg">👤</span>
                <span className="text-white font-black text-lg">{loginData?.username}</span>
              </div>
              {loginData?.color && (
                <>
                  <div className="w-1 h-6 bg-white/40 rounded-full hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-lg">🎨</span>
                    <span className="text-white font-black text-lg capitalize">{loginData?.color}</span>
                  </div>
                </>
              )}
              {isHost && (
                <>
                  <div className="w-1 h-6 bg-white/40 rounded-full hidden sm:block" />
                  <button
                    type="button"
                    onClick={handleStartGame}
                    disabled={gameState?.status === "running" || !connected}
                    className="px-4 py-2 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 disabled:opacity-60"
                  >
                    {gameState?.status === "running" ? "Juego en curso" : "Iniciar partida"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="w-full mb-6">
            <div className="text-center mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-4 border-blue-300 shadow-xl">
              <div className="text-sm text-gray-600 font-bold mb-2">TURNO ACTUAL</div>
              <h2 className="text-4xl font-black text-gray-800 mb-2 flex items-center justify-center gap-3">
                <span style={{ color: jugadores[turno]?.color }} className="animate-pulse">
                  {jugadores[turno]?.icon}
                </span>
                <span style={{ color: jugadores[turno]?.color }}>{jugadores[turno]?.nombre}</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-lg text-gray-600 font-semibold">
                  Jugador {turno + 1} de {jugadores.length}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🎲</span>
                <h3 className="text-xl font-black text-gray-700">Dados</h3>
              </div>
              <div className="flex gap-8 justify-center items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <Dado valor={dadoValores[0]} size={90} color="#f0e7ff" borderColor="#9333ea" />
                <Dado valor={dadoValores[1]} size={90} color="#fce7ff" borderColor="#ec4899" />
              </div>
            </div>

            <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 w-full">
              <Juego nombres={jugadores.map((j) => j.nombre)} turno={turno} gameState={gameState} onFichaSeleccionada={handleFichaSeleccionada} />
            </div>

            <div className="w-full max-w-md">
              <Controls
                onTirarDado={handleTirarDado}
                onSiguienteTurno={handleSiguienteJugador}
                disableRoll={!canRoll}
                disableNext={!canRoll}
                helper={
                  connected
                    ? gameState?.status === "running"
                      ? isMyTurn
                        ? (() => {
                            const intentosRestantes = allInJail ? Math.max(0, 3 - attemptsInTurn) : null;
                            if (consecutiveDoubles >= 2) return "Cuidado: otro doble enviará tu ficha más adelantada a la cárcel";
                            if (allInJail && intentosRestantes !== null) {
                              if (intentosRestantes === 0) return "Se acabaron tus intentos, espera tu próximo turno";
                              return `Intentos para salir: ${intentosRestantes}/3`;
                            }
                            if (consecutiveDoubles === 1) return "Sacaste doble, tienes otro lanzamiento";
                            return "Es tu turno";
                          })()
                        : gameState?.state.turn
                          ? `Turno de ${gameState.state.turn}`
                          : undefined
                      : "Esperando inicio de partida"
                    : "Conectando al servidor..."
                }
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full lg:max-w-sm">
          <JugadoresPanel jugadores={jugadores} />
        </div>
      </div>

      {diceModalOpen && <DiceModal valores={dadoValores} />}
      {confirmModalOpen && fichaInfo && (
        <ConfirmModal
          mensaje={`¿Mover ficha ${fichaInfo.id + 1} (${fichaInfo.colorName})?`}
          fichaInfo={fichaInfo}
          options={moveOptions}
          onConfirm={handleConfirmMovimiento}
          onCancel={() => setConfirmModalOpen(false)}
        />
      )}
      {turnoCompletadoModalOpen && <TurnoCompletadoModal jugadorActual={jugadores[turno]} onSiguienteJugador={handleSiguienteJugador} onCerrar={handleCerrarTurnoCompletado} />}
      {turnModalPlayer && <TurnModal nombre={turnModalPlayer.nombre} colorName={turnModalPlayer.colorName} color={turnModalPlayer.color} />}
      {avisoModalOpen && <ModalAviso tipo={avisoInfo.tipo} titulo={avisoInfo.titulo} mensaje={avisoInfo.mensaje} jugador={avisoInfo.jugador || undefined} fichaComida={avisoInfo.fichaComida || undefined} onClose={handleCerrarAviso} />}
      {alertModalOpen && <AlertModal mensaje={alertMessage} onClose={handleCerrarAlerta} />}
      {preStartModal && (
        <AlertModal
          mensaje="La partida aún no ha iniciado. Espera a que el anfitrión la inicie para poder lanzar los dados."
          onClose={() => setPreStartModal(false)}
        />
      )}
      {startModalOpen && <StartGameModal players={jugadores.map((j) => j.nombre)} />}
    </div>
  );
}
