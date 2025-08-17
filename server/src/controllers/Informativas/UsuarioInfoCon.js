/* CONTROLADORES DE INFORMATIVA -- USUARIO */
import { obtenerListaUsuarios, obtenerDatosSeleccionado, editarDatosPersonal, editarFotoPersonal, obtenerFotoSeleccionado } from "../../services/Informativas/UsuarioInfoSer.js";

// Pedir el nombre del usuario
const nickname = async (req, res) => {
  try {
    const nickname = req.params.nickname; // Obtiene el nickname del usuario de la URL    
    req.session.nickname = nickname; // Guarda el nickname del usuario en la sesión
    req.session.save(err => { // Guarda la sesión y maneja posibles errores
      if (err) {
        console.error('Error al guardar la sesión:', err);
      }
    });
    res.sendStatus(200);
  } catch (error) {
    console.error('Error: // Pedir el nombre del usuario, ', error);
    res.sendStatus(500);
  }
};

// Pedir la lista de usuarios
const getlistaUsuarios = async (req, res) => {
  const tipo = req.session.tipo;
  if (tipo === "Super Administrador") {
    try {
      const lista = await obtenerListaUsuarios();
      return res.status(200).json(lista)
    } catch (error) {
      console.error('Error: // Pedir la lista de usuarios, ', error);
    }
  }
  else {
    console.error('Error: // Pedir la lista de usuarios, ', error);
    return res.status(error?.code || 500).json({ message: error?.message || 'Error al obtener los usuarios' });
  }
};

// Pedir los datos del personal seleccionado
const getDatosSeleccionado = async (req, res) => {
  try {
    let seleccionado;
    const tipo = req.session.tipo;
    tipo !== "Super Administrador" ? seleccionado = req.session.perfil : seleccionado = req.session.nickname;
    const datos = await obtenerDatosSeleccionado(seleccionado);

    return res.status(200).json(datos)
  } catch (error) {
    console.error('Error: // Pedir los datos del personal seleccionado, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error al obtener los datos del personal" });
  }
};

// Pedir la foto del personal seleccionado
const getFotoSeleccionado = async (req, res) => {
  try {
    let seleccionado;
    const tipo = req.session.tipo;
    tipo !== "Super Administrador" ? seleccionado = req.session.perfil : seleccionado = req.session.nickname;
    const archivo = await obtenerFotoSeleccionado(seleccionado);
    if (!archivo.foto) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
    res.set('Content-Disposition', `inline; filename="foto.jpg"`); // Cambia el nombre del archivo a descargar
    res.status(200).send(archivo.foto);

  } catch (error) {
    console.error('Error: // Pedir la foto del personal seleccionado, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error al obtener la foto del personal" });
  }
};

// Pedir los datos del personal seleccionado en seleccion
const getDatosSeleccion = async (req, res) => {
  try {
    const seleccionado = req.params.nickname;
    const datos = await obtenerDatosSeleccionado(seleccionado);

    return res.status(200).json(datos);
  } catch (error) {
    console.error('Error: // Pedir los datos del personal seleccionado en seleccion, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error al obtener los datos del personal seleccionado" });
  }
};

// Pedir la foto del personal seleccionado en seleccion
const getFotoSeleccion = async (req, res) => {
  try {
    const seleccionado = req.params.nickname;
    const archivo = await obtenerFotoSeleccionado(seleccionado);
    if (!archivo.foto) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
    res.set('Content-Disposition', `inline; filename="foto.jpg"`); // Cambia el nombre del archivo a descargar
    res.status(200).send(archivo.foto);

  } catch (error) {
    console.error('Error: // Pedir la foto del personal seleccionado en seleccion, ', error);
    res.status(error?.code || 500).json({ message: error?.message || "Error al obtener la foto del personal seleccionado" });
  }
};

// Editar los datos del personal
const updateDatos = async (req, res) => {
  try {
    const propiedadEditar = req.params.editar;
    const { valor: propiedadEditada, id } = req.body;
    await editarDatosPersonal(propiedadEditar, propiedadEditada, id);
    return res.sendStatus(200); // res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error: // Editar los datos del personal, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error editando usuario' });
  }
};

// Editar la foto del personal
const updateFoto = async (req, res) => {
  try {
    const foto = req.file.buffer; // Obtiene el archivo como un buffer
    const id = req.body.id;
    await editarFotoPersonal(foto, id);
    return res.sendStatus(200);
  } catch (error) {
    console.error('Error: // Editar la foto del personal, ', error);
    res.status(error?.code || 500).json({ message: error?.message || 'Error editando foto' });
  }
}

export const methods = { nickname, getlistaUsuarios, getDatosSeleccionado, getFotoSeleccionado, getDatosSeleccion, getFotoSeleccion, updateDatos, updateFoto };