import React,{ useContext } from 'react';
import styled,{ keyframes } from "styled-components";
import Chat from './components/Chat.js';
import { CurrentUserContext } from '../all-contexts/currentUserContext.js';
import { useParams } from 'react-router';

/**
 * Componente contenedor del sistema de chat.
 * Envuelve el componente Chat y maneja la carga del usuario actual.
 * El _id de la actividad se obtiene de los parámetros de la URL.
 * Cada actividad tiene su propia sala de chat en tiempo real.
 */
const ChatSys = () => {

  // Obtener el ID de la actividad desde la URL
  const { _id } = useParams();

  const { usuarioActual } = useContext(CurrentUserContext);

  // Mostrar mensaje de carga mientras se obtiene el usuario actual
  if ( usuarioActual == null ){

    return <div> ...Loading </div>

  }
  
  return (
    <Wrapper>
      <Chat usuarioActual = { usuarioActual } actividadId = { _id }/>
    </Wrapper>
  );
}

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

const Wrapper = styled.div`
height: 100%;
animation: ${slideIn} 0.4s ease-out both;

`;



export default ChatSys;
