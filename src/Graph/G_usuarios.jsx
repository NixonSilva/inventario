import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from 'recharts';

function agruparPorCampo(data, campo) {
  console.log(`Agrupando por campo: ${campo}`);
  const resultado = {};
  data.forEach(item => {
    const clave = item[campo];
    resultado[clave] = (resultado[clave] || 0) + 1;
  });

  const agrupado = Object.entries(resultado).map(([clave, valor]) => ({
    nombre: clave,
    cantidad: valor
  }));
  console.log(`Resultado agrupado por ${campo}:`, agrupado);
  return agrupado;
}

export default function GraficasUsuarios() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Llamando a la API...");
    axios.get('http://172.20.158.193/inventario_navesoft/backend/usuarios.php') // Reemplaza con tu URL real
      .then(res => {
        console.log("Datos recibidos de la API:", res.data);
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener datos:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    console.log("Cargando...");
    return <p style={{ color: 'blue' }}>Cargando datos...</p>;
  }

  if (error) {
    console.log("Error encontrado:", error);
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!data || data.length === 0) {
    console.log("No hay datos disponibles");
    return <p style={{ color: 'orange' }}>No hay datos disponibles.</p>;
  }

  console.log("Renderizando gráficos...");

  const porUbicacion = agruparPorCampo(data, 'ubicacion');
  const porLugarUso = agruparPorCampo(data, 'lugarUso');
  const porEmpresa = agruparPorCampo(data, 'empresa');

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Usuarios por Ubicación</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={porUbicacion}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Usuarios por Lugar de Uso</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={porLugarUso}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Usuarios por Empresa</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={porEmpresa}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
