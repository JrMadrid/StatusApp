/* CONTROLADORES DE INFORMATIVA -- USUARIO */
import { obtenerListaUsuarios, obtenerDatosSeleccionado, editarDatosPersonal, editarFotoPersonal, obtenerFotoSeleccionado } from "../../services/Informativas/UsuarioInfoSer.js";

// Pide el nombre del usuario
const nickname = async (req, res) => {
  try {
    const nickname = req.params.nickname; // Obtiene el nickname del usuario de la URL    
    req.session.nickname = nickname; // Guarda el nickname del usuario en la sesión
    req.session.save(err => { // Guarda la sesión y maneja posibles errores
      if (err) {
        console.error('Error al guardar la sesión:', err);
      }
    });
  } catch (error) {
    console.error('Error :', error);
  }
};

// Pide la lista de usuarios
const listaUsuarios = async (req, res) => {
  const tipo = req.session.tipo;
  if (tipo === "Super Administrador") {
    try {
      const lista = await obtenerListaUsuarios();
      return res.json(lista)
    } catch (error) {
      console.error('Error :', error);
    }
  }
  else {
    return;
  }
};

// Pide los datos del personal seleccionado
const datosSeleccionado = async (req, res) => {
  try {
    let seleccionado;
    const tipo = req.session.tipo;
    tipo !== "Super Administrador" ? seleccionado = req.session.perfil : seleccionado = req.session.nickname;
    const datos = await obtenerDatosSeleccionado(seleccionado);

    return res.json(datos)
  } catch (error) {
    console.error('Error :', error);
  }
};

// Pide la foto del personal seleccionado
const FotoSeleccionado = async (req, res) => {
  try {
    let seleccionado;
    const tipo = req.session.tipo;
    tipo !== "Super Administrador" ? seleccionado = req.session.perfil : seleccionado = req.session.nickname;
    const archivo = await obtenerFotoSeleccionado(seleccionado);
    if (!archivo.foto) {
      return res.sendStatus(400);
    }
    res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
    res.set('Content-Disposition', `inline; filename="foto.jpg"`); // Cambia el nombre del archivo a descargar
    res.status(200).send(archivo.foto);
    
  } catch (error) {
    console.error('Error :', error);
  }
};

// Pide los datos del personal seleccionado en seleccion
const datosSeleccion = async (req, res) => {
  try {
    const seleccionado = req.params.nickname;
    const datos = await obtenerDatosSeleccionado(seleccionado);
    
    return res.json(datos);
  } catch (error) {
    console.error('Error :', error);
  }
};

// Pide la foto del personal seleccionado en seleccion
const fotoSeleccion = async (req, res) => {
  try {
    const seleccionado = req.params.nickname;
    const archivo = await obtenerFotoSeleccionado(seleccionado);
    if (!archivo.foto) {
      return res.sendStatus(400);
    }    
    res.set('Content-Type', 'image/jpeg'); // Cambia el tipo de contenido a JPEG
    res.set('Content-Disposition', `inline; filename="foto.jpg"`); // Cambia el nombre del archivo a descargar
    res.status(200).send(archivo.foto);

  } catch (error) {
    console.error('Error :', error);
  }
};

// Edita los datos del personal
const editarDatos = async (req, res) => {
  const propiedadEditar = req.params.editar;
  const { valor: propiedadEditada, id } = req.body;
  await editarDatosPersonal(propiedadEditar, propiedadEditada, id);
  return res.sendStatus(200); // res.status(200).json({ ok: true });
};

// Edita la foto del personal
const editarFoto = async (req, res) => {
  const foto = req.file.buffer; // Obtiene el archivo como un buffer
  const id = req.body.id;
  await editarFotoPersonal(foto, id);
  return res.sendStatus(200);
}

export const methods = {
  nickname, listaUsuarios, datosSeleccionado, FotoSeleccionado, datosSeleccion, fotoSeleccion, editarDatos, editarFoto
};