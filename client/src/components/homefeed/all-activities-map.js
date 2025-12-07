import React, { useCallback, useRef, useState, useContext } from "react";
import styled, { keyframes } from "styled-components";
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "./map-management/mapStyles.js";
import InfoWindowContent from "./map-management/InfoWindowContent.js";
import greenMarker from '../assets/greenMarker.png';
import currentLocationImg from '../assets/currentLocationImg.png'; 
import CurrentLocationButton from "./map-management/currentLocation.js";
import { CurrentUserLocation } from "../all-contexts/currentLocationContext.js";

const Map = ({ postsData, postDataStatus }) => {

    const [selected, setSelected] = useState(null);
    const { currentLocation } = useContext(CurrentUserLocation);

    // importar las librerías de places
    const libraries = ["places"];

    // Para evitar el re-renderizado del mapa
    const mapRef = useRef();
    const onMapLoad = useCallback((map) => {
        mapRef.current = map;
    }, []);

    // Función PanTo que lleva al usuario a la ubicación proporcionada en el mapa
    // ej: si pasas lat y lng a panTo, el mapa te llevará a esa ubicación
    const panTo = useCallback( ({ lat, lng })=>{
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(11);
    },[])

    // Aplicar algunos estilos al mapa
    const options = {
        styles: mapStyles,
        disableDefaultUI: true,
        zoomControl: true,
    };

    // Establece el ancho y alto del componente del mapa
    const mapContainerStyle = {
        width: "100%",
        height: "100%",
    };

    // Especificar el centro del mapa cuando el mapa se carga
    const center = currentLocation;

    

    // Proporcionar la clave API para usar Google maps y librerías
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
        libraries,

    });

    if (loadError) return <div>Error loading Maps</div>;
    if (!isLoaded) return <div>Loading Maps</div>;

    return (
        <Wrapper>
            <Title>Partidazo</Title>
            <CurrentLocationButton panTo = { panTo }/>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={11}
                center={center}
                options={options}
                onLoad={onMapLoad}
            >
                {postDataStatus !== "loading" && (
                    <>
                        <Marker
                                    key={Math.random()*10000}
                                    position={currentLocation}
                                    icon = {{
                                        url: currentLocationImg,
                                        scaledSize: new window.google.maps.Size(35,35)
                                    }}
                        />
                        
                        {postsData
                            .filter(post => post.actividadAddress && post.actividadAddress.coordinates)
                            .map((post) => {
                            return (
                                <Marker
                                    key={post._id}
                                    position={{
                                        lat: post.actividadAddress.coordinates.lat,
                                        lng: post.actividadAddress.coordinates.lng,
                                    }}
                                    icon = {{
                                        url: greenMarker,
                                        scaledSize: new window.google.maps.Size(35,50)
                                    }}
                                    onClick={() => {
                                        setSelected(post);
                                    }}
                                    animation={window.google.maps.Animation.DROP}
                                />
                            );
                        })}
                    </>
                )}

                {selected && selected.actividadAddress && selected.actividadAddress.coordinates ?
                    <InfoWindow 
                        position={{
                            lat: selected.actividadAddress.coordinates.lat,
                            lng: selected.actividadAddress.coordinates.lng,
                        }}
                        onCloseClick = {()=> setSelected(null)}
                    >
                        <InfoWindowContent selected= {selected} />
                    </InfoWindow>
                : 
                    null
                }
            </GoogleMap>
        </Wrapper>
    );
};

const PuffInCenter = keyframes`
    0% {
        -webkit-transform: scale(2);
                transform: scale(2);
        -webkit-filter: blur(4px);
                filter: blur(4px);
        opacity: 0;
    }
    100% {
        -webkit-transform: scale(1);
                transform: scale(1);
        -webkit-filter: blur(0px);
                filter: blur(0px);
        opacity: 1;
    }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc( 100% - 50px - 40px );
  animation: ${PuffInCenter} 0.4s both;
`;

const Title = styled.h1`
  position: absolute;
  padding: 10px;
  font-size: 1.3em;
  margin: 5px;
  z-index: 5;
  color: #293241;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
`;

export default Map;

