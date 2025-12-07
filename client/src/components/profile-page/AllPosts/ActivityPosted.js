import React, { useEffect, useContext, useState} from "react";
import styled from "styled-components";
import SingleActivity from "../../acitivity-components/SingleActivity.js";
import { CurrentUserContext } from '../../all-contexts/currentUserContext.js';
import CircularProgress from '@mui/material/CircularProgress/index.js';
// **********************************************************
// Este componente se renderiza dentro de la página de perfil del usuario
// Muestra las actividades que el usuario del perfil ha publicado
// ***********************************************************
const ActivityPosted = ({ profileData }) => {
    const { usuarioActual } = useContext(CurrentUserContext)
    const [ postsData, setPostsData ] = useState([]);
    const [ postDataStatus, setPostDataStatus ] = useState('loading');

    useEffect(()=>{
        // obtener los datos de todas las publicaciones en el sistema
        fetch(`/posts/creator/${profileData._id}`)
        .then(res=> res.json())
        .then(data => {
            setPostsData(data.posts); // Almacena todos los datos de publicaciones en la variable de estado postsData
            setPostDataStatus('idle');
        })

        // Limpieza cuando este componente se desmonta
        return () => {
            setPostsData([]);
            setPostDataStatus('loading');
        }
    },[])

    if( postDataStatus === 'loading'){
        return(
        <CircleWrapper>
            <CircularProgress style={{'color': '#00C258'}} />
        </CircleWrapper>
        )
    }

    return(
        <>
        {
            postsData.length === 0 
            ?
            <CircleWrapper>
                {
                    usuarioActual._id === profileData._id
                    ? "No has publicado ninguna actividad"
                    : "Este usuario no ha publicado ninguna actividad"
                }
            </CircleWrapper>
            :
            <Wrapper>
                { postsData.map( (post) => {
                    return <SingleActivity key = {post._id} post = {post}/>
                })}
                
            </Wrapper>
        }
        </>
    )
}

const Wrapper = styled.div`
overflow: auto;
height: calc(100% - 35px);
z-index:0;
`;

const CircleWrapper = styled.div`
display: flex;
height: calc(100% - 35px);
justify-content: center;
align-items: center;
`;
export default ActivityPosted
