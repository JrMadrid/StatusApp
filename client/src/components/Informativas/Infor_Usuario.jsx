/* COMPONENTE DE INFORMATIVA -- USUARIO */
import { React, useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import '../css/Infor_Sucursal.css';
import logoSoporte from '../../imgs/LogoSoporte.png';
import fetchData from '../../api/connect';

export default function InfoUsuario() {
    const [userslist, setUserslist] = useState([]);

    useEffect(() => {
        const listaUsuarios = async () => {
            try {
                const url = `http://${process.env.REACT_APP_HOST}/informe/users/lista/nombres`;
                const response = await fetchData(url);

                if (!response.ok) {
                    throw new Error('Sin respuesta');
                }
                const lista = await response.json();

                setUserslist(lista);
                console.log(userslist)

            } catch (error) {
                console.error('Error consiguiendo los datos: ', error);
            }
        }

        listaUsuarios();
    }, [])

    return (
        <>
            <div className='sidebar'>
                <h3 className='heading'></h3>
                <h3 className='heading'></h3>
                <h3 className='heading'></h3>
                <h3 className='principal'>Usuarios</h3>
                <ul className='list' style={{ textAlign: 'center' }}>
                    {userslist.map((usuarios, index) => (
                        <>
                            <li key={index} className='listItem' style={{ display: 'inline-block' }}>
                                <div className='ListItemA' onClick={(e) => { e.preventDefault(); }}>
                                    <a href={`#${index}`} className='appi' >{usuarios.nickname}</a>
                                </div>
                            </li>
                        </>
                    ))}

                </ul>
                <br />
                <br />
                <div className='logodiv'>
                    <img src={logoSoporte} className='logo' alt="Logo de Soporte" />
                </div>
            </div >
            <div>
                <h2 className='titulo'>Soporte Técnico Honduras</h2>

            </div>
            <Toaster toastOptions={{ className: 'noti' }} />
        </>
    );
};