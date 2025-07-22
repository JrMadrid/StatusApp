/* DEFINE LA ESTRUCTURA Y LA LÓGICA PRINCIPAL DE LA APLICACIÓN */
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation } from 'react-router-dom'; // Importar componentes y hooks de "react-router-dom" para manejar el enrutamiento de la aplicación. el browserRouter es un componente que utiliza la API de History del navegador para mantener la UI sincronizada con la URL. El Route es un componente que se utiliza para definir una ruta en la aplicación, y el Routes es un contenedor para todos los Route. El Outlet es un componente que se utiliza para renderizar los componentes hijos de una ruta anidada. useLocation es un hook que devuelve la ubicación actual de la aplicación, lo que permite acceder a la URL actual y otros detalles relacionados con la ubicación.
// import { createBrowserHistory } from 'history'; // Importar "createBrowserHistory" para crear un historial de navegación.
import './App.css';
/* Pages */
import Iniciar from "./pages/Login.jsx";
import NotFoundPage from "./pages/NotFound.jsx";
// Data
import Sucursales from './pages/Data/DataSucursal.jsx';
import Dispositivos from "./pages/Data/DataDispositivos.jsx";
import Mantenimientos from "./pages/Data/DataMantenimientos.jsx";
// Informativas
// import UsuarioInfo from './pages/Informativas/Usuario_Infor.jsx';
import SucursalInfo from './pages/Informativas/Sucursal_Infor.jsx';
import DispositivosInfo from './pages/Informativas/Dispositivos_Infor.jsx'
import MantenimientosInfo from "./pages/Informativas/Mantenimientos_Infor.jsx";
import ManualInfo from "./pages/Informativas/Manual_Infor.jsx";
import InformeInfo from "./pages/Informativas/Informe_Infor.jsx";
// Paneles
import PanUsers from './pages/Panels/PanelUsers.jsx'
import PanSucursal from './pages/Panels/PanelSucursal.jsx';
import PanelApp from './pages/Panels/PanelDispositivo.jsx';
import PanMantenimientos from "./pages/Panels/PanelMantenimiento.jsx";
import PanManuales from "./pages/Panels/PanelManual.jsx";
import Informes from "./pages/Panels/PanelInforme.jsx";
/* Components */
import Navbar from './components/Elements/Navbar.jsx';
/* Context */
import { UserProvider } from './context/UserContext.jsx';

// Aplicación principal que utiliza React Router para la navegación y el enrutamiento.
function App() {
    return (
        <UserProvider> {/* Proveedor de contexto para manejar el estado del usuario */}
            <Router> {/* Configura el enrutamiento de la aplicación */}
                <Routes> {/* Define las rutas de la aplicación */}
                    <Route path="/" element={<Layout />}> {/* Componente de diseño que incluye la barra de navegación */}
                        {/* Rutas anidadas dentro del componente Layout */}
                        {/* Aquí se definen las rutas de la aplicación */}
                        {/* Cada ruta tiene un componente asociado que se renderiza cuando la ruta coincide */}
                        <Route path="/" element={<Iniciar />} />
                        <Route path="/sucursales" element={<Sucursales />} />
                        <Route path="/dispositivos" element={<Dispositivos />} />
                        <Route path="/mantenimientos" element={<Mantenimientos />} />
                        <Route path="/panusers" element={<PanUsers />} />
                        <Route path="/pansucursal" element={<PanSucursal />} />
                        <Route path="/panapps" element={<PanelApp />} />
                        <Route path="/panmantenimiento" element={<PanMantenimientos />} />
                        <Route path="/panmanuales" element={<PanManuales />} />
                        <Route path="/paninformes" element={<Informes />} />
                        {/* <Route path="/users" element={<UsuarioInfo />} /> */}
                        <Route path="/status" element={<SucursalInfo />} />
                        <Route path="/devices" element={<DispositivosInfo />} />
                        <Route path="/mantes" element={<MantenimientosInfo />} />
                        <Route path="/manual" element={<ManualInfo />} />
                        <Route path="/informe" element={<InformeInfo />} />
                        <Route path="*" element={<NotFoundPage />} /> {/* Ruta para manejar páginas no encontradas */}
                    </Route>
                </Routes>
            </Router>
        </UserProvider>
    );
}

/* Sin Navbar */
function Layout() {
    const location = useLocation(); // Hook para obtener la ubicación actual de la aplicación.
    // Definir las rutas donde no se debe mostrar la barra de navegación.
    const noNavbarPaths = ['/']; // Rutas donde no se debe mostrar la barra de navegación.

    return (
        <>
            {!noNavbarPaths.includes(location.pathname) && <Navbar />}{/* Si la ruta actual no está en la lista de rutas sin barra de navegación, se muestra la barra de navegación. */}
            <div className="fondo">
                <Outlet /> {/* Renderiza el componente hijo correspondiente a la ruta actual. */}
            </div>
        </>
    );
};

export default App;