import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart, RadialBarChart, RadialBar, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts';
import { Users, Activity, Building, MapPin, TrendingUp, RefreshCw, Target, Award, Clock, Zap, Calendar, Globe } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');

  // Colores vibrantes para los gráficos
  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];
  const GRADIENT_COLORS = [
    { start: '#6366F1', end: '#8B5CF6' },
    { start: '#10B981', end: '#06B6D4' },
    { start: '#F59E0B', end: '#EF4444' },
    { start: '#EC4899', end: '#F59E0B' }
  ];

  // Función para obtener datos del API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://172.20.158.193/inventario_navesoft/backend/DashboardUsuarios.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
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
      
      // Datos de ejemplo mejorados
      setData({
        stats: {
          total_usuarios: 1250,
          usuarios_activos: 890,
          usuarios_inactivos: 360,
          porcentaje_activos: 71.2
        },
        empresas: [
          { empresas: 'Tech Corp', total_usuarios: 450, activos: 320, inactivos: 130, crecimiento: 12.5 },
          { empresas: 'Innovation Ltd', total_usuarios: 380, activos: 280, inactivos: 100, crecimiento: 8.3 },
          { empresas: 'Digital Solutions', total_usuarios: 250, activos: 180, inactivos: 70, crecimiento: -2.1 },
          { empresas: 'Future Systems', total_usuarios: 170, activos: 110, inactivos: 60, crecimiento: 15.7 }
        ],
        ubicaciones: [
          { ubicacion: 'Bogotá', cantidad_usuarios: 450, porcentaje: 36, lat: 4.7110, lng: -74.0721 },
          { ubicacion: 'Medellín', cantidad_usuarios: 320, porcentaje: 25.6, lat: 6.2442, lng: -75.5812 },
          { ubicacion: 'Cali', cantidad_usuarios: 280, porcentaje: 22.4, lat: 3.4516, lng: -76.5320 },
          { ubicacion: 'Barranquilla', cantidad_usuarios: 200, porcentaje: 16, lat: 10.9685, lng: -74.7813 }
        ],
        unidades_negocio: [
          { unidades_negocio: 'Ventas', cantidad: 380, activos: 290, tasa_activacion: 76.3, satisfaccion: 85 },
          { unidades_negocio: 'Marketing', cantidad: 250, activos: 180, tasa_activacion: 72.0, satisfaccion: 78 },
          { unidades_negocio: 'IT', cantidad: 320, activos: 240, tasa_activacion: 75.0, satisfaccion: 92 },
          { unidades_negocio: 'RRHH', cantidad: 180, activos: 130, tasa_activacion: 72.2, satisfaccion: 80 },
          { unidades_negocio: 'Finanzas', cantidad: 120, activos: 90, tasa_activacion: 75.0, satisfaccion: 88 }
        ],
        trends: Array.from({ length: 30 }, (_, i) => ({
          fecha: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          total_usuarios: 1200 + Math.floor(Math.random() * 100) + i * 2,
          usuarios_activos: 850 + Math.floor(Math.random() * 80) + i * 1.5,
          nuevos_usuarios: Math.floor(Math.random() * 20) + 5,
          usuarios_perdidos: Math.floor(Math.random() * 10) + 2
        })),
        heatmap: Array.from({ length: 24 }, (_, hour) => ({
          hora: hour,
          lunes: Math.floor(Math.random() * 100) + 20,
          martes: Math.floor(Math.random() * 100) + 20,
          miercoles: Math.floor(Math.random() * 100) + 20,
          jueves: Math.floor(Math.random() * 100) + 20,
          viernes: Math.floor(Math.random() * 100) + 20,
          sabado: Math.floor(Math.random() * 50) + 10,
          domingo: Math.floor(Math.random() * 30) + 5
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
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/20 rounded-full animate-spin border-t-white"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent rounded-full animate-ping border-t-white/50"></div>
          </div>
          <p className="text-white text-lg mt-4">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, subtitle, icon: Icon, color = "blue", trend = null, sparkline = null }) => {
    const colorClasses = {
      blue: "from-blue-500 to-indigo-600",
      green: "from-green-500 to-emerald-600", 
      red: "from-red-500 to-pink-600",
      purple: "from-purple-500 to-violet-600",
      orange: "from-orange-500 to-amber-600"
    };
    
    return (
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} opacity-5`}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
          {sparkline && (
            <div className="mt-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkline}>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={COLORS[0]} 
                    fill={COLORS[0]} 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((pld, index) => (
            <div key={index} className="flex items-center text-sm">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: pld.color }}
              ></div>
              <span className="text-gray-600">{pld.name}: </span>
              <span className="font-semibold ml-1">{pld.value?.toLocaleString()}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'geographic', label: 'Geográfico', icon: Globe },
    { id: 'performance', label: 'Performance', icon: Target }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header mejorado */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Dashboard de Usuarios
                </h1>
                {lastUpdated && (
                  <p className="text-sm text-gray-500">
                    Última actualización: {lastUpdated}
                    {error && <span className="text-red-500 ml-2">(Error: {error})</span>}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="7">Últimos 7 días</option>
                <option value="30">Últimos 30 días</option>
                <option value="90">Últimos 3 meses</option>
              </select>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="mr-2 rounded"
                />
                <span className="text-sm text-gray-600">Auto-actualizar</span>
              </label>
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards mejoradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Usuarios"
                value={data?.stats?.total_usuarios?.toLocaleString() || '0'}
                icon={Users}
                color="blue"
                trend={5.2}
                sparkline={data?.trends?.slice(-7).map(t => ({ value: t.total_usuarios }))}
              />
              <StatCard
                title="Usuarios Activos"
                value={data?.stats?.usuarios_activos?.toLocaleString() || '0'}
                subtitle={`${data?.stats?.porcentaje_activos || 0}% del total`}
                icon={Activity}
                color="green"
                trend={3.1}
              />
              <StatCard
                title="Usuarios Inactivos"
                value={data?.stats?.usuarios_inactivos?.toLocaleString() || '0'}
                icon={Clock}
                color="red"
                trend={-1.8}
              />
              <StatCard
                title="Tasa de Activación"
                value={`${data?.stats?.porcentaje_activos || 0}%`}
                icon={Target}
                color="purple"
                trend={2.3}
              />
            </div>

            {/* Gráfico de tendencia principal mejorado */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Tendencia de Usuarios</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                    Total Usuarios
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Usuarios Activos
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    Nuevos Usuarios
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data?.trends || []}>
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="activosGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="fecha" 
                    tick={{fontSize: 12, fill: '#6b7280'}}
                    tickFormatter={(date) => {
                      try {
                        return new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                      } catch {
                        return date;
                      }
                    }}
                  />
                  <YAxis tick={{fontSize: 12, fill: '#6b7280'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="total_usuarios" 
                    stroke="#6366F1" 
                    fill="url(#totalGradient)"
                    strokeWidth={3}
                    name="Total Usuarios"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="usuarios_activos" 
                    stroke="#10B981" 
                    fill="url(#activosGradient)"
                    strokeWidth={3}
                    name="Usuarios Activos"
                  />
                  <Bar 
                    dataKey="nuevos_usuarios" 
                    fill="#F59E0B" 
                    name="Nuevos Usuarios"
                    radius={[4, 4, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico radial de unidades de negocio */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance por Unidad</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={data?.unidades_negocio || []}>
                  <RadialBar
                    dataKey="tasa_activacion"
                    cornerRadius={10}
                    fill="#6366F1"
                    label={{ position: 'insideStart', fill: '#fff', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            {/* Scatter plot de satisfacción vs activación */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Satisfacción vs Activación</h3>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart data={data?.unidades_negocio || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    dataKey="tasa_activacion" 
                    name="Tasa de Activación"
                    tick={{fontSize: 12, fill: '#6b7280'}}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="satisfaccion" 
                    name="Satisfacción"
                    tick={{fontSize: 12, fill: '#6b7280'}}
                  />
                  <ZAxis type="number" dataKey="cantidad" range={[100, 1000]} />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => `Unidad: ${label}`}
                  />
                  <Scatter 
                    dataKey="satisfaccion" 
                    fill="#8B5CF6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Heatmap de actividad por hora */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Mapa de Calor - Actividad por Hora</h3>
              <div className="grid grid-cols-24 gap-1">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="text-center">
                    {Array.from({ length: 7 }, (_, day) => {
                      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
                      const intensity = Math.random() * 100;
                      return (
                        <div
                          key={day}
                          className={`w-6 h-6 rounded mb-1 ${
                            intensity > 75 ? 'bg-indigo-600' :
                            intensity > 50 ? 'bg-indigo-400' :
                            intensity > 25 ? 'bg-indigo-200' : 'bg-gray-100'
                          }`}
                          title={`${days[day]} ${hour}:00 - ${Math.round(intensity)}% actividad`}
                        ></div>
                      );
                    })}
                    <div className="text-xs text-gray-500 mt-1">{hour}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geographic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución mejorada por ubicación */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Distribución Geográfica</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <defs>
                    {GRADIENT_COLORS.map((color, index) => (
                      <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={color.start} />
                        <stop offset="100%" stopColor={color.end} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={data?.ubicaciones || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="cantidad_usuarios"
                    label={({ ubicacion, porcentaje }) => `${ubicacion} ${porcentaje}%`}
                  >
                    {(data?.ubicaciones || []).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={`url(#gradient${index % GRADIENT_COLORS.length})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Lista de ubicaciones con métricas */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Detalles por Ubicación</h3>
              <div className="space-y-4">
                {(data?.ubicaciones || []).map((ubicacion, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div>
                        <p className="font-semibold text-gray-900">{ubicacion.ubicacion}</p>
                        <p className="text-sm text-gray-500">{ubicacion.porcentaje}% del total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{ubicacion.cantidad_usuarios}</p>
                      <p className="text-sm text-gray-500">usuarios</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Usuarios por Empresa con gradientes */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance por Empresa</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data?.empresas || []}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="empresas" 
                    tick={{fontSize: 12, fill: '#6b7280'}}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{fontSize: 12, fill: '#6b7280'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="activos" 
                    fill="url(#barGradient)" 
                    name="Activos"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="inactivos" 
                    fill="#EF4444" 
                    name="Inactivos"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Métricas de crecimiento */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Indicadores de Crecimiento</h3>
              <div className="space-y-6">
                {(data?.empresas || []).map((empresa, index) => {
                  const crecimiento = empresa.crecimiento || (Math.random() * 20 - 5);
                  return (
                    <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{empresa.empresas}</h4>
                        <div className={`flex items-center text-sm font-medium ${
                          crecimiento >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`w-4 h-4 mr-1 ${crecimiento < 0 ? 'rotate-180' : ''}`} />
                          {Math.abs(crecimiento).toFixed(1)}%
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-indigo-600">{empresa.total_usuarios}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">{empresa.activos}</p>
                          <p className="text-xs text-gray-500">Activos</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">{empresa.inactivos}</p>
                          <p className="text-xs text-gray-500">Inactivos</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(empresa.activos / empresa.total_usuarios) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {((empresa.activos / empresa.total_usuarios) * 100).toFixed(1)}% de activación
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gráfico de comparación de unidades de negocio */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Comparativo de Unidades de Negocio</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={data?.unidades_negocio || []}>
                  <defs>
                    <linearGradient id="satisfactionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="unidades_negocio" 
                    tick={{fontSize: 12, fill: '#6b7280'}}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#6b7280'}} />
                  <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#6b7280'}} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    yAxisId="left"
                    dataKey="cantidad" 
                    fill="#6366F1" 
                    name="Total Usuarios"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="left"
                    dataKey="activos" 
                    fill="#10B981" 
                    name="Activos"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="tasa_activacion" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    name="Tasa de Activación (%)"
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                  />
                  {data?.unidades_negocio?.some(u => u.satisfaccion) && (
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="satisfaccion" 
                      stroke="url(#satisfactionGradient)" 
                      strokeWidth={3}
                      name="Satisfacción (%)"
                      dot={{ fill: '#EC4899', strokeWidth: 2, r: 6 }}
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Footer con métricas adicionales */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Eficiencia Global</p>
                <p className="text-3xl font-bold">87.3%</p>
                <p className="text-indigo-200 text-sm mt-1">+2.1% vs mes anterior</p>
              </div>
              <Award className="w-12 h-12 text-indigo-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Tiempo Promedio Sesión</p>
                <p className="text-3xl font-bold">2h 34m</p>
                <p className="text-green-200 text-sm mt-1">+12min vs semana anterior</p>
              </div>
              <Clock className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Nuevos Usuarios Hoy</p>
                <p className="text-3xl font-bold">47</p>
                <p className="text-orange-200 text-sm mt-1">Meta: 50 usuarios/día</p>
              </div>
              <Zap className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Notificaciones en tiempo real */}
        <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              En vivo
            </div>
          </div>
          <div className="space-y-3">
            {[
              { time: 'Hace 2 min', event: 'Nuevo usuario registrado en Tech Corp', type: 'success' },
              { time: 'Hace 5 min', event: '15 usuarios activos en Medellín', type: 'info' },
              { time: 'Hace 8 min', event: 'Pico de actividad en unidad de Ventas', type: 'warning' },
              { time: 'Hace 12 min', event: 'Usuario inactivo reactivado en IT', type: 'success' }
            ].map((notification, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  notification.type === 'success' ? 'bg-green-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.event}</p>
                  <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;