import { Dado } from "../Dado";

type DiceModalProps = {
  valores: [number | null, number | null];
};

export function DiceModal({ valores }: DiceModalProps) {
  const esperando = valores[0] === null || valores[1] === null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl p-10 rounded-3xl shadow-2xl text-center flex flex-col items-center w-[420px] border-4 border-purple-300 transform animate-scaleIn">
        {esperando ? (
          <>
            <div className="text-6xl mb-6 animate-spin-slow">🎲</div>
            <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-pulse">
              Lanzando dados...
            </p>
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
            <p className="text-sm text-gray-600 font-medium">Esperando respuesta del servidor...</p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              ¡Resultado!
            </p>
            <div className="flex gap-8 justify-center items-center mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
              <div className="transform hover:scale-110 transition-transform duration-300 animate-diceRoll">
                <Dado valor={valores[0]} size={90} color="#f0e7ff" borderColor="#9333ea" />
              </div>
              <div className="text-4xl font-black text-purple-600">+</div>
              <div className="transform hover:scale-110 transition-transform duration-300 animate-diceRoll" style={{ animationDelay: "0.2s" }}>
                <Dado valor={valores[1]} size={90} color="#fce7ff" borderColor="#ec4899" />
              </div>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <p className="text-white font-black text-xl">Total: {(valores[0] || 0) + (valores[1] || 0)}</p>
            </div>
          </>
        )}
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
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes diceRoll {
          0% {
            transform: rotate(0deg) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-diceRoll {
          animation: diceRoll 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
