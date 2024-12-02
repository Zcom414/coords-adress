import {getCoords} from './geolocation.js';
import {getAddressFromCoords, getCoordsFromAddress} from './addressApi.js';
import {getNearestCinemas} from './cinemaApi.js';

const elements = {
    geolocationButton: document.querySelector('#geolocation-btn'),
    addressInput: document.querySelector('#address'),
    distanceInput: document.querySelector('#distance'),
    searchForm: document.querySelector('#search-form'),
    cinemaList: document.querySelector('#cinema-list'),
    alertError: document.querySelector('#alert')
};

elements.geolocationButton.addEventListener('click', () => {
    // Lorsque l'on clique sur le bouton de géolocalisation
    // On veut récupérer les coordonnées GPS de l'utilisateur
    // et mettre à jour le champ adresse
    getCoords().then(coords => getAddressFromCoords(coords)).then(address => {
        elements.addressInput.value = address;
    }).catch(error => {
        elements.alertError.removeAttribute('hidden');
        elements.alertError.textContent = error.message;
    });
});

elements.searchForm.addEventListener('submit', (e) => {
    // Lorsque l'on soumet le formulaire de recherche
    // On récupère les coordonnées correspondantes à l'adresse saisie
    e.preventDefault();
    
    try {
        if (elements.addressInput.value.length == 0) {
            throw Error("Field {address} cannot be empty");
        }
        
        getCoordsFromAddress(elements.addressInput.value).then(coords => getNearestCinemas(coords, 10)).then(response => {
            elements.cinemaList.innerHTML = response.results.map(cinema => {
                return `<li>${cinema.nom} - ${cinema.adresse}, ${cinema.commune}</li>`
            }).join('');
        }).catch(error => {
            elements.alertError.removeAttribute('hidden');
            elements.alertError.textContent = error.message;
        });
    } catch (error) {
        elements.alertError.removeAttribute('hidden');
        elements.alertError.textContent = error.message;
    }
});