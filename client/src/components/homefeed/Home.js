import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import ToggleBar from "./ToggleBar.js";
import Map from "./all-activities-map.js";
import Search from "./all-activities-search.js";
import FilterBar from "./filterBar.js";
import { CurrentUserLocation } from "../all-contexts/currentLocationContext.js";

/**
 * Componente Home - Página principal de la aplicación
 * Muestra todas las actividades deportivas disponibles en formato lista o mapa
 * Permite filtrar por deporte y nivel, calcula distancias desde ubicación actual
 * Ordena actividades por proximidad al usuario
 */
const Home = () => {
    // Obtener ubicación actual del usuario y funciones para gestionar ubicación
    // Estas funciones se usan para calcular la distancia de las actividades
    // desde la ubicación actual del usuario
    const { currentLocation, getDistance, requestLocation, locationAllowed } = useContext(CurrentUserLocation);

    // Estado para controlar la vista activa (lista o mapa)
    const [ displayedPage, setDisplayedPage ] = useState(1);
    // Estado para almacenar los datos de todas las actividades
    const [ postsData, setPostsData ] = useState([]);
    // Estado para controlar la pantalla de carga
    const [ postDataStatus, setPostDataStatus ] = useState('loading');
    // Estados para filtros de deporte y nivel
    const [ sportType, setSportType ] = useState('All');
    const [ sportLevel, setSportLevel ] = useState('All');

    // Obtener todas las actividades del sistema con filtros aplicados
    useEffect(()=>{
        setPostDataStatus('loading');

        // get the data of all posts in the system
        fetch(`/posts?actividadType=${sportType}&level=${sportLevel}`)
        .then(res=> res.json())
        .then(data => {
            setPostsData(data.posts); // Store all posts data in postsData state variable
            setPostDataStatus('idle');
        })
    },[sportType, sportLevel])

    // Añadir distancia desde la ubicación actual a cada actividad
    const updatePostsData = postsData.map( (post) => {
        const distance = (currentLocation && post.actividadAddress && post.actividadAddress.coordinates) 
            ? getDistance(currentLocation, post.actividadAddress.coordinates)
            : 999999; // Usar número grande si no hay coordenadas disponibles
        const newPost = { ...post, distance };
        return newPost
    })

    // Ordenar las actividades por distancia desde la ubicación actual (más cercanas primero)
    const sortedPostsData = updatePostsData.sort( (a,b) => a.distance - b.distance);



    return(
        <Wrapper>
            <ToggleBar setDisplayedPage = { setDisplayedPage }/>
            {(!currentLocation && locationAllowed === false) &&
                <LocationNotice>
                    <span>Para mostrar distancias, activa la ubicación en tu navegador.</span>
                    <button onClick={() => requestLocation()}>Usar mi ubicación</button>
                </LocationNotice>
            }
            <FilterBar sportType = { sportType } setSportType = { setSportType } sportLevel ={ sportLevel } setSportLevel={ setSportLevel }/>
            { displayedPage === 1
            ? <Search postsData = { sortedPostsData } postDataStatus ={ postDataStatus } />
            : <Map postsData = { sortedPostsData } postDataStatus ={ postDataStatus } />
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
width: 100%;
height: 100%;
`;

const LocationNotice = styled.div`
    display:flex;
    align-items:center;
    justify-content: center;
    gap:10px;
    padding: 8px;
    background: #f5f5f5;
    color: #333;
    button{
        background: #00C258;
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
    }
`;

export default Home
