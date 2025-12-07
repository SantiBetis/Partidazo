import React,{ useState } from "react";
import styled from "styled-components";
import { FiSearch, FiMapPin } from "react-icons/fi/index.esm.js";
//****************************************************************
// A toggle bar to navegate between map, and homefeed
//****************************************************************

const ToggleBar = ({ setDisplayedPage }) => {

    // A state var to control the styling of actibe item in the bar
    const [active, setActive] = useState(1);

    const handleClick = (page) => {
        setActive(page);
        setDisplayedPage(page);
    }

    return(
        <Wrapper>
            <Button active = {active === 1} onClick = {() => handleClick(1)} >
                <FiSearch size = {30} color = {'00C258'}/>
            </Button>
            <Button active = {active === 2} onClick = {() => handleClick(2)} >
                <FiMapPin  size = {30} color = {'00C258'} />
            </Button>
        </Wrapper>
    );

};

const Button = styled.button`
    background-color: #3C4552;
    border-bottom: 7px solid #3C4552;
    width: 50%;
    cursor: pointer;

    ${({ active }) => active && ` border-bottom: 7px solid #00C258; `}

`;
const Wrapper = styled.div`
    display: flex;
    justify-content: space-around;
    flex-direction: row-reverse;
    background-color: #3C4552;
    height:50px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
`;

export default ToggleBar
