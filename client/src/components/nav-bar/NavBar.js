import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import { FiBell, FiUser, FiMessageCircle, FiHome, FiPlusCircle } from "react-icons/fi/index.esm.js";

//*****************************************************************
// Esta es la barra de navegación en la aplicación principal, navega entre
// perfil, chat, publicar una actividad, notificaciones y feed principal
//*****************************************************************
const NavBar = () => {

    // Una variable de estado para controlar la página activa de la barra de navegación
    const [active, setActive] = useState(1);
    const { usuarioActual } = useContext(CurrentUserContext)
    let history = useHistory();

    // Hacer clic en los elementos de la barra de navegación debe llevar a la página apropiada y resaltar ese elemento con el tabId adecuado
    const handleClick = (tabId,path) => {
        setActive(tabId);
        history.push(`/${path}`);
    }

    const iconSize = 37;
    
    return(
        <Wrapper>
            <Button active = {active === 1} onClick = {() => handleClick(1,`profile/${usuarioActual._id}`)}>
                <FiUser size = {iconSize} color = {'00C258'}/>
            </Button>
            <Button active = {active === 2} onClick = {() => handleClick(2,'group-chats')}>
                <FiMessageCircle size = {iconSize} color = {'00C258'}/>
            </Button>
            <Button active = {active === 3} onClick = {() => handleClick(3,'create-actividad')}>
                <FiPlusCircle size = {iconSize} color = {'00C258'}/>
            </Button>
            <Button active = {active === 4} onClick = {() => handleClick(4,'notifications')}>
                <FiBell size = {iconSize} color = {'00C258'}/>
            </Button>
            <Button active = {active === 5} onClick = {() => handleClick(5,'home')}>
                <FiHome size = {iconSize} color = {'00C258'}/>
            </Button>
        </Wrapper>
    );

}


const Button = styled.button`
    background-color: #3C4552;
    border-bottom: 7px solid rgba(255,255,255,0.1);
    width: 25%;
    cursor: pointer;

    ${({ active }) => active && ` border-bottom: 7px solid #00C258; `}

`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    flex-direction: row-reverse;
    background-color: #3C4552;
    height:60px;
    z-index: 5;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;    
`;

export default NavBar
