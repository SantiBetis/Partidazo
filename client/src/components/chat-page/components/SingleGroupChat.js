import React from "react";
import styled from "styled-components";
import moment from 'moment';
import { keyframes } from 'styled-components'
import { useHistory } from "react-router";
import { FiCalendar, FiMapPin, FiUsers } from "react-icons/fi/index.esm.js";
import singleChatItemBackground from "../../assets/chat-low-poly-grid-haikei.svg";
const SingleGroupChatItem = ({actividad}) => {

    let history = useHistory();

    const handleActivityChat = ()=>{
        history.push(`/chats/${actividad._id}`);
    };

    return(
        <Wrapper onClick = {()=> handleActivityChat()} >
            <Container >
                <Title>
                    <div>
                        {actividad.actividadType},
                    </div>
                    <div>
                        El {moment(actividad.actividadDate.date, 'YYYY-MM-DD').format('DD [de] MMMM [de] YYYY')}
                    </div>
                </Title>
                <Details>
                    <Time>
                        <FiCalendar/>
                        <span>Hora: {moment(actividad.actividadDate.from , 'HH:mm').format('hh:mm A')} - {moment(actividad.actividadDate.to , 'HH:mm').format('hh:mm A')}</span>
                    </Time>
                    <Members>
                        <FiUsers/>
                        <span>{actividad.participando.length} personas unidas a esta actividad</span>
                    </Members>
                </Details>
                <Address>
                    <FiMapPin/>
                    <span>
                        {actividad.actividadAddress.street}{', '}
                        {actividad.actividadAddress.city}{', '}
                        {actividad.actividadAddress.province}
                    </span>
                </Address>
            </Container>
        </Wrapper>
    )
}

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

const Container = styled.div`
display: flex;
flex-direction: column;
margin: 15px;
border-radius:10px;
padding:10px;
/* background-color: #293241; */
cursor: pointer;
box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
animation: ${slideIn} 0.5s ease-in-out;
background-image: url(${singleChatItemBackground});
background-repeat: no-repeat;
background-position: center;
background-size: cover;
`;

const Wrapper = styled.div`
/* border: 1px solid green; */
`;

const Title = styled.div`
display: flex;
color: #00C258;
div{
    margin-right: 10px;
    font-size:1.1em;
    font-weight: bold;
}
`;
const Details = styled.div`
`;

const Time = styled.div`
margin-top: 5px;
color:darkgrey;
display: flex;
align-items: center;

span{
    margin-left: 5px;
}
`;

const Members = styled.div`
margin-top: 5px;
color:darkgrey;
display: flex;
align-items: center;

span{
    margin-left: 5px;
}
`;

const Address = styled.div`
margin-top: 5px;
color:darkgrey;
display: flex;
align-items: center;

span{
    margin-left: 5px;
}
`;

export default SingleGroupChatItem
