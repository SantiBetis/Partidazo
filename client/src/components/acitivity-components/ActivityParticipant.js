import React,{ useState, useEffect } from "react";
import styled from "styled-components";
import noImg from '../assets/noImg.png';
import { useHistory } from "react-router";

/**
 * Componente ActivityParticipant - Muestra información de un participante en una actividad
 * Obtiene y muestra los datos del usuario (foto de perfil y nombre)
 * Diferencia visualmente entre el anfitrión de la actividad y los participantes regulares
 * 
 * @param {String} role - Rol del participante ('Activity Host' o 'Participant')
 * @param {String} _id - ID del usuario participante
 */
const ActivityParticipant = ({ role, _id }) => {

    // Estados para almacenar datos del usuario y estado de carga
    const [userData,setUserData] = useState(null);
    const [userDataStatus,setUserDataStatus] = useState("loading");
    const history = useHistory();

    // Obtener datos del usuario cuando el componente se monta o cambia el _id
    useEffect( () => {
        fetch(`/users/${_id}`)
        .then(res => res.json())
        .then(data => {
            setUserData(data.user);
            setUserDataStatus("idle");
        })
    },[_id]);

    /**
     * Navega al perfil del usuario cuando se hace clic en el participante
     */
    const handleUserProfile = () => {
        history.push(`/profile/${_id}`);
    }

    if( userDataStatus === 'loading'){
        return(
            <div></div>
        )
    }
    return(
        <Wrapper>
            <Container onClick = {() => handleUserProfile()}>
                <Role style = { role === 'Activity Host' ? { color:'#00C258'} :{ color:'#98C1D9'}}>
                    {role === 'Activity Host' ? 'Anfitrión de Actividad' : 'Participante'}
                </Role>
                <SubContainer>
                    <ProfileImgSquared 
                        style = { { backgroundImage: `url(${userData.imgSrc !== '' ? userData.imgSrc : noImg})`} } 
                        alt="user image" 
                    ></ProfileImgSquared>
                    <Username>
                        {userData.displayName}
                    </Username>
                </SubContainer>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
width:50%;
/* border: 1px solid red; */
padding: 5px;
cursor: pointer;

`;

const Container = styled.div`
width:100%;
/* border: 1px solid white; */
border-radius: 5px;
display: flex;
background-color: #3C4552;
flex-direction: column;
align-items: center;
padding: 5px;
box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
`;

const Role = styled.div`
color: #98C1D9;
`;

const SubContainer = styled.div`
display: flex;
width: 100%;
align-items: center;
margin: 5px 0px;
/* border: 1px solid white; */
`;

const UserImg = styled.img`
width:40px;
border-radius: 50%;
border: 1px solid white;
margin-right: 5px;
`;

const Username = styled.div`
font-size: 0.8em;
`;

const ProfileImgSquared = styled.div`
background-repeat: no-repeat;
background-position: center;
background-size: cover;
width: 40px;
height: 40px;
border-radius: 50%;
background-color: grey;
border: 1px solid white;
margin-right: 5px;`;

export default ActivityParticipant
