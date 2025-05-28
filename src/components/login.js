import React from 'react';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: agregar lógica de autenticación
    console.log('Iniciando sesión con:', { email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="absolute top-0 left-0 p-6">
        {/* Logo Navemar */}
        <img src="/logo.png" alt="Navemar" className="h-10" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Correo o Usuario*
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Contraseña*
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            ¿Olvidó la contraseña?
          </a>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="text-center">
          <span className="text-sm">¿No tiene cuenta? </span>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Regístrese ahora
          </a>
        </div>

        <div className="mt-6 text-center text-gray-600 text-sm">
          Para ingresar al sitio web de Navemar{' '}
          <a href="https://navemar.com" className="text-blue-600 hover:underline">
            haga clic aquí
          </a>
        </div>
      </div>
    </div>
  );
}
