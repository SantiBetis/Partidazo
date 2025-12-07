import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import ToggleBar from "./ToggleBar.js";
import Map from "./all-activities-map.js";
import Search from "./all-activities-search.js";
import FilterBar from "./filterBar.js";
import { CurrentUserLocation } from "../all-contexts/currentLocationContext.js";
//*********************************************************************
// This the homepage, it navegates between a map, and regulat homefeed
//*********************************************************************

const Home = () => {
    // Get current user location, and getDistance function
    // These helpers are used to calculate the actividad distance
    // from current user location
    const { currentLocation, getDistance, requestLocation, locationAllowed } = useContext(CurrentUserLocation);

    // A state variable to control the toggle bar
    const [ displayedPage, setDisplayedPage ] = useState(1);
    // A state variable to store the posts data
    const [ postsData, setPostsData ] = useState([]);
    // A state variable to control the loading screen
    const [ postDataStatus, setPostDataStatus ] = useState('loading');

    const [ sportType, setSportType ] = useState('All');
    const [ sportLevel, setSportLevel ] = useState('All');

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

    // Add distance from current location for each post
    const updatePostsData = postsData.map( (post) => {
        const distance = (currentLocation && post.actividadAddress && post.actividadAddress.coordinates) 
            ? getDistance(currentLocation, post.actividadAddress.coordinates)
            : 999999; // Use a large number if coordinates are not available
        const newPost = { ...post, distance };
        return newPost
    })

    // Sort the posts based on distance from current location
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
        background: #EE6C4D;
        color: white;
        border: none;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
    }
`;

export default Home