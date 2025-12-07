// *******************************************************************************
// This file is used authnticate user logged in and update the current user info
// *******************************************************************************
import React, { useState, createContext, useEffect } from "react";

export const CurrentUserContext = createContext(null);
export const CurrentUserProvider = ({ children }) => {

    const [usuarioActual, setCurrentUser] = useState(null);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    useEffect(() => {
        fetch('/get-login-session', {
            credentials: 'include'
        })
        .then(res => res.json())
        .then( data => {
            if( data.status === 200){
                setCurrentUser(data.result);
                setIsUserLoggedIn(true);
                console.log(data.message)
            }
            else {
                setIsUserLoggedIn(false);
                console.log(data.message);
            }
        })
        return () => {
            setCurrentUser(null);
            setIsUserLoggedIn(false);
        }
    }, [])

    return (
        <CurrentUserContext.Provider
        value={{
            usuarioActual,
            setCurrentUser,
            isUserLoggedIn,
            setIsUserLoggedIn
        }}
        >
        {children}
        </CurrentUserContext.Provider>
    );
};

