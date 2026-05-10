import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Alumnos } from './pages/Alumnos';
import { Turnos } from './pages/Turnos';
import { Instructores } from './pages/Instructores';
import { Liquidaciones } from './pages/Liquidaciones';
import { Asistencia } from './pages/Asistencia';
import { Cuotas } from './pages/Cuotas';
import { Cumpleanos } from './pages/Cumpleanos';
import { Reportes } from './pages/Reportes';
import { Configuracion } from './pages/Configuracion';
import { useAppStore } from './store/useAppStore';

function App() {
  const initializeStore = useAppStore(state => state.initializeStore);
  const isLoading = useAppStore(state => state.isLoading);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#1A1A2E]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#C41E3A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="alumnos" element={<Alumnos />} />
          <Route path="instructores" element={<Instructores />} />
          <Route path="turnos" element={<Turnos />} />
          <Route path="asistencia" element={<Asistencia />} />
          <Route path="cuotas" element={<Cuotas />} />
          <Route path="liquidaciones" element={<Liquidaciones />} />
          <Route path="cumpleanos" element={<Cumpleanos />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;