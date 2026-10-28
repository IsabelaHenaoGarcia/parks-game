"use client";

import { useState } from "react";
import { LoginData } from "./types";

type LoginCardProps = {
  onLogin: (data: LoginData) => Promise<void> | void;
  loading?: boolean;
  error?: string;
};

const colors = [
  { name: "Azul", value: "blue", bg: "bg-blue-500", hover: "hover:bg-blue-600" },
  { name: "Rojo", value: "red", bg: "bg-red-500", hover: "hover:bg-red-600" },
  { name: "Verde", value: "green", bg: "bg-green-500", hover: "hover:bg-green-600" },
  { name: "Amarillo", value: "yellow", bg: "bg-yellow-400", hover: "hover:bg-yellow-500" },
] as const;

export function LoginCard({ onLogin, loading = false, error }: LoginCardProps) {
  const [username, setUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const isValid = Boolean(username && selectedColor);

  const handleSubmit = async () => {
    if (!isValid) return;

    await onLogin({
      username,
      color: selectedColor,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg text-white text-3xl">
            🎲
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Parques Online</h1>
          <p className="text-gray-500 text-sm">Sistema Distribuido</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu nombre"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Selecciona tu Color</label>
            <div className="grid grid-cols-4 gap-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`relative aspect-square ${color.bg} ${color.hover} rounded-xl transition-all duration-200 transform hover:scale-105 ${
                    selectedColor === color.value ? "ring-4 ring-offset-2 ring-purple-500 scale-105" : "opacity-70"
                  }`}
                >
                  {selectedColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {selectedColor && (
              <p className="text-sm text-gray-600 mt-2 text-center">
                Color seleccionado: <span className="font-semibold">{colors.find((c) => c.value === selectedColor)?.name}</span>
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <span className="text-xl">▶️</span>
            {loading ? "Entrando..." : "Entrar a la partida"}
          </button>
        </div>

        {error && (
          <div className="mt-4 px-4 py-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Conexión mediante sistemas distribuidos</p>
        </div>
      </div>
    </div>
  );
}
