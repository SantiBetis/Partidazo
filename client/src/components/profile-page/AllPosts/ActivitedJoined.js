import React, { useEffect, useContext, useState} from "react";
import styled from "styled-components";
import SingleActivity from "../../acitivity-components/SingleActivity.js";
import { CurrentUserContext } from '../../all-contexts/currentUserContext.js';
import CircularProgress from '@mui/material/CircularProgress/index.js';

// **********************************************************
// Este componente se renderiza dentro de la página de perfil del usuario
// Muestra las actividades a las que el usuario del perfil se ha unido
// ***********************************************************

const ActivityJoined = ( { profileData }) => {
    const { usuarioActual } = useContext(CurrentUserContext)
    const [ postsData, setPostsData ] = useState([]);
    const [ postDataStatus, setPostDataStatus ] = useState('loading');

    useEffect(()=>{
        // get the data of all posts in the system
        fetch(`/posts/joiner/${profileData._id}`)
        .then(res=> res.json())
        .then(data => {
            setPostsData(data.posts); // Store all posts data in postsData state variable
            setPostDataStatus('idle');
        })

        // Clean up when this components is unmounted
        return()=>{
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
                    ? "No te has unido a ninguna actividad"
                    : "Este usuario no se ha unido a ninguna actividad"
                }
            </CircleWrapper>
            :
            <Wrapper>
                { postsData.map( (post) => {
                    return <SingleActivity key = { post._id } post = {post}/>
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

export default ActivityJoined
