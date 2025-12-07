import React, { useContext, useState } from "react";
import styled, { keyframes } from "styled-components";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import { sports, levels } from "./FormConstants.js";
import Snackbar from '@mui/material/Snackbar/index.js';
import MuiAlert from '@mui/material/Alert/index.js';
import AddressSearchBox from "./AddressSearchBox.js";
import LoadingCircule from "../loading-components/loadingCircule.js";

// Límites máximos de participantes por deporte
const sportLimits = {
    'Fútbol': 22,
    'Baloncesto': 10,
    'Tenis': 4,
    'Pádel': 4,
    'Voleibol': 12
};

/**
 * Componente ActivityForm - Formulario para crear nuevas actividades deportivas
 * Permite seleccionar deporte, nivel, fecha/hora, ubicación, límite de participantes y descripción
 * Valida datos (fecha no en pasado, límite no excede máximo del deporte)
 * Envía datos al backend para crear la actividad
 */
const ActivityForm = () => {
    // Obtener información del usuario actual del contexto
    const { usuarioActual } = useContext(CurrentUserContext);

    // Componente de alerta para mostrar estado del formulario después del envío
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    // Valores iniciales para el formulario de publicación de actividad
    const initialFormValues = {
        limit: '',
        actividadDate: {
            date:'',
            from:'',
            to:''
        },
        actividadAddress: {
            street:'',
            city:'',
            province:'',
        },
        actividadType:'Select',
        description:'',
        level:'All',
        creator_id: usuarioActual?._id || '',
    }

    // Establecer una variable de estado para los datos del formulario de publicación
    const [ postForm, setPostForm ] = useState(initialFormValues);

    // Variables de estado para monitorear el envío del formulario y los errores del formulario
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [ formStatus, setFormStatus ] = useState('idle');
    const [ formError, setFormError] = useState({ status: false, message: 'no error'});

    // Función que maneja la alerta snackbar
    const handleCloseBar = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }
        setIsFormSubmitted(false);
        setFormError({ status: false, message: 'no error'});
    };

    // Función que maneja el cambio en actividadDate y actualiza la variable de estado 'postForm'
    const handleDateChange = (name, value) => {
        setPostForm({ ...postForm, actividadDate:{...postForm.actividadDate, [name]:value }});
        handleCloseBar();
    };

    // Todos los demás cambios en los inputs del formulario se manejan en esta función
    const handleOtherChanges = (name, value) => {
        // Si se cambia el tipo de deporte, limitar los participantes máximos
        if (name === 'actividadType') {
            const maxLimit = sportLimits[value];
            const currentLimit = parseInt(postForm.limit) || 0;
            
            // Si el límite actual excede el máximo del nuevo deporte, reiniciarlo
            if (currentLimit > maxLimit) {
                setPostForm({ ...postForm, [name]: value, limit: '' });
            } else {
                setPostForm({ ...postForm, [name]: value });
            }
        } 
        // Si se cambia el límite, validar que no exceda el máximo del deporte
        else if (name === 'limit') {
            const maxLimit = sportLimits[postForm.actividadType];
            const numValue = parseInt(value) || 0;
            
            if (maxLimit && numValue > maxLimit) {
                setPostForm({ ...postForm, [name]: maxLimit.toString() });
            } else {
                setPostForm({ ...postForm, [name]: value });
            }
        } 
        else {
            setPostForm({ ...postForm, [name]: value });
        }
        handleCloseBar();
    };

    // manejar el reinicio del formulario
    const handleFormRest = () => {
        setPostForm(initialFormValues);
    }
    // La función maneja el envío del formulario llamando al handler del endpoint encargado de añadir una nueva publicación
    const handleSubmit = (ev) => {
        setFormStatus('loading');
        ev.preventDefault();
        
        // Validar que la fecha y hora no sean en el pasado
        const actividadDate = new Date(`${postForm.actividadDate.date}T${postForm.actividadDate.from}`);
        const now = new Date();
        
        if (actividadDate < now) {
            setFormError({ 
                status: true, 
                message: 'No puedes crear una actividad en una fecha u hora ya pasada'
            });
            setFormStatus('idle');
            return;
        }
        
        // Validar que el límite no exceda el máximo del deporte seleccionado
        const selectedSport = postForm.actividadType;
        const maxLimit = sportLimits[selectedSport];
        const currentLimit = parseInt(postForm.limit) || 0;
        
        if (maxLimit && currentLimit > maxLimit) {
            setFormError({ 
                status: true, 
                message: `El límite de participantes no puede exceder ${maxLimit} para ${selectedSport}`
            });
            setFormStatus('idle');
            return;
        }
        
        fetch('/posts/add',{
            method: "POST",
            body: JSON.stringify(postForm),
            headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            },
        })
        .then( res => res.json())
        .then( json =>{
            const { status, message } = json;
            if( status === 200 ){
                setFormError({ status: false, message: 'no error'});
                setPostForm(initialFormValues);
                setIsFormSubmitted(true);
                setFormStatus('idle');
            }
            else {
                setFormError({ status: true, message: message});
                setFormStatus('idle');
            }
        })
    }

    return(
        <Wrapper>
            <h2>Publicar una nueva actividad</h2>
            <Form onSubmit = {(ev) => handleSubmit(ev)}>
                <Conatiner>
                    <Title>
                        {'Fecha y Hora de la Actividad'}
                    </Title>
                    <DateContainer>
                        <span>Fecha: </span>
                        <Input
                            type="date"
                            value = {postForm.actividadDate.date}
                            onChange = {(ev) => handleDateChange("date",ev.target.value)}
                        />
                    </DateContainer>
                    <TimeContainer>
                        <span>Desde: </span>
                        <Input
                            type="time"
                            value = {postForm.actividadDate.from}
                            onChange = {(ev) => handleDateChange("from",ev.target.value)}
                        />
                        <span>Hasta: </span>
                        <Input
                            type="time"
                            value = {postForm.actividadDate.to}
                            onChange = {(ev) => handleDateChange("to",ev.target.value)}
                        />
                    </TimeContainer>
                </Conatiner>

                <Conatiner>
                    <Title>
                        Tipo de Deporte
                    </Title>
                    <TypeContainer>
                            <SubContainer>

                                <SubSubContainer>
                                    <span>Deporte: </span>
                                    <SelecConatiner>
                                        <Select 
                                            name = 'sports'
                                            value = {postForm.actividadType}
                                            onChange = {(ev) => handleOtherChanges("actividadType",ev.target.value)}
                                        >
                                            {
                                                sports.map ( (sport) => {
                                                    return <Option key = {sport} value = {sport}>{sport}</Option>
                                                } )
                                            }
                                        </Select>
                                    </SelecConatiner>
                                </SubSubContainer>

                                <SubSubContainer>
                                    <span>Nivel: </span>
                                    <SelecConatiner>
                                        <Select 
                                            name = 'levels'
                                            value = {postForm.level}
                                            onChange = {(ev) => handleOtherChanges("level",ev.target.value)}
                                        >
                                            {
                                                levels.map ( (level) => {
                                                    return <Option key = {level} value = {level}>{level}</Option>
                                                } )
                                            }
                                        </Select>
                                    </SelecConatiner>
                                </SubSubContainer>

                        </SubContainer>
                        <DateContainer>
                            <span>Límite: </span>
                            <LimitInput
                                type="number"
                                value = {postForm.limit}
                                max={postForm.actividadType !== 'Select' ? sportLimits[postForm.actividadType] : 99}
                                onChange = {(ev) => handleOtherChanges("limit",ev.target.value)}
                            />
                            {postForm.actividadType !== 'Select' && (
                                <MaxLimitText>Máx: {sportLimits[postForm.actividadType]}</MaxLimitText>
                            )}
                        </DateContainer>
                    </TypeContainer>
                </Conatiner>

                <Conatiner>
                    <Title>
                        {'Ubicación de la Actividad'}
                    </Title>
                    <br/>
                    <AddressSearchBox postForm = { postForm } setPostForm = { setPostForm }/>
                </Conatiner>
                <Conatiner>
                    <Title>
                        {'Descripción e Instrucciones'}
                    </Title>
                    <DateContainer>
                        <Textfield
                            placeholder="¿Algo que los participantes deben saber antes de unirse?"
                            type="text"
                            onChange = {(ev) => handleOtherChanges("description",ev.target.value)}
                        />
                    </DateContainer>
                </Conatiner>

                <ButtonConatiner>
                    <SubmitButton
                        type = 'submit'
                    >
                        {
                            formStatus === 'loading' ? <LoadingCircule/> : 'Publicar'
                        }
                    </SubmitButton>
                    <RestButton
                        type="reset"
                        onClick={()=>handleFormRest()}
                    >
                        Limpiar
                    </RestButton>
                </ButtonConatiner>
            </Form>
            <Snackbar 
                open={isFormSubmitted} 
                autoHideDuration={6000} 
                onClose={handleCloseBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <Alert onClose={handleCloseBar} severity="success" sx={{ width: '100%' }}>
                ¡Tu actividad ha sido creada exitosamente!
                </Alert>
            </Snackbar>
            <Snackbar 
                open={formError.status} 
                autoHideDuration={6000} 
                onClose={handleCloseBar}
                anchorOrigin={{ vertical: 'top', horizontal: 'left', }}
            >
                <Alert onClose={handleCloseBar} severity="error" sx={{ width: '100%' }}>
                    {formError.message}
                </Alert>
            </Snackbar>
        </Wrapper>
    )
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
    overflow: auto;
    animation: ${PuffInCenter} 0.4s both;
`;

const Form = styled.form`
    position: relative;
    width: 100%;
    height: 100%;
    margin-top: 20px;
`;

const Conatiner = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    /* border: 1px solid red; */
    padding:10px 15px;
`;

const ButtonConatiner = styled.div`
    display: flex;
    justify-content: center;
    /* border: 1px solid red; */
    padding:10px 15px;
`;

const Title = styled.h2`
    font-size: 1.4em;
    padding-bottom: 6px;
    color: #00C258;
    border-bottom: 2px solid #E0FBFC;
`;

const DateContainer = styled.div`
    display: flex;
    align-items: center;
    margin: 7px 0px;
    font-size: 1.2em;
    width: 100%;
`;

const TimeContainer = styled.div`
    display: flex;
    margin: 7px 0px;
    align-items: center;
    font-size: 1.2em;

    @media (max-width: 400px) {
        flex-direction: column;
        align-items: baseline;
    }
`;

const TypeContainer = styled.div`

`;

const SubContainer = styled.div`
    display: flex;
    margin: 7px 0px;
    /* align-items: center; */
    font-size: 1.2em;
    /* justify-content: space-between; */

    @media (max-width: 400px) {
        flex-direction: column;
    }
`;

const SubSubContainer = styled.div`
    /* flex:1; */
    display: flex;
    /* justify-content: center; */
    align-items: center;
`;

const Input = styled.input`
    margin: 0px 10px;
    padding: 5px 10px;
    border-radius: 5px;
    outline: none;
    border: none;
    border-bottom: 1px solid grey;
    color: white;
    background-image: none;
    background-color: rgba(255, 255, 255, 0.1);;
    box-shadow: none;
    font-size: 0.9em;

    &::-webkit-calendar-picker-indicator {
        filter: invert(1);
    }
`;

const LimitInput = styled(Input)`
    width: 48px;
    padding: 5px;
    font-size: 1em;
`;

const MaxLimitText = styled.span`
    margin-left: 10px;
    font-size: 0.85em;
    color: #B0BCC4;
`;

const Select = styled.select`
    width: 130px;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 0.9em;
    color: white;
    &:focus {
    color: white;
    }
    // Corrección para IE 11+
    &::-ms-expand {
    display: none;
    }
`;

const Option = styled.option`
    background: rgba(255, 255, 255, 0.1);
    color: black;
`;

const SelecConatiner = styled.div`
    position: relative;
    width: 130px;
    margin: 5px;
    // Ícono desplegable
    &::after {
        color: white;
        content: '▾';
        margin-right: 10px;
        pointer-events: none;
        position: absolute;
        right: -5px;
        top: 5px;
        font-size: 20px;
    }
`;

const Textfield = styled.textarea`
    padding: 5px;
    width: 100%;
    height: 100%;
    font-size: 1em;
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

const SubmitButton = styled.button`
    flex:1;
    font-size: 1.3em;
    font-weight:bold;
    margin:8px 20px;
    height:50px;
	border: 2px solid white;
	padding: 0;
	cursor: pointer;
    border-radius: 5px;
    background: #00C258;
    color:white;
`;

const RestButton = styled(SubmitButton)`
    background: #3D5A80;
    color:white;
`;

export default ActivityForm
