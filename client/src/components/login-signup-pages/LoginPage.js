import React, { useState, useContext } from "react";
import styled from "styled-components";
import { HiOutlineMail, HiOutlineKey } from "react-icons/hi/index.esm.js";
import { FiAtSign, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi/index.esm.js";
import { useHistory } from "react-router";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import LoadingCircule from "../loading-components/loadingCircule.js";
import { addLoginSession } from "../helpers/express-session-helpers.js";
import SportsBackground from '../assets/wave-haikei.svg'

//*****************************************************************
// This the log in page. It asks for the user email and password.
// it calls updateCurrentUser function from CurrentUserContext.
// updateCurrentUser handles signing in and returns reponse if
// signing in fails 
//*****************************************************************
const LoginPage = () => {

    const [ userEmail, setUserEmaill ] = useState("");
    const [ userPassword, setUserPassword ] = useState("");
    const [ isPasswordShown, setIsPasswordShown ] = useState(false);
    const [ errorStatus, setErrorStatus ] = useState({status: 'idle', error: 'no error'});
    const [ fetchStatus, setFetchStatus ] = useState('idle');

    const history = useHistory();
    const iconSize = 35;
    const { setCurrentUser, setIsUserLoggedIn } = useContext(CurrentUserContext);

    const handleEmailInput = (value) => {
        setUserEmaill(value);
        setErrorStatus({status: 'idle', error: 'no error'});
    }

    const handlePasswordInput = (value) => {
        setUserPassword(value);
        setErrorStatus({status: 'idle', error: 'no error'});
    }


    const handleSubmit = (ev) => {
        ev.preventDefault();
        setFetchStatus('loading');

        fetch(`/loggedin?email=${userEmail}&password=${userPassword}`, {
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((data) => {
            if ( data.status === 200 ){
                setCurrentUser(data.result);
                setIsUserLoggedIn(true);
                addLoginSession(data.result);
                history.push(`/profile/${data.result._id}`);
            }
            else {
                setErrorStatus({ status: "err", error: data.message });
            }

            setFetchStatus('idle');
        });
    }
    return (
        <Wrapper>
            <h1>¡Bienvenido de vuelta!</h1>
            <BackgroundImg src = {SportsBackground}/>
            <Form onSubmit = {(ev)=>handleSubmit(ev)}>
                <InputContainer>
                        <FiAtSign size = {iconSize}/>
                        <Input 
                            placeholder = 'Correo Electrónico' 
                            type = 'email'
                            onChange = {(ev) => {handleEmailInput(ev.target.value)}}
                        />
                        <EyeIcon>
                            <FiEye size = {30} color = {'transparent'}/>
                        </EyeIcon>
                </InputContainer>
                <InputContainer>
                        <FiLock size = {iconSize}/>
                        <Input 
                            placeholder = 'Contraseña' 
                            type={ isPasswordShown ? 'text' : 'password' }
                            onChange = {(ev) => {handlePasswordInput(ev.target.value)}}
                        />
                        <EyeIcon
                            onClick={() => setIsPasswordShown(!isPasswordShown)}
                        >
                            {
                                isPasswordShown
                                ? <FiEye size = {30}/>
                                : <FiEyeOff size = {30}/>
                            }
                        </EyeIcon>
                </InputContainer>
                <Error>
                    { errorStatus.status === 'err' ? `* ${errorStatus.error} *` : ""}
                </Error>
                <ButtonContainer>
                    <LoginButton>
                        {
                            fetchStatus === 'loading' ? <LoadingCircule/> : 'Iniciar Sesión'
                        }
                    </LoginButton>
                </ButtonContainer>
            </Form>
        </Wrapper>
    );
};

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
    color: white;
    overflow: hidden;
`;

const Form = styled.form`
    position: relative; 
    width:100%;
    height:100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 10px;
`;

const BackgroundImg = styled.img`
position:absolute;
height: 100%;
top:0;
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
`;

const InputContainer = styled.div`
    display: flex;
    width:90%;
    margin-top:20px;
    justify-content: space-between;
    padding: 0px 5px;
    border-bottom: 1px solid grey;
`;

const Input = styled.input`
    width:100%;
    margin: 0px 10px;
    font-size: 1.3em;
    outline: none;
    border:none;
    /* border-bottom: 1px solid grey; */
    color: white;
    background-image:none;
    background-color:transparent;
    box-shadow: none;
`;

const EyeIcon = styled.div`
float: right;
display:flex;
align-items: center;
margin: 0px 5px;
`;

const Error = styled.div`
    padding:0px 5px;
    height: 30px;
    margin:15px 0px;
    color: red;
    font-size: 1.1em;
    text-align: center;
`;
export default LoginPage