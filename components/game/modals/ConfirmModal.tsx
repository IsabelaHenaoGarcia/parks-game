type ConfirmOption = { label: string; value?: number };

type ConfirmModalProps = {
  mensaje: string;
  fichaInfo: {
    id: number;
    color: string;
    colorName: string;
  };
  onConfirm: (value?: number) => void;
  onCancel: () => void;
  options?: ConfirmOption[];
};

export function ConfirmModal({ mensaje, fichaInfo, onConfirm, onCancel, options }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-[450px] text-center border-2 border-purple-200 transform animate-scaleIn">
        <div className="text-5xl mb-4 animate-pulse">🤔</div>

        <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Confirmar Movimiento
        </h3>

        <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <div className="flex items-center justify-center gap-4">
            <div
              className="w-12 h-12 rounded-full border-4 border-white shadow-lg animate-pulse"
              style={{ backgroundColor: fichaInfo.color }}
            />
            <div className="text-left">
              <p className="font-black text-gray-800 text-lg">Ficha #{fichaInfo.id + 1}</p>
              <p className="text-sm font-bold" style={{ color: fichaInfo.color }}>
                {fichaInfo.colorName}
              </p>
            </div>
          </div>
        </div>

        <p className="text-lg font-semibold text-gray-700 mb-8">{mensaje}</p>

        {options && options.length > 0 ? (
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => onConfirm(opt.value)}
                type="button"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {opt.label}
              </button>
            ))}
            <button
              onClick={onCancel}
              type="button"
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              ✕ Cancelar
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => onConfirm()}
              type="button"
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-green-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">✓</span>
              Confirmar
            </button>
            <button
              onClick={onCancel}
              type="button"
              className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-2xl">✕</span>
              Cancelar
            </button>
          </div>
        )}

        <div className="mt-6 px-4 py-2 bg-blue-50 rounded-xl">
          <p className="text-xs text-blue-700 font-semibold">🔄 El backend validará el movimiento</p>
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
