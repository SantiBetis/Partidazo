import React, { useEffect, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import { useParams, useHistory } from "react-router";
import CircularProgress from '@mui/material/CircularProgress/index.js';
import noImg from '../assets/noImg.png';
import LogoutButton from "../login-signup-pages/LogoutButton.js";
import Posts from "./AllPosts/Posts.js";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import { FiChevronLeft } from "react-icons/fi/index.esm.js";
import FollowButton from "./AllPosts/FollowButton.js";
import FollowersModal from "./FollowersModal.js";
import moment from 'moment';
import BannerBackground from "../../components/assets/profile-low-poly-grid-haikei.svg";

/**
 * Componente de la página de perfil de usuario.
 * Renderiza el perfil tanto del usuario actual como de otros usuarios.
 * Muestra información del usuario, estadísticas (seguidores/siguiendo), foto de perfil.
 * Permite seguir/dejar de seguir usuarios (si no es el perfil propio).
 * Muestra las actividades creadas y a las que se ha unido el usuario.
 * Incluye modales para ver listas de seguidores y seguidos.
 */
const Profile = () => {
    
    let history = useHistory();
    let { _id } = useParams();
    
    // Obtener información del usuario actual desde el contexto
    const { usuarioActual } = useContext(CurrentUserContext);
    // Estado para almacenar los datos del perfil que se está visualizando
    const [profileData,setProfileData] = useState(null);
    const [profileDataStatus,setProfileDataStatus] = useState("idle");

    // Estado para actualizar el número de seguidores en el frontend inmediatamente
    // (actualización optimista para mejor UX mientras el backend procesa)
    const [ numOfFollowers, setNumOfFollowers ] = useState(undefined);
    
    // Estados para controlar la apertura de modales de seguidores/seguidos
    const [followersModalOpen, setFollowersModalOpen] = useState(false);
    const [followingModalOpen, setFollowingModalOpen] = useState(false);
    
    /**
     * Obtiene los datos del perfil del usuario al montar el componente o cuando cambia el _id.
     * El _id proviene de useParams() y determina qué perfil se muestra.
     */
    useEffect( () => {
            setProfileDataStatus('loading')
            fetch(`/users/${_id}`)
            .then(res => res.json())
            .then(data => {
                setProfileData(data.user);
                setProfileDataStatus("idle");
                setNumOfFollowers(data.user.followers.length);
            });

    },[_id]);

    if( profileDataStatus === 'loading' || profileData == null || profileData === undefined || usuarioActual == null){
        return (
        <CircleWrapper>
            <CircularProgress style={{'color': '#00C258'}} />
        </CircleWrapper>
        
        )
    }

    return(
        <Wrapper>
            <Banner>
                { usuarioActual && usuarioActual._id !== profileData._id &&
                    <ReturnBar>
                        <ReturnButton onClick = {() => history.goBack()}>
                            <FiChevronLeft size ={30}/>
                        </ReturnButton>
                    </ReturnBar>
                }
            </Banner>
            <UserInfoContainer>
                {/* <ProfileImg src = { profileData.imgSrc !== '' ? profileData.imgSrc : noImg }/> */}
                <ProfileImgSquared style = {{ backgroundImage: `url(${profileData.imgSrc !== '' ? profileData.imgSrc  : noImg})`}} ></ProfileImgSquared>
                <SubContainer>
                    <DisplayName>
                        <span>{profileData.displayName}</span>
                        <div>Se unió el {moment(profileData.joined).format("DD [de] MMMM [de] YYYY")}</div>
                    </DisplayName>
                    { usuarioActual && usuarioActual._id !== profileData._id &&
                        <FollowButton 
                            usuarioActual={usuarioActual}
                            targetedUser = { profileData }
                            numOfFollowers = {numOfFollowers}
                            setNumOfFollowers = {setNumOfFollowers}
                        />
                    }
                    { usuarioActual && usuarioActual._id === profileData._id &&
                        <LogoutButton/>
                    }
                </SubContainer>
                <Bio>
                    {profileData.bio}
                </Bio>
                <AccountStats>
                    <StatButton onClick={() => setFollowersModalOpen(true)}>
                        {numOfFollowers}
                        <span>seguidores</span>
                    </StatButton>
                    <StatButton onClick={() => setFollowingModalOpen(true)}>
                        {profileData.following ? profileData.following.length : 0}
                        <span>siguiendo</span>
                    </StatButton>
                    <Stat>
                        {profileData.activitiesPosted ? profileData.activitiesPosted.length : 0}
                        <span>publicaciones</span>
                    </Stat>
                </AccountStats>
            </UserInfoContainer>
            <FollowersModal 
                isOpen={followersModalOpen}
                onClose={() => setFollowersModalOpen(false)}
                userIds={profileData.followers ? profileData.followers.map(f => f._id) : []}
                title="Seguidores"
            />
            <FollowersModal 
                isOpen={followingModalOpen}
                onClose={() => setFollowingModalOpen(false)}
                userIds={profileData.following ? profileData.following.map(f => f._id) : []}
                title="Siguiendo"
            />
            <Posts profileData = {profileData} />
        </Wrapper>
    )

}

const CircleWrapper = styled.div`
display: flex;
height: 100%;
justify-content: center;
align-items: center;
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

const Wrapper = styled.div`
display:flex;
flex-direction: column;
height: 100%;
animation: ${slideIn} 0.4s ease-out both;

`;

const UserInfoContainer = styled.div`
display:flex;
flex-direction: column;
justify-content: flex-end;
height: 30%;
background: #293241;
padding-bottom: 10px;
`;

const Banner = styled.div`
width:100%;
height:20%;
background-image: url(${BannerBackground});
background-repeat: no-repeat;
background-position: center;
background-size: cover;
`;

// This has an issue when imge is not squared
// const ProfileImg = styled.img`
// position: absolute;
// width: 150px;
// height: 150px;
// border-radius: 50%;
// background-color: grey;
// border: 5px solid #293241;
// top: 28px;
// left: 13px;
// `
// This fixes the issue when the image is not squared
const ProfileImgSquared = styled.div`
background-repeat: no-repeat;
background-position: center;
background-size: cover;
position: absolute;
width: 150px;
height: 150px;
border-radius: 50%;
background-color: grey;
border: 5px solid #293241;
top: 28px;
left: 13px;

@media (max-height: 736px) {
        height: 15vh;
        width: 15vh;
}
`;
const SubContainer = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
height: 50px;
`

const DisplayName = styled.div`
margin: 10px;
font-size: large;
div{
    padding: 2px 0px;
    font-size: 0.8em;
    color:grey;
}

@media (max-height: 736px) {
    font-size: 0.75em;
}

`;

const Bio = styled.div`
margin: 10px;
font-size: 0.9em;

@media (max-height: 736px) {
    font-size: 0.75em;
}

`;

const AccountStats = styled.div`
display: flex;
justify-content: space-between;

@media (max-height: 736px) {
    font-size: 0.75em;
}
`

const Stat = styled.div`
flex:1;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

const StatButton = styled.button`
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
background: none;
border: none;
color: inherit;
cursor: pointer;
padding: 0;
font: inherit;
transition: all 0.3s ease;

&:hover {
    color: #00C258;
    transform: scale(1.05);
}

&:active {
    transform: scale(0.98);
}
`;

const ReturnBar = styled.div`
padding: 5px 5px;
`;

const ReturnButton = styled.button`
background: none;
color: inherit;
border: none;
padding: 0;
font: inherit;
cursor: pointer;
outline: inherit;
`;
export default Profile
