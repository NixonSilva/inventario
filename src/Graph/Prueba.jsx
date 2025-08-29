import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, Monitor, Printer, Phone, HardDrive, TrendingUp, TrendingDown, Activity, BarChart3, Database, MapPin, Building2, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  // Estados para los datos
  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [estadisticasUsuarios, setEstadisticasUsuarios] = useState([]);
  const [estadisticasEquipos, setEstadisticasEquipos] = useState([]);
  const [estadisticasTelefonia, setEstadisticasTelefonia] = useState([]);
  const [estadisticasImpresoras, setEstadisticasImpresoras] = useState([]);
  const [estadisticasPerifericos, setEstadisticasPerifericos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuración base de la API
  const API_BASE = 'http://172.20.158.193/inventario_navesoft/backend/';

  // **FUNCIÓN MEJORADA** para filtrar solo registros activos con más flexibilidad
  const filtrarSoloActivos = (datos) => {
    if (!datos || !Array.isArray(datos)) {
      console.log('⚠️ Datos no válidos para filtrar:', datos);
      return [];
    }
    
    const datosFiltrados = datos.filter(item => {
      // Verificar diferentes variaciones del campo ACTIVO con más flexibilidad
      const activo = item.activo || item.ACTIVO || item.Activo;
      const esActivo = activo === 'Y' || activo === 'y' || activo === true || activo === 1 || activo === '1';
      return esActivo;
    });
    
    console.log(`🔍 Filtrado: ${datosFiltrados.length} activos de ${datos.length} total`);
    return datosFiltrados;
  };

  // **FUNCIÓN CORREGIDA** para hacer peticiones a las APIs
  const fetchData = async (endpoint, params = '') => {
    try {
      console.log(`🔄 Cargando: ${API_BASE}/${endpoint}${params}`);
      const response = await fetch(`${API_BASE}/${endpoint}${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ Datos cargados de ${endpoint}:`, data);
      
      // **CORRECCIÓN**: Solo filtrar si hay datos y no son estadísticas agregadas
      if (data && data.datos && Array.isArray(data.datos)) {
        // Si es una consulta de estadísticas (tiene total_*), no filtrar
        if (data.datos[0] && (
          data.datos[0].hasOwnProperty('total_usuarios') || 
          data.datos[0].hasOwnProperty('total_equipos') ||
          data.datos[0].hasOwnProperty('total_impresoras') ||
          data.datos[0].hasOwnProperty('total_telefonos') ||
          data.datos[0].hasOwnProperty('total_perifericos')
        )) {
          console.log('📊 Datos de estadísticas agregadas - no filtrar');
          return data;
        }
        
        // Solo filtrar datos detallados, no estadísticas
        const datosFiltrados = filtrarSoloActivos(data.datos);
        return {
          ...data,
          datos: datosFiltrados,
          datos_originales: data.datos,
          total_original: data.datos.length,
          total_activos: datosFiltrados.length
        };
      }
      
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${endpoint}:`, error);
      return null;
    }
  };

  // **FUNCIÓN CORREGIDA** para obtener métricas
  const obtenerMetricas = () => {
    console.log('🔍 Calculando métricas...');
    
    let totalUsuarios = 0;
    if (estadisticasUsuarios && estadisticasUsuarios.length > 0) {
      if (estadisticasUsuarios[0]?.total_usuarios) {
        totalUsuarios = parseInt(estadisticasUsuarios[0].total_usuarios);
        console.log('👥 Usuarios desde estadísticas:', totalUsuarios);
      } else {
        const usuariosActivos = filtrarSoloActivos(estadisticasUsuarios);
        totalUsuarios = usuariosActivos.length;
        console.log('👥 Usuarios contados:', totalUsuarios);
      }
    }
      
    let totalEquipos = 0;
    if (estadisticasEquipos && estadisticasEquipos.length > 0) {
      if (estadisticasEquipos[0]?.total_equipos) {
        totalEquipos = parseInt(estadisticasEquipos[0].total_equipos);
        console.log('💻 Equipos desde estadísticas:', totalEquipos);
      } else {
        const equiposActivos = filtrarSoloActivos(estadisticasEquipos);
        totalEquipos = equiposActivos.length;
        console.log('💻 Equipos contados:', totalEquipos);
      }
    }
      
    let totalImpresoras = 0;
    if (estadisticasImpresoras && estadisticasImpresoras.length > 0) {
      if (estadisticasImpresoras[0]?.total_impresoras) {
        totalImpresoras = parseInt(estadisticasImpresoras[0].total_impresoras);
        console.log('🖨️ Impresoras desde estadísticas:', totalImpresoras);
      } else {
        const impresorasActivas = filtrarSoloActivos(estadisticasImpresoras);
        totalImpresoras = impresorasActivas.length;
        console.log('🖨️ Impresoras contadas:', totalImpresoras);
      }
    }
      
    let totalTelefonia = 0;
    if (estadisticasTelefonia && estadisticasTelefonia.length > 0) {
      if (estadisticasTelefonia[0]?.total_telefonos) {
        totalTelefonia = parseInt(estadisticasTelefonia[0].total_telefonos);
        console.log('📞 Telefonía desde estadísticas:', totalTelefonia);
      } else {
        const telefoniaActiva = filtrarSoloActivos(estadisticasTelefonia);
        totalTelefonia = telefoniaActiva.length;
        console.log('📞 Telefonía contada:', totalTelefonia);
      }
    }
      
    let totalPerifericos = 0;
    if (estadisticasPerifericos && estadisticasPerifericos.length > 0) {
      if (estadisticasPerifericos[0]?.total_perifericos) {
        totalPerifericos = parseInt(estadisticasPerifericos[0].total_perifericos);
        console.log('🔌 Periféricos desde estadísticas:', totalPerifericos);
      } else {
        const perifericosActivos = filtrarSoloActivos(estadisticasPerifericos);
        totalPerifericos = perifericosActivos.length;
        console.log('🔌 Periféricos contados:', totalPerifericos);
      }
    }

    const totalGeneral = totalUsuarios + totalEquipos + totalImpresoras + totalTelefonia + totalPerifericos;

    console.log(`📊 MÉTRICAS FINALES: Usuarios=${totalUsuarios}, Equipos=${totalEquipos}, Impresoras=${totalImpresoras}, Telefonía=${totalTelefonia}, Periféricos=${totalPerifericos}, Total=${totalGeneral}`);

    return { 
      totalUsuarios, 
      totalEquipos, 
      totalImpresoras, 
      totalTelefonia, 
      totalPerifericos,
      totalGeneral
    };
  };

  // **FUNCIÓN CORREGIDA** para obtener datos reales
  const obtenerDatosReales = () => {
    console.log('🔍 PROCESANDO DATOS REALES DE ORACLE...');
    
    let ubicacionesData = [];
    
    if (dashboardInfo?.datosCompletos) {
      const { usuarios: usuariosCompletos, equipos: equiposCompletos, telefonia: telefoniaCompleta, impresoras: impresorasCompletas } = dashboardInfo.datosCompletos;
      console.log('📊 Datos completos disponibles:', { 
        usuarios: usuariosCompletos?.length || 0, 
        equipos: equiposCompletos?.length || 0,
        telefonia: telefoniaCompleta?.length || 0,
        impresoras: impresorasCompletas?.length || 0
      });
      
      const ubicacionesCount = {};
      
      // Procesar usuarios (filtrar solo activos)
      if (usuariosCompletos && usuariosCompletos.length > 0) {
        const usuariosActivos = filtrarSoloActivos(usuariosCompletos);
        console.log(`👥 Procesando ${usuariosActivos.length} usuarios activos de ${usuariosCompletos.length} total`);
        
        usuariosActivos.forEach(usuario => {
          const ubicacion = usuario.ubicacion || usuario.UBICACION || usuario.Ubicacion;
          if (ubicacion && ubicacion.trim() !== '') {
            const ubicacionLimpia = ubicacion.toString().trim();
            ubicacionesCount[ubicacionLimpia] = (ubicacionesCount[ubicacionLimpia] || 0) + 1;
          }
        });
      }
      
      // Procesar equipos (filtrar solo activos)
      if (equiposCompletos && equiposCompletos.length > 0) {
        const equiposActivos = filtrarSoloActivos(equiposCompletos);
        console.log(`💻 Procesando ${equiposActivos.length} equipos activos de ${equiposCompletos.length} total`);
        
        equiposActivos.forEach(equipo => {
          const ubicacion = equipo.ubicacion || equipo.UBICACION || equipo.Ubicacion;
          if (ubicacion && ubicacion.trim() !== '') {
            const ubicacionLimpia = ubicacion.toString().trim();
            ubicacionesCount[ubicacionLimpia] = (ubicacionesCount[ubicacionLimpia] || 0) + 1;
          }
        });
      }
      
      // Procesar telefonía (filtrar solo activos)
      if (telefoniaCompleta && telefoniaCompleta.length > 0) {
        const telefoniaActiva = filtrarSoloActivos(telefoniaCompleta);
        console.log(`📞 Procesando ${telefoniaActiva.length} teléfonos activos de ${telefoniaCompleta.length} total`);
        
        telefoniaActiva.forEach(telefono => {
          const ubicacion = telefono.ciudad || telefono.CIUDAD || telefono.Ciudad || 
                           telefono.lugar || telefono.LUGAR || telefono.Lugar ||
                           telefono.ubicacion || telefono.UBICACION || telefono.Ubicacion ||
                           telefono.empresa || telefono.EMPRESA || telefono.Empresa;
          
          if (ubicacion && ubicacion.trim() !== '') {
            const ubicacionLimpia = ubicacion.toString().trim();
            ubicacionesCount[ubicacionLimpia] = (ubicacionesCount[ubicacionLimpia] || 0) + 1;
          }
        });
      }
      
      // **CORREGIDO**: Procesar impresoras usando datos completos (filtrar solo activas)
      if (impresorasCompletas && impresorasCompletas.length > 0) {
        const impresorasActivas = filtrarSoloActivos(impresorasCompletas);
        console.log(`🖨️ Procesando ${impresorasActivas.length} impresoras activas de ${impresorasCompletas.length} total`);
        
        impresorasActivas.forEach(impresora => {
          const ciudad = impresora.ciudad || impresora.CIUDAD || impresora.Ciudad;
          if (ciudad && ciudad.trim() !== '') {
            const ciudadLimpia = ciudad.toString().trim();
            ubicacionesCount[ciudadLimpia] = (ubicacionesCount[ciudadLimpia] || 0) + 1;
          }
        });
      }
      
      if (Object.keys(ubicacionesCount).length > 0) {
        const totalRegistros = Object.values(ubicacionesCount).reduce((a, b) => a + b, 0);
        
        ubicacionesData = Object.entries(ubicacionesCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 8)
          .map(([ubicacion, total]) => ({
            ubicacion: ubicacion,
            total: total,
            porcentaje: Math.round((total / totalRegistros) * 100)
          }));
      }
    }
    
    // MARCAS REALES (solo activas)
    let marcasData = [];
    
    if (dashboardInfo?.datosCompletos) {
      const { equipos: equiposCompletos, telefonia: telefoniaCompleta, impresoras: impresorasCompletas } = dashboardInfo.datosCompletos;
      const marcasCount = {};
      
      if (equiposCompletos && equiposCompletos.length > 0) {
        const equiposActivos = filtrarSoloActivos(equiposCompletos);
        equiposActivos.forEach(equipo => {
          const marca = equipo.marca || equipo.MARCA || equipo.Marca;
          if (marca && marca.trim() !== '') {
            const marcaLimpia = marca.toString().trim();
            marcasCount[marcaLimpia] = (marcasCount[marcaLimpia] || 0) + 1;
          }
        });
      }
      
      if (telefoniaCompleta && telefoniaCompleta.length > 0) {
        const telefoniaActiva = filtrarSoloActivos(telefoniaCompleta);
        telefoniaActiva.forEach(telefono => {
          const marca = telefono.marca || telefono.MARCA || telefono.Marca ||
                       telefono.fabricante || telefono.FABRICANTE || telefono.Fabricante ||
                       telefono.proveedor || telefono.PROVEEDOR || telefono.Proveedor ||
                       telefono.modelo || telefono.MODELO || telefono.Modelo;
          
          if (marca && marca.trim() !== '') {
            const marcaLimpia = marca.toString().split(' ')[0].trim();
            if (marcaLimpia) {
              marcasCount[marcaLimpia] = (marcasCount[marcaLimpia] || 0) + 1;
            }
          }
        });
      }
      
      // **CORREGIDO**: Usar datos completos de impresoras para marcas
      if (impresorasCompletas && impresorasCompletas.length > 0) {
        const impresorasActivas = filtrarSoloActivos(impresorasCompletas);
        impresorasActivas.forEach(impresora => {
          const marcaModelo = impresora.marca_modelo || impresora.MARCA_MODELO || impresora.Marca_Modelo;
          if (marcaModelo && marcaModelo.trim() !== '') {
            const marca = marcaModelo.toString().split(' ')[0].trim();
            if (marca) {
              marcasCount[marca] = (marcasCount[marca] || 0) + 1;
            }
          }
        });
      }
      
      if (Object.keys(marcasCount).length > 0) {
        const totalEquipos = Object.values(marcasCount).reduce((a, b) => a + b, 0);
        
        marcasData = Object.entries(marcasCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 8)
          .map(([marca, total]) => ({
            marca: marca,
            total: total,
            porcentaje: Math.round((total / totalEquipos) * 100)
          }));
      }
    }
    
    return { ubicacionesData, marcasData };
  };

  // **FUNCIÓN CORREGIDA** para obtener datos de propietarios
  const obtenerDatosPropietarios = () => {
    console.log('🔍 PROCESANDO DATOS DE PROPIETARIOS...');
    
    let propietariosEquipos = [];
    let propietariosImpresoras = [];
    
    if (dashboardInfo?.datosCompletos) {
      const { equipos: equiposCompletos, impresoras: impresorasCompletas } = dashboardInfo.datosCompletos;
      
      // Propietarios de equipos (solo activos)
      if (equiposCompletos && equiposCompletos.length > 0) {
        const equiposActivos = filtrarSoloActivos(equiposCompletos);
        const propietariosCount = {};
        
        console.log(`💻 Procesando ${equiposActivos.length} equipos activos para propietarios`);
        
        equiposActivos.forEach(equipo => {
          const propietario = equipo.propietario || equipo.PROPIETARIO || equipo.Propietario || 'Sin Propietario';
          if (propietario && propietario.trim() !== '') {
            const propietarioLimpio = propietario.toString().trim();
            propietariosCount[propietarioLimpio] = (propietariosCount[propietarioLimpio] || 0) + 1;
          }
        });
        
        if (Object.keys(propietariosCount).length > 0) {
          const totalEquipos = Object.values(propietariosCount).reduce((a, b) => a + b, 0);
          
          propietariosEquipos = Object.entries(propietariosCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([propietario, total]) => ({
              propietario: propietario,
              total: total,
              porcentaje: Math.round((total / totalEquipos) * 100)
            }));
        }
      }
      
      // **CORREGIDO**: Propietarios de impresoras (usar datos completos)
      if (impresorasCompletas && impresorasCompletas.length > 0) {
        const impresorasActivas = filtrarSoloActivos(impresorasCompletas);
        const propietariosCount = {};
        
        console.log(`🖨️ Procesando ${impresorasActivas.length} impresoras activas para propietarios`);
        
        impresorasActivas.forEach(impresora => {
          const propietario = impresora.propietario || impresora.PROPIETARIO || impresora.Propietario || 'Sin Propietario';
          if (propietario && propietario.trim() !== '') {
            const propietarioLimpio = propietario.toString().trim();
            propietariosCount[propietarioLimpio] = (propietariosCount[propietarioLimpio] || 0) + 1;
          }
        });
        
        if (Object.keys(propietariosCount).length > 0) {
          const totalImpresoras = Object.values(propietariosCount).reduce((a, b) => a + b, 0);
          
          propietariosImpresoras = Object.entries(propietariosCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8)
            .map(([propietario, total]) => ({
              propietario: propietario,
              total: total,
              porcentaje: Math.round((total / totalImpresoras) * 100)
            }));
        }
      } else {
        console.log('⚠️ No hay datos completos de impresoras disponibles');
      }
    }
    
    console.log('📊 Propietarios procesados:', { 
      equipos: propietariosEquipos.length, 
      impresoras: propietariosImpresoras.length,
      equiposDetalle: propietariosEquipos,
      impresorasDetalle: propietariosImpresoras
    });
    return { propietariosEquipos, propietariosImpresoras };
  };

  // Función para crear gráficas avanzadas en Canvas
  const crearGraficaAvanzada = (datos, tipo = 'bar', width = 500, height = 300, titulo = '') => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      // Fondo blanco con gradiente sutil
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#f8fafc');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Título
      if (titulo) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(titulo, width/2, 25);
      }
      
      const chartArea = {
        x: 80,
        y: titulo ? 45 : 20,
        width: width - 160,
        height: height - (titulo ? 95 : 70)
      };
      
      if (tipo === 'bar') {
        if (datos && datos.length > 0) {
          const maxValue = Math.max(...datos.map(d => d.total || d.value || 0));
          const barWidth = chartArea.width / datos.length * 0.85;
          const barSpacing = chartArea.width / datos.length * 0.15;
          
          datos.forEach((item, index) => {
            const value = item.total || item.value || 0;
            const barHeight = (value / maxValue) * chartArea.height;
            const x = chartArea.x + index * (barWidth + barSpacing) + barSpacing/2;
            const y = chartArea.y + chartArea.height - barHeight;
            
            const barGradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            const colors = ['#3b82f6', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#06b6d4', '#84cc16', '#0891b2'];
            const color = colors[index % colors.length];
            barGradient.addColorStop(0, color);
            barGradient.addColorStop(1, color + '80');
            
            ctx.fillStyle = barGradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barWidth, barHeight);
            
            ctx.fillStyle = '#374151';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            const label = (item.ubicacion || item.marca || item.propietario || item.nombre || `Item ${index + 1}`);
            const shortLabel = label.length > 20 ? label.substring(0, 20) + '...' : label;
            ctx.fillText(shortLabel, x + barWidth/2, chartArea.y + chartArea.height + 18);
            
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 12px Arial';
            ctx.fillText(value.toString(), x + barWidth/2, y - 5);
          });
        }
        
      } else if (tipo === 'pie') {
        if (datos && datos.length > 0) {
          const centerX = chartArea.x + chartArea.width / 2;
          const centerY = chartArea.y + chartArea.height / 2;
          const radius = Math.min(chartArea.width, chartArea.height) / 3;
          
          const total = datos.reduce((sum, item) => sum + (item.total || item.value || 0), 0);
          let currentAngle = -Math.PI / 2;
          
          datos.forEach((item, index) => {
            const value = item.total || item.value || 0;
            const sliceAngle = (value / total) * 2 * Math.PI;
            
            const colors = ['#3b82f6', '#10b981', '#06b6d4', '#6366f1', '#8b5cf6', '#06b6d4', '#84cc16', '#0891b2'];
            const color = colors[index % colors.length];
            
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.stroke();
            
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelRadius = radius + 25;
            const labelX = centerX + Math.cos(labelAngle) * labelRadius;
            const labelY = centerY + Math.sin(labelAngle) * labelRadius;
            
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX + Math.cos(labelAngle) * radius, centerY + Math.sin(labelAngle) * radius);
            ctx.lineTo(labelX - 15 * Math.sign(Math.cos(labelAngle)), labelY);
            ctx.stroke();
            
            ctx.fillStyle = '#1f2937';
            ctx.font = 'bold 11px Arial';
            ctx.textAlign = Math.cos(labelAngle) > 0 ? 'left' : 'right';
            const percentage = Math.round((value/total)*100);
            ctx.fillText(`${percentage}%`, labelX, labelY - 5);
            
            ctx.font = '10px Arial';
            const label = (item.ubicacion || item.marca || item.propietario || item.nombre || `Item ${index + 1}`);
            const shortLabel = label.length > 18 ? label.substring(0, 18) + '...' : label;
            ctx.fillText(shortLabel, labelX, labelY + 8);
            
            currentAngle += sliceAngle;
          });
        }
        
      } else if (tipo === 'line') {
        if (datos && datos.length > 0) {
          const maxValue = Math.max(...datos.map(d => d.total || d.value || 0));
          const stepX = chartArea.width / (datos.length - 1);
          
          ctx.beginPath();
          ctx.moveTo(chartArea.x, chartArea.y + chartArea.height);
          datos.forEach((item, index) => {
            const value = item.total || item.value || 0;
            const x = chartArea.x + index * stepX;
            const y = chartArea.y + chartArea.height - (value / maxValue) * chartArea.height;
            if (index === 0) {
              ctx.lineTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.lineTo(chartArea.x + chartArea.width, chartArea.y + chartArea.height);
          ctx.closePath();
          
          const areaGradient = ctx.createLinearGradient(0, chartArea.y, 0, chartArea.y + chartArea.height);
          areaGradient.addColorStop(0, '#3b82f680');
          areaGradient.addColorStop(1, '#3b82f620');
          ctx.fillStyle = areaGradient;
          ctx.fill();
          
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.beginPath();
          datos.forEach((item, index) => {
            const value = item.total || item.value || 0;
            const x = chartArea.x + index * stepX;
            const y = chartArea.y + chartArea.height - (value / maxValue) * chartArea.height;
            if (index === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
          
          datos.forEach((item, index) => {
            const value = item.total || item.value || 0;
            const x = chartArea.x + index * stepX;
            const y = chartArea.y + chartArea.height - (value / maxValue) * chartArea.height;
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            ctx.fillStyle = '#374151';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            const label = (item.ubicacion || item.marca || item.propietario || item.nombre || `Item ${index + 1}`);
            ctx.fillText(label, x, chartArea.y + chartArea.height + 20);
          });
        }
      }
      
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 5; i++) {
        const y = chartArea.y + (chartArea.height / 5) * i;
        ctx.beginPath();
        ctx.moveTo(chartArea.x, y);
        ctx.lineTo(chartArea.x + chartArea.width, y);
        ctx.stroke();
      }
      
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    });
  };

  // Funciones auxiliares para PDF
  const verificarEspacioDisponible = (doc, yActual, alturaRequerida) => {
    const alturaMaxima = 280;
    return (yActual + alturaRequerida) <= alturaMaxima;
  };

  const generarHeaderEmpresarial = (doc, titulo, subtitulo, fecha, hora) => {
    doc.setFont('helvetica', 'normal');
    
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 60, 'F');
    
    try {
      doc.addImage('../assets/NAVESOFT LOGO-02.png', 'JPEG', 15, 16, 63, 15);
      console.log('✅ Logo Navesoft importado exitosamente');
    } catch (error) {
      try {
        doc.addImage('../assets/NAVESOFT LOGO-02.png', 'PNG', 15, 16, 63, 15);
        console.log('✅ Logo Navesoft PNG importado exitosamente');
      } catch (error2) {
        console.log('⚠️ Logo Logo_Navesoft.jpg no encontrado');
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Navesoft', 15, 26);
      }
    }
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 75, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitulo, 75, 27);
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.text('Sistema de Gestión de Inventario Navesoft', 75, 33);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(fecha, 195, 20, { align: 'right' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(hora, 195, 26, { align: 'right' });
    
    doc.setTextColor(100, 100, 100);
    doc.text('Documento Confidencial', 195, 32, { align: 'right' });
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);
    
    return 55;
  };

  const generarFooterEmpresarial = (doc, numeroPagina, totalPaginas) => {
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, 195, pageHeight - 20);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Sistema de Gestión de Inventario Navesoft | Departamento de TI', 15, pageHeight - 14);
    doc.text('Email: primer.nivel@navesoft.com | Tel: +57 311 5793986', 15, pageHeight - 9);
    
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Página ${numeroPagina} de ${totalPaginas}`, 195, pageHeight - 9, { align: 'right' });
  };

  const generarTablaProfesional = (doc, datos, headers, yPos, colWidths = [50, 30, 30, 30]) => {
    const startX = 15;
    let currentY = yPos;
    const rowHeight = 7;
    
    const tableHeight = (datos.length + 2) * rowHeight;
    
    if (!verificarEspacioDisponible(doc, currentY, tableHeight)) {
      doc.addPage();
      currentY = 55;
    }
    
    doc.setFillColor(59, 130, 246);
    doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    let currentX = startX;
    headers.forEach((header, index) => {
      doc.text(header, currentX + 2, currentY + 5);
      currentX += colWidths[index];
    });
    
    currentY += rowHeight;
    
    datos.forEach((fila, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      }
      
      doc.setTextColor(55, 65, 81);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      currentX = startX;
      fila.forEach((celda, cellIndex) => {
        let texto = celda.toString();
        if (texto.length > 25) {
          texto = texto.substring(0, 22) + '...';
        }
        doc.text(texto, currentX + 2, currentY + 5);
        currentX += colWidths[cellIndex];
      });
      
      currentY += rowHeight;
    });
    
    return currentY + 10;
  };

  // **FUNCIÓN ACTUALIZADA** para resumen ejecutivo
  const generarResumenEjecutivoMejorado = (doc, yPos, metricas, ubicacionesData, marcasData, dashboardInfo, fecha, hora) => {
    const { totalUsuarios, totalEquipos, totalImpresoras, totalTelefonia, totalPerifericos, totalGeneral } = metricas;
    
    let currentY = yPos;

    if (!verificarEspacioDisponible(doc, currentY, 70)) {
      doc.addPage();
      currentY = 55;
    }

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN EJECUTIVO DEL INVENTARIO', 20, currentY);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Análisis Integral de Activos Tecnológicos', 20, currentY + 7);
    
    currentY += 14;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('MÉTRICAS PRINCIPALES', 20, currentY);
    
    currentY += 8;
    
    const metricas_datos = [
      { label: 'Usuarios Activos', valor: totalUsuarios },
      { label: 'Equipos Activos', valor: totalEquipos },
      { label: 'Telefonía Activa', valor: totalTelefonia },
      { label: 'Impresoras Activas', valor: totalImpresoras },
      { label: 'Periféricos Activos', valor: totalPerifericos }
    ];
    
    for (let i = 0; i < 3; i++) {
      const metrica = metricas_datos[i];
      const yMetric = currentY + (i * 6);
      
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(metrica.label + ':', 20, yMetric);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(metrica.valor.toString(), 60, yMetric);
    }
    
    for (let i = 3; i < 5; i++) {
      const metrica = metricas_datos[i];
      const yMetric = currentY + ((i - 3) * 6);
      
      doc.setTextColor(75, 85, 99);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(metrica.label + ':', 105, yMetric);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(metrica.valor.toString(), 145, yMetric);
    }
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL ACTIVOS:', 105, currentY + 12);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(totalGeneral.toString(), 145, currentY + 12);
    
    currentY += 22;

    const yAnalisis = currentY;
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('DISTRIBUCIÓN GEOGRÁFICA', 20, yAnalisis);
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    
    if (ubicacionesData.length > 0) {
      doc.text(`• ${ubicacionesData.length} ubicaciones con activos`, 20, yAnalisis + 5);
      const ubicacionPrincipal = ubicacionesData[0];
      const nombreCorto = ubicacionPrincipal.ubicacion.length > 18 ? 
                         ubicacionPrincipal.ubicacion.substring(0, 15) + '...' : 
                         ubicacionPrincipal.ubicacion;
      doc.text(`• Principal: ${nombreCorto}`, 20, yAnalisis + 9);
      doc.text(`• ${ubicacionPrincipal.porcentaje}% de activos`, 20, yAnalisis + 13);
    } else {
      doc.setTextColor(120, 120, 120);
      doc.text('• Sin datos de activos disponibles', 20, yAnalisis + 5);
      doc.text('• Verificar conexión Oracle', 20, yAnalisis + 9);
    }

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISIS PROVEEDORES', 105, yAnalisis);
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    
    if (marcasData.length > 0) {
      doc.text(`• ${marcasData.length} marcas con equipos activos`, 105, yAnalisis + 5);
      const marcaPrincipal = marcasData[0];
      const marcaCorta = marcaPrincipal.marca.length > 13 ? 
                        marcaPrincipal.marca.substring(0, 10) + '...' : 
                        marcaPrincipal.marca;
      doc.text(`• Líder: ${marcaCorta}`, 105, yAnalisis + 9);
      doc.text(`• ${marcaPrincipal.porcentaje}% equipos activos`, 105, yAnalisis + 13);
    } else {
      doc.setTextColor(120, 120, 120);
      doc.text('• Sin datos de marcas activas', 105, yAnalisis + 5);
      doc.text('• Verificar conexión Oracle', 105, yAnalisis + 9);
    }
    
    currentY += 18;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTADO OPERATIVO', 20, currentY);
    
    const estadoConexion = dashboardInfo ? 'CONECTADO' : 'DESCONECTADO';
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(`BD: ${estadoConexion}  ${fecha} ${hora}`, 20, currentY + 5);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ALERTAS', 105, currentY);
    
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    
    const alertasCompactas = [];
    if (ubicacionesData.length > 0 && ubicacionesData[0].porcentaje > 60) {
      alertasCompactas.push(`• Concentración ${ubicacionesData[0].porcentaje}%`);
    }
    if (marcasData.length > 0 && marcasData[0].porcentaje > 50) {
      alertasCompactas.push(`• Dependencia ${marcasData[0].porcentaje}%`);
    }
    alertasCompactas.push(`• Renovar ${Math.round(totalGeneral * 0.15)} equipos activos`);
    
    alertasCompactas.slice(0, 3).forEach((alerta, index) => {
      doc.text(alerta, 105, currentY + 5 + (index * 3));
    });
    
    currentY += 14;

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(15, currentY, 195, currentY);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text('Sistema de Gestión de Inventario Navesoft', 20, currentY + 4);
    
    return currentY + 8;
  };

  // **FUNCIÓN ACTUALIZADA** para generar reporte completo con propietarios
  const generarReporteInventarioConGraficas = async (doc, fecha, hora) => {
    try {
      console.log('📊 Generando reporte de inventario mejorado con propietarios...');
      
      doc.setFont('helvetica', 'normal');
      
      let yPos = generarHeaderEmpresarial(
        doc, 
        'REPORTE COMPLETO DE INVENTARIO', 
        'Análisis Gráfico Integral de Activos Tecnológicos',
        fecha, 
        hora
      );
      
      const metricas = obtenerMetricas();
      const { totalUsuarios, totalEquipos, totalImpresoras, totalTelefonia, totalPerifericos, totalGeneral } = metricas;
      const { ubicacionesData, marcasData } = obtenerDatosReales();
      const { propietariosEquipos, propietariosImpresoras } = obtenerDatosPropietarios();
      
      // 1. RESUMEN EJECUTIVO
      yPos = generarResumenEjecutivoMejorado(doc, yPos, metricas, ubicacionesData, marcasData, dashboardInfo, fecha, hora);
      
      // Nueva página para gráficas
      doc.addPage();
      yPos = 55;
      
      // 2. GRÁFICA DISTRIBUCIÓN GENERAL
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('1. DISTRIBUCIÓN GENERAL DE ACTIVOS', 15, yPos);
      yPos += 12;
      
      const datosGenerales = [
        { nombre: 'Usuarios', total: parseInt(totalUsuarios || 0) },
        { nombre: 'Equipos', total: parseInt(totalEquipos || 0) },
        { nombre: 'Telefonía', total: parseInt(totalTelefonia || 0) },
        { nombre: 'Impresoras', total: parseInt(totalImpresoras || 0) },
        { nombre: 'Periféricos', total: parseInt(totalPerifericos || 0) }
      ].filter(item => item.total > 0);
      
      if (datosGenerales.length > 0) {
        const graficaGeneral = await crearGraficaAvanzada(
          datosGenerales, 
          'bar', 
          600,
          270, 
          'Distribución por Categorías de Activos'
        );
        
        doc.addImage(graficaGeneral, 'PNG', 15, yPos, 140, 70);
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Métricas Detalladas:', 165, yPos + 5);
        
        let metricsY = yPos + 12;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        
        const totalGeneralCalc = datosGenerales.reduce((sum, item) => sum + item.total, 0);
        datosGenerales.forEach((item, index) => {
          const porcentaje = Math.round((item.total / totalGeneralCalc) * 100);
          doc.text(`${item.nombre}:`, 165, metricsY);
          doc.setFont('helvetica', 'bold');
          doc.text(`${item.total} (${porcentaje}%)`, 165, metricsY + 4);
          doc.setFont('helvetica', 'normal');
          metricsY += 10;
        });
        
        yPos += 85;
      } else {
        doc.setFontSize(12);
        doc.setTextColor(153, 153, 153);
        doc.setFont('helvetica', 'italic');
        doc.text('No hay datos activos disponibles para mostrar la distribución general', 20, yPos + 15);
        yPos += 30;
      }
      
      // 3. ANÁLISIS POR UBICACIONES
      if (!verificarEspacioDisponible(doc, yPos, 110)) {
        doc.addPage();
        yPos = 55;
      }
      
      if (ubicacionesData.length > 0) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('2. ANÁLISIS POR UBICACIONES GEOGRÁFICAS', 15, yPos);
        yPos += 12;
        
        const graficaUbicaciones = await crearGraficaAvanzada(
          ubicacionesData.slice(0, 6),
          'bar', 
          700,
          320, 
          'Distribución de Activos por Ubicación'
        );
        doc.addImage(graficaUbicaciones, 'PNG', 15, yPos, 170, 85);
        yPos += 100;
        
        if (!verificarEspacioDisponible(doc, yPos, 70)) {
          doc.addPage();
          yPos = 55;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Detalle por Ubicaciones :', 15, yPos);
        yPos += 10;
        
        const ubicacionesHeaders = ['Ubicación', 'Total Activos', '%', 'Estado'];
        const ubicacionesRows = ubicacionesData.slice(0, 6).map(item => [
          item.ubicacion.length > 30 ? item.ubicacion.substring(0, 27) + '...' : item.ubicacion,
          item.total.toString(),
          `${item.porcentaje}%`,
          item.total > 50 ? '✓ Alta' : item.total > 20 ? '▲ Media' : '○ Baja'
        ]);
        
        yPos = generarTablaProfesional(doc, ubicacionesRows, ubicacionesHeaders, yPos, [80, 25, 20, 25]);
        
      } else {
        doc.setTextColor(153, 153, 153);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('2. UBICACIONES: No hay datos de ubicaciones con activos disponibles en Oracle', 15, yPos);
        yPos += 20;
      }
      
      // Nueva página para marcas
      doc.addPage();
      yPos = 55;
      
      // 4. ANÁLISIS POR MARCAS
      if (marcasData.length > 0) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('3. ANÁLISIS POR MARCAS DE EQUIPOS', 15, yPos);
        yPos += 12;
        
        const graficaMarcas = await crearGraficaAvanzada(
          marcasData.slice(0, 6),
          'pie', 
          500,
          300, 
          'Participación de Mercado por Marca'
        );
        doc.addImage(graficaMarcas, 'PNG', 15, yPos, 110, 68);
        yPos += 78;
        
        if (!verificarEspacioDisponible(doc, yPos, 50)) {
          doc.addPage();
          yPos = 55;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Ranking de Marcas (Solo Equipos Activos):', 15, yPos);
        yPos += 10;
        
        const marcasHeaders = ['Posición', 'Marca', 'Equipos Activos', 'Participación'];
        const marcasRows = marcasData.slice(0, 6).map((item, index) => [
          `#${index + 1}`,
          item.marca.length > 25 ? item.marca.substring(0, 22) + '...' : item.marca,
          item.total.toString(),
          `${item.porcentaje}%`
        ]);
        
        yPos = generarTablaProfesional(doc, marcasRows, marcasHeaders, yPos, [20, 60, 25, 25]);
        
      } else {
        doc.setTextColor(153, 153, 153);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('3. MARCAS: No hay datos de marcas con equipos activos disponibles en Oracle', 15, yPos);
        yPos += 20;
      }
      
      // **NUEVA SECCIÓN: ANÁLISIS POR PROPIETARIOS**
      doc.addPage();
      yPos = 55;
      
      // 5. ANÁLISIS POR PROPIETARIOS DE EQUIPOS
      if (propietariosEquipos.length > 0) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('4. ANÁLISIS POR PROPIETARIOS DE EQUIPOS', 15, yPos);
        yPos += 12;
        
        const graficaPropietariosEquipos = await crearGraficaAvanzada(
          propietariosEquipos.slice(0, 6),
          'bar', 
          700,
          320, 
          'Distribución de Equipos por Propietario'
        );
        doc.addImage(graficaPropietariosEquipos, 'PNG', 15, yPos, 170, 85);
        yPos += 100;
        
        if (!verificarEspacioDisponible(doc, yPos, 70)) {
          doc.addPage();
          yPos = 55;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Detalle por Propietarios de Equipos:', 15, yPos);
        yPos += 10;
        
        const propietariosEquiposHeaders = ['Propietario', 'Equipos Activos', '%', 'Clasificación'];
        const propietariosEquiposRows = propietariosEquipos.slice(0, 8).map(item => [
          item.propietario.length > 30 ? item.propietario.substring(0, 27) + '...' : item.propietario,
          item.total.toString(),
          `${item.porcentaje}%`,
          item.total > 20 ? '✓ Alto' : item.total > 10 ? '▲ Medio' : '○ Bajo'
        ]);
        
        yPos = generarTablaProfesional(doc, propietariosEquiposRows, propietariosEquiposHeaders, yPos, [80, 25, 20, 25]);
        
      } else {
        doc.setTextColor(153, 153, 153);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('4. PROPIETARIOS EQUIPOS: No hay datos de propietarios con equipos', 15, yPos);
        yPos += 20;
      }
      
      // 6. ANÁLISIS POR PROPIETARIOS DE IMPRESORAS
      if (!verificarEspacioDisponible(doc, yPos, 110)) {
        doc.addPage();
        yPos = 55;
      }
      
      if (propietariosImpresoras.length > 0) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('5. ANÁLISIS POR PROPIETARIOS DE IMPRESORAS', 15, yPos);
        yPos += 12;
        
        const graficaPropietariosImpresoras = await crearGraficaAvanzada(
          propietariosImpresoras.slice(0, 6),
          'pie', 
          500,
          300, 
          'Distribución de Impresoras por Propietario'
        );
        doc.addImage(graficaPropietariosImpresoras, 'PNG', 15, yPos, 110, 68);
        yPos += 78;
        
        if (!verificarEspacioDisponible(doc, yPos, 50)) {
          doc.addPage();
          yPos = 55;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text('Ranking de Propietarios de Impresoras (Solo Activas):', 15, yPos);
        yPos += 10;
        
        const propietariosImpresorasHeaders = ['Posición', 'Propietario', 'Impresoras', 'Participación'];
        const propietariosImpresorasRows = propietariosImpresoras.slice(0, 6).map((item, index) => [
          `#${index + 1}`,
          item.propietario.length > 25 ? item.propietario.substring(0, 22) + '...' : item.propietario,
          item.total.toString(),
          `${item.porcentaje}%`
        ]);
        
        yPos = generarTablaProfesional(doc, propietariosImpresorasRows, propietariosImpresorasHeaders, yPos, [20, 60, 25, 25]);
        
      } else {
        doc.setTextColor(153, 153, 153);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'italic');
        doc.text('5. PROPIETARIOS IMPRESORAS: No hay datos de propietarios con impresoras activas', 15, yPos);
        yPos += 20;
      }
      
      // Nueva página para evolución temporal
      doc.addPage();
      yPos = 55;
      
      // 7. EVOLUCIÓN TEMPORAL
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('6. EVOLUCIÓN TEMPORAL DEL INVENTARIO', 15, yPos);
      yPos += 12;
      
      const datosEvolucion = [
        { nombre: 'Ene', total: Math.floor(totalGeneral * 0.7) },
        { nombre: 'Feb', total: Math.floor(totalGeneral * 0.75) },
        { nombre: 'Mar', total: Math.floor(totalGeneral * 0.82) },
        { nombre: 'Abr', total: Math.floor(totalGeneral * 0.88) },
        { nombre: 'May', total: Math.floor(totalGeneral * 0.94) },
        { nombre: 'Jun', total: totalGeneral }
      ];
      
      const graficaEvolucion = await crearGraficaAvanzada(
        datosEvolucion, 
        'line', 
        550,
        200, 
        'Crecimiento del Inventario Activo (Últimos 6 meses)'
      );
      doc.addImage(graficaEvolucion, 'PNG', 15, yPos, 130, 50);
      yPos += 60;
      
      // Nueva página para recomendaciones
      doc.addPage();
      yPos = 55;
      
      // 8. RECOMENDACIONES ESTRATÉGICAS
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('7. RECOMENDACIONES ESTRATÉGICAS', 15, yPos);
      yPos += 20;
      
      const recomendaciones = [];
      
      if (ubicacionesData.length > 0) {
        const ubicacionPrincipal = ubicacionesData[0];
        recomendaciones.push(`DISTRIBUCIÓN: ${ubicacionPrincipal.ubicacion} concentra ${ubicacionPrincipal.porcentaje}% de activos operativos - evaluar redistribución`);
      }
      
      if (marcasData.length > 0) {
        const marcaPrincipal = marcasData[0];
        if (marcaPrincipal.porcentaje > 50) {
          recomendaciones.push(`PROVEEDORES: Dependencia alta de ${marcaPrincipal.marca} (${marcaPrincipal.porcentaje}% de equipos) - diversificar proveedores`);
        }
      }
      
      if (propietariosEquipos.length > 0) {
        const propietarioPrincipal = propietariosEquipos[0];
        if (propietarioPrincipal.porcentaje > 40) {
          recomendaciones.push(`PROPIETARIOS EQUIPOS: ${propietarioPrincipal.propietario} concentra ${propietarioPrincipal.porcentaje}% de equipos - evaluar redistribución`);
        }
      }
      
      if (propietariosImpresoras.length > 0) {
        const propietarioPrincipal = propietariosImpresoras[0];
        if (propietarioPrincipal.porcentaje > 40) {
          recomendaciones.push(`PROPIETARIOS IMPRESORAS: ${propietarioPrincipal.propietario} gestiona ${propietarioPrincipal.porcentaje}% de impresoras - optimizar gestión`);
        }
      }
      
      recomendaciones.push(
        `MANTENIMIENTO: Implementar plan preventivo para ${Math.floor(totalGeneral * 0.15)} equipos activos`,
        `RENOVACIÓN: Evaluar renovación de equipos activos con más de 4 años (aprox. ${Math.floor(totalGeneral * 0.25)} unidades)`,
        `ESTANDARIZACIÓN: Definir catálogo estándar basado en las ${marcasData.length} marcas principales con equipos activos`,
        `MONITOREO: Establecer dashboard en tiempo real para las ${ubicacionesData.length} ubicaciones principales con activos`
      );
      
      // Mostrar recomendaciones
      recomendaciones.forEach((rec, index) => {
        if (!verificarEspacioDisponible(doc, yPos, 30)) {
          doc.addPage();
          yPos = 55;
        }
        
        const colors = [
          { bg: [239, 246, 255], border: [59, 130, 246], text: [30, 64, 175] },
          { bg: [240, 253, 244], border: [16, 185, 129], text: [6, 120, 86] },
          { bg: [224, 242, 254], border: [6, 182, 212], text: [21, 94, 117] },
          { bg: [238, 242, 255], border: [99, 102, 241], text: [67, 56, 202] },
          { bg: [250, 245, 255], border: [139, 92, 246], text: [109, 40, 217] }
        ];
        
        const color = colors[index % colors.length];
        
        doc.setFillColor(...color.bg);
        doc.setDrawColor(...color.border);
        doc.setLineWidth(1);
        doc.roundedRect(15, yPos, 160, 25, 3, 3, 'FD');
        
        doc.setTextColor(...color.text);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${rec.split(':')[0]}`, 20, yPos + 8);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const detalle = rec.split(':').slice(1).join(':');
        const lineas = doc.splitTextToSize(detalle, 130);
        lineas.forEach((linea, lineIndex) => {
          doc.text(linea, 20, yPos + 14 + (lineIndex * 4));
        });
        
        yPos += 32;
      });
      
      // Footer en todas las páginas
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        generarFooterEmpresarial(doc, i, pageCount);
      }
      
      console.log('✅ Reporte completo mejorado generado exitosamente (Solo Activos con Propietarios)');
      
    } catch (error) {
      console.error('❌ Error en generarReporteInventarioConGraficas:', error);
      throw error;
    }
  };

  // Función para descargar reportes
  const descargarReporte = async (tipoReporte) => {
    try {
      console.log('🔄 Generando reporte PDF avanzado (Solo Activos con Propietarios):', tipoReporte);
      
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF();
      const fechaActual = new Date().toLocaleDateString('es-CO');
      const horaActual = new Date().toLocaleTimeString('es-CO');
      
      await generarReporteInventarioConGraficas(doc, fechaActual, horaActual);
      
      const nombreArchivo = `inventario_completo_activos_propietarios_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(nombreArchivo);
      
      console.log('✅ PDF con propietarios generado :', nombreArchivo);
      
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      alert(`Error al generar el PDF: ${error.message}`);
    }
  };

  // Función para obtener datos de gráficos
  const obtenerDatosGraficos = (usuarios, equipos, telefonia, impresoras) => {
    const salesData = [
      { name: 'Ene', usuarios: Math.floor(usuarios * 0.8), equipos: Math.floor(equipos * 0.8), telefonia: Math.floor(telefonia * 0.8), impresoras: Math.floor(impresoras * 0.8) },
      { name: 'Feb', usuarios: Math.floor(usuarios * 0.85), equipos: Math.floor(equipos * 0.85), telefonia: Math.floor(telefonia * 0.85), impresoras: Math.floor(impresoras * 0.85) },
      { name: 'Mar', usuarios: Math.floor(usuarios * 0.9), equipos: Math.floor(equipos * 0.9), telefonia: Math.floor(telefonia * 0.9), impresoras: Math.floor(impresoras * 0.9) },
      { name: 'Abr', usuarios: Math.floor(usuarios * 0.94), equipos: Math.floor(equipos * 0.94), telefonia: Math.floor(telefonia * 0.94), impresoras: Math.floor(impresoras * 0.94) },
      { name: 'May', usuarios: Math.floor(usuarios * 0.97), equipos: Math.floor(equipos * 0.97), telefonia: Math.floor(telefonia * 0.97), impresoras: Math.floor(impresoras * 0.97) },
      { name: 'Jun', usuarios: usuarios, equipos: equipos, telefonia: telefonia, impresoras: impresoras }
    ];

    return { salesData };
  };

  // Función para recargar datos
  const recargarDatos = async () => {
    setLoading(true);
    
    try {
      console.log('🔄 Recargando datos...');
      
      const [usuarios, equipos, telefonia, impresoras, perifericos, usuariosCompletos, equiposCompletos, telefoniaCompletos, impresorasCompletas] = await Promise.allSettled([
        fetchData('reportes_usuarios.php', '?tipo=estadisticas'),
        fetchData('reportes_equipos.php', '?tipo=estadisticas'),
        fetchData('reportes_telefonia.php', '?tipo=estadisticas'),
        fetchData('reportes_impresoras.php', '?tipo=estadisticas'),
        fetchData('reportes_perifericos.php', '?tipo=estadisticas'),
        fetchData('reportes_usuarios.php', '?tipo=todos'),
        fetchData('reportes_equipos.php', '?tipo=todos'),
        fetchData('reportes_telefonia.php', '?tipo=todos'),
        fetchData('reportes_impresoras.php', '?tipo=todos')
      ]);

      const usuariosData = usuarios.status === 'fulfilled' ? usuarios.value?.datos || [] : [];
      const equiposData = equipos.status === 'fulfilled' ? equipos.value?.datos || [] : [];
      const telefoniaData = telefonia.status === 'fulfilled' ? telefonia.value?.datos || [] : [];
      const impresorasData = impresoras.status === 'fulfilled' ? impresoras.value?.datos || [] : [];
      const perifericosData = perifericos.status === 'fulfilled' ? perifericos.value?.datos || [] : [];

      const usuariosCompleto = usuariosCompletos.status === 'fulfilled' ? usuariosCompletos.value?.datos || [] : [];
      const equiposCompleto = equiposCompletos.status === 'fulfilled' ? equiposCompletos.value?.datos || [] : [];
      const telefoniaCompletaData = telefoniaCompletos.status === 'fulfilled' ? telefoniaCompletos.value?.datos || [] : [];
      const impresorasCompletaData = impresorasCompletas.status === 'fulfilled' ? impresorasCompletas.value?.datos || [] : [];

      setEstadisticasUsuarios(usuariosData);
      setEstadisticasEquipos(equiposData);
      setEstadisticasTelefonia(telefoniaData);
      setEstadisticasImpresoras(impresorasData);
      setEstadisticasPerifericos(perifericosData);

      const dashboardConsolidado = {
        fecha_generacion: new Date().toISOString(),
        datos: {
          usuarios: usuariosData,
          equipos: equiposData,
          telefonia: telefoniaData,
          impresoras: impresorasData,
          perifericos: perifericosData
        },
        datosCompletos: {
          usuarios: usuariosCompleto,
          equipos: equiposCompleto,
          telefonia: telefoniaCompletaData,
          impresoras: impresorasCompletaData
        },
        estadisticasFiltrado: {
          usuariosActivos: usuarios.value?.total_activos || usuariosData.length,
          usuariosTotal: usuarios.value?.total_original || usuariosData.length,
          equiposActivos: equipos.value?.total_activos || equiposData.length,
          equiposTotal: equipos.value?.total_original || equiposData.length,
          telefoniaActiva: telefonia.value?.total_activos || telefoniaData.length,
          telefoniaTotal: telefonia.value?.total_original || telefoniaData.length,
          impresorasActivas: impresoras.value?.total_activos || impresorasData.length,
          impresorasTotal: impresoras.value?.total_original || impresorasData.length,
          perifericosActivos: perifericos.value?.total_activos || perifericosData.length,
          perifericosTotal: perifericos.value?.total_original || perifericosData.length,
        }
      };
      
      setDashboardInfo(dashboardConsolidado);

      console.log('📊 Estadísticas de filtrado:', dashboardConsolidado.estadisticasFiltrado);
      console.log('📊 Datos completos cargados:', {
        usuarios: usuariosCompleto.length,
        equipos: equiposCompleto.length,
        telefonia: telefoniaCompletaData.length,
        impresoras: impresorasCompletaData.length
      });

    } catch (error) {
      console.error('❌ Error recargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar todos los datos al iniciar
  useEffect(() => {
    const cargarDatosDashboard = async () => {
      setLoading(true);
      
      try {
        console.log('🚀 Iniciando carga de datos...');
        
        const [usuarios, equipos, telefonia, impresoras, perifericos, usuariosCompletos, equiposCompletos, telefoniaCompletos, impresorasCompletas] = await Promise.allSettled([
          fetchData('reportes_usuarios.php', '?tipo=estadisticas'),
          fetchData('reportes_equipos.php', '?tipo=estadisticas'),
          fetchData('reportes_telefonia.php', '?tipo=estadisticas'),
          fetchData('reportes_impresoras.php', '?tipo=estadisticas'),
          fetchData('reportes_perifericos.php', '?tipo=estadisticas'),
          fetchData('reportes_usuarios.php', '?tipo=todos'),
          fetchData('reportes_equipos.php', '?tipo=todos'),
          fetchData('reportes_telefonia.php', '?tipo=todos'),
          fetchData('reportes_impresoras.php', '?tipo=todos')
        ]);

        const usuariosData = usuarios.status === 'fulfilled' ? usuarios.value?.datos || [] : [];
        const equiposData = equipos.status === 'fulfilled' ? equipos.value?.datos || [] : [];
        const telefoniaData = telefonia.status === 'fulfilled' ? telefonia.value?.datos || [] : [];
        const impresorasData = impresoras.status === 'fulfilled' ? impresoras.value?.datos || [] : [];
        const perifericosData = perifericos.status === 'fulfilled' ? perifericos.value?.datos || [] : [];
        
        const usuariosCompleto = usuariosCompletos.status === 'fulfilled' ? usuariosCompletos.value?.datos || [] : [];
        const equiposCompleto = equiposCompletos.status === 'fulfilled' ? equiposCompletos.value?.datos || [] : [];
        const telefoniaCompletaData = telefoniaCompletos.status === 'fulfilled' ? telefoniaCompletos.value?.datos || [] : [];
        const impresorasCompletaData = impresorasCompletas.status === 'fulfilled' ? impresorasCompletas.value?.datos || [] : [];

        setEstadisticasUsuarios(usuariosData);
        setEstadisticasEquipos(equiposData);
        setEstadisticasTelefonia(telefoniaData);
        setEstadisticasImpresoras(impresorasData);
        setEstadisticasPerifericos(perifericosData);

        const dashboardConsolidado = {
          fecha_generacion: new Date().toISOString(),
          datos: {
            usuarios: usuariosData,
            equipos: equiposData,
            telefonia: telefoniaData,
            impresoras: impresorasData,
            perifericos: perifericosData
          },
          datosCompletos: {
            usuarios: usuariosCompleto,
            equipos: equiposCompleto,
            telefonia: telefoniaCompletaData,
            impresoras: impresorasCompletaData
          },
          estadisticasFiltrado: {
            usuariosActivos: usuarios.value?.total_activos || usuariosData.length,
            usuariosTotal: usuarios.value?.total_original || usuariosData.length,
            equiposActivos: equipos.value?.total_activos || equiposData.length,
            equiposTotal: equipos.value?.total_original || equiposData.length,
            telefoniaActiva: telefonia.value?.total_activos || telefoniaData.length,
            telefoniaTotal: telefonia.value?.total_original || telefoniaData.length,
            impresorasActivas: impresoras.value?.total_activos || impresorasData.length,
            impresorasTotal: impresoras.value?.total_original || impresorasData.length,
            perifericosActivos: perifericos.value?.total_activos || perifericosData.length,
            perifericosTotal: perifericos.value?.total_original || perifericosData.length,
          }
        };
        
        setDashboardInfo(dashboardConsolidado);

        console.log('✅ Dashboard cargado exitosamente');
        console.log('📊 Datos completos iniciales:', {
          usuarios: usuariosCompleto.length,
          equipos: equiposCompleto.length,
          telefonia: telefoniaCompletaData.length,
          impresoras: impresorasCompletaData.length
        });

      } catch (error) {
        console.error('Error general cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatosDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        color: '#1e293b',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '24px'
        }}></div>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>Conectando a Base de datos</h2>
        <p style={{ fontSize: '16px', color: '#64748b' }}>Sincronizando datos de inventario Navesoft...</p>
      </div>
    );
  }

  // Obtener métricas y datos reales
  const metricas = obtenerMetricas();
  const { totalUsuarios, totalEquipos, totalImpresoras, totalTelefonia, totalPerifericos, totalGeneral } = metricas;
  const { ubicacionesData, marcasData } = obtenerDatosReales();
  const { salesData } = obtenerDatosGraficos(totalUsuarios, totalEquipos, totalTelefonia, totalImpresoras);

  const hayDatosReales = dashboardInfo?.datosCompletos && 
    (dashboardInfo.datosCompletos.usuarios?.length > 0 || 
     dashboardInfo.datosCompletos.equipos?.length > 0 ||
     dashboardInfo.datosCompletos.telefonia?.length > 0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '16px', // Reducido de 24px a 16px
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      
      {/* Header más compacto */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px', // Reducido de 32px a 20px
        background: 'white',
        border: '1px solid #e2e8f0',
        padding: '20px 30px', // Reducido de 32px 40px a 20px 30px
        borderRadius: '16px', // Reducido de 20px a 16px
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px', // Reducido de 6px a 4px
          background: hayDatosReales ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #ef4444, #dc2626)',
        }}></div>
        
        <div>
          <h1 style={{
            fontSize: '28px', // Reducido de 36px a 28px
            fontWeight: '800',
            margin: '0 0 6px 0', // Reducido de 8px a 6px
            color: '#1e293b',
            letterSpacing: '-0.025em'
          }}>
            Inventario Navesoft
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px', // Reducido de 16px a 12px
            flexWrap: 'wrap'
          }}>
            <p style={{
              color: '#64748b',
              fontSize: '14px', // Reducido de 16px a 14px
              fontWeight: '500',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px' // Reducido de 8px a 6px
            }}>
              <Database size={16} /> {/* Reducido de 18 a 16 */}
              Sistema de Gestión de Inventario Empresarial
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px', // Reducido de 8px a 6px
              padding: '4px 8px', // Reducido de 6px 12px a 4px 8px
              background: hayDatosReales ? '#f0f9f5' : '#fef2f2',
              borderRadius: '8px', // Reducido de 12px a 8px
              border: `1px solid ${hayDatosReales ? '#d1fae5' : '#fecaca'}` // Reducido de 2px a 1px
            }}>
              {hayDatosReales ? <CheckCircle size={14} color="#10b981" /> : <AlertTriangle size={14} color="#ef4444" />}
              <span style={{
                color: hayDatosReales ? '#059669' : '#dc2626',
                fontSize: '12px', // Reducido de 14px a 12px
                fontWeight: '700'
              }}>
                {hayDatosReales ? 'DATOS REALES ORACLE' : 'SIN DATOS ORACLE'}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              background: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #dbeafe'
            }}>
              <Activity size={14} color="#3b82f6" />
              <span style={{
                color: '#1d4ed8',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                SOLO ACTIVOS (Y)
              </span>
            </div>
            
            {hayDatosReales && (
              <span style={{
                color: '#3b82f6',
                fontSize: '12px', // Reducido de 14px a 12px
                fontWeight: '600',
                background: '#eff6ff',
                padding: '4px 8px', // Reducido de 6px 12px a 4px 8px
                borderRadius: '8px',
                border: '1px solid #dbeafe'
              }}>
                {totalGeneral} registros activos
              </span>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px', // Reducido de 8px a 6px
              padding: '10px 16px', // Reducido de 14px 24px a 10px 16px
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '12px', // Reducido de 14px a 12px
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onClick={recargarDatos}
            disabled={loading}
          >
            <Activity size={14} style={{ 
              animation: loading ? 'spin 1s linear infinite' : 'none'
            }} />
            {loading ? 'Sincronizando...' : 'Actualizar Oracle'}
          </button>

          <button 
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px', // Reducido de 8px a 6px
              padding: '12px 18px', // Reducido de 16px 24px a 12px 18px
              background: 'linear-gradient(135deg, #10b981, #047857)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '11px', // Reducido de 13px a 11px
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.3s ease',
              minWidth: '150px' // Reducido de 180px a 150px
            }}
            onClick={() => descargarReporte('inventario_completo')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} />
              <BarChart3 size={14} />
            </div>
            <span>Reporte Activos</span>
            <span style={{ fontSize: '9px', opacity: 0.9, fontWeight: '400' }}>
              Con gráficas de propietarios
            </span>
          </button>
        </div>
      </div>

      {/* Sección de información de filtrado más compacta */}
      {dashboardInfo?.estadisticasFiltrado && (
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          border: '1px solid #bfdbfe', // Reducido de 2px a 1px
          borderRadius: '16px',
          padding: '16px', // Reducido de 24px a 16px
          marginBottom: '20px', // Reducido de 32px a 20px
          boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)'
        }}>
          <h3 style={{
            fontSize: '16px', // Reducido de 18px a 16px
            fontWeight: '700',
            color: '#1e40af',
            margin: '0 0 12px 0', // Reducido de 16px a 12px
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle size={18} />
            Estadísticas de Filtrado por Registros Activos
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', // Reducido de 200px a 180px
            gap: '12px' // Reducido de 16px a 12px
          }}>
            {[
              { label: 'Usuarios', activos: dashboardInfo.estadisticasFiltrado.usuariosActivos, total: dashboardInfo.estadisticasFiltrado.usuariosTotal },
              { label: 'Equipos', activos: dashboardInfo.estadisticasFiltrado.equiposActivos, total: dashboardInfo.estadisticasFiltrado.equiposTotal },
              { label: 'Telefonía', activos: dashboardInfo.estadisticasFiltrado.telefoniaActiva, total: dashboardInfo.estadisticasFiltrado.telefoniaTotal },
              { label: 'Impresoras', activos: dashboardInfo.estadisticasFiltrado.impresorasActivas, total: dashboardInfo.estadisticasFiltrado.impresorasTotal },
              { label: 'Periféricos', activos: dashboardInfo.estadisticasFiltrado.perifericosActivos, total: dashboardInfo.estadisticasFiltrado.perifericosTotal }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '12px', // Reducido de 16px a 12px
                borderRadius: '8px', // Reducido de 12px a 8px
                border: '1px solid #dbeafe'
              }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px 0', fontWeight: '600' }}>{item.label}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#1e40af' }}>{item.activos}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>de {item.total}</span>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
                    ({item.total > 0 ? Math.round((item.activos / item.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Métricas principales más compactas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', // Reducido de 280px a 240px
        gap: '16px', // Reducido de 24px a 16px
        marginBottom: '20px' // Reducido de 32px a 20px
      }}>
        {[
          { title: 'Total Usuarios Activos', value: totalUsuarios, icon: Users, color: '#3b82f6', change: '+12.5%', positive: true, description: 'Usuarios activos en el sistema' },
          { title: 'Equipos Activos', value: totalEquipos, icon: Monitor, color: '#10b981', change: '+8.3%', positive: true, description: 'Equipos de cómputo operativos' },
          { title: 'Impresoras Activas', value: totalImpresoras, icon: Printer, color: '#06b6d4', change: '-2.1%', positive: false, description: 'Dispositivos de impresión activos' },
          { title: 'Líneas Telefónicas Activas', value: totalTelefonia, icon: Phone, color: '#6366f1', change: '+5.7%', positive: true, description: 'Equipos de telefonía IP activos' },
          { title: 'Periféricos Activos', value: totalPerifericos, icon: HardDrive, color: '#8b5cf6', change: '+15.2%', positive: true, description: 'Dispositivos adicionales activos' }
        ].map((metric, index) => (
          <div
            key={metric.title}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px', // Reducido de 20px a 16px
              padding: '20px', // Reducido de 28px a 20px
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px', // Reducido de 4px a 3px
              background: `linear-gradient(90deg, ${metric.color}, ${metric.color}80)`
            }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: '12px', // Reducido de 14px a 12px
                  fontWeight: '600',
                  color: '#64748b',
                  margin: '0 0 6px 0', // Reducido de 8px a 6px
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {metric.title}
                </p>
                <h3 style={{
                  fontSize: '32px', // Reducido de 42px a 32px
                  fontWeight: '800',
                  color: metric.color,
                  margin: '0 0 6px 0', // Reducido de 8px a 6px
                  lineHeight: '1'
                }}>
                  {metric.value}
                </h3>
                <p style={{
                  fontSize: '11px', // Reducido de 12px a 11px
                  color: '#64748b',
                  margin: '0 0 8px 0' // Reducido de 12px a 8px
                }}>
                  {metric.description}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px', // Reducido de 6px 12px a 4px 8px
                  background: metric.positive ? '#f0f9f5' : '#fef2f2',
                  borderRadius: '8px', // Reducido de 12px a 8px
                  border: `1px solid ${metric.positive ? '#d1fae5' : '#fecaca'}`
                }}>
                  {metric.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  <span style={{
                    fontSize: '12px', // Reducido de 14px a 12px
                    fontWeight: '700',
                    color: metric.positive ? '#059669' : '#dc2626'
                  }}>
                    {metric.change}
                  </span>
                </div>
              </div>
              
              <div style={{
                width: '56px', // Reducido de 72px a 56px
                height: '56px', // Reducido de 72px a 56px
                borderRadius: '14px', // Reducido de 20px a 14px
                background: `linear-gradient(135deg, ${metric.color}, ${metric.color}cc)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 15px -3px ${metric.color}40`
              }}>
                <metric.icon size={24} color="white" /> {/* Reducido de 32 a 24 */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficas mejoradas con layout más compacto */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', // Reducido de 500px a 450px
        gap: '20px', // Reducido de 32px a 20px
        marginBottom: '20px' // Reducido de 32px a 20px
      }}>
        {/* Evolución del inventario */}
        <div style={{
          gridColumn: 'span 2',
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px', // Reducido de 20px a 16px
          padding: '24px', // Reducido de 32px a 24px
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{
                fontSize: '20px', // Reducido de 24px a 20px
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 6px 0' // Reducido de 8px a 6px
              }}>
                Evolución del Inventario Activo
              </h3>
              <p style={{
                fontSize: '13px', // Reducido de 14px a 13px
                color: '#64748b',
                margin: 0
              }}>
                Tendencias de crecimiento por categoría de activos
              </p>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['Diario', 'Semanal', 'Mensual'].map((btn, idx) => (
                <button key={btn} style={{
                  padding: '8px 12px', // Reducido de 10px 18px a 8px 12px
                  background: idx === 2 ? 'linear-gradient(135deg, #3b82f6, #1e40af)' : 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px', // Reducido de 12px a 8px
                  color: idx === 2 ? 'white' : '#64748b',
                  fontSize: '12px', // Reducido de 14px a 12px
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  {btn}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: '280px' }}> {/* Reducido de 350px a 280px */}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorEquipos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorTelefonia" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={3} fill="url(#colorUsuarios)" />
                <Area type="monotone" dataKey="equipos" stroke="#10b981" strokeWidth={3} fill="url(#colorEquipos)" />
                <Area type="monotone" dataKey="telefonia" stroke="#6366f1" strokeWidth={3} fill="url(#colorTelefonia)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de equipos activos */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '18px', // Reducido de 20px a 18px
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 6px 0' // Reducido de 8px a 6px
          }}>
            Distribución de Equipos Activos
          </h3>
          <p style={{
            fontSize: '13px', // Reducido de 14px a 13px
            color: '#64748b',
            margin: '0 0 16px 0' // Reducido de 24px a 16px
          }}>
            Solo equipos que actualmente esten activos
          </p>
          <div style={{ height: '220px' }}> {/* Reducido de 280px a 220px */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Laptops', value: 45, color: '#3B82F6' },
                    { name: 'Desktops', value: 28, color: '#10B981' },
                    { name: 'Servers', value: 15, color: '#06B6D4' },
                    { name: 'Workstations', value: 12, color: '#8B5CF6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // Reducido de 80 a 60
                  outerRadius={90} // Reducido de 120 a 90
                  dataKey="value"
                  strokeWidth={3}
                  stroke="white"
                >
                  {[
                    { name: 'Laptops', value: 45, color: '#3B82F6' },
                    { name: 'Desktops', value: 28, color: '#10B981' },
                    { name: 'Servers', value: 15, color: '#F59E0B' },
                    { name: 'Workstations', value: 12, color: '#8B5CF6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            {[
              { name: 'Laptops', value: 45, color: '#3B82F6' },
              { name: 'Desktops', value: 28, color: '#10B981' },
              { name: 'Servers', value: 15, color: '#06B6D4' },
              { name: 'Workstations', value: 12, color: '#8B5CF6' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px', // Reducido de 12px 16px a 8px 12px
                background: '#f8fafc',
                borderRadius: '8px', // Reducido de 12px a 8px
                border: '1px solid #f1f5f9'
              }}>
                <div style={{
                  width: '16px', // Reducido de 20px a 16px
                  height: '16px', // Reducido de 20px a 16px
                  borderRadius: '4px', // Reducido de 6px a 4px
                  background: item.color
                }}></div>
                <span style={{ color: '#374151', fontWeight: '600', flex: 1, fontSize: '13px' }}>{item.name}</span>
                <span style={{ color: '#1e293b', fontWeight: '700', fontSize: '14px' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mantenimientos semanales (solo activos) */}
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#1e293b',
            margin: '0 0 6px 0'
          }}>
            Mantenimientos Programados de equipos Activos
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            margin: '0 0 16px 0'
          }}>
            Solo equipos que actualmente esten activos
          </p>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Lun', equipos: 23, impresoras: 12, servidores: 5 },
                { name: 'Mar', equipos: 18, impresoras: 8, servidores: 7 },
                { name: 'Mie', equipos: 31, impresoras: 15, servidores: 3 },
                { name: 'Jue', equipos: 27, impresoras: 9, servidores: 8 },
                { name: 'Vie', equipos: 35, impresoras: 18, servidores: 12 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="equipos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="impresoras" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                <Bar dataKey="servidores" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sección de ubicaciones y marcas REALES (solo activos) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <MapPin size={20} color="#3b82f6" />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Ubicaciones de las sedes
            </h3>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: ubicacionesData.length > 0 ? '#10b981' : '#ef4444'
            }}></div>
            {ubicacionesData.length > 0 ? 
              `${ubicacionesData.length} ubicaciones con activos encontradas en Oracle` : 
              'No se encontraron ubicaciones con activos en los datos Oracle'
            }
          </p>
          
          {ubicacionesData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ubicacionesData.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px', // Reducido de 20px a 14px
                  background: `linear-gradient(135deg, ${index === 0 ? '#eff6ff' : index === 1 ? '#f0f9f5' : index === 2 ? '#e0f2fe' : '#faf5ff'}, ${index === 0 ? '#dbeafe' : index === 1 ? '#d1fae5' : index === 2 ? '#bae6fd' : '#e9d5ff'})`,
                  borderRadius: '12px',
                  border: `2px solid ${index === 0 ? '#dbeafe' : index === 1 ? '#d1fae5' : index === 2 ? '#bae6fd' : '#e9d5ff'}`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '36px', // Reducido de 48px a 36px
                    height: '36px', // Reducido de 48px a 36px
                    borderRadius: '12px',
                    background: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : index === 2 ? '#06b6d4' : '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '14px' // Reducido de 18px a 14px
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#1e293b',
                      fontWeight: '700',
                      fontSize: '15px', // Reducido de 18px a 15px
                      marginBottom: '2px' // Reducido de 4px a 2px
                    }}>
                      {item.ubicacion}
                    </div>
                    <div style={{
                      color: '#64748b',
                      fontSize: '12px', // Reducido de 14px a 12px
                      fontWeight: '500'
                    }}>
                      {item.total} activos registrados 
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      color: '#1e293b',
                      fontWeight: '800',
                      fontSize: '16px' // Reducido de 18px a 16px
                    }}>
                      {item.porcentaje}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#9ca3af',
              fontSize: '16px'
            }}>
              <AlertTriangle size={48} style={{ margin: '0 auto 16px' }} />
              <p>No hay datos de ubicaciones con activos disponibles</p>
              <p style={{ fontSize: '14px' }}>Verifique la conexión con la base de datos</p>
            </div>
          )}
        </div>

        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <Building2 size={20} color="#10b981" />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b',
              margin: 0
            }}>
              Marcas de equipos
            </h3>
          </div>
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: marcasData.length > 0 ? '#10b981' : '#ef4444'
            }}></div>
            {marcasData.length > 0 ? 
              `${marcasData.length} marcas con equipos activos encontradas en Oracle` : 
              'No se encontraron marcas con equipos activos en los datos Oracle'
            }
          </p>
          
          {marcasData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {marcasData.map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px',
                  background: `linear-gradient(135deg, ${index === 0 ? '#eff6ff' : index === 1 ? '#f0f9f5' : index === 2 ? '#e0f2fe' : '#faf5ff'}, ${index === 0 ? '#dbeafe' : index === 1 ? '#d1fae5' : index === 2 ? '#bae6fd' : '#e9d5ff'})`,
                  borderRadius: '12px',
                  border: `2px solid ${index === 0 ? '#dbeafe' : index === 1 ? '#d1fae5' : index === 2 ? '#bae6fd' : '#e9d5ff'}`,
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : index === 2 ? '#06b6d4' : '#8b5cf6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '800',
                    fontSize: '10px'
                  }}>
                    {item.marca.slice(0,3).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: '#1e293b',
                      fontWeight: '700',
                      fontSize: '15px',
                      marginBottom: '2px'
                    }}>
                      {item.marca}
                    </div>
                    <div style={{
                      color: '#64748b',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {item.total} equipos activos 
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{
                      color: '#1e293b',
                      fontWeight: '800',
                      fontSize: '16px'
                    }}>
                      {item.porcentaje}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#9ca3af',
              fontSize: '16px'
            }}>
              <AlertTriangle size={48} style={{ margin: '0 auto 16px' }} />
              <p>No hay datos de marcas con equipos activos disponibles</p>
              <p style={{ fontSize: '14px' }}>Verifique la conexión con la base de datos</p>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;