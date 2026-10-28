import { Player } from "./types";

type JugadoresPanelProps = {
  jugadores: Player[];
};

export function JugadoresPanel({ jugadores }: JugadoresPanelProps) {
  return (
    <div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl w-full border-2 border-purple-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          🎮 Jugadores
        </h2>
        <div className="h-1 w-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
      </div>

      <div className="space-y-3">
        {jugadores.map((j, i) => (
          <div
            key={j.nombre + i}
            className="bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm p-4 rounded-2xl border-2 border-white/40 hover:border-purple-300 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-white shadow-lg" style={{ backgroundColor: j.color }} />
                <div className="absolute -bottom-1 -right-1 text-xl">{j.icon}</div>
              </div>

              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg">{j.nombre}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-sm text-green-600 font-semibold">{j.estado}</p>
                </div>
              </div>

              <div className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: j.color }}>
                P{i + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
          <span className="text-xs font-semibold text-gray-700">{jugadores.length} jugadores activos</span>
        </div>
      </div>
    </div>
  );
}
