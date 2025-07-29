/* PUNTO DE ENTRADA PARA RENDERIZADO */
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import reportWebVitals from './reportWebVitals'; 

// React se conecta con el DOM del navegador y renderiza el componente raíz
// (App) en el elemento con id 'root'.
// Se utiliza React.StrictMode para resaltar posibles problemas en la aplicación.
// reportWebVitals se utiliza para medir el rendimiento de la aplicación.
const root = ReactDOM.createRoot(document.getElementById('root')); // Se crea un root de React y se renderiza el componente App dentro de él.
// Este root se conecta al elemento del DOM con id 'root'.
root.render(
  <React.StrictMode> {/* Modo estricto de React para detectar problemas potenciales */}
    <App />
  </React.StrictMode>
);

reportWebVitals(); // Se mide el rendimiento de la aplicación y se envían los resultados a un servicio de análisis.