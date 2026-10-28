"use client";

type ControlsProps = {
  onTirarDado: () => void;
  onSiguienteTurno?: () => void;
  disableRoll?: boolean;
  disableNext?: boolean;
  helper?: string;
};

export function Controls({ onTirarDado, onSiguienteTurno, disableRoll = false, disableNext = false, helper }: ControlsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <button
        className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-black px-8 py-5 rounded-2xl shadow-2xl hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xl w-full overflow-hidden group"
        onClick={onTirarDado}
        disabled={disableRoll}
        type="button"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <span className="text-3xl animate-bounce relative z-10">🎲</span>
        <span className="relative z-10">Tirar Dados</span>
      </button>

      {onSiguienteTurno && (
        <button
          className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-600 text-white font-black px-8 py-5 rounded-2xl shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 text-xl w-full overflow-hidden group"
          onClick={onSiguienteTurno}
          disabled={disableNext}
          type="button"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="text-3xl relative z-10">⏭️</span>
          <span className="relative z-10">Siguiente Jugador</span>
        </button>
      )}
      {helper && <p className="text-center text-sm text-gray-600">{helper}</p>}
    </div>
  );
}
