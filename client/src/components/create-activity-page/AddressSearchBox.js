import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';

const AddressSearchBox = ( { postForm, setPostForm }) => {

    const [address, setaddress] = useState(null);
    
    useEffect( ()=> {

        if( address !== null) {
            geocodeByAddress(address.label)
            .then(results => {
                const place = results[0];
                const components = place.address_components || [];

                const findComp = (types) => components.find(c => types.every(t => c.types.includes(t)));

                const streetNumber = findComp(['street_number'])?.long_name || '';
                const route = findComp(['route'])?.long_name || '';
                const city = findComp(['locality'])?.long_name || findComp(['postal_town'])?.long_name || findComp(['administrative_area_level_2'])?.long_name || '';
                const province = findComp(['administrative_area_level_1'])?.long_name || '';

                const street = route ? (route + (streetNumber ? ' ' + streetNumber : '')) : place.formatted_address || '';

                return getLatLng(place).then(({ lat, lng }) => ({ lat, lng, street, city, province }));
            })
            .then(({ lat, lng, street, city, province }) => {
                setPostForm(prev => ({
                    ...prev,
                    actividadAddress:{
                        ...prev.actividadAddress,
                        street,
                        city,
                        province,
                        coordinates: { lat, lng }
                    }
                }));
            })
            .catch(err => console.error('Address lookup error', err));
        }

    },[address, setPostForm])

    return (
        <Wrapper>
            <GooglePlacesAutocomplete
                apiKey = {process.env.REACT_APP_GOOGLE_MAP_API_KEY}
                apiOptions={{ language: 'es', region: 'es' }}
                selectProps={{
                    value: address,
                    onChange: setaddress,
                    placeholder: 'Buscar dirección...',
                    noOptionsMessage: () => 'Sin opciones',
                    isSearchable: true,
                    isClearable: true,
                }}
                onLoadFailed={(error) => (
                    console.error("Could not inject Google script", error)
                )}
            />
        </Wrapper>
    );

}

const Wrapper = styled.div`
color: black;
`;
export default AddressSearchBox