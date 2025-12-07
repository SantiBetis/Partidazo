import React,{ useState } from "react";
import styled from "styled-components";
// ***************************************************************
// Este componente maneja el botón de seguir/dejar de seguir que se muestra
// en el perfil del usuario
// ***************************************************************

const FollowButton = ({ usuarioActual, targetedUser, numOfFollowers, setNumOfFollowers })=>{

    // Verificar si el usuario actual ya está siguiendo al usuario objetivo o no
    // Si es así, establecer el valor inicial de isCurrentUserFollowing en true
    // Si no, establecer el valor inicial de isCurrentUserFollowing en false
    // La variable de estado es para el frontend, el backend ya sabe si se le pide seguir o dejar de seguir
    // basado en el estado actual de seguimiento 
    const initialFollowerStatus = targetedUser.followers.some( (user) => user._id === usuarioActual._id) ? true: false;
    const [ isCurrentUserFollowing, setIsCurreuntUserFollowing ] = useState(initialFollowerStatus);

    const handleFollowing = () => {
        // When follow button is clicked, set the opposite of it's current value 
        setIsCurreuntUserFollowing(!isCurrentUserFollowing);
        // Increment or decrement the number of followers in frontend based on the current
        // following status
        isCurrentUserFollowing 
        ? setNumOfFollowers(numOfFollowers - 1)
        : setNumOfFollowers(numOfFollowers + 1);

        fetch('/users/follow',
        {
            method: "PUT",
            body: JSON.stringify({ usuarioActual , targetedUser }),
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
        })
    }

    return(
        <Wrapper>
            {isCurrentUserFollowing ?
            <Button onClick={()=> handleFollowing()} style = {{ background:'#00C258'}}>
                Dejar de Seguir
            </Button>
            :
            <Button onClick={()=> handleFollowing()} style = {{ background:'#98C1D9'}}>
                Seguir
            </Button>
            }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

const Button = styled.button`
    margin: 10px;
    color: white;
    border: 2px solid white;
    border-radius: 6px;
    padding: 5px 15px;
    text-align: center;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    white-space: nowrap;
`;

export default FollowButton
