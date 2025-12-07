import React, { useState, useContext } from "react";
import styled from "styled-components";
import { FiXCircle, FiAlertTriangle } from "react-icons/fi/index.esm.js";
import { useHistory } from "react-router";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";

/**
 * Componente CancelButton - Botón para cancelar una actividad
 * Permite al creador de la actividad cancelarla con confirmación de dos pasos
 * Gestiona la eliminación de la actividad, actualización de usuarios y envío de notificaciones
 * 
 * @param {Object} postData - Datos completos de la actividad a cancelar
 */
const CancelButton = ({ postData }) => {
    // Obtener usuario actual del contexto
    const { usuarioActual } = useContext(CurrentUserContext);
    // Estado para controlar la visualización del diálogo de confirmación
    const [showConfirmation, setShowConfirmation] = useState(false);
    // Estado para controlar el proceso de eliminación
    const [isDeleting, setIsDeleting] = useState(false);
    const history = useHistory();

    // Verificar si la actividad está en el pasado
    const actividadEndTime = postData.actividadDate && postData.actividadDate.date && postData.actividadDate.to
        ? new Date(`${postData.actividadDate.date}T${postData.actividadDate.to}`)
        : null;
    const now = new Date();
    const isActivityPassed = actividadEndTime ? actividadEndTime < now : false;

    /**
     * Maneja la cancelación de la actividad
     * Envía solicitud DELETE al backend para eliminar la actividad
     * Actualiza usuarios participantes y crea notificaciones
     */
    const handleCancelActivity = async () => {
        setIsDeleting(true);
        
        try {
            const response = await fetch(`/post/cancelActivity/${postData._id}`, {
                method: "DELETE",
                credentials: 'include',
                body: JSON.stringify({ usuarioActual }),
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data);

            if (response.ok) {
                // Redirigir al home después de cancelar
                alert('Actividad cancelada exitosamente');
                history.push('/');
            } else {
                console.error('Error al cancelar la actividad:', data.message);
                alert(`Error: ${data.message}`);
                setIsDeleting(false);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al cancelar la actividad');
            setIsDeleting(false);
        }
    };

    // Si la actividad ya pasó, no mostrar el botón
    if (isActivityPassed) {
        return null;
    }

    if (showConfirmation) {
        return (
            <CancelStatus>
                <ConfirmationBox>
                    <FiAlertTriangle size={30} color={'#FFA500'} />
                    <WarningText>
                        ¿Estás seguro de que quieres cancelar esta actividad?
                    </WarningText>
                    <WarningSubtext>
                        Todos los participantes serán notificados.
                    </WarningSubtext>
                    <ButtonGroup>
                        <ConfirmButton 
                            onClick={handleCancelActivity}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Cancelando...' : 'Sí, cancelar'}
                        </ConfirmButton>
                        <BackButton 
                            onClick={() => setShowConfirmation(false)}
                            disabled={isDeleting}
                        >
                            No, volver
                        </BackButton>
                    </ButtonGroup>
                </ConfirmationBox>
            </CancelStatus>
        );
    }

    return (
        <CancelStatus>
            <Status>
                <FiXCircle size={20} color={'#FFA500'} />
                <span>Eres el organizador de esta actividad</span>
            </Status>
            <CancelBtn onClick={() => setShowConfirmation(true)}>
                Cancelar Actividad
            </CancelBtn>
        </CancelStatus>
    );
};

const CancelStatus = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 15px 0;
    width: 100%;
`;

const Status = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    color: white;
    font-size: 0.95em;
`;

const CancelBtn = styled.button`
    padding: 12px 30px;
    background: #DC3545;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #C82333;
        transform: scale(1.05);
    }

    &:active {
        transform: scale(0.95);
    }
`;

const ConfirmationBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #2C3E50;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 400px;
`;

const WarningText = styled.p`
    color: white;
    font-size: 1.1em;
    font-weight: bold;
    text-align: center;
    margin: 15px 0 5px 0;
`;

const WarningSubtext = styled.p`
    color: #BBBBBB;
    font-size: 0.9em;
    text-align: center;
    margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 15px;
    width: 100%;
`;

const ConfirmButton = styled.button`
    flex: 1;
    padding: 12px;
    background: #DC3545;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        background: #C82333;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const BackButton = styled.button`
    flex: 1;
    padding: 12px;
    background: #6C757D;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
        background: #5A6268;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export default CancelButton;
