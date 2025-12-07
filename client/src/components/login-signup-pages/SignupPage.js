import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { HiOutlineMail } from "react-icons/hi/index.esm.js";
import {
  FiMessageSquare,
  FiUser,
  FiMapPin,
  FiImage,
  FiCalendar,
  FiKey,
} from "react-icons/fi/index.esm.js";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import { useHistory } from "react-router";
import LoadingCircule from "../loading-components/loadingCircule.js";
import { addLoginSession } from "../helpers/express-session-helpers.js";
import uploadImageToCloudinary from "../helpers/uploadImgtoCloudinary.js";
import SportsBackground from '../assets/wave-haikei.svg'

/**
 * Componente SignupPage - Página de registro de nuevos usuarios
 * Recopila información del usuario: nombre, email, contraseña, fecha de nacimiento, ubicación, foto
 * Valida datos, sube imagen a Cloudinary, crea cuenta y autentica automáticamente
 * Redirige al perfil del usuario tras registro exitoso
 */
const SignupPage = () => {
  const history = useHistory();

  // Valores iniciales del formulario de registro
  const initialUserInfo = {
    displayName: "",
    imgSrc: "",
    bio: "",
    email: "",
    DOB: "",
    gender: "",
    location: "",
    password:"",
    confirmPassword:"",
  };

  // Actualizar información del usuario actual cuando se registra
  // Asegura que el usuario inicie sesión automáticamente después del registro
  const { setCurrentUser, setIsUserLoggedIn } = useContext(CurrentUserContext);

  const IconSize = 35;

  // Referencia para mostrar placeholder cuando el input de fecha pierde foco
  const ref = useRef();

  // Estado para la información del usuario en el formulario
  const [newUserInfo, setNewUserInfo] = useState(initialUserInfo);
  // Estado para el botón de carga después del envío
  const [fetchStatus, setFetchStatus] = useState("idle");
  // Estado para errores recibidos del backend
  const [errorStatus, setErrorStatus] = useState({
    status: "idle",
    error: "no error",
  });

  /**
   * Maneja cambios en todos los inputs del formulario
   * Actualiza estado y limpia errores
   */
  const handleInputChange = (name, value) => {
    setNewUserInfo({ ...newUserInfo, [name]: value });
    setErrorStatus({ status: "idle", error: "no error" });
  };

  /**
   * Maneja el envío del formulario de registro
   * Valida datos, crea nuevo usuario, establece sesión y redirige al perfil
   */
  const handleSubmit = (ev) => {
    setFetchStatus("loading");
    ev.preventDefault();
    fetch("/users/add", {
      method: "POST",
      body: JSON.stringify(newUserInfo),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((json) => {
      const { data, status, message } = json;
      if (status === 200) {
        setCurrentUser(data);
        setIsUserLoggedIn(true);
        addLoginSession(data);
        console.log(data);
        history.push(`/profile/${data._id}`);
      } else {
        setErrorStatus({ status: "error", error: message });
      }
      setFetchStatus("idle");
    })
  };

  return (
    <Wrapper>
      <h2>Crear una cuenta</h2>
      <BackgroundImg src = {SportsBackground}/>
      <Form
        onSubmit={(ev) => {
          handleSubmit(ev);
        }}
      >
        <InputContainer>
          <HiOutlineMail size={IconSize} />
          <Input
            placeholder="Correo Electrónico"
            type="email"
            onChange={(ev) => {
              handleInputChange("email", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <FiKey size={IconSize} />
          <Input
            placeholder="Contraseña"
            type="password"
            onChange={(ev) => {
              handleInputChange("password", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <Input
            placeholder="Confirmar Contraseña"
            type="password"
            onChange={(ev) => {
              handleInputChange("confirmPassword", ev.target.value);
            }}
            style = {{ marginLeft:'40px'}}
          />
        </InputContainer>
        <InputContainer>
          <FiUser size={IconSize} />
          <Input
            placeholder="Nombre Completo"
            type="text"
            onChange={(ev) => {
              handleInputChange("displayName", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer>
          <FiCalendar size={IconSize} />
          <Input
            placeholder="Fecha de Nacimiento"
            type="text"
            ref={ref}
            onFocus={() => (ref.current.type = "date")}
            onBlur={() => (ref.current.type = "text")}
            onChange={(ev) => {
              handleInputChange("DOB", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainer style={{ height: "120px" }}>
          <FiMessageSquare size={IconSize} />
          <Textfield
            placeholder="Cuéntanos un poco sobre ti"
            type="text"
            onChange={(ev) => {
              handleInputChange("bio", ev.target.value);
            }}
          />
        </InputContainer>
        <InputContainerImage>
          <FiImage size={IconSize} />
          <InputImg
            type='file'
            accept='image/*'
            onChange={(ev) => {
              uploadImageToCloudinary(ev.target.files[0], handleInputChange);
            }}
          />
        </InputContainerImage>
        <InputContainer>
          <FiMapPin size={IconSize} />
          <Input
            placeholder="Ciudad"
            type="text"
            onChange={(ev) => {
              handleInputChange("location", ev.target.value);
            }}
          />
        </InputContainer>
        {errorStatus.status === "error" && (
          <Error>* {errorStatus.error} *</Error>
        )}
        <ButtonContainer>
          <SignUpButton type="submit">
          {
            fetchStatus === 'loading' ? <LoadingCircule/> : 'Registrarse'
          }
          </SignUpButton>
        </ButtonContainer>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
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
  width: 100%;
  height: 100%;
  margin-top: 20px;
`;

const BackgroundImg = styled.img`
position:absolute;
height: 100%;
top:0;
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: space-between;
  padding: 0px 5px;
`;
const InputContainerImage = styled.div`
  display: flex;
  margin-top: 20px;
  align-items:center;
  padding: 0px 5px;
`;

const InputImg = styled.input`
  margin-left: 10px ;
  color: grey;
  padding:20px 0px;
  font-size:1.1em;

  &::-webkit-file-upload-button {
    visibility: hidden;
    width:0px;
  }

  &::before{
    content: 'Elegir Imagen de Perfil';
    color: white;
    background: #3D5A80;
    border: 2px solid white;
    cursor: pointer;
    border-radius: 5px;
    padding:5px 10px;
    font-family: 'Roboto Slab', serif;
  }

`;

const Input = styled.input`
  width: 100%;
  margin: 0px 10px;
  font-size: 1.3em;
  outline: none;
  border: none;
  border-bottom: 1px solid grey;
  color: white;
  background-image: none;
  background-color: transparent;
  box-shadow: none;

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const Textfield = styled.textarea`
  padding: 5px;
  width: 100%;
  height: 100%;
  font-size: 1.3em;
  box-sizing: border-box;
  border: none;
  color: white;
  border-bottom: 1px solid grey;
  background-color: transparent;
  box-shadow: none;
  resize: none;
  margin: 0px 10px;
  overflow: auto;
  outline: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
`;

const SignUpButton = styled.button`
  background: #00C258;
  font-size: 1.3em;
  font-weight: bold;
  margin: 8px 20px;
  margin-bottom: 20px;
  height: 50px;
  color: white;
  border: 2px solid white;
  padding: 0;
  cursor: pointer;
  border-radius: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  width: 100%;
`;

const Error = styled.div`
  margin-top: 30px;
  color: red;
  font-size: 1em;
  text-align: center;
`;

export default SignupPage;

