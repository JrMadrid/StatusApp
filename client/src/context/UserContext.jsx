/* CONTEXT DE USUARIO */
import { createContext, useState, useEffect } from 'react'; // createContext: crea un contexto para compartir datos entre componentes funciona como un store global
import fetchData from '../api/connect';

/* Crea el context */
export const UserContext = createContext();

/* Pedimos el tipo de usuario, si se ha definido o no entre administrador y visita */
export const UserProvider = ({ children }) => { // children es el componente que envuelve al provider
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchData(`http://${process.env.REACT_APP_HOST}/auth/api/user`); 
                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const data = await response.json();
                
                setUser(data);
            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={user}> {/* </-- Provee el valor del contexto --> */}
            {children} {/* </-- Renderiza los hijos del provider --> */}
        </UserContext.Provider>
    );
};