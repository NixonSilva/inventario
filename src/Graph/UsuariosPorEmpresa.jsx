import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UsuariosPorEmpresa = () => {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch("http://localhost/routers/dashboard.php")
      .then((res) => res.json())
      .then((data) => {
        setDatos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar datos:", error);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando gráfico...</p>;

  const etiquetas = datos.map((item) => item.EMPRESAS);
  const valores = datos.map((item) => parseInt(item.TOTAL));

  const datosGrafico = {
    labels: etiquetas,
    datasets: [
      {
        label: "Usuarios por Empresa",
        data: valores,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }
    ]
  };

  const opciones = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Usuarios por Empresa"
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={datosGrafico} options={opciones} />;
};

export default UsuariosPorEmpresa;
