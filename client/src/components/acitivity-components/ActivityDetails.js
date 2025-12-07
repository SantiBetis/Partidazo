import React, { useContext, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useParams, useHistory } from "react-router";
import { FaShieldAlt, FaArrowLeft } from "react-icons/fa/index.esm.js";
import CircularProgress from '@mui/material/CircularProgress/index.js';
import { FiMapPin, FiClipboard } from "react-icons/fi/index.esm.js";
import moment from 'moment';
import JoinButton from './JoinButton.js';
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import ActivityParticipant from "./ActivityParticipant.js";
import { sportToSpanish, levelToSpanish } from "../create-activity-page/sportTranslations.js";


const ActivityDetails = () => {
    // Get the current user data de la context
    const { usuarioActual } = useContext(CurrentUserContext);
    const history = useHistory();

    // Get the post id for fetching 
    const { _id } = useParams();

    // A state variable store single post data aftet fetching
    const [ postData, setPostData] = useState(null);

    // A state variable to handle the loading screen until data is fetched
    const [ postStatus, setPostStatus ] = useState('loading');

    // A state variable to handle the update of remaning sports in the actividad 
    // The State varibale is for user interaction to show a realtime update in the number 
    // of remanining sports in the actividad. The backend already is built to update the remaining spots for an actividad
    const [ numOfRemaniningSpots, SetNumOfRemaniningSpots ] = useState(undefined);

    // Create an endpoint to fetch specific post information
    useEffect(()=>{
        setPostStatus('loading');
        fetch(`/posts/${_id}`)
        .then( res => res.json())
        .then( data =>{
            setPostData(data.post);
            setPostStatus('idle');
            SetNumOfRemaniningSpots(data.post.limit && data.post.participando ? data.post.limit - data.post.participando.length : 0);
        });
    },[_id]);

    if( postStatus === 'loading'){
        return (
            <CircleWrapper>
                <CircularProgress style={{'color': '#EE6C4D'}} />
            </CircleWrapper>)
    }
    return(
        <Wrapper>
            <ReturnBar>
                <ReturnButton onClick = {() => history.goBack()}>
                    <FaArrowLeft size ={30}/>
                </ReturnButton>
            </ReturnBar>
            <Summary>
                <FaShieldAlt size = {100} color = {'#EE6C4D'}/>
                { 
                    usuarioActual && postData.creator_id !== usuarioActual._id && 
                    <JoinButton 
                        postData = {postData} 
                        numOfRemaniningSpots = {numOfRemaniningSpots} 
                        SetNumOfRemaniningSpots = {SetNumOfRemaniningSpots}
                    />
                }
                <Type>
                    <span>{sportToSpanish[postData.actividadType] || postData.actividadType || 'Deporte desconocido'}</span>
                    {" - "}
                    <span>Nivel {levelToSpanish[postData.level] || postData.level || 'desconocido'}</span>
                </Type>
                <Date>
                    {postData.actividadDate && postData.actividadDate.date
                        ? moment(postData.actividadDate.date, 'YYYY-MM-DD').format('DD [de] MMMM [de] YYYY')
                        : 'Fecha no disponible'
                    }
                </Date>
                <Time>
                    {postData.actividadDate && postData.actividadDate.from && postData.actividadDate.to
                        ? `${moment(postData.actividadDate.from , 'HH:mm').format('hh:mm A')} to ${moment(postData.actividadDate.to , 'HH:mm').format('hh:mm A')}`
                        : 'Hora no disponible'
                    }
                </Time> 
                <SubContainer>
                    <Text>
                        <FiClipboard size = {20}/>
                        <span>{numOfRemaniningSpots} plazas disponibles</span>
                    </Text>
                    <Text>
                        <FiMapPin size = {20}/>
                        <span>{postData.actividadAddress?.city || 'Ciudad desconocida'}, {postData.actividadAddress?.province || 'Provincia desconocida'} </span>
                    </Text>
                </SubContainer>
            </Summary>

            <Container>
                <Description>
                    <h2>Descripción</h2>
                    <p>
                        {postData.description || 'Sin descripción'}
                    </p>
                </Description>
                <Address>
                    <h2>Dirección</h2>
                    <p>
                    {postData.actividadAddress?.street || 'Calle desconocida'}{', '}
                    {postData.actividadAddress?.city || 'Ciudad desconocida'}{', '}
                    {postData.actividadAddress?.province || 'Provincia desconocida'}
                    </p>
                </Address>
            </Container>
            <Container>
                <Description>
                    <h2>Participantes</h2>
                    <ParticipantsContainer>
                        <ActivityParticipant role = {'Activity Host'} _id = {postData.creator_id} />
                        {
                            postData.participando && postData.participando.map( (participant) => {
                                if ( participant._id !==  postData.creator_id){
                                    return(
                                        <ActivityParticipant key ={participant._id} role = {'Participant'} _id = {participant._id} />
                                        )
                                }
                            })
                        }
                    </ParticipantsContainer>
                </Description>
            </Container>
            <br/>
            <br/>
        </Wrapper>
    );
}

const PuffInCenter = keyframes`
    0% {
        -webkit-transform: scale(2);
                transform: scale(2);
        -webkit-filter: blur(4px);
                filter: blur(4px);
        opacity: 0;
    }
    100% {
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-filter: blur(0px);
                filter: blur(0px);
        opacity: 1;
    }
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
display: flex;
flex-direction: column;
height: 100%;
overflow: auto;
/* animation: ${PuffInCenter} 0.4s both; */
animation: ${slideIn} 0.4s ease-out both;
`;

const CircleWrapper = styled.div`
display: flex;
height: 100vh;
justify-content: center;
align-items: center;
`;

const ReturnBar = styled.div`
/* border: 1px solid red; */
padding: 10px 10px;
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

const Summary = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
/* border: 1px solid green; */
padding: 30px 0px;
`;

const Container = styled.div`
padding: 0px 15px;
`;
const Description = styled.div`
h2{
    font-size: 1.5em;
    border-bottom: 2px solid #E0FBFC;
    padding-bottom: 6px;
    color: #EE6C4D;
}
p{
    margin:10px 0px;
}
`;
const Address = styled.div`
h2{
    font-size: 1.5em;
    border-bottom: 2px solid #E0FBFC;
    padding-bottom: 6px;
    color: #EE6C4D;
}
p{
    margin:10px 0px;
}
`;

const Date = styled.div`
margin-top:5px;
font-size: 1.2em;
`;
const Time = styled.div`
margin-top:5px;
font-size: 1.2em;
`;
const Type = styled.div`
font-weight: 600;
font-size: 1.6em;
color: #EE6C4D;
`;

const SubContainer = styled.div`
display:flex;
/* border: 1px solid white; */
color: #BCDEEB;
font-size: 1.1em;
`;

const Text = styled.div`
display:flex;
margin: 7px;
align-items: center;
span{
    margin-left:7px;
}
`;

const ParticipantsContainer = styled.div`
display: flex;
flex-wrap: wrap;
margin-top: 10px;
`;

export default ActivityDetails