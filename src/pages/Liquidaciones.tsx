import { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export function Liquidaciones() {
  const { 
    instructores, 
    turnos, 
    getAlumnosByTurno, 
    getCuotasCobradasByTurno,
    liquidaciones,
    usuario,
    marcarLiquidacionPagada,
    getMargenAcademia
  } = useAppStore();

  const hoy = new Date();
  const [selectedMes, setSelectedMes] = useState(hoy.getMonth() + 1);
  const [selectedAnio, setSelectedAnio] = useState(hoy.getFullYear());
  const [expandedInstructor, setExpandedInstructor] = useState<string | null>(null);

  const liquidacionesDelPeriodo = liquidaciones.filter(
    l => l.periodoMes === selectedMes && l.periodoAnio === selectedAnio
  );

  const calculateLiquidacion = (instructorId: string) => {
    const instructor = instructores.find(i => i.id === instructorId);
    if (!instructor) return null;

    const turno = turnos.find(t => t.id === instructor.turnoId);
    const alumnos = getAlumnosByTurno(instructor.turnoId);
    const cuotasCobradas = getCuotasCobradasByTurno(instructor.turnoId, selectedMes, selectedAnio);
    
    const totalRecaudado = cuotasCobradas.reduce((sum, c) => sum + c.montoFinal, 0);
    const montoInstructor = totalRecaudado * (instructor.porcentajeCobro / 100);

    return {
      instructor,
      turno,
      alumnos,
      totalRecaudado,
      montoInstructor,
      cuotasCobradas,
    };
  };

  const liquidacionExistente = (instructorId: string) => {
    return liquidacionesDelPeriodo.find(l => l.instructorId === instructorId);
  };

  const handleMarcarPagado = (instructorId: string) => {
    const existente = liquidacionExistente(instructorId);
    if (existente) {
      marcarLiquidacionPagada(existente.id, usuario.nombre);
    }
  };

  const margen = getMargenAcademia(selectedMes, selectedAnio);

  const chartData = [
    { name: 'Ingreso', value: margen.ingreso, color: '#22c55e' },
    { name: 'Pago Instructores', value: margen.gasto, color: '#C41E3A' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Liquidaciones</h1>
          <p className="text-gray-500">Pago a instructores por turno</p>
        </div>
      </div>

      {/* Selector de Período */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Período:</label>
            <select
              value={selectedMes}
              onChange={(e) => setSelectedMes(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              {meses.map((m, idx) => (
                <option key={idx} value={idx + 1}>{m}</option>
              ))}
            </select>
            <select
              value={selectedAnio}
              onChange={(e) => setSelectedAnio(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-taekwondo-primary"
            >
              {[2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resumen del Período */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Recaudado</p>
              <p className="font-display text-xl text-gray-900">{formatCurrency(margen.ingreso)}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pago Instructores</p>
              <p className="font-display text-xl text-gray-900">{formatCurrency(margen.gasto)}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-taekwondo-accent/50 to-yellow-100 border-l-4 border-taekwondo-accent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-taekwondo-accent rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-900" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Margen Academia</p>
              <p className="font-display text-xl text-gray-900">{formatCurrency(margen.margen)}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-taekwondo-secondary to-indigo-900 border-l-4 border-indigo-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-300">% Margen</p>
              <p className="font-display text-xl text-white">
                {margen.ingreso > 0 ? Math.round((margen.margen / margen.ingreso) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card">
        <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
          Distribución de Ingresos
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lista de Liquidaciones por Instructor */}
      <div className="space-y-4">
        <h3 className="font-display text-xl text-taekwondo-secondary">
          Detalle por Instructor
        </h3>
        
        {instructores.filter(i => i.activo).map((instructor) => {
          const liq = calculateLiquidacion(instructor.id);
          const liqExistente = liquidacionExistente(instructor.id);
          const isExpanded = expandedInstructor === instructor.id;

          if (!liq) return null;

          return (
            <div key={instructor.id} className="card">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedInstructor(isExpanded ? null : instructor.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-taekwondo-secondary rounded-full flex items-center justify-center text-white font-bold">
                    {instructor.nombre[0]}{instructor.apellido[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {instructor.nombre} {instructor.apellido}
                    </h4>
                    <p className="text-sm text-gray-500">{liq.turno?.nombre}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{liq.alumnos.length} alumnos</p>
                    <p className="text-sm text-gray-500">{formatCurrency(liq.totalRecaudado)} recaudado</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{instructor.porcentajeCobro}%</p>
                    <p className="font-display text-xl text-taekwondo-accent">
                      {formatCurrency(liq.montoInstructor)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {liqExistente?.estado === 'pagado' ? (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Pagado
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarcarPagado(instructor.id);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-taekwondo-primary text-white rounded-full text-sm font-medium hover:bg-red-700"
                      >
                        <Clock className="w-4 h-4" />
                        Marcar Pagado
                      </button>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Detalle expandible */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">Cuotas cobradas en el período</h5>
                  {liq.cuotasCobradas.length > 0 ? (
                    <div className="space-y-2">
                      {liq.cuotasCobradas.map((cuota) => {
                        const { getAlumnosActivos } = useAppStore.getState();
                        const alumno = getAlumnosActivos().find(a => a.id === cuota.alumnoId);
                        return (
                          <div key={cuota.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                            <span>{alumno?.nombre} {alumno?.apellido}</span>
                            <span className="font-medium text-gray-900">{formatCurrency(cuota.montoFinal)}</span>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between bg-gray-100 p-2 rounded font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(liq.totalRecaudado)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay cuotas cobradas en este período</p>
                  )}

                  {liqExistente?.estado === 'pagado' && liqExistente.fechaPago && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Pagado el:</strong> {liqExistente.fechaPago} | 
                        <strong> Aprobado por:</strong> {liqExistente.aprobadoPor}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}