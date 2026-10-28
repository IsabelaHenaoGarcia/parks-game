import { Player } from "../types";

type TurnoCompletadoModalProps = {
  jugadorActual: Player;
  onSiguienteJugador: () => void;
  onCerrar: () => void;
};

export function TurnoCompletadoModal({ jugadorActual, onSiguienteJugador, onCerrar }: TurnoCompletadoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center w-[450px] border-4 border-purple-300 transform animate-scaleIn">
        <div className="text-6xl mb-6 animate-bounce">🎉</div>

        <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          ¡Turno Completado!
        </h2>

        <div className="mb-6">
          <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 mb-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg animate-pulse" style={{ backgroundColor: jugadorActual?.color }} />
              <div className="text-left">
                <p className="text-sm text-gray-600 font-medium">Jugador</p>
                <p className="font-black text-xl" style={{ color: jugadorActual?.color }}>
                  {jugadorActual?.nombre}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-green-50 rounded-xl border-2 border-green-200">
            <p className="text-sm text-green-700 font-semibold">✓ Movimiento confirmado y enviado al servidor</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onSiguienteJugador}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white font-black rounded-2xl text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span className="text-2xl">⏭️</span>
              Siguiente Jugador
            </span>
          </button>

          <button
            type="button"
            onClick={onCerrar}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all duration-300"
          >
            Cerrar
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
