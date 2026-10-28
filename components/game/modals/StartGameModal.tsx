type StartGameModalProps = {
  players: string[];
};

export function StartGameModal({ players }: StartGameModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-white/90 backdrop-blur-xl px-10 py-8 rounded-3xl shadow-2xl border-2 border-green-200 text-center animate-scaleIn">
        <div className="text-5xl mb-3">🚀</div>
        <p className="text-sm font-semibold text-gray-500 mb-1">Partida iniciada</p>
        <p className="text-3xl font-black text-green-700">¡Vamos a jugar!</p>
        <p className="text-base font-semibold text-gray-600 mt-3">Jugadores: {players.join(", ")}</p>
      </div>
      <style jsx>{`
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
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
