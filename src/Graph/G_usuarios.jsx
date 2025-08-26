import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

import {
  Users,
  Activity,
  Building,
  MapPin,
  TrendingUp,
  RefreshCw,
  FileText,
  UserCheck,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);

  // Colores para los gráficos
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Opciones de navegación
  const navigationOptions = [
    { id: 1, name: "Usuarios", icon: UserCheck },
    { id: 2, name: "equipos", icon: FileText },
    { id: 3, name: "Telefonia", icon: Building },
    { id: 4, name: "Impresoras", icon: BarChart3 },
    { id: 5, name: "Perifericos", icon: PieChartIcon }
  ];

  // Función para obtener datos del API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cambia esta URL por la de tu servidor PHP
      const response = await fetch('http://172.20.158.193/inventario_navesoft/backend/DashboardUsuarios.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Procesar y formatear los datos según lo que devuelve el PHP
      const processedData = {
        stats: {
          total_usuarios: parseInt(result.stats?.TOTAL_USUARIOS || 0),
          usuarios_activos: parseInt(result.stats?.USUARIOS_ACTIVOS || 0),
          usuarios_inactivos: parseInt(result.stats?.USUARIOS_INACTIVOS || 0),
          porcentaje_activos: parseFloat(result.stats?.PORCENTAJE_ACTIVOS || 0)
        },
        empresas: (result.empresas || []).map(empresa => ({
          empresas: empresa.EMPRESAS,
          total_usuarios: parseInt(empresa.TOTAL_USUARIOS || 0),
          activos: parseInt(empresa.ACTIVOS || 0),
          inactivos: parseInt(empresa.INACTIVOS || 0)
        })),
        ubicaciones: (result.ubicaciones || []).map(ubicacion => ({
          ubicacion: ubicacion.UBICACION,
          cantidad_usuarios: parseInt(ubicacion.CANTIDAD_USUARIOS || 0),
          porcentaje: parseFloat(ubicacion.PORCENTAJE || 0)
        })),
        unidades_negocio: (result.unidades_negocio || []).map(unidad => ({
          unidades_negocio: unidad.UNIDADES_NEGOCIO,
          cantidad: parseInt(unidad.CANTIDAD || 0),
          activos: parseInt(unidad.ACTIVOS || 0),
          tasa_activacion: parseFloat(unidad.TASA_ACTIVACION || 0)
        })),
        trends: (result.trends || []).map(trend => ({
          fecha: trend.FECHA,
          total_usuarios: parseInt(trend.TOTAL_USUARIOS || 0),
          usuarios_activos: parseInt(trend.USUARIOS_ACTIVOS || 0)
        }))
      };
      
      setData(processedData);
      setLastUpdated(new Date().toLocaleTimeString());
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      
      // Datos de ejemplo para demostración cuando hay error
      setData({
        stats: {
          total_usuarios: 1250,
          usuarios_activos: 890,
          usuarios_inactivos: 360,
          porcentaje_activos: 71.2
        },
        empresas: [
          { empresas: 'Tech Corp', total_usuarios: 450, activos: 320, inactivos: 130 },
          { empresas: 'Innovation Ltd', total_usuarios: 380, activos: 280, inactivos: 100 },
          { empresas: 'Digital Solutions', total_usuarios: 250, activos: 180, inactivos: 70 },
          { empresas: 'Future Systems', total_usuarios: 170, activos: 110, inactivos: 60 }
        ],
        ubicaciones: [
          { ubicacion: 'Bogotá', cantidad_usuarios: 450, porcentaje: 36 },
          { ubicacion: 'Medellín', cantidad_usuarios: 320, porcentaje: 25.6 },
          { ubicacion: 'Cali', cantidad_usuarios: 280, porcentaje: 22.4 },
          { ubicacion: 'Barranquilla', cantidad_usuarios: 200, porcentaje: 16 }
        ],
        unidades_negocio: [
          { unidades_negocio: 'Ventas', cantidad: 380, activos: 290, tasa_activacion: 76.3 },
          { unidades_negocio: 'Marketing', cantidad: 250, activos: 180, tasa_activacion: 72.0 },
          { unidades_negocio: 'IT', cantidad: 320, activos: 240, tasa_activacion: 75.0 },
          { unidades_negocio: 'RRHH', cantidad: 180, activos: 130, tasa_activacion: 72.2 },
          { unidades_negocio: 'Finanzas', cantidad: 120, activos: 90, tasa_activacion: 75.0 }
        ],
        trends: Array.from({ length: 30 }, (_, i) => ({
          fecha: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_usuarios: 1200 + Math.floor(Math.random() * 100),
          usuarios_activos: 850 + Math.floor(Math.random() * 80)
        }))
      });
      setLastUpdated(new Date().toLocaleTimeString() + ' (datos de ejemplo)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Actualizar cada 30 segundos
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => {
    const colorClasses = {
      blue: "text-blue-600",
      green: "text-green-600", 
      red: "text-red-600",
      purple: "text-purple-600"
    };
    
    const iconColorClasses = {
      blue: "text-blue-500",
      green: "text-green-500",
      red: "text-red-500", 
      purple: "text-purple-500"
    };
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${iconColorClasses[color]}`} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex flex-col items-center justify-center py-8">
            {/* Título centrado */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Usuarios</h1>
              {lastUpdated && (
                <p className="text-sm text-gray-500">
                  Última actualización: {lastUpdated}
                  {error && <span className="text-red-500 ml-2">(Error: {error})</span>}
                </p>
              )}
            </div>
            
            {/* Controles centrados */}
            <div className="flex items-center space-x-6 mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-600">Auto-actualizar</span>
              </label>
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-md"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>

            {/* Opciones de navegación */}
            <div className="flex items-center space-x-8">
              {navigationOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <IconComponent className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                      {option.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-12">
        {/* Stats Cards */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
  <div className="max-w-6xl mx-auto">
    {/* Stats Cards Centradas */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                  <StatCard
                    title="Total Usuarios"
                    value={data?.stats?.total_usuarios?.toLocaleString() || '0'}
                    icon={Users}
                    color="blue"
                  />
                  <StatCard
                    title="Usuarios Activos"
                    value={data?.stats?.usuarios_activos?.toLocaleString() || '0'}
                    subtitle={`${data?.stats?.porcentaje_activos || 0}% del total`}
                    icon={Activity}
                    color="green"
                  />
                  <StatCard
                    title="Usuarios Inactivos"
                    value={data?.stats?.usuarios_inactivos?.toLocaleString() || '0'}
                    icon={Users}
                    color="red"
                  />
                  <StatCard
                    title="Tasa de Activación"
                    value={`${data?.stats?.porcentaje_activos || 0}%`}
                    icon={TrendingUp}
                    color="purple"
                  />
                </div>
              </div>
            </div>
          </div>


        {/* Charts Grid */}
        <div className="max-w-6xl mx-auto mb-12">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Tendencias */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Tendencia de Usuarios (30 días)</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data?.trends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fecha" 
                        tick={{fontSize: 12}}
                        tickFormatter={(date) => {
                          try {
                            return new Date(date).toLocaleDateString();
                          } catch {
                            return date;
                          }
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(date) => {
                          try {
                            return new Date(date).toLocaleDateString();
                          } catch {
                            return date;
                          }
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total_usuarios" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.3}
                        name="Total Usuarios"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="usuarios_activos" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                        name="Usuarios Activos"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Distribución por Ubicación */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Distribución por Ubicación</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data?.ubicaciones || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="cantidad_usuarios"
                        label={({ ubicacion, porcentaje }) => `${ubicacion} (${porcentaje}%)`}
                      >
                        {(data?.ubicaciones || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Grid Row 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Usuarios por Empresa */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Usuarios por Empresa</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?.empresas || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="empresas" 
                        tick={{fontSize: 12}}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="activos" fill="#10B981" name="Activos" />
                      <Bar dataKey="inactivos" fill="#EF4444" name="Inactivos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Usuarios por Unidad de Negocio */}
                <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Usuarios por Unidad de Negocio</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data?.unidades_negocio || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="unidades_negocio" 
                        tick={{fontSize: 12}}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#3B82F6" name="Total" />
                      <Bar dataKey="activos" fill="#10B981" name="Activos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;