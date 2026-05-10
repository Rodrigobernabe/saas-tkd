import { Calendar, CreditCard, Cake, BarChart3, Settings } from 'lucide-react';

export function Asistencia() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-taekwondo-secondary">Asistencia</h1>
        <p className="text-gray-500">Control de asistencia diaria</p>
      </div>
      <div className="card text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Sección en desarrollo</p>
      </div>
    </div>
  );
}

export function Cuotas() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-taekwondo-secondary">Cuotas</h1>
        <p className="text-gray-500">Gestión de cuotas y pagos</p>
      </div>
      <div className="card text-center py-12">
        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Sección en desarrollo</p>
      </div>
    </div>
  );
}

export function Cumpleanos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-taekwondo-secondary">Cumpleaños</h1>
        <p className="text-gray-500">Festejos y notificaciones</p>
      </div>
      <div className="card text-center py-12">
        <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Sección en desarrollo</p>
      </div>
    </div>
  );
}

export function Reportes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-taekwondo-secondary">Reportes</h1>
        <p className="text-gray-500">Estadísticas y análisis</p>
      </div>
      <div className="card text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Sección en desarrollo</p>
      </div>
    </div>
  );
}

export function Configuracion() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-taekwondo-secondary">Configuración</h1>
        <p className="text-gray-500">Ajustes del sistema</p>
      </div>
      <div className="card text-center py-12">
        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Sección en desarrollo</p>
      </div>
    </div>
  );
}