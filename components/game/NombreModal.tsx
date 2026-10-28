"use client";

import { useState } from "react";

type NombreModalProps = {
  onSubmit: (nombre: string) => void;
};

export function NombreModal({ onSubmit }: NombreModalProps) {
  const [nombre, setNombre] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-72 text-center">
        <h2 className="text-lg font-bold mb-3">Ingresa tu nombre</h2>
        <input
          type="text"
          className="border p-2 w-full mb-3 text-black"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <button
          type="button"
          onClick={() => onSubmit(nombre)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}
