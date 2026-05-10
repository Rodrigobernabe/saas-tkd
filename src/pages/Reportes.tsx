import { useState, useMemo } from 'react';
import { Users, Calendar, DollarSign, Download } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { format, subMonths } from 'date-fns';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

type TipoReporte = 'assistentecias' | 'financiero' | 'alumnado';

export function Reportes() {
  const [tipoReporte, setTipoReporte] = useState<TipoReporte>('assistentecias');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Reportes</h1>
          <p className="text-gray-500">Estadísticas y análisis</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Tabs tipo de reporte */}
      <div className="flex gap-2">
        <button
          onClick={() => setTipoReporte('assistentecias')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tipoReporte === 'assistentecias' 
              ? 'bg-taekwondo-primary text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Asistencia
        </button>
        <button
          onClick={() => setTipoReporte('financiero')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tipoReporte === 'financiero' 
              ? 'bg-taekwondo-primary text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Financiero
        </button>
        <button
          onClick={() => setTipoReporte('alumnado')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tipoReporte === 'alumnado' 
              ? 'bg-taekwondo-primary text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Alumnado
        </button>
      </div>

      {tipoReporte === 'assistentecias' && <ReporteAsistencia />}
      {tipoReporte === 'financiero' && <ReporteFinanciero />}
      {tipoReporte === 'alumnado' && <ReporteAlumnado />}
    </div>
  );
}

function ReporteAsistencia() {
  const { turnos, alumnos, assistentecias } = useAppStore();

  const datosPorTurno = useMemo(() => {
    const ultimos30Dias = new Date();
    ultimos30Dias.setDate(ultimos30Dias.getDate() - 30);

    return turnos.filter(t => t.activo).map(turno => {
      const registros = assistentecias.filter(a => 
        a.turnoId === turno.id && a.fecha >= ultimos30Dias.toISOString().split('T')[0]
      );
      const total = registros.length;
      const presentes = registros.filter(r => r.presente).length;
      const porcentaje = total > 0 ? Math.round((presentes / total) * 100) : 0;
      
      return {
        nombre: turno.nombre,
        total,
        presentes,
        porcentaje,
        capacidad: turno.capacidadMax
      };
    });
  }, [turnos, assistentecias]);

  const datosPorDia = useMemo(() => {
    const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const conteo: number[] = [0, 0, 0, 0, 0, 0, 0];
    
    assistentecias.forEach(a => {
      const fecha = new Date(a.fecha);
      const dia = fecha.getDay();
      if (a.presente) {
        conteo[dia === 0 ? 6 : dia - 1]++;
      }
    });

    return diasSemana.map((dia, idx) => ({ dia, assistentecias: conteo[idx] }));
  }, [assistentecias]);

  const topAsistentes = useMemo(() => {
    const ultimos30Dias = new Date();
    ultimos30Dias.setDate(ultimos30Dias.getDate() - 30);
    const fechaLimite = ultimos30Dias.toISOString().split('T')[0];

    const stats: Record<string, number> = {};
    assistentecias
      .filter(a => a.fecha >= fechaLimite && a.presente)
      .forEach(a => {
        stats[a.alumnoId] = (stats[a.alumnoId] || 0) + 1;
      });

    return Object.entries(stats)
      .map(([alumnoId, count]) => {
        const alumno = alumnos.find(a => a.id === alumnoId);
        return { nombre: `${alumno?.nombre} ${alumno?.apellido}`, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [assistentecias, alumnos]);

  return (
    <div className="space-y-6">
      {/* Gráfico por Turno */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Asistencia por Turno (últimos 30 días)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosPorTurno}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="presentes" fill="#22c55e" name="Presentes" />
            <Bar dataKey="total" fill="#e5e7eb" name="Total Clases" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico por Día */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Días más concurridos
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={datosPorDia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="assistentecias" fill="#C41E3A" name="Asistencias" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Asistentes */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Top 5 más asistentes (30 días)
        </h3>
        <div className="space-y-2">
          {topAsistentes.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-gray-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="font-medium">{item.nombre}</span>
              </div>
              <span className="font-display text-lg text-taekwondo-secondary">{item.count} clases</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReporteFinanciero() {
  const { cuotas, getMargenAcademia } = useAppStore();

  const hoy = new Date();
  const ultimos12Meses = Array.from({ length: 12 }, (_, i) => {
    const fecha = subMonths(hoy, 11 - i);
    return { mes: fecha.getMonth() + 1, anio: fecha.getFullYear() };
  });

  const datosIngresos = useMemo(() => {
    return ultimos12Meses.map(({ mes, anio }) => {
      const ingreso = cuotas
        .filter(c => c.periodoMes === mes && c.periodoAnio === anio && c.estado === 'pagada')
        .reduce((sum, c) => sum + c.montoFinal, 0);
      return {
        periodo: format(new Date(anio, mes - 1), 'MMM'),
        ingreso
      };
    });
  }, [cuotas]);

  const ultimoMes = ultimos12Meses[ultimos12Meses.length - 1];
  const margen = getMargenAcademia(ultimoMes.mes, ultimoMes.anio);

  const estadoCuotas = useMemo(() => {
    const pagadas = cuotas.filter(c => c.periodoMes === ultimoMes.mes && c.periodoAnio === ultimoMes.anio && c.estado === 'pagada').length;
    const pendientes = cuotas.filter(c => c.periodoMes === ultimoMes.mes && c.periodoAnio === ultimoMes.anio && c.estado === 'pendiente').length;
    const vencidas = cuotas.filter(c => c.periodoMes === ultimoMes.mes && c.periodoAnio === ultimoMes.anio && c.estado === 'vencida').length;
    return [
      { name: 'Pagadas', value: pagadas, color: '#22c55e' },
      { name: 'Pendientes', value: pendientes, color: '#eab308' },
      { name: 'Vencidas', value: vencidas, color: '#ef4444' }
    ].filter(d => d.value > 0);
  }, [cuotas, ultimoMes]);

  return (
    <div className="space-y-6">
      {/* Gráfico de Ingresos */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Evolución de Ingresos (12 meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosIngresos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Line type="monotone" dataKey="ingreso" stroke="#22c55e" strokeWidth={3} name="Ingresos" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resumen del Mes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Ingresos del Mes</p>
          <p className="font-display text-2xl text-green-600">{formatCurrency(margen.ingreso)}</p>
        </div>
        <div className="card bg-red-50 border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Pago Instructores</p>
          <p className="font-display text-2xl text-red-600">{formatCurrency(margen.gasto)}</p>
        </div>
        <div className="card bg-taekwondo-accent border-l-4 border-yellow-500">
          <p className="text-sm text-gray-600">Margen Neto</p>
          <p className="font-display text-2xl text-gray-900">{formatCurrency(margen.margen)}</p>
          <p className="text-xs text-gray-500">
            {margen.ingreso > 0 ? Math.round((margen.margen / margen.ingreso) * 100) : 0}% del ingreso
          </p>
        </div>
      </div>

      {/* Estado de Cuotas */}
      {estadoCuotas.length > 0 && (
        <div className="card">
          <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
            Estado de Cuotas del Mes
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={estadoCuotas}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {estadoCuotas.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function ReporteAlumnado() {
  const { alumnos, grados, turnos } = useAppStore();

  const totalActivos = alumnos.filter(a => a.activo).length;
  const totalInactivos = alumnos.filter(a => !a.activo).length;

  const datosPorGrado = useMemo(() => {
    return grados.map(grado => ({
      nombre: grado.nombre,
      cantidad: alumnos.filter(a => a.gradoId === grado.id && a.activo).length,
      color: grado.colorHex
    })).filter(d => d.cantidad > 0);
  }, [alumnos, grados]);

  const datosPorTurno = useMemo(() => {
    return turnos.filter(t => t.activo).map(turno => ({
      nombre: turno.nombre,
      cantidad: alumnos.filter(a => a.turnoId === turno.id && a.activo).length,
      capacidad: turno.capacidadMax
    }));
  }, [alumnos, turnos]);

  const antiguedad = useMemo(() => {
    const hoy = new Date();
    const menos3Meses = alumnos.filter(a => {
      const inicio = new Date(a.fechaInicio);
      return a.activo && (hoy.getTime() - inicio.getTime()) < 90 * 24 * 60 * 60 * 1000;
    }).length;
    const entre3y6 = alumnos.filter(a => {
      const inicio = new Date(a.fechaInicio);
      const diff = hoy.getTime() - inicio.getTime();
      return a.activo && diff >= 90 * 24 * 60 * 60 * 1000 && diff < 180 * 24 * 60 * 60 * 1000;
    }).length;
    const mas6Meses = alumnos.filter(a => {
      const inicio = new Date(a.fechaInicio);
      return a.activo && (hoy.getTime() - inicio.getTime()) >= 180 * 24 * 60 * 60 * 1000;
    }).length;
    return [
      { nombre: '< 3 meses', cantidad: menos3Meses },
      { nombre: '3-6 meses', cantidad: entre3y6 },
      { nombre: '> 6 meses', cantidad: mas6Meses }
    ];
  }, [alumnos]);

  return (
    <div className="space-y-6">
      {/* Stats generales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-gray-600">Activos</p>
          <p className="font-display text-2xl text-green-600">{totalActivos}</p>
        </div>
        <div className="card bg-gray-50 border-l-4 border-gray-400">
          <p className="text-sm text-gray-600">Inactivos</p>
          <p className="font-display text-2xl text-gray-600">{totalInactivos}</p>
        </div>
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <p className="text-sm text-gray-600">Por Turno</p>
          <p className="font-display text-2xl text-blue-600">{turnos.length}</p>
        </div>
        <div className="card bg-taekwondo-primary border-l-4 border-red-500">
          <p className="text-sm text-gray-600">Total</p>
          <p className="font-display text-2xl text-red-600">{alumnos.length}</p>
        </div>
      </div>

      {/* Gráfico por Grado */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Alumnos por Grado/Cinta
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosPorGrado}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#C41E3A" name="Alumnos" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico por Turno */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Alumnos por Turno
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={datosPorTurno}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#FFD700" name="Alumnos" />
            <Bar dataKey="capacidad" fill="#e5e7eb" name="Capacidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Retención */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Retención de Alumnos
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {antiguedad.map((item, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded">
              <p className="font-display text-2xl text-taekwondo-secondary">{item.cantidad}</p>
              <p className="text-sm text-gray-500">{item.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}