import React, { useContext, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import { FiMapPin, FiClipboard, FiXCircle, FiCheckCircle } from "react-icons/fi/index.esm.js";

/**
 * Componente JoinButton - Botón para unirse o retirarse de una actividad
 * Permite a los usuarios unirse a actividades deportivas o retirarse de ellas
 * Muestra el estado actual de participación y gestiona la lógica de unión/retiro
 * 
 * @param {Object} postData - Datos completos de la actividad (fecha, hora, participantes, límite, etc.)
 * @param {Number} numOfRemaniningSpots - Número de plazas disponibles restantes
 * @param {Function} SetNumOfRemaniningSpots - Función para actualizar el número de plazas disponibles
 */
const JoinButton = ({ postData, numOfRemaniningSpots, SetNumOfRemaniningSpots }) => {

    // Obtener datos del usuario actual del contexto
    const { usuarioActual } = useContext(CurrentUserContext);

    // Verificar si la actividad está en el pasado
    const actividadEndTime = postData.actividadDate && postData.actividadDate.date && postData.actividadDate.to
        ? new Date(`${postData.actividadDate.date}T${postData.actividadDate.to}`)
        : null;
    const now = new Date();
    const isActivityPassed = actividadEndTime ? actividadEndTime < now : false;

    // Verificar el estado actual de participación (antes de hacer clic en el botón unirse/retirarse)
    // Si el usuario ya se unió, entonces el valor inicial para isCurrentUserJoined se establece en true
    // Si el usuario no se ha unido, entonces el valor inicial para isCurrentUserJoined se establece en false
    const initialJoiningStatus = postData.participando && usuarioActual 
        ? postData.participando.some( (user) => user._id === usuarioActual._id) 
        : false;
    const [ isCurrentUserJoined, setIsCurreuntUserJoined ] = useState(initialJoiningStatus);

    /**
     * Maneja la acción de unirse o retirarse de la actividad
     * Actualiza el estado local y envía la solicitud al backend
     */
    const handleJoining = () => {
        // Esta actualización es para la interacción del usuario para cambiar el estilo del botón basado en
        // el estado actual de participación
        setIsCurreuntUserJoined(!isCurrentUserJoined);

        // Esto también es para el frontend para incrementar/decrementar el número de plazas en la actividad
        isCurrentUserJoined 
        ? SetNumOfRemaniningSpots( numOfRemaniningSpots + 1)
        : SetNumOfRemaniningSpots( numOfRemaniningSpots - 1);

        // Ahora permitir que el backend haga su trabajo para actualizar el estado de participación + el número de plazas restantes
        fetch('/post/updateJoining',
        {
            method: "PUT",
            body: JSON.stringify({usuarioActual , postData }),
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
        })
    }

    // Si la actividad ya pasó
    if (isActivityPassed) {
        return (
            <JoiningStatus>
                <Status>
                    <FiXCircle size={20} color={'#FF6B6B'} />
                    <span style={{ color: '#FF6B6B' }}>Esta actividad ya ha finalizado</span>
                </Status>
                <br />
            </JoiningStatus>
        );
    }

    if( postData.limit && postData.participando && postData.limit - postData.participando.length === 0 && !initialJoiningStatus ){

        return(
            <JoiningStatus>
                <Status>
                    <FiXCircle size = {20} color = {'red'}/> 
                    <span style ={{color:'red'}}>No hay plazas disponibles para esta actividad</span>
                </Status>
                <br/>
            </JoiningStatus>
        )
    }
    return(
        <JoiningStatus>
            { isCurrentUserJoined 
            ?
                <>
                    <Status>
                        <FiCheckCircle size = {20} color = {'lightgreen'}/> 
                        <span>Te has unido a esta actividad</span>
                    </Status>
                    <Button onClick = {()=> handleJoining()} style = { { background:'red' }}>
                        Retirar
                    </Button>
                </>
            :
                <>
                    <Status>
                        <FiXCircle size = {20} color = {'red'}/> 
                        <span style ={{color:'red'}}>No te has unido a esta actividad</span>
                    </Status>
                    <Button onClick = {()=> handleJoining()} style = { { background:'green' }}>
                        Unirse
                    </Button>
                </>
            }
        </JoiningStatus>
    )
}

const Button = styled.button`
margin:10px;
color: inherit;
border: 2px solid white;
height: 40px;
width:100px;
padding: 5px 0px;
text-align: center;
font: inherit;
cursor: pointer;
outline: inherit;
`;

const JoiningStatus = styled.div`
margin-top: 5px;
display: flex;
flex-direction: column;
align-items: center;
/* border: 1px solid red; */
`;

const Status = styled.div`
display: flex;
align-items: center;

span {
    margin-left: 5px;
}
`;


export default JoinButton
