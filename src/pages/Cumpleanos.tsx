import { useState, useMemo } from 'react';
import { Cake, MessageCircle, Mail, Calendar, Users } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export function Cumpleanos() {
  const { alumnos, instructores } = useAppStore();
  
  const hoy = new Date();
  const [vistaPeriodo, setVistaPeriodo] = useState<'hoy' | 'semana' | 'mes'>('hoy');
  const [tipo, setTipo] = useState<'alumnos' | 'instructores'>('alumnos');

  const getCumpleanos = (personas: any[]) => {
    return personas.map(p => {
      const fechaNac = new Date(p.fechaNacimiento);
      let fechaCumple = new Date(hoy.getFullYear(), fechaNac.getMonth(), fechaNac.getDate());
      
      // Si ya pasó este año, buscar el próximo
      if (fechaCumple < hoy) {
        fechaCumple = new Date(hoy.getFullYear() + 1, fechaNac.getMonth(), fechaNac.getDate());
      }
      
      const diasRestantes = Math.ceil((fechaCumple.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
      const edad = hoy.getFullYear() - fechaNac.getFullYear();
      
      return { ...p, fechaCumple, diasRestantes, edadCumple: edad + 1 };
    });
  };

  const cumpleanosAlumnos = useMemo(() => getCumpleanos(alumnos.filter(a => a.activo)), [alumnos]);
  const cumpleanosInstructores = useMemo(() => getCumpleanos(instructores.filter(i => i.activo)), [instructores]);

  const filtrados = tipo === 'alumnos' ? cumpleanosAlumnos : cumpleanosInstructores;

  const filteredByPeriodo = useMemo(() => {
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();
    
    return filtrados.filter(p => {
      const mesCumple = p.fechaCumple.getMonth();
      
      if (vistaPeriodo === 'hoy') {
        return isSameDay(p.fechaCumple, hoy);
      } else if (vistaPeriodo === 'semana') {
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(diaActual - diaActual);
        const finSemana = new Date(hoy);
        finSemana.setDate(diaActual + (7 - diaActual));
        return p.fechaCumple >= inicioSemana && p.fechaCumple <= finSemana;
      } else {
        return mesCumple === mesActual;
      }
    }).sort((a, b) => a.diasRestantes - b.diasRestantes);
  }, [filtrados, vistaPeriodo, hoy]);

  const cantidad = filteredByPeriodo.length;
  const proximo = filteredByPeriodo[0];

  const enviarWhatsApp = (nombre: string) => {
    const mensaje = encodeURIComponent(`¡Feliz cumpleaños ${nombre}! 🎂🎉\n\nDe parte de la Academia Taekwondo Olimpia queremos desearte un día increíble. Que este nuevo año de vida te traiga mucha salud, felicidad y buenos logros en tu camino en el Taekwondo.\n\n¡Feliz cumpleaños! 🥋`);
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  const enviarEmail = (nombre: string, email: string) => {
    const asunto = encodeURIComponent('¡Feliz Cumpleaños! 🎂');
    const mensaje = encodeURIComponent(`¡Feliz cumpleaños ${nombre}! 🎂\n\nDe parte de la Academia Taekwondo Olimpia queremos desearte un día increíble. Que este nuevo año de vida te traiga mucha salud, felicidad y buenos logros en tu camino en el Taekwondo.\n\n¡Feliz cumpleaños!`);
    window.open(`mailto:${email}?subject=${asunto}&body=${mensaje}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-taekwondo-secondary">Cumpleaños</h1>
          <p className="text-gray-500">Gestión de cumpleaños y saludos</p>
        </div>
      </div>

      {/* Tabs tipo */}
      <div className="flex gap-2">
        <button
          onClick={() => setTipo('alumnos')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tipo === 'alumnos' 
              ? 'bg-taekwondo-primary text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Alumnos
        </button>
        <button
          onClick={() => setTipo('instructores')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            tipo === 'instructores' 
              ? 'bg-taekwondo-primary text-white' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Instructores
        </button>
      </div>

      {/* Filtro período */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setVistaPeriodo('hoy')}
              className={`px-4 py-2 rounded-lg ${vistaPeriodo === 'hoy' ? 'bg-taekwondo-accent text-gray-900' : 'bg-gray-100'}`}
            >
              Hoy
            </button>
            <button
              onClick={() => setVistaPeriodo('semana')}
              className={`px-4 py-2 rounded-lg ${vistaPeriodo === 'semana' ? 'bg-taekwondo-accent text-gray-900' : 'bg-gray-100'}`}
            >
              Esta Semana
            </button>
            <button
              onClick={() => setVistaPeriodo('mes')}
              className={`px-4 py-2 rounded-lg ${vistaPeriodo === 'mes' ? 'bg-taekwondo-accent text-gray-900' : 'bg-gray-100'}`}
            >
              Este Mes
            </button>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-gray-500">
              {cantidad} {cantidad === 1 ? 'cumpleañero' : 'cumpleañeros'} en este período
            </p>
            {proximo && (
              <p className="text-sm text-gray-500">
                Próximo: {proximo.nombre} {proximo.apellido} en {proximo.diasRestantes} días
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Cumpleaños */}
      {filteredByPeriodo.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredByPeriodo.map((persona: any) => {
            const esHoy = persona.diasRestantes === 0;
            
            return (
              <div 
                key={persona.id} 
                className={`card ${esHoy ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-400' : ''}`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                    esHoy ? 'bg-yellow-400' : 'bg-taekwondo-secondary'
                  }`}>
                    {esHoy ? '🎉' : persona.nombre[0]}
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-gray-900">
                      {persona.nombre} {persona.apellido}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {format(persona.fechaCumple, "d 'de' MMMM", { locale: es })}
                    </p>
                    {esHoy && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-sm font-medium rounded">
                        ¡CUMPLE HOY! 🎂
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Cake className="w-4 h-4" />
                    Cumple {persona.edadCumple} años
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {esHoy ? '¡Hoy es su día!' : `${persona.diasRestantes} días restantes`}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => enviarWhatsApp(`${persona.nombre} ${persona.apellido}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => enviarEmail(`${persona.nombre} ${persona.apellido}`, persona.email)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-12">
          <Cake className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No hay cumpleaños en este período
          </p>
        </div>
      )}
    </div>
  );
}