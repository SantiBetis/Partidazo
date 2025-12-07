import React from "react";
import styled from "styled-components";
import SingleActivity from "../acitivity-components/SingleActivity.js";
import CircularProgress from '@mui/material/CircularProgress/index.js';
//****************************************************************
// Este componente renderiza el feed principal. Muestra todos los posts
// con el filtro elegido
//****************************************************************


const Search = ({postsData, postDataStatus}) => {

    if(postDataStatus === 'loading'){
        return (
            <CircleWrapper>
                <CircularProgress style={{'color': '#00C258'}} />
            </CircleWrapper>)
    }

    if( postsData.length === 0 ){
        return(
            <CircleWrapper>
                    <span>No hay actividades con las especificaciones proporcionadas </span>
            </CircleWrapper>
        )
    }

    return(
        <Wrapper>
            {
                postsData.map( (post) => {
                    return <SingleActivity key = { post._id} post = {post}/>
                })
            }
            <br/>
            <br/>
            <br/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
overflow: auto;
height: calc( 100% - 50px - 40px );
z-index:-100;
`;

const CircleWrapper = styled.div`
display: flex;
height: 100%;
justify-content: center;
align-items: center;

span{
    text-align:center;
}
`;

export default Search
