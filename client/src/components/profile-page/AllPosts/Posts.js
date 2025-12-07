import React,{ useState } from "react";
import styled from "styled-components";
import ToggleBar from "./ToggleBar.js";
import ActivityJoined from "./ActivitedJoined.js";
import ActivityPosted from "./ActivityPosted.js";

// *********************************************************************************
// Este componente incluye ambos componentes ActivityJoined y ActivityPosted
// y los renderiza aquí en posts. Este componente se renderiza en la página de perfil
// *********************************************************************************
const Posts = ({ profileData }) => {
    // Esta variable se utiliza para controlar la barra de alternancia
    // inicializada con 1 para resaltar 'Actividades Publicadas' primero al renderizar
    const [ displayedPage, setDisplayedPage ] = useState(1);
    
    return(
        <Wrapper>
            <ToggleBar setDisplayedPage = { setDisplayedPage }/>
            { displayedPage === 1
            ? <ActivityPosted profileData = { profileData }/>
            : <ActivityJoined profileData = { profileData }/>
            }
            <br/>
            <br/>
        </Wrapper>
    );
}

const Wrapper = styled.div`
height: 50%;
z-index: 0;
`;

export default Posts
