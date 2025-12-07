import React, { useEffect, useContext, useState} from "react";
import styled from "styled-components";
import SingleActivity from "../../acitivity-components/SingleActivity.js";
import { CurrentUserContext } from '../../all-contexts/currentUserContext.js';
import CircularProgress from '@mui/material/CircularProgress/index.js';
// **********************************************************
// This components is rendered inside the user profile page
// It shows the activities the user of the profile  has posted
// ***********************************************************
const ActivityPosted = ({ profileData }) => {
    const { usuarioActual } = useContext(CurrentUserContext)
    const [ postsData, setPostsData ] = useState([]);
    const [ postDataStatus, setPostDataStatus ] = useState('loading');

    useEffect(()=>{
        // get the data of all posts in the system
        fetch(`/posts/creator/${profileData._id}`)
        .then(res=> res.json())
        .then(data => {
            setPostsData(data.posts); // Store all posts data in postsData state variable
            setPostDataStatus('idle');
        })

        // Clean up when this components is unmounted
        return () => {
            setPostsData([]);
            setPostDataStatus('loading');
        }
    },[])

    if( postDataStatus === 'loading'){
        return(
        <CircleWrapper>
            <CircularProgress style={{'color': '#EE6C4D'}} />
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