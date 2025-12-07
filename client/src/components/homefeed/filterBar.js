import React from "react";
import styled from "styled-components";
import { sports, levels } from '../create-activity-page/FormConstants.js';
import { sportToEnglish, levelToEnglish } from '../create-activity-page/sportTranslations.js';

const FilterBar = ({ sportType, setSportType, sportLevel, setSportLevel })=>{
    
    //Replace the first element in sports const matriz with 'Todos' instead of 'Seleccionar' for the first element
    const updateSports = sports;
    updateSports[0] = "Todos";
    
    const handleSportChange = (value) => {
        // Convert Spanish sport name to English for the query
        const englishSport = value === "Todos" ? "All" : sportToEnglish[value] || value;
        setSportType(englishSport);
    };
    
    const handleLevelChange = (value) => {
        // Convert Spanish level name to English for the query
        const englishLevel = value === "Todos" ? "All" : levelToEnglish[value] || value;
        setSportLevel(englishLevel);
    };
    
    return(
        <Wrapper>
            <Container>
                <SubContainer>
                    <span>Deporte: </span>
                    <SelecConatiner>
                        <Select 
                            name = 'sports'
                            value = {sportType === "All" ? "Todos" : Object.keys(sportToEnglish).find(key => sportToEnglish[key] === sportType) || sportType}
                            onChange = {(ev) => handleSportChange(ev.target.value)}
                        >
                            {
                                updateSports.map ( (sport) => {
                                    return <Option key = {sport} value = {sport}>{sport}</Option>
                                } )
                            }
                        </Select>
                    </SelecConatiner>
                </SubContainer>

                <SubContainer>
                    <span>Nivel: </span>
                    <SelecConatiner>
                        <Select 
                            name = 'levels'
                            value = {sportLevel === "All" ? "Todos" : Object.keys(levelToEnglish).find(key => levelToEnglish[key] === sportLevel) || sportLevel}
                            onChange = {(ev) => handleLevelChange(ev.target.value)}
                        >
                            {
                                levels.map ( (level) => {
                                    return <Option key = { level} value = {level}>{level}</Option>
                                } )
                            }
                        </Select>
                    </SelecConatiner>
                </SubContainer>
            </Container>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    height:40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;    
`;

const Container = styled.div`
    flex:1;
    display: flex;
    margin: 3px 5px;
    align-items: center;
    font-size: 1.2em;
    justify-content: space-between;
`;

const SubContainer = styled.div`
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
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
    // Hack for IE 11+
    &::-ms-expand {
    display: none;
    }
`;

const Option = styled.option`
    background: rgba(255, 255, 255, 0.1);
    color: black;
`;

const SelecConatiner = styled.div`
    display: flex;
    position: relative;
    width: 130px;
    margin: 5px;
    // Dropdown icon
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

export default FilterBar