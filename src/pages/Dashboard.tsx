import { 
  Users, CreditCard, TrendingUp, CalendarCheck,
  Cake, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const formatCurrency = (value: number) => 
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

const asistenciaData = [
  { name: 'Lun/Mié 18:00', asistencia: 18, capacidad: 20 },
  { name: 'Mar/Jue 19:00', asistencia: 14, capacidad: 15 },
  { name: 'Sáb 10:00', asistencia: 22, capacidad: 25 },
];

const evolucionData = [
  { mes: 'Ene', alumnos: 38 },
  { mes: 'Feb', alumnos: 40 },
  { mes: 'Mar', alumnos: 42 },
  { mes: 'Abr', alumnos: 45 },
  { mes: 'May', alumnos: 43 },
  { mes: 'Jun', alumnos: 45 },
];

export function Dashboard() {
  const { 
    getAlumnosActivos, 
    getCuotasVencidas, 
    getIngresosMes,
    getAsistenciaCount,
    getProximosCumpleanos,
    turnos,
    cuotas
  } = useAppStore();

  const activos = getAlumnosActivos();
  const vencidas = getCuotasVencidas();
  const ingresos = getIngresosMes();
  const asistencia = getAsistenciaCount();
  const cumpleanos = getProximosCumpleanos();
  
  const mesAnterior = ingresos * 0.92;
  const variacion = ((ingresos - mesAnterior) / mesAnterior) * 100;
  
  const ultimasCuotas = cuotas
    .filter(c => c.estado === 'pagada')
    .sort((a, b) => new Date(b.fechaPago!).getTime() - new Date(a.fechaPago!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Alumnos Activos */}
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Alumnos Activos</p>
              <p className="font-display text-3xl text-taekwondo-secondary">{activos.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Cuotas Vencidas */}
        <div className="metric-card border-l-taekwondo-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cuotas Vencidas</p>
              <p className="font-display text-3xl text-red-600">{vencidas.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Ingresos del Mes */}
        <div className="metric-card border-l-taekwondo-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ingresos del Mes</p>
              <p className="font-display text-3xl text-taekwondo-secondary">{formatCurrency(ingresos)}</p>
              <div className={`flex items-center text-sm ${variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {variacion >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                <span className="ml-1">{variacion.toFixed(1)}% vs mes anterior</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Asistencia Hoy */}
        <div className="metric-card border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Asistencia Hoy</p>
              <p className="font-display text-3xl text-taekwondo-secondary">
                {asistencia.presentes}/{asistencia.total}
              </p>
              <p className="text-sm text-gray-500">
                {asistencia.total > 0 ? Math.round((asistencia.presentes / asistencia.total) * 100) : 0}% presente
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CalendarCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Secciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Asistencia por Turno */}
        <div className="card">
          <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
            Asistencia por Turno
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={asistenciaData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="asistencia" fill="#C41E3A" radius={[4, 4, 0, 0]} name="Asistentes" />
              <Bar dataKey="capacidad" fill="#E5E7EB" radius={[4, 4, 0, 0]} name="Capacidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Evolución de Alumnos */}
        <div className="card">
          <h3 className="font-display text-xl text-taekwondo-secondary mb-4">
            Evolución de Alumnos
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={evolucionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[30, 50]} />
              <Tooltip 
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="alumnos" 
                stroke="#FFD700" 
                strokeWidth={3}
                dot={{ fill: '#FFD700', strokeWidth: 2 }}
                name="Alumnos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Próximos Cumpleaños y Últimas Cuotas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Cumpleaños */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Cake className="w-5 h-5 text-taekwondo-accent" />
            <h3 className="font-display text-xl text-taekwondo-secondary">
              Próximos Cumpleaños
            </h3>
          </div>
          {cumpleanos.length > 0 ? (
            <div className="space-y-3">
              {cumpleanos.map((alumno: any) => {
                const diasRestantes = (alumno as any).diasRestantes || 0;
                const esHoy = diasRestantes === 0;
                
                return (
                  <div 
                    key={alumno.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${esHoy ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-300' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-taekwondo-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {alumno.nombre[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {alumno.nombre} {alumno.apellido}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(alumno.fechaNacimiento), 'd MMM', { locale: es })}
                        </p>
                      </div>
                    </div>
                    {esHoy ? (
                      <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium">
                        🎉 ¡Hoy!
                      </span>
                    ) : (
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {diasRestantes} días
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay cumpleaños próximos</p>
          )}
        </div>

        {/* Últimas Cuotas Cobradas */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h3 className="font-display text-xl text-taekwondo-secondary">
              Últimas Cuotas Cobradas
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">Alumno</th>
                  <th className="text-left py-2 text-gray-500 font-medium">Fecha</th>
                  <th className="text-right py-2 text-gray-500 font-medium">Monto</th>
                </tr>
              </thead>
              <tbody>
                {ultimasCuotas.map((cuota) => {
                  const { getAlumnosActivos } = useAppStore.getState();
                  const alumno = getAlumnosActivos().find(a => a.id === cuota.alumnoId);
                  
                  return (
                    <tr key={cuota.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 text-gray-900">
                        {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido'}
                      </td>
                      <td className="py-2 text-gray-500">
                        {cuota.fechaPago ? format(new Date(cuota.fechaPago), 'dd/MM/yyyy') : '-'}
                      </td>
                      <td className="py-2 text-right font-medium text-green-600">
                        {formatCurrency(cuota.montoFinal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Alertas de Cuotas Vencidas */}
      {vencidas.length > 0 && (
        <div className="card border-l-4 border-red-500 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-red-600" />
            <h3 className="font-display text-lg text-red-700">
              Alumnos con Cuota Vencida
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {vencidas.slice(0, 6).map((cuota) => {
              const { getAlumnosActivos } = useAppStore.getState();
              const alumno = getAlumnosActivos().find(a => a.id === cuota.alumnoId);
              const turno = turnos.find(t => t.id === cuota.turnoId);
              
              return (
                <div key={cuota.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="font-medium text-gray-900">
                    {alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido'}
                  </p>
                  <p className="text-sm text-gray-500">{turno?.nombre}</p>
                  <p className="text-sm font-medium text-red-600">{formatCurrency(cuota.montoFinal)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}