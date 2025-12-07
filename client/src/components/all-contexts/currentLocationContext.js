import React, { useState, createContext, useEffect } from "react";

export const CurrentUserLocation = createContext(null);
export const CurrentUserLocationProvider = ({children}) => {

    const [ currentLocation, setCurrentLocation ] = useState(null);
    const [ locationAllowed, setLocationAllowed ] = useState(null);

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition( (position) => {
            setCurrentLocation({
                lat:position.coords.latitude,
                lng:position.coords.longitude
            });
            setLocationAllowed(true);
        }, (err) => {
            // User denied or error obtaining location
            setLocationAllowed(false);
            console.warn('Geolocation error or denied:', err && err.message);
        });
    },[]);

    const requestLocation = () => {
        navigator.geolocation.getCurrentPosition( (position) => {
            setCurrentLocation({
                lat:position.coords.latitude,
                lng:position.coords.longitude
            });
            setLocationAllowed(true);
        }, (err) => {
            console.warn('Geolocation request failed:', err && err.message);
            // If browser geolocation is denied or fails, try IP-based fallback
            fetch('https://ipapi.co/json/')
                .then(res => {
                    if (!res.ok) throw new Error('IP lookup failed');
                    return res.json();
                })
                .then(data => {
                    if (data && data.latitude && data.longitude) {
                        setCurrentLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
                        setLocationAllowed(true);
                    } else if (data && data.lat && data.lon) {
                        setCurrentLocation({ lat: parseFloat(data.lat), lng: parseFloat(data.lon) });
                        setLocationAllowed(true);
                    } else {
                        setLocationAllowed(false);
                    }
                })
                .catch(ipErr => {
                    console.warn('IP geolocation fallback failed:', ipErr && ipErr.message);
                    setLocationAllowed(false);
                });
        });
    };

    const getDistance = (pos1, pos2) => {
        // Guard against missing positions
        if (!pos1 || !pos2 || pos1.lat == null || pos1.lng == null || pos2.lat == null || pos2.lng == null) {
            return 999999; // very large distance so that unknown locations sort to the end
        }
        // Code source: https://www.geodatasource.com/resources/tutorials/how-to-calculate-the-distance-between-2-locations-using-javascript/
        if ((pos1.lat ===  pos2.lat) && (pos1.lng === pos2.lng)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * pos1.lat/180;
            var radlat2 = Math.PI * pos2.lat/180;
            var theta = pos1.lng -pos2.lng;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344;

            return dist.toFixed(2);
        }
    };

    return(
        <CurrentUserLocation.Provider
            value = {{
                currentLocation,
                getDistance,
                requestLocation,
                locationAllowed
            }}
        >
            {children}
        </CurrentUserLocation.Provider>
    )
}