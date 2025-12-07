import React, { useContext, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import { FiMapPin, FiClipboard, FiXCircle, FiCheckCircle } from "react-icons/fi/index.esm.js";

const JoinButton = ({ postData, numOfRemaniningSpots, SetNumOfRemaniningSpots }) => {

    // Get the current user data de la context
    const { usuarioActual } = useContext(CurrentUserContext);

    // Verificar si la actividad está en el pasado
    const actividadEndTime = postData.actividadDate && postData.actividadDate.date && postData.actividadDate.to
        ? new Date(`${postData.actividadDate.date}T${postData.actividadDate.to}`)
        : null;
    const now = new Date();
    const isActivityPassed = actividadEndTime ? actividadEndTime < now : false;

    // Check the current status of participando ( before clicking on the join/withdraw button )
    // If the user has already joined, then the initial value for isCurrentUserJoined is set to true
    // If the user has not joined, then the initial value for isCurrentUserJoined is set to false
    const initialJoiningStatus = postData.participando && usuarioActual 
        ? postData.participando.some( (user) => user._id === usuarioActual._id) 
        : false;
    const [ isCurrentUserJoined, setIsCurreuntUserJoined ] = useState(initialJoiningStatus);

    const handleJoining = () => {
        // This update is for userinteraction to change the button style based on
        // the current status of participando
        setIsCurreuntUserJoined(!isCurrentUserJoined);

        // This is also for frontend to increment/decrement num of spots in the actividad
        isCurrentUserJoined 
        ? SetNumOfRemaniningSpots( numOfRemaniningSpots + 1)
        : SetNumOfRemaniningSpots( numOfRemaniningSpots - 1);

        // Now let's let the backend does its work to update the participando status + the num of remaning spots
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