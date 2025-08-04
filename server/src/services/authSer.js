/* SERVICIOS DE AUTENTICACIÓN DE USUARIOS*/
import { comprobarUsuario, comprobarActivo } from '../models/authMod.js';

export async function loginService(nickname, psw) {
    const validez = await comprobarActivo(nickname);
    if (validez) {
        const result = await comprobarUsuario(nickname, psw);
        return result;
    } else {
        return { error : "Su acceso es inválido"}
    }
}

export function definirTipoUsuario(session) {
    const user = {
        username: session.user,
        isAdmin: session.admin,
        tipo: session.tipo,
        id: 0
    };

    if (session.admin == undefined) return user;

    if (session.admin === true) {
        user.id = (session.tipo === 'Super Administrador') ? 1 : 2;
    } else {
        user.id = (session.tipo === 'Aplicativo') ? 3 : 4;
    }

    return user;
};