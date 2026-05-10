import { Bell, User, X, AlertCircle, Info, Cake, CreditCard } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';

export function Header() {
  const { config, usuario, notificaciones, marcarNotificacionLeida, getNotificacionesNoLeidas } = useAppStore();
  const [showNotificaciones, setShowNotificaciones] = useState(false);
  
  const noLeidas = getNotificacionesNoLeidas();

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'cuota_vencida': return <CreditCard className="w-4 h-4 text-red-500" />;
      case 'cumpleanos': return <Cake className="w-4 h-4 text-yellow-500" />;
      case 'asistencia_baja': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="font-display text-2xl text-taekwondo-secondary">
          {config.nombre}
        </h2>
        <p className="text-sm text-gray-500">
          {config.direccion}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotificaciones(!showNotificaciones)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {noLeidas.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-taekwondo-primary text-white text-xs rounded-full flex items-center justify-center">
                {noLeidas.length}
              </span>
            )}
          </button>

          {showNotificaciones && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-display text-lg text-taekwondo-secondary">Notificaciones</h3>
                <button onClick={() => setShowNotificaciones(false)}>
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              
              {notificaciones.length > 0 ? (
                <div className="divide-y">
                  {notificaciones.map(n => (
                    <div 
                      key={n.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${!n.leida ? 'bg-blue-50' : ''}`}
                      onClick={() => marcarNotificacionLeida(n.id)}
                    >
                      <div className="flex items-start gap-3">
                        {getIconoTipo(n.tipo)}
                        <div className="flex-1">
                          <p className={`font-medium ${!n.leida ? 'text-gray-900' : 'text-gray-600'}`}>
                            {n.titulo}
                          </p>
                          <p className="text-sm text-gray-500">{n.mensaje}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.fecha}</p>
                        </div>
                        {!n.leida && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No hay notificaciones
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{usuario.nombre}</p>
            <p className="text-xs text-gray-500 capitalize">{usuario.rol}</p>
          </div>
          <div className="w-10 h-10 bg-taekwondo-secondary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}