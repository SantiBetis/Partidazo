import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import CircularProgress from '@mui/material/CircularProgress/index.js';
import SingleGroupChatItem from "./components/SingleGroupChat.js";

const ChatLists = () => {

    // State variable to store current user joined activities 
    const [ actividadesUnidas, setJoinedActivities ] = useState([]);
    const [ postsStatus, setPostsStatus ] = useState('loading');

    // Get current user information
    const { usuarioActual } = useContext(CurrentUserContext);

    // Get the data of all joined Activities for the current user
    useEffect(()=> {
        setPostsStatus('loading');
        fetch(`/posts/joiner/${usuarioActual._id}`)
        .then(res => res.json())
        .then(data => {
            setJoinedActivities(data.posts);
            setPostsStatus('idle');
        });
    },[usuarioActual._id]);

    if( postsStatus === 'loading' || usuarioActual === null || usuarioActual === undefined ){
        return (
            <Wrapper>
                <h2>Chats de Actividades Unidas</h2>
                <CircleWrapper>
                    <CircularProgress style={{'color': '#00C258'}} />
                </CircleWrapper>
            </Wrapper>
        )
    }

    if( actividadesUnidas.length === 0){
        return(
            <Wrapper>
                <h2>Chats de Actividades Unidas</h2>
                <CircleWrapper>
                    No has unido ninguna actividad
                </CircleWrapper>
            </Wrapper>
        )
    }
    return(

        <Wrapper>
            <h2>Chats de Actividades Unidas</h2>
            {
                actividadesUnidas.map( (actividad) => {
                    return <SingleGroupChatItem key = {actividad._id} actividad ={ actividad } />
                })
            }
        </Wrapper>
    )
};

const Wrapper = styled.div`

h2 {
    margin:10px;
    text-align: center;
}
/* border: 1px solid red; */
height: 100%;
overflow: auto;
`;

const CircleWrapper = styled.div`
display: flex;
height: 100%;
justify-content: center;
align-items: center;
`;

export default ChatLists
