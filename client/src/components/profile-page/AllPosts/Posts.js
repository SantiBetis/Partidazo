import React,{ useState } from "react";
import styled from "styled-components";
import ToggleBar from "./ToggleBar.js";
import ActivityJoined from "./ActivitedJoined.js";
import ActivityPosted from "./ActivityPosted.js";

// *********************************************************************************
// This component takes both ActivityJoined and ActivityPosted components
// and render them here in post. This post component is rendered in the profile page
// *********************************************************************************
const Posts = ({ profileData }) => {
    // This variable is used to control the Toggle bar
    // inialized with 1 to highlight the 'Activities Posted' first at rendering
    const [ displayedPage, setDisplayedPage ] = useState(1);
    
    return(
        <Wrapper>
            <ToggleBar setDisplayedPage = { setDisplayedPage }/>
            { displayedPage === 1
            ? <ActivityPosted profileData = { profileData }/>
            : <ActivityJoined profileData = { profileData }/>
            }
            <br/>
            <br/>
        </Wrapper>
    );
}

const Wrapper = styled.div`
height: 50%;
z-index: 0;
`;

export default Posts
