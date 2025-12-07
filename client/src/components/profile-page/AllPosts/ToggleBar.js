import React,{ useState } from "react";
import styled from "styled-components";
// ***********************************************************
// Barra de alternancia simple para la página de perfil
// ***********************************************************

const ToggleBar = ({ setDisplayedPage }) => {

    // Variable de estado para controlar qué opción está subrayada o resaltada
    const [active, setActive] = useState(1);

    const handleClick = (page) => {
        setActive(page);
        setDisplayedPage(page);
    }

    return(
        <Wrapper>
            <Button active = {active === 2} onClick = {() => handleClick(2)} >
                Actividades Unidas
            </Button>
            <Button active = {active === 1} onClick = {() => handleClick(1)} >
                Actividades Publicadas
            </Button>
        </Wrapper>
    );

};

const Button = styled.button`
    background-color: #3C4552;
    border-bottom: 7px solid #3C4552;
    width: 50%;
    color: #00C258;
    font-size: 1.02em;
    cursor: pointer;

    ${({ active }) => active && ` border-bottom: 7px solid #00C258; `}

`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    flex-direction: row-reverse;
    background-color: #3C4552;
    height:35px;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;`;

export default ToggleBar
