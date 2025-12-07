import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import SportsBackground from '../assets/wave-haikei.svg'
import PartidazoLogo from '../assets/PartidazoLogo.png';
//*****************************************************************
// Esta página es la primera página de la aplicación, le da al usuario la opción
// de registrarse o iniciar sesión
//*****************************************************************
const LoginSignupPage = () => {

    let history = useHistory();

    function handleSignup() {
        history.push("/signup");
    };

    function handleLogin() {
        history.push("/login");
    };
    return(
        <Wrapper>
            <BackgroundImg src = {SportsBackground}/>
            <TopSection>
                <LogoImg src={PartidazoLogo} alt="Partidazo Logo" />
                <Slogan>ENCUENTRA TU EQUIPO, VIVE EL PARTIDO.</Slogan>
            </TopSection>
            <ButtonContainer>
                <LoginButton
                    onClick = {() => {handleLogin()}}
                >
                    Iniciar sesión
                </LoginButton>
                
                <HorizontalLineContainer>
                    <hr style = {{ marginRight: '5px', width: '145px'}}/>
                    o
                    <hr style = {{ marginLeft: '5px', width: '145px'}}/>
                </HorizontalLineContainer>
                <SignInButton
                    onClick = {() => {handleSignup()}}
                >
                    Crear cuenta
                </SignInButton>
            </ButtonContainer>
        </Wrapper>

    )
}

const Wrapper = styled.div`
position: relative;
display: flex;
flex-direction: column;
width:100%;
height:100%;
background: #293241;
background: -webkit-linear-gradient(to bottom, #141e30, #243b55); 
background: linear-gradient(to bottom, #141e30, #243b55);
align-items: center;
font-weight: 400;
padding:10px;
color: white;
overflow: hidden;
`;

const BackgroundImg = styled.img`
position:absolute;
height: 100%;
top:0;
`;

const TopSection = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
margin-top: 30px;
margin-bottom: auto;
`;

const LogoImg = styled.img`
width: 380px;
height: 380px;
object-fit: contain;
margin-bottom: 10px;
`;

const Slogan = styled.div`
font-size: 1.2em;
color: white;
text-align: center;
margin-bottom: 40px;
font-weight: bold;
z-index: 1;
position: relative;
text-transform: uppercase;
`;

const Quotes = styled.div`
    margin:20px;
    font-size: 1.2em;
    span {
        margin-top:5px;
        font-size: 0.8em;
        float:right;
        font-style: italic;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items:center;
    position: absolute;
    bottom: 0;
    width: 100%;
`;

const LoginButton = styled.button`
    font-size: 1.3em;
    font-weight:bold;
    margin:8px 20px;
    height:50px;
    background: #3D5A80;
	color: white;
	border: 2px solid white;
	padding: 0;
	cursor: pointer;
    border-radius: 5px;
    width:90%;
`;

const SignInButton = styled(LoginButton)`
    background: #00C258;
    color:white;
    margin-bottom: 20px;
`;

const HorizontalLineContainer = styled.div`
    display: flex;
    font-size: 1.1em;
`;

export default LoginSignupPage

