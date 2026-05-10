import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, ClipboardCheck, 
  CreditCard, Wallet, Cake, BarChart3, Settings, 
  ChevronLeft, ChevronRight, Trophy
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import clsx from 'clsx';

const menuItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/alumnos', icon: Users, label: 'Alumnos' },
  { to: '/instructores', icon: Trophy, label: 'Instructores' },
  { to: '/turnos', icon: Calendar, label: 'Turnos' },
  { to: '/asistencia', icon: ClipboardCheck, label: 'Asistencia' },
  { to: '/cuotas', icon: CreditCard, label: 'Cuotas' },
  { to: '/liquidaciones', icon: Wallet, label: 'Liquidaciones' },
  { to: '/cumpleanos', icon: Cake, label: 'Cumpleaños' },
  { to: '/reportes', icon: BarChart3, label: 'Reportes' },
  { to: '/configuracion', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, config } = useAppStore();

  return (
    <aside 
      className={clsx(
        'bg-white shadow-lg flex flex-col transition-all duration-300',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-taekwondo-primary to-red-700 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg text-taekwondo-secondary leading-tight">
                TAEKWONDO
              </h1>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                {config.nombre.replace('Academia ', '')}
              </p>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="w-10 h-10 bg-gradient-to-br from-taekwondo-primary to-red-700 rounded-lg flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx('sidebar-item', isActive && 'active', sidebarCollapsed && 'justify-center px-2')
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="p-3 border-t border-gray-100 hover:bg-gray-50 flex items-center justify-center"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        )}
      </button>
    </aside>
  );
}