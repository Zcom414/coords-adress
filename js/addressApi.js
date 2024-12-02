const baseUrl = 'https://api-adresse.data.gouv.fr';

/**
 * Récupère une adresse à partir de coordonnées GPS
 * 
 * @param {object} coords
 * @return {Promise}
 */
export function getAddressFromCoords(coords) {
    const queryString = new URLSearchParams({
        lon: coords.longitude,
        lat: coords.latitude
    });
    
    return fetch(`${baseUrl}/reverse/?${queryString}`).then(response => response.json()).then(response => {
        if (response.features.length == 0) {
            throw new Error("No matching address for these coordinates");
        }  
        
        return response.features[0].properties.label;
    });
}

export function getCoordsFromAddress(address) {
    const queryString = new URLSearchParams({
        q: address
    });
    
    return fetch(`${baseUrl}/search/?${queryString}`).then(response => response.json()).then(response => {
        if (response.features.length == 0) {
            throw new Error("No coordinates found for this address");
        }
        
        const [longitude, latitude] = response.features[0].geometry.coordinates;
        
        return {longitude, latitude};
    });
}