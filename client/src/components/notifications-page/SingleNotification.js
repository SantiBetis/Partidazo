import React from "react";
import styled from "styled-components";
import moment from 'moment';
import noImg from'../assets/noImg.png';
import { useHistory } from "react-router";
// import singleChatItemBackground from "../../assests/chat-low-poly-grid-haikei.svg";
import singleChatItemBackground from "../assets/low-poly-grid-haikei.svg";
//*****************************************************************
// This component is used to render a single notification block in
// the notification page
//*****************************************************************
const SingleNotification = ({notification}) => {

    const history = useHistory();

    // Clicking on user image navigates al perfil del usuario
    const handleUserProfile = () => {
        history.push(`/profile/${notification.user._id}`);
    }
    // Clicking on the actividad navigates to actividad details
    const handleActivity = () => {
        history.push(`/actividad/${notification.actividad._id}`)
    }

    return(
        <Wrapper>
            <Container>
                {/* <Img 
                src = { notification.user.imgSrc !== '' ? notification.user.imgSrc : noImg }
                onClick={()=> handleUserProfile()}
                /> */}
                <ProfileImgSquared 
                    style = {{ backgroundImage: `url(${notification.user.imgSrc !== '' ? notification.user.imgSrc  : noImg})`}}
                    onClick={()=> handleUserProfile()}
                >
                </ProfileImgSquared>
                <SubContainer>
                    <NotificationDate>
                        {moment(notification.date).calendar()}
                    </NotificationDate>
                    <Title>
                        <span>
                            {notification.user.displayName}
                        </span>
                        {' '}
                        {notification.message}
                    </Title>
                    {
                        notification.actividad && notification.actividad !== null && notification.actividad.type &&
                            <Details onClick={()=> handleActivity()}>
                                {notification.actividad.type}{', '}
                                {notification.actividad.date && notification.actividad.date.date 
                                    ? moment(notification.actividad.date.date, 'YYYY-MM-DD').format('DD [de] MMMM [de] YYYY')
                                    : 'Fecha no disponible'
                                }{', '}
                                {notification.actividad.date && notification.actividad.date.from && notification.actividad.date.to
                                    ? `${moment(notification.actividad.date.from , 'HH:mm').format('hh:mm A')} - ${moment(notification.actividad.date.to , 'HH:mm').format('hh:mm A')}`
                                    : 'Hora no disponible'
                                }
                            </Details>
                    }
                </SubContainer>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    /* border: 1px solid red; */
    margin:8px;
    cursor: pointer;
`;

const Container = styled.div`
    display:flex;
    align-items: center;
    padding:7px 5px;
    /* background: #293241; */
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border-radius:6px;
    background-image: url(${singleChatItemBackground});
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
`;

const ProfileImgSquared = styled.div`
background-repeat: no-repeat;
background-position: center;
background-size: cover;
width: 45px;
height: 45px;
border-radius: 50%;
background-color: grey;
border: 2px solid white;
`;

const SubContainer = styled.div`
margin-left:10px;
font-size:0.9em;
`;

const Title = styled.div`
color:#00C258;
font-size:0.93em;
span{
    font-weight:bold;
}
`;

const Details = styled.div`
font-size:0.85em;
color:darkgrey;
`;

const NotificationDate = styled.div`
font-size:0.85em;
color:darkgrey;
`;

export default SingleNotification
