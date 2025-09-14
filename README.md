# StatusApp

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)   
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)  
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat)  
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?style=flat&logo=microsoft-sql-server&logoColor=white)

---

## 📑 Índice
1. [Descripción](#-descripción)  
2. [Tipos de Usuario](#-tipos-de-usuario)  
3. [Módulos Principales](#-módulos-principales)  
4. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)  
5. [Características Destacadas](#-características-destacadas)  
6. [Instalación y Ejecución](#-instalación-y-ejecución)  

---

## 📝 Descripción
**StatusApp** es una plataforma de gestión integral para usuarios, sucursales, dispositivos, mantenimientos, manuales e informes.  
Su diseño modular y basado en roles garantiza que cada usuario tenga acceso solo a las funcionalidades que le corresponden, manteniendo la seguridad y consistencia de los datos.  

---

## 👥 Tipos de Usuario  

El sistema define **4 roles principales**, cada uno con permisos específicos:  

- **Super Administrador** → Acceso total al sistema. Puede administrar todos los módulos y usuarios.  
- **Administrador** → Gestiona sucursales, dispositivos y mantenimientos asignados.  
- **Aplicativo** → Usuario con permisos únicamente de visualización. No puede subir información ni realizar tareas de administración.  
- **Geografía (Ingeniero responsable de Sucursal)** → Encargado de la información y mantenimientos relacionados con sus sucursales asignadas.  

---

## 📦 Módulos Principales
El sistema está organizado en **6 módulos**, cada uno con capacidades de **administración, visualización y edición** según el tipo de usuario:  

- **Usuarios** → Gestión de datos de usuario (información personal, foto, descripción, etc.).  
- **Sucursales** → Listado de sucursales con datos relevantes (ejemplo: ingeniero responsable). Permite ver dispositivos enlazados e informes de mantenimiento.  
- **Dispositivos** → Administración de dispositivos (IP, ping, enlace directo, página informativa).  
- **Mantenimientos** → Registro y consulta de informes de mantenimiento por sucursal.  
- **Manuales** → Repositorio centralizado de manuales accesibles para los usuarios.  
- **Informes** → Registro de actividades realizadas por los usuarios en las sucursales.  

---

## 🏗️ Arquitectura del Proyecto
**Estructura principal:**  
- `/client` → Aplicación frontend en **ReactJS**.  
- `/server` → Backend en **ExpressJS** .  
- `/db` → Scripts y queries para creación y gestión de tablas en **SQL Server**.  
- `/docs` → Documentación, capturas y recursos multimedia.  

**Base de datos:** SQL Server.  

---

## ✨ Características Destacadas
- Gestión integral de usuarios, sucursales, dispositivos, mantenimientos, manuales e informes.  
- Control de accesos según **tipo de usuario**.  
- Exportación de información a **PDF y Excel**.  
- Conexión a dispositivos (UPS, iLO, biométricos, etc) para obtener información técnica.  
- Flujo de datos consistente gracias a relaciones sólidas en la base de datos.  

---

## ⚙️ Instalación y Ejecución
1. Clonar el repositorio:  https://github.com/JrMadrid/StatusApp.git
2. Instalar dependencias en `/client` y `/server`: npm install 
3. Generar build del frontend en `/client`: npm run build
4. Mover la carpeta generada al directorio `/server/public`.
5. Ejecutar en producción en `/server`: npm run prod
