import React, { useContext } from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
import { CurrentUserContext } from "../all-contexts/currentUserContext.js";
import { FiLogOut } from "react-icons/fi/index.esm.js";
import { deleteLoginSession } from "../helpers/express-session-helpers.js";

//*****************************************************************
// A log out button in the current user profile. It calls the endpoint
// that clears all usuario actual data info in the database colección
// 'usuario actual' 
//*****************************************************************

const LogoutButton = () => {
    const history = useHistory();
    const { setIsUserLoggedIn, setCurrentUser} = useContext(CurrentUserContext);

    const handleLogout = () => {
        deleteLoginSession();
        setIsUserLoggedIn(false);
        setCurrentUser(null);
        history.push('/');
    }
    return(
        <Button onClick = {() => handleLogout()}>
            <span>Cerrar Sesión</span> <FiLogOut/>
        </Button>
    );
}

const Button = styled.div`
    padding: 5px 15px;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #00C258;
    color: white;
    border: 2px solid white;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    span{
        margin-right: 4px;
    }
    @media (max-height: 736px) {
    font-size: 0.75em;
    }
`;

export default LogoutButton
