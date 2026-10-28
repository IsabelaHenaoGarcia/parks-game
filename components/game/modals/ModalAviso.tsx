import { Player } from "../types";

type ModalAvisoProps = {
  tipo?: "comida" | "ganador" | "error" | "info" | "alerta";
  titulo?: string;
  mensaje?: string;
  jugador?: Player;
  fichaComida?: { id: number };
  onClose: () => void;
};

export function ModalAviso({
  tipo = "info",
  titulo,
  mensaje,
  jugador,
  fichaComida,
  onClose,
}: ModalAvisoProps) {
  const iconos: Record<NonNullable<ModalAvisoProps["tipo"]>, string> = {
    comida: "🍽️",
    ganador: "🏆",
    error: "❌",
    info: "ℹ️",
    alerta: "⚠️",
  };

  const gradientes: Record<NonNullable<ModalAvisoProps["tipo"]>, string> = {
    comida: "from-red-500 to-pink-600",
    ganador: "from-yellow-400 to-orange-500",
    error: "from-red-600 to-red-800",
    info: "from-blue-500 to-cyan-600",
    alerta: "from-orange-500 to-yellow-500",
  };

  const bordes: Record<NonNullable<ModalAvisoProps["tipo"]>, string> = {
    comida: "border-red-300",
    ganador: "border-yellow-300",
    error: "border-red-400",
    info: "border-blue-300",
    alerta: "border-orange-300",
  };

  const fondos: Record<NonNullable<ModalAvisoProps["tipo"]>, string> = {
    comida: "from-red-50 to-pink-50",
    ganador: "from-yellow-50 to-orange-50",
    error: "from-red-50 to-red-100",
    info: "from-blue-50 to-cyan-50",
    alerta: "from-orange-50 to-yellow-50",
  };

  const icono = iconos[tipo];
  const gradiente = gradientes[tipo];
  const borde = bordes[tipo];
  const fondo = fondos[tipo];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
      <div className={`bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center w-[480px] border-4 ${borde} transform animate-scaleIn`}>
        <div className="text-7xl mb-6 animate-bounce-slow">{icono}</div>

        <h2 className={`text-3xl font-black mb-4 bg-gradient-to-r ${gradiente} bg-clip-text text-transparent`}>
          {titulo || "Aviso"}
        </h2>

        <div className="mb-6">
          <p className="text-xl font-semibold text-gray-800 mb-4">{mensaje || "Mensaje del sistema"}</p>

          {jugador && (
            <div className={`mt-4 p-5 bg-gradient-to-r ${fondo} rounded-2xl border-2 ${borde}`}>
              <div className="flex items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full border-4 border-white shadow-lg animate-pulse" style={{ backgroundColor: jugador.color }} />
                <div className="text-left">
                  <p className="text-sm text-gray-600 font-medium">Jugador</p>
                  <p className="font-black text-xl" style={{ color: jugador.color }}>
                    {jugador.nombre}
                  </p>
                </div>
              </div>
            </div>
          )}

          {fichaComida && (
            <div className="mt-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl border-2 border-gray-200">
              <p className="text-sm text-gray-700 font-medium">
                Ficha afectada: <span className="font-black text-lg">#{fichaComida.id + 1}</span>
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className={`px-8 py-4 bg-gradient-to-r ${gradiente} text-white font-black rounded-2xl text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 w-full relative overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <span className="relative z-10">✓ Entendido</span>
        </button>

        <div className="mt-6 px-4 py-2 bg-gray-100 rounded-xl">
          <p className="text-xs text-gray-600 font-semibold">
            {tipo === "comida" ? "🔄 La ficha regresa a su prisión" : tipo === "ganador" ? "🎉 ¡Felicidades por la victoria!" : "🎮 El juego continúa"}
          </p>
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
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
