import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import SingleNotification from "./SingleNotification.js";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js"
import CircularProgress from '@mui/material/CircularProgress/index.js';

/**
 * Componente de la página de notificaciones.
 * Muestra todas las notificaciones del usuario actual (unirse a actividades, nuevos seguidores, etc.).
 * Obtiene las notificaciones desde el perfil del usuario y las muestra en orden inverso (más recientes primero).
 * Maneja estados de carga y muestra mensaje cuando no hay notificaciones.
 */
const Notifications = () => {

    const { usuarioActual } = useContext(CurrentUserContext);
    const  [notifications, setNotifications ] = useState([]);
    const  [notificationsStatus, setNotificationsStatus ] = useState('loading');

    /**
     * Obtiene las notificaciones del usuario al montar el componente.
     * Nota: Obtiene el perfil completo del usuario para acceder a notifications[].
     * Las notificaciones se invierten para mostrar las más recientes primero.
     */
    useEffect( () => {
        setNotificationsStatus('loading')
        fetch(`/users/${usuarioActual._id}`)
        .then(res => res.json())
        .then(data => {
            // Invertir el array para mostrar notificaciones más recientes primero
            // (flexbox reverse causaba problemas con el scroll vertical)
            setNotifications(data.user.notifications.reverse());
            setNotificationsStatus("idle");
        })
    },[]);


    if( notificationsStatus === 'loading'){
        return (
            <Wrapper>
                <h2>Notificaciones</h2>
                <CircleWrapper>
                    <CircularProgress style={{'color': '#00C258'}} />
                </CircleWrapper>
            </Wrapper>
        )
    }
    else if(notifications.length === 0){
        return (
            <Wrapper>
                <h2>Notificaciones</h2>
                <CircleWrapper>
                    No has recibido ninguna notificación 
                </CircleWrapper>
            </Wrapper>
        )
    }

    return(
        <Wrapper>
            <h2>Notificaciones</h2>
            <Container>
                {
                    notifications.map( (notification) => <SingleNotification key = {notification._id} notification = {notification}/>)
                }
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    height:100%;
h2{
    height:40px;
    text-align:center;
}
`;

const slideIn = keyframes`
  0% {
    -webkit-transform: translateX(1000px);
            transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
    opacity: 1;
  }
`;

const CircleWrapper = styled.div`
display: flex;
height: 100%;
justify-content: center;
align-items: center;
`;

const Container = styled.div`
    overflow: auto;
    display: flex;
	flex-direction: column;
    height:calc(100% - 40px);
    animation: ${slideIn} 0.4s ease-out both;
`;

export default Notifications
