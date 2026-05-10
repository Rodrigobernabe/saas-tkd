import { useState } from 'react';
import { Settings, Users, GraduationCap, CreditCard, Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

type SeccionConfig = 'academia' | 'usuarios' | 'grades' | 'cuotas';

export function Configuracion() {
  const [seccion, setSeccion] = useState<SeccionConfig>('academia');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-taekwondo-secondary">Configuración</h1>
        <p className="text-gray-500">Ajustes del sistema</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSeccion('academia')} className={`px-4 py-2 rounded-lg ${seccion === 'academia' ? 'bg-taekwondo-primary text-white' : 'bg-white border border-gray-300'}`}>
          <Settings className="w-4 h-4 inline mr-2" />Academia
        </button>
        <button onClick={() => setSeccion('usuarios')} className={`px-4 py-2 rounded-lg ${seccion === 'usuarios' ? 'bg-taekwondo-primary text-white' : 'bg-white border border-gray-300'}`}>
          <Users className="w-4 h-4 inline mr-2" />Usuarios
        </button>
        <button onClick={() => setSeccion('grades')} className={`px-4 py-2 rounded-lg ${seccion === 'grades' ? 'bg-taekwondo-primary text-white' : 'bg-white border border-gray-300'}`}>
          <GraduationCap className="w-4 h-4 inline mr-2" />Grados
        </button>
        <button onClick={() => setSeccion('cuotas')} className={`px-4 py-2 rounded-lg ${seccion === 'cuotas' ? 'bg-taekwondo-primary text-white' : 'bg-white border border-gray-300'}`}>
          <CreditCard className="w-4 h-4 inline mr-2" />Cuotas
        </button>
      </div>

      {seccion === 'academia' && <ConfigAcademia />}
      {seccion === 'usuarios' && <ConfigUsuarios />}
      {seccion === 'grades' && <ConfigGrados />}
      {seccion === 'cuotas' && <ConfigCuotas />}
    </div>
  );
}

function ConfigAcademia() {
  const { config } = useAppStore();
  const [formData, setFormData] = useState({ nombre: config.nombre, direccion: config.direccion, telefono: config.telefono, email: config.email });

  return (
    <div className="card space-y-4">
      <h2 className="font-display text-xl text-taekwondo-secondary">Datos de la Academia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label><input type="text" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label><input type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label><input type="text" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      </div>
      <div className="flex justify-end"><button className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" />Guardar</button></div>
    </div>
  );
}

function ConfigUsuarios() {
  const usuarios = [{ id: 'u1', nombre: 'Admin', email: 'admin@olimpia.com', rol: 'administrador', activo: true }];
  return (
    <div className="card space-y-4">
      <div className="flex justify-between"><h2 className="font-display text-xl text-taekwondo-secondary">Usuarios</h2><button className="btn-primary">+ Nuevo</button></div>
      <table className="w-full"><thead className="bg-gray-50"><tr><th className="text-left p-3">Nombre</th><th className="text-left p-3">Email</th><th className="text-left p-3">Rol</th><th className="text-left p-3">Estado</th></tr></thead><tbody>{usuarios.map(u => <tr key={u.id} className="border-b"><td className="p-3">{u.nombre}</td><td className="p-3">{u.email}</td><td className="p-3"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{u.rol}</span></td><td className="p-3"><span className={`px-2 py-1 ${u.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100'} rounded text-xs`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td></tr>)}</tbody></table>
    </div>
  );
}

function ConfigGrados() {
  const { grados } = useAppStore();
  return (
    <div className="card space-y-4">
      <div className="flex justify-between"><h2 className="font-display text-xl text-taekwondo-secondary">Grados / Cintas</h2><button className="btn-primary">+ Nuevo</button></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{grados.map(g => <div key={g.id} className="p-4 border rounded-lg text-center"><div className="w-8 h-8 rounded mx-auto mb-2 border" style={{backgroundColor: g.colorHex}} /><p className="font-medium">{g.nombre}</p><p className="text-xs text-gray-500">Orden: {g.orden}</p></div>)}</div>
    </div>
  );
}

function ConfigCuotas() {
  const { config } = useAppStore();
  const [formData, setFormData] = useState({ diaVencimiento: config.diaVencimiento, diasGracia: config.diasGracia, recargoMora: config.recargoMora, descuentoFamiliarPorcentaje: config.descuentoFamiliarPorcentaje, cantidadMinimaGrupoFamiliar: config.cantidadMinimaGrupoFamiliar, montoDefault: config.montoDefault });

  return (
    <div className="card space-y-4">
      <h2 className="font-display text-xl text-taekwondo-secondary">Configuración de Cuotas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Día de vencimiento</label><input type="number" min="1" max="31" value={formData.diaVencimiento} onChange={e => setFormData({...formData, diaVencimiento: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Días de gracia</label><input type="number" min="0" value={formData.diasGracia} onChange={e => setFormData({...formData, diasGracia: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Recargo (%)</label><input type="number" min="0" value={formData.recargoMora} onChange={e => setFormData({...formData, recargoMora: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Monto default</label><input type="number" value={formData.montoDefault} onChange={e => setFormData({...formData, montoDefault: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Descuento familiar (%)</label><input type="number" min="0" value={formData.descuentoFamiliarPorcentaje} onChange={e => setFormData({...formData, descuentoFamiliarPorcentaje: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mínimo para descuento</label><input type="number" min="2" value={formData.cantidadMinimaGrupoFamiliar} onChange={e => setFormData({...formData, cantidadMinimaGrupoFamiliar: parseInt(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
      </div>
      <div className="flex justify-end"><button className="btn-primary flex items-center gap-2"><Save className="w-4 h-4" />Guardar</button></div>
    </div>
  );
}