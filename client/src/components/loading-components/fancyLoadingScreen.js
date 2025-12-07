import React from "react";
import styled from "styled-components";
import { keyframes } from "styled-components";
//****************************************************************
// This si ust a fancy loading screen component. It is not being
// used in this version of the app.
//****************************************************************

const FancyLoadingScreen = () => {

    return(
        <Wrapper>
            <Container>
                <Dot1></Dot1>
                <Dot2></Dot2>
                <Dot3></Dot3>
            </Container>
        </Wrapper>
    )
}

const dot1Animiation = keyframes`
    20% {transform: scale(1)}
    45% {transform: translate(16px, 12px) scale(.45)}
    60% {transform: translate(80px, 60px) scale(.45)}
    80% {transform: translate(80px, 60px) scale(.45)}
    100% {transform: translateY(0px) scale(1)}
`;

const dot2Animiation = keyframes`
    20% {transform: scale(1)}
    45% {transform: translate(-16px, 12px) scale(.45)}
    60% {transform: translate(-80px, 60px) scale(.45)}
    80% {transform: translate(-80px, 60px) scale(.45)}
    100% {transform: translateY(0px) scale(1)}
`;

const dot3Animiation = keyframes`
    20% {transform: scale(1)}
    45% {transform: translateY(-18px) scale(.45)}
    60% {transform: translateY(-90px) scale(.45)}
    80% {transform: translateY(-90px) scale(.45)}
    100% {transform: translateY(0px) scale(1)}
`;

const rotatingAnimation = keyframes`
    55% {transform: translate(-50%, -50%) rotate(0deg)}
    80% {transform: translate(-50%, -50%) rotate(360deg)}
    100% {transform: translate(-50%, -50%) rotate(360deg)}
`;

const indexAnimation = keyframes`
    0%, 100% {z-index: 3}
    33.3% {z-index: 2}
    66.6% {z-index: 1}
`;

const Wrapper = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    width: 200px;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: auto;
    filter: url('#goo');
    animation: ${rotatingAnimation} 2s ease-in-out infinite;
`;

const Dot = styled.div`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: #000;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity:0.8;
    margin: auto;
`;

const Dot1 = styled(Dot)`
    background-color: #EE6C4D;
    animation: ${dot3Animiation} 2s ease infinite, ${indexAnimation} 6s ease infinite;
`;

const Dot2 = styled(Dot)`
    background-color: #BCDEEB;
    animation: ${dot2Animiation} 2s ease infinite, ${indexAnimation} 6s -4s ease infinite;
`;

const Dot3 = styled(Dot)`
    background-color: #3D5A80;
    animation: ${dot1Animiation} 2s ease infinite, ${indexAnimation} 6s -2s ease infinite;
`;

export default FancyLoadingScreen