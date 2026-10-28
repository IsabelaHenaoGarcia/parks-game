type AlertModalProps = {
  mensaje: string;
  onClose: () => void;
};

export function AlertModal({ mensaje, onClose }: AlertModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center w-96 border-2 border-purple-200 transform animate-scaleIn">
        <div className="text-5xl mb-4 animate-bounce">💬</div>
        <p className="text-xl font-bold text-gray-800 mb-6 leading-relaxed">{mensaje}</p>
        <button
          type="button"
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-black text-lg shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 w-full"
          onClick={onClose}
        >
          ✓ Entendido
        </button>
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
