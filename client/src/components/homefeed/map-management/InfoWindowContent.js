import React from "react";
import styled from "styled-components";
import SingleActivityInfoWindow from "../../acitivity-components/ActivityInfoWindow.js";
const InfoWindowContent = ({selected})=> {
    return(
        <Wrapper>
            <SingleActivityInfoWindow post = {selected}/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
`;

export default InfoWindowContent
